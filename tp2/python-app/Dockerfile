FROM python:3.11-slim

WORKDIR /app

# Copier requirements.txt et installer les dépendances
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier l'application
COPY app.py .

# Exposer le port
EXPOSE 5000

RUN apt-get update && apt-get install -y curl

# Ajouter un healthcheck
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Commande de démarrage avec gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
