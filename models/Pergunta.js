const pool = require('../config/database');

class Pergunta {
  // Criar nova pergunta
  static async criar(quiz_id, enunciado, tipo = 'multipla_escolha') {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        'INSERT INTO perguntas (quiz_id, enunciado, tipo) VALUES (?, ?, ?)',
        [quiz_id, enunciado, tipo]
      );
      return { id: result.insertId, quiz_id, enunciado };
    } finally {
      connection.release();
    }
  }

  // Buscar pergunta por ID com opções
  static async buscarPorId(id) {
    const connection = await pool.getConnection();
    try {
      const [pergunta] = await connection.execute(
        'SELECT * FROM perguntas WHERE id = ?',
        [id]
      );
      
      const [opcoes] = await connection.execute(
        'SELECT * FROM opcoes WHERE pergunta_id = ?',
        [id]
      );
      
      return { ...pergunta[0], opcoes };
    } finally {
      connection.release();
    }
  }

  // Listar perguntas de um quiz
  static async listarPorQuiz(quiz_id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM perguntas WHERE quiz_id = ?',
        [quiz_id]
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  // Deletar pergunta
  static async deletar(id) {
    const connection = await pool.getConnection();
    try {
      await connection.execute('DELETE FROM perguntas WHERE id = ?', [id]);
      return true;
    } finally {
      connection.release();
    }
  }
}

module.exports = Pergunta;
