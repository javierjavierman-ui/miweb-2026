export default async function handler(req, res) {
  let BREVO_API_KEY = process.env.BREVO_API_KEY;

  if (!BREVO_API_KEY) {
    return res.status(500).json({ message: 'La variable BREVO_API_KEY no está configurada en Vercel.' });
  }

  BREVO_API_KEY = BREVO_API_KEY.trim().replace(/^["']|["']$/g, '');

  if (req.method === 'GET') {
    try {
      const accRes = await fetch('https://api.brevo.com/v3/account', {
        headers: { 'accept': 'application/json', 'api-key': BREVO_API_KEY }
      });
      const accData = await accRes.json();
      return res.status(accRes.status).json({
        status: accRes.status,
        keyLength: BREVO_API_KEY.length,
        keyPrefix: BREVO_API_KEY.substring(0, 12),
        brevoResponse: accData
      });
    } catch(err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { toEmail, toName, subject, htmlContent, senderName } = req.body || {};

  if (BREVO_API_KEY.includes('*')) {
    return res.status(400).json({
      message: 'La API Key en Vercel está enmascarada con asteriscos (*). En Brevo debes generar una nueva clave y copiarla completa antes de cerrar la ventana.'
    });
  }

  if (!toEmail || !subject || !htmlContent) {
    return res.status(400).json({ message: 'Faltan campos obligatorios (destinatario, asunto o contenido).' });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: senderName || 'IAparaseniors', email: 'javier@iaparaseniors.org' },
        to: [{ email: toEmail, name: toName || toEmail }],
        subject: subject,
        htmlContent: htmlContent.replace(/\n/g, '<br>')
      })
    });

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch (_) {}

      let errorMsg = errorData.message || 'Error en Brevo API';
      if (response.status === 401 && errorMsg.includes('API Key is not enabled')) {
        errorMsg = 'Brevo indica que la clave API no está habilitada. Asegúrate de generar una "Clave de API" (API Key v3) en Brevo (SMTP & API -> Claves API) y no la contraseña SMTP, y de copiarla completa.';
      }
      return res.status(response.status).json({ message: errorMsg });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error en /api/brevo:', error);
    return res.status(500).json({ message: 'Error interno del servidor al conectar con Brevo: ' + error.message });
  }
}
