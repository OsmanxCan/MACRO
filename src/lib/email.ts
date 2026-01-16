// src/lib/email.ts
interface EmailPayload {
  to: string
  subject: string
  htmlContent: string
  templateId?: number
  params?: Record<string, any>
}

export async function sendEmail({ to, subject, htmlContent, templateId, params }: EmailPayload) {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY!
    },
    body: JSON.stringify({
      sender: { 
        email: process.env.BREVO_SENDER_EMAIL!, 
        name: 'MACRO Topluluğu' 
      },
      to: [{ email: to }],
      subject,
      htmlContent,
      templateId,
      params
    })
  })

  if (!response.ok) {
    throw new Error('Email gönderilemedi')
  }

  return response.json()
}

// Email template'leri
export const emailTemplates = {
  membershipReceived: (name: string) => ({
    subject: '📝 Üyelik Başvurunuz Alındı',
    htmlContent: `
      <h2>Merhaba ${name},</h2>
      <p>Üyelik başvurunuz başarıyla alınmıştır.</p>
      <p>Başvurunuz incelendikten sonra size bilgi vereceğiz.</p>
    `
  }),
  
  membershipApproved: (name: string) => ({
    subject: '✅ Üyelik Başvurunuz Onaylandı!',
    htmlContent: `
      <h2>Tebrikler ${name}!</h2>
      <p>Üyelik başvurunuz onaylandı. Artık topluluğumuzun bir parçasısınız!</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}">Giriş Yap</a>
    `
  }),
  
  membershipRejected: (name: string, reason?: string) => ({
    subject: '❌ Üyelik Başvurunuz Hakkında',
    htmlContent: `
      <h2>Merhaba ${name},</h2>
      <p>Üzgünüz, üyelik başvurunuz değerlendirilmiştir ve şu an için onaylanamamıştır.</p>
      ${reason ? `<p><strong>Sebep:</strong> ${reason}</p>` : ''}
      <p>Tekrar başvuruda bulunabilirsiniz.</p>
    `
  }),

  announcementNotification: (title: string, content: string) => ({
    subject: `📢 Yeni Duyuru: ${title}`,
    htmlContent: `
      <h2>${title}</h2>
      <p>${content}</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/duyurular">Tüm Duyurular</a>
    `
  }),

  eventNotification: (title: string, date: string, location: string) => ({
    subject: `🎉 Yeni Etkinlik: ${title}`,
    htmlContent: `
      <h2>${title}</h2>
      <p><strong>Tarih:</strong> ${date}</p>
      <p><strong>Yer:</strong> ${location}</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/etkinlikler">Detaylar</a>
    `
  })
}