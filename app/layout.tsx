import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Comptalvoire - Suivi Comptable en Ligne",
  description: "Finance Simplifiée pour Entreprises Africaines - Côte d'Ivoire",
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
