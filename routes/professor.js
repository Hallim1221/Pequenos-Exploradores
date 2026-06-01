const express = require('express');
const router = express.Router();

// Importar modelos
const Professor = require('../models/Professor');
const Turma = require('../models/Turma');
const Aluno = require('../models/Aluno');
const Ranking = require('../models/Ranking');

// Permite acessar seleção de série via GET também
router.get('/dashboard', async (req, res) => {
  // Protege rota: exige login
  if (!req.session.user || req.session.user.tipo !== 'professor') {
    return res.redirect('/professor/login');
  }
  
  try {
    // Buscar turmas do professor no banco
    const turmas = await Turma.listarPorProfessor(req.session.user.id);
    const series = [...new Set(turmas.map(t => t.ano_escolar))].sort();
    res.render('professor_dashboard', { series: series.length > 0 ? series : ['1º Ano', '2º Ano', '3º Ano', '4º Ano', '5º Ano'] });
  } catch (erro) {
    console.error('Erro ao carregar dashboard:', erro);
    res.render('professor_dashboard', { series: ['1º Ano', '2º Ano', '3º Ano', '4º Ano', '5º Ano'] });
  }
});

// Página de login do professor
router.get('/login', (req, res) => {
  res.render('professor_login', { erro: null });
});

// Login do professor (POST)
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios' });
    }

    // Buscar professor no BD
    const professor = await Professor.buscarPorEmail(email);

    if (!professor) {
      return res.status(401).json({ success: false, message: 'Email ou senha inválidos' });
    }

    // Verificar senha com bcryptjs
    const senhaValida = await Professor.verificarSenha(email, senha);
    if (!senhaValida) {
      return res.status(401).json({ success: false, message: 'Email ou senha inválidos' });
    }

    // Fazer login
    req.session.user = { tipo: 'professor', email: email, id: professor.id };

    return res.status(200).json({ success: true });
  } catch (erro) {
    console.error('Erro ao fazer login do professor:', erro);
    return res.status(500).json({ success: false, message: 'Erro ao fazer login' });
  }
});

// Dashboard do professor: seleção de série
router.post('/dashboard', async (req, res) => {
  if (!req.session.user || req.session.user.tipo !== 'professor') {
    return res.redirect('/professor/login');
  }
  
  try {
    const turmas = await Turma.listarPorProfessor(req.session.user.id);
    const series = [...new Set(turmas.map(t => t.ano_escolar))].sort();
    res.render('professor_dashboard', { series: series.length > 0 ? series : ['1º Ano', '2º Ano', '3º Ano', '4º Ano', '5º Ano'] });
  } catch (erro) {
    res.render('professor_dashboard', { series: ['1º Ano', '2º Ano', '3º Ano', '4º Ano', '5º Ano'] });
  }
});

// Área do professor - page principal
router.get('/area', async (req, res) => {
  if (!req.session.user || req.session.user.tipo !== 'professor') {
    return res.redirect('/professor/login');
  }
  
  try {
    const professor = await Professor.buscarPorId(req.session.user.id);
    const turmas = await Turma.listarPorProfessor(req.session.user.id);
    res.render('professor_area', { 
      professor: professor || {},
      turmasCount: turmas.length
    });
  } catch (erro) {
    console.error('Erro ao carregar professor_area:', erro);
    res.render('professor_area', { professor: {}, turmasCount: 0 });
  }
});

// Seleção de turma após escolher série
router.get('/serie/:serie', async (req, res) => {
  if (!req.session.user || req.session.user.tipo !== 'professor') {
    return res.redirect('/professor/login');
  }
  
  const serie = req.params.serie;
  try {
    // Buscar turmas do professor para esta série
    const turmas = await Turma.listarPorProfessor(req.session.user.id);
    const turmasFiltered = turmas.filter(t => t.ano_escolar === serie);
    
    res.render('professor_turmas', { 
      serie, 
      turmas: turmasFiltered,
      turmasCount: turmasFiltered.length 
    });
  } catch (erro) {
    console.error('Erro ao listar turmas:', erro);
    res.render('professor_turmas', { serie, turmas: [], turmasCount: 0 });
  }
});

// Exibe alunos e pontuação da turma
router.get('/serie/:serie/turma/:turmaId', async (req, res) => {
  if (!req.session.user || req.session.user.tipo !== 'professor') {
    return res.redirect('/professor/login');
  }
  
  const { serie, turmaId } = req.params;
  try {
    // Buscar turma
    const turma = await Turma.buscarPorId(turmaId);
    if (!turma) {
      return res.status(404).render('error', { message: 'Turma não encontrada' });
    }
    
    // Listar alunos da turma
    const alunos = await Turma.listarAlunosDaTurma(turmaId);
    
    // Buscar ranking da turma
    const ranking = await Ranking.rankingTurma(turmaId);
    
    res.render('professor_alunos', { 
      serie, 
      turma,
      alunos: ranking.length > 0 ? ranking : alunos
    });
  } catch (erro) {
    console.error('Erro ao carregar turma:', erro);
    res.status(500).render('error', { message: 'Erro ao carregar dados da turma' });
  }
});

// Rota GET para /turmas (série padrão: 1º Ano)
router.get('/turmas', async (req, res) => {
  if (!req.session.user || req.session.user.tipo !== 'professor') {
    return res.redirect('/professor/login');
  }
  
  try {
    const serie = '1º Ano';
    const turmas = await Turma.listarPorProfessor(req.session.user.id);
    const turmasFiltered = turmas.filter(t => t.ano_escolar === serie);
    
    res.render('professor_turmas', { 
      serie, 
      turmas: turmasFiltered,
      turmasCount: turmasFiltered.length
    });
  } catch (erro) {
    res.render('professor_turmas', { serie: '1º Ano', turmas: [], turmasCount: 0 });
  }
});

// Criação de turma do professor (POST)
router.post('/turmas/criar', async (req, res) => {
  if (!req.session.user || req.session.user.tipo !== 'professor') {
    return res.status(401).json({ success: false, message: 'Não autorizado' });
  }
  
  const { nome, ano_escolar } = req.body;
  
  if (!nome || !ano_escolar) {
    return res.status(400).json({ success: false, message: 'Nome e série são obrigatórios' });
  }
  
  try {
    const turma = await Turma.criar(nome, req.session.user.id, ano_escolar);
    return res.json({ success: true, turma });
  } catch (erro) {
    console.error('Erro ao criar turma:', erro);
    return res.status(500).json({ success: false, message: 'Erro ao criar turma' });
  }
});

module.exports = router;
