document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('credentials-form');

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const username = form.username.value.trim();
            const password = form.password.value;

            if (username === "Alumni" && password === "Alumni26") {
                const loginForm = document.getElementById("login-form");
                const mainContent = document.getElementById("main-content");
                
                if (loginForm) loginForm.style.display = "none";
                if (mainContent) mainContent.style.display = "block";
                
                if (typeof showPage === 'function') {
                    showPage('page-inicio');
                }
            } else {
                alert("Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.");
                form.reset();
            }
        });
    }
});

window.cerrarSesion = function () {
    const loginForm = document.getElementById("login-form");
    const mainContent = document.getElementById("main-content");

    if (loginForm) loginForm.style.display = "flex";
    if (mainContent) mainContent.style.display = "none";

    const form = document.getElementById('credentials-form');
    if (form) form.reset();
}
