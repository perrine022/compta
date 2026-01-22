"use client"

import { PageHeader } from "@/components/PageHeader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, FileSpreadsheet } from "lucide-react"
import { operationStore, journalStore } from "@/lib/mockStore"
import { exportToCSV, exportToExcel } from "@/lib/export"

export default function ExportsPage() {
  const handleExportOperationsCSV = () => {
    const operations = operationStore.getAll()
    const data = operations.map((op) => ({
      Date: op.date,
      Type: op.type === "expense" ? "Dépense" : "Recette",
      Description: op.description,
      Tiers: op.thirdParty,
      Montant: op.amount,
      TVA: op.vatAmount || 0,
      "Moyen de paiement": op.paymentMethod,
      Statut: op.status === "validated" ? "Validée" : "Brouillon",
    }))
    exportToCSV(data, "operations.csv")
  }

  const handleExportOperationsExcel = async () => {
    const operations = operationStore.getAll()
    const data = operations.map((op) => ({
      Date: op.date,
      Type: op.type === "expense" ? "Dépense" : "Recette",
      Description: op.description,
      Tiers: op.thirdParty,
      Montant: op.amount,
      TVA: op.vatAmount || 0,
      "Moyen de paiement": op.paymentMethod,
      Statut: op.status === "validated" ? "Validée" : "Brouillon",
    }))
    await exportToExcel(data, "operations.xlsx")
  }

  const handleExportJournalCSV = () => {
    const entries = journalStore.getAll()
    const data = entries.flatMap((entry) =>
      entry.lines.map((line) => ({
        Date: entry.date,
        Description: entry.description,
        "Numéro compte": line.accountNumber,
        "Libellé compte": line.accountLabel,
        Débit: line.debit,
        Crédit: line.credit,
      }))
    )
    exportToCSV(data, "journal.csv")
  }

  return (
    <div>
      <PageHeader
        title="Exports"
        description="Exportez vos données dans différents formats"
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Exporter les opérations</CardTitle>
            </div>
            <CardDescription>
              Téléchargez toutes vos opérations au format CSV ou Excel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleExportOperationsCSV}
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter en CSV
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleExportOperationsExcel}
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Exporter en Excel
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Exporter le journal</CardTitle>
            </div>
            <CardDescription>
              Téléchargez toutes les écritures comptables au format CSV
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleExportJournalCSV}
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter le journal (CSV)
            </Button>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-400" />
              <CardTitle className="text-gray-500">Export PDF</CardTitle>
            </div>
            <CardDescription className="text-gray-400">
              Fonctionnalité à venir dans la version 1.0
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              <Download className="h-4 w-4 mr-2" />
              Exporter en PDF (V1)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
