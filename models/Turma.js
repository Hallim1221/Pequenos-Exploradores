const BaseModel = require('./BaseModel');
const mockdb = require('../lib/mockdb');

class Turma extends BaseModel {
  static useMock = false;

  // Criar nova turma com código de acesso
  static async criar(nome, professor_id, ano_escolar = null, instituicao_id = null, codigo_acesso = null) {
    console.log('🔄 Turma.criar() chamado com:',{nome, professor_id, ano_escolar, instituicao_id, codigo_acesso});
    console.log('   mockdb.criarTurma existe?', typeof mockdb.criarTurma);
    return this.executeWithFallback(
      () => this.withConnection(async (connection) => {
        const [result] = await connection.execute(
          'INSERT INTO turmas (nome, professor_id, ano_escolar, instituicao_id, codigo_acesso) VALUES (?, ?, ?, ?, ?)',
          [nome, professor_id, ano_escolar, instituicao_id, codigo_acesso]
        );
        this.log('criar', 'success', `Turma ${nome} criada com código ${codigo_acesso}`);
        return { id: result.insertId, nome, professor_id, instituicao_id, codigo_acesso };
      }),
      () => {
        console.log('   ➡️ Usando fallback. mockdb.criarTurma:', typeof mockdb.criarTurma);
        if (mockdb.criarTurma) {
          const resultado = mockdb.criarTurma(nome, professor_id, ano_escolar, instituicao_id, codigo_acesso);
          console.log('   ✅ criarTurma retornou:', resultado);
          return resultado;
        } else {
          console.log('   ⚠️ mockdb.criarTurma NÃO EXISTE! Usando Date.now()');
          return { id: Date.now(), nome, professor_id, instituicao_id, codigo_acesso };
        }
      }
    );
  }

  // Listar turmas de um professor (para compatibilidade)
  static async listarPorProfessor(professor_id) {
    return this.executeWithFallback(
      () => this.withConnection(async (connection) => {
        const [rows] = await connection.execute(
          'SELECT * FROM turmas WHERE professor_id = ?',
          [professor_id]
        );
        return rows;
      }),
      () => {
        console.log('🔍 MockDB listarPorProfessor (compatibilidade):');
        console.log('   Professor ID:', professor_id);
        const filtered = this.turmas.filter(t => t.professor_id === parseInt(professor_id));
        return filtered;
      }
    );
  }

  // Buscar turma por ID
  static async buscarPorId(id) {
    return this.executeWithFallback(
      () => this.withConnection(async (connection) => {
        const [rows] = await connection.execute(
          'SELECT * FROM turmas WHERE id = ?',
          [id]
        );
        return rows[0] || null;
      }),
      () => mockdb.turmas.find(t => t.id === parseInt(id)) || null
    );
  }

  // Buscar turma pelo código de acesso
  static async buscarPorCodigo(codigo) {
    return this.executeWithFallback(
      () => this.withConnection(async (connection) => {
        const [rows] = await connection.execute(
          'SELECT * FROM turmas WHERE codigo_acesso = ? OR codigo = ?',
          [codigo, codigo]
        );
        return rows[0] || null;
      }),
      () => mockdb.turmas.find(t => (t.codigo_acesso === codigo || t.codigo === codigo)) || null
    );
  }

  // Listar turmas de uma instituição
  static async listarPorInstituicao(instituicao_id) {
    console.log('🔄 Turma.listarPorInstituicao() chamado com:', instituicao_id);
    return this.executeWithFallback(
      () => this.withConnection(async (connection) => {
        const [rows] = await connection.execute(
          'SELECT * FROM turmas WHERE instituicao_id = ?',
          [instituicao_id]
        );
        return rows;
      }),
      () => {
        console.log('🔍 MockDB listarPorInstituicao:');
        console.log('   Instituição ID:', instituicao_id);
        console.log('   Todas as turmas:', mockdb.turmas);
        const resultado = mockdb.turmas.filter(t => t.instituicao_id === parseInt(instituicao_id));
        console.log('   Turmas encontradas:', resultado);
        return resultado;
      }
    );
  }

  // Listar todos os alunos de uma turma
  static async listarAlunosDaTurma(turma_id) {
    return this.executeWithFallback(
      () => this.withConnection(async (connection) => {
        const [rows] = await connection.execute(
          'SELECT a.* FROM alunos a WHERE a.turma_id = ?',
          [turma_id]
        );
        return rows;
      }),
      () => mockdb.listarAlunosDaTurma(turma_id)
    );
  }

  // Adicionar aluno à turma
  static async adicionarAluno(turma_id, aluno_id) {
    return this.executeWithFallback(
      () => this.withConnection(async (connection) => {
        await connection.execute(
          'INSERT INTO turma_alunos (turma_id, aluno_id) VALUES (?, ?)',
          [turma_id, aluno_id]
        );
        return true;
      }),
      () => true
    );
  }

  // Deletar turma
  static async deletar(id) {
    console.log('🔄 Turma.deletar() chamado com id:', id);
    return this.executeWithFallback(
      () => this.withConnection(async (connection) => {
        await connection.execute('DELETE FROM turmas WHERE id = ?', [id]);
        this.log('deletar', 'success', `Turma ${id} deletada`);
        return { sucesso: true };
      }),
      () => {
        console.log('   ➡️ Usando fallback. mockdb.deletarTurma:', typeof mockdb.deletarTurma);
        if (mockdb.deletarTurma) {
          const resultado = mockdb.deletarTurma(id);
          console.log('   ✅ deletarTurma retornou:', resultado);
          return { sucesso: resultado };
        } else {
          console.log('   ⚠️ mockdb.deletarTurma NÃO EXISTE!');
          return { sucesso: false };
        }
      }
    );
  }

  // Atualizar turma
  static async atualizar(id, { nome, ano, professor_id }) {
    return this.executeWithFallback(
      () => this.withConnection(async (connection) => {
        const campos = [];
        const valores = [];
        
        if (nome !== undefined) { campos.push('nome = ?'); valores.push(nome); }
        if (ano !== undefined) { campos.push('ano = ?'); valores.push(ano); }
        if (professor_id !== undefined) { campos.push('professor_id = ?'); valores.push(professor_id); }
        
        if (campos.length === 0) {
          return { sucesso: false, mensagem: 'Nenhum campo para atualizar' };
        }
        
        valores.push(id);
        const query = `UPDATE turmas SET ${campos.join(', ')} WHERE id = ?`;
        
        await connection.execute(query, valores);
        this.log('atualizar', 'success', `Turma ${id} atualizada`);
        return { sucesso: true, mensagem: 'Turma atualizada com sucesso' };
      }),
      () => ({ sucesso: true, mensagem: 'Turma atualizada com sucesso' })
    );
  }

  // Listar turmas por instituição
  static async listarPorInstituicao(instituicao_id) {
    return this.executeWithFallback(
      () => this.withConnection(async (connection) => {
        const [rows] = await connection.execute(
          'SELECT * FROM turmas WHERE instituicao_id = ?',
          [instituicao_id]
        );
        return rows;
      }),
      () => mockdb.turmas.filter(t => t.instituicao_id === parseInt(instituicao_id))
    );
  }

  // Listar todas as turmas
  static async listarTodos() {
    return this.executeWithFallback(
      () => this.withConnection(async (connection) => {
        const [rows] = await connection.execute('SELECT * FROM turmas');
        return rows;
      }),
      () => mockdb.turmas
    );
  }
}

module.exports = Turma;
