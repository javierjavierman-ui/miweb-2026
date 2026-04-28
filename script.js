/* =====================================================
   | JAVASCRIPT — IAparaseniors                        |
   | Navegación SPA, animaciones y utilidades          |
   ===================================================== */

const DESTINATION_EMAIL = "javier@iaparaseniors.org";

/**
 * Muestra una página específica y oculta las demás.
 * Añade animación fade-in al cambiar de sección.
 * @param {string} pageId - ID del elemento a mostrar
 */
function showPage(pageId) {
    const pages = document.querySelectorAll('.page-content');

    pages.forEach(page => {
        page.classList.add('hidden');
        page.classList.remove('fade-in');
    });

    const target = document.getElementById(pageId);
    if (target) {
        target.classList.remove('hidden');
        // Trigger reflow to restart animation
        void target.offsetWidth;
        target.classList.add('fade-in');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * Scroll suave hasta una sección por su ID
 * @param {string} sectionId - ID de la sección
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Alterna la visibilidad de un modal
 * @param {string} modalId - ID del modal
 */
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.toggle('hidden');
    document.body.style.overflow = modal.classList.contains('hidden') ? 'auto' : 'hidden';
}

/**
 * Maneja el envío del formulario de contacto (si existe)
 * @param {Event} event
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    const formMessage = document.getElementById('form-message');
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const message = document.getElementById('contact-message').value;

    formMessage.textContent = `Intentando enviar mensaje a ${DESTINATION_EMAIL}...`;
    formMessage.className = 'text-center font-bold p-3 rounded-lg bg-blue-100 text-blue-700 block';

    try {
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message }),
        });

        if (response.ok) {
            formMessage.textContent = `¡Mensaje enviado, ${name}! Tu consulta ha sido entregada a ${DESTINATION_EMAIL}.`;
            formMessage.className = 'text-center font-bold p-3 rounded-lg bg-green-100 text-green-700 block';
            document.getElementById('contact-form').reset();
        } else {
            formMessage.textContent = `⚠️ Error (código ${response.status}). Contacta a ${DESTINATION_EMAIL} directamente.`;
            formMessage.className = 'text-center font-bold p-3 rounded-lg bg-red-100 text-red-700 block';
        }
    } catch (error) {
        console.error('Error de red:', error);
        formMessage.textContent = `❌ Error de conexión. Usa el email: ${DESTINATION_EMAIL}`;
        formMessage.className = 'text-center font-bold p-3 rounded-lg bg-red-100 text-red-700 block';
    }
}

/**
 * Inicialización
 */
document.addEventListener('DOMContentLoaded', () => {
    showPage('page-inicio');
});
