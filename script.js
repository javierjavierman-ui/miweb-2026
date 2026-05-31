/* =====================================================
   | JAVASCRIPT - IAparaseniors                          |
   | Landing Page Scripts con Supabase                   |
   ===================================================== */

document.addEventListener('DOMContentLoaded', async () => {
    
    // Cargar Eventos Dinámicos
    async function loadEvents() {
        const container = document.getElementById('eventos-container');
        if (!container) return;

        const { data, error } = await supabaseClient
            .from('events')
            .select('*')
            .eq('published', true)
            .order('event_date', { ascending: true })
            .limit(4);

        if (error) {
            console.error("Error al cargar eventos:", error);
            return;
        }

        if (data.length === 0) {
            container.innerHTML = '<p class="col-span-full text-center text-gray-500">Próximamente publicaremos nuevos eventos.</p>';
            return;
        }

        container.innerHTML = data.map(ev => {
            const date = new Date(ev.event_date);
            const month = date.toLocaleString('es-ES', { month: 'short' }).toUpperCase();
            const day = date.getDate();
            const statusClass = ev.registration_open ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600';
            const statusText = ev.registration_open ? 'Próximo' : 'Próximamente';

            return `
            <div class="bg-white rounded-2xl p-6 shadow-md border border-gray-100 card-hover flex gap-4 ${ev.registration_open ? '' : 'opacity-70'}">
                <div class="${ev.registration_open ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'} rounded-xl p-4 flex flex-col items-center justify-center min-w-[80px]">
                    <span class="text-sm font-bold uppercase">${month}</span>
                    <span class="text-2xl font-black">${day}</span>
                </div>
                <div>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">${ev.title}</h3>
                    <p class="text-gray-600 text-sm mb-3">${ev.description || ''}</p>
                    <span class="inline-block px-3 py-1 border border-gray-100 text-xs font-bold rounded-full ${statusClass}">${statusText}</span>
                </div>
            </div>`;
        }).join('');
    }

    // Cargar Contenidos Dinámicos — distribuye por tipología a cada sección
    async function loadContents() {
        const docsContainer    = document.getElementById('documentos-container');
        const videosContainer  = document.getElementById('videos-container');
        const novedadesContainer = document.getElementById('novedades-container');
        const trucosContainer  = document.getElementById('trucos-container');

        const { data, error } = await supabaseClient
            .from('contents')
            .select('*')
            .eq('published', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error al cargar contenidos:", error);
            return;
        }

        // Normaliza el tipo para comparaciones robustas
        const type = (c) => (c.content_type || '').toLowerCase().trim();

        const misCharlas   = data.filter(c => type(c) === 'mis charlas');
        const videos       = data.filter(c => type(c) === 'vídeos tutoriales' || type(c) === 'videos tutoriales' || type(c) === 'vídeo' || type(c) === 'video');
        const novedades    = data.filter(c => type(c) === 'novedades y actualizaciones');
        const trucos       = data.filter(c => type(c) === 'trucos');

        // ── Mis Charlas → #documentos-container ─────────────────────
        if (docsContainer) {
            const staticItems = Array.from(docsContainer.querySelectorAll('[data-static]'));
            const dynamicHTML = misCharlas.map(doc => `
                <li class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center card-hover">
                    <span class="font-medium text-gray-700">${doc.title}</span>
                    <a href="${doc.youtube_url || doc.file_url || '#'}" target="_blank"
                       class="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition">Ver</a>
                </li>
            `).join('');
            if (dynamicHTML) {
                docsContainer.innerHTML = staticItems.map(el => el.outerHTML).join('') + dynamicHTML;
            }
        }

        // ── Vídeos tutoriales → #videos-container ────────────────────
        const loadingEl = document.getElementById('videos-loading');
        if (loadingEl) loadingEl.remove();

        if (videosContainer) {
            const staticVideoItems = Array.from(videosContainer.querySelectorAll('[data-static]'));
            if (videos.length > 0) {
                const dynamicVideosHTML = videos.map(vid => `
                    <li class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 card-hover flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h4 class="font-bold text-gray-800">${vid.title}</h4>
                            <p class="text-xs text-gray-500 mt-1">${vid.summary || ''}</p>
                        </div>
                        <a href="${vid.youtube_url || '#'}" target="_blank"
                           class="shrink-0 px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition flex items-center gap-2">
                            <i class="fab fa-youtube"></i> Ver Video
                        </a>
                    </li>
                `).join('');
                videosContainer.innerHTML = staticVideoItems.map(el => el.outerHTML).join('') + dynamicVideosHTML;
            } else if (staticVideoItems.length === 0) {
                videosContainer.innerHTML = '<li class="text-center text-gray-400 py-6"><i class="fas fa-video-slash mr-2"></i>Próximamente publicaremos nuevos videos.</li>';
            }
        }

        // ── Novedades y actualizaciones → #novedades-container ───────
        if (novedadesContainer && novedades.length > 0) {
            const dynamicNovedadesHTML = novedades.map(n => `
                <li class="p-4 bg-gray-50 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
                    <span class="font-medium text-gray-800 flex items-center gap-3">
                        <i class="fas fa-star text-yellow-400 text-xl"></i>
                        ${n.title}
                    </span>
                    <a href="${n.youtube_url || n.file_url || '#'}" target="_blank"
                       class="px-5 py-2 bg-blue-600 text-white text-sm font-bold rounded-full hover:bg-blue-700 transition">
                       ${n.youtube_url ? 'Ver vídeo' : 'Ver'}
                    </a>
                </li>
            `).join('');
            novedadesContainer.innerHTML += dynamicNovedadesHTML;
        }

        // ── Trucos → #trucos-container ───────────────────────────────
        if (trucosContainer && trucos.length > 0) {
            const dynamicTrucosHTML = trucos.map(t => `
                <li class="bg-white rounded-xl px-5 py-4 border border-blue-100 shadow-sm card-hover flex items-center gap-3">
                    <i class="fas fa-lightbulb text-blue-400 text-lg"></i>
                    <a href="${t.youtube_url || t.file_url || '#'}" target="_blank"
                       class="font-semibold text-blue-700 hover:text-blue-900 hover:underline transition">${t.title}</a>
                </li>
            `).join('');
            trucosContainer.innerHTML += dynamicTrucosHTML;
        }
    }


    // Manejar Formulario de Contacto
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('contact-submit');
            const msg = document.getElementById('contact-msg');
            
            const name = contactForm.elements['Nombre'].value;
            const subject = contactForm.elements['Asunto'].value;
            const message = contactForm.elements['Mensaje'].value;
            // Solicitar email al usuario, lo hemos quitado del form original mailto, vamos a buscar si hay un campo de email
            // Como el HTML original no tenía campo de email, usamos un correo anónimo temporal si no hay, o avisamos.
            let email = contactForm.elements['Email'] ? contactForm.elements['Email'].value : 'anonimo@web.com';
            
            btn.disabled = true;
            btn.textContent = 'Enviando...';
            msg.style.display = 'none';

            const { error } = await supabaseClient.from('contact_messages').insert([
                { name, email, subject, message }
            ]);

            btn.disabled = false;
            btn.textContent = 'Enviar Mensaje';
            msg.style.display = 'block';

            if (error) {
                msg.style.color = '#ef4444';
                msg.textContent = 'Hubo un error al enviar el mensaje. Por favor, inténtalo más tarde.';
                console.error(error);
            } else {
                msg.style.color = '#22c55e';
                msg.textContent = '¡Mensaje enviado con éxito! Te responderemos pronto.';
                contactForm.reset();

                // T8: Enviar email de respuesta automática al usuario
                try {
                    await fetch('/api/brevo', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            toEmail: email,
                            toName: name,
                            subject: 'Gracias por contactar con IA para Seniors',
                            senderName: 'IAparaseniors.org',
                            htmlContent: `Querido amigo:<br><br>IA para Seniors te agradece tu sugerencia. Pronto tendrás noticias nuestras al respecto.<br><br>Recibe un cordial saludo y continúa siguiéndonos.<br><br>Firmado: IAparaseniors.org`
                        })
                    });
                } catch (emailErr) {
                    console.warn('No se pudo enviar el email de confirmación:', emailErr);
                }
            }
        });
    }

    // Inicializar cargas
    loadEvents();
    loadContents();
});
