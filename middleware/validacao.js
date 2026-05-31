const { body, param, query, validationResult } = require('express-validator');

// Middleware para retornar erros de validação em formato padrão
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validação falhou',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// Validações comuns
const validacoes = {
  // Email
  email: () => body('email')
    .isEmail().withMessage('Email inválido')
    .trim().toLowerCase(),

  // Senha (mínimo 8 caracteres)
  senha: () => body('password', 'password')
    .isLength({ min: 8 }).withMessage('Senha deve ter pelo menos 8 caracteres'),

  // Nome (mínimo 3 caracteres, máximo 100)
  nome: () => body('nome')
    .isLength({ min: 3, max: 100 }).withMessage('Nome deve ter entre 3 e 100 caracteres')
    .trim(),

  // ID numérico
  id: (param = 'id') => param === 'query' 
    ? query('id').isInt().withMessage('ID deve ser um número inteiro')
    : param(param).isInt().withMessage('ID deve ser um número inteiro'),

  // Saldo (número positivo)
  saldo: () => body('saldo')
    .isFloat({ min: 0 }).withMessage('Saldo deve ser um número positivo'),

  // Valor de moeda
  valor: () => body('valor')
    .isFloat({ min: 0 }).withMessage('Valor deve ser um número positivo'),

  // Plano (enum: premium, comum, em-andamento)
  plano: () => body('plano')
    .isIn(['premium', 'comum', 'em-andamento']).withMessage('Plano inválido'),

  // Status (enum: ativo, inativo, pendente)
  status: () => body('status')
    .isIn(['ativo', 'inativo', 'pendente']).withMessage('Status inválido'),

  // Año escolar (número de 1 a 12)
  ano: () => body('ano')
    .isInt({ min: 1, max: 12 }).withMessage('Ano deve estar entre 1 e 12'),

  // Telefone (formato brasileiro)
  telefone: () => body('telefone')
    .matches(/^\(?[\d]{2}\)?[\s-]?[\d]{4,5}[\s-]?[\d]{4}$/).withMessage('Telefone inválido'),

  // Confirmação de senha
  confirmacaoSenha: () => body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('As senhas não conferem');
      }
      return true;
    })
};

module.exports = {
  handleValidationErrors,
  validacoes
};
