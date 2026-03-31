/* =====================================================
   | JAVASCRIPT - IAparatodos                          |
   | Lógica de navegación, modales y formulario       |
   ===================================================== */

// Email de destino (para mensajes de confirmación)
const DESTINATION_EMAIL = "javier@iaparatodos.com";

/**
 * Muestra una página específica y oculta las demás
 * Implementa navegación tipo SPA (Single Page Application)
 * @param {string} pageId - ID del elemento que se desea mostrar
 */
function showPage(pageId) {
    // Selecciona todas las páginas (secciones de contenido)
    const pages = document.querySelectorAll('.page-content');
    
    // Oculta todas las páginas
    pages.forEach(page => {
        page.classList.add('hidden');
    });
    
    // Muestra la página solicitada
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        // Scroll suave hacia el inicio de la página
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * Alterna la visibilidad de un modal
 * @param {string} modalId - ID del modal a mostrar/ocultar
 */
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.toggle('hidden');

    // Controla el scroll del body cuando el modal se abre o cierra
    if (!modal.classList.contains('hidden')) {
        // Modal está abierto: deshabilita el scroll del body
        document.body.style.overflow = 'hidden';
    } else {
        // Modal está cerrado: habilita el scroll del body
        document.body.style.overflow = 'auto';
    }
    
    // Si se abre el modal de contacto, resetea el formulario
    if (modalId === 'modal-contacto' && !modal.classList.contains('hidden')) {
        document.getElementById('contact-form').reset();
        document.getElementById('form-message').classList.add('hidden');
    }
}

/**
 * Maneja el envío del formulario de contacto
 * Nota: Requiere un endpoint backend (/api/send-email) para funcionar completamente
 * @param {Event} event - Evento del formulario
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const formMessage = document.getElementById('form-message');
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const message = document.getElementById('contact-message').value;
    
    // Mostrar mensaje de "Enviando"
    formMessage.textContent = `Intentando enviar mensaje a ${DESTINATION_EMAIL}...`;
    formMessage.className = 'text-center font-bold p-3 rounded-lg bg-blue-100 text-blue-700 block';
    
    // Preparar datos del formulario
    const formData = { name, email, message };
    
    try {
        // Llamada al API (requiere configuración de backend)
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        
        if (response.ok) {
            // Éxito
            const result = await response.json();
            formMessage.textContent = `¡Mensaje enviado, ${name}! Tu consulta ha sido entregada a ${DESTINATION_EMAIL}.`;
            formMessage.className = 'text-center font-bold p-3 rounded-lg bg-green-100 text-green-700 block';
            document.getElementById('contact-form').reset();
        } else {
            // Error del servidor
            formMessage.textContent = `⚠️ Error de Servicio (código ${response.status}). El formulario requiere un servicio backend. Contacta a ${DESTINATION_EMAIL} directamente.`;
            formMessage.className = 'text-center font-bold p-3 rounded-lg bg-red-100 text-red-700 block';
        }
        
    } catch (error) {
        // Error de red
        console.error('Error de red:', error);
        formMessage.textContent = `❌ Error de Conexión. Por favor, usa el email: ${DESTINATION_EMAIL}`;
        formMessage.className = 'text-center font-bold p-3 rounded-lg bg-red-100 text-red-700 block';
    }
}

/**
 * Inicialización al cargar la página
 * Asegura que solo se muestre la página de inicio
 */
document.addEventListener('DOMContentLoaded', () => {
    showPage('page-inicio');
    const importantNoticeBtn = document.getElementById('important-notice-btn');
    importantNoticeBtn.addEventListener('click', () => {
        alert('En breve cambiará la dirección de esta página web, que pasará a ser iaparaseniors.org');
    });
});
