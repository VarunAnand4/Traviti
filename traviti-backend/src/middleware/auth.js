const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Missing Authorization header' });

  const parts = header.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Invalid Authorization header' });

  const token = parts[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.userId };
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

