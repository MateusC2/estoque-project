const ItemController = require('../../controllers/itemController');
const { handleResponse } = require('../../utils/functions');

// Mock apenas queryAsync, mas importar handleResponse de verdade
jest.mock('../../utils/functions', () => {
  const actual = jest.requireActual('../../utils/functions');
  return {
    ...actual,
    queryAsync: jest.fn(),
  };
});

const { queryAsync } = require('../../utils/functions');

describe('ItemController', () => {
  let mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('getAllItems', () => {
    it('deve retornar todos os itens com sucesso', async () => {
      const mockItems = [
        { idItem: 1, brand: 'HONDA', description: 'Motor V6', currentQuantity: 5 },
        { idItem: 2, brand: 'TOYOTA', description: 'Motor 4Cil', currentQuantity: 10 },
      ];

      queryAsync.mockResolvedValueOnce(mockItems);

      const req = {};

      await ItemController.getAllItems(req, mockRes);

      expect(queryAsync).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('deve retornar erro 500 quando banco de dados falha', async () => {
      queryAsync.mockRejectedValueOnce(new Error('Database error'));

      const req = {};

      await ItemController.getAllItems(req, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getItemById', () => {
    it('deve retornar um item específico com sucesso', async () => {
      const mockItem = [{ idItem: 1, brand: 'HONDA', description: 'Motor V6', currentQuantity: 5 }];

      queryAsync.mockResolvedValueOnce(mockItem);

      const req = { params: { idItem: 1 } };

      await ItemController.getItemById(req, mockRes);

      expect(queryAsync).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('deve retornar erro 400 para ID inválido', async () => {
      const req = { params: { idItem: 'abc' } };

      await ItemController.getItemById(req, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('deve retornar erro 404 quando item não existe', async () => {
      queryAsync.mockResolvedValueOnce([]);

      const req = { params: { idItem: 999 } };

      await ItemController.getItemById(req, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });
  });

  describe('filterItems', () => {
    it('deve filtrar itens por brand', async () => {
      const mockItems = [
        { idItem: 1, brand: 'HONDA', description: 'Motor V6', currentQuantity: 5 },
      ];

      queryAsync.mockResolvedValueOnce(mockItems);

      const req = { body: { brand: 'HONDA' } };

      await ItemController.filterItems(req, mockRes);

      expect(queryAsync).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('deve filtrar itens por description', async () => {
      const mockItems = [
        { idItem: 1, brand: 'HONDA', description: 'Motor V6', currentQuantity: 5 },
        { idItem: 2, brand: 'TOYOTA', description: 'Motor 4Cil', currentQuantity: 10 },
      ];

      queryAsync.mockResolvedValueOnce(mockItems);

      const req = { body: { description: 'Motor' } };

      await ItemController.filterItems(req, mockRes);

      expect(queryAsync).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('createItem', () => {
    it('deve criar um novo item com sucesso', async () => {
      queryAsync.mockResolvedValueOnce({ insertId: 16 });
      queryAsync.mockResolvedValueOnce([
        { idItem: 16, brand: 'BMW', description: 'Motor Turbo', currentQuantity: 8 },
      ]);

      const req = {
        body: {
          brand: 'BMW',
          description: 'Motor Turbo',
          currentQuantity: 8,
        },
      };

      await ItemController.createItem(req, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it('deve retornar erro quando dados obrigatórios estão faltando', async () => {
      const req = { body: { brand: 'BMW' } };

      await ItemController.createItem(req, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  describe('updateItemQuantity', () => {
    it('deve validar ID do item', async () => {
      const req = {
        params: { idItem: 'abc' },
        body: { quantityChange: 10, type: 'ENTRADA' },
      };

      await ItemController.updateItemQuantity(req, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('deve validar type e quantityChange', async () => {
      const req = {
        params: { idItem: 1 },
        body: { quantityChange: 10 },
      };

      await ItemController.updateItemQuantity(req, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  describe('deleteItem', () => {
    it('deve validar ID do item', async () => {
      const req = { params: { idItem: 'abc' } };

      await ItemController.deleteItem(req, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });
});
