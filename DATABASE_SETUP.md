# Setup do Banco de Dados - Pequenos Exploradores

## 📋 Requisitos
- MySQL Server 5.7+ instalado e rodando
- Node.js v14+ instalado

## 🚀 Passo a Passo

### 1. Copiar variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais MySQL:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=tcc-mysql2.0
DB_PORT=3306
```

### 2. Criar o banco de dados

Abra o MySQL e execute:
```bash
mysql -u root -p < config/database.sql
```

Ou acesse via MySQL Workbench/PHPMyAdmin e execute o conteúdo do arquivo `config/database.sql`.

### 3. Instalar dependências
```bash
npm install
```

### 4. Iniciar o servidor
```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`

---

## 📁 Estrutura de Pastas

```
├── config/
│   ├── database.js          # Pool de conexões MySQL
│   └── database.sql         # Script para criar banco e tabelas
├── models/
│   ├── Aluno.js             # Modelo para tabela alunos
│   ├── Professor.js         # Modelo para tabela professores
│   ├── Turma.js             # Modelo para tabela turmas
│   ├── Quiz.js              # Modelo para tabela quizzes
│   ├── Pergunta.js          # Modelo para tabela perguntas
│   ├── Opcao.js             # Modelo para tabela opcoes
│   ├── Resposta.js          # Modelo para tabela respostas
│   └── Ranking.js           # Modelo para ranking
├── routes/
│   ├── index.js             # Rotas gerais + login aluno/gestão
│   └── professor.js         # Rotas professor
```

---

## 🔑 Funcionalidades Implementadas

### Autenticação
- ✅ Login do Aluno com validação no BD
- ✅ Cadastro do Aluno com verificação de email único
- ✅ Login do Professor com validação no BD
- ✅ Login de Gestão (básico)

### Modelos Disponíveis

#### Aluno
```javascript
const Aluno = require('./models/Aluno');

// Criar
await Aluno.criar(nome, email, senha);

// Buscar
await Aluno.buscarPorId(id);
await Aluno.buscarPorEmail(email);

// Listar
await Aluno.listarTodos();

// Atualizar saldo
await Aluno.atualizarSaldo(id, novoSaldo);
```

#### Professor
```javascript
const Professor = require('./models/Professor');

// Criar
await Professor.criar(nome, email, senha, instituicao);

// Buscar
await Professor.buscarPorId(id);
await Professor.buscarPorEmail(email);

// Listar
await Professor.listarTodos();
```

#### Turma
```javascript
const Turma = require('./models/Turma');

// Criar
await Turma.criar(nome, professor_id, ano_escolar);

// Listar alunos da turma
await Turma.listarAlunosDaTurma(turma_id);

// Adicionar aluno
await Turma.adicionarAluno(turma_id, aluno_id);
```

#### Quiz
```javascript
const Quiz = require('./models/Quiz');

// Criar
await Quiz.criar(titulo, tema, tipo_ambiente);

// Buscar com perguntas
await Quiz.buscarPorId(id);

// Listar por tema
await Quiz.listarPorTema('natureza');
```

---

## 🧪 Testando a Integração

### Cadastro de Aluno
1. Acesse `http://localhost:3000/aluno/cadastro`
2. Preencha os dados (nome, email, senha)
3. Deve criar no banco e redirecionar para `/aluno`

### Login de Aluno
1. Acesse `http://localhost:3000/login`
2. Clique em "Aluno" e entre
3. Use email e senha cadastrados anteriormente

### Verificar dados no BD
```bash
mysql -u root -p tcc-mysql2.0

# Ver alunos
SELECT * FROM alunos;

# Ver professores
SELECT * FROM professores;

# Ver turmas
SELECT * FROM turmas;
```

---

## ⚠️ Notas Importantes

- **Segurança**: Senhas estão sendo armazenadas em texto plano. Considere usar `bcrypt` para hash:
  ```bash
  npm install bcrypt
  ```

- **Variáveis de Ambiente**: Instale `dotenv`:
  ```bash
  npm install dotenv
  ```
  E no `app.js`, adicione no topo:
  ```javascript
  require('dotenv').config();
  ```

- **Pool de Conexões**: O arquivo `config/database.js` já usa pool com limite de 10 conexões simultâneas.

---

## 🆘 Troubleshooting

### Erro: "Access denied for user 'root'@'localhost'"
- Verifique credenciais no `.env`
- Certifique-se que MySQL está rodando

### Erro: "Unknown database 'tcc-mysql2.0'"
- Execute o script SQL: `mysql -u root -p < config/database.sql`

### Erro: "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR"
- Verifique se MySQL está rodando: `mysql -u root -p -e "SELECT 1"`

---

## 📞 Suporte
Para dúvidas sobre a integração, verifique os arquivos de modelo na pasta `models/`.
