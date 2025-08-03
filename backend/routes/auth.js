const express = require('express');
const router = express.Router();
const clerkAuthenticated = require('../middleware/clerkPermission');

router.get('/me', clerkAuthenticated, (req, res) => {
  res.json({
    message: "User is authenticated",
    user: req.clerk_user,
  });
});

module.exports = router;
