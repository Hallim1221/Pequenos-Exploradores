// Carregar variáveis de ambiente
require('dotenv').config();

// Arquivo principal do servidor Express
const express = require('express');
const path = require('path');
const fs = require('fs');

// Criar arquivo para confirmar que este app.js está rodando
fs.writeFileSync('./THIS_IS_ROOT_APP_JS.txt', 'Este é o app.js da raiz - ' + new Date().toISOString());

const app = express();

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ===== MIDDLEWARE DE RASTREAMENTO =====
app.use('/api/', (req, res, next) => {
  console.log(`🔍 Requisição /api/ recebida: ${req.method} ${req.path}`);
  next();
});

// Sessão
const session = require('express-session');
app.use(session({
  secret: 'pequenos-exploradores-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // true se usar https
}));

// ===== IMPORTAR MODELOS =====
const Parceria = require('./models/Parceria');
const mockdb = require('./lib/mockdb');

// ===== ROTAS DE DEBUG =====
app.get('/debug-test', (req, res) => {
  res.json({ status: 'ok' });
});

// ===== ROTAS DE SISTEMA - Definir antes dos middlewares =====

console.log('🔔 Registrando rota POST /api/instituicoes/adicionar-aluno...');

// POST /api/instituicoes/adicionar-aluno - Cadastrar aluno na instituição
app.post('/api/instituicoes/adicionar-aluno', async (req, res) => {
  console.log('✅ POST /api/instituicoes/adicionar-aluno recebido!');
  try {
    const { nome, email, senha } = req.body;

    // Validar dados
    if (!nome || !email || !senha) {
      return res.status(400).json({ sucesso: false, mensagem: 'Nome, email e senha são obrigatórios' });
    }

    if (nome.length < 3) {
      return res.status(400).json({ sucesso: false, mensagem: 'Nome deve ter no mínimo 3 caracteres' });
    }

    if (senha.length < 6) {
      return res.status(400).json({ sucesso: false, mensagem: 'Senha deve ter no mínimo 6 caracteres' });
    }

    // Verificar se email já existe
    const Aluno = require('./models/Aluno');
    const alunoExistente = await Aluno.buscarPorEmail(email);
    if (alunoExistente) {
      return res.status(400).json({ sucesso: false, mensagem: 'Este email já está cadastrado' });
    }

    // Criar aluno no banco de dados
    const novoAluno = await Aluno.criar(nome, email, senha);
    
    // Cadastrar aluno na instituição
    const resultado = mockdb.cadastrarAlunoPorInstituicao(email, senha);
    
    if (resultado.sucesso) {
      return res.json({ sucesso: true, mensagem: 'Aluno cadastrado com sucesso!' });
    }
    
    return res.status(400).json(resultado);
  } catch (erro) {
    console.error('Erro ao cadastrar aluno:', erro);
    return res.status(500).json({ sucesso: false, mensagem: 'Erro ao cadastrar aluno' });
  }
});

// POST /api/professor/cadastro - Cadastrar novo professor
app.post('/api/professor/cadastro', async (req, res) => {
  console.log('✅ POST /api/professor/cadastro recebido!');
  try {
    const { nome, email, senha, cargo } = req.body;

    // Validar dados
    if (!nome || !email || !senha) {
      return res.status(400).json({ sucesso: false, mensagem: 'Nome, email e senha são obrigatórios' });
    }

    if (nome.length < 3) {
      return res.status(400).json({ sucesso: false, mensagem: 'Nome deve ter no mínimo 3 caracteres' });
    }

    if (senha.length < 6) {
      return res.status(400).json({ sucesso: false, mensagem: 'Senha deve ter no mínimo 6 caracteres' });
    }

    // Verificar se email já existe
    const Professor = require('./models/Professor');
    const professorExistente = await Professor.buscarPorEmail(email);
    if (professorExistente) {
      return res.status(400).json({ sucesso: false, mensagem: 'Este email já está cadastrado' });
    }

    // Criar professor no banco de dados
    const novoProfessor = await Professor.criar(nome, email, senha, cargo || 'Professor(a)');
    
    if (novoProfessor && novoProfessor.id) {
      return res.json({ sucesso: true, mensagem: 'Professor cadastrado com sucesso!', id: novoProfessor.id });
    }
    
    return res.status(400).json({ sucesso: false, mensagem: 'Erro ao cadastrar professor' });
  } catch (erro) {
    console.error('Erro ao cadastrar professor:', erro);
    return res.status(500).json({ sucesso: false, mensagem: 'Erro ao cadastrar professor' });
  }
});

