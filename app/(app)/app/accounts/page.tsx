"use client"

import { useState } from "react"
import { PageHeader } from "@/components/PageHeader"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Plus, Edit, X } from "lucide-react"
import { accountStore, type Account, type AccountType } from "@/lib/mockStore"

export default function AccountsPage() {
  const [accounts, setAccounts] = useState(accountStore.getAll())
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [formData, setFormData] = useState({
    number: "",
    label: "",
    type: "charge" as AccountType,
    active: true,
  })

  const handleOpenDialog = (account?: Account) => {
    if (account) {
      setSelectedAccount(account)
      setFormData({
        number: account.number,
        label: account.label,
        type: account.type,
        active: account.active,
      })
    } else {
      setSelectedAccount(null)
      setFormData({
        number: "",
        label: "",
        type: "charge",
        active: true,
      })
    }
    setEditDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedAccount) {
      accountStore.update(selectedAccount.id, formData)
    } else {
      accountStore.create(formData)
    }
    setAccounts(accountStore.getAll())
    setEditDialogOpen(false)
    setSelectedAccount(null)
  }

  const handleDeactivate = (id: string) => {
    if (confirm("Désactiver ce compte ?")) {
      accountStore.deactivate(id)
      setAccounts(accountStore.getAll())
    }
  }

  const getAccountTypeLabel = (type: AccountType) => {
    const labels: Record<AccountType, string> = {
      charge: "Charge",
      product: "Produit",
      bank: "Banque",
      vat: "TVA",
    }
    return labels[type]
  }

  return (
    <div>
      <PageHeader
        title="Comptes comptables"
        description="Gérez vos comptes comptables"
        actions={
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un compte
          </Button>
        }
      />

      <div className="bg-card rounded-2xl border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Numéro</TableHead>
              <TableHead>Libellé</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  Aucun compte trouvé
                </TableCell>
              </TableRow>
            ) : (
              accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.number}</TableCell>
                  <TableCell>{account.label}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getAccountTypeLabel(account.type)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={account.active ? "success" : "secondary"}>
                      {account.active ? "Actif" : "Inactif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(account)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {account.active && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeactivate(account.id)}
                        >
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedAccount ? "Modifier le compte" : "Nouveau compte"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Numéro</Label>
              <Input
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Libellé</Label>
              <Input
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as AccountType })}
              >
                <option value="charge">Charge</option>
                <option value="product">Produit</option>
                <option value="bank">Banque</option>
                <option value="vat">TVA</option>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit">Enregistrer</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
