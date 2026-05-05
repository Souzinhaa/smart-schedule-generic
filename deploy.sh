#!/bin/bash

# Smart Schedule - Deploy Script
# Uso: ./deploy.sh [production|staging]

ENV=${1:-production}
REPO_URL="https://github.com/Souzinhaa/smart-schedule-generic.git"
APP_DIR="/home/app/smart-schedule"
BRANCH="main"

echo "=== Smart Schedule Deploy ==="
echo "Ambiente: $ENV"
echo "Diretório: $APP_DIR"

# Criar diretório se não existir
mkdir -p $APP_DIR
cd $APP_DIR

# Clonar ou atualizar repositório
if [ -d ".git" ]; then
  echo "Atualizando repositório..."
  git fetch origin
  git checkout $BRANCH
  git pull origin $BRANCH
else
  echo "Clonando repositório..."
  git clone -b $BRANCH $REPO_URL .
fi

# Copiar .env se não existir
if [ ! -f ".env" ]; then
  echo "Criando arquivo .env..."
  cp .env.example .env
  echo "⚠️  Edite o arquivo .env com suas configurações!"
fi

# Build e start containers
echo "Iniciando Docker Compose..."
docker-compose pull
docker-compose up -d --build

echo "Aguardando serviços ficarem prontos..."
sleep 10

# Check health
echo "Verificando saúde dos serviços..."
if curl -f http://localhost/health > /dev/null; then
  echo "✅ API está respondendo"
else
  echo "❌ API não está respondendo"
  docker-compose logs backend
  exit 1
fi

echo ""
echo "=== Deploy Completo ==="
echo "Acesse: http://localhost"
echo "Docs: http://localhost/docs"
echo ""
echo "Logs:"
echo "  docker-compose logs -f backend"
echo "  docker-compose logs -f frontend"
echo "  docker-compose logs -f nginx"
