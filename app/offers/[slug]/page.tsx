"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, MapPin, Clock, Languages, Users, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/StatusBadge'
import { CheckoutDrawer } from '@/components/CheckoutDrawer'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { mockGetOffer, mockSendInfoRequest } from '@/lib/mock-api'
import { formatPrice, convertCurrency, type Currency } from '@/lib/fx'
import type { Offer, Session } from '@/lib/mock-data'
import { format } from 'date-fns'

export default function OfferDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const [offer, setOffer] = useState<Offer | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [infoRequestOpen, setInfoRequestOpen] = useState(false)
  const [infoRequestData, setInfoRequestData] = useState({ name: '', email: '', message: '' })
  const [infoRequestSent, setInfoRequestSent] = useState(false)
  const [currency, setCurrency] = useState<Currency>('EUR')

  useEffect(() => {
    const fetchOffer = async () => {
      setLoading(true)
      try {
        const data = await mockGetOffer(slug)
        setOffer(data)
        if (data && data.sessions.length > 0) {
          setSelectedSession(data.sessions[0])
          setCurrency(data.currency)
        }
      } catch (error) {
        console.error('Error fetching offer:', error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchOffer()
    }
  }, [slug])

  const handleBook = () => {
    if (offer?.status === 'SHOWCASE') {
      setInfoRequestOpen(true)
    } else if (selectedSession) {
      setCheckoutOpen(true)
    }
  }

  const handleSendInfoRequest = async () => {
    if (!offer || !infoRequestData.name || !infoRequestData.email) return

    try {
      await mockSendInfoRequest({
        offerId: offer.id,
        name: infoRequestData.name,
        email: infoRequestData.email,
        message: infoRequestData.message,
      })
      setInfoRequestSent(true)
      setTimeout(() => {
        setInfoRequestOpen(false)
        setInfoRequestSent(false)
        setInfoRequestData({ name: '', email: '', message: '' })
      }, 2000)
    } catch (error) {
      console.error('Error sending info request:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B4D3E]"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Offre non trouvée</p>
          <Button onClick={() => router.push('/')}>Retour à l&apos;accueil</Button>
        </div>
      </div>
    )
  }

  const statusMessages = {
    BOOKABLE: 'Confirmation immédiate',
    ON_REQUEST: 'Confirmation sous 24-48 heures',
    SHOWCASE: 'Sur demande (pas de paiement)',
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
            <nav className="flex items-center gap-6">
              <a href="/" className="text-sm font-medium text-gray-700 hover:text-[#1B4D3E] transition-colors">
                Explorer
              </a>
              <a href="/bookings" className="text-sm font-medium text-gray-700 hover:text-[#1B4D3E] transition-colors">
                Mes réservations
              </a>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div className="text-sm text-gray-600">
            <a href="/" className="hover:text-[#1B4D3E]">Explorer</a> / {offer.destination}
          </div>
        </div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative h-64 md:h-96 w-full rounded-2xl overflow-hidden mb-8"
        >
          <Image
            src={offer.images[0] || 'https://picsum.photos/1200/600'}
            alt={offer.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 right-4">
            <StatusBadge status={offer.status} />
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* Title & Key Info */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{offer.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{offer.destination}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{offer.durationDays} jours</span>
                </div>
                {offer.language.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Languages className="h-5 w-5" />
                    <span>{offer.language.join(', ')}</span>
                  </div>
                )}
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B4D3E]/10 rounded-full text-[#1B4D3E] font-medium">
                {statusMessages[offer.status]}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Résumé</h2>
              <p className="text-gray-700 leading-relaxed">{offer.description}</p>
            </div>

            {/* Included / Not Included */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Inclus
                </h3>
                <ul className="space-y-2">
                  {offer.included.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <span className="text-green-600 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  Non inclus
                </h3>
                <ul className="space-y-2">
                  {offer.notIncluded.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <span className="text-red-600 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Programme détaillé */}
            {offer.program && offer.program.length > 0 && (
              <div>
                <h3 className="text-2xl font-semibold mb-6">Programme détaillé</h3>
                <div className="space-y-8">
                  {offer.program.map((day, index) => (
                    <motion.div
                      key={day.day}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                    >
                      <div className="grid md:grid-cols-3 gap-0">
                        {/* Image */}
                        {day.image && (
                          <div className="relative h-48 md:h-full md:min-h-[200px]">
                            <Image
                              src={day.image}
                              alt={`Jour ${day.day} - ${day.title}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        
                        {/* Contenu */}
                        <div className={`p-6 ${day.image ? 'md:col-span-2' : 'md:col-span-3'}`}>
                          <div className="flex items-start gap-4 mb-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-[#1B4D3E] text-white rounded-full flex items-center justify-center font-bold text-lg">
                              {day.day}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-xl font-semibold text-gray-900 mb-2">{day.title}</h4>
                              <p className="text-gray-700 leading-relaxed mb-4">{day.description}</p>
                            </div>
                          </div>
                          
                          {/* Activités */}
                          {day.activities && day.activities.length > 0 && (
                            <div className="mb-4">
                              <h5 className="text-sm font-semibold text-gray-900 mb-2">Activités du jour :</h5>
                              <ul className="space-y-1">
                                {day.activities.map((activity, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                    <span className="text-[#1B4D3E] mt-1">•</span>
                                    <span>{activity}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {/* Hébergement et repas */}
                          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                            {day.accommodation && (
                              <div>
                                <h5 className="text-xs font-semibold text-gray-500 mb-1">Hébergement</h5>
                                <p className="text-sm text-gray-700">{day.accommodation}</p>
                              </div>
                            )}
                            {day.meals && day.meals.length > 0 && (
                              <div>
                                <h5 className="text-xs font-semibold text-gray-500 mb-1">Repas inclus</h5>
                                <p className="text-sm text-gray-700">{day.meals.join(', ')}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Cancellation Policy */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Politique d&apos;annulation</h3>
              <p className="text-gray-700">{offer.cancellationPolicy}</p>
            </div>
          </div>

          {/* Sidebar - Sessions */}
          <div className="md:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl shadow-lg p-6 space-y-6">
              <h2 className="text-2xl font-semibold">Sessions disponibles</h2>
              
              <div className="space-y-4">
                {offer.sessions.map((session) => {
                  const isSelected = selectedSession?.id === session.id
                  const isFull = session.capacityRemaining === 0
                  const displayPrice = currency !== session.currency
                    ? convertCurrency(session.price, session.currency, currency)
                    : session.price

                  return (
                    <div
                      key={session.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#1B4D3E] bg-[#1B4D3E]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${isFull ? 'opacity-50' : ''}`}
                      onClick={() => !isFull && setSelectedSession(session)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">
                          {format(new Date(session.startDate), 'd MMM yyyy')} -{' '}
                          {format(new Date(session.endDate), 'd MMM yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold text-gray-900">
                          {formatPrice(displayPrice, currency)}
                        </span>
                        <span className="text-xs text-gray-500">par personne</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>
                          {session.capacityRemaining} place(s) disponible(s) / {session.capacityTotal}
                        </span>
                      </div>
                      {isFull && (
                        <div className="mt-2 text-sm text-red-600 font-medium">
                          Complet
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <Button
                onClick={() => {
                  if (offer.status === 'SHOWCASE') {
                    handleBook()
                  } else if (selectedSession) {
                    router.push(`/checkout?offerId=${offer.id}&sessionId=${selectedSession.id}&currency=${currency}`)
                  }
                }}
                disabled={!selectedSession || selectedSession.capacityRemaining === 0}
                className="w-full bg-[#1B4D3E] hover:bg-[#1B4D3E]/90 text-white py-6 text-lg"
                size="lg"
              >
                {offer.status === 'SHOWCASE'
                  ? 'Demander des infos'
                  : 'Réserver'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Drawer */}
      {selectedSession && (
        <CheckoutDrawer
          offer={offer}
          session={selectedSession}
          displayCurrency={currency}
          open={checkoutOpen}
          onOpenChange={setCheckoutOpen}
        />
      )}

      {/* Info Request Dialog */}
      <Dialog open={infoRequestOpen} onOpenChange={setInfoRequestOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Demander des informations</DialogTitle>
            <DialogDescription>
              Remplissez le formulaire ci-dessous pour recevoir plus d&apos;informations sur cette offre.
            </DialogDescription>
          </DialogHeader>
          {infoRequestSent ? (
            <div className="text-center py-8">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Demande envoyée !</h3>
              <p className="text-gray-600">Nous vous répondrons dans les plus brefs délais.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet *</Label>
                <Input
                  id="name"
                  value={infoRequestData.name}
                  onChange={(e) =>
                    setInfoRequestData({ ...infoRequestData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={infoRequestData.email}
                  onChange={(e) =>
                    setInfoRequestData({ ...infoRequestData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message (optionnel)</Label>
                <textarea
                  id="message"
                  value={infoRequestData.message}
                  onChange={(e) =>
                    setInfoRequestData({ ...infoRequestData, message: e.target.value })
                  }
                  rows={4}
                  className="flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setInfoRequestOpen(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSendInfoRequest}
                  disabled={!infoRequestData.name || !infoRequestData.email}
                  className="flex-1 bg-[#1B4D3E] hover:bg-[#1B4D3E]/90"
                >
                  Envoyer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <a href="/" className="text-xl font-serif font-bold text-[#1B4D3E] mb-3 md:mb-0 cursor-pointer hover:opacity-80 transition-opacity">
              Pilgrim
            </a>
            <p className="text-xs text-gray-500">
              &copy; 2026 Pilgrim. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
