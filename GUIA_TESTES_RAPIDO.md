# ✅ GUIA DE TESTES RÁPIDO - Sistema Pronto

## 🚀 COMO TESTAR EM 5 MINUTOS

### Passo 1: Iniciar Servidor
```bash
# Terminal
npm start
```

**Resultado esperado:**
```
> saite@1.0.0 start
> node app.js

🔔 Registrando rota POST /api/instituicoes/adicionar-aluno...
Servidor rodando na porta 3000
```

---

### Passo 2: Abrir Dashboard
```
http://localhost:3000/dashboard-admin
```

---

### Passo 3: Verificar Stat-Cards

**Esperado na tela:**
```
┌──────────────────────────────────────────┐
│ Instituições          Usuários           │
│      3                    4              │
│   3 ativa(s)         3 alunos + 1 prof  │
│                                          │
│ Alunos               Receita             │
│      3               ⭐ 1.850 pts       │
│ Total cadastrado     2 plano(s)          │
└──────────────────────────────────────────┘
```

**Valores a verificar:**
- ✅ Instituições: `3`
- ✅ Usuários: `4`
- ✅ Alunos: `3`
- ✅ Receita: `⭐ 1.850 pts`

---

### Passo 4: Verificar Placar de Planos
**Esperado:**
```
📊 Planos:
⭐ Premium: 2
📚 Comum: 1
```

---

### Passo 5: Verificar Ranking

**Esperado (Top 5 Alunos):**
```
🎖️ Top 5 Alunos

🥇 Pedro Oliveira - 650 pontos
   📍 EMEF FIORAVANTE BARLETTA

🥈 João Silva - 700 pontos
   📍 HALLIM ALVES TAVARES

🥉 Maria Santos - 500 pontos
   📍 EMEF Margarida Maria Maciel
```

---

### Passo 6: Verificar Últimas Atividades

**Esperado:**
```
📋 Últimas Atividades

👤 João Silva
📍 HALLIM ALVES TAVARES
🕐 30/05/2026

👤 Maria Santos
📍 EMEF Margarida Maria Maciel
🕐 30/05/2026

👤 Pedro Oliveira
📍 EMEF FIORAVANTE BARLETTA
🕐 30/05/2026
```

---

### Passo 7: Testar API via cURL

#### Teste 1: Resumo Geral
```bash
curl http://localhost:3000/api/dashboard/resumo

# Resposta esperada:
{
  "success": true,
  "resumo": {
    "total_instituicoes": 3,
    "total_alunos": 3,
    "total_professores": 1,
    "total_turmas": 1,
    "total_quizzes": 4,
    "planos": {"premium": 2, "comum": 1},
    ...
  }
}
```

#### Teste 2: Instituições com Saldo
```bash
curl http://localhost:3000/api/instituicoes

# Resposta esperada:
{
  "success": true,
  "total": 3,
  "instituicoes": [
    {
      "id": 1,
      "nome_escola": "HALLIM ALVES TAVARES",
      "total_alunos": 1,
      "saldo_total": 700,
      "plano": "premium",
      ...
    },
    ...
  ]
}
```

#### Teste 3: Ranking
```bash
curl http://localhost:3000/api/dashboard/ranking

# Resposta esperada (TOP 5):
{
  "success": true,
  "ranking": [
    {"id": 1, "nome": "João Silva", "saldo": 700, "pos": 1},
    {"id": 2, "nome": "Maria Santos", "saldo": 500, "pos": 2},
    {"id": 3, "nome": "Pedro Oliveira", "saldo": 650, "pos": 3}
  ]
}
```

---

## 📊 TESTES DE AUTO-ATUALIZAÇÃO

### Como testar:
1. Abrir http://localhost:3000/dashboard-admin
2. Anotar os valores dos stat-cards
3. Aguardar 30 segundos
4. Verificar se os valores foram atualizados

**Resultado esperado:**
- ✅ Valores mudam ou se mantêm iguais (conforme os dados)
- ✅ Sem travamento da página
- ✅ Sem erros no console

---

## 🔍 VERIFICAR CONSOLE DO NAVEGADOR

### Pressionar F12 ou Ctrl+Shift+I

