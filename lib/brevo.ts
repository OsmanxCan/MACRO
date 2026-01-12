export async function sendEmailWithBrevo(
  to: string,
  confirmUrl: string
) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY!,
    },
    body: JSON.stringify({
      sender: {
        name: "Kulup Yönetimi",
        email: "no-reply@ocbstd.com",
      },
      to: [{ email: to }],
      subject: "Email adresini doğrula",
      htmlContent: `
        <h2>Hesabın oluşturuldu</h2>
        <p>Devam etmek için email adresini doğrula:</p>
        <a href="${confirmUrl}" target="_blank">
          Email doğrula
        </a>
      `,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error("Brevo email gönderilemedi: " + err)
  }
}
