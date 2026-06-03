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
    const msg1 = `VALIDAR: ${email}`;
    console.log(`\n🔐 Gestao.validarCredenciais chamado: ${email}`);
    console.log(`   useMock STATE: ${this.useMock}`);
    
    try {
      if (this.useMock) {
        console.log(`   ⚠️ useMock está TRUE, pulando BD e indo direto para mockdb`);
        throw new Error('Using mock');
      }
      
      console.log(`   📡 Tentando conexão com BD real...`);
      const connection = await pool.getConnection();
      console.log(`   ✅ Conexão BD obtida`);
      
      // Tentar validar contra gestores
      const [gestores] = await connection.execute(
        'SELECT * FROM gestores WHERE email = ?',
        [email]
      );
      
      console.log(`   📊 Resultado SELECT gestores: ${gestores.length} linhas`);
      
      if (gestores.length > 0) {
        console.log(`🔍 Gestor encontrado: ${email}`);
        const senhaValida = await Seguranca.verificarSenha(senha, gestores[0].senha);
        if (senhaValida) {
          console.log(`✅ Senha válida para gestor: ${email}`);
          connection.release();
          return gestores[0];
        } else {
          console.log(`❌ Senha inválida para gestor: ${email}`);
        }
      }
      
      // Se não encontrou gestor, tentar validar contra parcerias (escolas)
      const [parcerias] = await connection.execute(
        'SELECT * FROM parcerias_escolas WHERE email = ?',
        [email]
      );
      
      console.log(`   📊 Resultado SELECT parcerias_escolas: ${parcerias.length} linhas`);
      
      if (parcerias.length > 0) {
        console.log(`🔍 Parceria encontrada: ${email}`);
        const senhaValida = await Seguranca.verificarSenha(senha, parcerias[0].senha_gestao || '');
        if (senhaValida) {
          console.log(`✅ Senha válida para parceria: ${email}`);
          connection.release();
          return parcerias[0];
        } else {
          console.log(`❌ Senha inválida para parceria: ${email}`);
        }
      }
      
      console.log(`❌ Email não encontrado em gestores ou parcerias: ${email}`);
      connection.release();
      return null;
    } catch (erro) {
      console.error(`❌ Erro ao validar credenciais (BD falhou): ${erro.message}`);
      console.log(`   📱 Tentando usar mockdb...`);
      
      this.useMock = true;
      
      // IMPORTANTE: usar await porque validarGestor é async agora
      const resultado = await mockdb.validarGestor(email, senha);
      console.log(`   mockdb resultado: ${resultado ? 'SIM' : 'NÃO'}`);
      return resultado;
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
