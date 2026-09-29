#!/usr/bin/env python3
import os
import subprocess
import struct
import shutil
import plistlib

WORKSPACE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
IMAGES_DIR = os.path.join(WORKSPACE_DIR, "assets", "images")
ADMIN_DIR = os.path.join(WORKSPACE_DIR, "admin")
DESKTOP_DIR = os.path.expanduser("~/Desktop")
APPS_BACKUP_DIR = os.path.join(WORKSPACE_DIR, "apps")

def run(cmd, cwd=None):
    res = subprocess.run(cmd, shell=True, cwd=cwd or WORKSPACE_DIR, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Error running: {cmd}\nStderr: {res.stderr}")
        raise RuntimeError(res.stderr)
    return res.stdout

def create_ico(png_files_with_sizes, output_ico_path):
    """
    png_files_with_sizes: list of tuples (size_int, png_path)
    Creates standard Windows/Web ICO embedding PNG streams
    """
    num_images = len(png_files_with_sizes)
    header = struct.pack("<HHH", 0, 1, num_images)
    entries = []
    image_data_list = []
    
    offset = 6 + 16 * num_images
    for size, path in png_files_with_sizes:
        with open(path, "rb") as f:
            data = f.read()
        image_data_list.append(data)
        width = 0 if size >= 256 else size
        height = 0 if size >= 256 else size
        color_count = 0
        reserved = 0
        planes = 1
        bpp = 32
        bytes_in_res = len(data)
        
        entry = struct.pack("<BBBBHHII", width, height, color_count, reserved, planes, bpp, bytes_in_res, offset)
        entries.append(entry)
        offset += bytes_in_res
        
    with open(output_ico_path, "wb") as f:
        f.write(header)
        for e in entries:
            f.write(e)
        for d in image_data_list:
            f.write(d)
    print(f"Created ICO: {output_ico_path}")

def generate_sizes(src_512, prefix, target_dir):
    sizes = [16, 32, 48, 64, 128, 180, 192, 256]
    generated = {}
    for s in sizes:
        out_name = f"{prefix}-{s}x{s}.png" if s not in [180, 192] else (f"apple-touch-icon.png" if s == 180 and prefix == "favicon" else (f"admin-apple-touch-icon.png" if s == 180 else (f"icon-192.png" if prefix == "favicon" else f"admin-icon-192.png")))
        out_path = os.path.join(target_dir, out_name)
        cmd = f"sips -z {s} {s} '{src_512}' --out '{out_path}'"
        run(cmd)
        generated[s] = out_path
    return generated

def make_icns(src_512, out_icns_path):
    iconset_dir = out_icns_path.replace(".icns", ".iconset")
    os.makedirs(iconset_dir, exist_ok=True)
    
    icon_specs = [
        (16, "icon_16x16.png"),
        (32, "icon_16x16@2x.png"),
        (32, "icon_32x32.png"),
        (64, "icon_32x32@2x.png"),
        (128, "icon_128x128.png"),
        (256, "icon_128x128@2x.png"),
        (256, "icon_256x256.png"),
        (512, "icon_256x256@2x.png"),
        (512, "icon_512x512.png")
    ]
    for sz, name in icon_specs:
        target = os.path.join(iconset_dir, name)
        run(f"sips -z {sz} {sz} '{src_512}' --out '{target}'")
    
    run(f"iconutil -c icns '{iconset_dir}' -o '{out_icns_path}'")
    shutil.rmtree(iconset_dir)
    print(f"Created ICNS: {out_icns_path}")

def build_macos_app(app_name, url, icns_path, output_dirs):
    for out_dir in output_dirs:
        os.makedirs(out_dir, exist_ok=True)
        bundle_path = os.path.join(out_dir, f"{app_name}.app")
        if os.path.exists(bundle_path):
            shutil.rmtree(bundle_path)
        
        contents_dir = os.path.join(bundle_path, "Contents")
        macos_dir = os.path.join(contents_dir, "MacOS")
        resources_dir = os.path.join(contents_dir, "Resources")
        os.makedirs(macos_dir, exist_ok=True)
        os.makedirs(resources_dir, exist_ok=True)
        
        # Copy icns
        shutil.copy(icns_path, os.path.join(resources_dir, "appIcon.icns"))
        
        # Executable launcher script
        exec_name = app_name.replace(" ", "_")
        exec_path = os.path.join(macos_dir, exec_name)
        script_content = f"""#!/bin/bash
# Launcher for {app_name} via Google Chrome standalone mode
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
TARGET_URL="{url}"

if [ -f "$CHROME_PATH" ]; then
    exec "$CHROME_PATH" --app="$TARGET_URL" "$@"
else
    # Fallback to default open with Chrome if available
    open -a "Google Chrome" --args --app="$TARGET_URL" || open "$TARGET_URL"
fi
"""
        with open(exec_path, "w", encoding="utf-8") as f:
            f.write(script_content)
        os.chmod(exec_path, 0o755)
        
        # Info.plist
        bundle_id = "org.iaparaseniors." + app_name.lower().replace(" ", "")
        info_plist = {
            "CFBundleExecutable": exec_name,
            "CFBundleIconFile": "appIcon",
            "CFBundleIdentifier": bundle_id,
            "CFBundleName": app_name,
            "CFBundleDisplayName": app_name,
            "CFBundlePackageType": "APPL",
            "CFBundleShortVersionString": "1.0",
            "CFBundleVersion": "1",
            "LSMinimumSystemVersion": "10.13",
            "NSHighResolutionCapable": True,
            "LSUIElement": False
        }
        with open(os.path.join(contents_dir, "Info.plist"), "wb") as f:
            plistlib.dump(info_plist, f)
            
        print(f"Built macOS App: {bundle_path}")

def main():
    web_512 = os.path.join(IMAGES_DIR, "icon-512.png")
    admin_512 = os.path.join(IMAGES_DIR, "admin-icon-512.png")
    
    print("1. Generating web favicons and icons...")
    web_icons = generate_sizes(web_512, "favicon", IMAGES_DIR)
    
    print("2. Generating admin favicons and icons...")
    admin_icons = generate_sizes(admin_512, "admin-favicon", IMAGES_DIR)
    
    print("3. Generating .ico files...")
    # Root favicon.ico
    create_ico([(16, web_icons[16]), (32, web_icons[32]), (48, web_icons[48])], os.path.join(WORKSPACE_DIR, "favicon.ico"))
    # Also in assets/images/favicon.ico
    create_ico([(16, web_icons[16]), (32, web_icons[32]), (48, web_icons[48])], os.path.join(IMAGES_DIR, "favicon.ico"))
    
    # Admin favicon.ico
    create_ico([(16, admin_icons[16]), (32, admin_icons[32]), (48, admin_icons[48])], os.path.join(ADMIN_DIR, "favicon.ico"))
    create_ico([(16, admin_icons[16]), (32, admin_icons[32]), (48, admin_icons[48])], os.path.join(IMAGES_DIR, "admin-favicon.ico"))
    
    print("4. Generating macOS ICNS icons...")
    web_icns = os.path.join(IMAGES_DIR, "IAparaseniors.icns")
    admin_icns = os.path.join(IMAGES_DIR, "IAparaseniors_Admin.icns")
    make_icns(web_512, web_icns)
    make_icns(admin_512, admin_icns)
    
    print("5. Generating macOS Chrome shortcuts (.app bundles)...")
    target_dirs = [DESKTOP_DIR, APPS_BACKUP_DIR]
    
    build_macos_app("IAparaseniors", "https://iaparaseniors.org", web_icns, target_dirs)
    build_macos_app("IAparaseniors Admin", "https://iaparaseniors.org/admin", admin_icns, target_dirs)
    
    print("Done! All assets and desktop apps generated successfully.")

if __name__ == "__main__":
    main()
