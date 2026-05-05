# Deploy - Smart Schedule em VPS

## Pré-requisitos

- VPS com Docker + Docker Compose
- Domain/IP para acessar
- SSH access

## Setup Inicial

### 1. Conectar ao VPS

```bash
ssh root@seu-vps-ip
```

### 2. Instalar Docker

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

### 3. Instalar Docker Compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

## Deploy Automático

### 1. Clonar repositório

```bash
cd /home/app
git clone https://github.com/Souzinhaa/smart-schedule-generic.git smart-schedule
cd smart-schedule
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
nano .env

# Edite:
# SECRET_KEY - gerar uma chave segura
# EVOLUTION_API_URL + EVOLUTION_API_KEY - APIs do WhatsApp
```

### 3. Executar deploy

```bash
chmod +x deploy.sh
./deploy.sh production
```

## Configuração SSL (HTTPS)

### 1. Instalar Certbot

```bash
sudo apt-get install certbot python3-certbot-nginx
```

### 2. Gerar certificado

```bash
sudo certbot certonly --standalone \
  -d seu-dominio.com \
  -d www.seu-dominio.com \
  --email seu-email@example.com
```

### 3. Atualizar nginx.conf

```nginx
server {
    listen 443 ssl http2;
    server_name seu-dominio.com www.seu-dominio.com;

    ssl_certificate /etc/nginx/ssl/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/seu-dominio.com/privkey.pem;
    
    # ... rest of config
}

# Redirect HTTP -> HTTPS
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;
    return 301 https://$server_name$request_uri;
}
```

### 4. Copiar certificados

```bash
mkdir -p /home/app/smart-schedule/ssl/seu-dominio.com
sudo cp /etc/letsencrypt/live/seu-dominio.com/fullchain.pem ssl/seu-dominio.com/
sudo cp /etc/letsencrypt/live/seu-dominio.com/privkey.pem ssl/seu-dominio.com/
sudo chown -R 1000:1000 ssl/
```

### 5. Atualizar nginx.conf e restart

```bash
docker-compose restart nginx
```

## Monitoramento

### Logs

```bash
# Todos os serviços
docker-compose logs -f

# Apenas backend
docker-compose logs -f backend

# Apenas frontend
docker-compose logs -f frontend
```

### Status

```bash
docker-compose ps
```

### Restart

```bash
docker-compose restart
```

## Backup

### Backup do banco de dados

```bash
docker-compose exec postgres pg_dump -U smart_schedule smart_schedule > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore

```bash
docker-compose exec -T postgres psql -U smart_schedule smart_schedule < backup.sql
```

## Troubleshooting

### Porta 80 já em uso

```bash
sudo lsof -i :80
sudo kill -9 PID
```

### Certificado vencido

```bash
sudo certbot renew
# Copiar novo certificado
sudo cp /etc/letsencrypt/live/seu-dominio.com/* ssl/seu-dominio.com/
docker-compose restart nginx
```

### Banco de dados não inicializa

```bash
# Remover volume danificado
docker-compose down -v
docker-compose up -d
```

## Atualizar aplicação

```bash
cd /home/app/smart-schedule
git pull origin main
docker-compose up -d --build
```

## Performance

### Aumentar file descriptors

```bash
sudo sysctl -w fs.file-max=65535
```

### Nginx cache

Editar `nginx.conf`:

```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m;

location /api {
    proxy_cache my_cache;
    proxy_cache_valid 200 1m;
}
```
