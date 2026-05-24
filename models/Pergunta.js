const BaseModel = require('./BaseModel');
const mockdb = require('../lib/mockdb');

class Pergunta extends BaseModel {
  static useMock = false;

  // Criar nova pergunta
  static async criar(quiz_id, enunciado, tipo = 'multipla_escolha') {
    return this.executeWithFallback(
      () => this.withConnection(async (connection) => {
        const [result] = await connection.execute(
          'INSERT INTO perguntas (quiz_id, enunciado, tipo) VALUES (?, ?, ?)',
          [quiz_id, enunciado, tipo]
        );
        this.log('criar', 'success', `Pergunta criada para quiz ${quiz_id}`);
        return { id: result.insertId, quiz_id, enunciado };
      }),
      () => ({ id: Date.now(), quiz_id, enunciado })
    );
  }

  // Buscar pergunta por ID com opções
  static async buscarPorId(id) {
    return this.executeWithFallback(
      () => this.withConnection(async (connection) => {
        const [pergunta] = await connection.execute(
          'SELECT * FROM perguntas WHERE id = ?',
          [id]
        );
        
        const [opcoes] = await connection.execute(
          'SELECT * FROM opcoes WHERE pergunta_id = ?',
          [id]
        );
        
        return pergunta[0] ? { ...pergunta[0], opcoes } : null;
      }),
      () => ({ id: id, opcoes: [] })
    );
  }

  // Listar perguntas de um quiz
  static async listarPorQuiz(quiz_id) {
    return this.executeWithFallback(
      () => this.withConnection(async (connection) => {
        const [rows] = await connection.execute(
          'SELECT * FROM perguntas WHERE quiz_id = ?',
          [quiz_id]
        );
        return rows;
      }),
      () => []
    );
  }

  // Deletar pergunta
  static async deletar(id) {
    return this.executeWithFallback(
      () => this.withConnection(async (connection) => {
        await connection.execute('DELETE FROM perguntas WHERE id = ?', [id]);
        this.log('deletar', 'success', `Pergunta ${id} deletada`);
        return true;
      }),
      () => true
    );
  }
}

module.exports = Pergunta;
