const { query } = require('../db');

async function requireSubscription(req, res, next) {
  if (req.user.role === 'admin') return next();
  const { rows } = await query('select subscription_status from users where id = $1', [req.user.id]);
  const status = rows[0]?.subscription_status;
  if (status !== 'active') {
    return res.status(403).json({ error: 'Assinatura necessária para acessar este recurso' });
  }
  return next();
}

module.exports = requireSubscription;
