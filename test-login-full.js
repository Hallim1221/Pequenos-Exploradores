// Teste completo: login + acesso à área protegida
const http = require('http');

async function fazerRequisicao(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function testar() {
  console.log('\n=== TESTE COMPLETO ===\n');
  
  // 1. Fazer login
  console.log('1️⃣ Fazendo login...');
  const loginRes = await fazerRequisicao({
    hostname: 'localhost',
    port: 3000,
    path: '/gestao/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }, JSON.stringify({
    email: 'alveshallim@gmail.com',
    senha: '13042008'
  }));
  
  console.log(`   Status: ${loginRes.status}`);
  console.log(`   Body: ${loginRes.body}`);
  console.log(`   Set-Cookie: ${loginRes.headers['set-cookie']?.[0]}`);
  
  const resposta = JSON.parse(loginRes.body);
  
  if (loginRes.status === 200 && resposta.success) {
    console.log('\n✅ LOGIN SUCESSO!');
  } else {
    console.log('\n❌ LOGIN FALHOU');
    console.log(`   Resposta: ${JSON.stringify(resposta)}`);
  }
}

testar().catch(console.error);
