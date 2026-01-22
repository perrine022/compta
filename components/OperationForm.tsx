"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { operationStore, accountStore, type Operation, type OperationType } from "@/lib/mockStore"
import { DEFAULT_VAT_RATE } from "@/lib/format"

const operationSchema = z.object({
  type: z.enum(["expense", "revenue"]),
  date: z.string(),
  amount: z.number().positive(),
  vatRate: z.number().optional(),
  accountId: z.string(),
  thirdParty: z.string().min(1),
  description: z.string().min(1),
  paymentMethod: z.enum(["card", "transfer", "cash", "direct_debit"]),
  status: z.enum(["draft", "validated"]),
})

type OperationFormData = z.infer<typeof operationSchema>

interface OperationFormProps {
  operation?: Operation
  onSubmit: () => void
  onCancel: () => void
}

export function OperationForm({ operation, onSubmit, onCancel }: OperationFormProps) {
  const [hasVat, setHasVat] = useState(!!operation?.vatRate)
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [documentUrl, setDocumentUrl] = useState<string | undefined>(operation?.documentUrl)
  const accounts = accountStore.getAll()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OperationFormData>({
    resolver: zodResolver(operationSchema),
    defaultValues: operation
      ? {
          type: operation.type,
          date: operation.date,
          amount: operation.amount,
          vatRate: operation.vatRate,
          accountId: operation.accountId,
          thirdParty: operation.thirdParty,
          description: operation.description,
          paymentMethod: operation.paymentMethod,
          status: operation.status,
        }
      : {
          type: "expense",
          date: new Date().toISOString().split("T")[0],
          amount: 0,
          accountId: "",
          thirdParty: "",
          description: "",
          paymentMethod: "transfer",
          status: "draft",
        },
  })

  const type = watch("type")
  const amount = watch("amount")
  const vatRate = watch("vatRate")

  const availableAccounts = accounts.filter((acc) => {
    if (type === "expense") {
      return acc.type === "charge" || acc.type === "bank"
    } else {
      return acc.type === "product" || acc.type === "bank"
    }
  })

  useEffect(() => {
    if (hasVat && !vatRate) {
      setValue("vatRate", DEFAULT_VAT_RATE)
    } else if (!hasVat) {
      setValue("vatRate", undefined)
    }
  }, [hasVat, vatRate, setValue])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setDocumentFile(file)
      const url = URL.createObjectURL(file)
      setDocumentUrl(url)
    }
  }

  const onFormSubmit = (data: OperationFormData, status?: "draft" | "validated") => {
    const finalStatus = status || data.status
    const operationData: Omit<Operation, "id" | "createdAt"> = {
      ...data,
      status: finalStatus,
      vatAmount: data.vatRate
        ? (data.amount * data.vatRate) / (100 + data.vatRate)
        : undefined,
      documentUrl: documentUrl,
      documentName: documentFile?.name,
    }

    if (operation) {
      operationStore.update(operation.id, operationData)
    } else {
      operationStore.create(operationData)
    }

    onSubmit()
  }

  const vatAmount = hasVat && vatRate && amount
    ? (amount * vatRate) / (100 + vatRate)
    : 0
  const amountHT = amount - vatAmount

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={watch("type")}
            onChange={(e) => setValue("type", e.target.value as OperationType)}
          >
            <option value="expense">Dépense</option>
            <option value="revenue">Recette</option>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Date</Label>
          <Input type="date" {...register("date")} />
          {errors.date && (
            <p className="text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Montant TTC (XOF)</Label>
        <Input
          type="number"
          step="0.01"
          {...register("amount", { valueAsNumber: true })}
        />
        {errors.amount && (
          <p className="text-sm text-red-600">{errors.amount.message}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          checked={hasVat}
          onCheckedChange={(checked) => setHasVat(checked as boolean)}
        />
        <Label>Inclure la TVA</Label>
      </div>

      {hasVat && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Taux TVA (%)</Label>
            <Input
              type="number"
              step="0.1"
              {...register("vatRate", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <Label>Montant HT</Label>
            <Input type="text" value={amountHT.toFixed(2)} disabled />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Compte</Label>
        <Select
          value={watch("accountId")}
          onChange={(e) => setValue("accountId", e.target.value)}
        >
          <option value="">Sélectionner un compte</option>
          {availableAccounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.number} - {acc.label}
            </option>
          ))}
        </Select>
        {errors.accountId && (
          <p className="text-sm text-red-600">{errors.accountId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Tiers</Label>
        <Input {...register("thirdParty")} />
        {errors.thirdParty && (
          <p className="text-sm text-red-600">{errors.thirdParty.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Description / Libellé</Label>
        <Input {...register("description")} />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Moyen de paiement</Label>
        <Select
          value={watch("paymentMethod")}
          onChange={(e) =>
            setValue("paymentMethod", e.target.value as any)
          }
        >
          <option value="card">Carte bancaire</option>
          <option value="transfer">Virement</option>
          <option value="cash">Espèces</option>
          <option value="direct_debit">Prélèvement</option>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Justificatif (PDF/Image)</Label>
        <Input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
        />
        {documentUrl && (
          <p className="text-sm text-gray-600">
            Fichier: {documentFile?.name || operation?.documentName}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleSubmit((data) => onFormSubmit(data, "draft"))}
        >
          Enregistrer brouillon
        </Button>
        <Button
          type="button"
          variant="success"
          onClick={handleSubmit((data) => onFormSubmit(data, "validated"))}
        >
          Valider
        </Button>
      </div>
    </form>
  )
}
