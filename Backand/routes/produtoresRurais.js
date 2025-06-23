const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM PRODUTOR_RURAL ORDER BY id_produtor');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar produtores rurais:', err);
    res.status(500).json({ error: 'Erro ao buscar produtores rurais' });
  }
});

module.exports = router;
