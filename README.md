# Smart Schedule Generic

Sistema de agendamento para barbearias desenvolvido utilizando FastAPI.

## Estrutura do Projeto

```
/app
    /api
    /models
    /schemas
    /services
    /auth
    /whatsapp
    /utils
requirements.txt
.env.example
Dockerfile
docker-compose.yml
README.md
```

## Recursos Principais

- **Autenticação**: A autenticação de usuário é feita através do nome e número de WhatsApp. O token expira em 30 dias.
- **Agendamento de Clientes**: Permite que os clientes agendem seus horários.
- **Painel do Administrador**: Exibe ganhos, horários e análises.
- **Gerenciamento de Barbeiros**: Configuração do horário de trabalho dos barbeiros.
- **Integração com WhatsApp**: Confirmações de agendamentos através da API Evolution.
- **Conformidade com a LGPD**: Inclui política de privacidade, exclusão de dados e gerenciamento de consentimento.
- **Modelos de Banco de Dados**: Utilização do PostgreSQL para armazenamento de dados.
- **Suporte a Docker**: Inclui Dockerfile e docker-compose para fácil execução.

## Instruções de Uso

1. **Clone o repositório**

```bash
git clone https://github.com/Souzinhaa/smart-schedule-generic.git
cd smart-schedule-generic
```

2. **Crie o arquivo .env**

Copie o arquivo `.env.example` para `.env` e preencha as variáveis necessárias.

3. **Instale as dependências**

```bash
pip install -r requirements.txt
```

4. **Execute o projeto**

```bash
docker-compose up --build
```

## Licença

Esse projeto está sob a licença MIT.