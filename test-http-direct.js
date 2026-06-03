// Teste HTTP com logging
const http = require('http');
const fs = require('fs');

const postData = JSON.stringify({
  email: 'alveshallim@gmail.com',
  senha: '13042008'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/gestao/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const logs = [];

const req = http.request(options, (res) => {
  logs.push(`\n=== RESPOSTA HTTP ===`);
  logs.push(`Status: ${res.statusCode}`);
  logs.push(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
    logs.push(`Dados recebidos: ${chunk.length} bytes`);
  });
  
  res.on('end', () => {
    logs.push(`Corpo completo: ${data}`);
    logs.push(`\n✅ Requisição completa`);
    
    fs.writeFileSync('./test-http-log.txt', logs.join('\n'));
    console.log(logs.join('\n'));
    process.exit(0);
  });
});

req.on('error', (e) => {
  logs.push(`❌ Erro: ${e.message}`);
  fs.writeFileSync('./test-http-log.txt', logs.join('\n'));
  console.log(logs.join('\n'));
  process.exit(1);
});

logs.push('=== INICIANDO REQUISIÇÃO HTTP ===');
logs.push(`POST http://localhost:3000/gestao/login`);
logs.push(`Body: ${postData}`);
logs.push(`\nAguardando resposta...`);

req.write(postData);
req.end();
