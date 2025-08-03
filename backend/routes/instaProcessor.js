const express = require('express');
const router = express.Router();
const fetch = global.fetch || require('node-fetch');

router.post('/', async (req, res) => {
  try {
    const { post_url } = req.body;
    const response = await fetch('http://localhost:8001/insta-process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ post_url })
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 