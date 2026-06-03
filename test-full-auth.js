// Teste completo do flow de autenticação
const Gestao = require('./models/Gestao');

async function testar() {
  console.log('\n=== TESTE COMPLETO DE AUTENTICAÇÃO ===\n');
  
  const email = 'alveshallim@gmail.com';
  const senha = '13042008';
  
  console.log(`Email: ${email}`);
  console.log(`Senha: ${senha}\n`);
  
  try {
    const resultado = await Gestao.validarCredenciais(email, senha);
    
    console.log(`\n\n=== RESULTADO FINAL ===`);
    console.log(`Autenticado: ${resultado ? 'SIM ✅' : 'NÃO ❌'}`);
    
    if (resultado) {
      console.log(`\nDados do usuário:`, resultado);
    }
  } catch (erro) {
    console.error(`\nErro durante teste: ${erro.message}`);
    console.error(erro.stack);
  }
  
  process.exit(0);
}

testar();
