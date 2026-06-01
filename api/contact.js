const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || "bluephestechnology@gmail.com";
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "bluephestechnology@gmail.com";

function clean(value) {
  return String(value || "").trim();
}

function escapeHtml(value) {
  return clean(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatFromEmail(value) {
  const from = clean(value);

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from)) {
    return from;
  }

  if (/^.+\s<[^<>\s@]+@[^<>\s@]+\.[^<>\s@]+>$/.test(from)) {
    return from;
  }

  return "bluephestechnology@gmail.com";
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    return response.status(503).json({
      error: "Email service is not configured yet.",
    });
  }

  const name = clean(request.body?.name);
  const email = clean(request.body?.email);
  const phone = clean(request.body?.phone);
  const message = clean(request.body?.message);
  const website = clean(request.body?.website);

  if (website) {
    return response.status(200).json({ ok: true });
  }

  if (!email || !phone || !message) {
    return response.status(400).json({
      error: "Email, contact number, and message are required.",
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return response.status(400).json({
      error: "Enter a valid email address.",
    });
  }

  const safeName = escapeHtml(name || "Not provided");
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: formatFromEmail(CONTACT_FROM_EMAIL),
      to: CONTACT_TO_EMAIL,
      reply_to: email,
      subject: `New project idea from ${name || email}`,
      text: [
        `Name: ${name || "Not provided"}`,
        `Email: ${email}`,
        `Contact: ${phone}`,
        "",
        "Message:",
        message,
      ].join("\n"),
      html: `
        <h2>New project idea from Bluephes portfolio</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Contact:</strong> ${safePhone}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `,
    }),
  });

  if (!emailResponse.ok) {
    const errorBody = await emailResponse.json().catch(() => ({}));
    return response.status(502).json({
      error: errorBody?.message || "Message could not be sent right now.",
    });
  }

  return response.status(200).json({ ok: true });
}
