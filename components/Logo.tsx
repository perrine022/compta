"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export function Logo({ className }: { className?: string }) {
  const [imageError, setImageError] = useState(false)

  return (
    <Link href="/app/dashboard" className="flex items-center gap-3">
      <div className="relative w-12 h-12 flex-shrink-0 bg-white rounded-lg flex items-center justify-center overflow-hidden">
        {!imageError ? (
          <Image
            src="/logoo.png"
            alt="A.F.K Conseil Comptalvoire"
            width={48}
            height={48}
            className="object-contain"
            priority
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">AFK</span>
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold text-gray-900">Comptalvoire</span>
        <span className="text-xs text-gray-500">A.F.K Conseil</span>
      </div>
    </Link>
  )
}
