# Prodify

> Marketplace d'instrumentales pour producteurs et artistes.
> Version actuelle : v0.9.0-beta

Prodify est une application Full Stack moderne permettant aux beatmakers de vendre leurs productions et aux artistes de découvrir et d'acheter des instrumentales.

Ce projet a été conçu avec une architecture robuste et scalable, en suivant les meilleures pratiques de développement (API First, Sécurité Stateless, Clean Code).

---

## Stack Technique

### Backend (Spring Boot 3)
*   **Langage :** Java 21
*   **Framework :** Spring Boot 3.4
*   **Sécurité :** Spring Security 6 (Stateless + JWT + BCrypt)
*   **Data :** Spring Data JPA / Hibernate
*   **Base de données :** PostgreSQL (Dockerisé)
*   **Stockage :** Gestionnaire de fichiers local (support Multipart)

### Frontend (React)
*   **Framework :** React 18
*   **Langage :** TypeScript
*   **Build Tool :** Vite
*   **Styling :** Tailwind CSS
*   **Etat & Navigation :** React Router 6 + Context API (Auth & Player)
*   **HTTP Client :** Axios (avec Intercepteurs)

---

## Fonctionnalités Principales (v0.9)

### Authentification & Sécurité
*   Inscription et Connexion sécurisée (JWT Token).
*   Hashage des mots de passe (BCrypt).
*   Protection des routes API via Spring Security Filtres.
*   Contexte d'authentification persistant côté client.

### Catalogue & Lecture
*   Catalogue public des instrumentales.
*   **Lecteur Audio Persistant** : La musique continue de jouer pendant la navigation.
*   Fiches détaillées des tracks (BPM, Genre, Prix).

### Espace Producteur (Dashboard)
*   Tableau de bord dédié aux vendeurs.
*   **Système d'Upload** : Ajout de fichiers Audio (MP3/WAV) et d'Images de couverture.
*   Gestion du catalogue : Ajout et Suppression de tracks en temps réel.
*   Protection des ressources : Un producteur ne peut supprimer que ses propres sons.

---

## Installation & Démarrage

### Pré-requis
*   Node.js 18+
*   Java JDK 21
*   Docker (pour la base de données)

### 1. Base de données
Lancer le conteneur PostgreSQL via Docker Compose :
```bash
docker-compose up -d
```
### 2. Backend
```bash
cd backend
./mvnw spring-boot:run
```
Le serveur démarrera sur http://localhost:8081


### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
L'application sera accessible sur http://localhost:5173


## Roadmap (Fonctionnalités à venir)

Panier & Commandes (En cours de développement)

Paiement : Intégration complète avec Stripe.

Cloud Storage : Migration du stockage local vers AWS S3.

Profils Publics : Pages dédiées pour chaque producteur.


Auteur : Yassine LAKHAL
