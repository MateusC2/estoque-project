# 📋 Testes da API de Stock

## Base URL
```
http://localhost:5000/api
```

---

## 1️⃣ GET /items
**Descrição**: Retorna todos os itens do estoque

### Requisição
```
GET /api/items
```

### Resposta Esperada (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "idItem": 1,
      "brand": "HONDA",
      "description": "Motor V6 3.0L",
      "currentQuantity": 5,
      "lastUpdated": "2026-02-14T10:30:00.000Z"
    },
    {
      "idItem": 2,
      "brand": "TOYOTA",
      "description": "Motor 4 cilindros 2.0L",
      "currentQuantity": 10,
      "lastUpdated": "2026-02-14T10:30:00.000Z"
    }
    // ... mais itens
  ],
  "arrayName": "item"
}
```

---

## 2️⃣ GET /items/:idItem
**Descrição**: Retorna um item específico pelo ID

### Requisição
```
GET /api/items/1
```

### Resposta Esperada (200 OK)
```json
{
  "success": true,
  "data": {
    "idItem": 1,
    "brand": "HONDA",
    "description": "Motor V6 3.0L",
    "currentQuantity": 5,
    "lastUpdated": "2026-02-14T10:30:00.000Z"
  },
  "arrayName": "item"
}
```

### Erro - Item não encontrado (404 Not Found)
```json
{
  "success": false,
  "error": "Item não encontrado."
}
```

### Erro - ID inválido (400 Bad Request)
```json
{
  "success": false,
  "error": "O ID do item deve ser um valor numérico."
}
```

---

## 3️⃣ POST /items/filter
**Descrição**: Filtra itens por marca (brand) e/ou descrição

### Requisição
```
POST /api/items/filter
Content-Type: application/json

{
  "brand": "HONDA",
  "description": "Motor"
}
```

### Resposta Esperada (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "idItem": 1,
      "brand": "HONDA",
      "description": "Motor V6 3.0L",
      "currentQuantity": 5,
      "lastUpdated": "2026-02-14T10:30:00.000Z"
    }
  ],
  "arrayName": "item"
}
```

### Variações de Filtro
```javascript
// Apenas por marca
{ "brand": "TOYOTA" }

// Apenas por descrição
{ "description": "Motor" }

// Ambos os filtros
{ "brand": "FORD", "description": "V8" }
```

---

## 4️⃣ POST /items
**Descrição**: Cria um novo item no estoque

### Requisição
```
POST /api/items
Content-Type: application/json

{
  "brand": "BMW",
  "description": "Motor Turbo 2.0T",
  "currentQuantity": 8
}
```

### Resposta Esperada (201 Created)
```json
{
  "success": true,
  "message": "Item criado com sucesso.",
  "data": {
    "idItem": 16,
    "brand": "BMW",
    "description": "Motor Turbo 2.0T",
    "currentQuantity": 8,
    "lastUpdated": "2026-02-14T10:30:00.000Z"
  },
  "arrayName": "item"
}
```

### Erro - Validação falhou (400 Bad Request)
```json
{
  "success": false,
  "error": "Brand e description são obrigatórios."
}
```

---

## 5️⃣ PUT /items/:idItem/quantity
**Descrição**: Atualiza a quantidade de um item

### Requisição 1 - ENTRADA (Adicionar unidades)
```
PUT /api/items/1/quantity
Content-Type: application/json

{
  "quantityChange": 10,
  "type": "ENTRADA"
}
```

### Resposta Esperada (200 OK)
```json
{
  "success": true,
  "message": "Quantidade atualizada com sucesso.",
  "data": {
    "idItem": 1,
    "newQuantity": 15
  },
  "arrayName": "item"
}
```

### Requisição 2 - SAIDA (Remover unidades)
```
PUT /api/items/1/quantity
Content-Type: application/json

{
  "quantityChange": 5,
  "type": "SAIDA"
}
```

### Resposta Esperada (200 OK)
```json
{
  "success": true,
  "message": "Quantidade atualizada com sucesso.",
  "data": {
    "idItem": 1,
    "newQuantity": 10
  },
  "arrayName": "item"
}
```

### Requisição 3 - AJUSTE (Definir quantidade exata)
```
PUT /api/items/1/quantity
Content-Type: application/json

{
  "quantityChange": 20,
  "type": "AJUSTE"
}
```

