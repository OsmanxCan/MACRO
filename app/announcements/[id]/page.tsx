// app/announcements/[id]/page.tsx (Server Component)

import { getAnnouncementById } from '@/lib/supabase/queries'
import { notFound } from 'next/navigation'
import Navbar from '@/components/navbar'
import AnnouncementDetail from './announcement-detail'
import Footer from '@/components/Footer'

export default async function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const announcement = await getAnnouncementById(id)

  if (!announcement) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="container relative mx-auto px-4 pt-32 pb-16 max-w-5xl">
          <AnnouncementDetail announcement={announcement} />
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  )
}