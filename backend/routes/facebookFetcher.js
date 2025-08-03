const express = require('express');
const router = express.Router();

// Use native fetch in Node.js 18+, or require('node-fetch') for older versions
const fetch = global.fetch || require('node-fetch');

router.post('/', async (req, res) => {
  try {
    const { profileUrl } = req.body;
    const response = await fetch('http://localhost:8001/facebook-fetch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile_url: profileUrl })
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 