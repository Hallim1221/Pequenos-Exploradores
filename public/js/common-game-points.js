(function () {
  var script = document.currentScript;
  var slug = script && script.getAttribute('data-jogo');
  var token;
  var erroPartida;
  var finishing = false;
  var finished = false;
  var partida = fetch('/api/jogos/partidas', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ jogo: slug })
  }).then(function (response) {
    return response.json().then(function (data) {
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Não foi possível iniciar a partida.');
      }
      token = data.token;
    });
  }).catch(function (error) {
    erroPartida = error;
  });

  function avisar(mensagem, erro) {
    var aviso = document.getElementById('pe-pontos-aviso-comum');
    if (!aviso) {
      aviso = document.createElement('div');
      aviso.id = 'pe-pontos-aviso-comum';
      aviso.setAttribute('role', erro ? 'alert' : 'status');
      aviso.setAttribute('aria-live', erro ? 'assertive' : 'polite');
      aviso.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:2147483000;border-radius:999px;padding:12px 22px;font:600 16px/1.3 "Fredoka","Nunito",system-ui,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.25);max-width:calc(100vw - 32px);text-align:center;color:#fff;';
      document.body.appendChild(aviso);
    }
    aviso.style.background = erro ? '#b3261e' : '#2e7d32';
    aviso.textContent = mensagem;
    clearTimeout(avisar.timer);
    avisar.timer = setTimeout(function () {
      aviso.remove();
    }, 5000);
  }

  window.PEJogoComum = {
    concluir: function (opcoes) {
      if (finishing || finished) return;
      finishing = true;
      opcoes = opcoes || {};

      partida.then(function () {
        if (erroPartida) throw erroPartida;
        if (!token) throw new Error('Partida sem token de conclusão.');
        return fetch('/api/jogos/partidas/' + encodeURIComponent(token) + '/concluir', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            desempenho: opcoes.desempenho,
            resultado: opcoes.resultado || ''
          })
        });
      }).then(function (response) {
        return response.json().then(function (data) {
          if (!response.ok || !data.success) {
            throw new Error(data.message || 'Não foi possível registrar os pontos.');
          }
          finished = true;
          if (data.pontos > 0) {
            avisar('⭐ +' + data.pontos + ' pontos! Total: ' + data.total + ' pontos.');
          } else if (data.mensagem) {
            avisar(data.mensagem);
          }
        });
      }).catch(function (error) {
        console.error('Erro ao registrar pontos do jogo comum:', error);
        avisar('Não foi possível registrar seus pontos. Verifique a conexão e tente novamente.', true);
      }).then(function () {
        finishing = false;
      });
    }
  };
})();
