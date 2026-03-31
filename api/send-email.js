// Esta función se ejecutará en el servidor de Vercel (Node.js)
// NUNCA expongas claves sensibles aquí. Usa process.env.
import nodemailer from 'nodemailer';

// Configuración del destinatario final (la dirección solicitada)
const DESTINATION_EMAIL = "javier@iaparatodos.com.";

// La función principal que maneja la solicitud HTTP
export default async function handler(req, res) {
    // Solo permitimos solicitudes POST para enviar el formulario
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: 'Método no permitido. Use POST.' });
    }

    // 1. Cargar las variables de entorno de iCloud Mail
    const USERNAME = process.env.ICLOUD_EMAIL_USER;
    const APP_PASSWORD = process.env.ICLOUD_APP_PASSWORD;

    if (!USERNAME || !APP_PASSWORD) {
        console.error("Variables de entorno ICLOUD_EMAIL_USER o ICLOUD_APP_PASSWORD no configuradas.");
        // Devolvemos un error 503 Service Unavailable para indicar un problema de configuración
        return res.status(503).json({ success: false, message: "Error interno: El servicio de envío de correo no está configurado (Faltan variables de entorno)." });
    }

    try {
        // 2. Extraer datos del cuerpo de la solicitud (JSON del frontend)
        const { name, email, message } = req.body;

        // Validación básica de datos
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: "Faltan campos obligatorios." });
        }

        // 3. Configurar el transporter con los ajustes de Apple Mail / iCloud SMTP
        const transporter = nodemailer.createTransport({
            host: "smtp.mail.me.com", // Servidor SMTP de iCloud
            port: 587,
            secure: false, // El puerto 587 usa STARTTLS, por lo que 'secure' es false
            auth: {
                user: USERNAME, // Tu dirección de correo completa de iCloud
                pass: APP_PASSWORD, // La Contraseña Específica de Aplicación generada
            },
        });

        // 4. Configurar el correo a enviar
        const mailOptions = {
            from: `"${name} (Contacto IAparatodos)" <${USERNAME}>`, // El remitente DEBE ser la dirección de iCloud configurada
            to: DESTINATION_EMAIL,
            subject: `[IAparatodos] Nuevo mensaje de: ${name}`,
            text: `
                Nombre: ${name}
                Email: ${email}
                Mensaje:
                ---
                ${message}
                ---
            `,
            html: `
                <p><strong>Nombre:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Mensaje:</strong></p>
                <div style="border: 1px solid #ccc; padding: 10px; border-radius: 5px;">
                    ${message.replace(/\n/g, '<br>')}
                </div>
            `,
            replyTo: email, // Permite responder directamente al usuario
        };

        // 5. Enviar el correo
        await transporter.sendMail(mailOptions);
        
        // 6. Responder al frontend con éxito
        return res.status(200).json({ success: true, message: `Correo enviado exitosamente a ${DESTINATION_EMAIL}` });

    } catch (error) {
        console.error("Error al enviar el correo con iCloud:", error);
        return res.status(500).json({ success: false, message: "Error al procesar el envío del correo. (Verifica tu Contraseña Específica de Aplicación)." });
    }
}
