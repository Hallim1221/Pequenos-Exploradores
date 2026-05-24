
const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Importar modelos
const Aluno = require('../models/Aluno');
const Professor = require('../models/Professor');
const Turma = require('../models/Turma');
const Quiz = require('../models/Quiz');
const Compra = require('../models/Compra');
const Gestao = require('../models/Gestao');
const Parceria = require('../models/Parceria');

// Cadastro 2 do Professor
router.get('/professor/cadastro2', (req, res) => {
  res.render('cadastro2');
});

// Login admin lúdico
router.get('/login2', (req, res) => {
  res.render('login2');
});
// Dashboard administrativo
router.get('/dashboard-admin', async (req, res) => {
  try {
    // Buscar todas as parcerias
    const parcerias = await Parceria.listarTodas();
    res.render('dashboard-admin', { parcerias: parcerias || [] });
  } catch (erro) {
    console.error('Erro ao carregar parcerias:', erro);
    res.render('dashboard-admin', { parcerias: [] });
  }
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
router.post('/comprar-avatar', async (req, res) => {
  try {
    // Verificar autenticação
    if (!req.session.user || req.session.user.tipo !== 'aluno' || !req.session.user.id) {
      return res.status(401).json({ sucesso: false, mensagem: 'Não autenticado' });
    }

    const { avatar, preco } = req.body;
    const precoNum = parseInt(preco, 10);

    // Validar entrada
    if (!avatar || isNaN(precoNum) || precoNum <= 0) {
      return res.status(400).json({ sucesso: false, mensagem: 'Dados inválidos' });
    }

    // Processar compra através do modelo
    const resultado = await Compra.comprarAvatar(req.session.user.id, avatar, precoNum);
    
    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    // Atualizar session com novos valores
    req.session.saldo = resultado.saldo;
    req.session.avatares = resultado.avatares;

    return res.json(resultado);
  } catch (erro) {
    console.error('Erro ao comprar avatar:', erro);
    return res.status(500).json({ sucesso: false, mensagem: 'Erro ao processar compra' });
  }
});
// Cadastro do Professor (POST)
router.post('/professor/cadastro',
  [
    body('nome').notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter ao menos 6 caracteres')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('professor-cadastro', { errors: errors.array(), old: req.body });
    }

    try {
      const { nome, email, password } = req.body;
      
      // Verificar se email já existe
      const professorExistente = await Professor.buscarPorEmail(email);
      if (professorExistente) {
        return res.status(400).render('professor-cadastro', {
          errors: [{ msg: 'Email já cadastrado' }],
          old: req.body
        });
      }

      // Criar professor no BD
      const novoProfessor = await Professor.criar(nome, email, password);
      
      // Fazer login automático
      req.session.user = { tipo: 'professor', email: email, id: novoProfessor.id };
      
      return res.redirect('/professor/dashboard');
    } catch (erro) {
      console.error('Erro ao cadastrar professor:', erro);
      return res.status(500).render('professor-cadastro', {
        errors: [{ msg: 'Erro ao cadastrar. Tente novamente.' }],
        old: req.body
      });
    }
  }
);

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
      req.session.user = { tipo: 'aluno', email: email, id: novoAluno.id };
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
router.get('/comprar-avatares', async (req, res) => {
  try {
    let saldo = 700; // Padrão
    
    if (req.session.user && req.session.user.tipo === 'aluno' && req.session.user.id) {
      const aluno = await Aluno.buscarPorId(req.session.user.id);
      if (aluno) {
        saldo = aluno.saldo;
      }
    }
    
    res.render('comprar-avatares', { saldo });
  } catch (erro) {
    console.error('Erro ao carregar página de compras:', erro);
    res.render('comprar-avatares', { saldo: 700 });
  }
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

// Parcerias com Escolas
router.get('/parcerias-escolas', (req, res) => {
  res.render('parcerias-escolas');
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

router.post('/login', async (req, res) => {
  try {
    const { role, email, senha } = req.body;
    
    if (!role || !email || !senha) {
      return res.status(400).json({ success: false, message: 'Dados incompletos' });
    }

    if (role === 'aluno') {
      const aluno = await Aluno.buscarPorEmail(email);
      if (!aluno || aluno.senha !== senha) {
        return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
      }
      req.session.user = { tipo: 'aluno', email: email, id: aluno.id };
      req.session.saldo = aluno.saldo;
      return res.status(200).json({ success: true, redirect: '/aluno' });
    }

    if (role === 'professor') {
      const professor = await Professor.buscarPorEmail(email);
      if (!professor || professor.senha !== senha) {
        return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
      }
      req.session.user = { tipo: 'professor', email: email, id: professor.id };
      return res.status(200).json({ success: true, redirect: '/professor/dashboard' });
    }

    return res.status(400).json({ success: false, message: 'Tipo de usuário inválido' });
  } catch (erro) {
    console.error('Erro ao fazer login:', erro);
    return res.status(500).json({ success: false, message: 'Erro ao fazer login' });
  }
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

    // Buscar aluno no BD com validação de senha
    const aluno = await Aluno.buscarPorEmail(email);

    if (!aluno || aluno.senha !== senha) {
      return res.status(401).json({ success: false, message: 'Email ou senha inválidos' });
    }

    // Fazer login
    req.session.user = { tipo: 'aluno', email: email, id: aluno.id };
    req.session.saldo = aluno.saldo;

    return res.status(200).json({ success: true, redirect: '/aluno' });
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

    // Validar gestor com BD
    const gestor = await Gestao.validarCredenciais(email, senha);
    if (!gestor) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }

    req.session.user = { tipo: 'gestao', email: email, id: gestor.id };
    return res.status(200).json({ success: true });
  } catch (erro) {
    console.error('Erro ao fazer login de gestão:', erro);
    return res.status(500).json({ success: false, message: 'Erro ao fazer login' });
  }
});

// Área do Aluno

router.get('/aluno', async (req, res) => {
  // Protege rota: exige login
  if (!req.session.user || req.session.user.tipo !== 'aluno') {
    return res.redirect('/aluno/login');
  }
  
  try {
    // Buscar dados atualizados do aluno
    const aluno = await Aluno.buscarPorId(req.session.user.id);
    if (!aluno) {
      return res.redirect('/aluno/login');
    }
    
    const saldo = aluno.saldo;
    req.session.saldo = saldo; // Manter session sincronizada
    res.render('aluno-novo', { saldo });
  } catch (erro) {
    console.error('Erro ao carregar página aluno:', erro);
    const saldo = typeof req.session.saldo !== 'undefined' ? req.session.saldo : 700;
    res.render('aluno-novo', { saldo });
  }
});

// Área do Aluno Versão Nova Redesenhada
router.get('/aluno-novo', async (req, res) => {
  try {
    let saldo = 700; // Padrão
    
    // Se está autenticado, buscar saldo real do BD
    if (req.session.user && req.session.user.tipo === 'aluno' && req.session.user.id) {
      const aluno = await Aluno.buscarPorId(req.session.user.id);
      if (aluno) {
        saldo = aluno.saldo;
        req.session.saldo = saldo; // Manter session sincronizada
      }
    }
    
    res.render('aluno-novo', { saldo });
  } catch (erro) {
    console.error('Erro ao carregar página aluno-novo:', erro);
    res.render('aluno-novo', { saldo: 700 });
  }
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
router.post('/professor/turmas/criar', async (req, res) => {
  try {
    // Verificar autenticação
    if (!req.session.user || req.session.user.tipo !== 'professor' || !req.session.user.id) {
      return res.status(401).json({ sucesso: false, mensagem: 'Não autenticado' });
    }

    const { nome, ano_escolar } = req.body;

    // Validar entrada
    if (!nome || !ano_escolar) {
      return res.status(400).render('criar_turma', {
        errors: [{ msg: 'Nome e ano escolar são obrigatórios' }]
      });
    }

    // Criar turma no BD
    const novaTurma = await Turma.criar(nome, req.session.user.id, ano_escolar);

    return res.redirect('/professor/dashboard');
  } catch (erro) {
    console.error('Erro ao criar turma:', erro);
    return res.status(500).render('criar_turma', {
      errors: [{ msg: 'Erro ao criar turma. Tente novamente.' }]
    });
  }
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

// ROTAS DE PARCERIAS COM ESCOLAS
router.get('/parcerias-escolas', (req, res) => {
  res.render('parcerias-escolas');
});

// ROTA DE TESTE
router.get('/test-parcerias', (req, res) => {
  res.json({ teste: 'ok', metodosParceria: Object.getOwnPropertyNames(Parceria).filter(m => typeof Parceria[m] === 'function') });
});

router.post('/parcerias-escolas', async (req, res) => {
  try {
    console.log('=== POST /parcerias-escolas ===');
    console.log('Body recebido:', req.body);
    
    const { nome_contato, email, telefone, cidade, nome_escola, cargo, tipo_escola, codigo_mec } = req.body;

    // Validar dados
    console.log('Validando dados...');
    const validacao = Parceria.validar({
      nome_contato,
      email,
      telefone,
      cidade,
      nome_escola,
      cargo,
      tipo_escola,
      codigo_mec
    });

    console.log('Validação resultado:', validacao);

    if (!validacao.valido) {
      console.log('Validação falhou');
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Validação falhou',
        erros: validacao.erros
      });
    }

    // Verificar se já existe solicitação deste email
    console.log('Verificando se email já existe...');
    const parceriaExistente = await Parceria.buscarPorEmail(email);
    console.log('Email existe?', !!parceriaExistente);
    
    if (parceriaExistente) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Já existe uma solicitação associada a este e-mail. Por favor, use outro e-mail ou aguarde o retorno.'
      });
    }

    // Criar parceria
    console.log('Criando parceria...');
    const resultado = await Parceria.criar({
      nome_contato,
      email,
      telefone,
      cidade,
      nome_escola,
      cargo,
      tipo_escola,
      codigo_mec
    });

    console.log('Resultado da criação:', resultado);

    if (resultado.status === 'sucesso' || resultado.id) {
      console.log('Sucesso! ID:', resultado.id);
      return res.status(201).json({
        sucesso: true,
        mensagem: 'Solicitação enviada com sucesso! Um especialista entrará em contato em breve.',
        id: resultado.id
      });
    } else {
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao processar solicitação'
      });
    }
  } catch (erro) {
    console.error('=== ERRO ao criar parceria ===');
    console.error('Erro:', erro.message);
    console.error('Stack:', erro.stack);
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao processar solicitação',
      erro: erro.message
    });
  }
});

