const express = require('express');
const router = express.Router();

// Importar modelos
const Professor = require('../models/Professor');
const Turma = require('../models/Turma');
// Permite acessar seleção de série via GET também
router.get('/dashboard', (req, res) => {
  // Protege rota: exige login
  if (!req.session.user || req.session.user.tipo !== 'professor') {
    return res.redirect('/professor/login');
  }
  res.render('professor_dashboard', { series });
});

// Simulação de dados dos alunos por série, turma e pontuação
const series = ['1º Ano', '2º Ano', '3º Ano', '4º Ano', '5º Ano'];
const turmas = ['A', 'B', 'C', 'D', 'E'];
// Gera alunos fictícios para cada turma de cada série
const alunosPorSerieTurma = {};
series.forEach(serie => {
  alunosPorSerieTurma[serie] = {};
  turmas.forEach((turma, idx) => {
    const qtd = 28 + ((idx + series.indexOf(serie)) % 3); // 28, 29 ou 30
    alunosPorSerieTurma[serie][turma] = Array.from({length: qtd}, (_, i) => ({
      nome: `Aluno ${turma}${(i+1).toString().padStart(2, '0')}`,
      pontuacao: Math.floor(Math.random()*1000+100) // pontuação fictícia
    }));
  });
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

    if (!professor || professor.senha !== senha) {
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
router.post('/dashboard', (req, res) => {
  res.render('professor_dashboard', { series });
});

// Seleção de turma após escolher série
router.get('/serie/:serie', (req, res) => {
  const serie = req.params.serie;
  if (!series.includes(serie)) return res.redirect('/professor/dashboard');
  res.render('professor_turmas', { serie, turmas });
});

// Exibe alunos e pontuação da turma
router.get('/serie/:serie/turma/:turma', (req, res) => {
  const { serie, turma } = req.params;
  if (!series.includes(serie) || !turmas.includes(turma)) return res.redirect('/professor/dashboard');
  const alunos = alunosPorSerieTurma[serie][turma] || [];
  res.render('professor_alunos', { serie, turma, alunos });
});

// Rota GET para /turmas (série padrão: 1º Ano)
router.get('/turmas', (req, res) => {
  const serie = '1º Ano';
  const turmas = ['A', 'B', 'C', 'D', 'E'];
  res.render('professor_turmas', { serie, turmas });
});

// Criação de turma do professor (POST)
router.post('/turmas/criar', (req, res) => {
  // Aqui você pode validar e salvar os dados da turma, se desejar
  // Para agora, apenas redireciona para a página de turmas do professor
  res.redirect('/professor/turmas');
});

module.exports = router;
