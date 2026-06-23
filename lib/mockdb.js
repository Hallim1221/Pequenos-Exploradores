// Mock Database - Dados de teste em memória
// Quando BD real estiver pronto, delete este arquivo

const Seguranca = require('./seguranca');

class MockDatabase {
  constructor() {
    // INSTITUIÇÃO 1: HALLIM ALVES TAVARES
    // INSTITUIÇÃO 2: EMEF Margarida Maria Maciel
    // INSTITUIÇÃO 3: EMEF FIORAVANTE BARLETTA
    
    this.alunos = [
      // Alunos Instituição 1
      { id: 1, nome: 'João Silva', email: 'joao@test.com', senha: 'senha123', saldo: 700, instituicao_id: 1 },
      { id: 2, nome: 'Ana Costa', email: 'ana.costa@test.com', senha: 'senha123', saldo: 450, instituicao_id: 1 },
      { id: 3, nome: 'Carlos Mendes', email: 'carlos.mendes@test.com', senha: 'senha123', saldo: 0, instituicao_id: 1 },
      { id: 4, nome: 'Sofia Lima', email: 'sofia.lima@test.com', senha: 'senha123', saldo: 550, instituicao_id: 1 },
      { id: 5, nome: 'Lucas Ferreira', email: 'lucas.ferreira@test.com', senha: 'senha123', saldo: 0, instituicao_id: 1 },
      
      // Alunos Instituição 2
      { id: 6, nome: 'Maria Santos', email: 'maria@test.com', senha: 'senha123', saldo: 500, instituicao_id: 2 },
      { id: 7, nome: 'Gabriel Oliveira', email: 'gabriel.oliveira@test.com', senha: 'senha123', saldo: 600, instituicao_id: 2 },
      { id: 8, nome: 'Beatriz Alves', email: 'beatriz.alves@test.com', senha: 'senha123', saldo: 0, instituicao_id: 2 },
      { id: 9, nome: 'Rafael Costa', email: 'rafael.costa@test.com', senha: 'senha123', saldo: 380, instituicao_id: 2 },
      
      // Alunos Instituição 3
      { id: 10, nome: 'Pedro Oliveira', email: 'pedro@test.com', senha: 'senha123', saldo: 650, instituicao_id: 3 },
      { id: 11, nome: 'Isabela Martins', email: 'isabela.martins@test.com', senha: 'senha123', saldo: 520, instituicao_id: 3 },
      { id: 12, nome: 'Felipe Santos', email: 'felipe.santos@test.com', senha: 'senha123', saldo: 0, instituicao_id: 3 },
      { id: 13, nome: 'Camila Rocha', email: 'camila.rocha@test.com', senha: 'senha123', saldo: 420, instituicao_id: 3 }
    ];
    
    this.professores = [
      // Professores Instituição 1 (HALLIM ALVES TAVARES)
      { id: 1, nome: 'Prof. Carlos Mendes', email: 'carlos@test.com', senha: 'prof123', instituicao_id: 1, cargo: 'Professor(a)' },
      { id: 2, nome: 'Profa. Fernanda Silva', email: 'fernanda.silva@test.com', senha: 'prof123', instituicao_id: 1, cargo: 'Professor(a)' },
      { id: 3, nome: 'Prof. Ricardo Gomes', email: 'ricardo.gomes@test.com', senha: 'prof123', instituicao_id: 1, cargo: 'Professor(a)' },
      
      // Professores Instituição 2 (EMEF Margarida Maria Maciel)
      { id: 4, nome: 'Profa. Beatriz Lima', email: 'beatriz.lima@test.com', senha: 'prof123', instituicao_id: 2, cargo: 'Professor(a)' },
      { id: 5, nome: 'Prof. Anderson Costa', email: 'anderson.costa@test.com', senha: 'prof123', instituicao_id: 2, cargo: 'Professor(a)' },
      
      // Professores Instituição 3 (EMEF FIORAVANTE BARLETTA)
      { id: 6, nome: 'Profa. Juliana Oliveira', email: 'juliana.oliveira@test.com', senha: 'prof123', instituicao_id: 3, cargo: 'Professor(a)' },
      { id: 7, nome: 'Prof. Marcos Ferreira', email: 'marcos.ferreira@test.com', senha: 'prof123', instituicao_id: 3, cargo: 'Professor(a)' }
    ];
    
    this.turmas = [
      // Turmas Instituição 1
      { id: 1, nome: '1º Ano A', professor_id: 1, ano_escolar: '1º', instituicao_id: 1, codigo_acesso: 'ABCD', codigo: 'ABCD' },
      { id: 2, nome: '1º Ano B', professor_id: 2, ano_escolar: '1º', instituicao_id: 1, codigo_acesso: 'EFGH', codigo: 'EFGH' },
      { id: 3, nome: '2º Ano A', professor_id: 3, ano_escolar: '2º', instituicao_id: 1, codigo_acesso: 'IJKL', codigo: 'IJKL' },
      
      // Turmas Instituição 2
      { id: 4, nome: '1º Ano A', professor_id: 4, ano_escolar: '1º', instituicao_id: 2, codigo_acesso: 'MNOP', codigo: 'MNOP' },
      { id: 5, nome: '2º Ano B', professor_id: 5, ano_escolar: '2º', instituicao_id: 2, codigo_acesso: 'QRST', codigo: 'QRST' },
      
      // Turmas Instituição 3
      { id: 6, nome: '1º Ano A', professor_id: 6, ano_escolar: '1º', instituicao_id: 3, codigo_acesso: 'UVWX', codigo: 'UVWX' },
      { id: 7, nome: '3º Ano C', professor_id: 7, ano_escolar: '3º', instituicao_id: 3, codigo_acesso: 'A3K7', codigo: 'A3K7' }
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
    
    this.nextAlunoId = 14;
    this.nextProfessorId = 8;
    this.nextTurmaId = 8;
    this.nextQuizId = 5;
    this.nextParceriaId = 4;
    
    this.senhasHasheadas = false; // Flag para evitar re-hashing
  }

  // Hashear senhas das parcerias na inicialização
  async inicializarSenhasHasheadas() {
    // Evitar re-hashing se já foi feito
    if (this.senhasHasheadas) {
      console.log('ℹ️ Senhas já foram hasheadas, pulando...');
      return;
    }
    
    try {
      // Hashear senha_gestao de cada parceria
      for (let parceria of this.parcerias) {
        if (parceria.senha_gestao && !parceria.senha_gestao.startsWith('$2')) {
          // Só hashear se ainda não é um hash bcrypt
          const senhaHash = await Seguranca.hashSenha(parceria.senha_gestao);
          parceria.senha_gestao = senhaHash;
          console.log(`✅ Senha da parceria ${parceria.email} hasheada`);
        }
      }
      
      // Hashear senhas dos alunos (de teste)
      for (let aluno of this.alunos) {
        if (aluno.senha && !aluno.senha.startsWith('$2')) {
          const senhaHash = await Seguranca.hashSenha(aluno.senha);
          aluno.senha = senhaHash;
          console.log(`✅ Senha do aluno ${aluno.email} hasheada`);
        }
      }
      
      // Hashear senhas dos professores (de teste)
      for (let professor of this.professores) {
        if (professor.senha && !professor.senha.startsWith('$2')) {
          const senhaHash = await Seguranca.hashSenha(professor.senha);
          professor.senha = senhaHash;
          console.log(`✅ Senha do professor ${professor.email} hasheada`);
        }
      }
      
      this.senhasHasheadas = true;
    } catch (erro) {
      console.error('❌ Erro ao hashear senhas do mockdb:', erro.message);
    }
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
    const alunos = this.alunos.filter(a => a.turma_id === parseInt(turma_id));
    console.log(`🔍 listarAlunosDaTurma(${turma_id}): ${alunos.length} alunos`);
    console.log(`   Todos os alunos: ${this.alunos.length} total`);
    console.log(`   Alunos encontrados:`, alunos.map(a => ({id: a.id, nome: a.nome, turma_id: a.turma_id})));
    return alunos;
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

  atualizarTurmaAluno(id, turma_id) {
    const aluno = this.buscarAlunoPorId(id);
    if (!aluno) {
      return false;
    }
    aluno.turma_id = parseInt(turma_id);
    console.log(`✅ Aluno ${id} adicionado à turma ${turma_id}`);
    return true;
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
  criarProfessor(nome, email, senha, instituicao_id, cargo = null) {
    const id = this.nextProfessorId++;
    const professor = { id, nome, email, senha, instituicao_id, cargo: cargo || 'Professor(a)' };
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
    console.log(`\n🔐 mockdb.validarGestor chamado: ${email}`);
    console.log(`   senhasHasheadas: ${this.senhasHasheadas}`);
    
    // Lazy init: hashear senhas na primeira chamada se ainda não foram
    if (!this.senhasHasheadas) {
      console.log(`   🔄 Iniciando hashing de senhas...`);
      await this.inicializarSenhasHasheadas();
      console.log(`   ✅ Hashing concluído`);
    }
    
    // Tentar encontrar em parcerias
    const parceria = this.parcerias.find(p => p.email === email);
    console.log(`   📧 Parceria encontrada: ${parceria ? 'SIM' : 'NÃO'}`);
    
    if (parceria) {
      console.log(`   🔍 Verificando senha...`);
      console.log(`      Senha armazenada (primeiros 20 chars): ${parceria.senha_gestao?.substring(0, 20)}...`);
      console.log(`      É hash? ${parceria.senha_gestao?.startsWith('$2')}`);
      
      // Verificar com bcryptjs
      const senhaValida = await Seguranca.verificarSenha(senha, parceria.senha_gestao || '');
      console.log(`   ✅ Resultado: ${senhaValida ? 'VÁLIDA' : 'INVÁLIDA'}`);
      
      if (senhaValida) {
        return parceria;
      }
    }
    
    console.log(`   ❌ Validação falhou`);
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
  criarTurma(nome, professor_id, ano_escolar = null, instituicao_id = null, codigo_acesso = null) {
    const novaTurma = {
      id: Math.max(...this.turmas.map(t => t.id), 0) + 1,
      nome,
      professor_id: parseInt(professor_id),
      ano_escolar,
      instituicao_id: instituicao_id ? parseInt(instituicao_id) : null,
      codigo_acesso: codigo_acesso || Math.random().toString(36).substring(2, 6).toUpperCase(),
      codigo: codigo_acesso || Math.random().toString(36).substring(2, 6).toUpperCase()
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

  getAcessosInstituicao(instituicao_id) {
    // Buscar instituição
    const parceria = this.parcerias.find(p => p.id === parseInt(instituicao_id));
    if (!parceria) {
      return { success: false, message: 'Instituição não encontrada' };
    }

    // Total de alunos
    const totalAlunos = this.alunos.filter(a => a.instituicao_id === parseInt(instituicao_id)).length;

    // Total de professores
    const totalProfessores = this.professores.filter(p => p.instituicao === parceria.nome_escola).length;

    // Alunos com atividades (saldo > 0 indica que acessou)
    const alunosAtivos = this.alunos.filter(a => 
      a.instituicao_id === parseInt(instituicao_id) && a.saldo > 0
    ).length;

    // Professores com turmas (professores que realmente acessam/usam a plataforma)
    const professoresComTurmas = this.turmas
      .filter(t => t.instituicao_id === parseInt(instituicao_id))
      .map(t => t.professor_id);
    const professoresAtivosSet = new Set(professoresComTurmas);
    const professoresAtivos = professoresAtivosSet.size;

    // Calcular porcentagens
    const percentualAlunos = totalAlunos > 0 ? Math.round((alunosAtivos / totalAlunos) * 100) : 0;
    const percentualProfessores = totalProfessores > 0 ? Math.round((professoresAtivos / totalProfessores) * 100) : 0;

    return {
      success: true,
      acessos: {
        professores: {
          porcentagem: percentualProfessores,
          ativos: professoresAtivos,
          total: totalProfessores
        },
        alunos: {
          porcentagem: percentualAlunos,
          ativos: alunosAtivos,
          total: totalAlunos
        }
      }
    };
  }
}

module.exports = new MockDatabase();
