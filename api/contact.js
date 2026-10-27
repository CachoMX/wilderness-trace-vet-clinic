export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let body = req.body || {};
    if (typeof body === 'string') {
      const params = new URLSearchParams(body);
      body = Object.fromEntries(params.entries());
    }

    // Honeypot check
    if (body._gotcha && String(body._gotcha).trim() !== '') {
      res.writeHead(303, { Location: '/thank-you/?form=submitted' });
      return res.end();
    }

    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim();
    const phone = String(body.phone || '').trim();
    const petName = String(body.pet_name || 'Not specified').trim();
    const service = String(body.service || 'General Inquiry').trim();
    const message = String(body.message || '').trim();

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields (name, email, message).' });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL || 'wtvcreception@gmail.com';
    const fromEmail = process.env.CONTACT_FROM_EMAIL || 'Wilderness Trace Veterinary Clinic <onboarding@resend.dev>';

    if (resendApiKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          reply_to: email,
          subject: `New Website Inquiry from ${name} (${service})`,
          html: `
            <h2>New Contact Form Submission — Wilderness Trace Veterinary Clinic</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Pet Name &amp; Species:</strong> ${petName}</p>
            <p><strong>Reason for Inquiry:</strong> ${service}</p>
            <hr />
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br/>')}</p>
          `
        })
      });
    }

    res.writeHead(303, { Location: '/thank-you/?form=submitted' });
    return res.end();
  } catch (err) {
    console.error('Contact form handler error:', err);
    res.writeHead(303, { Location: '/thank-you/?form=submitted' });
    return res.end();
  }
}
