const SUPABASE_URL = 'https://uvsvyelbhjhenufndbcw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2c3Z5ZWxiaGpoZW51Zm5kYmN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3ODY0OTYsImV4cCI6MjA5MjM2MjQ5Nn0.xwrQbQZ9rtnJwszQtcYXaAebn0CIm_V29_FiwFoWw-s';

window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('credentials-form');
    
    verificarSesionAdmin();

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = form.username.value.trim();
            const password = form.password.value;

            // CASO 1: ALUMNOS
            if (username === "Alumni" && password === "Alumni26") {
                mostrarPanelPrincipal(false);
                if (typeof showPage === 'function') showPage('page-inicio');
            } 
            // CASO 2: ADMINISTRADOR
            else if (username.includes('@')) {
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerText;
                submitBtn.innerText = 'Verificando...';
                submitBtn.disabled = true;

                try {
                    const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                        email: username,
                        password: password,
                    });

                    if (error) throw error;
                    
                    mostrarPanelPrincipal(true);
                    if (typeof showPage === 'function') showPage('page-inicio');
                    
                } catch (err) {
                    alert("Acceso denegado. Credenciales de administrador incorrectas.");
                } finally {
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                }
            } else {
                alert("Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.");
            }
            form.reset();
        });
    }
});

function mostrarPanelPrincipal(esAdmin) {
    const loginForm = document.getElementById("login-form");
    const mainContent = document.getElementById("main-content");
    
    if (loginForm) loginForm.style.display = "none";
    if (mainContent) mainContent.style.display = "block";
    
    // Ocultar/Mostrar elementos exclusivos de admin
    const adminElements = document.querySelectorAll('.admin-only');
    adminElements.forEach(el => {
        el.style.display = esAdmin ? '' : 'none'; // '' removes inline display block/none
    });
}

async function verificarSesionAdmin() {
    try {
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        if (session) {
            mostrarPanelPrincipal(true);
        }
    } catch(e) {}
}

window.cerrarSesion = async function () {
    await window.supabaseClient.auth.signOut();
    
    const loginForm = document.getElementById("login-form");
    const mainContent = document.getElementById("main-content");

    if (loginForm) loginForm.style.display = "flex";
    if (mainContent) mainContent.style.display = "none";

    const form = document.getElementById('credentials-form');
    if (form) form.reset();
}
