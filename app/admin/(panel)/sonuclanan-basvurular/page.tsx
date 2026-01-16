// // app/admin/sonuclanan-basvurular/page.tsx
// import { redirect } from "next/navigation"
// import { createSupabaseServer } from "@/lib/supabase/server"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { CheckCircle, XCircle, FileCheck } from "lucide-react"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// export default async function SonuclananBasvurularPage() {
//   const supabase = await createSupabaseServer()

//   const {
//     data: { user },
//   } = await supabase.auth.getUser()

//   if (!user) redirect("/admin/login")

//   const { data: me } = await supabase
//     .from("profiles")
//     .select("role")
//     .eq("id", user.id)
//     .single()

//   if (me?.role !== 'admin' && me?.role !== 'super_admin') {
//     redirect("/")
//   }

//   // Onaylanan başvurular
//   const { data: approvedApplications } = await supabase
//     .from("membership_applications")
//     .select("*")
//     .eq("status", "approved")
//     .order("reviewed_at", { ascending: false })

//   // Reddedilen başvurular
//   const { data: rejectedApplications } = await supabase
//     .from("membership_applications")
//     .select("*")
//     .eq("status", "rejected")
//     .order("reviewed_at", { ascending: false })

//   const totalApproved = approvedApplications?.length || 0
//   const totalRejected = rejectedApplications?.length || 0

//   const formatDate = (date: string) => {
//     return new Date(date).toLocaleDateString('tr-TR', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     })
//   }

//   return (
//     <div className="space-y-6 p-6">
//       {/* Başlık */}
//       <div>
//         <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//           Sonuçlanan Başvurular
//         </h1>
//         <p className="text-gray-600 dark:text-gray-400 mt-2">
//           Onaylanan ve reddedilen tüm başvuruları görüntüleyin
//         </p>
//       </div>

//       {/* İstatistikler */}
//       <div className="grid gap-4 md:grid-cols-3">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Toplam Sonuçlanan
//             </CardTitle>
//             <FileCheck className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{totalApproved + totalRejected}</div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Onaylanan
//             </CardTitle>
//             <CheckCircle className="h-4 w-4 text-green-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-green-600">{totalApproved}</div>
//             <p className="text-xs text-muted-foreground mt-1">
//               {totalApproved + totalRejected > 0 
//                 ? `%${Math.round((totalApproved / (totalApproved + totalRejected)) * 100)}` 
//                 : '0%'} onay oranı
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Reddedilen
//             </CardTitle>
//             <XCircle className="h-4 w-4 text-red-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-red-600">{totalRejected}</div>
//             <p className="text-xs text-muted-foreground mt-1">
//               {totalApproved + totalRejected > 0 
//                 ? `%${Math.round((totalRejected / (totalApproved + totalRejected)) * 100)}` 
//                 : '0%'} red oranı
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Tabs */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Başvuru Geçmişi</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Tabs defaultValue="approved" className="w-full">
//             <TabsList className="grid w-full grid-cols-2">
//               <TabsTrigger value="approved" className="flex items-center gap-2">
//                 <CheckCircle className="h-4 w-4" />
//                 Onaylananlar ({totalApproved})
//               </TabsTrigger>
//               <TabsTrigger value="rejected" className="flex items-center gap-2">
//                 <XCircle className="h-4 w-4" />
//                 Rededilenler ({totalRejected})
//               </TabsTrigger>
//             </TabsList>

//             {/* Onaylanan Başvurular */}
//             <TabsContent value="approved">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Ad Soyad</TableHead>
//                     <TableHead>Email</TableHead>
//                     <TableHead>Bölüm</TableHead>
//                     <TableHead>Sınıf</TableHead>
//                     <TableHead>Başvuru Tarihi</TableHead>
//                     <TableHead>Onay Tarihi</TableHead>
//                     <TableHead>Durum</TableHead>
//                   </TableRow>
//                 </TableHeader>

