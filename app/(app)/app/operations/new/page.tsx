"use client"

import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/PageHeader"
import { Card, CardContent } from "@/components/ui/card"
import { OperationForm } from "@/components/OperationForm"

export default function NewOperationPage() {
  const router = useRouter()

  const handleSubmit = () => {
    router.push("/app/operations")
  }

  const handleCancel = () => {
    router.push("/app/operations")
  }

  return (
    <div>
      <PageHeader title="Nouvelle opération" />
      <Card>
        <CardContent className="p-6">
          <OperationForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </CardContent>
      </Card>
    </div>
  )
}
