import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // La protection des routes sera gérée côté client avec des guards
  // Le middleware Next.js ne peut pas accéder à localStorage
  return NextResponse.next()
}

export const config = {
  matcher: ["/app/:path*"],
}
