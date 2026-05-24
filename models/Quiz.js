const BaseModel = require('./BaseModel');
const mockdb = require('../lib/mockdb');

class Quiz extends BaseModel {
  static useMock = false;

  // Criar novo quiz
  static async criar(titulo, tema, tipo_ambiente = null) {
    return this.executeWithFallback(
      () => this.withConnection(async (connection) => {
        const [result] = await connection.execute(
          'INSERT INTO quizzes (titulo, tema, tipo_ambiente) VALUES (?, ?, ?)',
          [titulo, tema, tipo_ambiente]
        );
        this.log('criar', 'success', `Quiz ${titulo} criado`);
        return { id: result.insertId, titulo, tema };
      }),
      () => mockdb.quizzes && mockdb.quizzes.length > 0 
        ? { id: mockdb.nextQuizId++, titulo, tema }
        : { id: Date.now(), titulo, tema }
    );
  }

  // Buscar quiz por ID com perguntas
  static async buscarPorId(id) {
    return this.executeWithFallback(
      () => this.withConnection(async (connection) => {
        const [quiz] = await connection.execute(
          'SELECT * FROM quizzes WHERE id = ?',
          [id]
        );
        
        const [perguntas] = await connection.execute(
          'SELECT * FROM perguntas WHERE quiz_id = ?',
          [id]
        );
        
        return quiz[0] ? { ...quiz[0], perguntas } : null;
      }),
      () => {
        const quiz = mockdb.quizzes?.find(q => q.id === parseInt(id));
        return quiz ? { ...quiz, perguntas: [] } : null;
      }
    );
  }

  // Listar todos os quizzes
  static async listarTodos() {
    return this.executeWithFallback(
      () => this.withConnection(async (connection) => {
        const [rows] = await connection.execute('SELECT * FROM quizzes');
        return rows;
      }),
      () => mockdb.quizzes || []
    );
  }

  // Listar quizzes por tema
  static async listarPorTema(tema) {
    return this.executeWithFallback(
      () => this.withConnection(async (connection) => {
        const [rows] = await connection.execute(
          'SELECT * FROM quizzes WHERE tema = ?',
          [tema]
        );
        return rows;
      }),
      () => mockdb.quizzes?.filter(q => q.tema === tema) || []
    );
  }

  // Deletar quiz
  static async deletar(id) {
    return this.executeWithFallback(
      () => this.withConnection(async (connection) => {
        await connection.execute('DELETE FROM quizzes WHERE id = ?', [id]);
        this.log('deletar', 'success', `Quiz ${id} deletado`);
        return true;
      }),
      () => true
    );
  }
}

module.exports = Quiz;
