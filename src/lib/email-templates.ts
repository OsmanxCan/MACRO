// lib/email-templates.ts
export const emailTemplates = {
  membershipReceived: (name: string) => ({
    subject: 'Üyelik Başvurunuz Alındı - MACRO Topluluğu',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Hoş Geldiniz!</h1>
          </div>
          <div class="content">
            <h2>Merhaba ${name},</h2>
            <p>Üyelik başvurunuz başarıyla alınmıştır. Topluluğumuza gösterdiğiniz ilgi için teşekkür ederiz!</p>
            
            <p><strong>Sırada Ne Var?</strong></p>
            <ul>
              <li>Başvurunuz ekibimiz tarafından incelenecek</li>
              <li>Değerlendirme süreci 2-3 iş günü sürecektir</li>
              <li>Sonuç hakkında email ile bilgilendirileceksiniz</li>
            </ul>
            
            <p>Bu süreçte sosyal medya hesaplarımızdan bizi takip edebilir, etkinliklerimizi ve duyurularımızı görebilirsiniz.</p>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" class="button">Web Sitemizi Ziyaret Edin</a>
          </div>
          <div class="footer">
            <p>MACRO - Teknoloji Topluluğu</p>
            <p>Bu bir otomatik emaildir, lütfen yanıtlamayın.</p>
            <p>ocbstd.com</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  membershipApproved: (name: string) => ({
    subject: 'Tebrikler! Üyeliğiniz Onaylandı - MACRO',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎊 Tebrikler ${name}!</h1>
          </div>
          <div class="content">
            <p>Harika haberlerimiz var! Üyelik başvurunuz onaylandı ve artık <strong>MACRO Topluluğu</strong>'nun resmi bir üyesisiniz!</p>
            
            <p><strong>Artık Neler Yapabilirsiniz?</strong></p>
            <ul>
              <li>Tüm etkinliklere katılabilirsiniz</li>
              <li>Proje gruplarına dahil olabilirsiniz</li>
              <li>Workshoplara ve eğitimlere erişebilirsiniz</li>
              <li>Topluluğun Discord ve WhatsApp gruplarına katılabilirsiniz</li>
            </ul>
            
            <p>Profilinize giriş yaparak tüm özelliklere erişebilirsiniz.</p>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/profile" class="button">Profilime Git</a>
            
            <p style="margin-top: 30px;">Aramıza hoş geldiniz! 🚀</p>
          </div>
          <div class="footer">
            <p>MACRO - Teknoloji Topluluğu</p>
            <p>ocbstd.com</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  membershipRejected: (name: string, reason?: string) => ({
    subject: 'Üyelik Başvurunuz Hakkında - MACRO',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .reason-box { background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Başvuru Sonucu</h1>
          </div>
          <div class="content">
            <h2>Merhaba ${name},</h2>
            <p>Üyelik başvurunuz için teşekkür ederiz. Başvurunuz değerlendirildi ancak bu sezon için kabul edilemedi.</p>
            
            ${reason ? `
            <div class="reason-box">
              <strong>Değerlendirme Notu:</strong>
              <p>${reason}</p>
            </div>
            ` : ''}
            
            <p>Bu durum gelecekte tekrar başvuru yapmanıza engel değildir. Kendinizi geliştirdikçe ve deneyim kazandıkça yeniden başvurabilirsiniz.</p>
            
            <p><strong>Önerilerimiz:</strong></p>
            <ul>
              <li>Açık etkinliklerimize katılmaya devam edebilirsiniz</li>
              <li>Sosyal medya kanallarımızdan bizi takip edebilirsiniz</li>
              <li>Teknik yeteneklerinizi geliştirmeye devam edin</li>
              <li>Gelecek dönemde yeniden başvuru yapabilirsiniz</li>
            </ul>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/events" class="button">Etkinlikleri Görüntüle</a>
          </div>
          <div class="footer">
            <p>MACRO - Teknoloji Topluluğu</p>
            <p>Sorularınız için bize ulaşabilirsiniz.</p>
            <p>ocbstd.com</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
}