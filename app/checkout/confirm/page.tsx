"use client"

import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatPrice } from '@/lib/fx'
import type { Currency } from '@/lib/fx'

export default function CheckoutConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const amount = searchParams.get('amount')
  const currency = (searchParams.get('currency') || 'EUR') as Currency

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

      <div className="container mx-auto px-4 md:px-6 py-20">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Réservation effectuée !
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Votre pèlerinage a été réservé avec succès
            </p>
          </motion.div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Montant payé</span>
                  <span className="text-2xl font-bold text-[#1B4D3E]">
                    {amount ? formatPrice(parseFloat(amount), currency) : formatPrice(0, currency)}
                  </span>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">
                    Un email de confirmation a été envoyé à votre adresse email avec tous les détails de votre réservation.
                  </p>
                  <p className="text-sm text-gray-600">
                    Vous pouvez consulter votre réservation dans la section "Mes réservations".
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push('/bookings')}
              className="bg-[#1B4D3E] hover:bg-[#1B4D3E]/90 text-white"
              size="lg"
            >
              Voir mes réservations
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              size="lg"
            >
              Retour à l'accueil
            </Button>
          </div>

          <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Prochaines étapes</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Vous recevrez un email de confirmation dans les prochaines minutes</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Votre guide spirituel vous contactera avant le départ</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Le programme détaillé sera disponible dans "Mes réservations"</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
