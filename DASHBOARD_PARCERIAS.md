# Dashboard Admin - Documentação de Parcerias

## Implementação Completa

### 1. **Backend**

#### Rota de Listar Parcerias
```javascript
GET /dashboard-admin
```
Retorna a view do dashboard com lista de parcerias em tempo real.

#### Rota de Criar Parceria
```javascript
POST /parcerias-escolas
```
Cria nova solicitação de parceria com validações.

#### Rota de Atualizar Status
```javascript
PATCH /api/parcerias/:id/status
```
Atualiza o status de uma parceria:
- `pendente` - Aguardando resposta
- `em_andamento` - Em negociação
- `concluido` - Parceria fechada
- `rejeitado` - Rejeitada

### 2. **Frontend - Dashboard Admin**

#### Nova Aba de Navegação
- Item "Parcerias" adicionado na sidebar
- Navega para a seção de gerenciamento de parcerias

#### Seção de Parcerias
- Tabela com todas as solicitações
- Filtro por status (Pendente, Em Andamento, Concluído, Rejeitado)
- Busca por escola, email ou contato
- Coluna de ações:
  - 👁️ Visualizar
  - ✏️ Editar (atualizar status)

#### Status com Cores
- 🟠 **Pendente** - Laranja (#FEF3DC)
- 🔵 **Em Andamento** - Azul (#E5F0FB)
- ✅ **Concluído** - Verde (#E8F5D6)
- ❌ **Rejeitado** - Vermelho (#FDEAEA)

### 3. **Fluxo de Funcionamento**

1. **Escola acessa /parcerias-escolas**
   - Preenche formulário com dados
   - Clica em "Solicitar uma conversa 🚀"
   - Dados são enviados via AJAX para o servidor

2. **Servidor valida e salva**
   - Valida todos os campos obrigatórios
   - Verifica se email já existe
   - Salva no banco de dados com status "pendente"
   - Retorna confirmação para o cliente

3. **Admin vê no Dashboard**
   - Acessa http://localhost:3000/dashboard-admin
   - Clica em "Parcerias" no menu
   - Vê todas as solicitações em uma tabela
   - Pode filtrar por status
   - Pode buscar por nome da escola/email

4. **Admin atualiza status**
   - Clica no botão ✏️ ao lado da parceria
   - Seleciona o novo status
   - Status é atualizado no banco
   - Tabela é recarregada automaticamente

### 4. **Modelos de Dados**

#### Tabela `parcerias_escolas`
```sql
CREATE TABLE parcerias_escolas (
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
)
```

### 5. **Testes**

#### Teste 1: Criar Solicitação
```bash
curl -X POST http://localhost:3000/parcerias-escolas \
  -H "Content-Type: application/json" \
  -d '{
    "nome_contato": "João Silva",
    "email": "joao@escola.com.br",
    "telefone": "(11) 98765-4321",
    "cidade": "São Paulo",
    "nome_escola": "Escola Exemplo",
    "cargo": "Diretor(a)",
    "tipo_escola": "Pública municipal",
    "codigo_mec": "12345678"
  }'
```

#### Teste 2: Atualizar Status
```bash
curl -X PATCH http://localhost:3000/api/parcerias/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "em_andamento"}'
```

#### Teste 3: Acessar Dashboard
```
http://localhost:3000/dashboard-admin
```
(Clique em "Parcerias" no menu lateral)

### 6. **Próximos Passos (Opcionais)**

1. **Implementar Email**
   - Enviar email de confirmação para a escola
   - Notificar admin quando nova solicitação chegar

2. **Assigning Especialista**
   - Permitir atribuição de especialista à parceria
   - Notificar especialista da atribuição

3. **Chat Integrado**
   - Permitir comunicação direto no dashboard
   - Histórico de mensagens por parceria

4. **Relatórios**
   - Taxa de conversão de solicitações
   - Tempo médio de resposta
   - Valor total de parcerias fechadas

5. **Automações**
   - Auto-responder com templates
   - Escalonamento automático se sem resposta
   - Geração de contrato PDF

## Troubleshooting

### Tabela vazia no Dashboard
**Problema:** Não aparecem parcerias na tabela
**Solução:** 
1. Execute o SQL para criar a tabela
2. Certifique-se que as solicitações foram criadas em /parcerias-escolas
3. Verifique os logs: `console.log()` no navegador

### Erro ao atualizar status
**Problema:** "Erro ao atualizar: Parceria não encontrada"
**Solução:** Verifique se o ID está correto no banco de dados

### PATCH não funciona
**Problema:** Erro 404 ou 405
**Solução:** Certifique-se que o Express está permitindo PATCH requests
```javascript
const express = require('express');
const app = express();
app.use(express.json()); // Necessário para ler JSON
```
