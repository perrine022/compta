"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/auth"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    if (auth.isAuthenticated()) {
      router.push("/app/dashboard")
    } else {
      router.push("/login")
    }
  }, [router])

  return null
}
