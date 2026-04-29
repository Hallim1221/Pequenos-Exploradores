const http = require('http');

// Todas as páginas EJS e suas rotas correspondentes
const pages = [
  // Páginas públicas
  { name: 'Home', route: '/', view: 'home.ejs' },
  { name: 'Sobre', route: '/sobre', view: 'sobre.ejs' },
  { name: 'Contato', route: '/contato', view: 'contato.ejs' },
  { name: 'Instituições', route: '/instituicoes', view: 'instituicoes.ejs' },
  
  // Login e Cadastro - Aluno
  { name: 'Login Aluno', route: '/aluno/login', view: 'aluno-login.ejs' },
  { name: 'Cadastro Aluno', route: '/aluno/cadastro', view: 'aluno-cadastro.ejs' },
  
  // Login e Cadastro - Professor
  { name: 'Login Professor', route: '/professor/login', view: 'professor_login.ejs' },
  { name: 'Cadastro Professor', route: '/professor/cadastro', view: 'professor-cadastro.ejs' },
  { name: 'Cadastro Professor 2', route: '/professor/cadastro2', view: 'cadastro2.ejs' },
  
  // Dashboard Aluno
  { name: 'Dashboard Aluno', route: '/aluno', view: 'aluno-novo.ejs' },
  { name: 'Aluno Novo', route: '/aluno-novo', view: 'aluno-novo.ejs' },
  { name: 'Aluno v2', route: '/aluno2', view: 'aluno2.ejs' },
  
  // Quizzes
  { name: 'Quiz Principal', route: '/quiz', view: 'quiz.ejs' },
  { name: 'Quiz Animais', route: '/quiz/animais', view: 'quiz_animais.ejs' },
  { name: 'Quiz Biomas', route: '/quiz/biomas', view: 'quiz_biomas.ejs' },
  { name: 'Quiz Meio Ambiente', route: '/quiz/meioambiente', view: 'quiz_meioambiente.ejs' },
  { name: 'Quiz Natureza', route: '/quiz/natureza', view: 'quiz_natureza.ejs' },
  
  // Ranking
  { name: 'Ranking', route: '/ranking', view: 'ranking.ejs' },
  { name: 'Ranking v2', route: '/ranking2', view: 'ranking2.ejs' },
  { name: 'Ranking v3', route: '/ranking3', view: 'ranking3.ejs' },
  
  // Loja
  { name: 'Loja', route: '/loja', view: 'loja.ejs' },
  { name: 'Loja Avatares', route: '/lojaAvatares', view: 'lojaAvatares.ejs' },
  { name: 'Comprar Avatares', route: '/comprar-avatares', view: 'comprar-avatares.ejs' },
  { name: 'Premium', route: '/premium', view: 'premium.ejs' },
  
  // Turmas
  { name: 'Turma', route: '/turma', view: 'turma.ejs' },
  { name: 'Criar Turma', route: '/criar_turma', view: 'criar_turma.ejs' },
  { name: 'Adicionar Turma', route: '/adicionar-turma', view: 'adicionar-turma.ejs' },
  
  // Professor
  { name: 'Dashboard Professor', route: '/professor/dashboard', view: 'professor_dashboard.ejs' },
  { name: 'Turmas Professor', route: '/professor/turmas', view: 'professor_turmas.ejs' },
  { name: 'Turmas Professor (Alt)', route: '/professor_turmas', view: 'professor_turmas.ejs' },
  { name: 'Área Professor', route: '/professor_area', view: 'professor_area.ejs' },
  { name: 'Criar Atividade', route: '/criar_atividade', view: 'criar_atividade.ejs' },
  
  // Outros
  { name: 'Natureza', route: '/natureza', view: 'natureza.ejs' },
  { name: 'Recarga', route: '/recarga', view: 'recarga.ejs' },
  { name: 'Dashboard Admin', route: '/dashboard-admin', view: 'dashboard-admin.ejs' },
  { name: 'Login v2', route: '/login2', view: 'login2.ejs' },
];

const baseUrl = 'http://localhost:3000';
let passed = 0;
let failed = 0;

async function testPage(page) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: page.route,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      // Aceita 200 (OK) ou 302 (Redirect - pode ser redirecionamento para login)
      const success = res.statusCode === 200 || res.statusCode === 302;
      
      if (success) {
        passed++;
        console.log(`✅ [${passed}/${pages.length}] ${page.name.padEnd(30)} → ${page.route} (${res.statusCode})`);
      } else {
        failed++;
        console.log(`❌ [${passed}/${pages.length}] ${page.name.padEnd(30)} → ${page.route} (${res.statusCode})`);
      }
      
      res.on('data', () => {}); // Consome dados para evitar memory leak
      res.on('end', () => resolve());
    });

    req.on('error', (e) => {
      failed++;
      console.log(`❌ [${passed}/${pages.length}] ${page.name.padEnd(30)} → ${page.route} (ERRO: ${e.message})`);
      resolve();
    });

    req.end();
  });
}

async function runTests() {
  console.log('\n' + '='.repeat(70));
  console.log(' 📄 TESTE DE TODAS AS PÁGINAS EJS - Pequenos Exploradores');
  console.log('='.repeat(70) + '\n');

  for (const page of pages) {
    await testPage(page);
  }

  console.log('\n' + '='.repeat(70));
  console.log(' 📊 RESUMO');
  console.log('='.repeat(70));
  console.log(`✅ Passadas: ${passed}/${pages.length}`);
  console.log(`❌ Falhadas: ${failed}/${pages.length}`);
  console.log(`📈 Taxa de sucesso: ${((passed / pages.length) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n✨ TODAS AS PÁGINAS RENDERIZANDO CORRETAMENTE!\n');
  }
  
  console.log('='.repeat(70) + '\n');
  process.exit(failed > 0 ? 1 : 0);
}

// Aguarda um pouco para o servidor iniciar
setTimeout(runTests, 1000);