// API: Atualizar status de parceria
router.patch('/api/parcerias/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const statusValidos = ['pendente', 'em_andamento', 'concluido', 'rejeitado'];
    if (!statusValidos.includes(status)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Status inválido'
      });
    }

    const resultado = await Parceria.atualizarStatus(id, status);
    if (resultado) {
      res.json({ sucesso: true, mensagem: 'Status atualizado' });
    } else {
      res.status(404).json({ sucesso: false, mensagem: 'Parceria não encontrada' });
    }
  } catch (erro) {
    console.error('Erro ao atualizar status:', erro);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao processar',
      erro: erro.message
    });
  }
});

// API: Listar todas as mensagens de parcerias
router.get('/api/parcerias/mensagens/todas', async (req, res) => {
  try {
    console.log(`\n🟢 GET /api/parcerias/mensagens/todas chamado`);
    
    const todasParcerias = await Parceria.listarTodas();
    console.log(`  -> Total de parcerias: ${todasParcerias.length}`);
    
    const mensagensPorParceria = {};
    
    for (const parceria of todasParcerias) {
      console.log(`  -> Carregando mensagens da parceria ${parceria.id}...`);
      const mensagens = await Parceria.listarMensagensParcerias(parceria.id);
      mensagensPorParceria[parceria.id] = {
        parceria,
        mensagens: mensagens || []
      };
      console.log(`     -> ${mensagens?.length || 0} mensagens`);
    }
    
    res.json({ sucesso: true, dados: mensagensPorParceria });
  } catch (erro) {
    console.error('❌ Erro ao listar mensagens:', erro);
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
});

// API: Enviar mensagem sobre parceria
router.post('/api/parcerias/:id/mensagens', async (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const logFile = path.join(__dirname, '..', 'debug-post-mensagem.log');
  
  try {
    const { id } = req.params;
    const { conteudo, remetente = 'admin' } = req.body;

    // Log em arquivo para debug
    fs.appendFileSync(logFile, `\n[${new Date().toISOString()}] POST /api/parcerias/${id}/mensagens\n`);
    fs.appendFileSync(logFile, `Remetente: ${remetente}, Conteúdo: ${conteudo}\n`);

    // Validar inputs
    if (!conteudo || !conteudo.trim()) {
      fs.appendFileSync(logFile, `ERRO: Conteúdo vazio\n`);
      return res.status(400).json({ sucesso: false, erro: 'Conteúdo vazio' });
    }

    // Debug: confirmar que a nova rota está sendo executada
    console.log(`\n🔵 POST /api/parcerias/${id}/mensagens - Mensagem recebida`);
    console.log(`   Remetente: ${remetente}`);
    console.log(`   Conteúdo: ${conteudo}`);

    // Criar mensagem via modelo
    const mensagem = await Parceria.criarMensagemParceria(id, conteudo, remetente);
    
    fs.appendFileSync(logFile, `✅ Mensagem criada: ID=${mensagem.id}, parceria_id=${mensagem.parceria_id}\n`);
    console.log(`   ✅ Mensagem criada com ID: ${mensagem.id}`);

    return res.json({ sucesso: true, mensagem });
  } catch (erro) {
    fs.appendFileSync(logFile, `❌ ERRO: ${erro.message}\n${erro.stack}\n`);
    console.error(`❌ Erro ao criar mensagem:`, erro);
    return res.status(500).json({ sucesso: false, erro: 'Erro ao processar mensagem' });
  }
});

module.exports = router;
