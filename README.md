# Smart Schedule Generic - Sistema de Agendamento para Barbearias

Um sistema completo de agendamento para barbearias com integração WhatsApp, painel administrativo e gerenciamento de barbeiros.

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

## 📦 Instalação

### Pré-requisitos
- Docker e Docker Compose
- Git

### Passos

1. **Clone o repositório:**
```bash
git clone https://github.com/Souzinhaa/smart-schedule-generic.git
cd smart-schedule-generic
```

2. **Configure as variáveis de ambiente:**
```bash
cp .env.example .env
```

3. **Edite o arquivo `.env` com suas configurações:**
```env
DATABASE_URL=postgresql://user:password@postgres:5432/smart_schedule
EVOLUTION_API_URL=https://api.evolution.com
EVOLUTION_API_KEY=sua_chave_api_aqui
SECRET_KEY=sua_chave_secreta_segura
```

4. **Inicie os containers:**
```bash
docker-compose up --build
```

5. **Acesse a API:**
- API: http://localhost:8000
- Documentação Swagger: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- Health Check: http://localhost:8000/health

## 📚 Principais Endpoints

### Autenticação
- `POST /api/auth/login` - Login/Registro por WhatsApp
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
skart-schedule-generic/
├── app/
│   ├── routes/
│   │   ├── auth.py           # Autenticação
│   │   ├── appointments.py   # Agendamentos
│   │   ├── admin.py          # Admin
│   │   ├── barber.py         # Barbeiro
│   │   └── public.py         # Público
│   ├── models.py             # Modelos SQLAlchemy
│   ├── schemas.py            # Schemas Pydantic
│   ├── auth.py               # JWT e permissões
│   ├── whatsapp.py           # Evolution API
│   ├── config.py             # Configurações
│   ├── database.py           # Conexão BD
│   ├── main.py               # Aplicação FastAPI
│   └── __init__.py
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── .env.example
├── .gitignore
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