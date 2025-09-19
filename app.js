import express from 'express';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// mount routes
app.use('/products', productRoutes);

// not found handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error.' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
