// components/pdf/MembershipPDF.tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Font kayıt (Türkçe karakter desteği için)
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
      fontWeight: 300,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
      fontWeight: 500,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Roboto',
    fontSize: 10,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    borderWidth: 2,
    borderColor: '#000000',
    borderStyle: 'solid'
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    justifyContent: 'flex-end',
  },
  logoContainer: {
    width: 70,
    height: 70,
  },
  logo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  universityLogoContainer: {
    width: 70,
    height: 70,
  },
  headerText: {
    fontSize: 12,
    fontWeight: 700,
    textAlign: 'center',
  },
  formTitle: {
    backgroundColor: '#4472C4',
    color: '#ffffff',
    padding: 8,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 10,
  },
  sectionTitle: {
    backgroundColor: '#4472C4',
    color: '#ffffff',
    padding: 5,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 700,
    marginTop: 10,
    marginBottom: 1,
  },
  table: {
    display: 'flex',
    width: '100%',
    marginBottom: 1,
  },
  tableRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#000000',
    minHeight: 25,
  },
  labelCell: {
    width: '35%',
    padding: 5,
    backgroundColor: '#f0f0f0',
    fontWeight: 700,
    fontSize: 10,
    borderRightWidth: 1,
    borderRightColor: '#000000',
  },
  valueCell: {
    width: '65%',
    padding: 5,
    fontSize: 10,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 5,
  },
  gridCol: {
    flex: 1,
  },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    fontSize: 8,
    color: '#666666',
    textAlign: 'right',
  },
  footerText: {
    marginBottom: 2,
  },
});

interface MembershipPDFProps {
  application: any;
  universityName?: string;
  communityName?: string;
  universityLogo?: string;
  communityLogo?: string;
}

