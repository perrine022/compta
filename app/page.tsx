"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  TrendingUp,
  Shield,
  Zap,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Send,
  Sparkles,
  TrendingDown,
  Wallet,
  FileText,
} from "lucide-react"
import { auth } from "@/lib/auth"

// Composant pour les compteurs animés
function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const countRef = useRef(0)

  useEffect(() => {
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
  }, [end, duration])

  return <span>{count.toLocaleString("fr-FR")}{suffix}</span>
}

export default function HomePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleStart = () => {
    if (auth.isAuthenticated()) {
      router.push("/app/dashboard")
    } else {
      router.push("/register")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setFormData({ name: "", email: "", company: "", message: "" })
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation avec glassmorphism */}
      <nav className="border-b border-gray-200/50 bg-white/70 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="relative h-12 w-12 flex-shrink-0">
                <Image
                  src="/logoo.png"
                  alt="A.F.K Conseil Comptalvoire"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Comptalvoire
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
              >
                Connexion
              </Link>
              <Button
                onClick={handleStart}
                className="rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Commencer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section avec animations */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background animé */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`space-y-6 ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm">
                <Sparkles className="h-4 w-4" />
                Solution #1 en Côte d&apos;Ivoire
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Finance{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Simplifiée
                </span>{" "}
                pour Entreprises
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Gérez votre comptabilité en ligne avec simplicité. Conçu spécialement pour
                les entreprises de Côte d&apos;Ivoire avec TVA à 18%.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={handleStart}
                  className="rounded-2xl px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
                >
                  Commencer gratuitement
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-2xl px-8 py-6 text-lg border-2 hover:bg-primary/5 transition-all"
                  onClick={() => {
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                  }}
                >
                  Nous contacter
                </Button>
              </div>
            </div>
            <div className={`relative ${isVisible ? "animate-slide-in-right" : "opacity-0"}`}>
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-64 h-64 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-500">
                      <BarChart3 className="h-32 w-32 text-white" />
                    </div>
                    <p className="text-gray-700 font-medium">Gestion Comptable Moderne</p>
                  </div>
                </div>
                {/* Effet glassmorphism */}
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30">
                  <div className="flex items-center gap-2 text-white">
                    <TrendingUp className="h-5 w-5" />
                    <span className="font-semibold">+25%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chiffres clés animés */}
      <section className="py-16 bg-gradient-to-b from-white to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: 100, suffix: "+", label: "Entreprises", icon: TrendingUp, isPrimary: true },
              { value: 50000, suffix: "+", label: "Opérations", icon: FileText, isPrimary: false },
              { value: 99.9, suffix: "%", label: "Disponibilité", icon: Shield, isPrimary: true },
              { value: 24, suffix: "/7", label: "Support", icon: Zap, isPrimary: false },
            ].map((stat, idx) => {
              const Icon = stat.icon
              return (
                <Card
                  key={idx}
                  className="transition-all duration-300 hover:shadow-xl hover:scale-105 bg-white/80 backdrop-blur-sm shadow-lg"
                >
                  <CardContent className="p-6 text-center">
                    <div className={`h-12 w-12 ${stat.isPrimary ? "bg-primary/10" : "bg-accent/10"} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`h-6 w-6 ${stat.isPrimary ? "text-primary" : "text-accent"}`} />
                    </div>
                    <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features avec animations */}
      <section className="py-20 bg-background relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une solution complète pour gérer votre comptabilité en toute simplicité
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: "Dashboard Complet",
                description: "Visualisez vos dépenses, recettes et soldes en temps réel avec des graphiques interactifs.",
                isPrimary: true,
              },
              {
                icon: Zap,
                title: "Gestion Automatique",
                description: "Génération automatique des écritures comptables lors de la validation des opérations.",
                isPrimary: false,
              },
              {
                icon: Shield,
                title: "Sécurisé & Conforme",
                description: "Conforme aux normes comptables de Côte d'Ivoire avec TVA à 18%.",
                isPrimary: true,
              },
              {
                icon: TrendingUp,
                title: "Exports Faciles",
                description: "Exportez vos données en CSV ou Excel pour vos déclarations fiscales.",
                isPrimary: false,
              },
              {
                icon: FileText,
                title: "Journal Comptable",
                description: "Suivez toutes vos écritures comptables avec un journal détaillé et consultable.",
                isPrimary: true,
              },
              {
                icon: Wallet,
                title: "Interface Moderne",
                description: "Une interface intuitive et responsive, accessible depuis tous vos appareils.",
                isPrimary: false,
              },
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <Card
                  key={idx}
                  className="transition-all duration-300 hover:shadow-2xl hover:scale-105 group bg-white shadow-lg"
                >
                  <CardContent className="p-6">
                    <div
                      className={`h-16 w-16 ${feature.isPrimary ? "bg-gradient-to-br from-primary to-primary/80" : "bg-gradient-to-br from-accent to-accent/80"} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Section avec image de comptable */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-white to-accent/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="text-center space-y-6">
                    <div className="w-80 h-80 mx-auto bg-gradient-to-br from-white/90 to-white/70 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm">
                      <div className="text-center">
                        <div className="w-48 h-48 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-4 shadow-xl">
                          <BarChart3 className="h-24 w-24 text-white" />
                        </div>
                        <p className="text-2xl font-bold text-gray-800">Expert Comptable</p>
                        <p className="text-gray-600 mt-2">À votre service</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Badges flottants */}
                <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg animate-bounce-slow">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent" />
                    <span className="font-semibold text-gray-800">Certifié</span>
                  </div>
                </div>
                <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg animate-bounce-slow" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-gray-800">+50%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-accent font-medium text-sm w-fit">
                <Sparkles className="h-4 w-4" />
                Solution Professionnelle
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Gestion Comptable{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Simplifiée
                </span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Notre plateforme vous permet de gérer toute votre comptabilité en ligne avec
                une simplicité déconcertante. Conçue spécialement pour les entreprises de Côte
                d&apos;Ivoire, elle respecte toutes les normes comptables locales.
              </p>
              <div className="space-y-4">
                {[
                  "Génération automatique des écritures comptables",
                  "Conformité TVA 18% Côte d'Ivoire",
                  "Export pour déclarations fiscales",
                  "Support 24/7 disponible",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="h-6 w-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                    </div>
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
              <Button
                size="lg"
                onClick={handleStart}
                className="rounded-2xl px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 group mt-6"
              >
                Démarrer maintenant
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Formulaire de contact moderne */}
      <section id="contact" className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Contactez-nous
              </h2>
              <p className="text-xl text-gray-600">
                Une question ? Nous sommes là pour vous aider
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold mb-6">Informations de contact</h3>
                {[
                  {
                    icon: Mail,
                    title: "Email",
                    content: "contact@comptalvoire.ci",
                    isPrimary: true,
                  },
                  {
                    icon: Phone,
                    title: "Téléphone",
                    content: "+225 XX XX XX XX XX",
                    isPrimary: false,
                  },
                  {
                    icon: MapPin,
                    title: "Adresse",
                    content: "Cocody, Abidjan\nCôte d'Ivoire",
                    isPrimary: true,
                  },
                ].map((info, idx) => {
                  const Icon = info.icon
                  return (
                    <Card
                      key={idx}
                      className="transition-all duration-300 hover:shadow-lg hover:scale-105 bg-white shadow-md"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div
                            className={`h-12 w-12 ${info.isPrimary ? "bg-gradient-to-br from-primary to-primary/80" : "bg-gradient-to-br from-accent to-accent/80"} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}
                          >
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 mb-1">{info.title}</p>
                            <p className="text-gray-600 whitespace-pre-line">{info.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
              <Card className="shadow-2xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  {submitted ? (
                    <div className="text-center py-12">
                      <div className="h-20 w-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
                        <CheckCircle2 className="h-12 w-12 text-accent" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-2">Message envoyé !</h3>
                      <p className="text-gray-600">
                        Nous vous répondrons dans les plus brefs délais.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold">
                          Nom complet
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                          className="rounded-2xl border-2 focus:border-primary transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                          className="rounded-2xl border-2 focus:border-primary transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-sm font-semibold">
                          Entreprise
                        </Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) =>
                            setFormData({ ...formData, company: e.target.value })
                          }
                          className="rounded-2xl border-2 focus:border-primary transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-sm font-semibold">
                          Message
                        </Label>
                        <textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({ ...formData, message: e.target.value })
                          }
                          required
                          rows={5}
                          className="flex min-h-[120px] w-full rounded-2xl border-2 border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full rounded-2xl py-6 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
                        variant="success"
                      >
                        <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        Envoyer le message
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer moderne */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">AFK</span>
                </div>
                <span className="text-2xl font-bold">Comptalvoire</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Finance simplifiée pour entreprises africaines. La solution comptable
                moderne pour la Côte d&apos;Ivoire.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Produit</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <Link href="#features" className="hover:text-primary transition-colors">
                    Fonctionnalités
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-primary transition-colors">
                    Inscription
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-primary transition-colors">
                    Connexion
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Support</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <Link href="#contact" className="hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Légal</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Confidentialité
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 A.F.K Conseil Comptalvoire. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
