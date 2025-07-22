# Application FNEK

Ce projet fournit une base pour une application web/mobile destinée aux étudiants en dernière année d'IFMK. Il s'inspire du *Guide des Jeunes Kinésithérapeutes* de la FNEK.

## Prérequis
- Docker et Docker Compose

## Démarrage rapide
```bash
docker-compose up --build
```
L'interface Next.js est accessible sur `http://localhost:3000` et l'API Express sur `http://localhost:3001`.

## Structure
- `frontend/` : application Next.js + Tailwind CSS
- `backend/` : API Node.js/Express connectée à PostgreSQL
- `db/migrations/` : scripts SQL de création des tables

## Modules prévus
- Onboarding
- Calendrier
- Gestion des stages
- Checklist administrative
- Bibliothèque de ressources
- Notifications via Firebase

Ce dépôt n'est qu'une structure de départ avec quelques exemples de pages et de routes.
