# 📚 Guia de Endpoints da API - Pequenos Exploradores

## 🔐 Autenticação Requerida

### Login & Logout
```
POST /aluno/login
  Body: { email, senha }
  Response: { success, redirect, message }

POST /professor/login
  Body: { email, senha }
  Response: { success, redirect, message }

POST /gestao/login
  Body: { email, senha }
  Response: { success, redirect, message }

GET /logout
  Response: { success, message }
```

---

## 👥 APIs de Alunos

### Listar/Buscar
```
GET /api/alunos (todos os alunos)
  Auth: Requerida
  Response: { success, alunos: [...] }

GET /api/alunos/:id (aluno específico)
  Auth: Requerida
  Response: { success, aluno: {...} }
```

### Atualizar
```
PUT /api/alunos/:id
  Auth: Requerida (próprio aluno ou admin)
  Body: { nome?, email? }
  Response: { success, message }
```

### Saldo
```
POST /api/alunos/:id/saldo/adicionar
  Auth: Requerida (admin)
  Body: { valor }
  Response: { success, message }

POST /api/alunos/:id/saldo/subtrair
  Auth: Requerida (admin)
  Body: { valor }
  Response: { success, message }
```

---

## 👨‍🏫 APIs de Professores

### Atualizar
```
PUT /api/professores/:id
  Auth: Requerida (próprio professor ou admin)
  Body: { nome?, email? }
  Response: { success, message }
```

---

## 🏫 APIs de Instituições (Parcerias)

### Listar
```
GET /api/instituicoes
  Auth: Requerida (admin)
  Response: { success, instituicoes: [...] }
```

### Atualizar Plano
```
PUT /api/instituicoes/:id/plano
  Auth: Requerida (admin)
  Body: { plano: "premium" | "comum" | "em-andamento" }
  Response: { success, message }
```

### Listar Alunos da Instituição
```
GET /api/instituicoes/:id/alunos
  Auth: Requerida (admin)
  Response: { success, total, alunos: [...] }
```

---

## 📚 APIs de Quiz

### Listar Quizzes
```
GET /api/quizzes
  Auth: Não requerida
  Response: { success, total, quizzes: [...] }
```

### Buscar Quiz com Perguntas
```
GET /api/quizzes/:id
  Auth: Não requerida
  Response: { success, quiz: {...} }
```

### Criar Quiz
```
POST /api/quizzes
  Auth: Requerida (professor ou admin)
  Body: { titulo, tema, tipo_ambiente? }
  Response: { success, message, quiz: {...} }
```

### Responder Quiz
```
POST /api/quizzes/:id/responder
  Auth: Requerida (aluno autenticado)
  Body: { pergunta_id, opcao_id, tempo_resposta? }
  Response: { success, message, aluno_id, pergunta_id, opcao_id }
```

### Obter Resultado
```
GET /api/quizzes/:id/resultado/:aluno_id
  Auth: Requerida (aluno ou admin)
  Response: { success, resultado: {...} }
```

---

## 🚀 Turmas

### Atualizar
```
PUT /api/turmas/:id
  Auth: Requerida (professor ou admin)
  Body: { nome?, ano?, professor_id? }
  Response: { success, message }
```

---

## 🔑 Autenticação

### Tipos de Usuário
- `aluno` - Acesso limitado aos dados pessoais
- `professor` - Acesso a turmas e quizzes
- `gestao` - Acesso à instituição
- `admin` - Acesso total

### Headers Requeridos
```
Session Cookie: SESSIONID
X-Requested-With: XMLHttpRequest (opcional, para AJAX)
```

### Status de Erro Comuns
```
401 - Não autenticado
403 - Acesso negado (permissão insuficiente)
400 - Validação falhou
500 - Erro no servidor
```

---

## 🔒 Segurança

- ✅ Senhas hasheadas com bcrypt
- ✅ Rate limiting em logins
- ✅ Validação de input
- ✅ Proteção CSRF via session
- ✅ Sanitização de dados

---

## 📝 Exemplos de Requisição

### Login Aluno
```bash
curl -X POST http://localhost:3000/aluno/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@test.com","senha":"senha123"}'
```

### Atualizar Plano de Instituição
```bash
curl -X PUT http://localhost:3000/api/instituicoes/1/plano \
  -H "Content-Type: application/json" \
  -d '{"plano":"premium"}'
```

### Listar Quizzes
```bash
curl http://localhost:3000/api/quizzes
```

---

## 📊 Rate Limiting

- **Login**: 5 tentativas a cada 15 minutos
- **APIs**: 100 requisições a cada 15 minutos
- **Operações sensíveis**: 10 requisições a cada 1 hora
