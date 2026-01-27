"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, CreditCard, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice, convertCurrency } from '@/lib/fx'
import { mockCreateCheckout, mockGetOffer } from '@/lib/mock-api'
import type { Currency } from '@/lib/fx'
import type { Offer, Session } from '@/lib/mock-data'
import { format } from 'date-fns'

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const offerId = searchParams.get('offerId')
  const sessionId = searchParams.get('sessionId')
  const currency = (searchParams.get('currency') || 'EUR') as Currency
  
  const [offer, setOffer] = useState<Offer | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loadingOffer, setLoadingOffer] = useState(true)
  const [step, setStep] = useState<1 | 2>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Données participants
  const [participants, setParticipants] = useState([
    { firstName: '', lastName: '', email: '' },
  ])
  
  // Données de paiement
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    city: '',
    postalCode: '',
    country: 'France',
  })

  // Charger l'offre et la session
  useEffect(() => {
    const loadOffer = async () => {
      if (!offerId) {
        router.push('/')
        return
      }
      
      try {
        const offerData = await mockGetOffer(offerId)
        setOffer(offerData)
        
        if (sessionId && offerData) {
          const sessionData = offerData.sessions.find(s => s.id === sessionId)
          if (sessionData) {
            setSession(sessionData)
          }
        }
      } catch (err) {
        console.error('Error loading offer:', err)
        router.push('/')
      } finally {
        setLoadingOffer(false)
      }
    }
    
    loadOffer()
  }, [offerId, sessionId, router])

  // Calculer le prix total
  const sessionPriceInDisplayCurrency = session
    ? currency !== session.currency
      ? convertCurrency(session.price, session.currency, currency)
      : session.price
    : 0

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

  const handlePaymentChange = (field: keyof typeof paymentData, value: string) => {
    setPaymentData({ ...paymentData, [field]: value })
  }

  const handleNext = () => {
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
    // Validation du formulaire de paiement
    if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardholderName) {
      setError('Veuillez remplir tous les champs de paiement')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Simuler le paiement Stripe
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Créer la réservation
      if (offerId && sessionId) {
        await mockCreateCheckout({
          offerId,
          sessionId,
          participants,
          currency,
        })
      }

      // Rediriger vers la page de confirmation
      router.push(`/checkout/confirm?amount=${totalAmount}&currency=${currency}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du paiement')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="text-2xl font-serif font-bold text-[#1B4D3E]">
                Pilgrim
              </div>
            </a>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Lock className="h-4 w-4" />
              <span>Paiement sécurisé</span>
            </div>
          </div>
        </div>
      </header>

      {loadingOffer ? (
        <div className="container mx-auto px-4 md:px-6 py-20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#1B4D3E]" />
        </div>
      ) : !offer || !session ? (
        <div className="container mx-auto px-4 md:px-6 py-20 text-center">
          <p className="text-gray-600">Offre ou session introuvable</p>
          <Button onClick={() => router.push('/')} className="mt-4">
            Retour à l'accueil
          </Button>
        </div>
      ) : (
      <div className="container mx-auto px-4 md:px-6 py-12 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Finaliser votre réservation</h1>
          <p className="text-gray-600">{offer.title}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Formulaire principal */}
          <div className="md:col-span-2 space-y-6">
            {step === 1 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Informations des participants</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {participants.map((participant, index) => (
                    <div key={index} className="space-y-4 p-4 border rounded-lg">
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

                  {error && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <Button onClick={handleNext} className="w-full" size="lg">
                    Continuer vers le paiement
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Informations de paiement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Mode démo :</strong> Ce paiement est simulé. Aucune transaction réelle ne sera effectuée.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Numéro de carte *</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={paymentData.cardNumber}
                        onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                        maxLength={19}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Date d'expiration *</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/AA"
                          value={paymentData.expiryDate}
                          onChange={(e) => handlePaymentChange('expiryDate', e.target.value)}
                          maxLength={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          type="password"
                          value={paymentData.cvv}
                          onChange={(e) => handlePaymentChange('cvv', e.target.value)}
                          maxLength={4}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardholderName">Nom sur la carte *</Label>
                      <Input
                        id="cardholderName"
                        placeholder="Jean Dupont"
                        value={paymentData.cardholderName}
                        onChange={(e) => handlePaymentChange('cardholderName', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="billingAddress">Adresse de facturation *</Label>
                      <Input
                        id="billingAddress"
                        placeholder="123 Rue Example"
                        value={paymentData.billingAddress}
                        onChange={(e) => handlePaymentChange('billingAddress', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="city">Ville *</Label>
                        <Input
                          id="city"
                          placeholder="Paris"
                          value={paymentData.city}
                          onChange={(e) => handlePaymentChange('city', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Code postal *</Label>
                        <Input
                          id="postalCode"
                          placeholder="75001"
                          value={paymentData.postalCode}
                          onChange={(e) => handlePaymentChange('postalCode', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Pays *</Label>
                      <Input
                        id="country"
                        value={paymentData.country}
                        onChange={(e) => handlePaymentChange('country', e.target.value)}
                      />
                    </div>
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
                      className="flex-1 bg-[#1B4D3E] hover:bg-[#1B4D3E]/90"
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Traitement...
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Payer {formatPrice(totalAmount, currency)}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Récapitulatif */}
          <div className="md:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pèlerinage</p>
                  <p className="font-medium">{offerTitle}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Dates</p>
                  <p className="font-medium">
                    {format(new Date(session.startDate), 'd MMM yyyy')} - {format(new Date(session.endDate), 'd MMM yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Participants</p>
                  <p className="font-medium">{participants.length}</p>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Prix unitaire</span>
                    <span className="font-medium">{formatPrice(sessionPriceInDisplayCurrency, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold text-[#1B4D3E]">
                      {formatPrice(totalAmount, currency)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      )}
    </div>
  )
}
