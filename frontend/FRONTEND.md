# Smart Schedule - Frontend

React + Vite para agendamento de barbearias.

## Stack

- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling (via package.json)
- **Lucide React** - Icons
- **Axios** - HTTP client
- **React Router** - Navigation (setup ready)

## Estrutura

```
frontend/
├── src/
│   ├── components/
│   │   └── AuthScreen.jsx      - Login com WhatsApp
│   ├── services/
│   │   └── api.js              - Cliente HTTP + endpoints
│   ├── App.jsx                 - App principal (já integrado com API)
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── public/
├── Dockerfile                  - Produção
├── package.json
├── vite.config.js
└── .env.example
```

## Desenvolvimento

### Setup

```bash
npm install
cp .env.example .env.local
```

### Variáveis de ambiente

`.env.local`:
```env
VITE_API_URL=http://localhost:8000/api
```

### Run

```bash
npm run dev
```

Acessa em: http://localhost:5173

### Build

```bash
npm run build
npm run preview
```

## Fluxo da Aplicação

1. **AuthScreen** - Login com WhatsApp
   - Requer telefone + nome
   - Backend envia código (mockado: 432100)
   - Verifica código → token JWT

2. **HomeScreen** - Início
   - Lista serviços da API
   - Mostra barbeiros
   - Botão "Agendar"

3. **Booking Steps**
   - Step 1: Escolher serviço
   - Step 2: Escolher barbeiro
   - Step 3: Escolher data/hora
   - Step 4: Confirmar
   - Step 5: Sucesso

## Integração com Backend

### Serviço API (`src/services/api.js`)

```javascript
import { authService, appointmentService, publicService } from './services/api';

// Login
const res = await authService.login('5511999999999', 'João');
// Verificar código
const token = await authService.verifyCode('5511999999999', '432100');
// Criar agendamento
await appointmentService.create(serviceId, appointmentDate);
// Listar serviços
const services = await publicService.getServices();
```

### Autenticação

- Token armazenado em `localStorage`
- Enviado automaticamente em `Authorization: Bearer {token}`
- Logout remove token

## Customização

### Cores

Em `App.jsx` - mudar constantes:
```javascript
const GOLD = '#C9A84C';
const DARK = '#0f0f0f';
```

### Dados Mockados

Barbeiros e horários estão hardcoded em `App.jsx`. Para usar da API:

1. Adicionar endpoint `/api/barbers` no backend
2. Carregar em `useEffect`
3. Passar como props

## Deploy

### Docker

```bash
docker build -t smart-schedule-web .
docker run -p 3000:3000 smart-schedule-web
```

### Produção (com Nginx)

Ver [../docker-compose.yml](../docker-compose.yml) - frontend é servido via Nginx com API proxy.

## Troubleshooting

### API retorna 404

- Verificar se backend está rodando
- Verificar `VITE_API_URL` em `.env.local`
- Verificar CORS no backend

### Código de verificação não funciona

- Código mockado é **432100**
- Check do telefone deve ter 11 dígitos (com DDD)

### Imagens/assets não carregam

- Assets devem estar em `public/` ou importados em `src/`
- Vite servirá com caminho correto

## Próximos passos

- [ ] Adicionar more/editar agendamentos
- [ ] Histórico de agendamentos
- [ ] Notificações push
- [ ] Modo offline
- [ ] Temas (dark/light)
