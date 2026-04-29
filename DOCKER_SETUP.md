# 🐳 Docker Setup para Pequenos Exploradores

## Pré-requisitos
1. **Instale Docker Desktop**: https://www.docker.com/products/docker-desktop
2. Reinicie o Windows após a instalação

## 🚀 Executar o MySQL com Docker

### 1. Abra PowerShell na pasta do projeto
```powershell
cd "c:\Users\Hallim Alves Tavares\OneDrive\Documentos\Pequenos exploradores"
```

### 2. Inicie o Docker Compose
```powershell
docker-compose up -d
```

Este comando vai:
- ✅ Baixar a imagem MySQL 8.0
- ✅ Criar um container chamado `pequenos-exploradores-db`
- ✅ Executar o arquivo `config/database.sql` automaticamente
- ✅ Rodar na porta 3306

### 3. Aguarde ~20 segundos para o MySQL inicializar

### 4. Confirme que está rodando
```powershell
docker ps
```

Deve aparecer:
```
CONTAINER ID   IMAGE      STATUS          PORTS
xxx            mysql:8.0  Up 2 minutes    0.0.0.0:3306->3306/tcp
```

### 5. Execute o setup do Node.js
```powershell
node setup-db.js
```

Agora deve mostrar: ✅ Conectado ao MySQL!

---

## 📝 Credenciais do MySQL (Docker)
```
Host: localhost
User: tcc
Password: (deixe em branco)
Database: tcc-mysql2.0
Port: 3306
```

---

## 🛑 Parar o MySQL
```powershell
docker-compose down
```

## 🔄 Reiniciar o MySQL
```powershell
docker-compose restart
```

## 📊 Verificar logs
```powershell
docker-compose logs -f mysql
```

---

## ⚠️ Se tiver erro ECONNREFUSED ainda:

1. Verifique se o Docker está rodando:
   ```powershell
   docker ps
   ```

2. Se o container não aparecer, reinicie:
   ```powershell
   docker-compose up -d
   ```

3. Aguarde 30 segundos e tente novamente:
   ```powershell
   node setup-db.js
   ```

---

## 💡 Depois que o MySQL estiver OK:

Inicie o servidor Node:
```powershell
npm start
```

Acesse: http://localhost:3000

Faça um cadastro de aluno - deve salvar no BD! 🎉

---

## 🐳 Docker Desktop Link
👉 https://www.docker.com/products/docker-desktop
