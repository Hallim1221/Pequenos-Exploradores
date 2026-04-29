const pool = require('../config/database');

class Opcao {
  // Criar nova opção
  static async criar(pergunta_id, texto, correta = false) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        'INSERT INTO opcoes (pergunta_id, texto, correta) VALUES (?, ?, ?)',
        [pergunta_id, texto, correta ? 1 : 0]
      );
      return { id: result.insertId, pergunta_id, texto };
    } finally {
      connection.release();
    }
  }

  // Buscar opção por ID
  static async buscarPorId(id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM opcoes WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } finally {
      connection.release();
    }
  }

  // Listar opções de uma pergunta
  static async listarPorPergunta(pergunta_id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM opcoes WHERE pergunta_id = ?',
        [pergunta_id]
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  // Deletar opção
  static async deletar(id) {
    const connection = await pool.getConnection();
    try {
      await connection.execute('DELETE FROM opcoes WHERE id = ?', [id]);
      return true;
    } finally {
      connection.release();
    }
  }
}

module.exports = Opcao;
