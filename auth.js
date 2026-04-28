// ==========================================
// CONFIGURACIÓN DE SUPABASE
// ==========================================
// IMPORTANTE: Debes sustituir estas dos variables por los datos reales de tu proyecto.
// Entra en Supabase -> Project Settings -> API.
const SUPABASE_URL = 'https://uvsvyelbhjhenufndbcw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2c3Z5ZWxiaGpoZW51Zm5kYmN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3ODY0OTYsImV4cCI6MjA5MjM2MjQ5Nn0.xwrQbQZ9rtnJwszQtcYXaAebn0CIm_V29_FiwFoWw-s';

// Inicializa el cliente de Supabase
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('credentials-form');

    // 1. Al cargar la página, verificamos si el usuario ya tiene sesión inciada
    verificarSesion();

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = form.username.value.trim(); // Limpiamos espacios en blanco accidentales
            const password = form.password.value;

            // Extraemos el botón para cambiar su estado mientras cargamos
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Iniciando sesión...';
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-70', 'cursor-not-allowed');

            try {
                // 2. Intentar loguear al usuario en Supabase
                const { data, error } = await supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password,
                });

                if (error) {
                    throw error; // Capturamos el error para ir al bloque catch
                }

                // 3. Inicio de sesión exitoso. Mostrar el panel.
                mostrarPanelPrincipal();

            } catch (error) {
                console.error('Error de Supabase:', error.message);

                // Mostramos SIEMPRE el error exacto para saber qué está fallando
                alert("Atención, error de Supabase:\\n[" + error.name + "] " + error.message);

                form.reset();
            } finally {
                // Restauramos el botón a su estado normal
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
            }
        });
    }
});

// Función para mostrar el contenido principal cuando se está logueado
function mostrarPanelPrincipal() {
    const loginForm = document.getElementById("login-form");
    const mainContent = document.getElementById("main-content");

    if (loginForm) loginForm.style.display = "none";
    if (mainContent) mainContent.style.display = "block";
}

// Función para verificar si hay una sesión activa persistente 
async function verificarSesion() {
    try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        if (error) throw error;

        if (session) {
            // Ya está logueado
            mostrarPanelPrincipal();
        }
    } catch (e) {
        console.log("No hay sesión activa o Supabase no está configurado:", e.message);
    }
}

// Función global para cerrar sesión (asignada al botón "Cerrar Sesión")
window.cerrarSesion = async function () {
    try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;

        // Volver a mostrar el formulario de login y ocultar contenido
        document.getElementById("login-form").style.display = "block";
        document.getElementById("main-content").style.display = "none";

        const form = document.getElementById('credentials-form');
        if (form) form.reset();

    } catch (e) {
        console.error("Error al cerrar sesión:", e.message);
        alert("Hubo un error al cerrar sesión.");
    }
}
