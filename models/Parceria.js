const pool = require('../config/database');
const mockdb = require('../lib/mockdb');

class Parceria {
  static useMock = false;

  // Criar nova solicitação de parceria
  static async criar(dados) {
    const { nome_contato, email, telefone, cidade, nome_escola, cargo, tipo_escola, codigo_mec } = dados;

    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      
      // Obter a próxima parceria para gerar ID
      let parceriaId = null;
      
      const [result] = await connection.execute(
        `INSERT INTO parcerias_escolas 
         (nome_contato, email, telefone, cidade, nome_escola, cargo, tipo_escola, codigo_mec, data_solicitacao, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), 'pendente')`,
        [nome_contato, email, telefone, cidade, nome_escola, cargo, tipo_escola, codigo_mec || null]
      );
      
      parceriaId = result.insertId;
      
      // Criar mensagem inicial da parceria
      await connection.execute(
        `INSERT INTO mensagens_parcerias 
         (parceria_id, remetente, conteudo, data_mensagem) 
         VALUES (?, ?, ?, NOW())`,
        [parceriaId, 'admin', `Olá! Recebi a solicitação de parceria de ${nome_escola}. Em breve entraremos em contato.`]
      );
      
      connection.release();
      return { id: parceriaId, email, nome_escola, status: 'sucesso' };
    } catch (erro) {
      console.error('Erro ao criar parceria:', erro);
      this.useMock = true;
      return mockdb.criarParceria(dados);
    }
  }

  // Buscar parceria por ID
  static async buscarPorId(id) {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      
      const [rows] = await connection.execute(
        'SELECT * FROM parcerias_escolas WHERE id = ?',
        [id]
      );
      
      connection.release();
      return rows[0] || null;
    } catch (erro) {
      this.useMock = true;
      return mockdb.buscarParceriaPorId(id);
    }
  }

  // Buscar parceria por email
  static async buscarPorEmail(email) {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      
      const [rows] = await connection.execute(
        'SELECT * FROM parcerias_escolas WHERE email = ?',
        [email]
      );
      
      connection.release();
      return rows[0] || null;
    } catch (erro) {
      this.useMock = true;
      return mockdb.buscarParceriaPorEmail(email);
    }
  }

  // Listar todas as parcerias
  static async listarTodas() {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      
      const [rows] = await connection.execute(
        'SELECT * FROM parcerias_escolas ORDER BY data_solicitacao DESC'
      );
      
      connection.release();
      return rows || [];
    } catch (erro) {
      this.useMock = true;
      return mockdb.listarParcerias();
    }
  }

  // Atualizar status de uma parceria
  static async atualizarStatus(id, status) {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      
      const [result] = await connection.execute(
        'UPDATE parcerias_escolas SET status = ? WHERE id = ?',
        [status, id]
      );
      
      connection.release();
      return result.affectedRows > 0;
    } catch (erro) {
      this.useMock = true;
      return mockdb.atualizarStatusParceria(id, status);
    }
  }

  // Validar campos obrigatórios
  static validar(dados) {
    const erros = [];

    if (!dados.nome_contato || dados.nome_contato.trim().length < 3) {
      erros.push('Nome completo deve ter pelo menos 3 caracteres');
    }

    if (!dados.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) {
      erros.push('E-mail inválido');
    }

    if (!dados.telefone || dados.telefone.trim().length < 10) {
      erros.push('Telefone deve ter pelo menos 10 dígitos');
    }

    if (!dados.cidade || dados.cidade.trim().length < 2) {
      erros.push('Cidade é obrigatória');
    }

    if (!dados.nome_escola || dados.nome_escola.trim().length < 3) {
      erros.push('Nome da escola deve ter pelo menos 3 caracteres');
    }

    if (!dados.cargo || dados.cargo.trim().length === 0) {
      erros.push('Cargo é obrigatório');
    }

    if (!dados.tipo_escola || dados.tipo_escola.trim().length === 0) {
      erros.push('Tipo de escola é obrigatório');
    }

    return { valido: erros.length === 0, erros };
  }

  // Criar mensagem associada à parceria
  static async criarMensagemParceria(parceriaId, conteudo, remetente = 'admin') {
    const fs = require('fs');
    fs.appendFileSync('./debug-msg.log', `\n📝 criarMensagemParceria: id=${parceriaId}, type=${typeof parceriaId}\n`);
    
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      
      const [result] = await connection.execute(
        `INSERT INTO mensagens_parcerias (parceria_id, remetente, conteudo, data_mensagem) 
         VALUES (?, ?, ?, NOW())`,
        [parceriaId, remetente, conteudo]
      );
      
      connection.release();
      const msg = { id: result.insertId, parceria_id: parceriaId, conteudo, remetente, data_mensagem: new Date() };
      fs.appendFileSync('./debug-msg.log', `✅ MySQL: ${JSON.stringify(msg)}\n`);
      return msg;
    } catch (erro) {
      fs.appendFileSync('./debug-msg.log', `❌ MySQL error: ${erro.message}\n`);
      this.useMock = true;
      const msg = mockdb.criarMensagemParceria(parceriaId, conteudo, remetente);
      fs.appendFileSync('./debug-msg.log', `✅ MockDB: ${JSON.stringify(msg)}\n`);
      return msg;
    }
  }

  // Listar mensagens de uma parceria
  static async listarMensagensParcerias(parceriaId) {
    console.log(`📨 listarMensagensParcerias chamado: parceriaId=${parceriaId} (type=${typeof parceriaId}), useMock=${this.useMock}`);
    
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      
      const [rows] = await connection.execute(
        'SELECT * FROM mensagens_parcerias WHERE parceria_id = ? ORDER BY data_mensagem ASC',
        [parceriaId]
      );
      
      connection.release();
      console.log(`  -> Mensagens do MySQL: ${rows?.length || 0}`);
      return rows || [];
    } catch (erro) {
      this.useMock = true;
      const msgs = mockdb.listarMensagensParcerias(parceriaId);
      console.log(`  -> Mensagens do MockDB: ${msgs?.length || 0}`, msgs.map(m => ({ id: m.id, remetente: m.remetente })));
      return msgs;
    }
  }
}

module.exports = Parceria;
