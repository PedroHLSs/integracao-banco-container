#!/bin/bash

# Script de teste da API DevCard
# Uso: bash test-api.sh

API="http://localhost:3001/devs"

echo "================================"
echo "  Teste de API - DevCard"
echo "================================"
echo ""

# Teste 1: GET - Listar todos
echo "1️⃣  GET /devs - Listar todos os desenvolvedores"
curl -s $API | jq . 
echo ""
echo ""

# Teste 2: POST - Criar novo
echo "2️⃣  POST /devs - Criar novo desenvolvedor"
curl -s -X POST $API \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Santos",
    "email": "maria@example.com",
    "nivel": "Pleno"
  }' | jq .
echo ""
echo ""

# Teste 3: GET - Listar após criar
echo "3️⃣  GET /devs - Listar após criar"
curl -s $API | jq .
echo ""
echo ""

# Teste 4: PUT - Atualizar
echo "4️⃣  PUT /devs/4 - Atualizar desenvolvedor (ID 4)"
curl -s -X PUT http://localhost:3001/devs/4 \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Santos Updated",
    "email": "maria.updated@example.com",
    "nivel": "Senior"
  }' | jq .
echo ""
echo ""

# Teste 5: DELETE - Deletar
echo "5️⃣  DELETE /devs/4 - Deletar desenvolvedor (ID 4)"
curl -s -X DELETE http://localhost:3001/devs/4 | jq .
echo ""
echo ""

# Teste 6: GET - Listar final
echo "6️⃣  GET /devs - Estado final"
curl -s $API | jq .
echo ""
echo ""

echo "✅ Testes completos!"