### Resposta Esperada (200 OK)
```json
{
  "success": true,
  "message": "Quantidade atualizada com sucesso.",
  "data": {
    "idItem": 1,
    "newQuantity": 20
  },
  "arrayName": "item"
}
```

### Erro - Quantidade negativa (400 Bad Request)
```json
{
  "success": false,
  "error": "Quantidade não pode ser negativa."
}
```

### Erro - Type inválido (400 Bad Request)
```json
{
  "success": false,
  "error": "quantityChange e type (ENTRADA, SAIDA, AJUSTE) são obrigatórios."
}
```

### Erro - Item não encontrado (404 Not Found)
```json
{
  "success": false,
  "error": "Item não encontrado."
}
```

---

## 6️⃣ DELETE /items/:idItem
**Descrição**: Deleta um item do estoque

### Requisição
```
DELETE /api/items/16
```

### Resposta Esperada (200 OK)
```json
{
  "success": true,
  "message": "Item deletado com sucesso."
}
```

### Erro - Item não encontrado (404 Not Found)
```json
{
  "success": false,
  "error": "Item não encontrado."
}
```

### Erro - ID inválido (400 Bad Request)
```json
{
  "success": false,
  "error": "O ID do item deve ser um valor numérico."
}
```

---

## 7️⃣ GET /transactions
**Descrição**: Retorna o histórico de todas as transações

### Requisição
```
GET /api/transactions
```

### Resposta Esperada (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "idLog": 1,
      "idItem": 1,
      "brand": "HONDA",
      "description": "Motor V6 3.0L",
      "type": "ENTRADA",
      "quantityChange": 10,
      "timestamp": "2026-02-14T09:00:00.000Z"
    },
    {
      "idLog": 2,
      "idItem": 1,
      "brand": "HONDA",
      "description": "Motor V6 3.0L",
      "type": "SAIDA",
      "quantityChange": 5,
      "timestamp": "2026-02-14T09:30:00.000Z"
    }
    // ... mais transações
  ],
  "arrayName": "transactions"
}
```

---

## 8️⃣ GET /transactions/item/:idItem
**Descrição**: Retorna o histórico de transações de um item específico

### Requisição
```
GET /api/transactions/item/1
```

### Resposta Esperada (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "idLog": 1,
      "idItem": 1,
      "brand": "HONDA",
      "description": "Motor V6 3.0L",
      "type": "ENTRADA",
      "quantityChange": 10,
      "timestamp": "2026-02-14T09:00:00.000Z"
    },
    {
      "idLog": 2,
      "idItem": 1,
      "brand": "HONDA",
      "description": "Motor V6 3.0L",
      "type": "SAIDA",
      "quantityChange": 5,
      "timestamp": "2026-02-14T09:30:00.000Z"
    }
  ],
  "arrayName": "transactions"
}
```

### Erro - Nenhuma transação encontrada (404 Not Found)
```json
{
  "success": false,
  "error": "Nenhuma transação encontrada para este item."
}
```

---

## 📝 Resumo dos Códigos HTTP

| Código | Significado |
|--------|------------|
| **200** | Sucesso - Requisição processada |
| **201** | Criado - Item criado com sucesso |
| **400** | Bad Request - Dados inválidos ou incompletos |
| **404** | Not Found - Recurso não encontrado |
| **500** | Server Error - Erro interno do servidor |

---

## 🧪 Ordem Sugerida para Testes

1. **GET /items** - Verificar todos os itens
2. **GET /items/1** - Buscar item específico
3. **POST /items/filter** - Filtrar itens
4. **POST /items** - Criar novo item
5. **PUT /items/:idItem/quantity** (ENTRADA) - Adicionar quantidade
6. **PUT /items/:idItem/quantity** (SAIDA) - Remover quantidade
7. **PUT /items/:idItem/quantity** (AJUSTE) - Ajustar quantidade
8. **GET /transactions** - Ver histórico de transações
9. **GET /transactions/item/:idItem** - Ver transações de um item
10. **DELETE /items/:idItem** - Deletar item

---

## 💡 Dicas para Testes

- Use Postman, Insomnia ou a extensão REST Client do VS Code
- Sempre verifique se o servidor está rodando (`npm start`)
- Para testes com REST Client (.rest), crie um arquivo na raiz do projeto
- Lembre-se de validar que:
  - ✅ `quantityChange` é convertido para número
  - ✅ Operações matemáticas funcionam corretamente
  - ✅ O histórico de transações é registrado
  - ✅ Não há duplicatas ou erros de integridade
