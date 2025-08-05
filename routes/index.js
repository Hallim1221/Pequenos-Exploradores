const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Página inicial
router.get('/', (req, res) => {
  res.render('index', { title: 'Pequenos Exploradores' });
});

// Sobre
router.get('/sobre', (req, res) => {
  res.render('sobre');
});

// Contato
router.get('/contato', (req, res) => {
  res.render('contato');
});

router.post('/contato',
  [
    body('nome').notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('mensagem').notEmpty().withMessage('Mensagem é obrigatória')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('contato', { errors: errors.array() });
    }
    res.send('Mensagem enviada com sucesso!');
  }
);

// Login
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  const role = req.body.role;
  if (role === 'aluno') {
    return res.redirect('/aluno');
  }
  if (role === 'professor') {
    return res.redirect('/professor/login');
  }
  // Se quiser tratar outros perfis futuramente
  res.redirect('/');
});



// Login do Aluno
router.get('/aluno/login', (req, res) => {
  res.render('aluno-login');
});

router.post('/aluno/login', (req, res) => {
  // Aqui você pode validar o e-mail e senha se desejar
  // Por enquanto, apenas redireciona para a área do aluno
  res.redirect('/aluno');
});

// Área do Aluno
router.get('/aluno', (req, res) => {
  res.render('aluno');
});

// Loja
router.get('/loja', (req, res) => {
  res.render('loja');
});

// Premium
router.get('/premium', (req, res) => {
  res.render('premium');
});

// Quiz
router.get('/quiz', (req, res) => {
  res.render('quiz');
});

// Quizes temáticos
router.get('/quiz/animais', (req, res) => {
  res.render('quiz_animais');
});

router.get('/quiz/biomas', (req, res) => {
  res.render('quiz_biomas');
});

router.get('/quiz/meioambiente', (req, res) => {
  res.render('quiz_meioambiente');
});

router.get('/quiz/natureza', (req, res) => {
  res.render('quiz_natureza');
});

// Ranking
router.get('/ranking', (req, res) => {
  res.render('ranking');
});

// Recarga
router.get('/recarga', (req, res) => {
  res.render('recarga');
});

// Página de vídeos de Natureza
router.get('/natureza', (req, res) => {
  res.render('natureza');
});

module.exports = router;
