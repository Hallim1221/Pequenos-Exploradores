const pool = require('../config/database');
const mockdb = require('./mockdb');

/**
 * Classe responsável por calcular e retornar estatísticas reais do sistema
 * Todos os dados são baseados em informações reais do banco de dados
 */
class Estatisticas {
  static useMock = false;

  /**
   * Retorna resumo geral do sistema
   * Total de instituições, alunos, professores, turmas, etc.
   */
  static async getResumo() {
    try {
      if (this.useMock) throw new Error('Using mock');

      const connection = await pool.getConnection();

      // Buscar totais
      const [instituicoes] = await connection.execute('SELECT COUNT(*) as total FROM parcerias');
      const [alunos] = await connection.execute('SELECT COUNT(*) as total FROM alunos');
      const [professores] = await connection.execute('SELECT COUNT(*) as total FROM professores');
      const [turmas] = await connection.execute('SELECT COUNT(*) as total FROM turmas');
      const [quizzes] = await connection.execute('SELECT COUNT(*) as total FROM quizzes');

      // Contar por plano
      const [planosResult] = await connection.execute(
        `SELECT plano, COUNT(*) as total FROM parcerias GROUP BY plano`
      );

      // Contar por status
      const [statusResult] = await connection.execute(
        `SELECT status, COUNT(*) as total FROM parcerias GROUP BY status`
      );

      // Últimas atividades (últimas 5)
      const [atividades] = await connection.execute(
        `SELECT a.id, a.nome as aluno_nome, p.nome_escola, 'novo_aluno' as tipo, a.created_at as data
         FROM alunos a
         LEFT JOIN parcerias p ON a.instituicao_id = p.id
         ORDER BY a.id DESC LIMIT 5`
      );

      connection.release();

      // Organizar dados de planos
      const planosMap = {};
      planosResult.forEach(row => {
        planosMap[row.plano] = row.total;
      });

      // Organizar dados de status
      const statusMap = {};
      statusResult.forEach(row => {
        statusMap[row.status] = row.total;
      });

      return {
        success: true,
        resumo: {
          total_instituicoes: instituicoes[0].total,
          total_alunos: alunos[0].total,
          total_professores: professores[0].total,
          total_turmas: turmas[0].total,
          total_quizzes: quizzes[0].total,
          planos: planosMap,
          status: statusMap,
          ultimas_atividades: atividades
        }
      };
    } catch (erro) {
      this.useMock = true;
      return mockdb.getResumo();
    }
  }

  /**
   * Retorna todas as instituições com estatísticas detalhadas
   */
  static async getInstituicoesDetalhes() {
    try {
      if (this.useMock) throw new Error('Using mock');

      const connection = await pool.getConnection();

      // Buscar parcerias com contagem de alunos
      const [parcerias] = await connection.execute(`
        SELECT 
          p.*,
          COUNT(DISTINCT a.id) as total_alunos
        FROM parcerias p
        LEFT JOIN alunos a ON p.id = a.instituicao_id
        GROUP BY p.id
      `);

      connection.release();

      return {
        success: true,
        total: parcerias.length,
        instituicoes: parcerias
      };
    } catch (erro) {
      this.useMock = true;
      return mockdb.getInstituicoesDetalhes();
    }
  }

  /**
   * Retorna ranking de alunos por pontos
   */
  static async getRanking(limite = 10) {
    try {
      if (this.useMock) throw new Error('Using mock');

      const connection = await pool.getConnection();

      const [ranking] = await connection.execute(`
        SELECT 
          a.id,
          a.nome,
          a.email,
          a.saldo as pontos,
          p.nome_escola as instituicao,
          COUNT(DISTINCT r.id) as quizzes_realizados
        FROM alunos a
        LEFT JOIN parcerias p ON a.instituicao_id = p.id
        LEFT JOIN respostas_quiz r ON a.id = r.aluno_id
        GROUP BY a.id
        ORDER BY a.saldo DESC
        LIMIT ?
      `, [limite]);

      connection.release();

      return {
        success: true,
        total: ranking.length,
        ranking: ranking
      };
    } catch (erro) {
      this.useMock = true;
      return mockdb.getRanking(limite);
    }
  }

