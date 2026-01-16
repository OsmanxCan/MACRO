// app/admin/sonuclanan-basvurular/pdf-preview-modal.tsx
'use client'

import { useState, useEffect } from 'react'
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer'
import { Button } from "@/components/ui/button"
import { Download, Eye, X } from "lucide-react"
import { MembershipPDF } from '@/components/pdf/MembershipPDF'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/admin/PDF/dialog'
import { imageToBase64 } from '@/lib/utils/imageToBase64'

interface PDFPreviewModalProps {
  application: any
  trigger?: React.ReactNode
}

export default function PDFPreviewModal({ application, trigger }: PDFPreviewModalProps) {
  const [isOpen, setIsOpen] = useState(false)
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

  return (
    <>
      {/* Trigger Button */}
      {trigger ? (
        <div onClick={() => setIsOpen(true)}>{trigger}</div>
      ) : (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="mr-2"
        >
          <Eye className="h-4 w-4 mr-1" />
          Ön İzle
        </Button>
      )}

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[96vw] w-[96vw] h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              PDF Ön İzleme - {application.full_name}
            </DialogTitle>
            <DialogDescription>
              Üyelik formunun PDF önizlemesini aşağıda görebilirsiniz
            </DialogDescription>
          </DialogHeader>

          {/* PDF Viewer */}
          <div className="flex-1 border rounded-lg overflow-hidden bg-gray-100">
            {isClient && !isLoadingLogos ? (
              <PDFViewer 
                width="100%" 
                height="100%"
                showToolbar={true}
                className="border-0"
              >
                <MembershipPDF 
                  application={application}  
                  universityLogo={logos.university}
                  communityLogo={logos.community}
                />
              </PDFViewer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">{isLoadingLogos ? 'Logolar yükleniyor...' : 'PDF hazırlanıyor...'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <DialogFooter className="flex justify-between items-center sm:justify-between">
            <div className="flex gap-2">
              {isClient && !isLoadingLogos &&  (
                <PDFDownloadLink
                  document={
                    <MembershipPDF 
                      application={application}
                      universityLogo={logos.university}
                      communityLogo={logos.community}
                    />}
                  fileName={fileName}
                >
                  {({ loading }) => (
                    <Button variant="default" disabled={loading}>
                      <Download className="h-4 w-4 mr-2" />
                      {loading ? 'Hazırlanıyor...' : 'PDF İndir'}
                    </Button>
                  )}
                </PDFDownloadLink>
              )}
            </div>
            
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Kapat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}