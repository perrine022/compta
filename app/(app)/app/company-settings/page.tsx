"use client"

import { useState, useMemo } from "react"
import { PageHeader } from "@/components/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { companyStore } from "@/lib/mockStore"
import { CheckCircle2 } from "lucide-react"

export default function CompanySettingsPage() {
  // Utiliser useMemo pour éviter de recréer l'objet à chaque render
  const company = useMemo(() => companyStore.get(), [])
  
  // Initialiser le state une seule fois avec une fonction
  const [formData, setFormData] = useState(() => ({
    name: company?.name || "",
    address: company?.address || "",
    fiscalYearStart: company?.fiscalYearStart || "",
    fiscalYearEnd: company?.fiscalYearEnd || "",
  }))
  const [saved, setSaved] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    companyStore.update(formData)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      <PageHeader
        title="Paramètres de la société"
        description="Gérez les informations de votre entreprise"
      />

      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nom de l&apos;entreprise</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Adresse</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Début exercice</Label>
                <Input
                  type="date"
                  value={formData.fiscalYearStart}
                  onChange={(e) =>
                    setFormData({ ...formData, fiscalYearStart: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Fin exercice</Label>
                <Input
                  type="date"
                  value={formData.fiscalYearEnd}
                  onChange={(e) =>
                    setFormData({ ...formData, fiscalYearEnd: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button type="submit" variant="success">
                Enregistrer
              </Button>
              {saved && (
                <div className="flex items-center gap-2 text-accent">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm">Enregistré</span>
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
