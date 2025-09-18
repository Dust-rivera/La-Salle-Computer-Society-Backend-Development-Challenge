import express from 'express'

import { getProducts, getProductbyID, createProduct, putProduct, deleteProduct} from './database.js';

const app = express()

app.use(express.json())


app.get("/products", async(req, res) => {
    const products = await getProducts();
    res.json(products);
})

app.get("/products/:id", async (req, res) => {
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
});

app.post("/products", async (req, res) => {
    const { name, price, model, stock, type } = req.body;
    if (!name || !price || !model || !stock || !type) {
        return res.status(400).json({ error: 'All fields are required: name, price, model, stock, type.' });
    }
    try {
        const newProduct = await createProduct(name, price, model, stock, type);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body; 

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No fields to update.' });
    }
    try {
        const affectedRows = await putProduct(id, updates);
        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found.' });
        }
        const updatedProduct = await getProductbyID(id);
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Failed to update product:', error);
        res.status(500).json({ error: 'Internal Server Error.' });
    }
});


app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const affectedRows = await deleteProduct(id);
        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }else {
            console.log(`Deleted product with ID: ${id}`);
        }
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

app.use((req, res) => {
    res.status(500).json({ error: 'Internal Server Error: Route not found.' });
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
})