const pool = require('../config/database');
const mockdb = require('../lib/mockdb');

class Parceria {
  static useMock = false;

  // Criar nova solicitação de parceria
  static async criar(dados) {
    const { nome_contato, email, telefone, cidade, nome_escola, cargo, tipo_escola, codigo_mec, senha_gestao, confirmar_senha_gestao } = dados;

    try {
      const connection = await pool.getConnection();
      
      // Obter a próxima parceria para gerar ID
      let parceriaId = null;
      
      const [result] = await connection.execute(
        `INSERT INTO parcerias_escolas 
         (nome_contato, email, telefone, cidade, nome_escola, cargo, tipo_escola, codigo_mec, senha_gestao, data_solicitacao, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 'pendente')`,
        [nome_contato, email, telefone, cidade, nome_escola, cargo, tipo_escola, codigo_mec || null, senha_gestao]
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
      return mockdb.criarParceria(dados);
    }
  }

  // Buscar parceria por ID
  static async buscarPorId(id) {
    try {
      const connection = await pool.getConnection();
      
      const [rows] = await connection.execute(
        'SELECT * FROM parcerias_escolas WHERE id = ?',
        [id]
      );
      
      connection.release();
      return rows[0] || null;
    } catch (erro) {
      console.error('Erro ao buscar parceria no MySQL:', erro.message);
      return mockdb.buscarParceriaPorId(id);
    }
  }

  // Buscar parceria por email
  static async buscarPorEmail(email) {
    try {
      const connection = await pool.getConnection();
      
      const [rows] = await connection.execute(
        'SELECT * FROM parcerias_escolas WHERE email = ?',
        [email]
      );
      
      connection.release();
      return rows[0] || null;
    } catch (erro) {
      console.error('Erro ao buscar parceria por email no MySQL:', erro.message);
      return mockdb.buscarParceriaPorEmail(email);
    }
  }

  // Listar todas as parcerias
  static async listarTodas() {
    try {
      const connection = await pool.getConnection();
      
      const [rows] = await connection.execute(
        'SELECT * FROM parcerias_escolas ORDER BY data_solicitacao DESC'
      );
      
      connection.release();
      return rows || [];
    } catch (erro) {
      console.error('Erro ao listar parcerias no MySQL:', erro.message);
      return mockdb.listarParcerias();
    }
  }

  // Atualizar status de uma parceria
  static async atualizarStatus(id, status) {
    try {
      const connection = await pool.getConnection();
      
      const [result] = await connection.execute(
        'UPDATE parcerias_escolas SET status = ? WHERE id = ?',
        [status, id]
      );
      
      connection.release();
      return result.affectedRows > 0;
    } catch (erro) {
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

    if (!dados.senha_gestao || dados.senha_gestao.length < 8) {
      erros.push('Senha deve ter pelo menos 8 caracteres');
    }

    if (dados.senha_gestao !== dados.confirmar_senha_gestao) {
      erros.push('As senhas não correspondem');
    }

    return { valido: erros.length === 0, erros };
  }

  // Criar mensagem associada à parceria
  static async criarMensagemParceria(parceriaId, conteudo, remetente = 'admin') {
    const fs = require('fs');
    fs.appendFileSync('./debug-msg.log', `\n📝 criarMensagemParceria: id=${parceriaId}, type=${typeof parceriaId}\n`);
    
    try {
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
      const msg = mockdb.criarMensagemParceria(parceriaId, conteudo, remetente);
      fs.appendFileSync('./debug-msg.log', `✅ MockDB: ${JSON.stringify(msg)}\n`);
      return msg;
    }
  }

  // Listar mensagens de uma parceria
  static async listarMensagensParcerias(parceriaId) {
    console.log(`📨 listarMensagensParcerias chamado: parceriaId=${parceriaId} (type=${typeof parceriaId})`);
    
    try {
      const connection = await pool.getConnection();
      
      const [rows] = await connection.execute(
        'SELECT * FROM mensagens_parcerias WHERE parceria_id = ? ORDER BY data_mensagem ASC',
        [parceriaId]
      );
      
      connection.release();
      console.log(`  -> Mensagens do MySQL: ${rows?.length || 0}`);
      return rows || [];
    } catch (erro) {
      const msgs = mockdb.listarMensagensParcerias(parceriaId);
      console.log(`  -> Mensagens do MockDB: ${msgs?.length || 0}`, msgs.map(m => ({ id: m.id, remetente: m.remetente })));
      return msgs;
    }
  }

  // Marcar mensagens como visualizadas
  static async marcarMensagensComoVisualizadas(parceriaId) {
    console.log(`👁️ Marcando mensagens como visualizadas para parceria ${parceriaId}`);
    
    try {
      const connection = await pool.getConnection();
      
      const [result] = await connection.execute(
        'UPDATE mensagens_parcerias SET visualizado = 1 WHERE parceria_id = ?',
        [parceriaId]
      );
      
      connection.release();
      console.log(`  ✅ ${result.affectedRows} mensagens marcadas como visualizadas`);
      return true;
    } catch (erro) {
      console.error('Erro ao marcar como visualizadas:', erro.message);
      console.log(`  📌 Usando mockdb para marcar..`);
      mockdb.marcarMensagensComoVisualizadas(parceriaId);
      return true;
    }
  }

  // Marcar uma mensagem específica como lida
  static async marcarMensagemComoLida(mensagemId) {
    console.log(`👁️ Marcando mensagem ${mensagemId} como lida`);
    
    try {
      const connection = await pool.getConnection();
      
      const [result] = await connection.execute(
        'UPDATE mensagens_parcerias SET visualizado = 1 WHERE id = ?',
        [mensagemId]
      );
      
      connection.release();
      console.log(`  ✅ Mensagem marcada como visualizada`);
      return result.affectedRows > 0;
    } catch (erro) {
      console.error('Erro ao marcar mensagem como lida:', erro.message);
      console.log(`  📌 Usando mockdb para marcar..`);
      return mockdb.marcarMensagemComoLida(mensagemId);
    }
  }

  // Atualizar plano de uma instituição
  static async atualizarPlano(parceriaId, novoPlano) {
    try {
      const connection = await pool.getConnection();
      
      const [result] = await connection.execute(
        'UPDATE parcerias_escolas SET plano = ? WHERE id = ?',
        [novoPlano, parceriaId]
      );
      
      connection.release();
      
      if (result.affectedRows === 0) {
        return { sucesso: false, erro: 'Instituição não encontrada' };
      }
      
      console.log(`✅ Plano da instituição ${parceriaId} atualizado para ${novoPlano}`);
      return { sucesso: true, mensagem: `Plano atualizado para ${novoPlano}` };
    } catch (erro) {
      console.error('Erro ao atualizar plano:', erro);
      // Fallback para mockdb
      const resultado = mockdb.atualizarPlanoParceria(parceriaId, novoPlano);
      if (resultado) {
        console.log(`✅ MockDB: Plano da instituição ${parceriaId} atualizado para ${novoPlano}`);
        return { sucesso: true, mensagem: `Plano atualizado para ${novoPlano}` };
      }
      return { sucesso: false, erro: 'Erro ao atualizar plano' };
    }
  }

  // Deletar instituição
  static async deletar(id) {
    try {
      const connection = await pool.getConnection();
      
      const [result] = await connection.execute(
        'DELETE FROM parcerias_escolas WHERE id = ?',
        [id]
      );
      
      connection.release();
      
      if (result.affectedRows > 0) {
        console.log(`✅ Instituição ${id} deletada com sucesso`);
        return true;
      }
      return false;
    } catch (erro) {
      console.error('Erro ao deletar instituição:', erro);
      return mockdb.deletarInstituicao(id);
    }
  }
}

module.exports = Parceria;
