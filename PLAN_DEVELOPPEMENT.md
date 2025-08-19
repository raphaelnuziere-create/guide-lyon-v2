# 📋 PLAN DE DÉVELOPPEMENT COMPLET - Guide de Lyon

## 🎯 OBJECTIF FINAL
Restaurer 100% du site original de localhost:3000 avec toutes ses fonctionnalités, migrer les données WordPress, et déployer en production sur guide-de-lyon.fr

---

## 📊 PHASE 1 : RESTAURATION DU DESIGN (En cours - 2-3 jours)

### ✅ Complété
- [x] Structure de base Next.js sur Vercel
- [x] CalendarWidget avec système 2 colonnes
- [x] Page référencement avec 4 plans (Gratuit, Basic, Premium, Elite)
- [x] Dashboard professionnel
- [x] Page inscription professionnelle

### 🔄 En cours
- [ ] **Correction des couleurs bleu/violet** (PRIORITÉ 1)
  - Remplacer TOUTES les références rouge par bleu/violet
  - Gradient principal : `#667eea → #764ba2`
  - Mettre à jour tous les composants

### ⏳ À faire
- [ ] **Pages manquantes du design original**
  - Page connexion admin (`/admin/login`)
  - Dashboard validation admin (`/admin/validation`)
  - Page profil utilisateur (`/profil`)
  - Page favoris (`/favoris`)
  - Page réservations (`/reservations`)

---

## 📊 PHASE 2 : BASE DE DONNÉES & AUTHENTIFICATION (3-4 jours)

### 1. **Configuration Supabase**
```sql
-- Tables principales
- users (authentification)
- establishments (établissements)
- events (événements)
- articles (blog/actualités)
- reviews (avis)
- subscriptions (abonnements)
- favorites (favoris utilisateurs)
- reservations
```

### 2. **Système d'authentification**
- [ ] Auth côté client (utilisateurs)
- [ ] Auth côté professionnel (établissements)
- [ ] Auth côté admin (validation/modération)
- [ ] Rôles et permissions (RBAC)

### 3. **APIs à créer**
```typescript
/api/auth/* - Authentification
/api/establishments/* - CRUD établissements
/api/events/* - Gestion événements
/api/articles/* - Blog/Actualités
/api/subscriptions/* - Abonnements Stripe
/api/admin/* - Administration
```

---

## 📊 PHASE 3 : MIGRATION WORDPRESS (2-3 jours)

### 1. **Export des données WordPress**
- [ ] Export XML/JSON des articles
- [ ] Export des médias (images)
- [ ] Export des catégories/tags
- [ ] Export des utilisateurs

### 2. **Script de migration**
```javascript
// Script de migration WordPress → Supabase
- Parser XML WordPress
- Transformer en format Supabase
- Upload des images vers Supabase Storage
- Import batch dans la base
```

### 3. **Vérification**
- [ ] Tous les articles importés
- [ ] URLs redirect (301) configurées
- [ ] SEO préservé (meta, slugs)
- [ ] Images optimisées

---

## 📊 PHASE 4 : SYSTÈME DE VALIDATION ADMIN (2 jours)

### 1. **Dashboard Admin**
```
/admin
├── /validation     - Nouveaux établissements à valider
├── /establishments - Gestion des établissements
├── /users         - Gestion utilisateurs
├── /events        - Modération événements
├── /articles      - Gestion blog
├── /analytics     - Statistiques globales
└── /settings      - Configuration site
```

### 2. **Workflow de validation**
1. Inscription pro → Status: `pending`
2. Admin review → Vérification SIRET, photos
3. Validation → Status: `approved` + Email
4. Ou rejet → Status: `rejected` + Email avec raisons

### 3. **Notifications**
- [ ] Email nouvelle inscription
- [ ] Dashboard notifications temps réel
- [ ] Rappels établissements non validés

---

## 📊 PHASE 5 : INTÉGRATION PAIEMENTS (2 jours)

### 1. **Configuration Stripe**
- [ ] Produits : Basic (29€), Premium (79€), Elite (149€)
- [ ] Webhooks : subscription.created, updated, deleted
- [ ] Portal client pour gestion abonnement

