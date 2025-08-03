const jwt = require('jsonwebtoken');
const axios = require('axios');
const base64 = require('base-64');
require('dotenv').config();

const allowedParties = (process.env.ALLOWED_PARTIES || '').split(',').filter(Boolean);

const clerkAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.clerk_user = { is_authenticated: false };
    return next();
  }

  const token = authHeader.split(' ')[1];

  let decodedKey;
  try {
    decodedKey = Buffer.from(base64.decode(process.env.CLERK_PEM_PUBLIC_KEY), 'utf-8').toString();
  } catch (err) {
    console.error("Invalid PEM Key");
    return res.status(500).json({ error: 'Invalid PEM key' });
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, decodedKey, { algorithms: ['RS256'] });
    console.log("JWT:", decodedToken);
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  if (!allowedParties.includes(decodedToken.azp)) {
    return res.status(403).json({ error: 'Unauthorized source' });
  }

  const now = Math.floor(Date.now() / 1000);
  if (decodedToken.exp && now > decodedToken.exp) {
    return res.status(401).json({ error: 'Token expired' });
  }

  if (decodedToken.nbf && now < decodedToken.nbf) {
    return res.status(401).json({ error: 'Token not yet valid' });
  }

  const userId = decodedToken.sub;
  if (!userId) {
    return res.status(400).json({ error: 'Missing user ID' });
  }

  // Fetch user from Clerk
  try {
    const response = await axios.get(`https://api.clerk.com/v1/users/${userId}`, {
      headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` },
    });

    req.clerk_user = {
      is_authenticated: true,
      id: userId,
      data: response.data,
    };
  } catch (err) {
    console.error("Clerk Fetch Error:", err.message);
    req.clerk_user = {
      is_authenticated: true,
      id: userId,
      data: null,
    };
  }

  next();
};

module.exports = clerkAuth;
