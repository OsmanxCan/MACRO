// (Server Component)

import { getAnnouncementById } from '@/lib/supabase/queries'
import { notFound } from 'next/navigation'
import Navbar from '@/components/navbar'
import AnnouncementDetail from './announcement-detail'

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
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <AnnouncementDetail announcement={announcement} />
      </div>

      <footer className="border-t bg-muted/50 mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2025 MACRO Topluluğu. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}