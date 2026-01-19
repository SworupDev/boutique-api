require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Test endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: '🛍️ Boutique API Live Locally!',
    endpoints: ['/api/products', '/api/orders']
  });
});

// Products (Bra Sets ₹850)
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE is_active = true');
    res.json(result.rows
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Orders
app.post('/api/orders', async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    await pool.query('UPDATE products SET stock = stock - $1 WHERE id = $1', [quantity, product_id]);
    res.json({ success: true, message: `${quantity} items sold! 💰` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🛍️ Local API: http://localhost:${port}`);
  console.log(`📡 Products: http://localhost:${port}/api/products`);
});
