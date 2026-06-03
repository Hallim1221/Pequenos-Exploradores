const mockdb = require('./lib/mockdb');

console.log('🧪 Testing mockdb.listarProfessores()...\n');

// Test 1: Check mockdb structure
console.log('mockdb.professores exists:', mockdb.professores ? 'YES' : 'NO');
console.log('mockdb.professores type:', typeof mockdb.professores);
console.log('mockdb.professores length:', mockdb.professores?.length);

// Test 2: Call the method
const resultado = mockdb.listarProfessores();
console.log('\nlistarProfessores() returned:');
console.log('Type:', typeof resultado);
console.log('Length:', resultado?.length);
console.log('Content:', JSON.stringify(resultado, null, 2));

// Test 3: Check individual professors
if (resultado && resultado.length > 0) {
  console.log('\nFirst professor:');
  console.log(JSON.stringify(resultado[0], null, 2));
}

// Test 4: Check if there's data directly
console.log('\n✅ Direct mockdb.professores access:');
console.log(JSON.stringify(mockdb.professores, null, 2));
