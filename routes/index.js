
const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

<<<<<<< HEAD
=======
// Página do mural do aluno (aluno2)
router.get('/aluno2', (req, res) => {
  res.render('aluno2');
});

// Página da turma (após participar)
router.get('/turma', (req, res) => {
  res.render('turma');
});

// Página para adicionar turma (aluno)
router.get('/adicionar-turma', (req, res) => {
  res.render('adicionar-turma');
});

// Compra de avatar
router.post('/comprar-avatar', (req, res) => {
  const { avatar, preco } = req.body;
  let saldo = typeof req.session.saldo !== 'undefined' ? req.session.saldo : 700;
  let avatares = Array.isArray(req.session.avatares) ? req.session.avatares : [];
  const precoNum = parseInt(preco, 10);
  if (!avatar || isNaN(precoNum) || precoNum <= 0) {
    return res.status(400).json({ sucesso: false, mensagem: 'Dados inválidos.' });
  }
  if (saldo < precoNum) {
    return res.status(400).json({ sucesso: false, mensagem: 'Saldo insuficiente.' });
  }
  if (avatares.includes(avatar)) {
    return res.status(400).json({ sucesso: false, mensagem: 'Avatar já comprado.' });
  }
  saldo -= precoNum;
  avatares.push(avatar);
  req.session.saldo = saldo;
  req.session.avatares = avatares;
  return res.json({ sucesso: true, saldo, avatares });
});

>>>>>>> d37a33b (commit inicial do projeto e ajustes visuais na página aluno2)
// Cadastro do Professor (POST)
router.post('/professor/cadastro', (req, res) => {
  // Aqui você pode adicionar lógica de cadastro, validação, etc.
  // Agora redireciona para a tela de turmas do professor (primeira série)
  res.redirect(encodeURI('/professor/serie/1º Ano'));
});

// Cadastro do Professor
router.get('/professor/cadastro', (req, res) => {
  res.render('professor-cadastro');
});

// Cadastro do Aluno
router.get('/aluno/cadastro', (req, res) => {
  res.render('aluno-cadastro');
});

// Cadastro do Aluno (POST) - processa o formulário e redireciona para a área do aluno
router.post('/aluno/cadastro',
  [
    body('nome').notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter ao menos 6 caracteres'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('As senhas não conferem');
      }
      return true;
    })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Re-render a página de cadastro com os erros (poderíamos também enviar mensagens flash)
      return res.status(400).render('aluno-cadastro', { errors: errors.array(), old: req.body });
    }

<<<<<<< HEAD
    // Aqui normalmente você salvaria o usuário no banco de dados.
    // Para agora, apenas redirecionamos para a área do aluno após o cadastro bem-sucedido.
    return res.redirect('/aluno');
=======
  // Aqui normalmente você salvaria o usuário no banco de dados.
  // Para agora, define saldo inicial na sessão e redireciona para a área do aluno.
  req.session.saldo = 700;
  return res.redirect('/aluno');
>>>>>>> d37a33b (commit inicial do projeto e ajustes visuais na página aluno2)
  }
);

// Rota para página de compra de avatares
router.get('/comprar-avatares', (req, res) => {
<<<<<<< HEAD
  res.render('comprar-avatares');
=======
  console.log('Saldo na sessão ao acessar /comprar-avatares:', req.session.saldo);
  const saldo = typeof req.session.saldo !== 'undefined' ? req.session.saldo : 700;
  res.render('comprar-avatares', { saldo });
>>>>>>> d37a33b (commit inicial do projeto e ajustes visuais na página aluno2)
});

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
<<<<<<< HEAD
  // Por enquanto, apenas redireciona para a área do aluno
=======
  // Por enquanto, define saldo inicial na sessão e redireciona para a área do aluno
  req.session.saldo = 700;
>>>>>>> d37a33b (commit inicial do projeto e ajustes visuais na página aluno2)
  res.redirect('/aluno');
});

// Área do Aluno
router.get('/aluno', (req, res) => {
<<<<<<< HEAD
  res.render('aluno');
=======
  // Usa saldo da sessão, se existir, senão 700
  const saldo = typeof req.session.saldo !== 'undefined' ? req.session.saldo : 700;
  res.render('aluno', { saldo });
>>>>>>> d37a33b (commit inicial do projeto e ajustes visuais na página aluno2)
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
