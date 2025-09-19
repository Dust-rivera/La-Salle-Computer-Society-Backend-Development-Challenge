import { jest } from '@jest/globals';

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


//Mock mysql2 directly
let mockQuery;
jest.unstable_mockModule('mysql2', () => {
  mockQuery = jest.fn();
  return {
    createPool: jest.fn(() => ({
      promise: () => ({
        query: mockQuery,
      }),
    })),
  };
});

// Import productModel functions after mock
const {
  getProducts,
  getProductbyID,
  createProduct,
  putProduct,
  deleteProduct,
} = await import('../models/productModel.js');

beforeEach(async () => {
  jest.resetModules();
  jest.clearAllMocks();
});

describe('productModel CRUD tests (mocked mysql2)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getProducts returns array', async () => {
    mockQuery.mockResolvedValueOnce([[{ id: 1, name: 'Seed' }], undefined]);
    const products = await getProducts();
    expect(Array.isArray(products)).toBe(true);
    expect(products[0]).toHaveProperty('id', 1);
    console.log('[PASS] model: getProducts returns array');
  });

  test('getProductByID returns product', async () => {
    mockQuery.mockResolvedValueOnce([[{ id: 1, name: 'Seed' }], undefined]);
    const p = await getProductbyID(1);
    expect(p).toHaveProperty('id', 1);
    console.log('[PASS] model: getProductByID returns product');
  });

  test('getProductByID returns undefined for non-existent', async () => {
    mockQuery.mockResolvedValueOnce([[], undefined]);
    const p = await getProductbyID(999);
    expect(p).toBeUndefined();
    console.log('[PASS] model: getProductByID returns undefined');
  });

  test('createProduct inserts and returns product', async () => {
    mockQuery.mockResolvedValueOnce([{ insertId: 2 }, undefined]);
    mockQuery.mockResolvedValueOnce([[{ id: 2, name: 'New' }], undefined]);
    const np = await createProduct('New', 20, 'M2', 10, 'B');
    expect(np).toHaveProperty('id', 2);
    expect(np.name).toBe('New');
    console.log('[PASS] model: createProduct inserts product');
  });

  test('putProduct updates existing product', async () => {
    const { putProduct } = await import('../models/productModel.js');
    mockQuery.mockResolvedValueOnce([{ affectedRows: 1 }, undefined]);
    const result = await putProduct(1, { name: 'Updated' });
    expect(result).toBe(1);
  });

  test('putProduct returns 0 for non-existent product', async () => {
    const { putProduct } = await import('../models/productModel.js');
    mockQuery.mockResolvedValueOnce([{ affectedRows: 0 }, undefined]);
    const result = await putProduct(999, { name: 'Nope' });
    expect(result).toBe(0);
  });

  test('deleteProduct deletes existing product', async () => {
    const { deleteProduct } = await import('../models/productModel.js');
    mockQuery.mockResolvedValueOnce([{ affectedRows: 1 }, undefined]);
    const result = await deleteProduct(1);
    expect(result).toBe(1);
  });

  test('deleteProduct returns 0 for non-existent', async () => {
    const { deleteProduct } = await import('../models/productModel.js');
    mockQuery.mockResolvedValueOnce([{ affectedRows: 0 }, undefined]);
    const result = await deleteProduct(999);
    expect(result).toBe(0);
  });

});
