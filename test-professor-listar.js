const Professor = require('./models/Professor');

console.log('🧪 Testing Professor.listarTodos()...\n');

console.log('Initial state:');
console.log('  Professor.useMock =', Professor.useMock);

(async () => {
  try {
    const resultado = await Professor.listarTodos();
    console.log('\nAfter listarTodos():');
    console.log('  Professor.useMock =', Professor.useMock);
    console.log('  Returned length:', resultado?.length);
    console.log('  Content:', JSON.stringify(resultado, null, 2).substring(0, 500));
  } catch (erro) {
    console.error('Error:', erro.message);
  }
})();
