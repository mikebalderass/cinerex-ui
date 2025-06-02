import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard - CineMax",
  description: "Cinema management dashboard for administrators",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
