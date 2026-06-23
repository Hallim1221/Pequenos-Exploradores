const pool = require('../config/database');
const mockdb = require('../lib/mockdb');
const Seguranca = require('../lib/seguranca');

class Aluno {
  static useMock = false;

  // Criar novo aluno
  static async criar(nome, email, senha, turma_id = null, instituicao_id = null) {
    try {
      if (this.useMock) throw new Error('Using mock');
      
      // Hash da senha
      const senhaHash = await Seguranca.hashSenha(senha);
      
      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        'INSERT INTO alunos (nome, email, senha, saldo, instituicao_id, turma_id) VALUES (?, ?, ?, ?, ?, ?)',
        [nome, email, senhaHash, 700, instituicao_id, turma_id]
      );
      connection.release();
      return { id: result.insertId, nome, email, instituicao_id, turma_id };
    } catch (erro) {
      // Usar mock se BD falhar
      this.useMock = true;
      return mockdb.criarAluno(nome, email, senha, turma_id, instituicao_id);
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

  // Verificar se a senha está correta (usa bcrypt)
  static async verificarSenha(email, senha) {
    try {
      const aluno = await this.buscarPorEmail(email);
      if (!aluno) {
        return false;
      }
      
      // Se a senha armazenada começa com $2, é um hash bcrypt
      if (aluno.senha && aluno.senha.startsWith('$2')) {
        // Comparar com bcrypt
        const senhaValida = await Seguranca.verificarSenha(senha, aluno.senha);
        return senhaValida;
      } else {
        // Se é texto plano (mockdb), comparar direto
        return aluno.senha === senha;
      }
    } catch (erro) {
      console.error('Erro ao verificar senha:', erro);
      return false;
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

  // Buscar o plano da escola/instituição do aluno
  static async buscarPlanoEscola(aluno) {
    try {
      const Parceria = require('./Parceria');
      const instituicaoId = aluno.instituicao_id;
      
      if (!instituicaoId) {
        return 'comum';
      }

      const parceria = await Parceria.buscarPorId(instituicaoId);
      return (parceria && parceria.plano) ? parceria.plano : 'comum';
    } catch (erro) {
      console.error('Erro ao buscar plano:', erro);
      return 'comum';
    }
  }

  // Atualizar dados do aluno
  static async atualizar(id, { nome, email, saldo, instituicao_id }) {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      
      // Construir query dinâmica baseado nos campos fornecidos
      const campos = [];
      const valores = [];
      
      if (nome !== undefined) { campos.push('nome = ?'); valores.push(nome); }
      if (email !== undefined) { campos.push('email = ?'); valores.push(email); }
      if (saldo !== undefined) { campos.push('saldo = ?'); valores.push(saldo); }
      if (instituicao_id !== undefined) { campos.push('instituicao_id = ?'); valores.push(instituicao_id); }
      
      if (campos.length === 0) {
        connection.release();
        return { sucesso: false, mensagem: 'Nenhum campo para atualizar' };
      }
      
      valores.push(id);
      const query = `UPDATE alunos SET ${campos.join(', ')} WHERE id = ?`;
      
      await connection.execute(query, valores);
      connection.release();
      
      return { sucesso: true, mensagem: 'Aluno atualizado com sucesso' };
    } catch (erro) {
      this.useMock = true;
      return mockdb.atualizarAluno(id, { nome, email, saldo, instituicao_id });
    }
  }

  // Atualizar turma do aluno (para entrar em turma)
  static async atualizarTurma(id, turma_id) {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      
      const [result] = await connection.execute(
        'UPDATE alunos SET turma_id = ? WHERE id = ?',
        [turma_id, id]
      );
      connection.release();
      
      return result.affectedRows > 0;
    } catch (erro) {
      this.useMock = true;
      return mockdb.atualizarTurmaAluno(id, turma_id);
    }
  }

  // Adicionar saldo (para recargas)
  static async adicionarSaldo(id, valor) {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        'UPDATE alunos SET saldo = saldo + ? WHERE id = ?',
        [valor, id]
      );
      connection.release();
      return { sucesso: true, mensagem: `Saldo adicionado: ${valor}`, linhasAfetadas: result.affectedRows };
    } catch (erro) {
      this.useMock = true;
      return mockdb.adicionarSaldoAluno(id, valor);
    }
  }

  // Subtrair saldo (para compras)
  static async subtrairSaldo(id, valor) {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      
      // Verificar se tem saldo suficiente
      const [rows] = await connection.execute(
        'SELECT saldo FROM alunos WHERE id = ?',
        [id]
      );
      
      if (!rows[0] || rows[0].saldo < valor) {
        connection.release();
        return { sucesso: false, mensagem: 'Saldo insuficiente' };
      }
      
      const [result] = await connection.execute(
        'UPDATE alunos SET saldo = saldo - ? WHERE id = ?',
        [valor, id]
      );
      connection.release();
      
      return { sucesso: true, mensagem: `Saldo subtraído: ${valor}`, linhasAfetadas: result.affectedRows };
    } catch (erro) {
      this.useMock = true;
      return mockdb.subtrairSaldoAluno(id, valor);
    }
  }

  // Listar alunos por instituição
  static async listarPorInstituicao(instituicao_id) {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM alunos WHERE instituicao_id = ? ORDER BY nome',
        [instituicao_id]
      );
      connection.release();
      return rows || [];
    } catch (erro) {
      this.useMock = true;
      return mockdb.listarAlunosPorInstituicao(instituicao_id);
    }
  }

  static async listarPorTurma(turma_id) {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM alunos WHERE turma_id = ? ORDER BY nome',
        [turma_id]
      );
      connection.release();
      return rows || [];
    } catch (erro) {
      this.useMock = true;
      return mockdb.listarAlunosPorTurma ? mockdb.listarAlunosPorTurma(turma_id) : [];
    }
  }
}

module.exports = Aluno;
