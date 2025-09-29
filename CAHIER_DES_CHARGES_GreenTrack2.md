# CAHIER DES CHARGES - GreenTrack2 (FloraTrack)

## 1. PRÉSENTATION GÉNÉRALE

### 1.1 Contexte et Objectifs
**FloraTrack** (nom commercial : **FloraTrack**) est une application web de gestion et de suivi de plantes d'intérieur. L'application permet aux utilisateurs de :
- Gérer leur collection de plantes d'intérieur
- Suivre les arrosages et l'entretien
- Recevoir des rappels personnalisés
- Consulter l'historique des soins

### 1.2 Vision Produit
Créer une solution intuitive et complète pour les amateurs de plantes d'intérieur, facilitant la gestion quotidienne et l'entretien optimal de leur collection végétale.

## 2. ARCHITECTURE TECHNIQUE

### 2.1 Stack Technologique

#### Frontend
- **Framework** : Next.js 14.2.33 (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS 4.1.9
- **UI Components** : Radix UI + shadcn/ui
- **Icons** : Lucide React
- **Fonts** : Geist Sans & Geist Mono
- **State Management** : React Hooks (useState, useEffect)
- **Forms** : React Hook Form + Zod validation

#### Backend & Base de Données
- **Backend as a Service** : Supabase
- **Base de données** : PostgreSQL (via Supabase)
- **Authentification** : Supabase Auth
- **API** : Next.js API Routes
- **Row Level Security** : Activé sur toutes les tables

#### Déploiement & Infrastructure
- **Hébergement** : Vercel
- **Analytics** : Vercel Analytics
- **Gestion des images** : Upload direct (URLs stockées)
- **Middleware** : Next.js Middleware pour l'authentification

### 2.2 Architecture de l'Application

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Routes    │    │   Supabase      │
│   (Next.js)     │◄──►│   (Next.js)     │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ • Pages         │    │ • /api/plants   │    │ • plants        │
│ • Components    │    │ • /api/notif    │    │ • profiles      │
│ • Hooks         │    │ • /api/auth     │    │ • watering_hist │
└─────────────────┘    └─────────────────┘    │ • notifications │
                                              └─────────────────┘
```

## 3. MODÈLE DE DONNÉES

### 3.1 Tables Principales

#### Table `profiles`
```sql
- id (UUID, PK) → auth.users(id)
- email (TEXT, NOT NULL)
- full_name (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### Table `plants`
```sql
- id (UUID, PK)
- user_id (UUID, FK → auth.users)
- name (TEXT, NOT NULL)
- species (TEXT, NOT NULL)
- purchase_date (DATE)
- image_url (TEXT)
- water_amount (INTEGER, DEFAULT 250) -- en ml
- water_frequency (INTEGER, DEFAULT 7) -- en jours
- last_watered (TIMESTAMP)
- next_watering (TIMESTAMP)
- location (TEXT) -- colonne ajoutée
- notes (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### Table `watering_history`
```sql
- id (UUID, PK)
- plant_id (UUID, FK → plants)
- user_id (UUID, FK → auth.users)
- watered_at (TIMESTAMP)
- amount (INTEGER) -- en ml
- notes (TEXT)
- created_at (TIMESTAMP)
```

#### Table `notifications`
```sql
- id (UUID, PK)
- user_id (UUID, FK → auth.users)
- plant_id (UUID, FK → plants)
- type (TEXT, DEFAULT 'watering_reminder')
- title (TEXT, NOT NULL)
- message (TEXT, NOT NULL)
- is_read (BOOLEAN, DEFAULT FALSE)
- scheduled_for (TIMESTAMP)
- created_at (TIMESTAMP)
```

### 3.2 Fonctions et Triggers

#### Fonction `handle_new_user()`
- Création automatique du profil utilisateur lors de l'inscription
- Trigger sur `auth.users`

#### Fonction `update_next_watering()`
- Mise à jour automatique des dates d'arrosage
- Trigger sur `watering_history`

#### Fonction `create_watering_notification()`
- Création de notifications d'arrosage
- Utilisée pour programmer les rappels

## 4. FONCTIONNALITÉS DÉTAILLÉES

### 4.1 Authentification et Gestion des Utilisateurs

#### Inscription
- **Page** : `/auth/sign-up`
- **Champs** : Email, mot de passe, nom complet
- **Validation** : Email valide, mot de passe sécurisé
- **Redirection** : Page de succès puis dashboard

#### Connexion
- **Page** : `/auth/login`
- **Champs** : Email, mot de passe
- **Gestion d'erreurs** : Messages d'erreur clairs
- **Redirection** : Dashboard après connexion réussie

#### Sécurité
- **Row Level Security** : Activé sur toutes les tables
- **Policies** : Chaque utilisateur ne peut accéder qu'à ses données
- **Middleware** : Protection des routes sensibles

### 4.2 Gestion des Plantes

#### Ajout d'une Plante
- **Page** : `/dashboard/plants/new`
- **Champs obligatoires** :
  - Nom de la plante
  - Espèce
  - Date d'achat
  - Image (upload)
  - Quantité d'eau (ml)
  - Fréquence d'arrosage (jours)
- **Calcul automatique** : Date du prochain arrosage
- **Validation** : Tous les champs requis

#### Modification d'une Plante
- **Page** : `/dashboard/plants/[id]/edit`
- **Fonctionnalités** : Modification de tous les champs
- **Sauvegarde** : Mise à jour en base de données

#### Suppression d'une Plante
- **Confirmation** : Dialogue de confirmation
- **Cascade** : Suppression de l'historique et des notifications
- **Feedback** : Message de succès/erreur

#### Affichage des Plantes
- **Vue** : Grille de cartes responsive
- **Informations affichées** :
  - Nom et espèce
  - Image
  - Prochain arrosage (avec badge d'urgence)
  - Fréquence et quantité d'eau
  - Dernier arrosage
- **Actions** : Arroser, Modifier, Supprimer, Voir détails

### 4.3 Suivi des Arrosages

#### Enregistrement d'un Arrosage
- **Action** : Bouton "Arroser" sur chaque plante
- **Automatique** :
  - Création d'un enregistrement dans `watering_history`
  - Mise à jour de `last_watered`
  - Calcul de `next_watering`
- **Feedback visuel** : État de chargement, confirmation

#### Historique des Arrosages
- **Affichage** : Liste chronologique
- **Informations** : Date, quantité, notes, nom de la plante
- **Filtrage** : Par plante, par période

#### Calculs Intelligents
- **Prochain arrosage** : `last_watered + water_frequency`
- **Plantes en retard** : `next_watering <= now()`
- **Statistiques** : Moyenne des fréquences, total des arrosages

### 4.4 Système de Notifications

#### Types de Notifications
- **Rappels d'arrosage** : Quand une plante doit être arrosée
- **Confirmation d'arrosage** : Après un arrosage enregistré
- **Ajout de plante** : Confirmation d'ajout

#### Gestion des Notifications
- **Page** : `/dashboard/notifications`
- **Fonctionnalités** :
  - Liste de toutes les notifications
  - Marquer comme lu/non lu
  - Marquer toutes comme lues
  - Affichage du nombre de notifications non lues
- **Design** : Badges visuels pour les notifications non lues

#### Programmation des Rappels
- **Automatique** : Lors de l'ajout/modification d'une plante
- **Personnalisable** : Basé sur la fréquence d'arrosage
- **Fonction** : `create_watering_notification()`

### 4.5 Tableau de Bord

#### Statistiques Principales
- **Total des plantes** : Nombre total dans la collection
- **À arroser** : Nombre de plantes nécessitant un arrosage
- **Arrosages récents** : Nombre d'arrosages de la semaine
- **Fréquence moyenne** : Moyenne des fréquences d'arrosage

#### Vue d'Ensemble
- **Grille des plantes** : Vue principale avec toutes les plantes
- **Actions rapides** : Arrosage direct depuis le dashboard
- **Navigation** : Accès rapide aux différentes sections

### 4.6 Interface Utilisateur

#### Design System
- **Thème** : Mode sombre/clair (Next Themes)
- **Composants** : shadcn/ui + Radix UI
- **Couleurs** : Palette cohérente avec accents verts
- **Typographie** : Geist Sans pour le texte, Geist Mono pour le code

#### Responsive Design
- **Mobile First** : Optimisé pour mobile
- **Breakpoints** : sm, md, lg, xl
- **Grilles adaptatives** : 1 colonne mobile → 3 colonnes desktop

#### Accessibilité
- **Navigation clavier** : Support complet
- **Contraste** : Respect des standards WCAG
- **Screen readers** : Labels et descriptions appropriés

## 5. PAGES ET ROUTES

### 5.1 Structure des Routes

```
/ (page d'accueil)
├── /auth/
│   ├── /login
│   ├── /sign-up
│   ├── /sign-up-success
│   └── /error
└── /dashboard/
    ├── / (tableau de bord principal)
    ├── /plants/
    │   ├── /new
    │   ├── /[id]
    │   └── /[id]/edit
    └── /notifications
```

### 5.2 API Routes

```
/api/
├── /plants/
│   ├── / (GET, POST)
│   ├── /[id] (GET, PUT, DELETE)
│   └── /[id]/water (POST)
├── /notifications/
│   ├── / (GET, POST)
│   └── /[id]/read (PATCH)
└── /cron/ (tâches programmées)
```

## 6. SÉCURITÉ ET PERFORMANCE

### 6.1 Sécurité
- **Authentification** : Supabase Auth avec JWT
- **Autorisation** : Row Level Security sur PostgreSQL
- **Validation** : Zod pour la validation des données
- **CORS** : Configuration appropriée
- **HTTPS** : Forcé en production

### 6.2 Performance
- **SSR/SSG** : Next.js App Router
- **Images** : Optimisation automatique Next.js
- **Caching** : Cache des requêtes Supabase
- **Lazy Loading** : Composants chargés à la demande

### 6.3 Monitoring
- **Analytics** : Vercel Analytics intégré
- **Logs** : Logs d'erreur dans la console
- **Métriques** : Suivi des performances

## 7. DÉPLOIEMENT ET ENVIRONNEMENT

### 7.1 Environnements
- **Développement** : `npm run dev`
- **Production** : Déployé sur Vercel
- **Variables d'environnement** :
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

### 7.2 Base de Données
- **Hébergement** : Supabase (PostgreSQL)
- **Migrations** : Scripts SQL dans `/scripts/`
- **Backup** : Automatique via Supabase

## 8. FONCTIONNALITÉS FUTURES (ROADMAP)

### 8.1 Améliorations Court Terme
- **Géolocalisation** : Ajout de la localisation des plantes
- **Photos multiples** : Galerie d'images par plante
- **Notes détaillées** : Système de notes enrichi
- **Export de données** : Export CSV/PDF

### 8.2 Améliorations Moyen Terme
- **Application mobile** : Version React Native
- **Notifications push** : Rappels en temps réel
- **Communauté** : Partage de conseils entre utilisateurs
- **IA** : Reconnaissance d'espèces par photo

### 8.3 Améliorations Long Terme
- **IoT** : Intégration capteurs d'humidité
- **Météo** : Ajustement automatique selon la météo
- **E-commerce** : Boutique de plantes et accessoires
- **Expertise** : Conseils personnalisés d'experts

## 9. CRITÈRES D'ACCEPTATION

### 9.1 Fonctionnalités Obligatoires
- ✅ Authentification utilisateur complète
- ✅ CRUD complet pour les plantes
- ✅ Système d'arrosage avec historique
- ✅ Notifications de rappel
- ✅ Tableau de bord avec statistiques
- ✅ Interface responsive et accessible

### 9.2 Performance
- ✅ Temps de chargement < 3 secondes
- ✅ Support mobile complet
- ✅ Fonctionnement hors ligne basique
- ✅ Sécurité des données utilisateur

### 9.3 Qualité
- ✅ Code TypeScript typé
- ✅ Tests unitaires (à implémenter)
- ✅ Documentation du code
- ✅ Gestion d'erreurs robuste

## 10. CONCLUSION

GreenTrack2 (FloraTrack) est une application web moderne et complète pour la gestion de plantes d'intérieur. L'architecture basée sur Next.js et Supabase offre une solution scalable et performante, tandis que l'interface utilisateur intuitive facilite l'adoption par les utilisateurs.

L'application répond aux besoins essentiels des amateurs de plantes tout en offrant une base solide pour des évolutions futures. La sécurité des données et l'expérience utilisateur sont au cœur des préoccupations du projet.

---

**Version du document** : 1.0  
**Date** : Décembre 2024  
**Auteur** : Analyse automatique du projet GreenTrack2
