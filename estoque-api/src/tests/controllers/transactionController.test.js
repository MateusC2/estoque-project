const TransactionController = require('../../controllers/transactionController');
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

describe('TransactionController', () => {
  let mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('getAllTransactions', () => {
    it('deve retornar todas as transações com sucesso', async () => {
      const mockTransactions = [
        {
          idLog: 1,
          fkIdItem: 1,
          brand: 'HONDA',
          description: 'Motor V6',
          type: 'ENTRADA',
          quantityChange: 10,
          timestamp: '2026-02-14T09:00:00.000Z',
        },
        {
          idLog: 2,
          fkIdItem: 1,
          brand: 'HONDA',
          description: 'Motor V6',
          type: 'SAIDA',
          quantityChange: 5,
          timestamp: '2026-02-14T09:30:00.000Z',
        },
      ];

      queryAsync.mockResolvedValueOnce(mockTransactions);

      const req = {};

      await TransactionController.getAllTransactions(req, mockRes);

      expect(queryAsync).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('deve retornar erro 500 quando banco de dados falha', async () => {
      queryAsync.mockRejectedValueOnce(new Error('Database error'));

      const req = {};

      await TransactionController.getAllTransactions(req, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getTransactionsByItem', () => {
    it('deve retornar transações de um item específico', async () => {
      const mockTransactions = [
        {
          idLog: 1,
          fkIdItem: 1,
          brand: 'HONDA',
          description: 'Motor V6',
          type: 'ENTRADA',
          quantityChange: 10,
          timestamp: '2026-02-14T09:00:00.000Z',
        },
        {
          idLog: 2,
          fkIdItem: 1,
          brand: 'HONDA',
          description: 'Motor V6',
          type: 'SAIDA',
          quantityChange: 5,
          timestamp: '2026-02-14T09:30:00.000Z',
        },
      ];

      queryAsync.mockResolvedValueOnce(mockTransactions);

      const req = { params: { idItem: 1 } };

      await TransactionController.getTransactionsByItem(req, mockRes);

      expect(queryAsync).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('deve retornar erro 400 para ID inválido', async () => {
      const req = { params: { idItem: 'abc' } };

      await TransactionController.getTransactionsByItem(req, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });
});
