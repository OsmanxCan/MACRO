import { Calendar, Info, Megaphone, Cpu, Plane, Cog, ExternalLink } from 'lucide-react';
import { getAbout, getAnnouncements, getEvents } from "@/lib/supabase/queries";
import Link from 'next/link';
import DOMPurify from "isomorphic-dompurify";

export default async function HomePage() {
  const announcements = await getAnnouncements();
  const events = await getEvents();
  const about = await getAbout();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                MACRO
              </h1>
              <p className="text-xs text-muted-foreground">Teknoloji Topluluğu</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#hakkinda" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Hakkımızda
            </a>
            <a href="#duyurular" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Duyurular
            </a>
            <a href="#etkinlikler" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Etkinlikler
            </a>
          </nav>

          <Link 
            href="/admin/login"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Giriş
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Geleceği Birlikte İnşa Ediyoruz
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Bilişim, İş Makinaları ve Uçak Teknolojisi alanlarında öğrencilerin gelişimine katkı sağlayan topluluk
          </p>
          
          {/* Alan İkonları */}
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            <div className="flex flex-col items-center gap-2 p-6 rounded-lg border bg-card text-card-foreground shadow-sm min-w-[160px] hover:shadow-md transition-shadow">
              <Cpu className="w-10 h-10 text-blue-600" />
              <span className="font-semibold">Bilişim</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-6 rounded-lg border bg-card text-card-foreground shadow-sm min-w-[160px] hover:shadow-md transition-shadow">
              <Cog className="w-10 h-10 text-purple-600" />
              <span className="font-semibold">İş Makinaları</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-6 rounded-lg border bg-card text-card-foreground shadow-sm min-w-[160px] hover:shadow-md transition-shadow">
              <Plane className="w-10 h-10 text-pink-600" />
              <span className="font-semibold">Uçak Teknolojisi</span>
            </div>
          </div>
        </div>

        {/* Hakkımızda Section */}
        <section id="hakkinda" className="mb-16">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex items-center gap-3 border-b bg-muted/50 px-6 py-4">
              <Info className="w-5 h-5 text-blue-600" />
              <h3 className="text-2xl font-bold">Hakkımızda</h3>
            </div>
            <div className="p-6">
              {about ? (
                <div className="space-y-6">
                  {about.title && (
                    <h3 className="text-2xl font-bold">
                      {about.title}
                    </h3>
                  )}
                  {about.image_url && (
                    <div className="relative w-full aspect-video overflow-hidden rounded-lg border">
                      <img 
                        src={about.image_url} 
                        alt={about.title || "Hakkımızda"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div 
                    className="prose prose-slate dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(about.content) }}
                  />
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Henüz içerik eklenmemiş.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Duyurular Section */}
        <section id="duyurular" className="mb-16">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex items-center gap-3 border-b bg-muted/50 px-6 py-4">
              <Megaphone className="w-5 h-5 text-purple-600" />
              <h3 className="text-2xl font-bold">Duyurular</h3>
            </div>
            <div className="divide-y">
              {announcements.length === 0 ? (
                <p className="text-muted-foreground text-center py-12">Henüz duyuru bulunmuyor.</p>
              ) : (
                announcements.map((announcement) => (
                  <div key={announcement.id} className="p-6 hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {announcement.image_url && (
                        <div className="lg:w-48 lg:flex-shrink-0">
                          <div className="relative w-full aspect-video lg:aspect-square overflow-hidden rounded-lg border">
                            <img 
                              src={announcement.image_url} 
                              alt={announcement.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h4 className="text-xl font-semibold">
                            {announcement.title}
                          </h4>
                          <span className="text-sm text-muted-foreground whitespace-nowrap">
                            {new Date(announcement.created_at).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                        <div 
                          className="prose prose-sm prose-slate dark:prose-invert max-w-none mb-4 line-clamp-3"
                          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(announcement.content) }}
                        />
                        {announcement.link && (
                          <a 
                            href={announcement.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Detayları Gör
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Etkinlikler Section */}
        <section id="etkinlikler" className="mb-16">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex items-center gap-3 border-b bg-muted/50 px-6 py-4">
              <Calendar className="w-5 h-5 text-pink-600" />
              <h3 className="text-2xl font-bold">Yaklaşan Etkinlikler</h3>
            </div>
            <div className="divide-y">
              {events.length === 0 ? (
                <p className="text-muted-foreground text-center py-12">Henüz etkinlik bulunmuyor.</p>
              ) : (
                events.map((event) => (
                  <div key={event.id} className="p-6 hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {event.image_url && (
                        <div className="lg:w-48 lg:flex-shrink-0">
                          <div className="relative w-full aspect-video lg:aspect-square overflow-hidden rounded-lg border">
                            <img 
                              src={event.image_url} 
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h4 className="text-xl font-semibold">
                            {event.title}
                          </h4>
                          {event.date && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(event.date).toLocaleDateString('tr-TR')}</span>
                            </div>
                          )}
                        </div>
                        {event.description && (
                          <div 
                            className="prose prose-sm prose-slate dark:prose-invert max-w-none mb-4 line-clamp-3"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(event.description) }}
                          />
                        )}
                        {event.link && (
                          <a 
                            href={event.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-medium text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Detayları Gör
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2025 MACRO Topluluğu. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}