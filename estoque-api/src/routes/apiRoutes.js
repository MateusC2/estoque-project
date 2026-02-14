const router = require("express").Router();

// Controladores
const itemController = require("../controllers/itemController");
const transactionController = require("../controllers/transactionController");

// ========================
// ROTAS DE ITENS
// ========================

// Listar todos os itens
router.get("/items", itemController.getAllItems); //✅

// Obter um item específico
router.get("/items/:idItem", itemController.getItemById);//✅

// Filtrar itens por brand e/ou description
router.post("/items/filter", itemController.filterItems);//✅

// Criar um novo item
router.post("/items", itemController.createItem); //✅

// Atualizar quantidade de um item
router.put("/items/:idItem/quantity", itemController.updateItemQuantity); //✅

// Deletar um item
router.delete("/items/:idItem", itemController.deleteItem); //✅

// ========================
// ROTAS DE TRANSAÇÕES
// ========================

// Listar todas as transações
router.get("/transactions", transactionController.getAllTransactions);

// Listar transações de um item específico
router.get("/transactions/item/:idItem", transactionController.getTransactionsByItem);

module.exports = router;
