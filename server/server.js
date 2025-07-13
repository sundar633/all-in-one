const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Neon connection string
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_Y6Zf0nexJaKT@ep-icy-truth-adiyiwfw-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

// ✅ SIGNUP route
app.post('/signup', async (req, res) => {
  const { username, mobile, password } = req.body;

  try {
    await pool.query(
      'INSERT INTO users (username, mobile, password) VALUES ($1, $2, $3)',
      [username, mobile, password]
    );
    res.status(200).json({ message: 'Signup successful' });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed: ' + err.message });
  }
});

// ✅ LOGIN route
app.post('/login', async (req, res) => {
  const { mobile, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE mobile = $1 AND password = $2',
      [mobile, password]
    );

    if (result.rows.length > 0) {
      res.status(200).json({ message: 'Login successful', user: result.rows[0] });
    } else {
      res.status(401).json({ error: 'Invalid mobile or password' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Login failed: ' + err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
