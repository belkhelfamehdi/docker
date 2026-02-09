# TP3 : Architecture Multi-Services

## Exercice 1 : Compose basique

### 1.1 Premier docker-compose.yml

Créé docker-compose.yml avec:
- PostgreSQL 15-alpine (eval-db) avec volumes db-data
- Adminer (eval-adminer) sur port 8080

### 1.2 Validation

```bash
docker compose up -d
docker compose ps
```

Adminer : http://localhost:8080
- Serveur: db
- Utilisateur: evaluser
- Mot de passe: evalpass
- Base: evaldb

Table users créée avec colonnes id, name, email

**Logs en direct:**
```bash
docker compose logs -f
```

**CLI PostgreSQL:**
```bash
docker exec -it eval-db psql -U evaluser -d evaldb
```

---

## Exercice 2 : Application multi-tiers

### 2.1 Architecture complète

Création de l'API Node.js avec:
- Express pour le serveur
- PostgreSQL pour les données
- Redis pour le cache

Services ajoutés:
- api (Node.js) sur port 3000
- redis (7-alpine)

### 2.2 Réseau personnalisé

Réseau eval-network créé en bridge. Tous les services connectés.

**Avantage du réseau custom:** DNS automatique par nom de service (ex: redis, db, api)

### 2.3 Script d'initialisation DB

Créé db/init.sql monté dans PostgreSQL. Table users pré-remplie avec 3 enregistrements.

---

## Exercice 3 : Reverse Proxy Nginx

### 3.1 Configuration Nginx

Service nginx ajouté:
- Port 80 exposé
- Proxy vers API sur /api
- HTML page sur /

### 3.2 Test complet

```bash
docker compose up -d
curl http://localhost
```

Interface web sur http://localhost:
- Get Stats → affiche userCount depuis cache ou DB
- Get Users → requête /api/users
- Health Check → /health

**Vérifier le cache Redis:**
```bash
docker exec eval-redis redis-cli KEYS "*"
docker exec eval-redis redis-cli GET stats
```

**Si Redis s'arrête:** Stats partiront de la DB directement (fallback)

---

## Exercice 4 : Environnements

### 4.1 Fichier .env

Créé .env avec variables:
- POSTGRES_USER=evaluser
- POSTGRES_PASSWORD=evalpass
- POSTGRES_DB=evaldb
- API_PORT=3000

### 4.2 Override pour développement

docker-compose.override.yml:
- Port 5432 exposé pour PostgreSQL
- Volume ./api:/app pour hot-reload
- Labels environment: development
- NODE_ENV=development

---

## Structure créée

```
tp3/
├── docker-compose.yml
├── docker-compose.override.yml
├── .env
├── api/
│   ├── Dockerfile
│   ├── app.js
│   └── package.json
├── db/
│   └── init.sql
├── nginx/
│   ├── nginx.conf
│   └── index.html
└── reponses.md
```

---

## Commandes principales

```bash
# Démarrer la stack
docker compose up -d

# Voir les services
docker compose ps

# Logs en direct
docker compose logs -f api

# Arrêter tout
docker compose down

# Reset volumes
docker compose down -v

# Rebuild images
docker compose up -d --build
```

## Endpoints

- http://localhost → Interface web
- http://localhost/api/health → Health check API
- http://localhost/api/users → List users
- http://localhost/api/stats → User count (cached)
- http://localhost:8080 → Adminer (DB admin)
