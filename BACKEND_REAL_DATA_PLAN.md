# 📊 PLANO DE MELHORIA - Backend com Dados Reais

## 🎯 OBJETIVO
Transformar o backend para usar **dados reais do site** em todos os endpoints e dashboard

---

## 📋 ANÁLISE ATUAL

### Dados Reais Identificados
✅ **3 Instituições/Parcerias** cadastradas:
- HALLIM ALVES TAVARES (premium, ativo)
- EMEF Margarida Maria Maciel (comum, ativo)
- EMEF FIORAVANTE BARLETTA (premium, inativo)

✅ **3 Alunos** cadastrados:
- João Silva (instituição 1 - HALLIM)
- Maria Santos (instituição 2 - EMEF Margarida)
- Pedro Oliveira (instituição 3 - EMEF FIORAVANTE)

✅ **1 Professor** cadastrado:
- Prof. Carlos

✅ **1 Turma** cadastrada:
- 1º Ano A

✅ **6 Mensagens** de parcerias

---

## 🔧 MELHORIAS A IMPLEMENTAR

### FASE 1: ENDPOINTS COM DADOS REAIS

#### 1.1 - Melhorar GET /api/instituicoes
**Adicionar informações:**
- Total de alunos por instituição ✨ NOVO
- Plano atual (premium/comum)
- Status (ativo/inativo)
- Dados de contato
- Data de solicitação
- Últimas atividades

**Resposta esperada:**
```json
{
  "success": true,
  "total": 3,
  "instituicoes": [
    {
      "id": 1,
      "nome_escola": "HALLIM ALVES TAVARES",
      "nome_contato": "Hallim Alves Tavares",
      "email": "alveshallim@gmail.com",
      "telefone": "11950099331",
      "plano": "premium",
      "status": "ativo",
      "tipo_escola": "Pública municipal",
      "codigo_mec": "06434210",
      "total_alunos": 1,
      "total_professores": 1,
      "data_cadastro": "2026-05-27T14:44:39.760Z",
      "ultima_atividade": "2026-05-30T10:00:00.000Z"
    }
  ]
}
```

#### 1.2 - Novo: GET /api/dashboard/resumo
**Retornar resumo geral:**
- Total de instituições (3)
- Total de alunos (3)
- Total de professores (1)
- Total de turmas (1)
- Total de quizzes (1)
- Instituições premium vs comum
- Instituições ativas vs inativas
- Alunos por instituição

**Resposta esperada:**
```json
{
  "success": true,
  "resumo": {
    "total_instituicoes": 3,
    "total_alunos": 3,
    "total_professores": 1,
    "total_turmas": 1,
    "total_quizzes": 1,
    "planos": {
      "premium": 2,
      "comum": 1
    },
    "status": {
      "ativo": 2,
      "inativo": 1
    },
    "ultimas_atividades": [
      { "tipo": "novo_aluno", "instituicao": "HALLIM", "aluno": "João Silva", "data": "2026-05-30T09:00:00" },
      { "tipo": "novo_aluno", "instituicao": "EMEF Margarida", "aluno": "Maria Santos", "data": "2026-05-30T08:00:00" }
    ]
  }
}
```

#### 1.3 - Melhorar GET /api/instituicoes/:id/alunos
**Adicionar:**
- Data de cadastro de cada aluno
- Saldo disponível
- Situação (ativo/inativo)
- Quiz concluídos
- Últimas atividades

**Resposta esperada:**
```json
{
  "success": true,
  "instituicao": "HALLIM ALVES TAVARES",
  "plano": "premium",
  "total_alunos": 1,
  "alunos": [
    {
      "id": 1,
      "nome": "João Silva",
      "email": "joao@test.com",
      "saldo": 700,
      "data_cadastro": "2026-05-27",
      "status": "ativo",
      "quizzes_concluidos": 0,
      "ultima_atividade": "2026-05-30T09:00:00"
    }
  ]
}
```

#### 1.4 - Novo: GET /api/alunos/:id/atividades
**Rastrear atividades do aluno:**
- Quizzes realizados
- Pontos conquistados
- Avatares comprados
- Lojas visitadas
- Datas e horários

**Resposta esperada:**
```json
{
  "success": true,
  "aluno": "João Silva",
  "total_atividades": 0,
  "atividades": []
}
```

#### 1.5 - Novo: GET /api/instituicoes/:id/professores
**Listar professores por instituição:**
- Nome
- Email
- Turmas
- Alunos gerenciados

**Resposta esperada:**
```json
{
  "success": true,
  "instituicao": "HALLIM ALVES TAVARES",
  "total_professores": 1,
  "professores": [
    {
      "id": 1,
      "nome": "Prof. Carlos",
      "email": "carlos@test.com",
      "turmas": 1,
      "alunos_gerenciados": 1
    }
  ]
}
```

#### 1.6 - Novo: GET /api/instituicoes/:id/turmas
**Listar turmas por instituição:**
- Nome da turma
- Ano escolar
- Professor responsável
- Quantidade de alunos
- Quizzes disponíveis

**Resposta esperada:**
```json
{
  "success": true,
  "instituicao": "HALLIM ALVES TAVARES",
  "total_turmas": 1,
  "turmas": [
    {
      "id": 1,
      "nome": "1º Ano A",
      "ano_escolar": "1º",
      "professor": "Prof. Carlos",
      "total_alunos": 1,
      "quizzes_disponiveis": 1
    }
  ]
}
```

---

### FASE 2: NOVOS MODELOS E MÉTODOS

