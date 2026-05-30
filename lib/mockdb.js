// Mock Database - Dados de teste em memória
// Quando BD real estiver pronto, delete este arquivo

class MockDatabase {
  constructor() {
    this.alunos = [
      { id: 1, nome: 'João Silva', email: 'joao@test.com', senha: 'senha123', saldo: 700, instituicao_id: 1 },
      { id: 2, nome: 'Maria Santos', email: 'maria@test.com', senha: 'senha123', saldo: 500, instituicao_id: 2 },
      { id: 3, nome: 'Pedro Oliveira', email: 'pedro@test.com', senha: 'senha123', saldo: 650, instituicao_id: 3 }
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
    
    this.parcerias = [
      {
        id: 1,
        nome_contato: 'HALLIM ALVES TAVARES',
        email: 'alveshallim@gmail.com',
        telefone: '11950099331',
        cidade: '6402000',
        nome_escola: 'HALLIM ALVES TAVARES',
        cargo: 'Diretor(a)',
        tipo_escola: 'Pública municipal',
        codigo_mec: '06434210',
        senha_gestao: '13042008',
        data_solicitacao: new Date('2026-05-27T14:44:39.760Z'),
        status: 'ativo',
        plano: 'premium',
        data_resposta: null,
        especialista_id: null,
        notas: null
      },
      {
        id: 2,
        nome_contato: 'Margarida Maria Maciel',
        email: 'diretora@emefmargarida.edu.br',
        telefone: '11987654321',
        cidade: '3500404',
        nome_escola: 'EMEF Margarida Maria Maciel',
        cargo: 'Diretora',
        tipo_escola: 'Pública municipal',
        codigo_mec: '31086789',
        senha_gestao: 'senha2024',
        data_solicitacao: new Date('2026-05-26T10:00:00.000Z'),
        status: 'ativo',
        plano: 'comum',
        data_resposta: null,
        especialista_id: null,
        notas: null
      },
      {
        id: 3,
        nome_contato: 'Diretor FIORAVANTE',
        email: 'fioravante@escola.edu.br',
        telefone: '11999999999',
        cidade: '3500405',
        nome_escola: 'EMEF FIORAVANTE BARLETTA',
        cargo: 'Diretor',
        tipo_escola: 'Pública municipal',
        codigo_mec: '31086790',
        senha_gestao: 'fio2024',
        data_solicitacao: new Date('2026-05-25T09:00:00.000Z'),
        status: 'inativo',
        plano: 'premium',
        data_resposta: null,
        especialista_id: null,
        notas: null
      }
    ];
    
    this.mensagensParcerias = [
      { id: 1, parceria_id: 1, remetente: 'admin', conteudo: 'Olá! Recebi a solicitação de parceria de HALLIM ALVES TAVARES. Em breve entraremos em contato.', data_mensagem: new Date('2026-05-27T14:44:39.760Z'), visualizado: 0 },
      { id: 2, parceria_id: 1, remetente: 'escola', conteudo: 'ola', data_mensagem: new Date('2026-05-27T14:44:53.662Z'), visualizado: 0 },
      { id: 3, parceria_id: 1, remetente: 'admin', conteudo: 'oi', data_mensagem: new Date('2026-05-27T14:45:17.204Z'), visualizado: 0 },
      { id: 4, parceria_id: 2, remetente: 'admin', conteudo: 'Bem-vindo! Somos da EMEF Margarida Maria Maciel, queremos discutir sobre a parceria.', data_mensagem: new Date('2026-05-26T10:05:00.000Z'), visualizado: 0 },
      { id: 5, parceria_id: 2, remetente: 'escola', conteudo: 'Ótimo! Temos interesse em participar do Pequenos Exploradores.', data_mensagem: new Date('2026-05-26T10:30:00.000Z'), visualizado: 0 },
      { id: 6, parceria_id: 2, remetente: 'admin', conteudo: 'Perfeito! Vamos começar com uma reunião.', data_mensagem: new Date('2026-05-26T11:00:00.000Z'), visualizado: 0 }
    ];
    
    // Alunos cadastrados por instituições
    this.alunosCadastrados = [];
    
    this.nextAlunoId = 4;
    this.nextProfessorId = 2;
    this.nextTurmaId = 2;
    this.nextQuizId = 2;
    this.nextParceriaId = 4;
  }

  // Alunos
  criarAluno(nome, email, senha, instituicao_id = null) {
    const id = this.nextAlunoId++;
    const aluno = { id, nome, email, senha, saldo: 700, instituicao_id: instituicao_id || 1 };
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

  // Gestores (busca em parcerias)
  buscarGestorPorId(id) {
    // Buscar nos parcerias (que são tratados como gestores após login)
    return this.parcerias.find(p => p.id === parseInt(id));
  }

  criarGestor(nome, email, senha) {
    // Criar um gestor simples (não vinculado a parceria)
    const id = this.nextGestorId || 100;
    this.nextGestorId = id + 1;
    const gestor = { id, nome, email, senha };
    return gestor;
  }

  buscarGestorPorEmail(email) {
    return this.parcerias.find(p => p.email === email);
  }

  validarGestor(email, senha) {
    // Tentar encontrar em parcerias
    const parceria = this.parcerias.find(p => p.email === email && p.senha_gestao === senha);
    if (parceria) {
      return parceria;
    }
    return null;
  }

  atualizarGestor(id, nome, email) {
    const gestor = this.buscarGestorPorId(id);
    if (gestor) {
      gestor.nome = nome;
      gestor.email = email;
      return true;
    }
    return false;
  }
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
      senha_gestao: dados.senha_gestao,
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
      data_mensagem: new Date().toISOString(),
      visualizado: 0
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

  marcarMensagensComoVisualizadas(parceriaId) {
    const id = parseInt(parceriaId, 10);
    this.mensagensParcerias.forEach(msg => {
      if (msg.parceria_id === id) {
        msg.visualizado = 1;
      }
    });
    return true;
  }

  atualizarPlanoParceria(parceriaId, plano) {
    const parceria = this.parcerias.find(p => p.id === parseInt(parceriaId, 10));
    if (parceria) {
      parceria.plano = plano;
      return true;
    }
    return false;
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
