const pool = require('../config/database');

class Turma {
  // Criar nova turma
  static async criar(nome, professor_id, ano_escolar = null) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        'INSERT INTO turmas (nome, professor_id, ano_escolar) VALUES (?, ?, ?)',
        [nome, professor_id, ano_escolar]
      );
      return { id: result.insertId, nome, professor_id };
    } finally {
      connection.release();
    }
  }

  // Buscar turma por ID
  static async buscarPorId(id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM turmas WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } finally {
      connection.release();
    }
  }

  // Listar turmas de um professor
  static async listarPorProfessor(professor_id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM turmas WHERE professor_id = ?',
        [professor_id]
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  // Listar todos os alunos de uma turma
  static async listarAlunosDaTurma(turma_id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT a.* FROM alunos a JOIN turma_alunos ta ON a.id = ta.aluno_id WHERE ta.turma_id = ?',
        [turma_id]
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  // Adicionar aluno à turma
  static async adicionarAluno(turma_id, aluno_id) {
    const connection = await pool.getConnection();
    try {
      await connection.execute(
        'INSERT INTO turma_alunos (turma_id, aluno_id) VALUES (?, ?)',
        [turma_id, aluno_id]
      );
      return true;
    } finally {
      connection.release();
    }
  }

  // Deletar turma
  static async deletar(id) {
    const connection = await pool.getConnection();
    try {
      await connection.execute('DELETE FROM turmas WHERE id = ?', [id]);
      return true;
    } finally {
      connection.release();
    }
  }
}

module.exports = Turma;
