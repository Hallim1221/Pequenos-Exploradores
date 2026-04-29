const pool = require('../config/database');

class Ranking {
  // Obter ranking geral de pontos
  static async ranking() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT a.id, a.nome, COUNT(r.id) as acertos, a.saldo 
         FROM alunos a 
         LEFT JOIN respostas r ON a.id = r.aluno_id AND r.acertou = 1 
         GROUP BY a.id 
         ORDER BY acertos DESC, a.saldo DESC 
         LIMIT 100`
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  // Ranking de uma turma
  static async rankingTurma(turma_id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT a.id, a.nome, COUNT(r.id) as acertos, a.saldo 
         FROM alunos a 
         JOIN turma_alunos ta ON a.id = ta.aluno_id 
         LEFT JOIN respostas r ON a.id = r.aluno_id AND r.acertou = 1 
         WHERE ta.turma_id = ? 
         GROUP BY a.id 
         ORDER BY acertos DESC, a.saldo DESC`,
        [turma_id]
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  // Posição de um aluno no ranking geral
  static async posicaoAlunoGeral(aluno_id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT posicao FROM (
          SELECT a.id, ROW_NUMBER() OVER (ORDER BY COUNT(r.id) DESC, a.saldo DESC) as posicao
          FROM alunos a
          LEFT JOIN respostas r ON a.id = r.aluno_id AND r.acertou = 1
          GROUP BY a.id
        ) ranked WHERE id = ?`,
        [aluno_id]
      );
      return rows[0]?.posicao || null;
    } finally {
      connection.release();
    }
  }
}

module.exports = Ranking;
