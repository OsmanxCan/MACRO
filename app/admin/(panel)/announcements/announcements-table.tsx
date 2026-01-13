// app/admin/(panel)/announcements/announcements-table.tsx (Client Component)

"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import DeleteAnnouncementButton from "./delete-button"
import Link from "next/link"
import { Pencil, ExternalLink, Video } from "lucide-react"
import DOMPurify from 'dompurify'

interface Announcement {
  id: string
  title: string
  content: string
  image_url?: string
  video_url?: string
  link?: string
  created_at: string
}

interface AnnouncementsTableProps {
  announcements: Announcement[]
}

export default function AnnouncementsTable({ announcements }: AnnouncementsTableProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Resim</TableHead>
            <TableHead>Başlık</TableHead>
            <TableHead>İçerik</TableHead>
            <TableHead className="w-[100px]">Medya</TableHead>
            <TableHead className="w-[150px]">Tarih</TableHead>
            <TableHead className="w-[200px] text-right">İşlemler</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {announcements.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                Henüz duyuru yok. Yeni bir duyuru oluşturun!
              </TableCell>
            </TableRow>
          ) : (
            announcements.map((announcement) => (
              <TableRow key={announcement.id}>
                <TableCell>
                  {announcement.image_url ? (
                    <img
                      src={announcement.image_url}
                      alt={announcement.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-400">N/A</span>
                    </div>
                  )}
                </TableCell>

                <TableCell className="font-medium">
                  <div className="max-w-xs truncate">{announcement.title}</div>
                </TableCell>

                <TableCell>
                  <div
                    className="max-w-xl line-clamp-2 text-sm text-gray-600 dark:text-gray-400"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(announcement.content || "Açıklama yok"),
                    }}
                  />
                </TableCell>

                <TableCell>
                  <div className="flex flex-col gap-1">
                    {announcement.link && (
                      <Badge variant="outline" className="w-fit">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Link
                      </Badge>
                    )}
                    {announcement.video_url && (
                      <Badge variant="outline" className="w-fit">
                        <Video className="w-3 h-3 mr-1" />
                        Video
                      </Badge>
                    )}
                  </div>
                </TableCell>

                <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(announcement.created_at).toLocaleDateString("tr-TR", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>

                <TableCell>
                  <div className="flex gap-2 justify-end">
                    <Link href={`/admin/announcements/edit/${announcement.id}`}>
                      <Button variant="outline" size="sm">
                        <Pencil className="w-4 h-4 mr-1" />
                        Düzenle
                      </Button>
                    </Link>
                    <DeleteAnnouncementButton id={announcement.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}