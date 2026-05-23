# 🛠️ COMANDOS ÚTEIS - DevCard Full Stack

## Iniciar/Parar

```bash
# Iniciar em background
docker-compose up -d --build

# Iniciar em foreground (ver logs)
docker-compose up --build

# Parar containers
docker-compose down

# Parar e remover volumes (limpar tudo)
docker-compose down -v
```

## Logs e Debug

```bash
# Ver todos os logs em tempo real
docker-compose logs -f

# Logs do backend apenas
docker-compose logs -f backend

# Logs do frontend
docker-compose logs -f frontend

# Logs do database
docker-compose logs -f db

# 100 últimas linhas
docker-compose logs --tail=100
```

## Status

```bash
# Ver status dos containers
docker-compose ps

# Ver uso de recursos
docker stats

# Inspecionar um container
docker-compose exec backend sh

# Inspecionar database
docker-compose exec db psql -U devcard -d devcard
```

## Build

```bash
# Rebuild sem cache
docker-compose build --no-cache

# Build apenas backend
docker-compose build backend

# Build apenas frontend
docker-compose build frontend
```

## Testar API

### GET - Listar todos
```bash
curl http://localhost:3001/devs
```

### POST - Criar
```bash
curl -X POST http://localhost:3001/devs \
  -H "Content-Type: application/json" \
  -d '{"nome":"João","email":"joao@test.com","nivel":"Senior"}'
```

### PUT - Atualizar (ID 1)
```bash
curl -X PUT http://localhost:3001/devs/1 \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Silva","email":"joao@test.com","nivel":"Pleno"}'
```

### DELETE - Deletar (ID 1)
```bash
curl -X DELETE http://localhost:3001/devs/1
```

## Dentro do Database

```bash
# Conectar ao PostgreSQL
docker-compose exec db psql -U devcard -d devcard

# Dentro do psql:
SELECT * FROM desenvolvedores;
SELECT * FROM habilidades;
SELECT * FROM projetos;
SELECT * FROM dev_habilidades;
\q  (sair)
```

## Limpeza

```bash
# Remove container parados
docker container prune

# Remove imagens não utilizadas
docker image prune

# Remove volumes não utilizados
docker volume prune

# Limpeza completa (CUIDADO)
docker system prune -a --volumes
```

## Desenvolvimento

```bash
# Executar comando no backend
docker-compose exec backend npm install <pacote>

# Ver arquivo do container
docker-compose exec backend cat server.js

# Copiar arquivo do container
docker cp devcard_backend_1:/app/server.js ./backend/

# Executar shell no backend
docker-compose exec backend sh
```

## Docker Compose Validação

```bash
# Validar yaml
docker-compose config

# Dry-run (ver o que seria executado)
docker-compose config --resolve-image-digests
```

## Monitoramento

```bash
# Ver histórico de eventos
docker events --filter "container=devcard_backend_1"

# Verificar saúde do container
docker inspect --format='{{.State.Health.Status}}' devcard_db_1

# Comparar imagens
docker image ls | grep devcard
```

## Rebuildar Tudo do Zero

```bash
# 1. Parar tudo
docker-compose down

# 2. Remover volumes e imagens
docker-compose down -v
docker-compose rm -f

# 3. Rebuild total
docker-compose build --no-cache

# 4. Iniciar
docker-compose up -d
```

## Para Demonstração

```bash
# Terminal 1: Logs em tempo real
docker-compose logs -f

# Terminal 2: Teste na API
curl http://localhost:3001/devs | jq .

# Terminal 3: Abrir navegador
# Acesse http://localhost
```

## Problemas Comuns

```bash
# Porta 80 em uso
sudo lsof -i :80
kill -9 <PID>

# Porta 3001 em uso
sudo lsof -i :3001

# Porta 5432 em uso
sudo lsof -i :5432

# Espaço em disco insuficiente
docker system prune -a --volumes
```

---

**💡 Dica**: Adicione `alias dcup='docker-compose up'` e `alias dcdown='docker-compose down'` ao seu `.bashrc` ou `.zshrc` para comandos rápidos.
