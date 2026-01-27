"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BookingCard } from '@/components/BookingCard'
import { mockGetBookings } from '@/lib/mock-api'
import type { Booking } from '@/lib/storage'

export default function BookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const data = await mockGetBookings()
      // Trier par date de création (plus récent en premier)
      const sorted = data.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setBookings(sorted)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

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
              <a href="/bookings" className="text-sm font-medium text-[#1B4D3E] font-semibold">
                Mes réservations
              </a>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Mes réservations</h1>
            <p className="text-gray-600">
              Gérez vos réservations et téléchargez vos documents
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B4D3E]"></div>
              <p className="mt-4 text-gray-600">Chargement...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-20">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md mx-auto"
              >
                <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="h-12 w-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Aucune réservation
                </h2>
                <p className="text-gray-600 mb-8">
                  Vous n'avez pas encore de réservation. Explorez nos offres pour commencer votre prochaine aventure.
                </p>
                <Button
                  onClick={() => router.push('/')}
                  className="bg-[#1B4D3E] hover:bg-[#1B4D3E]/90 text-white"
                  size="lg"
                >
                  Explorer les offres
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <BookingCard
                    booking={booking}
                    onCancel={fetchBookings}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

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
