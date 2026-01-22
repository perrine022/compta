// Mock store avec localStorage pour simuler un backend

export type OperationType = "expense" | "revenue"
export type OperationStatus = "draft" | "validated"
export type PaymentMethod = "card" | "transfer" | "cash" | "direct_debit"
export type AccountType = "charge" | "product" | "bank" | "vat"

export interface Account {
  id: string
  number: string
  label: string
  type: AccountType
  active: boolean
}

export interface Operation {
  id: string
  type: OperationType
  date: string
  amount: number
  vatRate?: number
  vatAmount?: number
  accountId: string
  thirdParty: string
  description: string
  paymentMethod: PaymentMethod
  documentUrl?: string
  documentName?: string
  status: OperationStatus
  createdAt: string
}

export interface JournalEntry {
  id: string
  operationId: string
  date: string
  description: string
  lines: JournalLine[]
  createdAt: string
}

export interface JournalLine {
  accountId: string
  accountNumber: string
  accountLabel: string
  debit: number
  credit: number
}

export interface Company {
  id: string
  name: string
  address: string
  fiscalYearStart: string
  fiscalYearEnd: string
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  companyId: string
}

const STORAGE_KEYS = {
  ACCOUNTS: "compta_accounts",
  OPERATIONS: "compta_operations",
  JOURNAL: "compta_journal",
  COMPANY: "compta_company",
  USER: "compta_user",
}

// Initialisation avec données de démo
function initDemoData() {
  if (typeof window === "undefined") return

  const hasData = localStorage.getItem(STORAGE_KEYS.ACCOUNTS)
  if (hasData) return

  // Comptes de base
  const accounts: Account[] = [
    { id: "1", number: "512", label: "Banque", type: "bank", active: true },
    { id: "2", number: "606", label: "Achats", type: "charge", active: true },
    { id: "3", number: "701", label: "Ventes", type: "product", active: true },
    { id: "4", number: "44566", label: "TVA déductible", type: "vat", active: true },
    { id: "5", number: "44571", label: "TVA collectée", type: "vat", active: true },
  ]
  localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts))

  // Entreprise (Côte d'Ivoire)
  const company: Company = {
    id: "1",
    name: "Demo Company CI",
    address: "Cocody, Abidjan, Côte d'Ivoire",
    fiscalYearStart: "2024-01-01",
    fiscalYearEnd: "2024-12-31",
  }
  localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(company))

  // Quelques opérations de démo (Côte d'Ivoire - TVA 18%)
  const now = new Date()
  const operations: Operation[] = [
    {
      id: "1",
      type: "expense",
      date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      amount: 150000, // 150 000 XOF
      vatRate: 18,
      vatAmount: 22881.36, // TVA 18% sur 150 000 XOF
      accountId: "2",
      thirdParty: "Fournisseur Abidjan",
      description: "Achat matériel informatique",
      paymentMethod: "transfer",
      status: "validated",
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      type: "revenue",
      date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      amount: 500000, // 500 000 XOF
      vatRate: 18,
      vatAmount: 76271.19, // TVA 18% sur 500 000 XOF
      accountId: "3",
      thirdParty: "Client Cocody",
      description: "Prestation de service",
      paymentMethod: "transfer",
      status: "validated",
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]
  localStorage.setItem(STORAGE_KEYS.OPERATIONS, JSON.stringify(operations))

  // Écritures de journal associées
  const journalEntries: JournalEntry[] = [
    {
      id: "1",
      operationId: "1",
      date: operations[0].date,
      description: operations[0].description,
      lines: [
        { accountId: "2", accountNumber: "606", accountLabel: "Achats", debit: 127118.64, credit: 0 },
        { accountId: "4", accountNumber: "44566", accountLabel: "TVA déductible", debit: 22881.36, credit: 0 },
        { accountId: "1", accountNumber: "512", accountLabel: "Banque", debit: 0, credit: 150000 },
      ],
      createdAt: operations[0].createdAt,
    },
    {
      id: "2",
      operationId: "2",
      date: operations[1].date,
      description: operations[1].description,
      lines: [
        { accountId: "1", accountNumber: "512", accountLabel: "Banque", debit: 500000, credit: 0 },
        { accountId: "3", accountNumber: "701", accountLabel: "Ventes", debit: 0, credit: 423728.81 },
        { accountId: "5", accountNumber: "44571", accountLabel: "TVA collectée", debit: 0, credit: 76271.19 },
      ],
      createdAt: operations[1].createdAt,
    },
  ]
  localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(journalEntries))
}

// Comptes
export const accountStore = {
  getAll: (): Account[] => {
    if (typeof window === "undefined") return []
    initDemoData()
    const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS)
    return data ? JSON.parse(data) : []
  },
  getById: (id: string): Account | undefined => {
    return accountStore.getAll().find((a) => a.id === id)
  },
  create: (account: Omit<Account, "id">): Account => {
    const accounts = accountStore.getAll()
    const newAccount: Account = {
      ...account,
      id: Date.now().toString(),
    }
    accounts.push(newAccount)
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts))
    return newAccount
  },
  update: (id: string, updates: Partial<Account>): Account | null => {
    const accounts = accountStore.getAll()
    const index = accounts.findIndex((a) => a.id === id)
    if (index === -1) return null
    accounts[index] = { ...accounts[index], ...updates }
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts))
    return accounts[index]
  },
  deactivate: (id: string): boolean => {
    const account = accountStore.getById(id)
    if (!account) return false
    accountStore.update(id, { active: false })
    return true
  },
}

