const jwt = require('jsonwebtoken');
const claveSecreta = process.env.JWT_SECRET;

exports.verificarToken = (req, res, next) => {
  const header = req.headers['authorization'];
  if (!header) {
    return res.status(403).json({ error: 'Token requerido' });
  }

  const token = header.split(' ')[1];
  try {
    jwt.verify(token, claveSecreta);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};
