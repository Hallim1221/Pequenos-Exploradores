const BaseModel = require('./BaseModel');
const mockdb = require('../lib/mockdb');

class Turma extends BaseModel {
  static useMock = false;

  // Criar nova turma
  static async criar(nome, professor_id, ano_escolar = null) {
    return this.executeWithFallback(
      () => this.withConnection(async (connection) => {
        const [result] = await connection.execute(
          'INSERT INTO turmas (nome, professor_id, ano_escolar) VALUES (?, ?, ?)',
          [nome, professor_id, ano_escolar]
        );
        this.log('criar', 'success', `Turma ${nome} criada`);
        return { id: result.insertId, nome, professor_id };
      }),
      () => mockdb.criarTurma ? mockdb.criarTurma(nome, professor_id, ano_escolar) : { id: Date.now(), nome, professor_id }
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

  // Listar turmas de um professor
  static async listarPorProfessor(professor_id) {
    return this.executeWithFallback(
      () => this.withConnection(async (connection) => {
        const [rows] = await connection.execute(
          'SELECT * FROM turmas WHERE professor_id = ?',
          [professor_id]
        );
        return rows;
      }),
      () => mockdb.turmas.filter(t => t.professor_id === parseInt(professor_id))
    );
  }

  // Listar todos os alunos de uma turma
  static async listarAlunosDaTurma(turma_id) {
    return this.executeWithFallback(
      () => this.withConnection(async (connection) => {
        const [rows] = await connection.execute(
          'SELECT a.* FROM alunos a JOIN turma_alunos ta ON a.id = ta.aluno_id WHERE ta.turma_id = ?',
          [turma_id]
        );
        return rows;
      }),
      () => []
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
    return this.executeWithFallback(
      () => this.withConnection(async (connection) => {
        await connection.execute('DELETE FROM turmas WHERE id = ?', [id]);
        this.log('deletar', 'success', `Turma ${id} deletada`);
        return true;
      }),
      () => true
    );
  }
}

module.exports = Turma;
