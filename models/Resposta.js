const pool = require('../config/database');
const mockdb = require('../lib/mockdb');

class Resposta {
  static useMock = false;

  // Salvar resposta de um aluno
  static async criar(aluno_id, pergunta_id, opcao_id, acertou = false) {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        'INSERT INTO respostas (aluno_id, pergunta_id, opcao_id, acertou) VALUES (?, ?, ?, ?)',
        [aluno_id, pergunta_id, opcao_id, acertou ? 1 : 0]
      );
      connection.release();
      return { id: result.insertId, aluno_id, pergunta_id };
    } catch (erro) {
      this.useMock = true;
      return mockdb.criarResposta(aluno_id, pergunta_id, opcao_id, acertou);
    }
  }

  // Buscar respostas de um aluno em um quiz
  static async buscarPorAlunoQuiz(aluno_id, quiz_id) {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
        `SELECT r.* FROM respostas r 
         JOIN perguntas p ON r.pergunta_id = p.id 
         WHERE r.aluno_id = ? AND p.quiz_id = ?`,
        [aluno_id, quiz_id]
      );
      connection.release();
      return rows;
    } catch (erro) {
      this.useMock = true;
      return mockdb.buscarRespostasPorAlunoQuiz(aluno_id, quiz_id);
    }
  }

  // Contar acertos de um aluno
  static async contarAcertos(aluno_id, quiz_id) {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
        `SELECT COUNT(*) as total FROM respostas r 
         JOIN perguntas p ON r.pergunta_id = p.id 
         WHERE r.aluno_id = ? AND p.quiz_id = ? AND r.acertou = 1`,
        [aluno_id, quiz_id]
      );
      connection.release();
      return rows[0].total;
    } catch (erro) {
      this.useMock = true;
      return mockdb.contarAcertos(aluno_id, quiz_id);
    }
  }
}

module.exports = Resposta;
