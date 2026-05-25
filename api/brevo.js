export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { toEmail, toName, subject, htmlContent, senderName } = req.body;
  const BREVO_API_KEY = process.env.BREVO_API_KEY;

  if (!BREVO_API_KEY) {
    return res.status(500).json({ message: 'La API Key de Brevo no está configurada en el servidor' });
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
      const errorData = await response.json();
      return res.status(response.status).json({ message: errorData.message || 'Error en Brevo API' });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor al enviar email' });
  }
}
