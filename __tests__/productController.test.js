import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// suppress dotenv logs
const originalLog = console.log;
console.log = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].startsWith('[dotenv@')
  ) {
    return; 
  }
  originalLog(...args);
};
// Mock data for controller tests
let mockData;
let nextId;
const reset = () => {
  mockData = [
    { id: 1, name: 'Mock Product', price: 10, model: 'M1', stock: 5, type: 'A' },
  ];
  nextId = 2;
};
reset();

// Mock the model before importing the controller
jest.unstable_mockModule('../models/productModel.js', () => ({
  getProducts: jest.fn(() => Promise.resolve(mockData)),
  getProductbyID: jest.fn((id) =>
    Promise.resolve(mockData.find((p) => p.id === Number(id)))
  ),
  createProduct: jest.fn((name, price, model, stock, type) => {
    const newP = { id: nextId++, name, price, model, stock, type };
    mockData.push(newP);
    return Promise.resolve(newP);
  }),
  putProduct: jest.fn((id, updates) => {
    const p = mockData.find((x) => x.id === Number(id));
    if (!p) return Promise.resolve(0);
    Object.assign(p, updates);
    return Promise.resolve(1);
  }),
  deleteProduct: jest.fn((id) => {
    const idx = mockData.findIndex((x) => x.id === Number(id));
    if (idx === -1) return Promise.resolve(0);
    mockData.splice(idx, 1);
    return Promise.resolve(1);
  }),
}));

// Import controller AFTER mock
const controller = await import('../controllers/productController.js');

// Minimal app wiring the routes
const app = express();
app.use(express.json());
app.get('/products', controller.getAllProducts);
app.get('/products/:id', controller.getOneProduct);
app.post('/products', controller.addProduct);
app.put('/products/:id', controller.updateProduct);
app.delete('/products/:id', controller.removeProduct);

describe('productController CRUD tests', () => {
  beforeEach(() => reset());

  test('GET /products returns list', async () => {
    const res = await request(app).get('/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('id', 1);
    console.log('[PASS] ctl: GET /products → 200 list');
  });

  test('GET /products/:id returns product', async () => {
    const res = await request(app).get('/products/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
    console.log('[PASS] ctl: GET /products/1 → 200 product');
  });

  test('GET /products/:id returns 404 when not found', async () => {
    const res = await request(app).get('/products/999');
    expect(res.statusCode).toBe(404);
    console.log('[PASS] ctl: GET /products/999 → 404 not found');
  });

  test('POST /products creates new product', async () => {
    const res = await request(app)
      .post('/products')
      .send({ name: 'New', price: 30, model: 'M2', stock: 10, type: 'B' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('name', 'New');
    console.log('[PASS] ctl: POST /products → 201 created');
  });

  test('POST /products returns 400 for missing fields', async () => {
    const res = await request(app).post('/products').send({ name: '' });
    expect(res.statusCode).toBe(400);
    console.log('[PASS] ctl: POST /products (bad body) → 400');
  });

  test('PUT /products/:id updates product', async () => {
    const res = await request(app)
      .put('/products/1')
      .send({ name: 'Updated', stock: 7 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Updated');
    expect(res.body).toHaveProperty('stock', 7);
    console.log('[PASS] ctl: PUT /products/1 → 200 updated');
  });

  test('PUT /products/:id returns 404 for non-existent', async () => {
    const res = await request(app)
      .put('/products/999')
      .send({ name: 'Nope' });
    expect(res.statusCode).toBe(404);
    console.log('[PASS] ctl: PUT /products/999 → 404 not found');
  });

  test('PUT /products/:id returns 400 for empty body', async () => {
    const res = await request(app).put('/products/1').send({});
    expect(res.statusCode).toBe(400);
    console.log('[PASS] ctl: PUT /products/1 (empty body) → 400');
  });

  test('DELETE /products/:id deletes product', async () => {
    const res = await request(app).delete('/products/1');
    expect(res.statusCode).toBe(204);
    console.log('[PASS] ctl: DELETE /products/1 → 204 no content');
  });

  test('DELETE /products/:id returns 404 for non-existent', async () => {
    const res = await request(app).delete('/products/999');
    expect(res.statusCode).toBe(404);
    console.log('[PASS] ctl: DELETE /products/999 → 404 not found');
  });
});
