import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Pilgrim - Marketplace de Voyages Spécialisés",
  description: "Voyages spécialisés, réservés simplement. Marketplace d'expériences de voyage uniques.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