// Opérations
export const operationStore = {
  getAll: (): Operation[] => {
    if (typeof window === "undefined") return []
    initDemoData()
    const data = localStorage.getItem(STORAGE_KEYS.OPERATIONS)
    return data ? JSON.parse(data) : []
  },
  getById: (id: string): Operation | undefined => {
    return operationStore.getAll().find((o) => o.id === id)
  },
  create: (operation: Omit<Operation, "id" | "createdAt">): Operation => {
    const operations = operationStore.getAll()
    const newOperation: Operation = {
      ...operation,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    operations.push(newOperation)
    localStorage.setItem(STORAGE_KEYS.OPERATIONS, JSON.stringify(operations))

    // Générer écriture de journal si validée
    if (newOperation.status === "validated") {
      journalStore.createFromOperation(newOperation)
    }

    return newOperation
  },
  update: (id: string, updates: Partial<Operation>): Operation | null => {
    const operations = operationStore.getAll()
    const index = operations.findIndex((o) => o.id === id)
    if (index === -1) return null
    
    const oldOperation = operations[index]
    operations[index] = { ...operations[index], ...updates }
    const updatedOperation = operations[index]
    
    localStorage.setItem(STORAGE_KEYS.OPERATIONS, JSON.stringify(operations))
    
    // Générer écriture de journal si le statut passe à "validated"
    if (updatedOperation.status === "validated" && oldOperation.status !== "validated") {
      // Vérifier qu'une écriture n'existe pas déjà
      const existingEntry = journalStore.getByOperationId(id)
      if (!existingEntry) {
        journalStore.createFromOperation(updatedOperation)
      }
    }
    
    return updatedOperation
  },
  delete: (id: string): boolean => {
    const operations = operationStore.getAll()
    const filtered = operations.filter((o) => o.id !== id)
    localStorage.setItem(STORAGE_KEYS.OPERATIONS, JSON.stringify(filtered))
    return filtered.length < operations.length
  },
}

// Journal
export const journalStore = {
  getAll: (): JournalEntry[] => {
    if (typeof window === "undefined") return []
    initDemoData()
    const data = localStorage.getItem(STORAGE_KEYS.JOURNAL)
    return data ? JSON.parse(data) : []
  },
  getById: (id: string): JournalEntry | undefined => {
    return journalStore.getAll().find((j) => j.id === id)
  },
  getByOperationId: (operationId: string): JournalEntry | undefined => {
    return journalStore.getAll().find((j) => j.operationId === operationId)
  },
  createFromOperation: (operation: Operation): JournalEntry => {
    const accounts = accountStore.getAll()
    const operationAccount = accounts.find((a) => a.id === operation.accountId)
    const bankAccount = accounts.find((a) => a.number === "512")
    
    if (!operationAccount || !bankAccount) {
      throw new Error("Comptes introuvables")
    }

    const amountHT = operation.vatAmount ? operation.amount - operation.vatAmount : operation.amount
    const lines: JournalLine[] = []

    if (operation.type === "expense") {
      // Débit compte de charge
      lines.push({
        accountId: operationAccount.id,
        accountNumber: operationAccount.number,
        accountLabel: operationAccount.label,
        debit: amountHT,
        credit: 0,
      })
      // Débit TVA si applicable
      if (operation.vatAmount && operation.vatRate) {
        const vatAccount = accounts.find((a) => a.number === "44566")
        if (vatAccount) {
          lines.push({
            accountId: vatAccount.id,
            accountNumber: vatAccount.number,
            accountLabel: vatAccount.label,
            debit: operation.vatAmount,
            credit: 0,
          })
        }
      }
      // Crédit banque
      lines.push({
        accountId: bankAccount.id,
        accountNumber: bankAccount.number,
        accountLabel: bankAccount.label,
        debit: 0,
        credit: operation.amount,
      })
    } else {
      // Recette: Débit banque
      lines.push({
        accountId: bankAccount.id,
        accountNumber: bankAccount.number,
        accountLabel: bankAccount.label,
        debit: operation.amount,
        credit: 0,
      })
      // Crédit compte produit
      lines.push({
        accountId: operationAccount.id,
        accountNumber: operationAccount.number,
        accountLabel: operationAccount.label,
        debit: 0,
        credit: amountHT,
      })
      // Crédit TVA si applicable
      if (operation.vatAmount && operation.vatRate) {
        const vatAccount = accounts.find((a) => a.number === "44571")
        if (vatAccount) {
          lines.push({
            accountId: vatAccount.id,
            accountNumber: vatAccount.number,
            accountLabel: vatAccount.label,
            debit: 0,
            credit: operation.vatAmount,
          })
        }
      }
    }

    const entries = journalStore.getAll()
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      operationId: operation.id,
      date: operation.date,
      description: operation.description,
      lines,
      createdAt: new Date().toISOString(),
    }
    entries.push(newEntry)
    localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(entries))
    return newEntry
  },
}

// Entreprise
export const companyStore = {
  get: (): Company | null => {
    if (typeof window === "undefined") return null
    initDemoData()
    const data = localStorage.getItem(STORAGE_KEYS.COMPANY)
    return data ? JSON.parse(data) : null
  },
  update: (updates: Partial<Company>): Company | null => {
    const company = companyStore.get()
    if (!company) return null
    const updated = { ...company, ...updates }
    localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(updated))
    return updated
  },
}

// User (pour l'auth mock)
export const userStore = {
  get: (): User | null => {
    if (typeof window === "undefined") return null
    const data = localStorage.getItem(STORAGE_KEYS.USER)
    return data ? JSON.parse(data) : null
  },
  set: (user: User): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  },
  clear: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER)
  },
}
