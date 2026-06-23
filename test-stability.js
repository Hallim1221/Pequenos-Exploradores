/**
 * TEST: Teste de Estabilidade do Servidor - Turma Switching
 * 
 * Objetivo: Validar que o servidor NÃO crashará quando múltiplos alunos
 * trocam de turma simultaneamente.
 * 
 * Execução: node test-stability.js
 */

const http = require('http');

// ===== CONFIGURAÇÃO =====
const BASE_URL = 'http://localhost:3000';
const CONCURRENT_REQUESTS = 5; // Reduzido para usar alunos reais
const REQUESTS_PER_STUDENT = 3;

// Alunos reais do mockdb
const ALUNOS_REAIS = [
  { email: 'joao@test.com', senha: 'senha123' },
  { email: 'ana.costa@test.com', senha: 'senha123' },
  { email: 'carlos.mendes@test.com', senha: 'senha123' },
  { email: 'sofia.lima@test.com', senha: 'senha123' },
  { email: 'lucas.ferreira@test.com', senha: 'senha123' }
];

// ===== CORES PARA CONSOLE =====
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(color, prefix, msg) {
  console.log(`${color}${prefix}${colors.reset} ${msg}`);
}

// ===== FAZER REQUISIÇÃO HTTP =====
async function makeRequest(method, path, data = null, cookies = '') {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies,
      }
    };

    if (method === 'POST' && data) {
      const body = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(body);
    }

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: parsed
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.abort();
      reject(new Error('Request timeout'));
    });

    req.setTimeout(10000);

    if (method === 'POST' && data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// ===== SIMULAR LOGIN DE ALUNO =====
async function loginAluno(email, senha) {
  log(colors.blue, '📝', `Login do aluno: ${email}`);
  
  try {
    const response = await makeRequest('POST', '/aluno/login', {
      email: email,
      senha: senha
    });

    if (response.status === 200 || response.status === 302 || response.body.success) {
      const setCookie = response.headers['set-cookie'];
      if (setCookie && Array.isArray(setCookie)) {
        const cookies = setCookie.map(c => c.split(';')[0]).join('; ');
        log(colors.green, '✅', `${email} logado com sucesso`);
        return cookies;
      }
    }
    
    log(colors.yellow, '⚠️', `Falha ao fazer login de ${email}: ${response.status}`);
    return null;
  } catch (erro) {
    log(colors.red, '❌', `Erro ao fazer login: ${erro.message}`);
    return null;
  }
}

// ===== TROCAR DE TURMA =====
async function trocarTurma(cookies, turmaId, attempt) {
  try {
    const response = await makeRequest(
      'POST',
      '/api/alunos/entrar-turma',
      { turma_id: turmaId },
      cookies
    );

    if (response.status === 200 && response.body.success) {
      log(colors.green, '✅', `Turma ${turmaId} - Attempt ${attempt} - SUCESSO`);
      return true;
    } else {
      log(colors.yellow, '⚠️', `Turma ${turmaId} - Attempt ${attempt} - Falha: ${response.body.message}`);
      return false;
    }
  } catch (erro) {
    log(colors.red, '❌', `Turma ${turmaId} - Attempt ${attempt} - Erro: ${erro.message}`);
    return false;
  }
}

// ===== TESTE PRINCIPAL =====
async function runStabilityTest() {
  log(colors.cyan, '🚀', '=== INICIANDO TESTE DE ESTABILIDADE ===');
  log(colors.cyan, '📊', `Requisições concorrentes: ${CONCURRENT_REQUESTS}`);
  log(colors.cyan, '📊', `Trocas por estudante: ${REQUESTS_PER_STUDENT}`);
  log(colors.cyan, '📊', `Total de requisições: ${CONCURRENT_REQUESTS * REQUESTS_PER_STUDENT}`);

  const stats = {
    total: 0,
    success: 0,
    failed: 0,
    errors: []
  };

  const startTime = Date.now();

  // Simular múltiplos alunos trocando de turma
  const promises = [];

  for (let i = 0; i < CONCURRENT_REQUESTS; i++) {
    promises.push((async () => {
      const aluno = ALUNOS_REAIS[i];
      const cookies = await loginAluno(aluno.email, aluno.senha);

      if (!cookies) {
        log(colors.red, '❌', `Não foi possível fazer login de ${aluno.email}`);
        return;
      }

      // Cada aluno tenta trocar de turma múltiplas vezes
      for (let j = 1; j <= REQUESTS_PER_STUDENT; j++) {
        const turmaId = (j % 3) + 1; // Alternar entre turmas 1, 2, 3

        stats.total++;

        try {
          const success = await trocarTurma(cookies, turmaId, j);
          if (success) {
            stats.success++;
          } else {
            stats.failed++;
          }
        } catch (erro) {
          stats.failed++;
          stats.errors.push({
            aluno: aluno.email,
            tentativa: j,
            erro: erro.message
          });
        }

        // Aguardar um pouco entre requisições
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      log(colors.green, '✅', `${aluno.email} completou todas as trocas`);
    })());
  }

  // Aguardar todas as requisições
  await Promise.all(promises);

  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;

  // ===== EXIBIR RESULTADOS =====
  log(colors.cyan, '📊', '=== RESULTADOS DO TESTE ===');
  log(colors.green, '✅', `Total de requisições: ${stats.total}`);
  log(colors.green, '✅', `Sucesso: ${stats.success}`);
  log(colors.red, '❌', `Falhas: ${stats.failed}`);
  log(colors.cyan, '⏱️', `Duração: ${duration.toFixed(2)}s`);
  log(colors.cyan, '⚡', `Taxa de requisições: ${(stats.total / duration).toFixed(1)}/s`);

  if (stats.errors.length > 0) {
    log(colors.yellow, '⚠️', '=== ERROS ENCONTRADOS ===');
    stats.errors.forEach(err => {
      log(colors.yellow, '⚠️', `${err.aluno} - Tentativa ${err.tentativa}: ${err.erro}`);
    });
  }

  const successRate = ((stats.success / stats.total) * 100).toFixed(1);
  log(colors.cyan, '📈', `Taxa de sucesso: ${successRate}%`);

  if (stats.success === stats.total) {
    log(colors.green, '🎉', '=== TESTE PASSOU - SERVIDOR ESTÁVEL ===');
  } else {
    log(colors.yellow, '⚠️', '=== TESTE COM FALHAS - VERIFICAR SERVIDOR ===');
  }
}

// ===== EXECUTAR TESTE =====
console.log('\n');
runStabilityTest().catch((erro) => {
  log(colors.red, '❌', `Erro fatal no teste: ${erro.message}`);
  process.exit(1);
});
