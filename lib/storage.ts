// Gestion du stockage localStorage pour les réservations et l'utilisateur

export interface Booking {
  id: string
  offerId: string
  offerTitle: string
  offerSlug: string
  sessionId: string
  sessionStartDate: string
  sessionEndDate: string
  participants: Participant[]
  totalAmount: number
  currency: string
  status: 'CONFIRMED' | 'PENDING_CONFIRMATION' | 'CANCELLED'
  createdAt: string
}

export interface Participant {
  firstName: string
  lastName: string
  email: string
}

const STORAGE_KEYS = {
  BOOKINGS: 'pilgrim_bookings',
  USER: 'pilgrim_user',
} as const

export const storage = {
  // Bookings
  getBookings(): Booking[] {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS)
    return data ? JSON.parse(data) : []
  },

  saveBooking(booking: Booking): void {
    if (typeof window === 'undefined') return
    const bookings = this.getBookings()
    bookings.push(booking)
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings))
  },

  updateBooking(bookingId: string, updates: Partial<Booking>): void {
    if (typeof window === 'undefined') return
    const bookings = this.getBookings()
    const index = bookings.findIndex(b => b.id === bookingId)
    if (index !== -1) {
      bookings[index] = { ...bookings[index], ...updates }
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings))
    }
  },

  getBooking(bookingId: string): Booking | undefined {
    const bookings = this.getBookings()
    return bookings.find(b => b.id === bookingId)
  },

  // User (mock)
  getUser(): { name: string; email: string } | null {
    if (typeof window === 'undefined') return null
    const data = localStorage.getItem(STORAGE_KEYS.USER)
    return data ? JSON.parse(data) : null
  },

  setUser(user: { name: string; email: string }): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  },
}
