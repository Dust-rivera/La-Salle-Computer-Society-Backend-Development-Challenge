import {
  getProducts,
  getProductbyID,
  createProduct,
  putProduct,
  deleteProduct,
} from '../models/productModel.js';

// Validate product data for POST and PUT requests
function validateProductData(data, isPartial = false) {
  const errors = [];

   // Validate name
  if (!isPartial || data.name !== undefined) {
    if (typeof data.name !== 'string' || data.name.trim() === '') {
      errors.push('Name must be a non-empty string.');
    }
  }
  // Validate price
  if (!isPartial || data.price !== undefined) {
    if (isNaN(Number(data.price)) || Number(data.price) < 0) {
      errors.push('Price must be a valid non-negative number.');
    }
  }
  // Validate model
  if (!isPartial || data.model !== undefined) {
    if (typeof data.model !== 'string' || data.model.trim() === '') {
      errors.push('Model must be a non-empty string.');
    }
  }
  // Validate stock
  if (!isPartial || data.stock !== undefined) {
    if (!Number.isInteger(Number(data.stock)) || Number(data.stock) < 0) {
      errors.push('Stock must be a valid non-negative integer.');
    }
  }
  // Validate type
  if (!isPartial || data.type !== undefined) {
    if (typeof data.type !== 'string' || data.type.trim() === '') {
      errors.push('Type must be a non-empty string.');
    }
  }

  return errors;
}

//Get all products
export async function getAllProducts(req, res) {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

//Get a single product by ID
export async function getOneProduct(req, res) {
  try {
    const product = await getProductbyID(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Add a new product
export async function addProduct(req, res) {
  const { name, price, model, stock, type } = req.body;

  // Check for missing fields
  if ([name, price, model, stock, type].some(field => field === undefined || field === null)) {
    return res.status(400).json({
      error: 'All fields are required: name, price, model, stock, type.'
    });
  }

  // Validate field values
  const errors = validateProductData({ name, price, model, stock, type });
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const newProduct = await createProduct(name, price, model, stock, type);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

//Update an existing product
export async function updateProduct(req, res) {
  const { id } = req.params;

  // Validate ID
  if (isNaN(Number(id))) {
    return res.status(400).json({ error: 'Invalid product ID.' });
  }

  // Check if product exists
  const existingProduct = await getProductbyID(id);
  if (!existingProduct) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  // Validate update body
  const updates = req.body;
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No fields to update.' });
  }

  const errors = validateProductData(updates, true);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const affectedRows = await putProduct(id, updates);
    if (affectedRows === 0) {
      return res.status(500).json({ error: 'Failed to update product.' });
    }
    const updatedProduct = await getProductbyID(id);
    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

//Delete a product by ID
export async function removeProduct(req, res) {
  try {
    const affectedRows = await deleteProduct(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.sendStatus(204);
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
