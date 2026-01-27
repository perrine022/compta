"use client"

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, MapPin, Shield, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/SearchBar'
import { OfferCard } from '@/components/OfferCard'
import { mockFetchOffers } from '@/lib/mock-api'
import { MOCK_OFFERS } from '@/lib/mock-data'
import type { Offer } from '@/lib/mock-data'
import type { Currency } from '@/lib/fx'
import type { OfferStatus } from '@/lib/mock-data'

// Composant pour les compteurs animés
function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const countRef = useRef(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    
    const increment = end / (duration / 16)
    const timer = setInterval(() => {
      countRef.current += increment
      if (countRef.current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(countRef.current))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [end, duration, isInView])

  return <span ref={ref}>{count.toLocaleString("fr-FR")}{suffix}</span>
}

export default function HomePage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(false)
  const [departure, setDeparture] = useState('Paris')
  const [currency, setCurrency] = useState<Currency>('EUR')
  const [status, setStatus] = useState<OfferStatus | 'ALL'>('ALL')
  const [hasSearched, setHasSearched] = useState(false)
  const [allOffersLoaded, setAllOffersLoaded] = useState(false)

  const handleSearch = async () => {
    setLoading(true)
    setHasSearched(true)
    try {
      const results = await mockFetchOffers({
        departure,
        currency,
        status: status === 'ALL' ? undefined : status,
      })
      setOffers(results)
    } catch (error) {
      console.error('Error fetching offers:', error)
    } finally {
      setLoading(false)
    }
  }

  // Charger toutes les offres au chargement pour la section "Tous nos pèlerinages"
  useEffect(() => {
    const loadAllOffers = async () => {
      try {
        const results = await mockFetchOffers({})
        setOffers(results)
        setAllOffersLoaded(true)
      } catch (error) {
        console.error('Error loading offers:', error)
      }
    }
    loadAllOffers()
  }, [])

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Header avec Search Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-2 md:py-3">
          <div className="flex items-center gap-4 md:gap-6">
            {/* Logo */}
            <a href="/" className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="text-xl md:text-2xl font-serif font-bold text-[#1B4D3E]">
                Pilgrim
              </div>
            </a>
            
            {/* Search Bar */}
            <div className="flex-1 flex justify-center max-w-2xl mx-4">
              <SearchBar
                departure={departure}
                currency={currency}
                status={status}
                onDepartureChange={setDeparture}
                onCurrencyChange={setCurrency}
                onStatusChange={setStatus}
                onSearch={handleSearch}
                scrollToOffers={true}
              />
            </div>
            
            {/* Navigation */}
            <nav className="flex items-center gap-3 md:gap-4 flex-shrink-0">
              <a href="#all-offers" className="text-xs md:text-sm font-medium text-gray-700 hover:text-[#1B4D3E] transition-colors whitespace-nowrap">
                Explorer
              </a>
              <a href="/bookings" className="text-xs md:text-sm font-medium text-gray-700 hover:text-[#1B4D3E] transition-colors whitespace-nowrap">
                Mes réservations
              </a>
              <Button variant="outline" size="sm" className="text-xs md:text-sm h-8 md:h-9 px-3 md:px-4">
                Se connecter
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section avec Image */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        {/* Image de fond - Pèlerinage */}
        <div className="absolute inset-0">
          <Image
            src="https://picsum.photos/1920/1080?random=pilgrimage"
            alt="Pèlerinage - Chemin de Compostelle"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay sombre pour la lisibilité */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>
        
        {/* Contenu du Hero */}
        <div className="container mx-auto px-4 md:px-6 h-full relative z-10">
          <div className="h-full flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl text-white space-y-6"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Pèlerinages authentiques,
                <br />
                <span className="text-white">chemins spirituels.</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl">
                Découvrez les plus beaux pèlerinages du monde : Camino de Santiago, Rome, Jérusalem, Lourdes et bien d'autres. Accompagnement spirituel, hébergements adaptés, réservation simplifiée.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm text-white/90">
                  <Shield className="h-5 w-5" />
                  <span>Paiement sécurisé</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/90">
                  <Zap className="h-5 w-5" />
                  <span>Confirmation immédiate</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/90">
                  <MapPin className="h-5 w-5" />
                  <span>Départ flexible</span>
                </div>
              </div>
              <Button
                size="lg"
                onClick={() => {
                  document.getElementById('all-offers')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="mt-8 bg-[#1B4D3E] hover:bg-[#1B4D3E]/90 text-white px-8 py-6 text-lg"
              >
                Voir les offres
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Statistiques */}
      <section className="py-12 md:py-16 bg-white border-b">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="text-center p-6 bg-[#FAF9F6] rounded-xl">
              <div className="text-4xl md:text-5xl font-bold text-[#1B4D3E] mb-2">
                <AnimatedCounter end={100} suffix="+" />
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Destinations sacrées</div>
            </div>
            <div className="text-center p-6 bg-[#FAF9F6] rounded-xl">
              <div className="text-4xl md:text-5xl font-bold text-[#1B4D3E] mb-2">
                <AnimatedCounter end={50} suffix="+" />
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Prestataires vérifiés</div>
            </div>
            <div className="text-center p-6 bg-[#FAF9F6] rounded-xl">
              <div className="text-4xl md:text-5xl font-bold text-[#1B4D3E] mb-2">
                <AnimatedCounter end={24} suffix="/7" />
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Support spirituel</div>
            </div>
            <div className="text-center p-6 bg-[#FAF9F6] rounded-xl">
              <div className="text-4xl md:text-5xl font-bold text-[#1B4D3E] mb-2">
                <AnimatedCounter end={1000} suffix="+" />
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Pèlerins accompagnés</div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Rejoignez une communauté de pèlerins qui ont choisi <strong className="text-[#1B4D3E]">Pilgrim</strong> pour vivre leur cheminement spirituel. 
              De Santiago à Jérusalem, en passant par Rome et Lourdes, nous vous accompagnons dans chaque étape de votre pèlerinage avec bienveillance et professionnalisme.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section Description */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Qu'est-ce que Pilgrim ?
              </h2>
              <p className="text-xl text-gray-600">
                Votre compagnon de route vers les chemins sacrés
              </p>
            </div>

            {/* Grille avec images et texte */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg"
              >
                <Image
                  src="https://picsum.photos/800/600?random=pilgrim1"
                  alt="Pèlerinage"
                  fill
                  className="object-cover"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <h3 className="text-2xl font-bold text-gray-900">
                  Transformez votre rêve en réalité
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Vous rêvez de marcher sur les pas des pèlerins d'autrefois ? De découvrir les chemins qui mènent à Santiago, Rome, Jérusalem ou Lourdes ? <strong className="text-[#1B4D3E]">Pilgrim</strong> est là pour transformer votre rêve en réalité.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Nous vous accompagnons dans votre cheminement spirituel en vous proposant des pèlerinages authentiques vers les lieux saints les plus emblématiques du monde.
                </p>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4 md:order-2"
              >
                <h3 className="text-2xl font-bold text-gray-900">
                  Un accompagnement complet et bienveillant
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Nous sommes bien plus qu'une simple plateforme de réservation. <strong className="text-[#1B4D3E]">Pilgrim</strong> est votre partenaire de confiance pour vivre un pèlerinage authentique et profond.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Chaque voyage est pensé pour vous : guides spirituels expérimentés à vos côtés, hébergements choisis avec soin, et un accompagnement bienveillant à chaque étape de votre cheminement.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg md:order-1"
              >
                <Image
                  src="https://picsum.photos/800/600?random=pilgrim2"
                  alt="Accompagnement spirituel"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg"
              >
                <Image
                  src="https://picsum.photos/800/600?random=pilgrim3"
                  alt="Réservation simplifiée"
                  fill
                  className="object-cover"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-4"
              >
                <h3 className="text-2xl font-bold text-gray-900">
                  Réservation simplifiée, expérience profonde
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Que vous partiez seul, en famille ou entre amis, nous vous simplifions la vie : réservez en quelques clics, payez en toute sécurité, et recevez votre confirmation immédiatement.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Multi-devises, départs depuis plusieurs villes, et surtout... l'accompagnement spirituel qui manquait à votre voyage.
                </p>
                <p className="pt-4 text-xl font-semibold text-[#1B4D3E]">
                  Parce que chaque pas compte, nous sommes là pour chacun d'entre eux.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section Toutes les Offres */}
      <section id="all-offers" className="py-12 bg-[#FAF9F6]">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tous nos pèlerinages
            </h2>
            <p className="text-lg text-gray-600">
              Découvrez notre sélection de pèlerinages organisés par destination
            </p>
          </motion.div>

          {!allOffersLoaded ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B4D3E]"></div>
              <p className="mt-4 text-gray-600">Chargement des pèlerinages...</p>
            </div>
          ) : (
            <>
              {/* Grouper les offres par pays */}
              {(() => {
                const offersByCountry = offers.reduce((acc, offer) => {
                  const country = offer.country || 'Autres'
                  if (!acc[country]) {
                    acc[country] = []
                  }
                  acc[country].push(offer)
                  return acc
                }, {} as Record<string, typeof offers>)

                return Object.entries(offersByCountry).map(([country, countryOffers]) => (
                  <motion.div
                    key={country}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-12"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <h3 className="text-2xl font-bold text-gray-900">{country}</h3>
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <span className="text-sm text-gray-500">{countryOffers.length} pèlerinage(s)</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {countryOffers.map((offer) => (
                        <OfferCard
                          key={offer.id}
                          offer={offer}
                          displayCurrency={currency}
                        />
                      ))}
                    </div>
                  </motion.div>
                ))
              })()}
            </>
          )}
        </div>
      </section>

      {/* Section Recherche (optionnelle, peut être masquée ou simplifiée) */}
      {hasSearched && offers.length > 0 && (
        <section id="explorer" className="py-12 bg-white border-t">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Résultats de votre recherche
              </h2>
              <p className="text-gray-600">
                {offers.length} pèlerinage(s) trouvé(s) pour un départ depuis {departure}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  displayCurrency={currency}
                />
              ))}
            </div>
          </div>
        </section>
      )}

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
