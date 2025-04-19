# Guia de Inicialização do Sistema Studio Muda

Este documento fornece as instruções passo a passo para executar todos os componentes do sistema Studio Muda, garantindo seu funcionamento completo.

## Requisitos do Sistema

- Java 21 ou superior
- MySQL 8.0 ou superior
- Node.js 16.0 ou superior
- npm 7.0 ou superior

## Passo a Passo para Execução

### 1. Iniciar o Banco de Dados MySQL

O primeiro componente que deve ser iniciado é o MySQL, que armazena todos os dados da aplicação:

```bash
# Verificar status do MySQL
sudo systemctl status mysql

# Iniciar MySQL (se não estiver rodando)
sudo systemctl start mysql

# Criar o banco de dados (primeira vez apenas)
sudo mysql -e "CREATE DATABASE IF NOT EXISTS studiomuda;"
```

### 2. Iniciar o Backend Java (Jetty)

O segundo componente é o servidor Java que processa as requisições da aplicação:

```bash
# Certifique-se que o diretório webapps existe
sudo mkdir -p /var/lib/jetty9/webapps/

# Copiar o arquivo WAR para o Jetty
sudo cp "/home/temp/Área de trabalho/StudioMuda/backend/StudioMuda.war" /var/lib/jetty9/webapps/

# Iniciar/reiniciar o Jetty
sudo systemctl restart jetty9

# Verificar se o Jetty está rodando
sudo systemctl status jetty9
```

### 3. Iniciar o Frontend React

O terceiro componente é a interface de usuário desenvolvida em React:

```bash
# Navegar até a pasta do projeto
cd "/home/temp/Área de trabalho/StudioMuda"

# Instalar dependências (primeira vez apenas)
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

Este comando inicia o servidor de desenvolvimento Vite na porta 5173. Você poderá acessar o sistema em `http://localhost:5173`

## Credenciais para Teste

Durante o desenvolvimento e testes, você pode usar as seguintes credenciais de acesso:

- **Email**: admin@studiomuda.com
- **Senha**: admin123

Estas credenciais funcionam mesmo quando o backend Java não está disponível, pois o sistema inclui um modo de demonstração.

## Solução de Problemas

### Se o MySQL não iniciar:

```bash
# Verificar logs do MySQL
sudo journalctl -u mysql.service
```

### Se o Jetty não iniciar:

```bash
# Verificar logs do Jetty
sudo journalctl -u jetty9.service
```

### Se o Frontend apresentar erros:

Verifique se as dependências foram instaladas corretamente:

```bash
npm install
```

## Modo de Demonstração

Se você não quiser ou não puder iniciar o backend Java e o MySQL, o sistema conta com um modo de demonstração que permite testar a interface e a navegação usando dados simulados. Para usar o modo de demonstração, basta fazer login com as credenciais de teste:

- **Email**: admin@studiomuda.com
- **Senha**: admin123

Quando logado no modo de demonstração, você verá um indicador "Demo" no canto superior direito da interface, indicando que está usando dados simulados.
