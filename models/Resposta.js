const pool = require('../config/database');

class Resposta {
  // Salvar resposta de um aluno
  static async criar(aluno_id, pergunta_id, opcao_id, acertou = false) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        'INSERT INTO respostas (aluno_id, pergunta_id, opcao_id, acertou) VALUES (?, ?, ?, ?)',
        [aluno_id, pergunta_id, opcao_id, acertou ? 1 : 0]
      );
      return { id: result.insertId, aluno_id, pergunta_id };
    } finally {
      connection.release();
    }
  }

  // Buscar respostas de um aluno em um quiz
  static async buscarPorAlunoQuiz(aluno_id, quiz_id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT r.* FROM respostas r 
         JOIN perguntas p ON r.pergunta_id = p.id 
         WHERE r.aluno_id = ? AND p.quiz_id = ?`,
        [aluno_id, quiz_id]
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  // Contar acertos de um aluno
  static async contarAcertos(aluno_id, quiz_id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT COUNT(*) as total FROM respostas r 
         JOIN perguntas p ON r.pergunta_id = p.id 
         WHERE r.aluno_id = ? AND p.quiz_id = ? AND r.acertou = 1`,
        [aluno_id, quiz_id]
      );
      return rows[0].total;
    } finally {
      connection.release();
    }
  }
}

module.exports = Resposta;
