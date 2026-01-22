import { userStore, companyStore } from "./mockStore"

export interface AuthUser {
  id: string
  firstName: string
  lastName: string
  email: string
  companyId: string
  companyName: string
}

export const auth = {
  getCurrentUser: (): AuthUser | null => {
    const user = userStore.get()
    if (!user) return null
    const company = companyStore.get()
    return {
      ...user,
      companyName: company?.name || "Entreprise",
    }
  },
  isAuthenticated: (): boolean => {
    return userStore.get() !== null
  },
  login: (email: string, password: string): AuthUser | null => {
    // Mock: accepter n'importe quel email/password pour la démo
    // En production, vérifier contre une vraie base
    const company = companyStore.get()
    if (!company) return null

    const user = {
      id: "1",
      firstName: "Demo",
      lastName: "User",
      email,
      companyId: company.id,
    }
    userStore.set(user)
    return {
      ...user,
      companyName: company.name,
    }
  },
  register: (data: {
    firstName: string
    lastName: string
    email: string
    password: string
    companyName: string
  }): AuthUser | null => {
    const company = companyStore.get()
    if (!company) {
      // Créer une nouvelle entreprise si nécessaire
      const newCompany = {
        id: "1",
        name: data.companyName,
        address: "",
        fiscalYearStart: new Date().toISOString().split("T")[0],
        fiscalYearEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
          .toISOString()
          .split("T")[0],
      }
      companyStore.update(newCompany)
    }

    const user = {
      id: Date.now().toString(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      companyId: company?.id || "1",
    }
    userStore.set(user)
    return {
      ...user,
      companyName: data.companyName,
    }
  },
  logout: (): void => {
    userStore.clear()
  },
}
