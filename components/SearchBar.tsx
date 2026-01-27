"use client"

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Currency } from '@/lib/fx'
import type { OfferStatus } from '@/lib/mock-data'

interface SearchBarProps {
  departure: string
  currency: Currency
  status: OfferStatus | 'ALL'
  onDepartureChange: (value: string) => void
  onCurrencyChange: (value: Currency) => void
  onStatusChange: (value: OfferStatus | 'ALL') => void
  onSearch: () => void
  scrollToOffers?: boolean
}

const DEPARTURES = ['Paris', 'Londres', 'New York', 'Montréal']
const CURRENCIES: Currency[] = ['EUR', 'USD', 'GBP']
const STATUSES: Array<{ value: OfferStatus | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'Tous' },
  { value: 'BOOKABLE', label: 'Disponible' },
  { value: 'ON_REQUEST', label: 'Sur demande' },
  { value: 'SHOWCASE', label: 'Sur demande (infos)' },
]

export function SearchBar({
  departure,
  currency,
  status,
  onDepartureChange,
  onCurrencyChange,
  onStatusChange,
  onSearch,
  scrollToOffers = false,
}: SearchBarProps) {
  const handleSearch = () => {
    onSearch()
    if (scrollToOffers) {
      setTimeout(() => {
        document.getElementById('all-offers')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }
  return (
    <div className="flex-shrink-0">
      <div className="bg-white rounded-md border border-gray-200 shadow-sm p-1 inline-flex">
        <div className="flex items-center gap-1">
          <div className="w-20 md:w-24">
            <Select value={departure} onValueChange={onDepartureChange}>
              <SelectTrigger className="h-6 text-xs border-0 shadow-none bg-transparent hover:bg-gray-50 px-1.5 py-0">
                <SelectValue placeholder="Départ" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTURES.map((dep) => (
                  <SelectItem key={dep} value={dep} className="text-xs py-1">
                    {dep}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-12 md:w-14">
            <Select
              value={currency}
              onValueChange={(value) => onCurrencyChange(value as Currency)}
            >
              <SelectTrigger className="h-6 text-xs border-0 shadow-none bg-transparent hover:bg-gray-50 px-1.5 py-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((curr) => (
                  <SelectItem key={curr} value={curr} className="text-xs py-1">
                    {curr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-20 hidden md:block">
            <Select
              value={status}
              onValueChange={(value) => onStatusChange(value as OfferStatus | 'ALL')}
            >
              <SelectTrigger className="h-6 text-xs border-0 shadow-none bg-transparent hover:bg-gray-50 px-1.5 py-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value} className="text-xs py-1">
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSearch}
            className="h-6 px-2.5 bg-[#1B4D3E] hover:bg-[#1B4D3E]/90 text-white text-xs flex-shrink-0"
            size="sm"
          >
            <Search className="h-3 w-3 md:mr-1" />
            <span className="hidden md:inline">Rechercher</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
