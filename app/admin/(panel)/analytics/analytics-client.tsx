// app/admin/analytics/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MousePointer,
  TrendingUp,
  Download,
  MoreHorizontal,
  Filter,
  Trash2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Stats {
  totalEvents: number;
  pageViews: number;
  buttonClicks: number;
  todayEvents: number;
  uniquePages: number;
  avgDaily: number;
  changePercent: number;
}

interface ButtonData {
  name: string;
  section: string;
  clicks: number;
}

interface SectionData {
  name: string;
  value: number;
}

interface TimeSeriesData {
  date: string;
  pageViews: number;
  clicks: number;
  total: number;
}

interface RecentActivity {
  id: string;
  event: string;
  page: string;
  time: string;
}

interface DetailedEvent {
  id: string;
  eventName: string;
  eventType: string;
  status: 'page_view' | 'button_click';
  page: string;
  section: string;
  timestamp: string;
  sessionId: string;
  userAgent?: string;
  ipAddress?: string;
  referrer?: string;
  deviceType?: string;
}

export default function AdminAnalyticsDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalEvents: 0,
    pageViews: 0,
    buttonClicks: 0,
    todayEvents: 0,
    uniquePages: 0,
    avgDaily: 0,
    changePercent: 0
  });
  const [buttonData, setButtonData] = useState<ButtonData[]>([]);
  const [sectionData, setSectionData] = useState<SectionData[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [detailedEvents, setDetailedEvents] = useState<DetailedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<DetailedEvent | null>(null);
  const [cleanupDialogOpen, setCleanupDialogOpen] = useState(false);
  const [customDays, setCustomDays] = useState(30);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const { data: weekData, error } = await supabase
          .from('analytics_events')
          .select('*')
          .gte('created_at', sevenDaysAgo)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase hatası:', error);
          return;
        }

        if (weekData && weekData.length > 0) {
          const pageViews = weekData.filter(e => e.event_name === 'page_view');
          const buttonClicks = weekData.filter(e => e.event_name === 'button_click');

          // Detailed events
          const detailed: DetailedEvent[] = weekData.map(event => ({
            id: event.id,
            eventName: event.event_name === 'page_view' 
              ? event.properties?.page || 'Unknown Page'
              : event.properties?.button_name || 'Unknown Button',
            eventType: event.event_name === 'page_view' ? 'Page View' : 'Button Click',
            status: event.event_name,
            page: event.properties?.page || '-',
            section: event.properties?.section || '-',
            timestamp: new Date(event.created_at).toLocaleString('tr-TR'),
            sessionId: event.session_id || event.id.slice(0, 8),
            userAgent: event.properties?.userAgent || 'Unknown',
            ipAddress: event.properties?.ip || 'N/A',
            referrer: event.properties?.referrer || 'Direct',
            deviceType: event.properties?.device || 'Desktop'
          }));

          setDetailedEvents(detailed);

          // Button stats
          const buttonMap = new Map<string, ButtonData>();
          buttonClicks.forEach(event => {
            const name = event.properties?.button_name || 'unknown';
            const section = event.properties?.section || 'unknown';
            const key = `${name}|${section}`;
            
            if (buttonMap.has(key)) {
              buttonMap.get(key)!.clicks++;
            } else {
              buttonMap.set(key, { name, section, clicks: 1 });
            }
          });

          const sortedButtons = Array.from(buttonMap.values())
            .sort((a, b) => b.clicks - a.clicks)
            .slice(0, 10);

          // Section stats
          const sectionMap = new Map<string, number>();
          buttonClicks.forEach(event => {
            const section = event.properties?.section || 'unknown';
            sectionMap.set(section, (sectionMap.get(section) || 0) + 1);
          });

          const sectionStats = Array.from(sectionMap.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

          // Time series
          const dailyMap = new Map<string, TimeSeriesData>();
          [...pageViews, ...buttonClicks].forEach(event => {
            const date = new Date(event.created_at).toLocaleDateString('tr-TR');
            if (!dailyMap.has(date)) {
              dailyMap.set(date, { date, pageViews: 0, clicks: 0, total: 0 });
            }
            const day = dailyMap.get(date)!;
            if (event.event_name === 'page_view') {
              day.pageViews++;
            } else {
              day.clicks++;
            }
            day.total++;
          });

          const timeSeries = Array.from(dailyMap.values())
            .sort((a, b) => new Date(a.date.split('.').reverse().join('-')).getTime() - 
                            new Date(b.date.split('.').reverse().join('-')).getTime())
            .slice(-7);

          // Today's data
          const today = new Date();
          const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const todayEvents = weekData.filter(e => 
            new Date(e.created_at) >= todayStart
          ).length;

          // Yesterday's data
          const yesterdayStart = new Date(todayStart);
          yesterdayStart.setDate(yesterdayStart.getDate() - 1);
          const yesterdayEvents = weekData.filter(e => {
            const eventDate = new Date(e.created_at);
            return eventDate >= yesterdayStart && eventDate < todayStart;
          }).length;

          const changePercent = yesterdayEvents > 0 
            ? ((todayEvents - yesterdayEvents) / yesterdayEvents) * 100 
            : 0;

          // Unique pages
          const uniquePagesSet = new Set(
            pageViews.map(e => e.properties?.page || 'unknown')
          );

          // Recent activity
          const recent = weekData.slice(0, 5).map(event => ({
            id: event.id,
            event: event.event_name === 'page_view' ? 'Sayfa Görüntüleme' : 'Buton Tıklama',
            page: event.properties?.page || event.properties?.button_name || 'N/A',
            time: new Date(event.created_at).toLocaleString('tr-TR')
          }));

          setStats({
            totalEvents: weekData.length,
            pageViews: pageViews.length,
            buttonClicks: buttonClicks.length,
            todayEvents: todayEvents,
            uniquePages: uniquePagesSet.size,
            avgDaily: Math.round(weekData.length / 7),
            changePercent: Math.round(changePercent)
          });

          setButtonData(sortedButtons);
          setSectionData(sectionStats);
          setTimeSeriesData(timeSeries);
          setRecentActivity(recent);
        }
      } catch (error) {
        console.error('Analytics hatası:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchAnalytics();
  }, []);

  const toggleRowSelection = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const toggleAllRows = () => {
    if (selectedRows.size === detailedEvents.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(detailedEvents.map(e => e.id)));
    }
  };

  const deleteOldRecords = async (daysToKeep: number) => {
    try {
      setIsDeleting(true)

      const res = await fetch('/api/analytics/cleanup', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ daysToKeep }),
      })

      const data = await res.json()

      if (!res.ok) {
        console.error(data)
        alert('Silme başarısız: ' + (data.error ?? 'Bilinmeyen hata'))
        return
      }

      alert(`Başarılı! ${data.deleted} kayıt silindi`)
      setCleanupDialogOpen(false)
      window.location.reload()
    } catch (err) {
      console.error(err)
      alert('Bir hata oluştu')
    } finally {
      setIsDeleting(false)
    }
  }


  const deleteAllRecords = async () => {
    if (!confirm('TÜM KAYITLARI SİLMEK İSTEDİĞİNİZDEN EMİN MİSİNİZ? Bu işlem geri alınamaz!')) {
      return
    }

    try {
      setIsDeleting(true)

      const res = await fetch('/api/analytics/cleanup', { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ daysToKeep: 0 }),
      })

      const data = await res.json()

      if (!res.ok) {
        console.error(data)
        alert('Silme başarısız: ' + (data.error ?? 'Bilinmeyen hata'))
        return
      }

      alert(`Başarılı! TÜM KAYITLAR SİLİNDİ (${data.deleted})`)
      setCleanupDialogOpen(false)
      window.location.reload()
    } catch (err) {
      console.error(err)
      alert('Bir hata oluştu')
    } finally {
      setIsDeleting(false)
    }
  }


  const openEventDetail = (event: DetailedEvent) => {
    setSelectedEvent(event);
    setSheetOpen(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <div className="flex flex-col sm:gap-4 sm:py-4">
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-4 w-24 bg-muted rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 w-16 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-lg font-semibold md:text-2xl">Analytics Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <AlertDialog open={cleanupDialogOpen} onOpenChange={setCleanupDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1 text-destructive border-destructive/50 hover:bg-destructive/10">
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Sunucu Temizle
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Eski Kayıtları Sil</AlertDialogTitle>
                  <AlertDialogDescription>
                    Belirli bir süre öncesindeki analytics kayıtlarını kalıcı olarak silebilirsiniz.
                    Bu işlem geri alınamaz!
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4 py-4">
                  {/* Hepsini Sil Butonu */}
                  <div className="rounded-lg border-2 border-destructive bg-destructive/5 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-destructive">Tüm Kayıtları Sil</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Analytics tablosundaki tüm verileri siler
                        </p>
                      </div>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={deleteAllRecords}
                        disabled={isDeleting}
                      >
                        {isDeleting ? 'Siliniyor...' : 'Hepsini Sil'}
                      </Button>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        veya
                      </span>
                    </div>
                  </div>

                  {/* Hazır Seçenekler */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Hızlı Seçenekler</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => deleteOldRecords(7)}
                        disabled={isDeleting}
                        size="sm"
                      >
                        Son 7 gün hariç
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => deleteOldRecords(30)}
                        disabled={isDeleting}
                        size="sm"
                      >
                        Son 30 gün hariç
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => deleteOldRecords(90)}
                        disabled={isDeleting}
                        size="sm"
                      >
                        Son 90 gün hariç
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => deleteOldRecords(180)}
                        disabled={isDeleting}
                        size="sm"
                      >
                        Son 180 gün hariç
                      </Button>
                    </div>
                  </div>

                  {/* Özel Gün Sayısı */}
                  <div className="space-y-2">
                    <Label htmlFor="customDays" className="text-sm font-medium">
                      Özel Gün Sayısı
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="customDays"
                        type="number"
                        min="1"
                        value={customDays}
                        onChange={(e) => setCustomDays(parseInt(e.target.value) || 30)}
                        placeholder="Gün sayısı"
                        className="flex-1"
                        disabled={isDeleting}
                      />
                      <Button 
                        onClick={() => deleteOldRecords(customDays)}
                        disabled={isDeleting}
                        variant="secondary"
                        size="sm"
                      >
                        {isDeleting ? 'Siliniyor...' : 'Sil'}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Son {customDays} gün hariç tüm kayıtlar silinecek
                    </p>
                  </div>

                  {/* Uyarı Mesajı */}
                  <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-3">
                    <div className="flex gap-2">
                      <div className="text-sm font-medium text-amber-600 dark:text-amber-500">
                        ⚠️ Dikkat
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Silinen veriler geri getirilemez! Lütfen dikkatli olun.
                    </p>
                  </div>
                </div>

                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>İptal</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Download className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>
          </div>
        </header>

        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Events</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEvents}</div>
                <p className="text-xs text-muted-foreground">Son 7 günde toplanan veri</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sayfa Görüntüleme</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pageViews}</div>
                <p className="text-xs text-muted-foreground">{stats.uniquePages} benzersiz sayfa</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Buton Tıklama</CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.buttonClicks}</div>
                <p className="text-xs text-muted-foreground">Toplam etkileşim</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bugün</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.todayEvents}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.changePercent > 0 ? (
                    <span className="text-green-600 dark:text-green-500 inline-flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />+{stats.changePercent}% dünden
                    </span>
                  ) : stats.changePercent < 0 ? (
                    <span className="text-red-600 dark:text-red-500 inline-flex items-center">
                      <ArrowDownRight className="h-3 w-3 mr-1" />{stats.changePercent}% dünden
                    </span>
                  ) : (<span>Dünle aynı</span>)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle>Genel Bakış</CardTitle>
                <CardDescription>Son 7 günün aktivite trendi</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                {timeSeriesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={timeSeriesData}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" className="text-xs" tickLine={false} axisLine={false} />
                      <YAxis className="text-xs" tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} />
                      <Area type="monotone" dataKey="pageViews" stroke="hsl(var(--primary))" 
                        fillOpacity={1} fill="url(#colorViews)" name="Görüntüleme" />
                      <Area type="monotone" dataKey="clicks" stroke="hsl(var(--chart-2))" 
                        fillOpacity={1} fill="url(#colorClicks)" name="Tıklama" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-[350px] items-center justify-center text-muted-foreground">
                    Henüz veri yok
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Son Aktiviteler</CardTitle>
                <CardDescription>En son gerçekleşen olaylar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                        {activity.event === 'Sayfa Görüntüleme' ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <MousePointer className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{activity.event}</p>
                        <p className="text-sm text-muted-foreground">{activity.page}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Events Table */}
          <Card>
            <CardHeader className="px-7">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tüm Olaylar</CardTitle>
                  <CardDescription>Detaylı event kayıtları - Satıra tıklayarak detayları görün</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <Filter className="h-3.5 w-3.5" />
                        <span className="sr-only xl:not-sr-only xl:whitespace-nowrap">Filtrele</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Olay Tipi</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem checked>Tüm Olaylar</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>Sayfa Görüntüleme</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>Buton Tıklama</DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input type="checkbox" checked={selectedRows.size === detailedEvents.length && detailedEvents.length > 0}
                        onChange={toggleAllRows} className="rounded border-muted" />
                    </TableHead>
                    <TableHead>Olay</TableHead>
                    <TableHead>Tip</TableHead>
                    <TableHead className="hidden md:table-cell">Durum</TableHead>
                    <TableHead className="hidden lg:table-cell">Sayfa</TableHead>
                    <TableHead className="hidden lg:table-cell">Bölüm</TableHead>
                    <TableHead className="hidden xl:table-cell">Zaman</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detailedEvents.slice(0, 10).map((event) => (
                    <TableRow key={event.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" checked={selectedRows.has(event.id)}
                          onChange={() => toggleRowSelection(event.id)} className="rounded border-muted" />
                      </TableCell>
                      <TableCell onClick={() => openEventDetail(event)}>
                        <div className="font-medium">{event.eventName}</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">{event.sessionId}</div>
                      </TableCell>
                      <TableCell onClick={() => openEventDetail(event)}>
                        <Badge variant="outline" className="font-normal">{event.eventType}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell" onClick={() => openEventDetail(event)}>
                        {event.status === 'page_view' ? (
                          <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20">View</Badge>
                        ) : (
                          <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20">Click</Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell" onClick={() => openEventDetail(event)}>{event.page}</TableCell>
                      <TableCell className="hidden lg:table-cell" onClick={() => openEventDetail(event)}>{event.section}</TableCell>
                      <TableCell className="hidden xl:table-cell" onClick={() => openEventDetail(event)}>{event.timestamp}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openEventDetail(event)}>Detayları Görüntüle</DropdownMenuItem>
                            <DropdownMenuItem>Rapor Oluştur</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Sil</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between px-2 py-4">
                <div className="text-xs text-muted-foreground">{selectedRows.size} / {detailedEvents.length} satır seçildi</div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>Önceki</Button>
                  <div className="text-sm">Sayfa 1 / 1</div>
                  <Button variant="outline" size="sm" disabled>Sonraki</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Detail Sheet - Olay detayları */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="overflow-y-auto w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{selectedEvent?.eventName}</SheetTitle>
            <SheetDescription>
              Son 6 ay için toplam ziyaretçi gösteriliyor
            </SheetDescription>
          </SheetHeader>

          {selectedEvent && (
            <div className="space-y-6 py-6">
              {/* Mini Chart */}
              <div className="rounded-lg bg-muted p-4">
                <div className="mb-2 text-sm font-medium">Trend</div>
                <div className="h-32 w-full bg-muted-foreground/20 rounded" />
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Bu ay %5.2 artış</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Son 6 ay için toplam ziyaretçi gösteriliyor. Bu düzeni test etmek için rastgele bir metindir.
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="header">Header</Label>
                  <Input id="header" value={selectedEvent.eventName} readOnly />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select defaultValue={selectedEvent.eventType}>
                      <SelectTrigger id="type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Page View">Page View</SelectItem>
                        <SelectItem value="Button Click">Button Click</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select defaultValue={selectedEvent.status}>
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="page_view">View</SelectItem>
                        <SelectItem value="button_click">Click</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="target">Target</Label>
                    <Input id="target" value={selectedEvent.page} readOnly />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="limit">Limit</Label>
                    <Input id="limit" value={selectedEvent.section} readOnly />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reviewer">Reviewer</Label>
                  <Select defaultValue="assign">
                    <SelectTrigger id="reviewer">
                      <SelectValue placeholder="Assign reviewer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="assign">Assign reviewer</SelectItem>
                      <SelectItem value="user1">User 1</SelectItem>
                      <SelectItem value="user2">User 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Additional Info */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Session ID:</span>
                    <span className="font-medium">{selectedEvent.sessionId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Timestamp:</span>
                    <span className="font-medium">{selectedEvent.timestamp}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Device:</span>
                    <span className="font-medium">{selectedEvent.deviceType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Referrer:</span>
                    <span className="font-medium truncate max-w-[200px]">{selectedEvent.referrer}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-4">
                <Button className="w-full">Submit</Button>
                <Button variant="outline" className="w-full">Done</Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
