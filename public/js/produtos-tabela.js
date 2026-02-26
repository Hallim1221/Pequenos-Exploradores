
document.addEventListener('DOMContentLoaded', function() {
  // Array de produtos simulados
  let produtos = [
    { nome: 'Produto A', preco: 10.99, estoque: 12 },
    { nome: 'Produto B', preco: 25.50, estoque: 7 },
    { nome: 'Produto C', preco: 7.30, estoque: 30 }
  ];

  function renderTabela() {
    const tbody = document.getElementById('produtos-tbody');
    tbody.innerHTML = '';
    produtos.forEach((produto, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${produto.nome}</td>
        <td>R$ ${produto.preco.toFixed(2)}</td>
        <td>${produto.estoque}</td>
        <td>
          <button class="btn-acao btn-editar" data-idx="${idx}">Editar</button>
          <button class="btn-acao btn-excluir" data-idx="${idx}">Excluir</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Excluir produto
  document.getElementById('produtos-tbody').addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-excluir')) {
      const idx = parseInt(e.target.getAttribute('data-idx'));
      produtos.splice(idx, 1);
      renderTabela();
    }
  });

  // Adicionar produto
  document.getElementById('form-produto').addEventListener('submit', function(e) {
    e.preventDefault();
    const nome = document.getElementById('novo-nome').value.trim();
    const preco = parseFloat(document.getElementById('novo-preco').value);
    const estoque = parseInt(document.getElementById('novo-estoque').value);
    if (!nome || isNaN(preco) || isNaN(estoque)) {
      alert('Preencha todos os campos corretamente!');
      return;
    }
    produtos.push({ nome, preco, estoque });
    renderTabela();
    e.target.reset();
  });

  renderTabela();
});
