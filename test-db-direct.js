const pool = require('./config/database');

async function testDB() {
  try {
    console.log('🔍 Testando conexão com banco de dados...');
    const connection = await pool.getConnection();
    console.log('✅ Conectado ao MySQL!');
    
    // Verificar turmas existentes
    const [turmas] = await connection.execute('SELECT * FROM turmas');
    console.log('\n📚 Turmas existentes no banco:');
    console.table(turmas);
    
    // Testar inserção
    console.log('\n🔄 Tentando inserir uma turma de teste...');
    const [result] = await connection.execute(
      'INSERT INTO turmas (nome, professor_id, ano_escolar) VALUES (?, ?, ?)',
      ['Turma Teste INSERT', 1, '3º']
    );
    console.log('✅ Turma inserida! ID:', result.insertId);
    
    // Verificar turmas novamente
    const [turmas2] = await connection.execute('SELECT * FROM turmas ORDER BY id DESC LIMIT 5');
    console.log('\n📚 Últimas 5 turmas:');
    console.table(turmas2);
    
    connection.release();
    process.exit(0);
  } catch (erro) {
    console.error('❌ Erro:', erro);
    process.exit(1);
  }
}

testDB();
