# Implementação de Cadastro de Parcerias - Página Parcerias com Escolas

## O que foi implementado?

### 1. **Modelo de Dados** (models/Parceria.js)
- Classe `Parceria` com métodos para gerenciar parcerias com escolas
- Métodos implementados:
  - `criar(dados)` - Cria nova solicitação de parceria
  - `buscarPorId(id)` - Busca parceria pelo ID
  - `buscarPorEmail(email)` - Busca parceria pelo email
  - `listarTodas()` - Lista todas as parcerias
  - `atualizarStatus(id, status)` - Atualiza o status
  - `validar(dados)` - Valida os dados antes de salvar

### 2. **Validações Implementadas**
- Nome completo: mínimo 3 caracteres
- Email: formato válido com @
- Telefone: mínimo 10 dígitos
- Cidade: obrigatória com mínimo 2 caracteres
- Nome da escola: mínimo 3 caracteres
- Cargo: obrigatório
- Tipo de escola: obrigatório
- Código MEC: opcional

### 3. **Rota Backend** (routes/index.js)
- `GET /parcerias-escolas` - Renderiza a página
- `POST /parcerias-escolas` - Processa o formulário
  - Valida dados
  - Verifica se email já existe
  - Salva no banco de dados
  - Retorna JSON com sucesso ou erro

### 4. **Frontend** (views/parcerias-escolas.ejs)
- Atualização do formulário com:
  - Atributos `name` em todos os inputs/selects
  - Method POST e action para o servidor
  - Submissão via AJAX (sem recarregar página)
- Tratamento de resposta:
  - Sucesso: mostra mensagem de confirmação
  - Erro: exibe mensagens de validação

### 5. **Banco de Dados**
Arquivo SQL criado: `config/parcerias_escolas.sql`

## Como usar?

### Passo 1: Criar a tabela no banco de dados
Execute o SQL em `config/parcerias_escolas.sql` no seu MySQL:

```sql
CREATE TABLE IF NOT EXISTS parcerias_escolas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome_contato VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  telefone VARCHAR(20) NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  nome_escola VARCHAR(255) NOT NULL,
  cargo VARCHAR(100) NOT NULL,
  tipo_escola VARCHAR(100) NOT NULL,
  codigo_mec VARCHAR(20),
  data_solicitacao DATETIME DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pendente',
  data_resposta DATETIME,
  especialista_id INT,
  notas TEXT,
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_data (data_solicitacao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Passo 2: Reiniciar o servidor
```bash
npm start
```

### Passo 3: Testar
1. Acesse http://localhost:3000/parcerias-escolas
2. Preencha o formulário
3. Clique em "Solicitar uma conversa 🚀"
4. A página deve mostrar a mensagem de sucesso

## Estrutura dos dados salvos

Quando uma escola se cadastra, os seguintes dados são salvos:

```javascript
{
  id: 1,
  nome_contato: "João Silva",
  email: "joao@escola.com.br",
  telefone: "(11) 98765-4321",
  cidade: "São Paulo",
  nome_escola: "Escola Exemplo",
  cargo: "Diretor(a)",
  tipo_escola: "Pública municipal",
  codigo_mec: "12345678",
  data_solicitacao: "2026-05-20 10:30:00",
  status: "pendente",
  data_resposta: null,
  especialista_id: null,
  notas: null
}
```

## Verificar dados no banco

Use esta query para listar todas as solicitações:

```sql
SELECT * FROM parcerias_escolas ORDER BY data_solicitacao DESC;
```

## Tratamento de erros

### Validação fallback
Se o banco de dados estiver indisponível, o sistema usa `mockdb` automaticamente para não quebrar a aplicação.

### Mensagens de erro retornadas
- "Nome completo deve ter pelo menos 3 caracteres"
- "E-mail inválido"
- "Telefone deve ter pelo menos 10 dígitos"
- "Cidade é obrigatória"
- "Nome da escola deve ter pelo menos 3 caracteres"
- "Cargo é obrigatório"
- "Tipo de escola é obrigatório"
- "Já existe uma solicitação associada a este e-mail"

## Próximos passos (Opcional)

1. Implementar envio de email para confirmar o cadastro
2. Criar dashboard para visualizar solicitações
3. Adicionar atribuição de especialista
4. Implementar comunicação por chat
5. Enviar notificação para equipe quando nova solicitação chegar

## Arquivos modificados

- `models/Parceria.js` - NOVO
- `routes/index.js` - Adicionado importação e rotas
- `views/parcerias-escolas.ejs` - Atualizado formulário e JavaScript
- `config/parcerias_escolas.sql` - NOVO
