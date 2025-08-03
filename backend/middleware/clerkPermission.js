// Middleware to allow only authenticated users
module.exports = function clerkAuthenticated(req, res, next) {
  if (req.clerk_user && req.clerk_user.is_authenticated) {
    return next();
  }
  return res.status(401).json({ error: 'Authentication required' });
}; 