const mockdb = require('../lib/mockdb');

(async () => {
  try {
    const professor_id = 1;
    const turma_id = 1;

    console.log('=== Simulando criação de atividade pelo professor', professor_id, '===');
    const atividade = mockdb.criarAtividade(professor_id, 'Teste integração', 'Descrição de teste', 'atividade', []);
    console.log('Atividade criada:', atividade);

    console.log('\n=== Simulando postagem da atividade na turma', turma_id, '===');
    const postagem = mockdb.postarAtividadeParaTurma(atividade.id, turma_id, professor_id);
    console.log('Resultado da postagem:', postagem);

    console.log('\n=== Listando atividades da turma', turma_id, '===');
    const lista = mockdb.listarAtividadesPorTurma(turma_id);
    console.log('Atividades por turma:', JSON.stringify(lista, null, 2));

    console.log('\nTeste concluído');
  } catch (err) {
    console.error('Erro no teste:', err);
  }
})();
