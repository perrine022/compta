"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatPrice, convertCurrency, type Currency } from '@/lib/fx'
import { mockCreateCheckout } from '@/lib/mock-api'
import type { Offer, Session } from '@/lib/mock-data'
import { format } from 'date-fns'

interface CheckoutDrawerProps {
  offer: Offer
  session: Session
  displayCurrency: Currency
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CheckoutDrawer({
  offer,
  session,
  displayCurrency,
  open,
  onOpenChange,
}: CheckoutDrawerProps) {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [participants, setParticipants] = useState([
    { firstName: '', lastName: '', email: '' },
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calculer le prix total
  const sessionPriceInDisplayCurrency =
    displayCurrency !== session.currency
      ? convertCurrency(session.price, session.currency, displayCurrency)
      : session.price
  const totalAmount = sessionPriceInDisplayCurrency * participants.length

  const handleAddParticipant = () => {
    setParticipants([...participants, { firstName: '', lastName: '', email: '' }])
  }

  const handleRemoveParticipant = (index: number) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((_, i) => i !== index))
    }
  }

  const handleParticipantChange = (
    index: number,
    field: 'firstName' | 'lastName' | 'email',
    value: string
  ) => {
    const updated = [...participants]
    updated[index][field] = value
    setParticipants(updated)
  }

  const handleNext = () => {
    // Validation
    const isValid = participants.every(
      p => p.firstName && p.lastName && p.email
    )
    if (!isValid) {
      setError('Veuillez remplir tous les champs des participants')
      return
    }
    setError(null)
    setStep(2)
  }

  const handlePayment = async () => {
    setLoading(true)
    setError(null)

    try {
      const booking = await mockCreateCheckout({
        offerId: offer.id,
        sessionId: session.id,
        participants,
        currency: displayCurrency,
      })

      // Rediriger vers les réservations
      onOpenChange(false)
      router.push('/bookings')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setStep(1)
      setParticipants([{ firstName: '', lastName: '', email: '' }])
      setError(null)
      onOpenChange(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-full sm:w-[500px] overflow-y-auto">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Réservation</h2>
            <p className="text-gray-600">{offer.title}</p>
          </div>

          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Informations des participants</h3>
                {participants.map((participant, index) => (
                  <div key={index} className="space-y-4 mb-6 p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Participant {index + 1}</span>
                      {participants.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveParticipant(index)}
                        >
                          Supprimer
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`firstName-${index}`}>Prénom *</Label>
                        <Input
                          id={`firstName-${index}`}
                          value={participant.firstName}
                          onChange={(e) =>
                            handleParticipantChange(index, 'firstName', e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`lastName-${index}`}>Nom *</Label>
                        <Input
                          id={`lastName-${index}`}
                          value={participant.lastName}
                          onChange={(e) =>
                            handleParticipantChange(index, 'lastName', e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`email-${index}`}>Email *</Label>
                      <Input
                        id={`email-${index}`}
                        type="email"
                        value={participant.email}
                        onChange={(e) =>
                          handleParticipantChange(index, 'email', e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddParticipant}
                  className="w-full"
                >
                  + Ajouter un participant
                </Button>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Annuler
                </Button>
                <Button onClick={handleNext} className="flex-1">
                  Suivant
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Récapitulatif</h3>
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Session</span>
                    <span className="font-medium">
                      {format(new Date(session.startDate), 'd MMM yyyy')} -{' '}
                      {format(new Date(session.endDate), 'd MMM yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Participants</span>
                    <span className="font-medium">{participants.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prix unitaire</span>
                    <span className="font-medium">
                      {formatPrice(sessionPriceInDisplayCurrency, displayCurrency)}
                    </span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="text-xl font-bold">
                        {formatPrice(totalAmount, displayCurrency)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Politique d'annulation</h4>
                <p className="text-sm text-gray-600">{offer.cancellationPolicy}</p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="flex-1"
                >
                  Retour
                </Button>
                <Button
                  onClick={handlePayment}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    'Payer (mock)'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