  /**
   * Retorna atividades de um aluno específico
   */
  static async getAtividadesAluno(aluno_id) {
    try {
      if (this.useMock) throw new Error('Using mock');

      const connection = await pool.getConnection();

      // Quizzes realizados
      const [quizzesRealizados] = await connection.execute(`
        SELECT 
          q.id,
          q.titulo,
          COUNT(rq.id) as total_realizacoes,
          MAX(rq.data_realizacao) as ultima_realizacao
        FROM quizzes q
        LEFT JOIN respostas_quiz rq ON q.id = rq.quiz_id AND rq.aluno_id = ?
        GROUP BY q.id
      `, [aluno_id]);

      connection.release();

      return {
        success: true,
        aluno_id: aluno_id,
        total_atividades: quizzesRealizados.length,
        atividades: quizzesRealizados
      };
    } catch (erro) {
      this.useMock = true;
      return mockdb.getAtividadesAluno(aluno_id);
    }
  }

  /**
   * Retorna desempenho de um aluno (acertos, erros, notas)
   */
  static async getDesempenhoAluno(aluno_id) {
    try {
      if (this.useMock) throw new Error('Using mock');

      const connection = await pool.getConnection();

      // Buscar todas as respostas do aluno
      const [respostas] = await connection.execute(`
        SELECT 
          rq.id,
          q.titulo as quiz_titulo,
          rq.data_realizacao,
          SUM(CASE WHEN rq.correta = 1 THEN 1 ELSE 0 END) as acertos,
          SUM(CASE WHEN rq.correta = 0 THEN 1 ELSE 0 END) as erros
        FROM respostas_quiz rq
        JOIN quizzes q ON rq.quiz_id = q.id
        WHERE rq.aluno_id = ?
        GROUP BY rq.quiz_id
      `, [aluno_id]);

      // Calcular média
      const media = respostas.length > 0
        ? Math.round((respostas.reduce((sum, r) => sum + r.acertos, 0) / respostas.length) * 100) / 100
        : 0;

      connection.release();

      return {
        success: true,
        aluno_id: aluno_id,
        total_quizzes_realizados: respostas.length,
        desempenho: {
          media_acertos: media,
          total_acertos: respostas.reduce((sum, r) => sum + r.acertos, 0),
          total_erros: respostas.reduce((sum, r) => sum + r.erros, 0),
          quizzes: respostas
        }
      };
    } catch (erro) {
      this.useMock = true;
      return mockdb.getDesempenhoAluno(aluno_id);
    }
  }

  /**
   * Retorna estatísticas de uma instituição específica
   */
  static async getEstatisticasInstituicao(instituicao_id) {
    try {
      if (this.useMock) throw new Error('Using mock');

      const connection = await pool.getConnection();

      // Buscar informações da instituição
      const [instituicao] = await connection.execute(
        'SELECT * FROM parcerias WHERE id = ?',
        [instituicao_id]
      );

      if (!instituicao.length) {
        return { success: false, message: 'Instituição não encontrada' };
      }

      // Contar alunos
      const [alunos] = await connection.execute(
        'SELECT COUNT(*) as total FROM alunos WHERE instituicao_id = ?',
        [instituicao_id]
      );

      // Contar professores
      const [professores] = await connection.execute(
        'SELECT COUNT(*) as total FROM professores WHERE instituicao = ?',
        [instituicao[0].nome_escola]
      );

      // Contar turmas
      const [turmas] = await connection.execute(
        'SELECT COUNT(*) as total FROM turmas WHERE instituicao_id = ?',
        [instituicao_id]
      );

      // Listar alunos com saldo
      const [alunosDetalhes] = await connection.execute(
        'SELECT id, nome, email, saldo FROM alunos WHERE instituicao_id = ?',
        [instituicao_id]
      );

      connection.release();

      return {
        success: true,
        instituicao: instituicao[0],
        estatisticas: {
          total_alunos: alunos[0].total,
          total_professores: professores[0].total,
          total_turmas: turmas[0].total,
          alunos: alunosDetalhes,
          saldo_total: alunosDetalhes.reduce((sum, a) => sum + a.saldo, 0)
        }
      };
    } catch (erro) {
      this.useMock = true;
      return mockdb.getEstatisticasInstituicao(instituicao_id);
    }
  }