// TESTE SIMPLES
app.post('/teste-aluno', (req, res) => {
  console.log('✅ POST /teste-aluno recebido!');
  res.json({ teste: 'funciona', data: req.body });
});

// ===== ROTAS DE TESTE - DEBUG =====

// Teste direto do mockdb
app.post('/test/mockdb-criar', (req, res) => {
  console.log('\n=== TESTE MOCKDB CRIAR ===');
  const msg = mockdb.criarMensagemParceria(2, 'Teste direto mockdb', 'escola');
  console.log('Mensagem criada:', msg);
  console.log('Total mensagens em mockdb:', mockdb.listarTodasMensagensParcerias().length);
  res.json({ msg, total: mockdb.listarTodasMensagensParcerias().length });
});

app.get('/test/mockdb-listar', (req, res) => {
  console.log('\n=== TESTE MOCKDB LISTAR ===');
  const todas = mockdb.listarTodasMensagensParcerias();
  console.log('Total de mensagens:', todas.length);
  console.log('Mensagens:', todas);
  res.json({ total: todas.length, mensagens: todas });
});

app.get('/test/mockdb-listar/:id', (req, res) => {
  const { id } = req.params;
  console.log(`\n=== TESTE MOCKDB LISTAR PARCERIA ${id} ===`);
  const msgs = mockdb.listarMensagensParcerias(id);
  console.log(`Mensagens da parceria ${id}:`, msgs.length);
  console.log('Detalhes:', msgs);
  res.json({ parceria_id: id, total: msgs.length, mensagens: msgs });
});

// Teste com Parceria.js
app.post('/test/parceria-criar', async (req, res) => {
  console.log('\n=== TESTE PARCERIA CRIAR ===');
  console.log('Parceria.useMock ANTES:', Parceria.useMock);
  
  const msg = await Parceria.criarMensagemParceria(3, 'Teste via Parceria.js', 'escola');
  
  console.log('Parceria.useMock DEPOIS:', Parceria.useMock);
  console.log('Mensagem criada:', msg);
  
  res.json({ msg, useMock: Parceria.useMock });
});

app.get('/test/parceria-listar/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`\n=== TESTE PARCERIA LISTAR ${id} ===`);
  console.log('Parceria.useMock:', Parceria.useMock);
  
  const msgs = await Parceria.listarMensagensParcerias(id);
  
  console.log(`Total de mensagens:`, msgs.length);
  console.log('Detalhes:', msgs);
  
  res.json({ parceria_id: id, total: msgs.length, mensagens: msgs, useMock: Parceria.useMock });
});

// ===== ROTAS DE PARCERIAS E MENSAGENS =====

// GET /api/notificacoes/count - Contar apenas mensagens recebidas (de escolas) não lidas
app.get('/api/notificacoes/count', async (req, res) => {
  try {
    const parcerias = await Parceria.listarTodas();
    let totalNaoLidas = 0;
    
    for (const parceria of parcerias) {
      const mensagens = await Parceria.listarMensagensParcerias(parceria.id);
      // Contar apenas mensagens recebidas (remetente = 'escola') que não foram visualizadas
      const naoLidas = mensagens.filter(msg => 
        msg.remetente === 'escola' && (!msg.visualizado || msg.visualizado === 0)
      ).length;
      totalNaoLidas += naoLidas;
    }
    
    res.json({ count: totalNaoLidas });
  } catch (erro) {
    console.error('Erro ao contar notificações:', erro.message);
    res.status(500).json({ error: 'Erro ao contar notificações' });
  }
});

