const pool = require('../config/database');
const mockdb = require('../lib/mockdb');

class Premium {
  static schemaReady = false;

  static async ensureTables(connection) {
    if (this.schemaReady) return;
    await connection.query(`
      CREATE TABLE IF NOT EXISTS premium_game_plays (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        token CHAR(36) NOT NULL UNIQUE,
        aluno_id INT NOT NULL,
        jogo_slug VARCHAR(100) NOT NULL,
        jogo_nome VARCHAR(150) NOT NULL,
        pontos INT NOT NULL DEFAULT 0,
        status VARCHAR(20) NOT NULL,
        resultado VARCHAR(255) NULL,
        created_at DATETIME NOT NULL,
        INDEX idx_premium_plays_aluno_data (aluno_id, created_at),
        INDEX idx_premium_plays_aluno_jogo_data (aluno_id, jogo_slug, created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    await connection.query(`
      CREATE TABLE IF NOT EXISTS premium_chat_messages (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        turma_id INT NOT NULL,
        remetente_id INT NOT NULL,
        destinatario_id INT NULL,
        conteudo VARCHAR(500) NOT NULL,
        created_at DATETIME NOT NULL,
        INDEX idx_premium_chat_group (turma_id, destinatario_id, id),
        INDEX idx_premium_chat_direct (remetente_id, destinatario_id, id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    this.schemaReady = true;
  }

  static async listarPartidas(alunoId) {
    let connection;
    try {
      connection = await pool.getConnection();
      await this.ensureTables(connection);
      const [rows] = await connection.execute(
        'SELECT id, token, aluno_id, jogo_slug AS slug, jogo_nome AS nome, pontos, status, resultado, created_at AS em FROM premium_game_plays WHERE aluno_id = ? ORDER BY created_at ASC, id ASC',
        [alunoId]
      );
      return rows;
    } catch (error) {
      return mockdb.premiumPartidas.filter(play => Number(play.aluno_id) === Number(alunoId));
    } finally {
      if (connection) connection.release();
    }
  }

  static async contarPartidasHoje(alunoId, slug, hoje) {
    const partidas = await this.listarPartidas(alunoId);
    return partidas.filter(play => {
      const data = new Date(play.em || play.created_at);
      return play.slug === slug && data.toISOString().slice(0, 10) === hoje;
    }).length;
  }

  static async registrarPartida(play) {
    let connection;
    try {
      connection = await pool.getConnection();
      await this.ensureTables(connection);
      await connection.beginTransaction();
      const [existing] = await connection.execute(
        'SELECT id, token, aluno_id, jogo_slug AS slug, jogo_nome AS nome, pontos, status, resultado, created_at AS em FROM premium_game_plays WHERE token = ? FOR UPDATE',
        [play.token]
      );
      if (existing.length) {
        await connection.rollback();
        return { duplicate: true, play: existing[0] };
      }
      await connection.execute(
        'INSERT INTO premium_game_plays (token, aluno_id, jogo_slug, jogo_nome, pontos, status, resultado, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [play.token, play.aluno_id, play.slug, play.nome, play.pontos, play.status, play.resultado, play.em]
      );
      await connection.execute('UPDATE alunos SET saldo = COALESCE(saldo, 0) + ? WHERE id = ?', [play.pontos, play.aluno_id]);
      const [students] = await connection.execute('SELECT saldo FROM alunos WHERE id = ?', [play.aluno_id]);
      await connection.commit();
      return { duplicate: false, play, saldo: Number(students[0]?.saldo) || 0 };
    } catch (error) {
      if (connection) {
        try { await connection.rollback(); } catch (rollbackError) {}
      }
      const existing = mockdb.premiumPartidas.find(item => item.token === play.token);
      if (existing) return { duplicate: true, play: existing };
      mockdb.premiumPartidas.push(play);
      const aluno = mockdb.alunos.find(item => Number(item.id) === Number(play.aluno_id));
      if (aluno) aluno.saldo = (Number(aluno.saldo) || 0) + Number(play.pontos || 0);
      return { duplicate: false, play, saldo: Number(aluno?.saldo) || 0 };
    } finally {
      if (connection) connection.release();
    }
  }

  static async listarMensagens({ turmaId, alunoId, conversa, depoisDe = 0 }) {
    let connection;
    try {
      connection = await pool.getConnection();
      await this.ensureTables(connection);
      let rows;
      if (conversa === 'geral') {
        [rows] = await connection.execute(
          `SELECT m.id, m.conteudo, m.created_at AS criado_em, m.remetente_id AS remetente_aluno_id,
                  a.nome AS remetente_nome, (m.remetente_id = ?) AS minha
           FROM premium_chat_messages m JOIN alunos a ON a.id = m.remetente_id
           WHERE m.turma_id = ? AND m.destinatario_id IS NULL AND m.id > ? ORDER BY m.id ASC LIMIT 200`,
          [alunoId, turmaId, depoisDe]
        );
      } else {
        const contatoId = Number(conversa);
        [rows] = await connection.execute(
          `SELECT m.id, m.conteudo, m.created_at AS criado_em, m.remetente_id AS remetente_aluno_id,
                  a.nome AS remetente_nome, (m.remetente_id = ?) AS minha
           FROM premium_chat_messages m JOIN alunos a ON a.id = m.remetente_id
           WHERE m.turma_id = ? AND m.id > ? AND ((m.remetente_id = ? AND m.destinatario_id = ?) OR (m.remetente_id = ? AND m.destinatario_id = ?))
           ORDER BY m.id ASC LIMIT 200`,
          [alunoId, turmaId, depoisDe, alunoId, contatoId, contatoId, alunoId]
        );
      }
      return rows.map(row => ({ ...row, minha: Boolean(row.minha) }));
    } catch (error) {
      return mockdb.premiumMensagens
        .filter(message => Number(message.turma_id) === Number(turmaId) && Number(message.id) > Number(depoisDe))
        .filter(message => conversa === 'geral'
          ? message.destinatario_id == null
          : ((Number(message.remetente_id) === Number(alunoId) && Number(message.destinatario_id) === Number(conversa)) || (Number(message.remetente_id) === Number(conversa) && Number(message.destinatario_id) === Number(alunoId))))
        .map(message => {
          const sender = mockdb.alunos.find(student => Number(student.id) === Number(message.remetente_id));
          return { ...message, remetente_aluno_id: message.remetente_id, remetente_nome: sender?.nome || 'Aluno', minha: Number(message.remetente_id) === Number(alunoId) };
        });
    } finally {
      if (connection) connection.release();
    }
  }

  static async enviarMensagem(message) {
    let connection;
    try {
      connection = await pool.getConnection();
      await this.ensureTables(connection);
      const [result] = await connection.execute(
        'INSERT INTO premium_chat_messages (turma_id, remetente_id, destinatario_id, conteudo, created_at) VALUES (?, ?, ?, ?, ?)',
        [message.turma_id, message.remetente_id, message.destinatario_id, message.conteudo, message.created_at]
      );
      return { ...message, id: result.insertId };
    } catch (error) {
      const saved = { ...message, id: mockdb.nextPremiumMessageId++ };
      mockdb.premiumMensagens.push(saved);
      return saved;
    } finally {
      if (connection) connection.release();
    }
  }

  static async contarMensagensHoje(turmaId) {
    if (!turmaId) return 0;
    let connection;
    try {
      connection = await pool.getConnection();
      await this.ensureTables(connection);
      const [rows] = await connection.execute(
        'SELECT COUNT(*) AS total FROM premium_chat_messages WHERE turma_id = ? AND created_at >= CURDATE()',
        [turmaId]
      );
      return Number(rows[0]?.total) || 0;
    } catch (error) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      return mockdb.premiumMensagens.filter(message => Number(message.turma_id) === Number(turmaId) && new Date(message.created_at).getTime() >= startOfDay.getTime()).length;
    } finally {
      if (connection) connection.release();
    }
  }
}

module.exports = Premium;
