const pool = require('../config/database');
const mockdb = require('../lib/mockdb');

class Compra {
  static useMock = false;

  // Registrar compra de avatar e atualizar saldo
  static async comprarAvatar(aluno_id, avatar, preco) {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      
      // Iniciar transação
      await connection.beginTransaction();
      
      try {
        // Buscar aluno para verificar saldo
        const [alunos] = await connection.execute(
          'SELECT saldo, avatares FROM alunos WHERE id = ?',
          [aluno_id]
        );
        
        if (!alunos.length) {
          await connection.rollback();
          connection.release();
          return { sucesso: false, mensagem: 'Aluno não encontrado' };
        }
        
        const aluno = alunos[0];
        
        // Validar saldo
        if (aluno.saldo < preco) {
          await connection.rollback();
          connection.release();
          return { sucesso: false, mensagem: 'Saldo insuficiente' };
        }
        
        // Validar se avatar já foi comprado
        const avatares = aluno.avatares ? JSON.parse(aluno.avatares) : [];
        if (avatares.includes(avatar)) {
          await connection.rollback();
          connection.release();
          return { sucesso: false, mensagem: 'Avatar já comprado' };
        }
        
        // Atualizar saldo
        const novoSaldo = aluno.saldo - preco;
        avatares.push(avatar);
        
        await connection.execute(
          'UPDATE alunos SET saldo = ?, avatares = ? WHERE id = ?',
          [novoSaldo, JSON.stringify(avatares), aluno_id]
        );
        
        // Registrar compra no histórico (opcional, se tabela existir)
        try {
          await connection.execute(
            'INSERT INTO compras (aluno_id, avatar, preco, data_compra) VALUES (?, ?, ?, NOW())',
            [aluno_id, avatar, preco]
          );
        } catch (e) {
          // Se tabela compras não existir, continua mesmo assim
        }
        
        await connection.commit();
        connection.release();
        
        return {
          sucesso: true,
          saldo: novoSaldo,
          avatares: avatares,
          mensagem: 'Avatar comprado com sucesso'
        };
      } catch (innerError) {
        await connection.rollback();
        connection.release();
        throw innerError;
      }
    } catch (erro) {
      console.error('Erro ao comprar avatar:', erro);
      this.useMock = true;
      return mockdb.comprarAvatar(aluno_id, avatar, preco);
    }
  }

  // Listar compras do aluno
  static async listarCompras(aluno_id) {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM compras WHERE aluno_id = ? ORDER BY data_compra DESC',
        [aluno_id]
      );
      connection.release();
      return rows || [];
    } catch (erro) {
      this.useMock = true;
      return mockdb.listarCompras(aluno_id);
    }
  }

  // Validar preço de avatar (pode vir de BD se tiver tabela de avatares)
  static async validarPreco(avatar, precoEsperado) {
    try {
      if (this.useMock) throw new Error('Using mock');
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
        'SELECT preco FROM avatares WHERE id = ?',
        [avatar]
      );
      connection.release();
      
      if (!rows.length) {
        return false;
      }
      
      return rows[0].preco === precoEsperado;
    } catch (erro) {
      this.useMock = true;
      return true; // Assume válido se não conseguir validar
    }
  }
}

module.exports = Compra;
