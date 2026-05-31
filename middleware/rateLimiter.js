const rateLimit = require('express-rate-limit');

// Rate limit para login (máximo 5 tentativas a cada 15 minutos)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5,
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Não aplicar limite se não for tentativa de login
    return !req.path.includes('login');
  }
});

// Rate limit para APIs em geral (máximo 100 requisições a cada 15 minutos)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: 'Muitas requisições. Tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limit strict para operações sensíveis (máximo 10 requisições a cada 1 hora)
const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10,
  message: 'Limite de requisições excedido. Tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  loginLimiter,
  apiLimiter,
  strictLimiter
};
