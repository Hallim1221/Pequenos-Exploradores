
const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Importar modelos
const Aluno = require('../models/Aluno');
const Professor = require('../models/Professor');
const Turma = require('../models/Turma');
const Quiz = require('../models/Quiz');

// Cadastro 2 do Professor
router.get('/professor/cadastro2', (req, res) => {
  res.render('cadastro2');
});

// Login admin lúdico
router.get('/login2', (req, res) => {
  res.render('login2');
});
// Dashboard administrativo
router.get('/dashboard-admin', (req, res) => {
  res.render('dashboard-admin');
});

// Página de turmas do professor
router.get('/professor_turmas', (req, res) => {
  res.render('professor_turmas');
});

// Página de criação de atividade (professor)
router.get('/criar_atividade', (req, res) => {
  res.render('criar_atividade');
});

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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('aluno-cadastro', { errors: errors.array(), old: req.body });
    }

    try {
      const { nome, email, password } = req.body;
      
      // Verificar se email já existe
      const alunoExistente = await Aluno.buscarPorEmail(email);
      if (alunoExistente) {
        return res.status(400).render('aluno-cadastro', { 
          errors: [{ msg: 'Email já cadastrado' }], 
          old: req.body 
        });
      }

      // Criar novo aluno no BD
      const novoAluno = await Aluno.criar(nome, email, password);
      
      // Fazer login automático
      req.session.user = { tipo: 'aluno', email: email };
      req.session.saldo = 700;
      
      return res.redirect('/aluno');
    } catch (erro) {
      console.error('Erro ao cadastrar aluno:', erro);
      return res.status(500).render('aluno-cadastro', { 
        errors: [{ msg: 'Erro ao cadastrar. Tente novamente.' }], 
        old: req.body 
      });
    }
  }
);

// Rota para página de compra de avatares
router.get('/comprar-avatares', (req, res) => {
  const saldo = typeof req.session.saldo !== 'undefined' ? req.session.saldo : 700;
  res.render('comprar-avatares', { saldo });
});

// Página inicial
router.get('/', (req, res) => {
  res.render('home', { title: 'Pequenos Exploradores' });
});

// Sobre
router.get('/sobre', (req, res) => {
  res.render('sobre');
});

// Contato
router.get('/contato', (req, res) => {
  res.render('contato');
});

// Instituições
router.get('/instituicoes', (req, res) => {
  res.render('instituicoes');
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
    req.session.user = { tipo: 'aluno', email: req.body.email };
    return res.redirect('/aluno');
  }
  if (role === 'professor') {
    req.session.user = { tipo: 'professor', email: req.body.email };
    return res.redirect('/professor/dashboard');
  }
  // Se quiser tratar outros perfis futuramente
  res.redirect('/');
});



// Login do Aluno
router.get('/aluno/login', (req, res) => {
  res.render('aluno-login');
});


router.post('/aluno/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios' });
    }

    // Buscar aluno no BD
    const aluno = await Aluno.buscarPorEmail(email);

    if (!aluno || aluno.senha !== senha) {
      return res.status(401).json({ success: false, message: 'Email ou senha inválidos' });
    }

    // Fazer login
    req.session.user = { tipo: 'aluno', email: email, id: aluno.id };
    req.session.saldo = aluno.saldo;

    return res.status(200).json({ success: true });
  } catch (erro) {
    console.error('Erro ao fazer login:', erro);
    return res.status(500).json({ success: false, message: 'Erro ao fazer login' });
  }
});

// Login de gestão
router.post('/gestao/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios' });
    }

    // Validação básica (você pode integrar com um modelo de Gestao se quiser)
    // Por enquanto, aceita qualquer gestão
    req.session.user = { tipo: 'gestao', email: email };

    return res.status(200).json({ success: true });
  } catch (erro) {
    console.error('Erro ao fazer login de gestão:', erro);
    return res.status(500).json({ success: false, message: 'Erro ao fazer login' });
  }
});

// Área do Aluno

router.get('/aluno', (req, res) => {
  // Protege rota: exige login
  if (!req.session.user || req.session.user.tipo !== 'aluno') {
    return res.redirect('/aluno/login');
  }
  const saldo = typeof req.session.saldo !== 'undefined' ? req.session.saldo : 700;
  res.render('aluno-novo', { saldo });
});

// Área do Aluno Versão Nova Redesenhada
router.get('/aluno-novo', (req, res) => {
  const saldo = typeof req.session.saldo !== 'undefined' ? req.session.saldo : 700;
  res.render('aluno-novo', { saldo });
});


// Loja de Avatares
router.get('/lojaAvatares', (req, res) => {
  res.render('lojaAvatares');
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

// Ranking2
router.get('/ranking2', (req, res) => {
  res.render('ranking2');
});

// Ranking3
router.get('/ranking3', (req, res) => {
  res.render('ranking3');
});

// Recarga
router.get('/recarga', (req, res) => {
  res.render('recarga');
});

// Página de vídeos de Natureza
router.get('/natureza', (req, res) => {
  res.render('natureza');
});

// Rota GET para adicionar turma
router.get('/adicionar-turma', (req, res) => {
  res.render('adicionar-turma');
});

// Rota GET para /turma (turma normal)
router.get('/turma', (req, res) => {
  res.render('turma');
});

// Rota GET para /aluno2
router.get('/aluno2', (req, res) => {
  res.render('aluno2');
});

// Página de criação de turma (professor)
router.get('/criar_turma', (req, res) => {
  res.render('criar_turma');
});

// Criação de turma do professor (POST)
router.post('/professor/turmas/criar', (req, res) => {
  // Aqui você pode validar e salvar os dados da turma, se desejar
  // Para agora, apenas redireciona para a página de turmas do professor
  res.redirect('/professor/turmas');
});

// Página da área do professor
router.get('/professor_area', (req, res) => {
  res.render('professor_area');
});

// LOGOUT
router.get('/logout', (req, res) => {
  console.log('Logout acionado');
  req.session.destroy((err) => {
    if (err) {
      console.log('Erro ao fazer logout:', err);
      return res.redirect('/');
    }
    console.log('Sessão destruída. Redirecionando...');
    res.redirect('/');
  });
});

module.exports = router;
