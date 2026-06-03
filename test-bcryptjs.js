// Teste de autenticação com bcryptjs
const bcryptjs = require('bcryptjs');
const Seguranca = require('./lib/seguranca');
const mockdb = require('./lib/mockdb');

async function testar() {
  console.log('\n=== TESTE BCRYPTJS ===\n');
  
  // Verificar dados das parcerias no mockdb
  console.log('Parcerias no mockdb:');
  mockdb.parcerias.forEach(p => {
    console.log(`  📧 ${p.email}: ${p.senha_gestao?.substring(0, 20)}...`);
  });
  
  // Testar login
  console.log('\n🔐 Testando login...');
  const email = 'alveshallim@gmail.com';
  const senha = '13042008';
  
  const resultado = await mockdb.validarGestor(email, senha);
  console.log(`\nResultado: ${resultado ? '✅ LOGIN SUCESSO' : '❌ LOGIN FALHOU'}`);
  console.log(`Email: ${email}`);
  console.log(`Senha: ${senha}`);
  
  if (resultado) {
    console.log(`\nDados do usuário:`);
    console.log(resultado);
  } else {
    // Debug: testar manualmente
    console.log('\n🐛 DEBUG - Verificando manualmente...');
    const parceria = mockdb.parcerias.find(p => p.email === email);
    if (parceria) {
      console.log(`✅ Parceria encontrada`);
      console.log(`  Senha armazenada (primeiros 20 chars): ${parceria.senha_gestao?.substring(0, 20)}...`);
      console.log(`  É hash bcryptjs? ${parceria.senha_gestao?.startsWith('$2')}`);
      
      const comparacao = await Seguranca.verificarSenha(senha, parceria.senha_gestao);
      console.log(`  Verificação de senha: ${comparacao}`);
    } else {
      console.log(`❌ Parceria NÃO encontrada com email: ${email}`);
    }
  }
}

testar().catch(console.error);