#### 2.1 - Classe Estatisticas
```javascript
// lib/estatisticas.js
class Estatisticas {
  static async getResumo()
  static async getAlunosPorInstituicao(instituicao_id)
  static async getAtividadesAluno(aluno_id)
  static async getDesempenhoAluno(aluno_id)
  static async getQuizzesRealizados(aluno_id)
  static async getAvataresCumprados(aluno_id)
  static async getRanking() // Top 10 alunos
}
```

#### 2.2 - Estender Modelo Aluno
```javascript
// Métodos novos:
static async getAtividades(aluno_id)
static async getDesempenho(aluno_id)
static async adicionarAtividade(aluno_id, tipo, descricao)
```

#### 2.3 - Estender Modelo Parceria
```javascript
// Métodos novos:
static async getTotalAlunos(instituicao_id)
static async getTotalProfessores(instituicao_id)
static async getTotalTurmas(instituicao_id)
static async getUltimasAtividades(instituicao_id)
```

---

### FASE 3: MELHORIAS NO MOCKDB

#### 3.1 - Adicionar dados de atividades
```javascript
this.atividades = [
  { id: 1, aluno_id: 1, tipo: 'quiz_realizado', descricao: 'Realizou Quiz Natureza', data: new Date() },
  { id: 2, aluno_id: 2, tipo: 'avatar_comprado', descricao: 'Comprou Avatar', data: new Date() }
];
```

#### 3.2 - Adicionar dados de desempenho
```javascript
this.desempenho = [
  { aluno_id: 1, quiz_id: 1, acertos: 7, erros: 3, nota: 70, data: new Date() }
];
```

#### 3.3 - Adicionar mais quizzes
```javascript
this.quizzes = [
  { id: 1, titulo: 'Quiz Natureza', tema: 'natureza', ... },
  { id: 2, titulo: 'Quiz Animais', tema: 'animais', ... },
  { id: 3, titulo: 'Quiz Biomas', tema: 'biomas', ... },
  { id: 4, titulo: 'Quiz Meio Ambiente', tema: 'meio_ambiente', ... }
];
```

---

### FASE 4: ENDPOINTS AVANÇADOS

#### 4.1 - GET /api/dashboard/instituicoes-detalhes
Retorna TODAS as instituições com:
- Dados completos
- Estatísticas
- Gráficos (total alunos, planos, status)

#### 4.2 - GET /api/dashboard/alunos-detalhes
Retorna TODOS os alunos com:
- Dados completos
- Instituição
- Atividades recentes
- Desempenho

#### 4.3 - GET /api/dashboard/ranking
Retorna TOP 10 alunos por:
- Pontos
- Quizzes concluídos
- Avatares colecionados

#### 4.4 - POST /api/dashboard/relatorios/export
Exportar dados em:
- CSV
- PDF
- Excel

---

## 🗃️ ESTRUTURA DE BANCO MELHORADA

### Novas Tabelas Necessárias

#### 1. atividades_alunos
```sql
CREATE TABLE atividades_alunos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  aluno_id INT NOT NULL,
  tipo ENUM('quiz_realizado', 'avatar_comprado', 'loja_visitada', 'login'),
  descricao VARCHAR(255),
  dados JSON,
  data_atividade TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (aluno_id) REFERENCES alunos(id)
);
```

#### 2. desempenho_quizzes
```sql
CREATE TABLE desempenho_quizzes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  aluno_id INT NOT NULL,
  quiz_id INT NOT NULL,
  acertos INT,
  erros INT,
  nota INT,
  tempo_realizado INT,
  data_quiz TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (aluno_id) REFERENCES alunos(id),
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
);
```

#### 3. avatares_alunos
```sql
CREATE TABLE avatares_alunos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  aluno_id INT NOT NULL,
  avatar_id INT NOT NULL,
  data_compra TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (aluno_id) REFERENCES alunos(id)
);
```

---

## 📊 PRIORIDADE DE IMPLEMENTAÇÃO

### 🔴 CRÍTICO (fazer primeiro)
1. Melhorar GET /api/instituicoes com total de alunos
2. Novo endpoint GET /api/dashboard/resumo
3. Adicionar métodos getTotalAlunos, getTotalProfessores
4. Melhorar MockDB com dados de atividades

### 🟡 IMPORTANTE (fazer próximo)
1. Melhorar GET /api/instituicoes/:id/alunos com mais dados
2. Novo endpoint GET /api/instituicoes/:id/professores
3. Novo endpoint GET /api/instituicoes/:id/turmas
4. Criar lib/estatisticas.js

### 🟢 NICE-TO-HAVE (depois)
1. GET /api/alunos/:id/atividades
2. GET /api/dashboard/ranking
3. POST /api/dashboard/relatorios/export
4. Novos endpoints avançados

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Fase 1: Endpoints melhorados
  - [ ] GET /api/instituicoes (com contagem)
  - [ ] GET /api/dashboard/resumo (novo)
  - [ ] GET /api/instituicoes/:id/alunos (melhorado)
  - [ ] GET /api/instituicoes/:id/professores (novo)
  - [ ] GET /api/instituicoes/:id/turmas (novo)

- [ ] Fase 2: Modelos novos
  - [ ] lib/estatisticas.js
  - [ ] Métodos Aluno.getAtividades()
  - [ ] Métodos Parceria.getTotalAlunos()

- [ ] Fase 3: MockDB melhorado
  - [ ] Adicionar atividades
  - [ ] Adicionar desempenho
  - [ ] Adicionar mais quizzes

- [ ] Fase 4: Endpoints avançados
  - [ ] GET /api/dashboard/instituicoes-detalhes
  - [ ] GET /api/dashboard/alunos-detalhes
  - [ ] GET /api/dashboard/ranking
  - [ ] POST /api/dashboard/relatorios/export

---

**Status**: Pronto para implementação
**Data**: 30/05/2026
**Tempo estimado**: 4-6 horas (Fase 1-3)
