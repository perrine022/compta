"use client"

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MapPin, Clock, Languages } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/StatusBadge'
import { formatPrice, convertCurrency, type Currency } from '@/lib/fx'
import type { Offer } from '@/lib/mock-data'

interface OfferCardProps {
  offer: Offer
  displayCurrency?: Currency
}

export function OfferCard({ offer, displayCurrency = 'EUR' }: OfferCardProps) {
  // Trouver le prix minimum parmi les sessions
  const minPrice = Math.min(...offer.sessions.map(s => s.price))
  const minPriceSession = offer.sessions.find(s => s.price === minPrice)!
  
  // Convertir le prix si nécessaire
  const displayPrice = displayCurrency !== offer.currency
    ? convertCurrency(minPrice, offer.currency, displayCurrency)
    : minPrice

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Link href={`/offers/${offer.slug}`}>
        <Card className="h-full overflow-hidden cursor-pointer transition-all hover:shadow-lg">
          <div className="relative h-48 w-full">
            <Image
              src={offer.images[0] || 'https://picsum.photos/800/600'}
              alt={offer.title}
              fill
              className="object-cover"
            />
            <div className="absolute top-3 right-3">
              <StatusBadge status={offer.status} />
            </div>
          </div>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-lg line-clamp-2">{offer.title}</h3>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{offer.destination}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{offer.durationDays} jours</span>
              </div>
            </div>

            {offer.language.length > 0 && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Languages className="h-4 w-4" />
                <span>{offer.language.slice(0, 2).join(', ')}</span>
              </div>
            )}

            <div className="pt-2 border-t">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-gray-500">À partir de</span>
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(displayPrice, displayCurrency)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
