"use client"

import { useState, useMemo } from "react"
import { PageHeader } from "@/components/PageHeader"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { journalStore, accountStore, operationStore } from "@/lib/mockStore"
import { format } from "date-fns"
import { fr } from "date-fns/locale/fr"
import { formatCurrency } from "@/lib/format"

export default function JournalPage() {
  const [entries, setEntries] = useState(journalStore.getAll())
  const [filters, setFilters] = useState({
    search: "",
    accountId: "all",
  })
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null)

  const accounts = accountStore.getAll()
  const operations = operationStore.getAll()

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      if (filters.search && !entry.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }
      if (filters.accountId !== "all") {
        const hasAccount = entry.lines.some((line) => line.accountId === filters.accountId)
        if (!hasAccount) return false
      }
      return true
    })
  }, [entries, filters])

  const selectedEntryData = selectedEntry
    ? entries.find((e) => e.id === selectedEntry)
    : null

  return (
    <div>
      <PageHeader
        title="Journal"
        description="Écritures comptables générées automatiquement"
      />

      <div className="bg-card rounded-2xl border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Rechercher..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <Select
            value={filters.accountId}
            onChange={(e) => setFilters({ ...filters, accountId: e.target.value })}
          >
            <option value="all">Tous les comptes</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.number} - {acc.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Comptes</TableHead>
              <TableHead>Total Débit</TableHead>
              <TableHead>Total Crédit</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  Aucune écriture trouvée
                </TableCell>
              </TableRow>
            ) : (
              filteredEntries.map((entry) => {
                const totalDebit = entry.lines.reduce((sum, line) => sum + line.debit, 0)
                const totalCredit = entry.lines.reduce((sum, line) => sum + line.credit, 0)
                const accountsList = entry.lines.map((l) => l.accountNumber).join(", ")

                return (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {format(new Date(entry.date), "dd/MM/yyyy", { locale: fr })}
                    </TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {accountsList}
                    </TableCell>
                    <TableCell>{formatCurrency(totalDebit)}</TableCell>
                    <TableCell>{formatCurrency(totalCredit)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedEntry(entry.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedEntry} onOpenChange={(open) => !open && setSelectedEntry(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détail de l&apos;écriture</DialogTitle>
          </DialogHeader>
          {selectedEntryData && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium">
                  {format(new Date(selectedEntryData.date), "dd/MM/yyyy", { locale: fr })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Description</p>
                <p className="font-medium">{selectedEntryData.description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Lignes d&apos;écriture</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Compte</TableHead>
                      <TableHead>Libellé</TableHead>
                      <TableHead className="text-right">Débit</TableHead>
                      <TableHead className="text-right">Crédit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedEntryData.lines.map((line, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{line.accountNumber}</TableCell>
                        <TableCell>{line.accountLabel}</TableCell>
                        <TableCell className="text-right">
                          {line.debit > 0 ? formatCurrency(line.debit) : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          {line.credit > 0 ? formatCurrency(line.credit) : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <div className="flex gap-8">
                      <span>
                        {formatCurrency(
                          selectedEntryData.lines.reduce((sum, l) => sum + l.debit, 0)
                        )}
                      </span>
                      <span>
                        {formatCurrency(
                          selectedEntryData.lines.reduce((sum, l) => sum + l.credit, 0)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
