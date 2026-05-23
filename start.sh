#!/bin/bash

# QUICK START - DevCard Full Stack
# Execute este script para iniciar tudo automaticamente

echo "🚀 DevCard - Quick Start"
echo "========================"
echo ""

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não instalado. Instale em https://www.docker.com/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não instalado."
    exit 1
fi

echo "✅ Docker detectado"
echo "✅ Docker Compose detectado"
echo ""

# Navegar para diretório do projeto
cd "$(dirname "$0")" || exit

echo "📦 Construindo imagens e iniciando containers..."
echo ""

# Build e run
docker-compose up --build

echo ""
echo "✅ Tudo iniciado!"
echo ""
echo "🌐 Acesse:"
echo "   Frontend: http://localhost"
echo "   API: http://localhost:3001/devs"
echo ""
echo "📊 Para ver logs: docker-compose logs -f"
echo "⏹️  Para parar: Ctrl+C e depois 'docker-compose down'"
