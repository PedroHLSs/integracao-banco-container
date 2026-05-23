# DevCard - Gerenciador de Desenvolvedores Full Stack com Docker

Aplicação completa Full Stack com **Docker Compose**, demonstrando integração entre front-end, back-end e banco de dados relacional com operações CRUD.

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (Nginx)                  │
│                    Port: 80                          │
│        - HTML5 com interface CRUD responsiva        │
│        - Proxied para API via /api/                 │
└─────────────────┬───────────────────────────────────┘
                  │ /api/devs
                  ▼
┌─────────────────────────────────────────────────────┐
│              Backend (Node.js + Express)             │
│              Port: 3001                              │
│        - CRUD endpoints REST                        │
│        - Validação de dados                         │
│        - Tratamento de erros                        │
└─────────────────┬───────────────────────────────────┘
                  │ TCP Port 5432
                  ▼
┌─────────────────────────────────────────────────────┐
│         Database (PostgreSQL 15)                     │
│         Volume: pgdata                              │
│  - Tabela: desenvolvedores (name, email, nivel)    │
│  - Tabela: habilidades                             │
│  - Tabela: projetos                                │
│  - Tabela: dev_habilidades (M:N)                   │
└─────────────────────────────────────────────────────┘
```

## 🚀 Como Executar

### Pré-requisitos
- Docker >= 20.10
- Docker Compose >= 1.29

### Iniciar os containers

```bash
# Build das imagens e inicialização dos services
docker-compose up --build

# Ou em background
docker-compose up -d --build
```

### Acessar a aplicação

- **Frontend**: http://localhost
- **API**: http://localhost:3001/devs
- **Database**: postgres://devcard:senha123@localhost:5432/devcard

### Parar os containers

```bash
docker-compose down

# Com limpeza de volumes
docker-compose down -v
```

## 📋 Operações CRUD

### Create (POST)
```bash
curl -X POST http://localhost:3001/devs \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@example.com",
    "nivel": "Senior"
  }'
```

### Read (GET)
```bash
curl http://localhost:3001/devs
```

### Update (PUT)
```bash
curl -X PUT http://localhost:3001/devs/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Updated",
    "email": "joao.updated@example.com",
    "nivel": "Pleno"
  }'
```

### Delete (DELETE)
```bash
curl -X DELETE http://localhost:3001/devs/1
```

## 📁 Estrutura de Diretórios

```
devcard/
├── docker-compose.yml       # Orquestração dos services
├── frontend/
│   ├── Dockerfile           # Build Nginx
│   ├── nginx.conf           # Configuração reverse proxy
│   └── index.html           # Interface HTML5
├── backend/
│   ├── Dockerfile           # Build Node.js
│   ├── package.json         # Dependências
│   ├── server.js            # API Express
│   └── db/
│       └── init.sql         # Schema e dados iniciais
└── README.md                # Este arquivo
```

## 🔧 Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Backend**: Node.js 18, Express 4.18
- **Database**: PostgreSQL 15
- **Containerização**: Docker, Docker Compose
- **Proxy**: Nginx Alpine
- **ORM/Drivers**: node-postgres (pg)

## 📊 Schema do Banco de Dados

### Tabela: desenvolvedores
```sql
CREATE TABLE desenvolvedores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  nivel VARCHAR(20) CHECK (nivel IN ('Junior','Pleno','Senior'))
);
```

### Tabela: habilidades
```sql
CREATE TABLE habilidades (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(80) NOT NULL
);
```

### Tabela: projetos
```sql
CREATE TABLE projetos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  descricao TEXT,
  dev_id INT REFERENCES desenvolvedores(id) ON DELETE CASCADE
);
```

### Tabela: dev_habilidades (M:N)
```sql
CREATE TABLE dev_habilidades (
  dev_id INT REFERENCES desenvolvedores(id) ON DELETE CASCADE,
  hab_id INT REFERENCES habilidades(id) ON DELETE CASCADE,
  PRIMARY KEY (dev_id, hab_id)
);
```

## ✅ Checklist de Funcionalidades

- ✅ Docker Compose orquestrando 3 serviços (frontend, backend, database)
- ✅ Persistência de dados via volume Docker (pgdata)
- ✅ API REST com validações e tratamento de erros
- ✅ Interface CRUD completa funcional
- ✅ Nginx como reverse proxy para frontend
- ✅ PostgreSQL com schema normalizado
- ✅ Comunicação entre containers via network (appnet)
- ✅ Variáveis de ambiente configuradas
- ✅ Health checks implícitos (depends_on)

## 🐛 Troubleshooting

### Erro: "Cannot connect to database"
- Aguarde alguns segundos para o PostgreSQL inicializar
- Verifique se a porta 5432 não está em uso
- Limpe volumes antigos: `docker-compose down -v`

### Erro: "Cannot GET /api/devs"
- Confirme que todos os 3 containers estão rodando: `docker-compose ps`
- Verifique os logs: `docker-compose logs backend`

### Erro: "Email already registered"
- O email já existe no banco. Use outro email ou delete o registro anterior.

## 📝 Notas de Desenvolvimento

- **Variáveis sensíveis**: Mudar `senha123` em produção
- **CORS**: Habilitado para frontend consumir API
- **Validações**: Email, níveis de desenvolvedor, campos obrigatórios
- **Errors handling**: Retorna 422 para validação, 404 para não encontrado, 500 para erro server

## 👨‍💻 Desenvolvimento Local (sem Docker)

### Backend
```bash
cd backend
npm install
DB_HOST=localhost DB_USER=postgres DB_PASS=postgres DB_NAME=devcard node server.js
```

### Frontend
Abrir `frontend/index.html` no navegador (requer backend rodando em localhost:3001)

---

**Desenvolvido para fins educacionais** 📚
