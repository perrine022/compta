"use client"

import { useMemo, useState } from "react"
import { PageHeader } from "@/components/PageHeader"
import { KpiCard } from "@/components/KpiCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { TrendingDown, TrendingUp, Wallet } from "lucide-react"
import { operationStore } from "@/lib/mockStore"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale/fr"
import { formatCurrency } from "@/lib/format"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function DashboardPage() {
  const [period, setPeriod] = useState("month")
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  })
  const [compareMonth1, setCompareMonth1] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  })
  const [compareMonth2, setCompareMonth2] = useState(() => {
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    return `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, "0")}`
  })
  const operations = operationStore.getAll()

  const { totalExpenses, totalRevenues, balance, chartData, recentOperations } = useMemo(() => {
    const now = new Date()
    let startDate: Date
    let endDate: Date

    switch (period) {
      case "month":
        // Utiliser le mois sélectionné
        const [year, month] = selectedMonth.split("-").map(Number)
        startDate = new Date(year, month - 1, 1)
        endDate = new Date(year, month, 0, 23, 59, 59) // Dernier jour du mois
        break
      case "quarter":
        const quarter = Math.floor(now.getMonth() / 3)
        startDate = new Date(now.getFullYear(), quarter * 3, 1)
        endDate = new Date(now.getFullYear(), quarter * 3 + 3, 0, 23, 59, 59)
        break
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1)
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59)
        break
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
    }

    const filtered = operations.filter(
      (op) => {
        const opDate = new Date(op.date)
        return opDate >= startDate && opDate <= endDate && op.status === "validated"
      }
    )

    const totalExpenses = filtered
      .filter((op) => op.type === "expense")
      .reduce((sum, op) => sum + op.amount, 0)

    const totalRevenues = filtered
      .filter((op) => op.type === "revenue")
      .reduce((sum, op) => sum + op.amount, 0)

    const balance = totalRevenues - totalExpenses

    // Données pour le graphique (groupées par mois)
    const monthlyData: Record<string, { expenses: number; revenues: number }> = {}
    filtered.forEach((op) => {
      const month = format(new Date(op.date), "MMM yyyy", { locale: fr })
      if (!monthlyData[month]) {
        monthlyData[month] = { expenses: 0, revenues: 0 }
      }
      if (op.type === "expense") {
        monthlyData[month].expenses += op.amount
      } else {
        monthlyData[month].revenues += op.amount
      }
    })

    const chartData = Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        dépenses: data.expenses,
        recettes: data.revenues,
      }))
      .sort((a, b) => a.month.localeCompare(b.month))

    // Pour le mode mois, afficher les opérations du mois sélectionné
    // Sinon, afficher les 5 dernières opérations
    const recentOperations = period === "month"
      ? filtered
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 10)
      : operations
          .filter((op) => op.status === "validated")
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5)

    return {
      totalExpenses,
      totalRevenues,
      balance,
      chartData,
      recentOperations,
    }
  }, [operations, period, selectedMonth])

  // Calculs pour la comparaison de deux mois
  const comparisonData = useMemo(() => {
    if (period !== "compare") return null

    const getMonthData = (monthStr: string) => {
      const [year, month] = monthStr.split("-").map(Number)
      const startDate = new Date(year, month - 1, 1)
      const endDate = new Date(year, month, 0, 23, 59, 59)

      const filtered = operations.filter(
        (op) => {
          const opDate = new Date(op.date)
          return opDate >= startDate && opDate <= endDate && op.status === "validated"
        }
      )

      const expenses = filtered
        .filter((op) => op.type === "expense")
        .reduce((sum, op) => sum + op.amount, 0)

      const revenues = filtered
        .filter((op) => op.type === "revenue")
        .reduce((sum, op) => sum + op.amount, 0)

      return {
        expenses,
        revenues,
        balance: revenues - expenses,
        count: filtered.length,
      }
    }

    const month1Data = getMonthData(compareMonth1)
    const month2Data = getMonthData(compareMonth2)

    const diffExpenses = month1Data.expenses - month2Data.expenses
    const diffRevenues = month1Data.revenues - month2Data.revenues
    const diffBalance = month1Data.balance - month2Data.balance

    const month1Label = format(new Date(compareMonth1 + "-01"), "MMMM yyyy", { locale: fr })
    const month2Label = format(new Date(compareMonth2 + "-01"), "MMMM yyyy", { locale: fr })

    return {
      month1: {
        ...month1Data,
        label: month1Label,
      },
      month2: {
        ...month2Data,
        label: month2Label,
      },
      diff: {
        expenses: diffExpenses,
        revenues: diffRevenues,
        balance: diffBalance,
      },
      chartData: [
        {
          mois: month1Label,
          "Dépenses": month1Data.expenses,
          "Recettes": month1Data.revenues,
        },
        {
          mois: month2Label,
          "Dépenses": month2Data.expenses,
          "Recettes": month2Data.revenues,
        },
      ],
    }
  }, [operations, period, compareMonth1, compareMonth2])

  return (
    <div>
      <PageHeader title="Dashboard" />
      <div className="mb-6 space-y-4">
        <Tabs value={period} onValueChange={setPeriod}>
          <TabsList>
            <TabsTrigger value="month">Mois</TabsTrigger>
            <TabsTrigger value="quarter">Trimestre</TabsTrigger>
            <TabsTrigger value="year">Année</TabsTrigger>
            <TabsTrigger value="compare">Comparaison</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {period === "month" && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="month-select" className="text-sm font-medium">
                Sélectionner le mois :
              </Label>
              <Input
                id="month-select"
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-48"
              />
            </div>
            <span className="text-sm text-gray-600">
              {format(new Date(selectedMonth + "-01"), "MMMM yyyy", { locale: fr })}
            </span>
          </div>
        )}

        {period === "compare" && comparisonData && (
          <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-2xl border border-gray-200">
            <div className="flex items-center gap-2">
              <Label htmlFor="month1-select" className="text-sm font-medium">
                Mois 1 :
              </Label>
              <Input
                id="month1-select"
                type="month"
                value={compareMonth1}
                onChange={(e) => setCompareMonth1(e.target.value)}
                className="w-48"
              />
              <span className="text-sm text-gray-600 font-medium">
                {comparisonData.month1.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="month2-select" className="text-sm font-medium">
                Mois 2 :
              </Label>
              <Input
                id="month2-select"
                type="month"
                value={compareMonth2}
                onChange={(e) => setCompareMonth2(e.target.value)}
                className="w-48"
              />
              <span className="text-sm text-gray-600 font-medium">
                {comparisonData.month2.label}
              </span>
            </div>
          </div>
        )}
      </div>

      {period === "compare" && comparisonData ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{comparisonData.month1.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Dépenses</p>
                    <p className="text-2xl font-semibold">{formatCurrency(comparisonData.month1.expenses)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Recettes</p>
                    <p className="text-2xl font-semibold text-accent">{formatCurrency(comparisonData.month1.revenues)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Solde</p>
                    <p className={`text-2xl font-semibold ${comparisonData.month1.balance >= 0 ? "text-accent" : "text-red-600"}`}>
                      {formatCurrency(comparisonData.month1.balance)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Nombre d&apos;opérations</p>
                    <p className="text-lg font-medium">{comparisonData.month1.count}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{comparisonData.month2.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Dépenses</p>
                    <p className="text-2xl font-semibold">{formatCurrency(comparisonData.month2.expenses)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Recettes</p>
                    <p className="text-2xl font-semibold text-accent">{formatCurrency(comparisonData.month2.revenues)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Solde</p>
                    <p className={`text-2xl font-semibold ${comparisonData.month2.balance >= 0 ? "text-accent" : "text-red-600"}`}>
                      {formatCurrency(comparisonData.month2.balance)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Nombre d&apos;opérations</p>
                    <p className="text-lg font-medium">{comparisonData.month2.count}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Évolution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 mb-4">
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-sm text-gray-600 mb-1">Différence Dépenses</p>
                  <p className={`text-xl font-semibold ${comparisonData.diff.expenses >= 0 ? "text-red-600" : "text-accent"}`}>
                    {comparisonData.diff.expenses >= 0 ? "+" : ""}{formatCurrency(comparisonData.diff.expenses)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {comparisonData.diff.expenses >= 0 ? "Augmentation" : "Diminution"}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-sm text-gray-600 mb-1">Différence Recettes</p>
                  <p className={`text-xl font-semibold ${comparisonData.diff.revenues >= 0 ? "text-accent" : "text-red-600"}`}>
                    {comparisonData.diff.revenues >= 0 ? "+" : ""}{formatCurrency(comparisonData.diff.revenues)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {comparisonData.diff.revenues >= 0 ? "Augmentation" : "Diminution"}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-sm text-gray-600 mb-1">Différence Solde</p>
                  <p className={`text-xl font-semibold ${comparisonData.diff.balance >= 0 ? "text-accent" : "text-red-600"}`}>
                    {comparisonData.diff.balance >= 0 ? "+" : ""}{formatCurrency(comparisonData.diff.balance)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {comparisonData.diff.balance >= 0 ? "Amélioration" : "Dégradation"}
                  </p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Dépenses" fill="#E7862C" />
                  <Bar dataKey="Recettes" fill="#40934B" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <KpiCard
              title="Total Dépenses"
              value={formatCurrency(totalExpenses)}
              icon={TrendingDown}
            />
            <KpiCard
              title="Total Recettes"
              value={formatCurrency(totalRevenues)}
              icon={TrendingUp}
            />
            <KpiCard
              title="Solde"
              value={formatCurrency(balance)}
              icon={Wallet}
              className={balance >= 0 ? "border-accent" : ""}
            />
          </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Évolution des dépenses et recettes</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="dépenses"
                stroke="#E7862C"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="recettes"
                stroke="#40934B"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
        </>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Dernières opérations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Tiers</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOperations.map((op) => (
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
                  <TableCell>{op.thirdParty}</TableCell>
                  <TableCell>{formatCurrency(op.amount)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {op.status === "validated" ? "Validée" : "Brouillon"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
