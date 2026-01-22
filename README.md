# Prodify

> Marketplace d'instrumentales pour producteurs et artistes.
> **Version actuelle : v1.0.0-beta (Feature Complete)**

Prodify est une application Full Stack moderne permettant aux beatmakers de vendre leurs productions et aux artistes de découvrir, acheter et télécharger des instrumentales.

Ce projet a été conçu avec une architecture robuste et scalable, en suivant les meilleures pratiques de développement (API First, Sécurité Stateless, Cloud Native).

---

## Stack Technique

### Backend (Spring Boot 3)
*   **Langage :** Java 21
*   **Framework :** Spring Boot 3.4
*   **Sécurité :** Spring Security 6 (Stateless + JWT + BCrypt)
*   **Paiement :** Stripe API (Checkout + Webhooks)
*   **Stockage :** AWS S3 (SDK v2)
*   **Data :** Spring Data JPA (Hibernate + Specifications)
*   **Communication :** Spring Mail (SMTP)
*   **Base de données :** PostgreSQL (Dockerisé)

### Frontend (React)
*   **Framework :** React 18
*   **Langage :** TypeScript
*   **Build Tool :** Vite
*   **Styling :** Tailwind CSS
*   **Etat & Navigation :** React Router 6 + Context API (Auth, Cart, Player)
*   **HTTP Client :** Axios (Intercepteurs Auth)

---

## Fonctionnalités

### E-commerce & Paiement
*   **Panier d'achat** : Persistant (LocalStorage) avec calcul dynamique du total.
*   **Paiement Sécurisé** : Intégration complète de **Stripe Checkout**.
*   **Webhooks** : Validation automatique des commandes côté serveur après paiement.
*   **Emails Transactionnels** : Confirmation de commande et Bienvenue envoyés via SMTP.

### Catalogue & Recherche
*   **Moteur de Recherche** : Filtrage multicritères (Genre, BPM, Prix) avec recherche textuelle instantanée (Debounce).
*   **Lecteur Audio** : Player persistant (Sticky Footer) permettant la navigation sans coupure de son.
*   **Ma Bibliothèque** : Espace client pour retrouver et télécharger les fichiers achetés (liens S3 sécurisés).

### Espace Producteur (Dashboard)
*   **Gestion du Catalogue** : CRUD complet (Ajout, Modification, Suppression de tracks).
*   **Cloud Storage** : Upload de fichiers (MP3/Cover) directement vers **AWS S3**.
*   **Profil Public (SEO)** : Page dédiée par producteur accessible via slug (ex: `/p/rss-beats`).

---

## Installation & Démarrage

### Pré-requis
*   **Node.js 18+**
*   **Java JDK 21**
*   **Docker Desktop** (PostgreSQL)
*   **Stripe CLI** (pour tester les webhooks en local)

### 1. Infrastructure (Docker)
Lancer la base de données :
```bash
docker compose up -d
```

### 2. Backend (Spring boot)
Il est nécessaire de configurer un fichier src/main/resources/secrets.properties avec les clés API (AWS, Stripe, Mailtrap).
```bash
cd backend
./mvnw clean spring-boot:run
```
API : http://localhost:8081/api

### 3. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
## Roadmap & Améliorations

*   [x] **Core Features** (Auth, Catalogue, Dashboard)
*   [x] **Paiement & Commandes** (Stripe, Webhooks)
*   [x] **Infrastructure Cloud** (S3 Storage)
*   [x] **Marketing** (Emails, Profils Publics, SEO URLs)
*   [ ] **Déploiement** : Mise en production (AWS / Vercel).
*   [ ] **Analytics** : Dashboard des ventes pour les producteurs.

---

## Méthodologie

Ce projet a été réalisé en adoptant une approche **"AI-Augmented Development"**.
L'utilisation d'outils comme **Cursor/Claude** a permis d'accélérer l'écriture du code (Boilerplate, DTOs, UI Components) pour se concentrer sur l'architecture logicielle, la sécurité et la logique métier complexe.

**Auteur :** Yassine LAKHAL

