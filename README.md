# open-229

**Répertoire et communauté open source du Bénin** — mettre en avant les projets (GitHub, GitLab…), les stacks, les contributeur·ices et les démos, pour que l’écosystème **229** soit visible, accessible et vivant.

Le site public (`web/`) est une **landing** + catalogue : explorer, filtrer, s’inscrire, ajouter un projet, profiter d’une **API REST** (`/api/v1/...`) pensée pour un futur client mobile (ex. Flutter).

---

## Pourquoi open-229 ?

- **Visibilité** : sortir les dépôts de l’ombre — catégories, tags, liens, démo.
- **Recrutement** : attirer contributeurs, relecteurs et utilisateurs.
- **Lien social** : groupe **WhatsApp** pour l’entraide rapide (configurable par variables d’environnement).

---

## Stack technique

| Élément | Choix |
|--------|--------|
| Frontend | Next.js 15 (App Router), React, Tailwind CSS |
| Auth & données | Supabase (Auth, Postgres, RLS) |
| API | Route Handlers Next.js `/api/v1/*` (JWT Bearer pour les écritures) |
| Thème | Mode clair / sombre (`next-themes`) |

Schéma SQL et politiques RLS : `web/supabase/migrations/`.

---

## Structure du dépôt

```
open-229/
├── README.md                 ← vous êtes ici
├── IMPLEMENTATION_PLAN.md   # historique / spec produit
├── docs/design/             # exports HTML des maquettes Superdesign
└── web/                     # application Next.js
    ├── app/                 # pages + API
    ├── frontend/components/ # UI (layout, landing, projets…)
    ├── lib/                 # Supabase, validation, données
    ├── supabase/migrations/
    └── env.example
```

---

## Démarrage rapide

**Prérequis** : Node 20+, compte [Supabase](https://supabase.com).

```bash
cd web
cp env.example .env.local
# Éditer .env.local : URL + clé anon Supabase (obligatoire)
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

Appliquer la migration SQL sur votre projet Supabase (éditeur SQL ou CLI Supabase) : fichier `web/supabase/migrations/*.sql`.

---

## Variables d’environnement (`web/.env.local`)

| Variable | Obligatoire | Description |
|----------|-------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Oui | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Oui | Clé publique (anon) |
| `NEXT_PUBLIC_SITE_URL` | Non | URL du site (emails / redirections) |
| `NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL` | Non | Lien d’invitation groupe WhatsApp (`https://chat.whatsapp.com/...`) — **prioritaire** |
| `NEXT_PUBLIC_WHATSAPP_PHONE` | Non | Numéro international sans `+`, ex. `229XXXXXXXXX` → ouvre `https://wa.me/229...` si pas de lien groupe |

Si aucune variable WhatsApp n’est définie, la page d’accueil et le footer restent cohérents ; la section communauté affiche un rappel pour les mainteneur·ices.

---

## API (aperçu)

| Méthode | Route | Auth |
|---------|-------|------|
| `GET` | `/api/v1/projects` | Non |
| `POST` | `/api/v1/projects` | Bearer (JWT Supabase) |
| `GET` | `/api/v1/projects/[slug]` | Non |
| `PATCH` | `/api/v1/projects/[slug]` | Propriétaire |
| `GET` | `/api/v1/profiles/[username]` | Non |
| `GET` | `/api/v1/categories` | Non |

Idéal pour réutiliser la même logique côté **Flutter** ou autre client.

---

## Contribution

Les issues et PR sont les bienvenues : schéma de données, UI, documentation, traductions.

1. Forkez le dépôt  
2. Créez une branche (`feat/…`, `fix/…`)  
3. Ouvrez une PR avec une description claire

Comportement attendu : respect de la communauté béninoise et internationale, projets **réellement** open source et documentés.

---

## Licence

Sauf mention contraire dans un sous-dossier, le contenu de ce dépôt est proposé sous **MIT** — voir les fichiers `LICENSE` le cas échéant.

---

## Contact & communauté

- **WhatsApp** : configurez le lien ou le numéro (voir tableau ci-dessus) pour afficher le bouton flottant et les CTA sur la home.
- **Produit / design** : maquettes de référence dans `docs/design/` (Superdesign).

*Bâti avec le 229 — Cotonou, Porto-Novo, diaspora & amis du Bénin.*
