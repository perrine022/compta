# Comptalvoire - Suivi Comptable en Ligne

Application web moderne de gestion comptable pour la Côte d'Ivoire, développée avec Next.js 14, TypeScript et TailwindCSS.

**Finance Simplifiée pour Entreprises Africaines**

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
compta/
├── app/
│   ├── (auth)/              # Routes d'authentification
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (app)/               # Routes de l'application
│   │   └── app/
│   │       ├── dashboard/
│   │       ├── operations/
│   │       ├── journal/
│   │       ├── accounts/
│   │       ├── company-settings/
│   │       └── exports/
│   ├── layout.tsx           # Layout racine
│   ├── page.tsx             # Page d'accueil (redirection)
│   └── globals.css          # Styles globaux
├── components/
│   ├── ui/                  # Composants UI de base (shadcn/ui)
│   ├── Sidebar.tsx          # Barre latérale de navigation
│   ├── Topbar.tsx           # Barre supérieure
│   ├── PageHeader.tsx       # En-tête de page
│   ├── KpiCard.tsx          # Carte KPI
│   └── OperationForm.tsx    # Formulaire d'opération
├── lib/
│   ├── mockStore.ts         # Store mock avec localStorage
│   ├── auth.ts              # Gestion de l'authentification mock
│   ├── export.ts            # Utilitaires d'export (CSV/Excel)
│   └── utils.ts             # Utilitaires généraux
└── middleware.ts            # Middleware Next.js
```

## 🎨 Personnalisation des couleurs

Les couleurs sont définies dans `tailwind.config.ts`. Pour modifier la palette :

```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: "#E7862C",  // Orange principal
        foreground: "#FFFFFF",
      },
      accent: {
        DEFAULT: "#40934B",   // Vert (success)
        foreground: "#FFFFFF",
      },
      background: "#F7F7F7", // Fond global
      card: "#FFFFFF",        // Fond des cartes
    },
  },
}
```

Les couleurs sont également utilisées dans `app/globals.css` via les variables CSS.

## 🔐 Authentification

L'authentification est simulée via localStorage. Pour la démo :
- **Login** : Accepte n'importe quel email/password
- **Register** : Crée un utilisateur et une entreprise
- Les données sont stockées dans `localStorage` avec les clés préfixées par `compta_`

## 💾 Stockage des données

Toutes les données sont stockées dans le `localStorage` du navigateur :
- `compta_accounts` : Comptes comptables
- `compta_operations` : Opérations (dépenses/recettes)
- `compta_journal` : Écritures comptables
- `compta_company` : Informations de l'entreprise
- `compta_user` : Utilisateur connecté

Les données de démo sont initialisées automatiquement au premier chargement.

## 📊 Fonctionnalités

### Dashboard
- KPIs : Total dépenses, recettes, solde
- Graphique d'évolution (Recharts)
- Dernières opérations

### Opérations
- Liste avec filtres (type, compte, statut, recherche)
- Ajout/modification d'opérations
- Gestion des justificatifs (upload local)
- Génération automatique d'écritures comptables

### Journal
- Liste des écritures comptables
- Détail des lignes débit/crédit
- Filtres par compte et période

### Comptes
- Gestion des comptes comptables
- Types : Charge, Produit, Banque, TVA
- Activation/désactivation

### Paramètres société
- Informations de l'entreprise
- Dates d'exercice

### Exports
- Export CSV des opérations
- Export Excel des opérations
- Export CSV du journal

## 🎨 Logo

Pour ajouter le logo de l'entreprise :
1. Placez votre fichier logo (PNG recommandé) dans `/public/logo.png`
2. Le logo s'affichera automatiquement dans la sidebar et le header mobile
3. Si le logo n'est pas trouvé, un placeholder avec "AFK" s'affichera

## 🛠️ Technologies utilisées

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **shadcn/ui** (composants UI)
- **react-hook-form** + **zod** (formulaires)
- **recharts** (graphiques)
- **lucide-react** (icônes)
- **date-fns** (dates)
- **xlsx** (export Excel)

## 🇨🇮 Configuration Côte d'Ivoire

L'application est configurée pour la Côte d'Ivoire :
- **Devise** : XOF (Franc CFA)
- **TVA par défaut** : 18%
- **Format de date** : français (dd/MM/yyyy)
- **Localisation** : Abidjan, Côte d'Ivoire

## 📝 Notes

- Pas de backend : tout est géré côté client avec localStorage
- Les écritures comptables sont générées automatiquement lors de la validation d'une opération
- Les justificatifs sont stockés en local via `URL.createObjectURL` (non persistants)
- L'application est responsive (mobile-first)
- Les montants sont formatés en XOF avec séparateurs de milliers

## 🐛 Dépannage

### Erreur "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Les données ne persistent pas
Vérifiez que le localStorage n'est pas désactivé dans votre navigateur.

### Problème de build
```bash
npm run build
```
Vérifiez les erreurs TypeScript dans la console.

## 📄 Licence

Ce projet est un exemple de démonstration.
# compta
