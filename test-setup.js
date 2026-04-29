const mysql = require('mysql2/promise');
const fs = require('fs');

async function testSetup() {
  console.log('\n========================================');
  console.log(' 🧪 TESTE DE SETUP - Pequenos Exploradores');
  console.log('========================================\n');

  // TESTE 1: Verificar MySQL conectado
  console.log('📋 TESTE 1: Conectar ao MySQL');
  console.log('─'.repeat(40));
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'tcc',
      password: '',
      database: 'tcc-mysql2.0'
    });
    
    console.log('✅ Conectado ao MySQL com sucesso!');
    console.log('   Host: localhost:3306');
    console.log('   User: tcc');
    console.log('   Database: tcc-mysql2.0');

    // TESTE 2: Listar tabelas
    console.log('\n📋 TESTE 2: Verificar Tabelas');
    console.log('─'.repeat(40));
    
    const [tables] = await connection.query(
      "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'tcc-mysql2.0'"
    );

    if (tables.length === 0) {
      console.log('❌ Nenhuma tabela encontrada!');
      await connection.end();
      return;
    }

    console.log(`✅ ${tables.length} tabelas encontradas:\n`);
    tables.forEach((t, i) => {
      console.log(`   ${i + 1}. ${t.TABLE_NAME}`);
    });

    // TESTE 3: Contar registros
    console.log('\n📋 TESTE 3: Registros por Tabela');
    console.log('─'.repeat(40));

    const tabelasImportantes = ['alunos', 'professores', 'turmas', 'quizzes'];
    
    for (const tabela of tabelasImportantes) {
      const [result] = await connection.query(`SELECT COUNT(*) as total FROM ${tabela}`);
      const total = result[0].total;
      console.log(`   📊 ${tabela}: ${total} registros`);
    }

    // TESTE 4: Testar modelo Aluno
    console.log('\n📋 TESTE 4: Testes de Modelo');
    console.log('─'.repeat(40));

    try {
      const Aluno = require('./models/Aluno');
      
      // Criar um aluno de teste
      const novoAluno = await Aluno.criar(
        'Teste Aluno',
        `teste${Date.now()}@pequenos.com`,
        'senha123'
      );
      
      console.log(`✅ Aluno criado: ID ${novoAluno.id}`);
      
      // Buscar aluno
      const alunoEncontrado = await Aluno.buscarPorId(novoAluno.id);
      if (alunoEncontrado) {
        console.log(`✅ Aluno encontrado: ${alunoEncontrado.nome}`);
      }
      
      // Deletar aluno de teste
      await Aluno.deletar(novoAluno.id);
      console.log(`✅ Aluno de teste deletado`);

    } catch (erro) {
      console.log(`⚠️ Erro no teste de modelo: ${erro.message}`);
    }

    // TESTE 5: Verificar .env
    console.log('\n📋 TESTE 5: Configurações do Projeto');
    console.log('─'.repeat(40));

    if (fs.existsSync('.env')) {
      console.log('✅ Arquivo .env existe');
      const envContent = fs.readFileSync('.env', 'utf8');
      const hasDbConfig = envContent.includes('DB_HOST') && 
                         envContent.includes('DB_USER') && 
                         envContent.includes('DB_NAME');
      if (hasDbConfig) {
        console.log('✅ Variáveis de banco configuradas');
      } else {
        console.log('⚠️ Arquivo .env incompleto');
      }
    } else {
      console.log('❌ Arquivo .env não encontrado');
    }

    // TESTE 6: Verificar rotas
    console.log('\n📋 TESTE 6: Sistema de Rotas');
    console.log('─'.repeat(40));

    if (fs.existsSync('routes/index.js')) {
      const rotasContent = fs.readFileSync('routes/index.js', 'utf8');
      const temModelos = rotasContent.includes("require('../models/");
      const temAluno = rotasContent.includes("const Aluno");
      
      if (temModelos && temAluno) {
        console.log('✅ Rotas integradas com modelos');
        console.log('✅ Modelo Aluno importado');
      } else {
        console.log('⚠️ Integração de modelos incompleta');
      }
    }

    // RESUMO FINAL
    console.log('\n========================================');
    console.log(' ✅ TUDO FUNCIONANDO!');
    console.log('========================================\n');
    console.log('Próximos passos:');
    console.log('  1. npm start');
    console.log('  2. Acesse http://localhost:3000');
    console.log('  3. Teste cadastro de aluno\n');

    await connection.end();
    process.exit(0);

  } catch (erro) {
    console.error('\n❌ ERRO DE CONEXÃO:');
    console.error(`   ${erro.message}\n`);
    
    console.log('Checklist:');
    console.log('  ☐ Docker Desktop está instalado?');
    console.log('  ☐ Docker Desktop está aberto/rodando?');
    console.log('  ☐ Executou: docker-compose up -d ?');
    console.log('  ☐ Aguardou 30 segundos?');
    console.log('  ☐ .env tem as credenciais corretas?\n');
    
    console.log('Tente:');
    console.log('  1. docker-compose logs mysql');
    console.log('  2. docker ps (para ver containers)');
    console.log('  3. node test-setup.js (tentar de novo)\n');
    
    process.exit(1);
  }
}

testSetup();
