"use client"

import { Search, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/Logo"

export function Topbar() {
  const router = useRouter()
  const user = auth.getCurrentUser()

  const handleLogout = () => {
    auth.logout()
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="md:hidden">
          <Logo className="scale-75" />
        </div>
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:block text-sm text-gray-600">
            Entreprise: <span className="font-semibold">{user?.companyName || "N/A"}</span>
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
