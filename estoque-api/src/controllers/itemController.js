const { queryAsync, handleResponse } = require("../utils/functions");

module.exports = class ItemController {
  /**
   * Listar todos os itens cadastrados
   */
  static async getAllItems(req, res) {
    try {
      const query = `
        SELECT idItem, brand, description, currentQuantity, lastUpdated
        FROM item
        ORDER BY brand ASC, description ASC
      `;
      const items = await queryAsync(query);

      return handleResponse(res, 200, {
        success: true,
        message: "Itens obtidos com sucesso.",
        data: items,
        arrayName: "items",
      });
    } catch (error) {
      console.error("Erro ao buscar itens:", error);
      return handleResponse(res, 500, {
        success: false,
        error: "Erro interno do servidor",
        details: error.message,
      });
    }
  }

  /**
   * Obter detalhes de um item específico
   */
  static async getItemById(req, res) {
    const { idItem } = req.params;

    if (isNaN(Number(idItem))) {
      return handleResponse(res, 400, {
        success: false,
        error: "O ID do item deve ser um valor numérico.",
      });
    }

    try {
      const query = `
        SELECT idItem, brand, description, currentQuantity, lastUpdated
        FROM item
        WHERE idItem = ?
      `;
      const [item] = await queryAsync(query, [idItem]);

      if (!item) {
        return handleResponse(res, 404, {
          success: false,
          error: "Item não encontrado.",
        });
      }

      return handleResponse(res, 200, {
        success: true,
        message: "Item obtido com sucesso.",
        data: item,
        arrayName: "item",
      });
    } catch (error) {
      console.error("Erro ao buscar item:", error);
      return handleResponse(res, 500, {
        success: false,
        error: "Erro interno do servidor",
        details: error.message,
      });
    }
  }

  /**
   * Filtrar itens por brand ou description
   */
  static async filterItems(req, res) {
    const { brand, description } = req.body;

    try {
      let query =
        "SELECT idItem, brand, description, currentQuantity, lastUpdated FROM item WHERE 1=1";
      const params = [];

      if (brand) {
        query += " AND brand LIKE ?";
        params.push(`%${brand}%`);
      }

      if (description) {
        query += " AND description LIKE ?";
        params.push(`%${description}%`);
      }

      query += " ORDER BY brand ASC, description ASC";

      const items = await queryAsync(query, params);

      return handleResponse(res, 200, {
        success: true,
        message: "Itens filtrados com sucesso.",
        data: items,
        arrayName: "items",
      });
    } catch (error) {
      console.error("Erro ao filtrar itens:", error);
      return handleResponse(res, 500, {
        success: false,
        error: "Erro interno do servidor",
        details: error.message,
      });
    }
  }

  /**
   * Criar um novo item
   */
  static async createItem(req, res) {
    const { brand, description, currentQuantity } = req.body;

    // Validação básica
    if (!brand || !description) {
      return handleResponse(res, 400, {
        success: false,
        error: "Marca (brand) e descrição são obrigatórios.",
      });
    }

    try {
      const query = `
        INSERT INTO item (brand, description, currentQuantity)
        VALUES (?, ?, ?)
      `;
      const result = await queryAsync(query, [
        brand,
        description,
        currentQuantity || 0,
      ]);

      return handleResponse(res, 201, {
        success: true,
        message: "Item criado com sucesso.",
        data: {
          idItem: result.insertId,
          brand,
          description,
          currentQuantity: currentQuantity || 0,
        },
        arrayName: "item",
      });
    } catch (error) {
      console.error("Erro ao criar item:", error);
      return handleResponse(res, 500, {
        success: false,
        error: "Erro interno do servidor",
        details: error.message,
      });
    }
  }

  /**
   * Atualizar quantidade de um item
   */
  static async updateItemQuantity(req, res) {
    const { idItem } = req.params;
    let { quantityChange, type } = req.body;

    if (isNaN(Number(idItem))) {
      return handleResponse(res, 400, {
        success: false,
        error: "O ID do item deve ser um valor numérico.",
      });
    }

    if (
      !quantityChange ||
      !type ||
      !["ENTRADA", "SAIDA", "AJUSTE"].includes(type)
    ) {
      return handleResponse(res, 400, {
        success: false,
        error:
          "quantityChange e type (ENTRADA, SAIDA, AJUSTE) são obrigatórios.",
      });
    }

    try {
      // Converter para número
      quantityChange = Number(quantityChange);

      // Verificar se o item existe
      const checkQuery = "SELECT currentQuantity FROM item WHERE idItem = ?";
      const [itemExists] = await queryAsync(checkQuery, [idItem]);

      if (!itemExists) {
        return handleResponse(res, 404, {
          success: false,
          error: "Item não encontrado.",
        });
      }

      // Calcular nova quantidade (garantir que sejam números)
      let newQuantity = Number(itemExists.currentQuantity);
      if (type === "ENTRADA") {
        newQuantity += quantityChange;
      } else if (type === "SAIDA") {
        newQuantity -= quantityChange;
      } else if (type === "AJUSTE") {
        newQuantity = quantityChange;
      }

      // Validar quantidade negativa
      if (newQuantity < 0) {
        return handleResponse(res, 400, {
          success: false,
          error: "Quantidade não pode ser negativa.",
        });
      }

      // Atualizar item
      const updateQuery =
        "UPDATE item SET currentQuantity = ? WHERE idItem = ?";
      await queryAsync(updateQuery, [newQuantity, idItem]);

      // Registrar transação no histórico
      const logQuery = `
        INSERT INTO inventory_log (fkIdItem, type, quantityChange)
        VALUES (?, ?, ?)
      `;
      await queryAsync(logQuery, [idItem, type, quantityChange]);

      return handleResponse(res, 200, {
        success: true,
        message: "Quantidade atualizada com sucesso.",
        data: {
          idItem,
          newQuantity,
        },
        arrayName: "item",
      });
    } catch (error) {
      console.error("Erro ao atualizar quantidade:", error);
      return handleResponse(res, 500, {
        success: false,
        error: "Erro interno do servidor",
        details: error.message,
      });
    }
  }

  /**
   * Deletar um item
   */
  static async deleteItem(req, res) {
    const { idItem } = req.params;

    if (isNaN(Number(idItem))) {
      return handleResponse(res, 400, {
        success: false,
        error: "O ID do item deve ser um valor numérico.",
      });
    }

    try {
      // Verificar se o item existe
      const checkQuery = "SELECT idItem FROM item WHERE idItem = ?";
      const [itemExists] = await queryAsync(checkQuery, [idItem]);

      if (!itemExists) {
        return handleResponse(res, 404, {
          success: false,
          error: "Item não encontrado.",
        });
      }

      // Deletar o item (isso irá deletar o histórico por causa da FK com CASCADE)
      const deleteQuery = "DELETE FROM item WHERE idItem = ?";
      await queryAsync(deleteQuery, [idItem]);

      return handleResponse(res, 200, {
        success: true,
        message: "Item deletado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao deletar item:", error);
      return handleResponse(res, 500, {
        success: false,
        error: "Erro interno do servidor",
        details: error.message,
      });
    }
  }
};