### 2. **Gestion des quotas**
```javascript
Plan Gratuit: 0 events, 1 photo
Plan Basic: 1 event/mois, 10 photos
Plan Premium: 5 events/mois, photos illimitées
Plan Elite: Illimité + features premium
```

### 3. **Facturation**
- [ ] Génération factures PDF
- [ ] Historique paiements
- [ ] Relances automatiques

---

## 📊 PHASE 6 : OPTIMISATION PRODUCTION (2 jours)

### 1. **Performance**
- [ ] Images : Next/Image + CDN
- [ ] Code splitting par route
- [ ] API caching (Redis/Vercel)
- [ ] Static Generation où possible
- [ ] Bundle size < 200kb

### 2. **SEO**
- [ ] Sitemap.xml dynamique
- [ ] Robots.txt optimisé
- [ ] Schema.org (LocalBusiness)
- [ ] Open Graph + Twitter Cards
- [ ] Meta descriptions dynamiques

### 3. **Monitoring**
- [ ] Google Analytics 4
- [ ] Sentry pour les erreurs
- [ ] Uptime monitoring
- [ ] Performance metrics (Core Web Vitals)

---

## 📊 PHASE 7 : MISE EN PRODUCTION (1 jour)

### 1. **Pré-production**
- [ ] Tests end-to-end (Playwright)
- [ ] Audit sécurité
- [ ] Backup stratégie
- [ ] Documentation API

### 2. **Déploiement**
```bash
1. Configuration DNS guide-de-lyon.fr → Vercel
2. Variables environnement production
3. SSL/HTTPS activation
4. CDN configuration
5. Email configuration (SPF, DKIM)
```

### 3. **Post-déploiement**
- [ ] Monitoring première semaine
- [ ] Collecte feedback utilisateurs
- [ ] Ajustements performance
- [ ] Formation équipe

---

## 🚀 TECHNOLOGIES STACK FINAL

### Frontend
- **Next.js 15** (App Router)
- **React 19** 
- **TypeScript**
- **Tailwind CSS** (couleurs bleu/violet)
- **Framer Motion** (animations)

### Backend
- **Supabase** (PostgreSQL + Auth + Storage)
- **Stripe** (Paiements)
- **Resend** (Emails transactionnels)
- **Vercel** (Hosting + Functions)

### Outils
- **GitHub** (Version control)
- **Vercel** (CI/CD)
- **Sentry** (Error tracking)
- **Google Analytics** (Analytics)

---

## 📅 TIMELINE ESTIMÉ

| Phase | Durée | Priorité |
|-------|-------|----------|
| Phase 1 - Design | 2-3 jours | 🔴 Critique |
| Phase 2 - BDD/Auth | 3-4 jours | 🔴 Critique |
| Phase 3 - Migration WP | 2-3 jours | 🟠 Haute |
| Phase 4 - Admin | 2 jours | 🟠 Haute |
| Phase 5 - Paiements | 2 jours | 🟡 Moyenne |
| Phase 6 - Optimisation | 2 jours | 🟡 Moyenne |
| Phase 7 - Production | 1 jour | 🔴 Critique |

**Total estimé : 14-18 jours**

---

## ✅ CRITÈRES DE SUCCÈS

1. **Design** : 100% identique à localhost:3000 (bleu/violet)
2. **Données** : 100% articles WordPress migrés
3. **Performance** : Score Lighthouse > 90
4. **SEO** : Maintien du ranking Google
5. **Conversion** : Taux inscription pro > 5%
6. **Stabilité** : Uptime > 99.9%

---

## 🔐 POINTS D'ATTENTION

1. **Sécurité** : Jamais de clés API dans le code
2. **RGPD** : Conformité totale (cookies, données)
3. **Backup** : Stratégie 3-2-1 (3 copies, 2 médias, 1 offsite)
4. **Scalabilité** : Architecture pour 100k+ visiteurs/mois
5. **Coûts** : Budget Vercel Pro + Supabase Pro (~100€/mois)