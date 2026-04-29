#!/usr/bin/env node

/**
 * 🧪 Verificador de Rotas - Pequenos Exploradores
 * Testa se TODAS as páginas e rotas estão funcionando
 */

const http = require('http');

const rotas = [
  // 🏠 Públicas
  { url: '/', tipo: 'GET', nome: 'Home' },
  { url: '/sobre', tipo: 'GET', nome: 'Sobre' },
  { url: '/contato', tipo: 'GET', nome: 'Contato' },
  { url: '/instituicoes', tipo: 'GET', nome: 'Instituições' },

  // 👤 Aluno
  { url: '/aluno/login', tipo: 'GET', nome: 'Login Aluno' },
  { url: '/aluno/cadastro', tipo: 'GET', nome: 'Cadastro Aluno' },
  { url: '/aluno', tipo: 'GET', nome: 'Dashboard Aluno' },
  { url: '/aluno-novo', tipo: 'GET', nome: 'Aluno Novo' },
  { url: '/aluno2', tipo: 'GET', nome: 'Aluno 2' },

  // 📚 Quizzes
  { url: '/quiz', tipo: 'GET', nome: 'Quiz Principal' },
  { url: '/quiz/animais', tipo: 'GET', nome: 'Quiz Animais' },
  { url: '/quiz/biomas', tipo: 'GET', nome: 'Quiz Biomas' },
  { url: '/quiz/meioambiente', tipo: 'GET', nome: 'Quiz Meio Ambiente' },
  { url: '/quiz/natureza', tipo: 'GET', nome: 'Quiz Natureza' },
  { url: '/natureza', tipo: 'GET', nome: 'Natureza' },

  // 📊 Ranking
  { url: '/ranking', tipo: 'GET', nome: 'Ranking' },
  { url: '/ranking2', tipo: 'GET', nome: 'Ranking 2' },

  // 🎒 Loja
  { url: '/loja', tipo: 'GET', nome: 'Loja' },
  { url: '/lojaAvatares', tipo: 'GET', nome: 'Loja Avatares' },
  { url: '/comprar-avatares', tipo: 'GET', nome: 'Comprar Avatares' },
  { url: '/premium', tipo: 'GET', nome: 'Premium' },
  { url: '/recarga', tipo: 'GET', nome: 'Recarga' },

  // 👨‍🏫 Professor
  { url: '/professor/login', tipo: 'GET', nome: 'Login Professor' },
  { url: '/professor/cadastro', tipo: 'GET', nome: 'Cadastro Professor' },
  { url: '/professor/dashboard', tipo: 'GET', nome: 'Dashboard Professor' },
  { url: '/professor/turmas', tipo: 'GET', nome: 'Turmas Professor' },
  { url: '/professor_turmas', tipo: 'GET', nome: 'Professor Turmas (Alt)' },

  // 🏫 Turmas
  { url: '/turma', tipo: 'GET', nome: 'Turma' },
  { url: '/criar_turma', tipo: 'GET', nome: 'Criar Turma' },
  { url: '/adicionar-turma', tipo: 'GET', nome: 'Adicionar Turma' },

  // 🧪 Teste
  { url: '/test', tipo: 'GET', nome: 'Página de Testes' },
  { url: '/api/status', tipo: 'GET', nome: 'API Status' },
  { url: '/api/test/alunos', tipo: 'GET', nome: 'API Listar Alunos' }
];

let passadas = 0;
let falhadas = 0;
let erros = [];

console.log('\n' + '='.repeat(60));
console.log(' 🧪 TESTE DE ROTAS - Pequenos Exploradores');
console.log('='.repeat(60) + '\n');

function testarRota(rota, index) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: rota.url,
      method: rota.tipo,
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 500) {
        console.log(`✅ [${index + 1}/${rotas.length}] ${rota.nome.padEnd(30)} → ${rota.url} (${res.statusCode})`);
        passadas++;
      } else {
        console.log(`❌ [${index + 1}/${rotas.length}] ${rota.nome.padEnd(30)} → ${rota.url} (${res.statusCode})`);
        falhadas++;
        erros.push({ rota: rota.url, status: res.statusCode });
      }
      resolve();
    });

    req.on('error', (erro) => {
      console.log(`❌ [${index + 1}/${rotas.length}] ${rota.nome.padEnd(30)} → ${rota.url} (ERRO: ${erro.code})`);
      falhadas++;
      erros.push({ rota: rota.url, erro: erro.message });
      resolve();
    });

    req.on('timeout', () => {
      console.log(`❌ [${index + 1}/${rotas.length}] ${rota.nome.padEnd(30)} → ${rota.url} (TIMEOUT)`);
      falhadas++;
      erros.push({ rota: rota.url, erro: 'TIMEOUT' });
      req.destroy();
      resolve();
    });

    req.end();
  });
}

async function executarTestes() {
  // Aguardar servidor iniciar
  await new Promise(r => setTimeout(r, 1000));

  for (let i = 0; i < rotas.length; i++) {
    await testarRota(rotas[i], i);
    await new Promise(r => setTimeout(r, 100)); // Delay entre requisições
  }

  // Resumo
  console.log('\n' + '='.repeat(60));
  console.log(' 📊 RESUMO');
  console.log('='.repeat(60));
  console.log(`✅ Passadas: ${passadas}/${rotas.length}`);
  console.log(`❌ Falhadas: ${falhadas}/${rotas.length}`);
  console.log(`📈 Taxa de sucesso: ${Math.round((passadas / rotas.length) * 100)}%`);

  if (erros.length > 0) {
    console.log('\n❌ Erros encontrados:');
    erros.forEach(e => {
      console.log(`   • ${e.rota}: ${e.status || e.erro}`);
    });
  } else {
    console.log('\n✨ TODAS AS ROTAS FUNCIONANDO!');
  }

  console.log('\n' + '='.repeat(60) + '\n');
  process.exit(falhadas > 0 ? 1 : 0);
}

executarTestes();