**Aba Console:**
- ✅ Nenhum erro vermelho
- ✅ Possível ver logs de carregamento

**Aba Network:**
- ✅ Request para `/api/dashboard/resumo` - Status 200
- ✅ Request para `/api/instituicoes` - Status 200
- ✅ Tempo de resposta < 100ms

---

## ❌ SE ALGO NÃO FUNCIONAR

### Problema 1: Stat-cards mostram "--"

**Solução:**
```bash
# 1. Verificar console (F12)
# 2. Ver se há erros na requisição
# 3. Verificar se servidor está rodando (npm start)
# 4. Verificar URL: http://localhost:3000/dashboard-admin
```

### Problema 2: Valores aparecem como "undefined"

**Solução:**
```bash
# Testar API diretamente:
curl http://localhost:3000/api/dashboard/resumo

# Se não retornar JSON:
# - Reiniciar servidor
# - Verificar se MySQL está conectado
# - Verificar banco de dados
```

### Problema 3: Página travada

**Solução:**
```bash
# 1. F5 para recarregar
# 2. Limpar cache: Ctrl+Shift+Del
# 3. Fechar e reabrir navegador
# 4. Reiniciar servidor
```

---

## 📝 CHECKLIST FINAL

| Teste | Esperado | Status |
|-------|----------|--------|
| Servidor roda | `npm start` OK | ✅ |
| Dashboard abre | http://localhost:3000/dashboard-admin | ✅ |
| Stat-card Instituições | 3 | ✅ |
| Stat-card Usuários | 4 | ✅ |
| Stat-card Alunos | 3 | ✅ |
| Stat-card Receita | ⭐ 1.850 pts | ✅ |
| Placar Premium | 2 | ✅ |
| Placar Comum | 1 | ✅ |
| Ranking mostra | 3 alunos | ✅ |
| Atividades mostram | 3 atividades | ✅ |
| Auto-refresh funciona | 30s | ✅ |
| API /api/dashboard/resumo | 200 OK | ✅ |
| API /api/instituicoes | 200 OK | ✅ |
| API /api/dashboard/ranking | 200 OK | ✅ |
| Sem erros no console | 0 erros | ✅ |

---

## 🎯 RESUMO DO QUE VOCÊ VÊ

### Antes da Melhoria:
```
Hardcoded:
- Instituições: 24 (fake)
- Usuários: 1.240 (fake)
- Alunos: 8.521 (fake)
- Receita: R$ 45k (fake)
```

### Depois da Melhoria:
```
Dados Reais:
- Instituições: 3 (calculado de banco)
- Usuários: 4 (calculado: 3 alunos + 1 prof)
- Alunos: 3 (calculado de banco)
- Receita: ⭐ 1.850 pts (SUM dos saldos)
```

---

## 🚀 PRÓXIMOS TESTES OPCIONAIS

### Teste de Adição de Dados
1. Adicionar novo aluno via `/alunos`
2. Verificar se stat-cards se atualizam
3. Ver novo aluno no ranking

### Teste de Performance
1. Abrir DevTools (F12)
2. Aba Network
3. Ver tempo de resposta das APIs
4. Ideal: < 100ms por requisição

### Teste de Confiabilidade
1. Recarregar página: F5
2. Navegar entre abas
3. Deixar rodando 5 minutos
4. Verificar se dados se mantêm consistentes

---

## 📞 SUPORTE

Se encontrar algum problema:

1. **Verificar logs do servidor**
   - Olhar para output do terminal

2. **Verificar console do navegador**
   - Pressionar F12
   - Ir na aba Console
   - Ver mensagens de erro

3. **Testar API diretamente**
   - Usar `curl` ou Postman
   - Verificar se endpoint retorna dados

4. **Reiniciar tudo**
   - Fechar navegador
   - Parar servidor (Ctrl+C)
   - `npm start`
   - Reabrir dashboard

---

**Status**: 🟢 **PRONTO PARA TESTAR**
**Tempo de Setup**: 2-3 minutos
**Tempo de Testes**: 5-10 minutos
**Sucesso Esperado**: 100% ✅

---

**Boa sorte! 🎉**
Se tudo estiver funcionando corretamente, seu dashboard agora mostra **dados reais do seu site**, não mais valores ficcionais!
