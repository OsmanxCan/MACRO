import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export function DashboardCard({
  title,
  href,
}: {
  title: string
  href: string
}) {
  return (
    <Link href={href}>
      <Card className="hover:bg-muted transition">
        <CardContent className="p-6 font-semibold">
          {title}
        </CardContent>
      </Card>
    </Link>
  )
}
