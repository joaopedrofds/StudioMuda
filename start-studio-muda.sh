#!/bin/bash

# Script para iniciar todos os componentes do Studio Muda
# Salve este arquivo na raiz do projeto e torne-o executável com: chmod +x start-studio-muda.sh

echo "=== Iniciando o Sistema Studio Muda ==="
echo ""

# Definir caminhos
PROJECT_PATH="$HOME/Área de trabalho/StudioMuda"
BACKEND_PATH="$PROJECT_PATH/backend"
WAR_FILE="$BACKEND_PATH/StudioMuda.war"
JETTY_WEBAPPS="/var/lib/jetty9/webapps"

# Verificar se o arquivo WAR existe
if [ ! -f "$WAR_FILE" ]; then
    echo "❌ ERRO: Arquivo WAR não encontrado em: $WAR_FILE"
    echo "Por favor, verifique o caminho do arquivo."
    exit 1
fi

# Função para verificar se um comando foi executado com sucesso
check_status() {
    if [ $? -eq 0 ]; then
        echo "✅ $1 completado com sucesso."
    else
        echo "❌ ERRO ao $1. Código de saída: $?"
        exit 1
    fi
}

# Passo 1: Verificar e iniciar MySQL
echo "🔍 Verificando status do MySQL..."
sudo systemctl status mysql >/dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "🚀 Iniciando serviço MySQL..."
    sudo systemctl start mysql
    check_status "iniciar MySQL"
else
    echo "✅ MySQL já está em execução."
fi

# Passo 2: Criar banco de dados se não existir
echo "🔍 Verificando banco de dados 'studiomuda'..."
sudo mysql -e "CREATE DATABASE IF NOT EXISTS studiomuda;"
check_status "criar banco de dados"

# Passo 3: Verificar e criar diretório do Jetty se necessário
echo "🔍 Verificando diretório do Jetty..."
if [ ! -d "$JETTY_WEBAPPS" ]; then
    echo "📁 Criando diretório do Jetty webapps..."
    sudo mkdir -p $JETTY_WEBAPPS
    check_status "criar diretório Jetty"
else
    echo "✅ Diretório Jetty webapps existe."
fi

# Passo 4: Copiar o arquivo WAR para o Jetty
echo "📋 Copiando arquivo WAR para o Jetty..."
sudo cp "$WAR_FILE" "$JETTY_WEBAPPS/"
check_status "copiar arquivo WAR"

# Passo 5: Reiniciar o Jetty
echo "🚀 Reiniciando serviço Jetty..."
sudo systemctl restart jetty9
check_status "reiniciar Jetty"

# Passo 6: Iniciar o frontend React
echo "🚀 Iniciando o frontend React..."
echo "📂 Navegando para o diretório do projeto: $PROJECT_PATH"
cd "$PROJECT_PATH"

echo "🔍 Verificando dependências do Node.js..."
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
    check_status "instalar dependências"
else
    echo "✅ Dependências já instaladas."
fi

echo ""
echo "=== Todos os componentes iniciados com sucesso! ==="
echo "🌐 O backend está rodando em: http://localhost:8080/StudioMuda/api"
echo "🌐 O frontend será iniciado em: http://localhost:5173"
echo ""
echo "📝 Credenciais para teste:"
echo "   Email: admin@studiomuda.com"
echo "   Senha: admin123"
echo ""
echo "⚠️ Pressione Ctrl+C para encerrar o frontend quando terminar."
echo ""

# Iniciar o frontend em primeiro plano
npm run dev