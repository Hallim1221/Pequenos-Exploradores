const Professor = require('./models/Professor');
const mockdb = require('./lib/mockdb');
const Parceria = require('./models/Parceria');

console.log('🧪 COMPREHENSIVE PROFESSOR.LISTARTODOS() TEST\n');

(async () => {
  try {
    // Initial state
    console.log('=== INITIAL STATE ===');
    console.log('Professor.useMock:', Professor.useMock);
    console.log('mockdb.professores.length:', mockdb.professores.length);
    console.log('Professors with instituicao_id=1:', mockdb.professores.filter(p => p.instituicao_id === 1).length);
    
    // Simulate the route scenario
    console.log('\n=== FIRST CALL TO listarTodos() ===');
    const resultado1 = await Professor.listarTodos();
    console.log('Result count:', resultado1?.length);
    console.log('Professor.useMock after first call:', Professor.useMock);
    
    // Check what would happen in the route
    console.log('\n=== SIMULATING ROUTE LOGIC ===');
    const instituicao_id = 1;
    const filtered = resultado1.filter(p => {
      const match = p.instituicao_id === instituicao_id;
      if (!match) console.log('Filtered out prof id', p.id, '- instituicao_id:', p.instituicao_id, 'vs', instituicao_id);
      return match;
    });
    console.log('After filter for instituicao_id=1:', filtered.length);
    console.log('Filtered professors:',  filtered.map(p => `${p.id}:${p.nome}`));
    
    // Try second call
    console.log('\n=== SECOND CALL TO listarTodos() ===');
    const resultado2 = await Professor.listarTodos();
    console.log('Result count:', resultado2?.length);
    console.log('Professor.useMock:', Professor.useMock);
    
  } catch (erro) {
    console.error('ERROR:', erro.message, erro.stack);
  }
})();
