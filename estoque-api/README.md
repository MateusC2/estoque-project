# Stock API - Versão Simplificada

Uma API simples e leve de gerenciamento de estoque para registrar itens, controlar quantidades e acompanhar transações.

## 🎯 Funcionalidades

- ✅ **Listar itens** - Ver todos os itens cadastrados no sistema
- ✅ **Obter item específico** - Buscar detalhes de um item
- ✅ **Filtrar itens** - Pesquisar por marca (brand) ou descrição
- ✅ **Criar item** - Adicionar novo item com marca e quantidade
- ✅ **Gerenciar quantidade** - ENTRADA, SAÍDA ou AJUSTE de estoque
- ✅ **Deletar item** - Remover um item e seu histórico
- ✅ **Ver transações** - Acompanhar todas as movimentações do estoque

## 🗄️ Banco de Dados

A API usa apenas 2 tabelas:

### `item`
Armazena os itens cadastrados com suas informações básicas.

```sql
- idItem (PK)
- brand (Marca ex: Honda)
- description (Descrição do item)
- currentQuantity (Quantidade atual)
- lastUpdated (Última atualização)
```

### `inventory_log`
Registra todas as transações/movimentações do estoque.

```sql
- idLog (PK)
- fkIdItem (Referência ao item)
- type (ENTRADA, SAIDA, AJUSTE)
- quantityChange (Quantidade movimentada)
- timestamp (Quando ocorreu)
```

## 📡 Endpoints

### Itens

#### GET `/api/items`
Listar todos os itens

#### GET `/api/items/:idItem`
Obter um item específico

#### POST `/api/items/filter`
Filtrar itens por marca ou descrição

**Body:**
```json
{
  "brand": "HONDA",
  "description": "CIVIC"
}
```

#### POST `/api/items`
Criar um novo item

**Body:**
```json
{
  "brand": "HONDA",
  "description": "CIVIC 1996/2000 9\"",
  "currentQuantity": 5
}
```

#### PUT `/api/items/:idItem/quantity`
Atualizar quantidade de um item

**Body:**
```json
{
  "quantityChange": 10,
  "type": "ENTRADA"
}
```

Tipos disponíveis:
- `ENTRADA` - Adiciona quantidade ao estoque
- `SAIDA` - Remove quantidade do estoque  
- `AJUSTE` - Define quantidade exata

#### DELETE `/api/items/:idItem`
Deletar um item (e seu histórico)

### Transações

#### GET `/api/transactions`
Listar todas as transações do sistema

#### GET `/api/transactions/item/:idItem`
Listar transações de um item específico

## 🚀 Como Usar

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar banco de dados

Execute o script `db/init.sql` no seu MySQL:

```bash
mysql -u root -p < db/init.sql
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=simple_stock
PORT=5000
```

### 4. Iniciar o servidor

```bash
npm start
```

## 📦 Dependências

- **express** - Framework web
- **cors** - Middleware de CORS
- **mysql2** - Driver MySQL
- **dotenv-safe** - Gerenciador de variáveis de ambiente

## 🔧 Estrutura do Projeto

```
stockApi/
├── db/
│   ├── init.sql
│   ├── connect.js
│   └── testConnect.js
├── src/
│   ├── controllers/
│   │   ├── itemController.js
│   │   └── transactionController.js
│   ├── routes/
│   │   └── apiRoutes.js
│   ├── utils/
│   │   └── functions.js
│   ├── index.js
│   └── server.js
├── package.json
└── README.md
```

---

**Versão**: 2.0.0 (Simplificada)


- **Node.js**  
- **Express.js**  
- **MySQL** (via `mysql2`)  
- **JWT** para autenticação  
- **Bcrypt** para criptografia de senhas  
- **ExcelJS** para geração de planilhas  
- **PDFKit** para geração de relatórios em PDF  
- **Nodemailer** para envio de emails  
- **NodeCron** para verificação de estoque e data de validade
- **Gemini** para geração de dados    
- **Axios**, **CORS**, **dotenv-safe**

## Configuração da Conexão com MySQL

O projeto utiliza o pacote `mysql2` para gerenciar a conexão com o banco de dados MySQL. Para configurar a conexão, crie o arquivo `.env` e o preencha com essas informações:

```javascript
SECRETKEY = "{Segredo usado para criar TokenJWT}";
DATABASEHOST = "{Seu IP / localhost}";
DATABASEUSER = "{Seu usuário SQL}";
DATABASEPASSWORD = "{Senha do seu usuário SQL}";
DATABASENAME = "stock";
```

## Configuração da Conexão com `nodemailer`

O projeto utiliza o pacote `nodemailer` para envio de e-mails, no arquivo `.env` e o preencha com essas informações:

- É necessário configurar uma Senha de Aplicativo (App Password).

- Ative a Verificação em Duas Etapas na sua conta Google: Configurações de Segurança

- Vá até [Senhas de App](https://myaccount.google.com/apppasswords)

- Copie essa senha e adicione no .env (MAILPASSWORD)

```javascript
MAILUSERNAME= "{seu.email@gmail.com}"
MAILPASSWORD= "{Sua Senha de Serviço de 16 Dígitos}"
```

## Configuração da Conexão com `Gemini`

O projeto utiliza o pacote `Gemini` para gerar dados, no arquivo `.env` e o preencha com essas informações:

- É necessário gerar uma apiKey.

- Vá até [AI Studio](https://aistudio.google.com/api-keys)

- Copie essa senha e adicione no .env (GEMINIAPIKEY)

```javascript
GEMINIAPIKEY= "{Chave da Api da Google}"
```

### Passos para Instalação

**1.** **Clonar o Repositório**

   ```bash
   git clone https://github.com/mariajuliacintra/stockApi.git

   ```

**2.** **Entre na Pasta**

   ```bash
   cd stockApi
   ```

**3.** **Executar o projeto via Docker**

- Com o Docker Desktop aberto
- Criar o .env (use o .env.example como exemplo)
- abra o terminal e execute a seguinte linha de código

**3.1.** **Comandos Úteis**

- Cria e roda o container

```bash
    docker-compose up --build
```

- Apaga o container

```bash
    docker-compose down
```

- Apaga o container e os volumes (Banco de Dados)

```bash
    docker-compose down -v
```

**4.** **Instalar as Dependências**

- Se estiver usando npm, execute:

  ```bash
    npm i
  ```

**4.1.** **Iniciar o Servidor de Desenvolvimento**

- Com npm, execute:
  ```bash
    npm start
  ```

## Documentação Completa dos Endpoints

**🔗 Documentação da API (Swagger UI):** [Acessar Documentação](https://senai604estoque.eastus2.cloudapp.azure.com/api-docs/)

## Autores

- [@fogazza](https://github.com/Fogazzaa)

- [@guelin](https://github.com/m1guelzin)

- [@yasmin](https://github.com/souzayasmin)

