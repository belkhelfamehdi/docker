# TP1 : Manipulation des Conteneurs

## Exercice 1 : Premiers pas

### 1.1 Vérification de l'installation 

```bash
docker --version
```
Docker version 29.2.0, build 0b9d198

### 1.2 Téléchargement d'images 

```bash
docker pull nginx:alpine
docker pull redis:7-alpine
```

Taille nginx:alpine : 26.9MB

Taille redis:7-alpine : 17.7MB

Pourquoi alpine : Images plus légères, moins de dépendances, démarrage rapide

### 1.3 Liste des images 

Commande : 

```bash
docker image ls
```

Nombre total : 20 images

---

## Exercice 2 : Gestion des conteneurs 

### 2.1 Lancer un conteneur Nginx 

```bash
docker run -d --name web-eval -p 8080:80 nginx:alpine
```

Accessible sur http://localhost:8080 ✓

### 2.2 Inspection du conteneur 

Adresse IP : 172.17.0.2
État (status) : running

Date de création : 2026-02-09T10:46:45.864368332Z

### 2.3 Logs et processus 

```bash
docker logs --tail 10 web-eval
docker top web-eval
```

### 2.4 Exécution de commandes 

```bash
docker exec -it web-eval sh
echo "Mehdi Belkhelfa" > /tmp/evaluation.txt
ls -l /tmp/evaluation.txt
cat /tmp/evaluation.txt
exit
```

---

## Exercice 3 : Cycle de vie 

### 3.1 Arrêt et redémarrage 

```bash
docker stop web-eval
docker ps
docker ps -a
docker start web-eval
docker exec web-eval cat /tmp/evaluation.txt
```

Le fichier existe toujours. Raison : L'arrêt du conteneur ne supprime pas son système de fichiers

### 3.2 Création d'un conteneur Redis 

```bash
docker run -d --name cache-eval redis:7-alpine
docker exec -it cache-eval redis-cli
```

Commandes Redis :
```
SET evaluation "reussie"
GET evaluation
```

### 3.3 Gestion multiple 

```bash
docker ps -a
docker stop $(docker ps -q)
docker container prune -f
```

Différence : 
- docker stop : arrête un conteneur (peut être redémarré)
- docker rm : supprime définitivement un conteneur

---

## Exercice 4 : Volumes et persistance 

### 4.1 Création d'un volume 

```bash
docker volume create data-eval
```

### 4.2 Utilisation du volume 

```bash
docker run --rm -v data-eval:/data alpine sh -c "echo 'donnees persistantes' > /data/persistant.txt"
```

### 4.3 Vérification de la persistance 

```bash
docker run --rm -v data-eval:/data alpine sh -c "cat /data/persistant.txt"
```

Pourquoi les données persistent : Le volume Docker est indépendant du cycle de vie des conteneurs. Les données sont stockées sur l'hôte, pas dans le conteneur.

---

## Nettoyage

```bash
docker rm -f web-eval cache-eval
docker volume rm data-eval
```
