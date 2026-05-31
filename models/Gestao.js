const pool = require('../config/database');
const mockdb = require('../lib/mockdb');
const Parceria = require('./Parceria');
const Seguranca = require('../lib/seguranca');

class Gestao {
  static useMock = false;

  // Criar novo gestor
  static async criar(nome, email, senha, instituicao_id = null) {
    try {
      if (this.useMock) throw new Error('Using mock');
      
      // Hash da senha
      const senhaHash = await Seguranca.hashSenha(senha);
      
      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        'INSERT INTO gestores (nome, email, senha, instituicao_id) VALUES (?, ?, ?, ?)',
        [nome, email, senhaHash, instituicao_id]
      );
      connection.release();
      return { id: result.insertId, nome, email };
    } catch (erro) {
      this.useMock = true;
      return mockdb.criarGestor(nome, email, senha);
    }
  }

  // Buscar gestor por ID
  static async buscarPorId(id) {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM gestores WHERE id = ?',
        [id]
      );
      connection.release();
      return rows[0] || null;
    } catch (erro) {
      this.useMock = true;
      return mockdb.buscarGestorPorId(id);
    }
  }

  // Buscar gestor por email
  static async buscarPorEmail(email) {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM gestores WHERE email = ?',
        [email]
      );
      connection.release();
      return rows[0] || null;
    } catch (erro) {
      this.useMock = true;
      return mockdb.buscarGestorPorEmail(email);
    }
  }

  // Validar credenciais (usa bcrypt)
  static async validarCredenciais(email, senha) {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      
      // Tentar validar contra gestores
      const [gestores] = await connection.execute(
        'SELECT * FROM gestores WHERE email = ?',
        [email]
      );
      
      if (gestores.length > 0) {
        const senhaValida = await Seguranca.verificarSenha(senha, gestores[0].senha);
        if (senhaValida) {
          connection.release();
          return gestores[0];
        }
      }
      
      // Se não encontrou gestor, tentar validar contra parcerias (escolas)
      const [parcerias] = await connection.execute(
        'SELECT * FROM parcerias_escolas WHERE email = ?',
        [email]
      );
      
      if (parcerias.length > 0) {
        const senhaValida = await Seguranca.verificarSenha(senha, parcerias[0].senha_gestao || '');
        if (senhaValida) {
          connection.release();
          return parcerias[0];
        }
      }
      
      connection.release();
      return null;
    } catch (erro) {
      this.useMock = true;
      return mockdb.validarGestor(email, senha);
    }
  }

  // Listar todos os gestores
  static async listarTodos() {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      const [rows] = await connection.execute('SELECT id, nome, email, instituicao_id FROM gestores');
      connection.release();
      return rows || [];
    } catch (erro) {
      this.useMock = true;
      return mockdb.listarGestores();
    }
  }

  // Atualizar gestor
  static async atualizar(id, nome, email) {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      await connection.execute(
        'UPDATE gestores SET nome = ?, email = ? WHERE id = ?',
        [nome, email, id]
      );
      connection.release();
      return true;
    } catch (erro) {
      this.useMock = true;
      return mockdb.atualizarGestor(id, nome, email);
    }
  }

  // Deletar gestor
  static async deletar(id) {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      await connection.execute('DELETE FROM gestores WHERE id = ?', [id]);
      connection.release();
      return true;
    } catch (erro) {
      this.useMock = true;
      return mockdb.deletarGestor(id);
    }
  }
}

module.exports = Gestao;
