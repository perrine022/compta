"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { PageHeader } from "@/components/PageHeader"
import { Button } from "@/components/ui/button"
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
import { Plus, Eye, Edit, Trash2 } from "lucide-react"
import { operationStore, accountStore, type Operation } from "@/lib/mockStore"
import { format } from "date-fns"
import { fr } from "date-fns/locale/fr"
import { OperationForm } from "@/components/OperationForm"
import { formatCurrency } from "@/lib/format"

export default function OperationsPage() {
  const router = useRouter()
  const [operations, setOperations] = useState(operationStore.getAll())
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    accountId: "all",
    status: "all",
  })
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [operationToDelete, setOperationToDelete] = useState<Operation | null>(null)

  const accounts = accountStore.getAll()

  const filteredOperations = useMemo(() => {
    return operations.filter((op) => {
      if (filters.search && !op.description.toLowerCase().includes(filters.search.toLowerCase()) && !op.thirdParty.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }
      if (filters.type !== "all" && op.type !== filters.type) {
        return false
      }
      if (filters.accountId !== "all" && op.accountId !== filters.accountId) {
        return false
      }
      if (filters.status !== "all" && op.status !== filters.status) {
        return false
      }
      return true
    })
  }, [operations, filters])

  const handleDelete = () => {
    if (operationToDelete) {
      operationStore.delete(operationToDelete.id)
      setOperations(operationStore.getAll())
      setDeleteDialogOpen(false)
      setOperationToDelete(null)
    }
  }

  const handleEdit = (op: Operation) => {
    setSelectedOperation(op)
    setEditDialogOpen(true)
  }

  const handleFormSubmit = () => {
    setOperations(operationStore.getAll())
    setEditDialogOpen(false)
    setSelectedOperation(null)
  }

  return (
    <div>
      <PageHeader
        title="Opérations"
        description="Gérez vos dépenses et recettes"
        actions={
          <Link href="/app/operations/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter opération
            </Button>
          </Link>
        }
      />

      <div className="bg-card rounded-2xl border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Rechercher..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <Select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="all">Tous les types</option>
            <option value="expense">Dépense</option>
            <option value="revenue">Recette</option>
          </Select>
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
          <Select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">Tous les statuts</option>
            <option value="draft">Brouillon</option>
            <option value="validated">Validée</option>
          </Select>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Tiers</TableHead>
              <TableHead>Compte</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOperations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-500">
                  Aucune opération trouvée
                </TableCell>
              </TableRow>
            ) : (
              filteredOperations.map((op) => {
                const account = accounts.find((a) => a.id === op.accountId)
                return (
                  <TableRow key={op.id}>
                    <TableCell>
                      {format(new Date(op.date), "dd/MM/yyyy", { locale: fr })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={op.type === "expense" ? "default" : "success"}
                      >
                        {op.type === "expense" ? "Dépense" : "Recette"}
                      </Badge>
                    </TableCell>
                    <TableCell>{op.description}</TableCell>
                    <TableCell>{op.thirdParty}</TableCell>
                    <TableCell>
                      {account ? `${account.number} - ${account.label}` : "-"}
                    </TableCell>
                    <TableCell>{formatCurrency(op.amount)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {op.status === "validated" ? "Validée" : "Brouillon"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(op)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(op)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setOperationToDelete(op)
                            setDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedOperation ? "Modifier l'opération" : "Voir l'opération"}
            </DialogTitle>
          </DialogHeader>
          {selectedOperation && (
            <OperationForm
              operation={selectedOperation}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setEditDialogOpen(false)
                setSelectedOperation(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l&apos;opération</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Êtes-vous sûr de vouloir supprimer cette opération ? Cette action est irréversible.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setOperationToDelete(null)
              }}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
