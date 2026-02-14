const request = require('supertest');
const express = require('express');
const routes = require('../../routes/apiRoutes');

// Criar uma aplicação Express para testes
const app = express();
app.use(express.json());
app.use('/api', routes);

// Mock dos controllers
jest.mock('../../controllers/itemController', () => ({
  getAllItems: jest.fn((req, res) => res.status(200).json({ success: true, data: [] })),
  getItemById: jest.fn((req, res) => res.status(200).json({ success: true, data: {} })),
  filterItems: jest.fn((req, res) => res.status(200).json({ success: true, data: [] })),
  createItem: jest.fn((req, res) => res.status(201).json({ success: true, message: 'Item criado' })),
  updateItemQuantity: jest.fn((req, res) => res.status(200).json({ success: true, message: 'Quantidade atualizada' })),
  deleteItem: jest.fn((req, res) => res.status(200).json({ success: true, message: 'Item deletado' })),
}));

jest.mock('../../controllers/transactionController', () => ({
  getAllTransactions: jest.fn((req, res) => res.status(200).json({ success: true, data: [] })),
  getTransactionsByItem: jest.fn((req, res) => res.status(200).json({ success: true, data: [] })),
}));

describe('API Routes', () => {
  describe('ITEMS ROUTES', () => {
    it('GET /api/items - deve retornar todos os itens', async () => {
      const response = await request(app).get('/api/items');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('GET /api/items/:idItem - deve retornar um item específico', async () => {
      const response = await request(app).get('/api/items/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('POST /api/items/filter - deve filtrar itens', async () => {
      const response = await request(app)
        .post('/api/items/filter')
        .send({ brand: 'HONDA' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('POST /api/items - deve criar um novo item', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({
          brand: 'BMW',
          description: 'Motor Turbo',
          currentQuantity: 8,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('PUT /api/items/:idItem/quantity - deve atualizar quantidade', async () => {
      const response = await request(app)
        .put('/api/items/1/quantity')
        .send({
          quantityChange: 10,
          type: 'ENTRADA',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('DELETE /api/items/:idItem - deve deletar um item', async () => {
      const response = await request(app).delete('/api/items/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('TRANSACTIONS ROUTES', () => {
    it('GET /api/transactions - deve retornar todas as transações', async () => {
      const response = await request(app).get('/api/transactions');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('GET /api/transactions/item/:idItem - deve retornar transações de um item', async () => {
      const response = await request(app).get('/api/transactions/item/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('Route validation', () => {
    it('deve retornar 404 para rota inválida', async () => {
      const response = await request(app).get('/api/invalid-route');

      expect(response.status).toBe(404);
    });
  });
});
