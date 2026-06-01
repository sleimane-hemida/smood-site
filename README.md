# smood-site

Ce depot est maintenant organise pour contenir le frontend et le backend dans le meme repository.

## Structure

- `front/` : application React + Vite
- `back/` : API Node.js + Express

## Commandes utiles

Depuis la racine du repository :

- `npm run dev:back`
- `npm run start:back`
- `npm run dev:front`
- `npm run build:front`
- `npm run lint:front`
- `npm run preview:front`

## Backend

Le dossier `back/` contient maintenant un backend Node.js avec Express.

Endpoints disponibles :

- `GET /`
- `GET /api/health`
- `GET /api/dashboard`

Le backend ecoute par defaut sur le port `3001`.

## Admin

Une interface administrateur est disponible sur `http://localhost:5173/admin` lorsque le frontend Vite est lance.

Le frontend utilise le proxy Vite pour rediriger les appels `/api` vers le backend Node.js sur le port `3001` en developpement.
