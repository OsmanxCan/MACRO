import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Yönetici Girişi | MACRO",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
