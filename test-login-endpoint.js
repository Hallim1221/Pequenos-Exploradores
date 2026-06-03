// Teste de endpoint de login de gestão
const fetch = require('node-fetch');

async function testarLogin() {
  const email = 'alveshallim@gmail.com';
  const senha = '13042008';
  
  console.log('\n=== TESTE LOGIN GESTÃO ===');
  console.log(`Email: ${email}`);
  console.log(`Senha: ${senha}\n`);
  
  try {
    const response = await fetch('http://localhost:3000/gestao/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, senha })
    });
    
    console.log(`Status: ${response.status}`);
    const data = await response.json();
    console.log('Resposta:', data);
    
    if (response.ok) {
      console.log('\n✅ LOGIN SUCESSO!');
    } else {
      console.log('\n❌ LOGIN FALHOU');
    }
  } catch (erro) {
    console.error('Erro ao fazer request:', erro.message);
  }
}

testarLogin();