//                 <TableBody>
//                   {!approvedApplications || approvedApplications.length === 0 ? (
//                     <TableRow>
//                       <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
//                         Onaylanan başvuru bulunmuyor
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     approvedApplications.map((app) => (
//                       <TableRow key={app.id}>
//                         <TableCell className="font-medium">{app.full_name}</TableCell>
//                         <TableCell>{app.email}</TableCell>
//                         <TableCell>{app.department || '-'}</TableCell>
//                         <TableCell>{app.grade || '-'}</TableCell>
//                         <TableCell className="text-sm text-muted-foreground">
//                           {formatDate(app.created_at)}
//                         </TableCell>
//                         <TableCell className="text-sm text-muted-foreground">
//                           {app.reviewed_at ? formatDate(app.reviewed_at) : '-'}
//                         </TableCell>
//                         <TableCell>
//                           <Badge variant="default" className="bg-green-600">
//                             <CheckCircle className="h-3 w-3 mr-1" />
//                             Onaylandı
//                           </Badge>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </TabsContent>

//             {/* Reddedilen Başvurular */}
//             <TabsContent value="rejected">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Ad Soyad</TableHead>
//                     <TableHead>Email</TableHead>
//                     <TableHead>Bölüm</TableHead>
//                     <TableHead>Sınıf</TableHead>
//                     <TableHead>Başvuru Tarihi</TableHead>
//                     <TableHead>Red Tarihi</TableHead>
//                     <TableHead>Red Nedeni</TableHead>
//                     <TableHead>Durum</TableHead>
//                   </TableRow>
//                 </TableHeader>

//                 <TableBody>
//                   {!rejectedApplications || rejectedApplications.length === 0 ? (
//                     <TableRow>
//                       <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
//                         Reddedilen başvuru bulunmuyor
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     rejectedApplications.map((app) => (
//                       <TableRow key={app.id}>
//                         <TableCell className="font-medium">{app.full_name}</TableCell>
//                         <TableCell>{app.email}</TableCell>
//                         <TableCell>{app.department || '-'}</TableCell>
//                         <TableCell>{app.grade || '-'}</TableCell>
//                         <TableCell className="text-sm text-muted-foreground">
//                           {formatDate(app.created_at)}
//                         </TableCell>
//                         <TableCell className="text-sm text-muted-foreground">
//                           {app.reviewed_at ? formatDate(app.reviewed_at) : '-'}
//                         </TableCell>
//                         <TableCell className="max-w-xs">
//                           <p className="text-sm text-muted-foreground truncate" title={app.rejection_reason}>
//                             {app.rejection_reason || 'Belirtilmemiş'}
//                           </p>
//                         </TableCell>
//                         <TableCell>
//                           <Badge variant="destructive">
//                             <XCircle className="h-3 w-3 mr-1" />
//                             Reddedildi
//                           </Badge>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// app/admin/sonuclanan-basvurular/page.tsx
import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase/server"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, FileCheck, Download } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import PDFDownloadButton from "./pdf-download-button"

export default async function SonuclananBasvurularPage() {
  const supabase = await createSupabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/admin/login")

  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (me?.role !== 'admin' && me?.role !== 'super_admin') {
    redirect("/")
  }

  // Onaylanan başvurular
  const { data: approvedApplications } = await supabase
    .from("membership_applications")
    .select("*")
    .eq("status", "approved")
    .order("reviewed_at", { ascending: false })

  // Reddedilen başvurular
  const { data: rejectedApplications } = await supabase
    .from("membership_applications")
    .select("*")
    .eq("status", "rejected")
    .order("reviewed_at", { ascending: false })

  const totalApproved = approvedApplications?.length || 0
  const totalRejected = rejectedApplications?.length || 0

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6 p-6">
      {/* Başlık */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Sonuçlanan Başvurular
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Onaylanan ve reddedilen tüm başvuruları görüntüleyin
        </p>
      </div>

      {/* İstatistikler */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Sonuçlanan
            </CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApproved + totalRejected}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Onaylanan
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalApproved}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalApproved + totalRejected > 0 
                ? `%${Math.round((totalApproved / (totalApproved + totalRejected)) * 100)}` 
                : '0%'} onay oranı
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Reddedilen
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalRejected}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalApproved + totalRejected > 0 
                ? `%${Math.round((totalRejected / (totalApproved + totalRejected)) * 100)}` 
                : '0%'} red oranı
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Başvuru Geçmişi</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="approved" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="approved" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Onaylananlar ({totalApproved})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Rededilenler ({totalRejected})
              </TabsTrigger>
            </TabsList>

            {/* Onaylanan Başvurular */}
            <TabsContent value="approved">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ad Soyad</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Bölüm</TableHead>
                    <TableHead>Sınıf</TableHead>
                    <TableHead>Başvuru Tarihi</TableHead>
                    <TableHead>Onay Tarihi</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {!approvedApplications || approvedApplications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        Onaylanan başvuru bulunmuyor
                      </TableCell>
                    </TableRow>
                  ) : (
                    approvedApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.full_name}</TableCell>
                        <TableCell>{app.email}</TableCell>
                        <TableCell>{app.department || '-'}</TableCell>
                        <TableCell>{app.grade || '-'}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(app.created_at)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {app.reviewed_at ? formatDate(app.reviewed_at) : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Onaylandı
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <PDFDownloadButton application={app} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            {/* Reddedilen Başvurular */}
            <TabsContent value="rejected">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ad Soyad</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Bölüm</TableHead>
                    <TableHead>Sınıf</TableHead>
                    <TableHead>Başvuru Tarihi</TableHead>
                    <TableHead>Red Tarihi</TableHead>
                    <TableHead>Red Nedeni</TableHead>
                    <TableHead>Durum</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {!rejectedApplications || rejectedApplications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        Reddedilen başvuru bulunmuyor
                      </TableCell>
                    </TableRow>
                  ) : (
                    rejectedApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.full_name}</TableCell>
                        <TableCell>{app.email}</TableCell>
                        <TableCell>{app.department || '-'}</TableCell>
                        <TableCell>{app.grade || '-'}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(app.created_at)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {app.reviewed_at ? formatDate(app.reviewed_at) : '-'}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="text-sm text-muted-foreground truncate" title={app.rejection_reason}>
                            {app.rejection_reason || 'Belirtilmemiş'}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive">
                            <XCircle className="h-3 w-3 mr-1" />
                            Reddedildi
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}