// GET /api/parcerias/mensagens/todas - Listar todas as mensagens
app.get('/api/parcerias/mensagens/todas', async (req, res) => {
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

// GET /api/parcerias/com-mensagens - Retornar apenas parcerias com mensagens
// GET /api/parcerias/com-mensagens - COM RESPOSTA ESTRUTURADA
app.get('/api/parcerias/com-mensagens', async (req, res) => {
  try {
    console.log(`\n🟢 GET /api/parcerias/com-mensagens chamado`);
    
    const todasParcerias = await Parceria.listarTodas();
    const parceriasComMensagens = [];
    
    for (const parceria of todasParcerias) {
      const mensagens = await Parceria.listarMensagensParcerias(parceria.id);
      if (mensagens && mensagens.length > 0) {
        parceriasComMensagens.push({
          id: parceria.id,
          nome_escola: parceria.nome_escola,
          email: parceria.email,
          ultimaMensagem: mensagens[mensagens.length - 1],
          totalMensagens: mensagens.length
        });
      }
    }
    
    console.log(`  -> ${parceriasComMensagens.length} parcerias com mensagens`);
    res.json({ sucesso: true, dados: parceriasComMensagens });
  } catch (erro) {
    console.error('❌ Erro ao listar parcerias com mensagens:', erro);
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
});

// GET /api/parcerias-lista - Para dashboard (retorna array direto)
app.get('/api/parcerias-lista', async (req, res) => {
  try {
    const todasParcerias = await Parceria.listarTodas();
    res.json(todasParcerias || []);
  } catch (erro) {
    console.error('Erro ao listar parcerias:', erro);
    res.json([]);
  }
});

// POST /api/parcerias/:id/mensagens - Enviar mensagem
app.post('/api/parcerias/:id/mensagens', async (req, res) => {
  try {
    const { id } = req.params;
    const { conteudo, remetente = 'admin' } = req.body;

    console.log(`\n🔵 POST /api/parcerias/${id}/mensagens - Mensagem recebida`);
    console.log(`   Remetente: ${remetente}, Conteúdo: ${conteudo}`);

    // Validar inputs
    if (!conteudo || !conteudo.trim()) {
      return res.status(400).json({ sucesso: false, erro: 'Conteúdo vazio' });
    }

    // Criar mensagem via modelo
    const mensagem = await Parceria.criarMensagemParceria(id, conteudo, remetente);
    
    console.log(`   ✅ Mensagem criada com ID: ${mensagem.id}`);

    return res.json({ sucesso: true, mensagem });
  } catch (erro) {
    console.error(`❌ Erro ao criar mensagem:`, erro);
    return res.status(500).json({ sucesso: false, erro: 'Erro ao processar mensagem' });
  }
});

// GET /api/parcerias/:id/mensagens - Carregar mensagens de uma parceria específica
app.get('/api/parcerias/:id/mensagens', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`\n🟢 GET /api/parcerias/${id}/mensagens chamado`);
    
    // Buscar parceria
    const parceria = await Parceria.buscarPorId(id);
    if (!parceria) {
      return res.status(404).json({ sucesso: false, erro: 'Parceria não encontrada' });
    }
    
    // Buscar mensagens
    const mensagens = await Parceria.listarMensagensParcerias(id);
    
    // Marcar mensagens como visualizadas
    await Parceria.marcarMensagensComoVisualizadas(id);
    
    console.log(`   -> ${mensagens?.length || 0} mensagens encontradas`);
    
    res.json({ 
      sucesso: true, 
      parceria,
      mensagens: mensagens || []
    });
  } catch (erro) {
    console.error(`❌ Erro ao carregar mensagens:`, erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao carregar mensagens' });
  }
});

// GET /api/instituicoes - Listar todas as instituições (parcerias) com planos
app.get('/api/instituicoes', async (req, res) => {
  try {
    const parcerias = await Parceria.listarTodas();
    
    // Formato para tabela
    const instituicoes = parcerias.map(p => ({
      id: p.id,
      nome: p.nome_escola || p.nome_contato,
      cidade: p.cidade,
      email: p.email,
      plano: p.plano || 'em-andamento', // plano: 'comum', 'premium', 'em-andamento'
      status: p.status || 'ativo',
      alunos: p.alunos || 0,
      professor: p.nome_contato || 'N/A'
    }));
    
    res.json({ sucesso: true, instituicoes });
  } catch (erro) {
    console.error('Erro ao listar instituições:', erro.message);
    res.status(500).json({ sucesso: false, erro: 'Erro ao listar instituições' });
  }
});

// PUT /api/instituicoes/:id/plano - Atualizar plano da instituição
app.put('/api/instituicoes/:id/plano', async (req, res) => {
  try {
    const { id } = req.params;
    const { plano } = req.body;
    
    // Validar plano
    if (!['comum', 'premium', 'em-andamento'].includes(plano)) {
      return res.status(400).json({ sucesso: false, erro: 'Plano inválido' });
    }
    
    // Atualizar no banco
    try {
      const connection = await pool.getConnection();
      await connection.execute(
        'UPDATE parcerias_escolas SET plano = ? WHERE id = ?',
        [plano, id]
      );
      connection.release();
    } catch (erro) {
      console.error('Erro ao atualizar no MySQL:', erro.message);
      // Usar mockdb como fallback
      mockdb.atualizarPlanoParceria(id, plano);
    }
    
    res.json({ sucesso: true, mensagem: `Plano atualizado para ${plano}` });
  } catch (erro) {
    console.error('Erro ao atualizar plano:', erro.message);
    res.status(500).json({ sucesso: false, erro: 'Erro ao atualizar plano' });
  }
});

// POST /parcerias-escolas - Criar solicitação de parceria
app.post('/parcerias-escolas', async (req, res) => {
  try {
    const dados = req.body;
    
    // Validar dados
    const validacao = Parceria.validar(dados);
    if (!validacao.valido) {
      return res.status(400).json({ sucesso: false, erros: validacao.erros });
    }

    // Criar parceria
    const result = await Parceria.criar(dados);
    
    if (result && result.id) {
      return res.json({ sucesso: true, id: result.id, mensagem: 'Solicitação enviada com sucesso!' });
    }
    
    return res.status(500).json({ sucesso: false, erro: 'Erro ao criar parceria' });
  } catch (erro) {
    console.error('Erro ao processar parceria:', erro);
    return res.status(500).json({ sucesso: false, erro: 'Erro ao processar solicitação' });
  }
});

// GET /parcerias-escolas - Renderizar página
app.get('/parcerias-escolas', (req, res) => {
  res.render('parcerias-escolas');
});

// ROTAS ANTIGAS - Manter compatibilidade
// Carregador dinâmico de rotas com hot reload
app.use((req, res, next) => {
  // Não interceptar rotas /api/
  if (req.path.startsWith('/api/')) {
    return next();
  }
  
  delete require.cache[require.resolve('./routes/index')];
  const indexRouter = require('./routes/index');
  
  // Usar o router corretamente como middleware
  indexRouter(req, res, next);
});

app.use('/professor', (req, res, next) => {
  delete require.cache[require.resolve('./routes/professor')];
  const professorRouter = require('./routes/professor');
  professorRouter(req, res, next);
});

// TESTE - Adicionar rota POST diretamente aqui
app.post('/test-post', (req, res) => {
  res.json({ teste: 'POST funciona' });
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
