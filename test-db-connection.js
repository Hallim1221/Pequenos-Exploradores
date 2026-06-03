const pool = require('./config/database');

console.log('🧪 Testing database connection and query...\n');

(async () => {
  try {
    console.log('Attempting to get connection from pool...');
    const connection = await Promise.race([
      pool.getConnection(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout after 5s')), 5000)
      )
    ]);
    
    console.log('✅ Got connection');
    
    try {
      console.log('Executing: SELECT * FROM professores');
      const [rows] = await connection.execute('SELECT * FROM professores');
      
      console.log('✅ Query executed successfully');
      console.log('Rows returned:', rows?.length);
      console.log('Row data:', JSON.stringify(rows, null, 2).substring(0, 500));
    } finally {
      connection.release();
    }
    
  } catch (erro) {
    console.log('❌ Error:', erro.message);
    console.log('Error code:', erro.code);
    console.log('Full error:', erro);
  }
  
  process.exit(0);
})();