export const MembershipPDF: React.FC<MembershipPDFProps> = ({
  application,
  universityName = 'İSUBÜ Keçiborlu Meslek\n Yüksekokulu',
  communityName = 'MACRO TOPLULUĞU',
  universityLogo,
  communityLogo,
}) => {
  const formatDate = (date: string | Date | null | undefined): string => {
    if (!date) return '—';
    try {
      const d = typeof date === 'string' ? new Date(date) : date;
      return new Intl.DateTimeFormat('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(d);
    } catch {
      return '—';
    }
  };

  const getProjectInterestText = (interest: string | null | undefined): string => {
    if (!interest) return '—';
    const map: Record<string, string> = {
      'istiyorum': 'İstiyorum',
      'farketmez': 'Fark Etmez',
      'istemiyorum': 'İstemiyorum',
      'yes': 'İstiyorum',
      'no': 'İstemiyorum',
      'maybe': 'Fark Etmez',
    };
    return map[interest.toLowerCase()] || interest;
  };

  
  const safeValue = (value: any): string => {
    return value?.toString() || '—';
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
        {/* Sol taraf: University Logo + Name */}
        <View style={styles.headerLeft}>
          {universityLogo && (
            <View style={styles.universityLogoContainer}>
              <Image src={universityLogo} style={styles.logo} />
            </View>
          )}
          <Text style={styles.headerText}>{universityName}</Text>
        </View>

        {/* Sağ taraf: Community Name + Logo */}
        <View style={styles.headerRight}>
          <Text style={styles.headerText}>{communityName}</Text>
          {communityLogo && (
            <View style={styles.logoContainer}>
              <Image src={communityLogo} style={styles.logo} />
            </View>
          )}
        </View>
      </View>


        {/* Form Title */}
        <View style={styles.formTitle}>
          <Text>ÜYELİK BİLGİ FORMU</Text>
        </View>

        {/* Kişisel Bilgiler */}
        <View style={styles.sectionTitle}>
          <Text>KİŞİSEL BİLGİLER</Text>
        </View>
        
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.labelCell}>
              <Text>Ad-Soyad:</Text>
            </View>
            <View style={styles.valueCell}>
              <Text>{safeValue(application.full_name)}</Text>
            </View>
          </View>
          
          <View style={styles.tableRow}>
            <View style={styles.labelCell}>
              <Text>Fakülte / Bölüm:</Text>
            </View>
            <View style={styles.valueCell}>
              <Text>{safeValue(application.department)}</Text>
            </View>
          </View>
          
          <View style={styles.tableRow}>
            <View style={styles.labelCell}>
              <Text>Sınıf:</Text>
            </View>
            <View style={styles.valueCell}>
              <Text>{safeValue(application.grade)}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.labelCell}>
              <Text>Öğrenci Numarası</Text>
            </View>
            <View style={styles.valueCell}>
              <Text>{safeValue(application.student_number)}</Text>
            </View>
          </View>
        </View>

        {/* İletişim Bilgileri */}
        <View style={styles.sectionTitle}>
          <Text>İLETİŞİM BİLGİLERİ</Text>
        </View>
        
        <View style={styles.gridRow}>
          <View style={[styles.gridCol, styles.table]}>
            <View style={styles.tableRow}>
              <View style={[styles.labelCell, { width: '40%' }]}>
                <Text>Telefon:</Text>
              </View>
              <View style={[styles.valueCell, { width: '60%' }]}>
                <Text>{safeValue(application.phone)}</Text>
              </View>
            </View>
          </View>
          
          <View style={[styles.gridCol, styles.table]}>
            <View style={styles.tableRow}>
              <View style={[styles.labelCell, { width: '40%' }]}>
                <Text>E-posta:</Text>
              </View>
              <View style={[styles.valueCell, { width: '60%' }]}>
                <Text>{safeValue(application.email)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.labelCell}>
              <Text>Sosyal Medya:</Text>
            </View>
            <View style={styles.valueCell}>
              <Text>
                {application.social_media?.linkedin ? `LinkedIn: ${application.social_media.linkedin}\n` : ''}
                {application.social_media?.github ? `GitHub: ${application.social_media.github}\n` : ''}
                {application.social_media?.instagram ? `Instagram: ${application.social_media.instagram}\n` : ''}
                {application.social_media?.twitter ? `Twitter: ${application.social_media.twitter}` : ''}
              </Text>
            </View>
          </View>
        </View>

        {/* Topluluk Bilgileri */}
        <View style={styles.sectionTitle}>
          <Text>TOPLULUK BİLGİLERİ</Text>
        </View>
        
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.labelCell}>
              <Text>Katılım Tarihi:</Text>
            </View>
            <View style={styles.valueCell}>
              <Text>{formatDate(application.join_date || application.created_at)}</Text>
            </View>
          </View>
          
          <View style={styles.tableRow}>
            <View style={styles.labelCell}>
              <Text>Katılma Nedeni:</Text>
            </View>
            <View style={styles.valueCell}>
              <Text>{safeValue(application.why_join)}</Text>
            </View>
          </View>
        </View>

        {/* Yetenekler ve İlgi Alanları */}
        <View style={styles.sectionTitle}>
          <Text>YETENEKLER VE İLGİ ALANLARI</Text>
        </View>
        
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.labelCell}>
              <Text>Yetenekler:</Text>
            </View>
            <View style={styles.valueCell}>
              <Text>{safeValue(application.skills)}</Text>
            </View>
          </View>
          
          <View style={styles.tableRow}>
            <View style={styles.labelCell}>
              <Text>İlgi Alanları:</Text>
            </View>
            <View style={styles.valueCell}>
              <Text>{safeValue(application.interests)}</Text>
            </View>
          </View>
        </View>

        {/* Kendini Değerlendirme */}
        <View style={styles.sectionTitle}>
          <Text>KENDİNİ DEĞERLENDİRME</Text>
        </View>
        
        <View style={styles.gridRow}>
          <View style={[styles.gridCol, styles.table]}>
            <View style={styles.tableRow}>
              <View style={[styles.labelCell, { width: '60%' }]}>
                <Text>İletişim Becerisi:</Text>
              </View>
              <View style={[styles.valueCell, { width: '40%' }]}>
                <Text>{safeValue(application.communication_skills)} / 5</Text>
              </View>
            </View>
          </View>
          
          <View style={[styles.gridCol, styles.table]}>
            <View style={styles.tableRow}>
              <View style={[styles.labelCell, { width: '60%' }]}>
                <Text>Takım Çalışması:</Text>
              </View>
              <View style={[styles.valueCell, { width: '40%' }]}>
                <Text>{safeValue(application.teamwork_skills)} / 5</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.labelCell}>
              <Text>Kendini Tanıt:</Text>
            </View>
            <View style={styles.valueCell}>
              <Text>{safeValue(application.self_introduction)}</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.labelCell}>
              <Text>Deneyim</Text>
            </View>
            <View style={styles.valueCell}>
              <Text>{safeValue(application.experience)}</Text>
            </View>
          </View>
          
          <View style={styles.tableRow}>
            <View style={styles.labelCell}>
              <Text>Proje İsteği:</Text>
            </View>
            <View style={styles.valueCell}>
              <Text>{getProjectInterestText(application.project_preference)}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Form Tarihi: {formatDate(application.created_at)}
          </Text>
          <Text style={styles.footerText}>
            Revizyon Tarihi: {formatDate(new Date())}
          </Text>
          <Text style={styles.footerText}>
            System developed by OCB STD Software
          </Text>
        </View>
      </Page>
    </Document>
  );
};