// app/announcements/page.tsx (Server Component)

import { getAnnouncements } from '@/lib/supabase/queries'
import Navbar from '@/components/navbar'
import AnnouncementsList from './announcements-list'
import { Megaphone, Sparkles } from 'lucide-react'
import Footer from '@/components/Footer'

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section with MACRO Style */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-[100px]" />
        </div>

        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 border border-purple-500/20 backdrop-blur-sm mb-8">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                MACRO Duyuruları
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="inline-block bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                Tüm Duyurular
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Topluluğumuzdan güncel haberler, etkinlik duyuruları ve önemli bildirimler
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {announcements.length}
                </div>
                <div className="text-sm text-muted-foreground font-semibold">Toplam Duyuru</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <div className="text-3xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  <Megaphone className="w-8 h-8 inline-block" />
                </div>
                <div className="text-sm text-muted-foreground font-semibold">Sürekli Güncellenen</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Announcements List Section */}
      <div className="container mx-auto px-4 pb-24">
        <AnnouncementsList announcements={announcements} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}