const pool = require('../config/database');
const mockdb = require('../lib/mockdb');

class Professor {
  static useMock = false;

  // Criar novo professor
  static async criar(nome, email, senha, instituicao = null) {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        'INSERT INTO professores (nome, email, senha, instituicao) VALUES (?, ?, ?, ?)',
        [nome, email, senha, instituicao]
      );
      connection.release();
      return { id: result.insertId, nome, email };
    } catch (erro) {
      this.useMock = true;
      return mockdb.criarProfessor(nome, email, senha, instituicao);
    }
  }

  // Buscar professor por ID
  static async buscarPorId(id) {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM professores WHERE id = ?',
        [id]
      );
      connection.release();
      return rows[0] || null;
    } catch (erro) {
      this.useMock = true;
      const prof = mockdb.professores.find(p => p.id === parseInt(id));
      return prof || null;
    }
  }

  // Buscar professor por email
  static async buscarPorEmail(email) {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM professores WHERE email = ?',
        [email]
      );
      connection.release();
      return rows[0] || null;
    } catch (erro) {
      this.useMock = true;
      return mockdb.buscarProfessorPorEmail(email);
    }
  }

  // Listar todos os professores
  static async listarTodos() {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      const [rows] = await connection.execute('SELECT * FROM professores');
      connection.release();
      return rows;
    } catch (erro) {
      this.useMock = true;
      return mockdb.listarProfessores();
    }
  }

  // Deletar professor
  static async deletar(id) {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      await connection.execute('DELETE FROM professores WHERE id = ?', [id]);
      connection.release();
      return true;
    } catch (erro) {
      this.useMock = true;
      mockdb.professores = mockdb.professores.filter(p => p.id !== parseInt(id));
      return true;
    }
  }
}

module.exports = Professor;
