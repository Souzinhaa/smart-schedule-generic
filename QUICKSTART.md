# Quick Start - Smart Schedule

## Estrutura

```
├── backend/          - FastAPI + PostgreSQL
├── frontend/         - React + Vite
├── docker-compose.yml - Orquestra tudo
├── nginx.conf        - Reverse proxy (prod)
└── deploy.sh         - Script de deploy em VPS
```

## Rodar Localmente (Desenvolvimento)

### Opção 1: Docker (Recomendado)

```bash
docker-compose up --build
```

Acessa em:
- Web: http://localhost (via Nginx)
- API Docs: http://localhost/docs
- Backend: http://localhost:8000
- Frontend: http://localhost:3000

### Opção 2: Separado (desenvolvimento)

**Terminal 1 - Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## Login Rápido

**Teste com código mockado:**

1. Telefone: `11 99999-9999`
2. Nome: `João Silva`
3. Código: `432100`

Ver [backend/TESTING.md](backend/TESTING.md) para exemplos com cURL.

## Deploy em VPS

Ver [DEPLOY.md](DEPLOY.md) para instruções completas.

**Quick deploy:**
```bash
# VPS
ssh root@seu-vps-ip
git clone https://github.com/Souzinhaa/smart-schedule-generic.git
cd smart-schedule-generic
cp .env.example .env
nano .env  # editar
chmod +x deploy.sh
./deploy.sh production
```

## Variáveis de Ambiente

`.env` na raiz:

```env
SECRET_KEY=sua_chave_secreta_segura
EVOLUTION_API_URL=https://api.evolution.com
EVOLUTION_API_KEY=sua_chave_api
DEBUG=False
```

## Comandos Úteis

```bash
# Status dos containers
docker-compose ps

# Logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx

# Restart
docker-compose restart

# Parar
docker-compose down

# Remover volumes (⚠️ apaga dados)
docker-compose down -v
```

## Endpoints Principais

- `POST /api/auth/login` - Iniciar login
- `POST /api/auth/verify-code` - Verificar código
- `POST /api/appointments/` - Criar agendamento
- `GET /api/services` - Listar serviços
- `GET /docs` - Swagger UI
