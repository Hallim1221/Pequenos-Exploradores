// Mock Database - Dados de teste em memória
// Quando BD real estiver pronto, delete este arquivo

class MockDatabase {
  constructor() {
    this.alunos = [
      { id: 1, nome: 'João Silva', email: 'joao@test.com', senha: 'senha123', saldo: 700 },
      { id: 2, nome: 'Maria Santos', email: 'maria@test.com', senha: 'senha123', saldo: 500 }
    ];
    
    this.professores = [
      { id: 1, nome: 'Prof. Carlos', email: 'carlos@test.com', senha: 'prof123', instituicao: 'Escola A' }
    ];
    
    this.turmas = [
      { id: 1, nome: '1º Ano A', professor_id: 1, ano_escolar: '1º' }
    ];
    
    this.quizzes = [
      { id: 1, titulo: 'Quiz Natureza', tema: 'natureza', tipo_ambiente: 'floresta' }
    ];
    
    this.nextAlunoId = 3;
    this.nextProfessorId = 2;
    this.nextTurmaId = 2;
    this.nextQuizId = 2;
  }

  // Alunos
  criarAluno(nome, email, senha) {
    const id = this.nextAlunoId++;
    const aluno = { id, nome, email, senha, saldo: 700 };
    this.alunos.push(aluno);
    return aluno;
  }

  buscarAlunoPorId(id) {
    return this.alunos.find(a => a.id === parseInt(id));
  }

  buscarAlunoPorEmail(email) {
    return this.alunos.find(a => a.email === email);
  }

  listarAlunos() {
    return this.alunos;
  }

  atualizarSaldoAluno(id, saldo) {
    const aluno = this.buscarAlunoPorId(id);
    if (aluno) {
      aluno.saldo = saldo;
      return true;
    }
    return false;
  }

  deletarAluno(id) {
    this.alunos = this.alunos.filter(a => a.id !== parseInt(id));
    return true;
  }

  // Professores
  criarProfessor(nome, email, senha, instituicao) {
    const id = this.nextProfessorId++;
    const professor = { id, nome, email, senha, instituicao };
    this.professores.push(professor);
    return professor;
  }

  buscarProfessorPorEmail(email) {
    return this.professores.find(p => p.email === email);
  }

  listarProfessores() {
    return this.professores;
  }

  // Quizzes
  criarQuiz(titulo, tema) {
    const id = this.nextQuizId++;
    const quiz = { id, titulo, tema };
    this.quizzes.push(quiz);
    return quiz;
  }

  buscarQuizPorId(id) {
    return this.quizzes.find(q => q.id === parseInt(id));
  }

  listarQuizzes() {
    return this.quizzes;
  }

  listarQuizzesPorTema(tema) {
    return this.quizzes.filter(q => q.tema === tema);
  }
}

module.exports = new MockDatabase();
