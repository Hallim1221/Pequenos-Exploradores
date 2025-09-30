// Arquivo principal do servidor Express
const express = require('express');
const path = require('path');

const indexRouter = require('./routes/index');
const professorRouter = require('./routes/professor');

const app = express();

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
<<<<<<< HEAD
=======
    
    // Sessão
    const session = require('express-session');
    app.use(session({
      secret: 'pequenos-exploradores-secret',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false } // true se usar https
    }));
>>>>>>> d37a33b (commit inicial do projeto e ajustes visuais na página aluno2)

// Rotas

app.use('/', indexRouter);
app.use('/professor', professorRouter);

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
