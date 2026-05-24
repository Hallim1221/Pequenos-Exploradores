const pool = require('../config/database');
const mockdb = require('../lib/mockdb');

class Opcao {
  static useMock = false;

  // Criar nova opção
  static async criar(pergunta_id, texto, correta = false) {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        'INSERT INTO opcoes (pergunta_id, texto, correta) VALUES (?, ?, ?)',
        [pergunta_id, texto, correta ? 1 : 0]
      );
      connection.release();
      return { id: result.insertId, pergunta_id, texto };
    } catch (erro) {
      this.useMock = true;
      return mockdb.criarOpcao(pergunta_id, texto, correta);
    }
  }

  // Buscar opção por ID
  static async buscarPorId(id) {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM opcoes WHERE id = ?',
        [id]
      );
      connection.release();
      return rows[0] || null;
    } catch (erro) {
      this.useMock = true;
      return mockdb.buscarOpcaoPorId(id);
    }
  }

  // Listar opções de uma pergunta
  static async listarPorPergunta(pergunta_id) {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM opcoes WHERE pergunta_id = ?',
        [pergunta_id]
      );
      connection.release();
      return rows;
    } catch (erro) {
      this.useMock = true;
      return mockdb.listarOpcoesPorPergunta(pergunta_id);
    }
  }

  // Deletar opção
  static async deletar(id) {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      await connection.execute('DELETE FROM opcoes WHERE id = ?', [id]);
      connection.release();
      return true;
    } catch (erro) {
      this.useMock = true;
      return mockdb.deletarOpcao(id);
    }
  }
}

module.exports = Opcao;
