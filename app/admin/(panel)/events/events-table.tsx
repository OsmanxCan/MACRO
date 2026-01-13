// app/admin/(panel)/events/events-table.tsx (Client Component)
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
import Link from "next/link"
import { Pencil, Calendar } from "lucide-react"
import DeleteEventButton from "./delete-button"
import { useSanitize } from "@/lib/hooks/useSanitize"

interface Event {
  id: string
  title: string
  description?: string
  date: string
}

function EventRow({ event }: { event: Event }) {
  const sanitizedDescription = useSanitize(event.description || "Açıklama yok")
  const eventDate = new Date(event.date)
  const now = new Date()
  const isPast = eventDate < now

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <div className="max-w-xs truncate">{event.title}</div>
        </div>
      </TableCell>

      <TableCell>
        {sanitizedDescription && (
          <div
            className="max-w-md line-clamp-2 text-sm text-gray-600 dark:text-gray-400"
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />
        )}
      </TableCell>

      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
        {eventDate.toLocaleDateString("tr-TR", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </TableCell>

      <TableCell>
        <Badge variant={isPast ? "secondary" : "default"}>
          {isPast ? "Geçmiş" : "Yaklaşan"}
        </Badge>
      </TableCell>

      <TableCell>
        <div className="flex gap-2 justify-end">
          <Link href={`/admin/events/edit/${event.id}`}>
            <Button variant="outline" size="sm">
              <Pencil className="w-4 h-4 mr-1" />
              Düzenle
            </Button>
          </Link>
          <DeleteEventButton id={event.id} />
        </div>
      </TableCell>
    </TableRow>
  )
}

interface EventsTableProps {
  events: Event[]
}

export default function EventsTable({ events }: EventsTableProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Başlık</TableHead>
            <TableHead>Açıklama</TableHead>
            <TableHead className="w-[150px]">Tarih</TableHead>
            <TableHead className="w-[120px]">Durum</TableHead>
            <TableHead className="w-[200px] text-right">İşlemler</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {events.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                Henüz etkinlik yok. Yeni bir etkinlik oluşturun!
              </TableCell>
            </TableRow>
          ) : (
            events.map((event) => (
              <EventRow key={event.id} event={event} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}