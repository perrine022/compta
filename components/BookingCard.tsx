"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Users, DollarSign, Download, X, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/fx'
import { mockCancelBooking } from '@/lib/mock-api'
import type { Booking } from '@/lib/storage'
import { format } from 'date-fns'

interface BookingCardProps {
  booking: Booking
  onCancel?: () => void
}

export function BookingCard({ booking, onCancel }: BookingCardProps) {
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  const handleCancel = async () => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      return
    }

    setCancelling(true)
    try {
      await mockCancelBooking(booking.id)
      onCancel?.()
    } catch (error) {
      alert('Erreur lors de l\'annulation')
    } finally {
      setCancelling(false)
    }
  }

  const statusConfig = {
    CONFIRMED: {
      label: 'Confirmée',
      className: 'bg-green-600 text-white',
    },
    PENDING_CONFIRMATION: {
      label: 'En attente',
      className: 'bg-amber-500 text-white',
    },
    CANCELLED: {
      label: 'Annulée',
      className: 'bg-gray-500 text-white',
    },
  }

  const status = statusConfig[booking.status]

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">{booking.offerTitle}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(booking.sessionStartDate), 'd MMM yyyy')} -{' '}
                    {format(new Date(booking.sessionEndDate), 'd MMM yyyy')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{booking.participants.length} participant(s)</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-semibold text-gray-900">
                    {formatPrice(booking.totalAmount, booking.currency as any)}
                  </span>
                </div>
              </div>
            </div>
            <Badge className={status.className}>{status.label}</Badge>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/offers/${booking.offerSlug}`)}
            >
              Voir détails
            </Button>
            {booking.status === 'CONFIRMED' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Mock: télécharger PDF
                  alert('Téléchargement du programme PDF (mock)')
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Programme PDF
              </Button>
            )}
            {booking.status !== 'CANCELLED' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={cancelling}
              >
                {cancelling ? 'Annulation...' : 'Annuler'}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Moins
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Plus
                </>
              )}
            </Button>
          </div>

          {expanded && (
            <div className="pt-4 border-t space-y-3">
              <div>
                <h4 className="font-semibold mb-2">Participants</h4>
                <div className="space-y-2">
                  {booking.participants.map((p, idx) => (
                    <div key={idx} className="text-sm">
                      <span className="font-medium">
                        {p.firstName} {p.lastName}
                      </span>
                      <span className="text-gray-600"> - {p.email}</span>
                    </div>
                  ))}
                </div>
              </div>
              {booking.status === 'CANCELLED' && (
                <div className="p-3 bg-amber-50 text-amber-800 rounded-lg text-sm">
                  Remboursement initié (mock)
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
