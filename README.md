# Smart Schedule - Sistema de Agendamento para Barbearias

Um sistema completo de agendamento para barbearias com integração WhatsApp, painel administrativo e gerenciamento de barbeiros.

## 📁 Estrutura do Projeto

```
smart-schedule-generic/
├── backend/          # FastAPI + PostgreSQL
├── frontend/         # React/TypeScript (em desenvolvimento)
└── README.md
```

## 🎯 Funcionalidades Principais

### **Autenticação e Segurança**
- ✅ Login por nome + número WhatsApp (chave forte)
- ✅ Token JWT válido por 30 dias
- ✅ Conformidade LGPD (direito ao esquecimento, rastreamento de consentimento)
- ✅ Criação automática de usuário na primeira vez

### **Agendamento de Clientes**
- ✅ Interface simples para agendamento
- ✅ Clientes veem apenas 1 opção (a barbearia)
- ✅ Distribuição automática entre barbeiros
- ✅ Confirmação automática via WhatsApp
- ✅ Cancelamento com notificação

### **Painel do Administrador**
- ✅ Dashboard com estatísticas (agendamentos, receita, barbeiros ativos)
- ✅ Gerenciamento de serviços (preço, duração)
- ✅ Visualização de todos os agendamentos
- ✅ Controle de barbearia

### **Gerenciamento de Barbeiros**
- ✅ Cadastro de horários de trabalho por dia
- ✅ Visualização de agendamentos pessoais
- ✅ Estatísticas individuais
- ✅ Atualização de disponibilidade

### **Integração WhatsApp**
- ✅ Confirmação de agendamento
- ✅ Lembrete pré-agendamento
- ✅ Notificação de cancelamento
- ✅ Mensagens personalizadas

## 🛠️ Tecnologias

- **Backend:** FastAPI (Python)
- **Banco de Dados:** PostgreSQL
- **Autenticação:** JWT (Python-Jose)
- **WhatsApp:** Evolution API
- **ORM:** SQLAlchemy
- **Validação:** Pydantic
- **Containerização:** Docker & Docker Compose

## 📦 Instalação Rápida

### Pré-requisitos
- Docker + Docker Compose
- (Opcional) Node.js 18+ para desenvolvimento

### 1. Clone o repositório

```bash
git clone https://github.com/Souzinhaa/smart-schedule-generic.git
cd smart-schedule-generic
```

### 2. Configure variáveis

```bash
cp .env.example .env
# Edite .env com suas configurações
```

### 3. Inicie com Docker

```bash
docker-compose up --build
```

### 4. Acesse

- **App**: http://localhost (Nginx reverse proxy)
- **API**: http://localhost/api
- **Docs**: http://localhost/docs
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000

## 🚀 Desenvolvimento Local

### Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

### Frontend (React + Vite)

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## 📡 Deploy em VPS

Ver [DEPLOY.md](DEPLOY.md) para instruções completas.

Quick start:
```bash
./deploy.sh production
```

## 🔐 Segurança

⚠️ **IMPORTANT:** Antes de ir para produção:
- [ ] Gerar nova `SECRET_KEY`
- [ ] Configurar `EVOLUTION_API_KEY` do WhatsApp
- [ ] Gerar certificado SSL/TLS
- [ ] Alterar credenciais de banco de dados
- [ ] Revisar CORS em `backend/app/main.py`

## 📚 Principais Endpoints

### Autenticação
- `POST /api/auth/login` - Iniciar login (envia código)
- `POST /api/auth/verify-code` - Verificar código (retorna token)
- `GET /api/auth/me` - Dados do usuário autenticado
- `POST /api/auth/refresh-token` - Renovar token
- `POST /api/auth/consent` - Registrar consentimento LGPD
- `DELETE /api/auth/data` - Deletar dados pessoais

### Agendamentos
- `POST /api/appointments/` - Criar agendamento
- `GET /api/appointments/` - Listar meus agendamentos
- `GET /api/appointments/{id}` - Detalhes do agendamento
- `PATCH /api/appointments/{id}` - Atualizar agendamento
- `DELETE /api/appointments/{id}` - Cancelar agendamento

### Barbeiro
- `GET /api/barber/work-hours` - Listar horários de trabalho
- `POST /api/barber/work-hours` - Cadastrar horário
- `PUT /api/barber/work-hours/{id}` - Atualizar horário
- `DELETE /api/barber/work-hours/{id}` - Deletar horário
- `GET /api/barber/stats` - Estatísticas do barbeiro

### Administrador
- `GET /api/admin/dashboard` - Dashboard com estatísticas
- `GET /api/admin/barbershop` - Dados da barbearia
- `PUT /api/admin/barbershop` - Atualizar barbearia
- `GET /api/admin/services` - Listar serviços
- `POST /api/admin/services` - Criar serviço
- `GET /api/admin/barbers` - Listar barbeiros
- `GET /api/admin/appointments` - Listar todos agendamentos

### Público
- `GET /api/services` - Listar serviços disponíveis
- `GET /api/barbershops` - Listar barbearias

## 🗂️ Estrutura do Projeto

```
smart-schedule-generic/
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   │   ├── auth.py           # Autenticação
│   │   │   ├── appointments.py   # Agendamentos
│   │   │   ├── admin.py          # Admin
│   │   │   ├── barber.py         # Barbeiro
│   │   │   └── public.py         # Público
│   │   ├── models.py             # Modelos SQLAlchemy
│   │   ├── schemas.py            # Schemas Pydantic
│   │   ├── auth.py               # JWT e permissões
│   │   ├── whatsapp.py           # Evolution API
│   │   ├── config.py             # Configurações
│   │   ├── database.py           # Conexão BD
│   │   ├── main.py               # Aplicação FastAPI
│   │   └── __init__.py
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── requirements.txt
│   ├── .env.example
│   ├── .gitignore
│   └── TESTING.md
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
└── README.md
```

## 🔐 Conformidade LGPD

- ✅ Rastreamento de consentimento do usuário
- ✅ Direito ao esquecimento implementado
- ✅ Auditoria de consentimento com timestamp e IP
- ✅ Dados arquivados em vez de deletados
- ✅ Política clara de privacidade

## 📊 Modelos de Dados

### User
- Autenticação por WhatsApp
- Roles: client, barber, admin
- Controle de ativação

### Barbershop
- Dados da barbearia
- Admin associado
- Endereço completo

### Barber
- Vinculado a usuário e barbearia
- Horários de trabalho
- Especialidade

### Service
- Nome, descrição, preço
- Duração em minutos
- Vinculado a barbearia

### Appointment
- Cliente, barbeiro, serviço
- Data/hora, status
- Rastreamento de confirmação

### WorkHours
- Dias da semana (0-6)
- Horários de início/fim
- Por barbeiro

### ConsentLog
- Rastreamento LGPD
- Tipo de consentimento
- Data, IP, User Agent

## 🚀 Desenvolvimento

### Adicionar novos serviços

```python
POST /api/admin/services
{
  "name": "Corte Clássico",
  "description": "Corte clássico de cabelo",
  "price": 5000,  # Em centavos (R$ 50,00)
  "duration_minutes": 30
}
```

### Criar agendamento

```python
POST /api/appointments/
{
  "service_id": 1,
  "appointment_date": "2026-04-30T14:00:00"
}
```

## 📝 Licença

MIT License

## 🤝 Contribuição

Sinta-se livre para fazer fork, criar branches e enviar pull requests!

## 📧 Suporte

Para dúvidas ou problemas, abra uma issue no GitHub.