# Backend

Ce dossier contient maintenant un projet Node.js avec Express.

## Commandes

- `npm install`
- `npm run dev`
- `npm run start`

## PostgreSQL

Le backend est prepare pour se connecter a une base PostgreSQL nommee `smood`.

1. Copier `.env.example` vers `.env`
2. Renseigner `DATABASE_URL` ou les variables `PG*`
3. Executer le schema `sql/init.sql` dans PostgreSQL

Endpoint prevu pour les messages de contact :

- `GET /api/contact-messages`

## Endpoints disponibles

- `GET /`
- `GET /api/health`
- `GET /api/dashboard`

Le serveur demarre par defaut sur le port `3001`.
