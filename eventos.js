// Usar el cliente global de Supabase ya inicializado en auth.js
const supabase = window.supabaseClient;

// Referencias DOM
const tbodyEventos = document.getElementById('tbody-eventos');
const formEvento = document.getElementById('form-evento');
const modalEventoTitle = document.getElementById('modal-evento-title');
const inputId = document.getElementById('evento-id');
const inputTitulo = document.getElementById('evento-titulo');
const inputFecha = document.getElementById('evento-fecha');
const inputDesc = document.getElementById('evento-descripcion');
const inputEstado = document.getElementById('evento-estado');

/**
 * Cargar eventos desde Supabase
 */
async function cargarEventos() {
    if (!tbodyEventos) return;
    
    tbodyEventos.innerHTML = '<tr><td colspan="5" style="text-align: center;">Cargando eventos...</td></tr>';
    
    try {
        const { data, error } = await supabase
            .from('eventos')
            .select('*')
            .order('fecha', { ascending: false });

        if (error) throw error;
        
        mostrarEventos(data);
    } catch (error) {
        console.error('Error al cargar eventos:', error.message);
        tbodyEventos.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--accent-red);">Error al cargar los eventos. Verifica la configuración de Supabase.</td></tr>';
    }
}

/**
 * Renderizar la tabla de eventos
 */
function mostrarEventos(eventos) {
    if (!eventos || eventos.length === 0) {
        tbodyEventos.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay eventos registrados.</td></tr>';
        return;
    }

    tbodyEventos.innerHTML = '';
    
    eventos.forEach(evento => {
        const tr = document.createElement('tr');
        
        const fechaFormat = new Date(evento.fecha).toLocaleDateString('es-ES');
        const estadoClase = evento.estado === 'publicado' ? 'publicado' : 'borrador';
        
        tr.innerHTML = `
            <td style="font-weight: 600;">${evento.titulo}</td>
            <td>${fechaFormat}</td>
            <td style="max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${evento.descripcion}">${evento.descripcion}</td>
            <td><span class="badge ${estadoClase}">${evento.estado}</span></td>
            <td>
                <button class="action-btn edit" onclick="editarEvento(${evento.id})" title="Editar"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete" onclick="borrarEvento(${evento.id})" title="Eliminar"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        tbodyEventos.appendChild(tr);
    });
}

/**
 * Abrir Modal para Nuevo Evento
 */
window.abrirModalEvento = function() {
    formEvento.reset();
    inputId.value = '';
    modalEventoTitle.textContent = 'Nuevo Evento';
    toggleModal('modal-evento');
};

/**
 * Cargar datos de un evento para Editar
 */
window.editarEvento = async function(id) {
    try {
        const { data, error } = await supabase
            .from('eventos')
            .select('*')
            .eq('id', id)
            .single();
            
        if (error) throw error;
        
        inputId.value = data.id;
        inputTitulo.value = data.titulo;
        inputFecha.value = data.fecha; 
        inputDesc.value = data.descripcion;
        inputEstado.value = data.estado;
        
        modalEventoTitle.textContent = 'Editar Evento';
        toggleModal('modal-evento');
        
    } catch (error) {
        console.error('Error al obtener evento:', error.message);
        alert('No se pudo cargar el evento para editar.');
    }
};

/**
 * Guardar Evento (Insertar o Actualizar)
 */
window.guardarEvento = async function(event) {
    event.preventDefault();
    
    const id = inputId.value;
    const eventoData = {
        titulo: inputTitulo.value,
        fecha: inputFecha.value,
        descripcion: inputDesc.value,
        estado: inputEstado.value
    };
    
    try {
        if (id) {
            // Actualizar
            const { error } = await supabase
                .from('eventos')
                .update(eventoData)
                .eq('id', id);
                
            if (error) throw error;
        } else {
            // Insertar
            const { error } = await supabase
                .from('eventos')
                .insert([eventoData]);
                
            if (error) throw error;
        }
        
        toggleModal('modal-evento');
        cargarEventos();
        
    } catch (error) {
        console.error('Error al guardar evento:', error.message);
        alert('Hubo un error al guardar el evento. Verifica la consola.');
    }
};

/**
 * Borrar Evento
 */
window.borrarEvento = async function(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este evento?')) return;
    
    try {
        const { error } = await supabase
            .from('eventos')
            .delete()
            .eq('id', id);
            
        if (error) throw error;
        
        cargarEventos();
    } catch (error) {
        console.error('Error al eliminar evento:', error.message);
        alert('Hubo un error al eliminar el evento.');
    }
};

// Cargar eventos iniciales si estamos en la página
document.addEventListener('DOMContentLoaded', () => {
    // Escuchar clicks al botón de eventos en el dashboard
    const btnEventos = document.querySelector('.card-events');
    if(btnEventos) {
        btnEventos.addEventListener('click', () => {
            cargarEventos();
        });
    }
    
    setTimeout(cargarEventos, 500); 
});
