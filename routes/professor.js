const express = require('express');
const router = express.Router();

// Importar modelos
const Professor = require('../models/Professor');
const Turma = require('../models/Turma');
const Aluno = require('../models/Aluno');
const Ranking = require('../models/Ranking');

// ═══ MIDDLEWARE DE RENOVAÇÃO DE SESSÃO ═══
// Renova a sessão em cada requisição para evitar expiração
router.use((req, res, next) => {
  if (req.session && req.session.user && req.session.user.tipo === 'professor') {
    // Renovar a sessão
    req.session.touch();
    
    // Garantir que instituicao_id existe
    if (!req.session.user.instituicao_id) {
      req.session.user.instituicao_id = 1;
    }
    
    console.log(`🔄 Renovando sessão do professor ${req.session.user.email} (ID: ${req.sessionID})`);
    
    // ✅ IMPORTANTE: SALVAR SESSÃO APÓS RENOVAR
    req.session.save((err) => {
      if (err) console.error('❌ Erro ao salvar sessão renovada em professor.js:', err);
    });
  }
  next();
});

// Permite acessar seleção de série via GET também
router.get('/dashboard', async (req, res) => {
  // Protege rota: exige login
  if (!req.session.user || req.session.user.tipo !== 'professor') {
    return res.redirect('/');
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
// ❌ DESATIVADO: Rota de login do professor
// router.get('/login', (req, res) => {
//   res.render('professor_login', { erro: null });
// });

// ❌ DESATIVADO: Login do professor (POST)
// router.post('/login', async (req, res) => {
//   try {
//     const { email, senha } = req.body;

//     if (!email || !senha) {
//       return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios' });
//     }

//     // Buscar professor no BD
//     const professor = await Professor.buscarPorEmail(email);

//     if (!professor) {
//       return res.status(401).json({ success: false, message: 'Email ou senha inválidos' });
//     }

//     // Verificar senha com bcryptjs
//     const senhaValida = await Professor.verificarSenha(email, senha);
//     if (!senhaValida) {
//       return res.status(401).json({ success: false, message: 'Email ou senha inválidos' });
//     }

//     // Fazer login
//     req.session.user = { tipo: 'professor', email: email, id: professor.id, nome: professor.nome };

//     return res.status(200).json({ success: true });
//   } catch (erro) {
//     console.error('Erro ao fazer login do professor:', erro);
//     return res.status(500).json({ success: false, message: 'Erro ao fazer login' });
//   }
// });

// Dashboard do professor: seleção de série
router.post('/dashboard', async (req, res) => {
  if (!req.session.user || req.session.user.tipo !== 'professor') {
    return res.redirect('/');
  }
  
  try {
    const turmas = await Turma.listarPorProfessor(req.session.user.id);
    const series = [...new Set(turmas.map(t => t.ano_escolar))].sort();
    res.render('professor_dashboard', { series: series.length > 0 ? series : ['1º Ano', '2º Ano', '3º Ano', '4º Ano', '5º Ano'] });
  } catch (erro) {
    res.render('professor_dashboard', { series: ['1º Ano', '2º Ano', '3º Ano', '4º Ano', '5º Ano'] });
  }
});

// Teste simples
router.get('/test-stats', (req, res) => {
  console.log('🟢 ROTA /test-stats foi chamada');
  res.json({ stats: { turmas: 5, alunos: 30 } });
});

// Área do professor - page principal
router.get('/area', async (req, res) => {
  console.log('🔴 ROTA /area FOI CHAMADA');
  console.log('🔴 Session ID:', req.sessionID);
  console.log('🔴 Session user:', req.session?.user ? `${req.session.user.email}` : 'Não existe');
  
  // Validação mais robusta de sessão
  if (!req.session || !req.session.user || req.session.user.tipo !== 'professor') {
    console.log('🔴 Sem sessão válida, redirecionando para login');
    return res.redirect('/login');
  }
  
  try {
    // Renovar e SALVAR sessão
    req.session.touch();
    
    // Validar que instituicao_id existe
    if (!req.session.user.instituicao_id) {
      console.warn('⚠️ Professor sem instituição_id na sessão');
      req.session.user.instituicao_id = 1; // Fallback padrão
    }
    
    // Carregar turmas da instituição do professor
    const turmas = await Turma.listarPorInstituicao(req.session.user.instituicao_id);
    console.log('✅ Turmas da instituição:', turmas ? turmas.length : 0);
    
    let totalAlunos = 0;
    if (turmas && turmas.length > 0) {
      for (let turma of turmas) {
        const alunos = await Turma.listarAlunosDaTurma(turma.id);
        const countAlunos = alunos ? alunos.length : 0;
        turma.total_alunos = countAlunos;
        console.log(`📊 Turma ${turma.id} (${turma.nome}): ${countAlunos} alunos`);
        totalAlunos += countAlunos;
      }
    }
    
    const professsorData = { 
      id: req.session.user.id, 
      nome: req.session.user.nome, 
      email: req.session.user.email,
      instituicao_id: req.session.user.instituicao_id
    };
    
    const statsData = {
      turmas: turmas ? turmas.length : 0,
      alunos: totalAlunos,
      atividades: 18,
      pontos: 1240
    };
    
    console.log('✅ Stats criado:', statsData);
    console.log('🏫 Instituição do professor:', req.session.user.instituicao_id);
    console.log('📋 Turmas antes de renderizar:', turmas?.map(t => ({id: t.id, nome: t.nome, total_alunos: t.total_alunos})));
    
    // Salvar sessão renovada ANTES de renderizar
    req.session.save((err) => {
      if (err) console.error('❌ Erro ao salvar sessão:', err);
      
      res.render('professor_area', {
        professor: professsorData,
        stats: statsData,
        turmas: turmas || [],
        totalAlunos: totalAlunos,
        instituicao_id: req.session.user.instituicao_id,
        _nocache: new Date().getTime() // Force recompile
      });
    });
  } catch (erro) {
    console.error('❌ Erro ao carregar professor_area:', erro.message);
    
    // Salvar sessão ANTES de renderizar erro
    req.session.save((err2) => {
      if (err2) console.error('❌ Erro ao salvar sessão:', err2);
      
      res.render('professor_area', {
        professor: {
          id: req.session.user.id,
          nome: req.session.user.nome,
          email: req.session.user.email,
          instituicao_id: req.session.user.instituicao_id
        },
        stats: {
          turmas: 0,
          alunos: 0,
          atividades: 18,
          pontos: 1240
        },
        turmas: [],
        totalAlunos: 0,
        _nocache: new Date().getTime()
      });
    });
  }
});

// Seleção de turma após escolher série
router.get('/serie/:serie', async (req, res) => {
  if (!req.session.user || req.session.user.tipo !== 'professor') {
    return res.redirect('/');
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
    return res.redirect('/');
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
    return res.redirect('/');
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
    // Gerar código de 4 caracteres alfanuméricos
    const codigo_acesso = Math.random().toString(36).substring(2, 6).toUpperCase();
    
    const turma = await Turma.criar(nome, req.session.user.id, ano_escolar, req.session.user.instituicao_id, codigo_acesso);
    return res.json({ success: true, turma, codigo_acesso });
  } catch (erro) {
    console.error('Erro ao criar turma:', erro);
    return res.status(500).json({ success: false, message: 'Erro ao criar turma' });
  }
});

// ══════ NOVOS ENDPOINTS PARA PROFESSOR_AREA ══════

// GET - Listar turmas da instituição do professor
router.get('/api/turmas', async (req, res) => {
  console.log('🔍 GET /professor/api/turmas chamado');
  console.log('   Session ID:', req.sessionID);
  console.log('   Session user:', req.session?.user ? `${req.session.user.email} (${req.session.user.tipo})` : 'NÃO EXISTE');
  
  if (!req.session.user || req.session.user.tipo !== 'professor') {
    console.warn('⚠️ Sessão inválida em GET /professor/api/turmas');
    console.warn('   req.session.user:', req.session.user);
    console.warn('   req.session.user.tipo:', req.session?.user?.tipo);
    return res.status(401).json({ success: false, message: 'Não autorizado' });
  }
  
  try {
    // Renovar e SALVAR sessão para manter ativa
    req.session.touch();
    req.session.save((err) => {
      if (err) console.error('❌ Erro ao salvar sessão:', err);
    });
    
    const instituicao_id = req.session.user.instituicao_id;
    if (!instituicao_id) {
      return res.json({ success: true, turmas: [] });
    }
    
    const turmas = await Turma.listarPorInstituicao(instituicao_id);
    console.log(`📚 Turmas da instituição ${instituicao_id}:`, turmas ? turmas.length : 0);
    
    return res.json({ success: true, turmas: turmas || [] });
  } catch (erro) {
    console.error('❌ Erro ao listar turmas:', erro);
    return res.status(500).json({ success: false, message: 'Erro ao listar turmas' });
  }
});

// POST - Criar nova turma com código aleatório de 4 dígitos
router.post('/api/turmas/criar', async (req, res) => {
  if (!req.session.user || req.session.user.tipo !== 'professor') {
    return res.status(401).json({ success: false, message: 'Não autorizado' });
  }
  
  const { nome, ano_escolar } = req.body;
  
  if (!nome || !ano_escolar) {
    return res.status(400).json({ success: false, message: 'Nome e série são obrigatórios' });
  }
  
  try {
    // Renovar e SALVAR sessão
    req.session.touch();
    
    const instituicao_id = req.session.user.instituicao_id;
    
    // Gerar código aleatório de 4 caracteres alfanuméricos
    const codigo_acesso = Math.random().toString(36).substring(2, 6).toUpperCase();
    
    // Criar turma com código
    const turma = await Turma.criar(nome, req.session.user.id, ano_escolar, instituicao_id, codigo_acesso);
    
    console.log(`✅ Turma criada: ${nome} (${codigo_acesso}) para instituição ${instituicao_id}`);
    
    // Salvar sessão ANTES de responder
    req.session.save((err) => {
      if (err) console.error('❌ Erro ao salvar sessão:', err);
      return res.json({ success: true, turma, codigo_acesso });
    });
  } catch (erro) {
    console.error('❌ Erro ao criar turma:', erro);
    return res.status(500).json({ success: false, message: 'Erro ao criar turma' });
  }
});

// GET - Listar alunos de uma turma específica
router.get('/api/turmas/:turmaId/alunos', async (req, res) => {
  if (!req.session.user || req.session.user.tipo !== 'professor') {
    return res.status(401).json({ success: false, message: 'Não autorizado' });
  }
  
  try {
    req.session.touch();
    
    const { turmaId } = req.params;
    const alunos = await Turma.listarAlunosDaTurma(turmaId);
    
    console.log(`📚 Alunos da turma ${turmaId}:`, alunos ? alunos.length : 0);
    
    // Salvar sessão renovada
    req.session.save((err) => {
      if (err) console.error('❌ Erro ao salvar sessão:', err);
      return res.json({ success: true, alunos: alunos || [] });
    });
  } catch (erro) {
    console.error('❌ Erro ao listar alunos:', erro);
    return res.status(500).json({ success: false, message: 'Erro ao listar alunos' });
  }
});

// DEBUG: Endpoint para verificar sessão
router.get('/debug', (req, res) => {
  res.json({
    session: req.session.user,
    institucao_id: req.session.user?.instituicao_id,
    profesor_id: req.session.user?.id
  });
});

module.exports = router;
