const express = require('express');
const path = require('path');

// Carregar variáveis de ambiente
require('dotenv').config();

// Importar modelos (vão usar mock data se BD não estiver disponível)
const Aluno = require('./models/Aluno');
const Professor = require('./models/Professor');

const app = express();

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Sessão
const session = require('express-session');
app.use(session({
  secret: 'pequenos-exploradores-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

console.log(`\n🚀 Iniciando Pequenos Exploradores`);
console.log(`📌 Banco de Dados: ${process.env.DB_NAME || 'MOCK DATA'}`);

// ROTA DE TESTE: Status do BD
app.get('/api/status', async (req, res) => {
  try {
    const aluno = await Aluno.buscarPorEmail('joao@test.com');
    const useMock = Aluno.useMock;
    
    res.json({
      status: 'ok',
      usando_mock: useMock,
      mensagem: useMock 
        ? '⚠️ Usando Mock Data (BD indisponível)' 
        : '✅ Conectado ao MySQL Real',
      alunos_teste: await Aluno.listarTodos(),
      database: process.env.DB_NAME || 'MOCK'
    });
  } catch (erro) {
    res.json({
      status: 'erro',
      mensagem: erro.message
    });
  }
});

// ROTA DE TESTE: Criar aluno
app.post('/api/test/criar-aluno', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    
    if (!nome || !email || !senha) {
      return res.status(400).json({ 
        sucesso: false, 
        mensagem: 'Nome, email e senha são obrigatórios' 
      });
    }

    const aluno = await Aluno.criar(nome, email, senha);
    
    res.json({
      sucesso: true,
      usando_mock: Aluno.useMock,
      aluno,
      mensagem: `Aluno ${nome} criado com sucesso!`
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: erro.message
    });
  }
});

// ROTA DE TESTE: Listar alunos
app.get('/api/test/alunos', async (req, res) => {
  try {
    const alunos = await Aluno.listarTodos();
    res.json({
      sucesso: true,
      usando_mock: Aluno.useMock,
      total: alunos.length,
      alunos
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: erro.message
    });
  }
});

// ROTA DE TESTE: Página HTML de testes
app.get('/test', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🧪 Testes - Pequenos Exploradores</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .container {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h1 { color: #61b231; }
    .status { 
      padding: 15px; 
      margin: 20px 0; 
      border-radius: 5px;
      background: #e8f5e9;
      border-left: 4px solid #61b231;
    }
    .form-group {
      margin: 15px 0;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    input, button {
      padding: 10px;
      font-size: 14px;
      border-radius: 4px;
      border: 1px solid #ddd;
    }
    button {
      background: #61b231;
      color: white;
      cursor: pointer;
      border: none;
      width: 100%;
      margin-top: 10px;
    }
    button:hover {
      background: #4a9223;
    }
    .resultado {
      margin-top: 20px;
      padding: 15px;
      background: #f0f0f0;
      border-radius: 4px;
      white-space: pre-wrap;
      font-family: monospace;
      font-size: 12px;
      max-height: 300px;
      overflow-y: auto;
    }
    .success { background: #c8e6c9; color: #2e7d32; }
    .error { background: #ffcdd2; color: #c62828; }
    .warning { background: #fff3cd; color: #856404; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🧪 Testes - Pequenos Exploradores</h1>
    
    <div id="status" class="status">
      Carregando status...
    </div>

    <h2>Criar Novo Aluno</h2>
    <form id="form-aluno">
      <div class="form-group">
        <label>Nome:</label>
        <input type="text" id="nome" placeholder="Ex: João Silva" required>
      </div>
      <div class="form-group">
        <label>Email:</label>
        <input type="email" id="email" placeholder="Ex: joao@test.com" required>
      </div>
      <div class="form-group">
        <label>Senha:</label>
        <input type="password" id="senha" placeholder="Ex: senha123" required>
      </div>
      <button type="submit">Criar Aluno</button>
    </form>

    <h2>Listar Alunos</h2>
    <button onclick="listarAlunos()">🔄 Atualizar Lista</button>

    <div id="resultado" class="resultado" style="display:none;"></div>
  </div>

  <script>
    async function carregarStatus() {
      try {
        const res = await fetch('/api/status');
        const data = await res.json();
        
        const statusDiv = document.getElementById('status');
        const classe = data.usando_mock ? 'warning' : 'success';
        
        statusDiv.innerHTML = \`
          <strong>Status:</strong> \${data.mensagem}<br>
          <strong>Banco:</strong> \${data.database}<br>
          <strong>Alunos:</strong> \${data.alunos_teste.length}
        \`;
        statusDiv.className = 'status ' + classe;
      } catch (erro) {
        document.getElementById('status').innerHTML = '❌ Erro ao carregar status: ' + erro.message;
        document.getElementById('status').className = 'status error';
      }
    }

    document.getElementById('form-aluno').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const nome = document.getElementById('nome').value;
      const email = document.getElementById('email').value;
      const senha = document.getElementById('senha').value;
      
      try {
        const res = await fetch('/api/test/criar-aluno', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, email, senha })
        });
        
        const data = await res.json();
        const resultado = document.getElementById('resultado');
        resultado.style.display = 'block';
        resultado.className = 'resultado ' + (data.sucesso ? 'success' : 'error');
        resultado.textContent = JSON.stringify(data, null, 2);
        
        if (data.sucesso) {
          document.getElementById('form-aluno').reset();
          setTimeout(carregarStatus, 500);
          setTimeout(listarAlunos, 500);
        }
      } catch (erro) {
        document.getElementById('resultado').style.display = 'block';
        document.getElementById('resultado').className = 'resultado error';
        document.getElementById('resultado').textContent = 'Erro: ' + erro.message;
      }
    });

    async function listarAlunos() {
      try {
        const res = await fetch('/api/test/alunos');
        const data = await res.json();
        const resultado = document.getElementById('resultado');
        resultado.style.display = 'block';
        resultado.className = 'resultado success';
        resultado.textContent = JSON.stringify(data, null, 2);
      } catch (erro) {
        document.getElementById('resultado').style.display = 'block';
        document.getElementById('resultado').className = 'resultado error';
        document.getElementById('resultado').textContent = 'Erro: ' + erro.message;
      }
    }

    // Carregar status ao abrir
    carregarStatus();
  </script>
</body>
</html>
  `);
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`\n🧪 Teste em: http://localhost:${PORT}/test\n`);
});

module.exports = app;
