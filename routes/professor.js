const express = require('express');
const router = express.Router();
// Permite acessar seleção de série via GET também
router.get('/dashboard', (req, res) => {
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

module.exports = router;
