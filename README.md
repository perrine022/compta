# Pilgrim - Marketplace de Pèlerinages

Application web moderne de réservation de pèlerinages et voyages spirituels, développée avec Next.js 14, TypeScript, TailwindCSS et Framer Motion.

**Voyages spécialisés, réservés simplement.**

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+ et npm (ou yarn/pnpm)

### Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

### Build de production

```bash
npm run build
npm start
```

## 📁 Structure du projet

```
pilgrim/
├── app/
│   ├── (auth)/              # Routes d'authentification (non utilisées dans V1)
│   ├── offers/              # Pages des offres de pèlerinage
│   │   └── [slug]/         # Page détail d'une offre
│   ├── bookings/           # Page mes réservations
│   ├── layout.tsx          # Layout racine
│   ├── page.tsx            # Page d'accueil
│   └── globals.css         # Styles globaux
├── components/
│   ├── ui/                 # Composants UI de base (shadcn/ui)
│   ├── OfferCard.tsx       # Carte d'offre de pèlerinage
│   ├── SearchBar.tsx       # Barre de recherche
│   ├── StatusBadge.tsx     # Badge de statut (BOOKABLE, ON_REQUEST, SHOWCASE)
│   ├── CheckoutDrawer.tsx  # Drawer de checkout
│   └── BookingCard.tsx     # Carte de réservation
├── lib/
│   ├── mock-data.ts        # Données mockées des offres de pèlerinage
│   ├── mock-api.ts         # API mockée (fetchOffers, createCheckout, etc.)
│   ├── mock-bookings.ts    # Réservations mockées pour démo
│   ├── storage.ts          # Gestion localStorage pour les réservations
│   ├── fx.ts               # Conversion de devises
│   └── utils.ts            # Utilitaires généraux
└── middleware.ts           # Middleware Next.js
```

## ✨ Fonctionnalités

### Pages principales

1. **Home (`/`)**
   - Hero avec image de pèlerinage
   - Barre de recherche dans le header
   - Statistiques animées
   - Section "Qu'est-ce que Pilgrim ?"
   - Tous les pèlerinages organisés par pays

2. **Détail offre (`/offers/[slug]`)**
   - Informations complètes sur le pèlerinage
   - Programme détaillé jour par jour avec photos
   - Sessions disponibles avec dates et prix
   - Checkout mock (drawer)
   - Formulaire "Demander des infos" pour les offres SHOWCASE

3. **Mes réservations (`/bookings`)**
   - Liste de toutes les réservations
   - Statuts : CONFIRMED, PENDING_CONFIRMATION, CANCELLED
   - Actions : voir détails, annuler, télécharger PDF (mock)
   - État vide avec CTA "Explorer"

### Types d'offres

- **BOOKABLE** : Confirmation immédiate après paiement
- **ON_REQUEST** : Confirmation sous 24-48h après paiement
- **SHOWCASE** : Pas de paiement, formulaire "Demander des infos"

### Multi-devises

Support de plusieurs devises avec conversion automatique :
- EUR (Euro)
- USD (Dollar américain)
- GBP (Livre sterling)

Les taux de change sont mockés dans `lib/fx.ts`.

## 🎨 Design System

- **Couleurs principales** :
  - Dark Green : `#1B4D3E` (primary)
  - Off-white : `#FAF9F6` (background)
  - Blanc : `#FFFFFF` (cards)

- **Typographie** :
  - Logo : font-serif (Pilgrim)
  - Corps : font-sans (système)

- **Animations** :
  - Framer Motion pour les transitions
  - Animations au scroll (fade-in, slide-up)
  - Compteurs animés pour les statistiques

## 🛠️ Technologies utilisées

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **shadcn/ui** (composants UI)
- **Framer Motion** (animations)
- **lucide-react** (icônes)
- **date-fns** (gestion des dates)

## 📝 Données mockées

Toutes les données sont mockées pour la démonstration :

- **Offres** : 8 pèlerinages dans `lib/mock-data.ts`
  - Camino de Santiago (Chemin Français et Portugais)
  - Rome et Vatican
  - Via Francigena
  - Lourdes
  - Chemin de Compostelle - Voie du Puy
  - Jérusalem et Terre Sainte

- **Réservations** : Stockées dans localStorage via `lib/storage.ts`
- **API** : Simulée avec délais dans `lib/mock-api.ts`

## 🎯 Pèlerinages disponibles

### Espagne
- Camino de Santiago - Chemin Français (35 jours)
- Camino Português - Chemin Portugais (12 jours)

### Italie
- Pèlerinage à Rome et au Vatican (7 jours)
- Via Francigena - Chemin vers Rome (28 jours)

### France
- Pèlerinage à Lourdes (5 jours)
- Chemin de Compostelle - Voie du Puy (30 jours)

### Israël
- Pèlerinage en Terre Sainte - Jérusalem (10 jours)
- Pèlerinage Terre Sainte - Expérience Premium (12 jours)

## 📱 Responsive

L'application est entièrement responsive avec une approche mobile-first :
- Header adaptatif avec recherche compacte
- Grilles de cartes adaptatives
- Drawer de checkout optimisé mobile
- Navigation simplifiée sur petits écrans

## 🐛 Notes importantes

- **Front-only** : Aucune dépendance backend
- **Données mockées** : Toutes les données sont simulées
- **localStorage** : Les réservations sont stockées localement
- **Paiement mock** : Le checkout simule un paiement sans vraie transaction
- **Images** : Utilisation de picsum.photos pour les images placeholder

## 📄 Licence

Ce projet est un exemple de démonstration.

---

**Pilgrim** - Parce que chaque pas compte, nous sommes là pour chacun d'entre eux. ✨
# pilgrim
