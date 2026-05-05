# Smart Schedule API - Testing Guide

## Teste com Código Mockado 432100

### 1. Login (Gera código de verificação)
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "whatsapp": "5511999999999",
    "name": "João Silva"
  }'
```

Resposta:
```json
{
  "requires_code_verification": true,
  "message": "Código enviado para 5511999999999. Use o código mockado: 432100"
}
```

### 2. Verificar Código (Retorna token JWT)
```bash
curl -X POST "http://localhost:8000/api/auth/verify-code" \
  -H "Content-Type: application/json" \
  -d '{
    "whatsapp": "5511999999999",
    "code": "432100"
  }'
```

Resposta:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 2592000
}
```

### 3. Usar Token em Requisições Autenticadas
```bash
curl -X GET "http://localhost:8000/api/auth/me" \
  -H "Authorization: Bearer {access_token}"
```

## Fluxo Completo de Agendamento

### 1. Criar Serviço (Admin)
Primeiro, criar usuário admin no banco:
```sql
INSERT INTO users (whatsapp, name, role, is_active) VALUES ('5511888888888', 'Admin', 'admin', true);
INSERT INTO barbershops (name, address, phone, city, state, admin_id) VALUES ('Barbearia X', 'Rua Y', '1133333333', 'São Paulo', 'SP', 1);
INSERT INTO services (barbershop_id, name, price, duration_minutes) VALUES (1, 'Corte Clássico', 5000, 30);
```

### 2. Listar Serviços Públicos
```bash
curl -X GET "http://localhost:8000/api/services"
```

### 3. Criar Agendamento
```bash
curl -X POST "http://localhost:8000/api/appointments/" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "service_id": 1,
    "appointment_date": "2026-05-15T14:00:00",
    "notes": "Primeira vez"
  }'
```

## Rotas Disponíveis

### Auth
- `POST /api/auth/login` - Iniciar login (retorna código)
- `POST /api/auth/verify-code` - Verificar código (retorna token)
- `GET /api/auth/me` - Dados do usuário atual
- `POST /api/auth/refresh-token` - Renovar token
- `POST /api/auth/consent` - Registrar consentimento LGPD
- `DELETE /api/auth/data` - Deletar dados pessoais

### Agendamentos
- `POST /api/appointments/` - Criar agendamento
- `GET /api/appointments/` - Listar meus agendamentos
- `GET /api/appointments/{id}` - Ver agendamento
- `PATCH /api/appointments/{id}` - Atualizar agendamento
- `DELETE /api/appointments/{id}` - Cancelar agendamento

### Barbeiro
- `POST /api/barber/work-hours` - Registrar horários
- `GET /api/barber/work-hours` - Listar horários
- `PUT /api/barber/work-hours/{id}` - Atualizar horário
- `DELETE /api/barber/work-hours/{id}` - Deletar horário
- `GET /api/barber/stats` - Ver estatísticas

### Admin
- `GET /api/admin/dashboard` - Dashboard
- `GET /api/admin/barbershop` - Dados da barbearia
- `PUT /api/admin/barbershop` - Atualizar barbearia
- `POST /api/admin/services` - Criar serviço
- `GET /api/admin/services` - Listar serviços
- `GET /api/admin/barbers` - Listar barbeiros
- `GET /api/admin/appointments` - Todos os agendamentos

### Público
- `GET /api/services` - Listar serviços
- `GET /api/barbershops` - Listar barbearias
- `GET /api/health` - Health check

## Documentação Interativa
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
