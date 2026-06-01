// Mock Database - Dados de teste em memória
// Quando BD real estiver pronto, delete este arquivo

const Seguranca = require('./seguranca');

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
      { id: 1, nome: '1º Ano A', professor_id: 1, ano_escolar: '1º', instituicao_id: 1 },
      { id: 2, nome: '2º Ano B', professor_id: 1, ano_escolar: '2º', instituicao_id: 2 }
    ];
    
    this.quizzes = [
      { id: 1, titulo: 'Quiz Natureza', tema: 'natureza', tipo_ambiente: 'floresta' },
      { id: 2, titulo: 'Quiz Animais', tema: 'animais', tipo_ambiente: 'savana' },
      { id: 3, titulo: 'Quiz Biomas', tema: 'biomas', tipo_ambiente: 'geral' },
      { id: 4, titulo: 'Quiz Meio Ambiente', tema: 'meio_ambiente', tipo_ambiente: 'geral' }
    ];
    
    // Atividades dos alunos (novo)
    this.atividades = [
      { id: 1, aluno_id: 1, tipo: 'quiz_realizado', descricao: 'Realizou Quiz Natureza', pontos: 70, data: new Date('2026-05-30T10:00:00.000Z') },
      { id: 2, aluno_id: 1, tipo: 'avatar_comprado', descricao: 'Comprou Avatar Explorer', pontos: 0, data: new Date('2026-05-29T15:30:00.000Z') },
      { id: 3, aluno_id: 2, tipo: 'quiz_realizado', descricao: 'Realizou Quiz Animais', pontos: 85, data: new Date('2026-05-30T11:00:00.000Z') },
      { id: 4, aluno_id: 2, tipo: 'loja_visitada', descricao: 'Visitou a Loja', pontos: 0, data: new Date('2026-05-28T14:00:00.000Z') },
      { id: 5, aluno_id: 3, tipo: 'quiz_realizado', descricao: 'Realizou Quiz Biomas', pontos: 90, data: new Date('2026-05-30T09:00:00.000Z') }
    ];
    
    // Desempenho em quizzes (novo)
    this.desempenho = [
      { id: 1, aluno_id: 1, quiz_id: 1, acertos: 7, erros: 3, nota: 70, tempo_minutos: 15, data: new Date('2026-05-30T10:00:00.000Z') },
      { id: 2, aluno_id: 2, quiz_id: 2, acertos: 8, erros: 2, nota: 85, tempo_minutos: 12, data: new Date('2026-05-30T11:00:00.000Z') },
      { id: 3, aluno_id: 3, quiz_id: 3, acertos: 9, erros: 1, nota: 90, tempo_minutos: 18, data: new Date('2026-05-30T09:00:00.000Z') }
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
  criarAluno(nome, email, senha, turma_id = null, instituicao_id = null) {
    const id = this.nextAlunoId++;
    const aluno = { id, nome, email, senha, saldo: 700, instituicao_id: instituicao_id || 1, turma_id };
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

  listarAlunosDaTurma(turma_id) {
    return this.alunos.filter(a => a.turma_id === parseInt(turma_id));
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

  atualizarAluno(id, { nome, email, saldo, instituicao_id }) {
    const aluno = this.buscarAlunoPorId(id);
    if (!aluno) {
      return { sucesso: false, mensagem: 'Aluno não encontrado' };
    }
    if (nome !== undefined) aluno.nome = nome;
    if (email !== undefined) aluno.email = email;
    if (saldo !== undefined) aluno.saldo = saldo;
    if (instituicao_id !== undefined) aluno.instituicao_id = instituicao_id;
    return { sucesso: true, mensagem: 'Aluno atualizado com sucesso' };
  }

  adicionarSaldoAluno(id, valor) {
    const aluno = this.buscarAlunoPorId(id);
    if (!aluno) {
      return { sucesso: false, mensagem: 'Aluno não encontrado' };
    }
    aluno.saldo += valor;
    return { sucesso: true, mensagem: `Saldo adicionado: ${valor}` };
  }

  subtrairSaldoAluno(id, valor) {
    const aluno = this.buscarAlunoPorId(id);
    if (!aluno) {
      return { sucesso: false, mensagem: 'Aluno não encontrado' };
    }
    if (aluno.saldo < valor) {
      return { sucesso: false, mensagem: 'Saldo insuficiente' };
    }
    aluno.saldo -= valor;
    return { sucesso: true, mensagem: `Saldo subtraído: ${valor}` };
  }

  listarAlunosPorInstituicao(instituicao_id) {
    return this.alunos.filter(a => a.instituicao_id === parseInt(instituicao_id));
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

  async validarGestor(email, senha) {
    // Tentar encontrar em parcerias
    const parceria = this.parcerias.find(p => p.email === email);
    if (parceria) {
      // Verificar com bcryptjs
      const senhaValida = await Seguranca.verificarSenha(senha, parceria.senha_gestao || '');
      if (senhaValida) {
        return parceria;
      }
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

  // Turmas
  criarTurma(nome, professor_id, ano_escolar = null, instituicao_id = null) {
    const novaTurma = {
      id: Math.max(...this.turmas.map(t => t.id), 0) + 1,
      nome,
      professor_id: parseInt(professor_id),
      ano_escolar,
      instituicao_id: instituicao_id ? parseInt(instituicao_id) : null
    };
    console.log('📝 MockDB.criarTurma() chamado!');
    console.log('   Turmas ANTES:', JSON.stringify(this.turmas));
    this.turmas.push(novaTurma);
    console.log('   Turmas DEPOIS:', JSON.stringify(this.turmas));
    console.log('✅ MockDB: Turma criada -', novaTurma);
    return novaTurma;
  }

  listarTurmasPorProfessor(professor_id) {
    console.log('📝 MockDB.listarTurmasPorProfessor() chamado com professor_id:', professor_id);
    console.log('   Turmas disponíveis:', JSON.stringify(this.turmas));
    return this.turmas.filter(t => t.professor_id === parseInt(professor_id));
  }

  listarTurmasPorInstituicao(instituicao_id) {
    console.log('📝 MockDB.listarTurmasPorInstituicao() chamado com instituicao_id:', instituicao_id);
    console.log('   Turmas disponíveis:', JSON.stringify(this.turmas));
    return this.turmas.filter(t => t.instituicao_id === parseInt(instituicao_id));
  }

  buscarTurmaPorId(id) {
    return this.turmas.find(t => t.id === parseInt(id));
  }

  deletarTurma(id) {
    console.log('📝 MockDB.deletarTurma() chamado com id:', id);
    console.log('   Turmas ANTES:', JSON.stringify(this.turmas));
    const index = this.turmas.findIndex(t => t.id === parseInt(id));
    if (index !== -1) {
      const turmaRemovida = this.turmas.splice(index, 1);
      console.log('✅ MockDB: Turma deletada -', turmaRemovida[0]);
      console.log('   Turmas DEPOIS:', JSON.stringify(this.turmas));
      return true;
    }
    console.log('⚠️ MockDB: Turma não encontrada para deletar');
    return false;
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

  marcarMensagemComoLida(mensagemId) {
    const msg = this.mensagensParcerias.find(m => m.id === parseInt(mensagemId, 10));
    if (msg) {
      msg.visualizado = 1;
      return true;
    }
    return false;
  }

  marcarMensagensParceríaComoLidas(parceriaId) {
    const parceriaIdInt = parseInt(parceriaId, 10);
    const mensagens = this.mensagensParcerias.filter(m => m.parceria_id === parceriaIdInt);
    
    mensagens.forEach(msg => {
      msg.visualizado = 1;
    });
    
    return mensagens.length;
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

  // Estatísticas (novo)
  getResumo() {
    const planosMap = {};
    const statusMap = {};
    
    this.parcerias.forEach(p => {
      planosMap[p.plano] = (planosMap[p.plano] || 0) + 1;
      statusMap[p.status] = (statusMap[p.status] || 0) + 1;
    });

    return {
      success: true,
      resumo: {
        total_instituicoes: this.parcerias.length,
        total_alunos: this.alunos.length,
        total_professores: this.professores.length,
        total_turmas: this.turmas.length,
        total_quizzes: this.quizzes.length,
        planos: planosMap,
        status: statusMap,
        ultimas_atividades: this.atividades.slice(-5).reverse()
      }
    };
  }

  getComparativoInstituicoes() {
    const comparativo = this.parcerias.map(p => {
      const alunosInst = this.alunos.filter(a => a.instituicao_id === p.id);
      const turmasInst = this.turmas.filter(t => t.instituicao_id === p.id);
      const totalAlunos = alunosInst.length;
      const totalTurmas = turmasInst.length;
      const saldoTotal = alunosInst.reduce((sum, a) => sum + (a.saldo || 0), 0);

      return {
        id: p.id,
        nome_escola: p.nome_escola,
        plano: p.plano,
        status: p.status,
        total_alunos: totalAlunos,
        total_turmas: totalTurmas,
        saldo_total: saldoTotal
      };
    });

    return {
      success: true,
      total: comparativo.length,
      comparativo: comparativo
    };
  }

  getInstituicoesDetalhes() {
    const instituicoes = this.parcerias.map(p => {
      const alunosInst = this.alunos.filter(a => a.instituicao_id === p.id);
      return {
        ...p,
        total_alunos: alunosInst.length
      };
    });

    return {
      success: true,
      total: instituicoes.length,
      instituicoes: instituicoes
    };
  }

  getRanking(limite = 10) {
    const ranking = this.alunos
      .map(a => {
        const inst = this.parcerias.find(p => p.id === a.instituicao_id);
        return {
          id: a.id,
          nome: a.nome,
          email: a.email,
          pontos: a.saldo,
          instituicao: inst ? inst.nome_escola : 'Sem instituição'
        };
      })
      .sort((a, b) => b.pontos - a.pontos)
      .slice(0, limite);

    return {
      success: true,
      total: ranking.length,
      ranking: ranking
    };
  }

  getAtividadesAluno(aluno_id) {
    const atividades = this.atividades.filter(a => a.aluno_id === parseInt(aluno_id));
    return {
      success: true,
      aluno_id: aluno_id,
      total_atividades: atividades.length,
      atividades: atividades
    };
  }

  getDesempenhoAluno(aluno_id) {
    const desempenho = this.desempenho.filter(d => d.aluno_id === parseInt(aluno_id));
    const media = desempenho.length > 0
      ? Math.round((desempenho.reduce((sum, d) => sum + d.acertos, 0) / desempenho.length) * 100) / 100
      : 0;

    return {
      success: true,
      aluno_id: aluno_id,
      total_quizzes_realizados: desempenho.length,
      desempenho: {
        media_acertos: media,
        total_acertos: desempenho.reduce((sum, d) => sum + d.acertos, 0),
        total_erros: desempenho.reduce((sum, d) => sum + d.erros, 0),
        quizzes: desempenho
      }
    };
  }

  getEstatisticasInstituicao(instituicao_id) {
    const inst = this.parcerias.find(p => p.id === parseInt(instituicao_id));
    if (!inst) {
      return { success: false, message: 'Instituição não encontrada' };
    }

    const alunos = this.alunos.filter(a => a.instituicao_id === parseInt(instituicao_id));
    const turmas = this.turmas.filter(t => t.instituicao_id === parseInt(instituicao_id));
    const saldoTotal = alunos.reduce((sum, a) => sum + (a.saldo || 0), 0);

    return {
      success: true,
      instituicao: inst,
      estatisticas: {
        total_alunos: alunos.length,
        total_professores: 1,
        total_turmas: turmas.length,
        alunos: alunos,
        saldo_total: saldoTotal
      }
    };
  }

  deletarInstituicao(id) {
    this.parcerias = this.parcerias.filter(p => p.id !== parseInt(id));
    return true;
  }
}

module.exports = new MockDatabase();