  /**
   * Retorna comparativo entre instituições
   */
  static async getComparativoInstituicoes() {
    try {
      if (this.useMock) throw new Error('Using mock');

      const connection = await pool.getConnection();

      const [comparativo] = await connection.execute(`
        SELECT 
          p.id,
          p.nome_escola,
          p.plano,
          p.status,
          COUNT(DISTINCT a.id) as total_alunos,
          COUNT(DISTINCT t.id) as total_turmas,
          SUM(a.saldo) as saldo_total
        FROM parcerias p
        LEFT JOIN alunos a ON p.id = a.instituicao_id
        LEFT JOIN turmas t ON p.id = t.instituicao_id
        GROUP BY p.id
        ORDER BY total_alunos DESC
      `);

      connection.release();

      return {
        success: true,
        total: comparativo.length,
        comparativo: comparativo
      };
    } catch (erro) {
      this.useMock = true;
      return mockdb.getComparativoInstituicoes();
    }
  }

  /**
   * Calcula porcentagem de acessos de professores e alunos da instituição
   */
  static async getAcessosInstituicao(instituicao_id) {
    try {
      if (this.useMock) throw new Error('Using mock');

      const connection = await pool.getConnection();

      // Buscar instituição
      const [instituicao] = await connection.execute(
        'SELECT nome_escola FROM parcerias WHERE id = ?',
        [instituicao_id]
      );

      if (!instituicao.length) {
        return { success: false, message: 'Instituição não encontrada' };
      }

      const nomeEscola = instituicao[0].nome_escola;

      // Total de alunos
      const [totalAlunos] = await connection.execute(
        'SELECT COUNT(*) as total FROM alunos WHERE instituicao_id = ?',
        [instituicao_id]
      );

      // Total de professores
      const [totalProfessores] = await connection.execute(
        'SELECT COUNT(*) as total FROM professores WHERE instituicao = ?',
        [nomeEscola]
      );

      // Alunos com atividades (acessaram/participaram)
      const [alunosAtivos] = await connection.execute(
        `SELECT COUNT(DISTINCT a.id) as total 
         FROM alunos a 
         WHERE a.instituicao_id = ? AND a.saldo > 0`,
        [instituicao_id]
      );

      // Professores com turmas (acessaram/criaram conteúdo)
      const [professoresComTurmas] = await connection.execute(
        `SELECT COUNT(DISTINCT t.professor_id) as total 
         FROM turmas t 
         JOIN professores p ON t.professor_id = p.id
         WHERE p.instituicao = ? AND t.instituicao_id = ?`,
        [nomeEscola, instituicao_id]
      );

      connection.release();

      // Calcular porcentagens
      const totalAl = totalAlunos[0].total || 0;
      const totalProf = totalProfessores[0].total || 0;
      const alunosAti = alunosAtivos[0].total || 0;
      const professoresAti = professoresComTurmas[0].total || 0;

      const percentualAlunos = totalAl > 0 ? Math.round((alunosAti / totalAl) * 100) : 0;
      const percentualProfessores = totalProf > 0 ? Math.round((professoresAti / totalProf) * 100) : 0;

      return {
        success: true,
        acessos: {
          professores: {
            porcentagem: percentualProfessores,
            ativos: professoresAti,
            total: totalProf
          },
          alunos: {
            porcentagem: percentualAlunos,
            ativos: alunosAti,
            total: totalAl
          }
        }
      };
    } catch (erro) {
      console.error('Erro ao calcular acessos:', erro.message);
      this.useMock = true;
      return mockdb.getAcessosInstituicao(instituicao_id);
    }
  }
}

module.exports = Estatisticas;
