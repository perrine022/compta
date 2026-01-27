import { MOCK_OFFERS, type Offer } from './mock-data'
import { storage, type Booking } from './storage'
import { convertCurrency, type Currency } from './fx'

// Simuler un délai réseau
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Récupère toutes les offres (avec filtres optionnels)
 */
export async function mockFetchOffers(filters?: {
  departure?: string
  currency?: Currency
  status?: 'BOOKABLE' | 'ON_REQUEST' | 'SHOWCASE' | 'ALL'
}): Promise<Offer[]> {
  await delay(300) // Simuler latence réseau

  let offers = [...MOCK_OFFERS]

  // Filtrer par départ
  if (filters?.departure) {
    offers = offers.filter(offer =>
      offer.departuresEligible.includes(filters.departure!)
    )
  }

  // Filtrer par statut
  if (filters?.status && filters.status !== 'ALL') {
    offers = offers.filter(offer => offer.status === filters.status)
  }

  // Trier : BOOKABLE en premier
  offers.sort((a, b) => {
    if (a.status === 'BOOKABLE' && b.status !== 'BOOKABLE') return -1
    if (a.status !== 'BOOKABLE' && b.status === 'BOOKABLE') return 1
    return 0
  })

  return offers
}

/**
 * Récupère une offre par son slug ou son id
 */
export async function mockGetOffer(slugOrId: string): Promise<Offer | null> {
  await delay(200)
  return MOCK_OFFERS.find(offer => offer.slug === slugOrId || offer.id === slugOrId) || null
}

/**
 * Crée une réservation (checkout)
 */
export async function mockCreateCheckout(data: {
  offerId: string
  sessionId: string
  participants: Array<{ firstName: string; lastName: string; email: string }>
  currency: Currency
}): Promise<Booking> {
  await delay(800) // Simuler traitement paiement

  const offer = MOCK_OFFERS.find(o => o.id === data.offerId)
  if (!offer) {
    throw new Error('Offre non trouvée')
  }

  const session = offer.sessions.find(s => s.id === data.sessionId)
  if (!session) {
    throw new Error('Session non trouvée')
  }

  // Vérifier capacité
  if (session.capacityRemaining < data.participants.length) {
    throw new Error('Capacité insuffisante')
  }

  // Calculer le montant total
  const totalAmount = session.price * data.participants.length

  // Déterminer le statut selon le statut de l'offre
  const status: Booking['status'] =
    offer.status === 'BOOKABLE'
      ? 'CONFIRMED'
      : offer.status === 'ON_REQUEST'
      ? 'PENDING_CONFIRMATION'
      : 'CONFIRMED' // Fallback

  // Créer la réservation
  const booking: Booking = {
    id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    offerId: offer.id,
    offerTitle: offer.title,
    offerSlug: offer.slug,
    sessionId: session.id,
    sessionStartDate: session.startDate,
    sessionEndDate: session.endDate,
    participants: data.participants,
    totalAmount,
    currency: data.currency,
    status,
    createdAt: new Date().toISOString(),
  }

  // Sauvegarder
  storage.saveBooking(booking)

  // Mettre à jour la capacité restante (dans les données mock, on ne persiste pas ça)
  // En production, ce serait géré côté backend

  return booking
}

/**
 * Récupère toutes les réservations de l'utilisateur
 */
export async function mockGetBookings(): Promise<Booking[]> {
  await delay(200)
  
  if (typeof window === 'undefined') return []
  
  const bookings = storage.getBookings()
  
  // Si aucune réservation, initialiser avec les réservations mock
  if (bookings.length === 0) {
    const { MOCK_BOOKINGS } = await import('./mock-bookings')
    // Sauvegarder les réservations mock dans localStorage
    MOCK_BOOKINGS.forEach(booking => {
      storage.saveBooking(booking)
    })
    return MOCK_BOOKINGS
  }
  
  return bookings
}

/**
 * Annule une réservation
 */
export async function mockCancelBooking(bookingId: string): Promise<Booking> {
  await delay(400)

  const booking = storage.getBooking(bookingId)
  if (!booking) {
    throw new Error('Réservation non trouvée')
  }

  storage.updateBooking(bookingId, { status: 'CANCELLED' })

  return { ...booking, status: 'CANCELLED' }
}

/**
 * Envoie une demande d'infos pour une offre SHOWCASE
 */
export async function mockSendInfoRequest(data: {
  offerId: string
  name: string
  email: string
  message?: string
}): Promise<{ success: boolean }> {
  await delay(500)
  // Simuler envoi d'email
  console.log('Info request sent:', data)
  return { success: true }
}
