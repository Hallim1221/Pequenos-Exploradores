const pool = require('../config/database');
const mockdb = require('../lib/mockdb');
const Seguranca = require('../lib/seguranca');

class Professor {
  static useMock = false;

  // Criar novo professor
  static async criar(nome, email, senha, instituicao_id = null, cargo = null) {
    try {
      if (this.useMock) throw new Error('Using mock');
      
      // Hash da senha
      const senhaHash = await Seguranca.hashSenha(senha);
      
      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        'INSERT INTO professores (nome, email, senha, instituicao_id, cargo) VALUES (?, ?, ?, ?, ?)',
        [nome, email, senhaHash, instituicao_id, cargo]
      );
      connection.release();
      return { id: result.insertId, nome, email, instituicao_id, cargo };
    } catch (erro) {
      this.useMock = true;
      return mockdb.criarProfessor(nome, email, senha, instituicao_id, cargo);
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

  // Verificar se a senha está correta (usa bcrypt)
  static async verificarSenha(email, senha) {
    try {
      const professor = await this.buscarPorEmail(email);
      if (!professor) {
        return false;
      }
      
      // Se a senha armazenada começa com $2, é um hash bcrypt
      if (professor.senha && professor.senha.startsWith('$2')) {
        // Comparar com bcrypt
        const senhaValida = await Seguranca.verificarSenha(senha, professor.senha);
        return senhaValida;
      } else {
        // Se é texto plano (mockdb), comparar direto (compatibilidade com dados antigos)
        return professor.senha === senha;
      }
    } catch (erro) {
      console.error('Erro ao verificar senha:', erro);
      return false;
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

  // Atualizar dados do professor
  static async atualizar(id, { nome, email, instituicao }) {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      
      const campos = [];
      const valores = [];
      
      if (nome !== undefined) { campos.push('nome = ?'); valores.push(nome); }
      if (email !== undefined) { campos.push('email = ?'); valores.push(email); }
      if (instituicao !== undefined) { campos.push('instituicao = ?'); valores.push(instituicao); }
      
      if (campos.length === 0) {
        connection.release();
        return { sucesso: false, mensagem: 'Nenhum campo para atualizar' };
      }
      
      valores.push(id);
      const query = `UPDATE professores SET ${campos.join(', ')} WHERE id = ?`;
      
      await connection.execute(query, valores);
      connection.release();
      
      return { sucesso: true, mensagem: 'Professor atualizado com sucesso' };
    } catch (erro) {
      this.useMock = true;
      mockdb.professores = mockdb.professores.map(p => 
        p.id === parseInt(id) 
          ? { ...p, nome: nome ?? p.nome, email: email ?? p.email, instituicao: instituicao ?? p.instituicao }
          : p
      );
      return { sucesso: true, mensagem: 'Professor atualizado com sucesso' };
    }
  }
}

module.exports = Professor;
