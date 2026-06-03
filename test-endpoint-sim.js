// Simular exatamente o que o endpoint /gestao/login faz
const Gestao = require('./models/Gestao');

async function testarEndpoint() {
  console.log('\n=== SIMULANDO ENDPOINT /gestao/login ===\n');
  
  const email = 'alveshallim@gmail.com';
  const senha = '13042008';
  
  console.log(`Email: ${email}`);
  console.log(`Senha: ${senha}`);
  console.log(`Gestao.useMock: ${Gestao.useMock}\n`);
  
  try {
    console.log('Chamando Gestao.validarCredenciais...');
    const gestor = await Gestao.validarCredenciais(email, senha);
    
    if (!gestor) {
      console.log('\n❌ FALHOU: validarCredenciais retornou null/undefined');
      return;
    }
    
    console.log('\n✅ SUCESSO: validarCredenciais retornou objeto');
    console.log('Tipo:', typeof gestor);
    console.log('Email:', gestor.email);
    console.log('Nome:', gestor.nome_contato);
    
    // Simular criação de sessão
    const nome = gestor.nome_contato || gestor.nome || 'Gestor';
    const instituicao_id = gestor.instituicao_id || gestor.id;
    const usuario = { tipo: 'gestao', email: email, id: gestor.id, nome: nome, instituicao_id: instituicao_id };
    
    console.log('\nObjeto de sessão que seria criado:');
    console.log(usuario);
    
  } catch (erro) {
    console.error(`\n❌ ERRO: ${erro.message}`);
    console.error(erro.stack);
  }
  
  process.exit(0);
}

testarEndpoint();
