const pool = require('../config/database');
const mockdb = require('../lib/mockdb');

class Aluno {
  static useMock = false;

  // Criar novo aluno
  static async criar(nome, email, senha, data_nascimento = null) {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        'INSERT INTO alunos (nome, email, senha, data_nascimento, saldo) VALUES (?, ?, ?, ?, ?)',
        [nome, email, senha, data_nascimento, 700]
      );
      connection.release();
      return { id: result.insertId, nome, email };
    } catch (erro) {
      // Usar mock se BD falhar
      this.useMock = true;
      return mockdb.criarAluno(nome, email, senha);
    }
  }

  // Buscar aluno por ID
  static async buscarPorId(id) {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM alunos WHERE id = ?',
        [id]
      );
      connection.release();
      return rows[0] || null;
    } catch (erro) {
      this.useMock = true;
      return mockdb.buscarAlunoPorId(id);
    }
  }

  // Buscar aluno por email
  static async buscarPorEmail(email) {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM alunos WHERE email = ?',
        [email]
      );
      connection.release();
      return rows[0] || null;
    } catch (erro) {
      this.useMock = true;
      return mockdb.buscarAlunoPorEmail(email);
    }
  }

  // Listar todos os alunos
  static async listarTodos() {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      const [rows] = await connection.execute('SELECT * FROM alunos');
      connection.release();
      return rows;
    } catch (erro) {
      this.useMock = true;
      return mockdb.listarAlunos();
    }
  }

  // Atualizar saldo do aluno
  static async atualizarSaldo(id, saldo) {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      await connection.execute(
        'UPDATE alunos SET saldo = ? WHERE id = ?',
        [saldo, id]
      );
      connection.release();
      return true;
    } catch (erro) {
      this.useMock = true;
      return mockdb.atualizarSaldoAluno(id, saldo);
    }
  }

  // Deletar aluno
  static async deletar(id) {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      await connection.execute('DELETE FROM alunos WHERE id = ?', [id]);
      connection.release();
      return true;
    } catch (erro) {
      this.useMock = true;
      return mockdb.deletarAluno(id);
    }
  }
}

module.exports = Aluno;
