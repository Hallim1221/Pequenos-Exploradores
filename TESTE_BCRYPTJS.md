# 🧪 Teste Rápido - Bcryptjs Implementado

## ✅ Verificar a Instalação

### 1. Verificar bcryptjs no package.json
```bash
npm ls bcryptjs
```

**Resultado esperado**: 
```
└── bcryptjs@2.4.3
```

---

## 📋 Passos para Testar

### Passo 1: Executar o Script SQL
Execute o comando no seu terminal MySQL:

```bash
mysql -u root -p tcc-mysql2.0 < config/alter-senha-field.sql
```

**Ou manualmente no MySQL**:
```sql
USE `tcc-mysql2.0`;
ALTER TABLE alunos MODIFY COLUMN senha CHAR(60) NOT NULL;
ALTER TABLE professores MODIFY COLUMN senha CHAR(60) NOT NULL;
ALTER TABLE gestao MODIFY COLUMN senha CHAR(60) NOT NULL;
```

---

### Passo 2: Iniciar a Aplicação
```bash
npm start
```

A aplicação deve iniciar em `http://localhost:3000`

---

### Passo 3: Registrar um Novo Aluno
1. Acesse: `http://localhost:3000/aluno/cadastro`
2. Preencha o formulário com:
   - Nome: `Teste Bcrypt`
   - Email: `teste@bcrypt.com`
   - Senha: `Senha123`
   - Confirmar Senha: `Senha123`
3. Clique em "Cadastrar"

**Resultado esperado**: Redirecionado para `/aluno`

---

### Passo 4: Verificar no Banco de Dados
Execute a query abaixo para verificar a senha hasheada:

```sql
SELECT id, nome, email, senha FROM alunos WHERE email = 'teste@bcrypt.com';
```

**Resultado esperado**:
```
+----+---------------+------------------+---------------------------------------------+
| id | nome          | email            | senha                                       |
+----+---------------+------------------+---------------------------------------------+
| 1  | Teste Bcrypt  | teste@bcrypt.com | $2a$10$... (60 caracteres)                  |
+----+---------------+------------------+---------------------------------------------+
```

⚠️ A senha **NUNCA** deve aparecer em texto plano!

---

### Passo 5: Testar o Login
1. Acesse: `http://localhost:3000/aluno/login`
2. Use as credenciais:
   - Email: `teste@bcrypt.com`
   - Senha: `Senha123`
3. Clique em "Entrar"

**Resultado esperado**: Login bem-sucedido, redirecionado para `/aluno`

---

### Passo 6: Testar com Senha Incorreta
1. Acesse novamente: `http://localhost:3000/aluno/login`
2. Use as credenciais:
   - Email: `teste@bcrypt.com`
   - Senha: `SenhaErrada`
3. Clique em "Entrar"

**Resultado esperado**: Mensagem de erro "Credenciais inválidas"

---

## 📊 Checklist de Verificação

- [ ] bcryptjs está instalado (`npm ls bcryptjs`)
- [ ] Campo senha alterado para char(60) no banco
- [ ] Novo aluno registrado com sucesso
- [ ] Senha do aluno é um hash bcrypt (começa com `$2a$10$`)
- [ ] Login com senha correta funciona
- [ ] Login com senha incorreta retorna erro
- [ ] lib/seguranca.js usa `bcryptjs` e não `bcrypt`

---

## 🔍 Troubleshooting

### Erro: "Cannot find module 'bcryptjs'"
```bash
npm install bcryptjs
npm start
```

### Erro no SQL: "Table doesn't exist"
Certifique-se de que está usando o banco correto:
```sql
USE `tcc-mysql2.0`;
SHOW TABLES;
```

### Hash começa com texto plano (não com $2a$10$)
- Pode ser um aluno antigo registrado antes da implementação
- O sistema ainda funciona (verifica ambos os tipos)
- Considere migrar senhas antigas gradualmente

### Login falha após registrar
1. Verifique se o banco de dados foi alterado para char(60)
2. Limpe cookies/cache do navegador
3. Tente em uma aba anônima/privada

---

## 📝 Notas Importantes

✅ O sistema é **retrocompatível** com senhas antigas em texto plano  
✅ Senhas novas serão **sempre** hasheadas com bcryptjs  
✅ Hashes bcryptjs começam com `$2a$10$`, `$2b$10$` ou `$2y$10$`  
✅ Não exponha os hashes em logs ou mensagens de erro  

---

**Data**: 01/06/2026  
**Status**: Pronto para teste
