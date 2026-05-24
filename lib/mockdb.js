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
    
    this.parcerias = [];
    
    this.mensagensParcerias = [];
    
    // Alunos cadastrados por instituições
    this.alunosCadastrados = [];
    
    this.nextAlunoId = 3;
    this.nextProfessorId = 2;
    this.nextTurmaId = 2;
    this.nextQuizId = 2;
    this.nextParceriaId = 1;
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

  // Parcerias com Escolas
  criarParceria(dados) {
    const id = this.nextParceriaId++;
    const parceria = {
      id,
      nome_contato: dados.nome_contato,
      email: dados.email,
      telefone: dados.telefone,
      cidade: dados.cidade,
      nome_escola: dados.nome_escola,
      cargo: dados.cargo,
      tipo_escola: dados.tipo_escola,
      codigo_mec: dados.codigo_mec || null,
      data_solicitacao: new Date(),
      status: 'pendente',
      data_resposta: null,
      especialista_id: null,
      notas: null
    };
    this.parcerias.push(parceria);
    
    // Criar mensagem inicial da parceria
    this.criarMensagemParceria(id, `Olá! Recebi a solicitação de parceria de ${dados.nome_escola}. Em breve entraremos em contato.`, 'admin');
    
    return { id, email: dados.email, nome_escola: dados.nome_escola, status: 'sucesso' };
  }

  buscarParceriaPorId(id) {
    return this.parcerias.find(p => p.id === parseInt(id));
  }

  buscarParceriaPorEmail(email) {
    return this.parcerias.find(p => p.email === email);
  }

  listarParcerias() {
    return this.parcerias;
  }

  atualizarStatusParceria(id, status) {
    const parceria = this.buscarParceriaPorId(id);
    if (parceria) {
      parceria.status = status;
      parceria.data_resposta = new Date();
      return true;
    }
    return false;
  }

  // Mensagens de Parcerias
  criarMensagemParceria(parceriaId, conteudo, remetente = 'admin') {
    const id = parseInt(parceriaId, 10); // Garantir tipo número
    const msg = {
      id: this.mensagensParcerias.length + 1,
      parceria_id: id,
      remetente,
      conteudo,
      data_mensagem: new Date().toISOString()
    };
    this.mensagensParcerias.push(msg);
    return msg;
  }

  listarMensagensParcerias(parceriaId) {
    const id = parseInt(parceriaId, 10); // Garantir tipo número
    return this.mensagensParcerias.filter(m => m.parceria_id === id);
  }

  listarTodasMensagensParcerias() {
    return this.mensagensParcerias;
  }

  // Alunos Cadastrados por Instituições
  cadastrarAlunoPorInstituicao(email, senha) {
    // Verificar se já existe
    const jaExiste = this.alunosCadastrados.find(a => a.email === email);
    if (jaExiste) {
      return { sucesso: false, mensagem: 'Este email já foi cadastrado' };
    }
    
    const aluno = {
      email,
      senha,
      dataCadastro: new Date()
    };
    this.alunosCadastrados.push(aluno);
    return { sucesso: true, mensagem: 'Aluno cadastrado com sucesso' };
  }

  buscarAlunoCadastrado(email) {
    return this.alunosCadastrados.find(a => a.email === email);
  }

  listarAlunosCadastrados() {
    return this.alunosCadastrados;
  }
}

module.exports = new MockDatabase();
