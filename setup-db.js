const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  try {
    console.log('🔍 Tentando conectar ao MySQL...');
    console.log('   Host: localhost');
    console.log('   User: tcc');
    console.log('   Password: (sem senha)');

    // Conectar ao MySQL sem banco específico
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'tcc',
      password: '',
      multipleStatements: true
    });

    console.log('✅ Conectado ao MySQL!');

    // Ler o arquivo SQL
    const sqlScript = fs.readFileSync(path.join(__dirname, 'config/tcc-mysql2.0 1.sql'), 'utf8');

    // Executar o script
    await connection.query(sqlScript);
    console.log('✅ Banco de dados criado com sucesso!');
    console.log('✅ Tabelas criadas:');
    console.log('   - alunos');
    console.log('   - professores');
    console.log('   - turmas');
    console.log('   - turma_alunos');
    console.log('   - quizzes');
    console.log('   - perguntas');
    console.log('   - opcoes');
    console.log('   - respostas');
    console.log('   - notificacoes');
    console.log('   - compras');

    await connection.end();
    process.exit(0);
  } catch (erro) {
    console.error('❌ Erro ao configurar banco de dados:');
    console.error('Mensagem:', erro.message);
    console.error('Código:', erro.code);
    console.error('\n💡 Dica: Certifique-se que:');
    console.error('   1. MySQL está rodando');
    console.error('   2. Usuário "tcc" existe');
    console.error('   3. Credenciais no .env estão corretas');
    process.exit(1);
  }
}

setupDatabase();
