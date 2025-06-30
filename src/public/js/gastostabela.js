let chartInstance = null;

const API_URL = 'http://localhost:3000/gastos';
const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")); // ← usuário logado

// Função para buscar apenas os gastos do usuário logado
async function buscarGastos() {
  const resp = await fetch(`${API_URL}?usuarioId=${usuarioLogado.id}`);
  if (!resp.ok) throw new Error('Erro ao buscar gastos');
  return await resp.json();
}

// Função para adicionar gasto
async function adicionarGasto(gasto) {
  const resp = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gasto)
  });
  if (!resp.ok) throw new Error('Erro ao adicionar gasto');
  return await resp.json();
}

// Função para editar gasto
async function editarGastoBackend(id, gasto) {
  const resp = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gasto)
  });
  if (!resp.ok) throw new Error('Erro ao editar gasto');
  return await resp.json();
}

// Função para excluir gasto
async function excluirGastoBackend(id) {
  const resp = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!resp.ok && resp.status !== 204) throw new Error('Erro ao excluir gasto');
}

// Estado local para edição
let editId = null;

// DOM
const form        = document.getElementById('form-gasto');
const tabelaBody  = document.querySelector('#tabela-gastos tbody');
const feedbackBox = document.getElementById('mensagem-feedback');

// Renderizar tabela
async function renderTabela() {
  tabelaBody.innerHTML = '<tr><td colspan="6">Carregando...</td></tr>';
  try {
    const gastos = await buscarGastos();
    if (!gastos.length) {
      tabelaBody.innerHTML = `<tr><td colspan="6">Nenhum gasto cadastrado.</td></tr>`;
      return;
    }
    tabelaBody.innerHTML = '';
    gastos.forEach((g) => {
      tabelaBody.insertAdjacentHTML(
        'beforeend',
        `
        <tr>
          <td data-label="Descrição">${g.descricao}</td>
          <td data-label="Categoria">${g.categoria}</td>
          <td data-label="Tipo">${g.tipo}</td>
          <td data-label="Valor">R$ ${Number(g.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
          <td data-label="Data">${g.data}</td>
          <td data-label="Ações" class="acoes">
            <button data-editar="${g.id}">Editar</button>
            <button data-excluir="${g.id}">Excluir</button>
          </td>
        </tr>
        `
      );
    });
  } catch (err) {
    tabelaBody.innerHTML = `<tr><td colspan="6">Erro ao carregar gastos.</td></tr>`;
  }
}

// Submissão do formulário
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const descricao = form.descricao.value.trim();
  const categoria = form.categoria.value.trim();
  const tipo      = form.tipo.value;
  const valor     = Number(form.valor.value).toFixed(2);
  const data      = form.data.value;
  if (!descricao || !categoria || !tipo || !valor || !data) return;

  const novoGasto = {
    descricao,
    categoria,
    tipo,
    valor,
    data,
    usuarioId: usuarioLogado.id // ← associa o gasto ao usuário
  };

  try {
    if (editId === null) {
      await adicionarGasto(novoGasto);
      mostrarMensagem('Gasto adicionado com sucesso!');
    } else {
      await editarGastoBackend(editId, novoGasto);
      mostrarMensagem('Gasto atualizado com sucesso!');
      editId = null;
    }
    form.reset();
    await renderTabela();
  } catch (err) {
    mostrarMensagem('Erro ao salvar gasto.');
  }
});

// Ações editar/excluir
tabelaBody.addEventListener('click', async (e) => {
  const idEditar  = e.target.dataset.editar;
  const idExcluir = e.target.dataset.excluir;
  if (idEditar) {
    try {
      const gastos = await buscarGastos();
      const g = gastos.find(g => g.id === idEditar);
      if (!g) return mostrarMensagem('Gasto não encontrado.');
      form.descricao.value = g.descricao;
      form.categoria.value = g.categoria;
      form.tipo.value      = g.tipo;
      form.valor.value     = Number(g.valor);
      form.data.value      = g.data;
      editId = g.id;
    } catch {
      mostrarMensagem('Erro ao buscar gasto para edição.');
    }
  }
  if (idExcluir) {
    if (confirm('Deseja realmente excluir este gasto?')) {
      try {
        await excluirGastoBackend(idExcluir);
        mostrarMensagem('Gasto removido com sucesso.');
        await renderTabela();
      } catch {
        mostrarMensagem('Erro ao excluir gasto.');
      }
    }
  }
});

// Feedback
function mostrarMensagem(txt) {
  feedbackBox.textContent = txt;
  feedbackBox.style.opacity = 1;
  setTimeout(() => (feedbackBox.style.opacity = 0), 3000);
}

// Gráfico por categoria
async function gerarGrafico() {
  let dados;
  try {
    dados = await buscarGastos();
  } catch {
    return alert('Erro ao buscar gastos para o gráfico.');
  }

  if (!dados.length) return alert('Nenhum gasto cadastrado para mostrar.');

  const totalCat = {};
  dados.forEach(({ categoria, valor }) => {
    totalCat[categoria] = (totalCat[categoria] || 0) + Number(valor);
  });

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(document.getElementById('grafico-gastos'), {
    type: 'pie',
    data: {
      labels: Object.keys(totalCat),
      datasets: [{
        label: 'Distribuição de Gastos',
        data: Object.values(totalCat),
        backgroundColor: [
          '#4e79a7', '#f28e2b', '#e15759',
          '#76b7b2', '#59a14f', '#edc949',
          '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'
        ],
        borderWidth: 1,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        title: {
          display: true,
          text: 'Distribuição de Gastos por Categoria',
        },
      },
    },
  });
}

// Inicializar
window.addEventListener('load', () => {
  const inputData = document.getElementById('data');
  inputData.addEventListener('input', function () {
    this.setCustomValidity('');
  });

  renderTabela(); // carregar tabela
});

window.gerarGrafico = gerarGrafico;
