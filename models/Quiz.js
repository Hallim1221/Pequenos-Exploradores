const pool = require('../config/database');

class Quiz {
  // Criar novo quiz
  static async criar(titulo, tema, tipo_ambiente = null) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        'INSERT INTO quizzes (titulo, tema, tipo_ambiente) VALUES (?, ?, ?)',
        [titulo, tema, tipo_ambiente]
      );
      return { id: result.insertId, titulo, tema };
    } finally {
      connection.release();
    }
  }

  // Buscar quiz por ID com perguntas
  static async buscarPorId(id) {
    const connection = await pool.getConnection();
    try {
      const [quiz] = await connection.execute(
        'SELECT * FROM quizzes WHERE id = ?',
        [id]
      );
      
      const [perguntas] = await connection.execute(
        'SELECT * FROM perguntas WHERE quiz_id = ?',
        [id]
      );
      
      return { ...quiz[0], perguntas };
    } finally {
      connection.release();
    }
  }

  // Listar todos os quizzes
  static async listarTodos() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute('SELECT * FROM quizzes');
      return rows;
    } finally {
      connection.release();
    }
  }

  // Listar quizzes por tema
  static async listarPorTema(tema) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM quizzes WHERE tema = ?',
        [tema]
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  // Deletar quiz
  static async deletar(id) {
    const connection = await pool.getConnection();
    try {
      await connection.execute('DELETE FROM quizzes WHERE id = ?', [id]);
      return true;
    } finally {
      connection.release();
    }
  }
}

module.exports = Quiz;
