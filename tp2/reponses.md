# TP2 : Dockerfile et Construction d'Images

## Exercice 1 : Dockerfile basique

### 1.1 Application Node.js

J'ai créé les fichiers app.js, package.json et Dockerfile

### 1.2 Build et test

```bash
docker build -t eval-app:v1 .
docker run -d --name eval-app-v1 -p 3001:3000 eval-app:v1
curl http://localhost:3001
```

L'app répond bien, taille 44.9 MB

Layers : 13
Commande pour voir : `docker history eval-app:v1`

```bash
IMAGE          CREATED         CREATED BY                                      SIZE      COMMENT
5805ff3902f5   3 hours ago     CMD ["npm" "start"]                             0B        buildkit.dockerfile.v0
<missing>      3 hours ago     EXPOSE [3000/tcp]                               0B        buildkit.dockerfile.v0
<missing>      3 hours ago     COPY app.js . # buildkit                        12.3kB    buildkit.dockerfile.v0
<missing>      3 hours ago     COPY package.json . # buildkit                  12.3kB    buildkit.dockerfile.v0
<missing>      3 hours ago     WORKDIR /app                                    8.19kB    buildkit.dockerfile.v0
<missing>      10 months ago   CMD ["node"]                                    0B        buildkit.dockerfile.v0
<missing>      10 months ago   ENTRYPOINT ["docker-entrypoint.sh"]             0B        buildkit.dockerfile.v0
<missing>      10 months ago   COPY docker-entrypoint.sh /usr/local/bin/ # …   20.5kB    buildkit.dockerfile.v0
<missing>      10 months ago   RUN /bin/sh -c apk add --no-cache --virtual …   5.47MB    buildkit.dockerfile.v0
<missing>      10 months ago   ENV YARN_VERSION=1.22.22                        0B        buildkit.dockerfile.v0
<missing>      10 months ago   RUN /bin/sh -c addgroup -g 1000 node     && …   122MB     buildkit.dockerfile.v0
<missing>      10 months ago   ENV NODE_VERSION=18.20.8                        0B        buildkit.dockerfile.v0
<missing>      12 months ago   CMD ["/bin/sh"]                                 0B        buildkit.dockerfile.v0
<missing>      12 months ago   ADD alpine-minirootfs-3.21.3-x86_64.tar.gz /…   8.5MB     buildkit.dockerfile.v0
```

---

## Exercice 2 : Optimisation du Dockerfile

### 2.1 Cache des dépendances

Créé Dockerfile.optimized - on copie d'abord package.json, puis npm install, puis le code. Ça permet de pas réinstaller les dépendances si on change juste l'app.

### 2.2 Multi-stage build

Dockerfile.multistage avec 2 stages. Stage 1 (builder) installe tout et lance les tests, Stage 2 prend que les dépendances de prod.

```bash
docker build -f Dockerfile.multistage -t eval-app:v2 .
```

Tailles : v1 44.9 MB, v2 45.6 MB

### 2.3 Utilisateur non-root

Dockerfile.nonroot avec appuser UID 1001. L'app tourne pas en root, c'est plus safe.

---

## Exercice 3 : Arguments et variables

### 3.1 ARG et ENV

Dockerfile.args avec ARG NODE_VERSION=18, ENV APP_ENV=production et ENV PORT=3000

ARG c'est pour le build, ENV pour le runtime.

### 3.2 Build avec arguments

```bash
docker build -f Dockerfile.args --build-arg NODE_VERSION=20 -t eval-app:v3-node20 .
docker run -d --name eval-app-v3 -p 3002:3000 -e APP_ENV=development eval-app:v3-node20
curl http://localhost:3002
```

Ça répond avec "environment":"development"

Pour passer une var : `docker run -e VAR_NAME=value image`

---

## Exercice 4 : Application Python

### 4.1 Dockerfile Python

Créé app.py, requirements.txt et Dockerfile avec python:3.11-slim

Utilise gunicorn pour lancer l'app

### 4.2 HEALTHCHECK

```bash
docker build -t eval-flask:v1 .
```

HEALTHCHECK toutes les 30s, timeout 10s, 3 retries

```bash
curl http://localhost:5000/health
```

Ça répond `{"status":"healthy"}`, taille 51.5 MB
