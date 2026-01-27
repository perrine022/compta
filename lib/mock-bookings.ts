// Réservations mock pour avoir un visuel dans la page bookings
import type { Booking } from './storage'

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'booking_1',
    offerId: '1',
    offerTitle: 'Camino de Santiago - Chemin Français',
    offerSlug: 'camino-santiago-frances',
    sessionId: 's1',
    sessionStartDate: '2024-05-15',
    sessionEndDate: '2024-06-20',
    participants: [
      {
        firstName: 'Marie',
        lastName: 'Dupont',
        email: 'marie.dupont@example.com',
      },
      {
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@example.com',
      },
    ],
    totalAmount: 2400,
    currency: 'EUR',
    status: 'CONFIRMED',
    createdAt: '2024-03-10T10:30:00Z',
  },
  {
    id: 'booking_2',
    offerId: '3',
    offerTitle: 'Pèlerinage à Rome et au Vatican',
    offerSlug: 'pelerinage-rome-vatican',
    sessionId: 's4',
    sessionStartDate: '2024-05-20',
    sessionEndDate: '2024-05-27',
    participants: [
      {
        firstName: 'Sophie',
        lastName: 'Martin',
        email: 'sophie.martin@example.com',
      },
    ],
    totalAmount: 950,
    currency: 'EUR',
    status: 'PENDING_CONFIRMATION',
    createdAt: '2024-04-05T14:20:00Z',
  },
  {
    id: 'booking_3',
    offerId: '5',
    offerTitle: 'Pèlerinage à Lourdes',
    offerSlug: 'pelerinage-lourdes',
    sessionId: 's7',
    sessionStartDate: '2024-05-10',
    sessionEndDate: '2024-05-15',
    participants: [
      {
        firstName: 'Pierre',
        lastName: 'Bernard',
        email: 'pierre.bernard@example.com',
      },
      {
        firstName: 'Claire',
        lastName: 'Bernard',
        email: 'claire.bernard@example.com',
      },
      {
        firstName: 'Luc',
        lastName: 'Bernard',
        email: 'luc.bernard@example.com',
      },
    ],
    totalAmount: 1350,
    currency: 'EUR',
    status: 'CONFIRMED',
    createdAt: '2024-03-20T09:15:00Z',
  },
]
