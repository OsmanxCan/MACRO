// app/admin/sonuclanan-basvurular/pdf-download-button.tsx
'use client'

import { useState, useEffect } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { Button } from "@/components/ui/button"
import { Download, Eye } from "lucide-react"
import { MembershipPDF } from '@/components/pdf/MembershipPDF'
import PDFPreviewModal from './pdf-preview-modal'
import { imageToBase64 } from '@/lib/utils/imageToBase64'

interface PDFDownloadButtonProps {
  application: any
}

export default function PDFDownloadButton({ application }: PDFDownloadButtonProps) {
  const [isClient, setIsClient] = useState(false)
  const [logos, setLogos] = useState({
    university: '',
    community: ''
  })
  const [isLoadingLogos, setIsLoadingLogos] = useState(true)

  useEffect(() => {
    setIsClient(true)
    loadLogos()
  }, [])

  const loadLogos = async () => {
    try {
      setIsLoadingLogos(true)
      const [universityBase64, communityBase64] = await Promise.all([
        imageToBase64('/images/isubu.png'),
        imageToBase64('/images/LogoMacroP.png')
      ])
      
      setLogos({
        university: universityBase64,
        community: communityBase64
      })
    } catch (error) {
      console.error('Logo yükleme hatası:', error)
    } finally {
      setIsLoadingLogos(false)
    }
  }

  const fileName = `${application.full_name.replace(/\s+/g, '_')}_Uyelik_Formu.pdf`

  if (!isClient || isLoadingLogos) {
    return (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" disabled>
          <Eye className="h-4 w-4 mr-1" />
          Ön İzle
        </Button>
        <Button size="sm" variant="outline" disabled>
          <Download className="h-4 w-4 mr-1" />
          Yükleniyor...
        </Button>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      {/* Ön İzleme Butonu */}
      <PDFPreviewModal application={application} />

      {/* İndirme Butonu */}
      <PDFDownloadLink
        document={
          <MembershipPDF 
            application={application}
            universityLogo={logos.university}
            communityLogo={logos.community}
          />
        }
        fileName={fileName}
      >
        {({ loading }) => (
          <Button size="sm" variant="default" disabled={loading}>
            <Download className="h-4 w-4 mr-1" />
            {loading ? 'Hazırlanıyor...' : 'İndir'}
          </Button>
        )}
      </PDFDownloadLink>
    </div>
  )
}