const { queryAsync, handleResponse } = require("../utils/functions");

module.exports = class TransactionController {
  /**
   * Listar todas as transações/movimentações do estoque
   */
  static async getAllTransactions(req, res) {
    try {
      const query = `
        SELECT 
          il.idLog,
          il.fkIdItem,
          i.brand,
          i.description,
          il.type,
          il.quantityChange,
          il.timestamp
        FROM inventory_log il
        JOIN item i ON il.fkIdItem = i.idItem
        ORDER BY il.timestamp DESC
      `;
      
      const transactions = await queryAsync(query);
      
      return handleResponse(res, 200, {
        success: true,
        message: "Transações obtidas com sucesso.",
        data: transactions,
        arrayName: "transactions",
      });
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
      return handleResponse(res, 500, {
        success: false,
        error: "Erro interno do servidor",
        details: error.message,
      });
    }
  }

  /**
   * Obter transações de um item específico
   */
  static async getTransactionsByItem(req, res) {
    const { idItem } = req.params;

    if (isNaN(Number(idItem))) {
      return handleResponse(res, 400, {
        success: false,
        error: "O ID do item deve ser um valor numérico.",
      });
    }

    try {
      const query = `
        SELECT 
          il.idLog,
          il.fkIdItem,
          i.brand,
          i.description,
          il.type,
          il.quantityChange,
          il.timestamp
        FROM inventory_log il
        JOIN item i ON il.fkIdItem = i.idItem
        WHERE il.fkIdItem = ?
        ORDER BY il.timestamp DESC
      `;
      
      const transactions = await queryAsync(query, [idItem]);
      
      if (transactions.length === 0) {
        return handleResponse(res, 404, {
          success: false,
          error: "Nenhuma transação encontrada para este item.",
        });
      }

      return handleResponse(res, 200, {
        success: true,
        message: "Transações do item obtidas com sucesso.",
        data: transactions,
        arrayName: "transactions",
      });
    } catch (error) {
      console.error("Erro ao buscar transações do item:", error);
      return handleResponse(res, 500, {
        success: false,
        error: "Erro interno do servidor",
        details: error.message,
      });
    }
  }
};
