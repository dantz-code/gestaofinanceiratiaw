let chartInstance = null;

// --- CONFIGURAÇÃO ---
// URL base para a sua coleção "gastos" no Firebase
const API_URL = 'https://dbgestao-1208c-default-rtdb.firebaseio.com/gastos';
const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

// --- FUNÇÕES DE API ---

// Função para buscar os gastos do usuário logado no Firebase
async function buscarGastos() {
    // A sintaxe de consulta do Firebase é diferente: ?orderBy="campo"&equalTo="valor"
    const resp = await fetch(`${API_URL}.json?orderBy="usuarioId"&equalTo="${usuarioLogado.id}"`);
    if (!resp.ok) throw new Error('Erro ao buscar gastos');

    const gastosObjeto = await resp.json();
    // Firebase retorna um objeto. Convertemos para um array, adicionando o ID.
    if (!gastosObjeto) return []; // Retorna array vazio se não houver gastos
    return Object.keys(gastosObjeto).map(key => ({ id: key, ...gastosObjeto[key] }));
}

// Função para adicionar gasto
async function adicionarGasto(gasto) {
    // Adiciona .json para criar um novo registro na coleção
    const resp = await fetch(`${API_URL}.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gasto)
    });
    if (!resp.ok) throw new Error('Erro ao adicionar gasto');
    return await resp.json();
}

// Função para editar gasto
async function editarGastoBackend(id, gasto) {
    // Adiciona /{id}.json para editar um item específico
    const resp = await fetch(`${API_URL}/${id}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gasto)
    });
    if (!resp.ok) throw new Error('Erro ao editar gasto');
    return await resp.json();
}

// Função para excluir gasto
async function excluirGastoBackend(id) {
    // Adiciona /{id}.json para deletar um item específico
    const resp = await fetch(`${API_URL}/${id}.json`, { method: 'DELETE' });
    if (!resp.ok && resp.status !== 204) throw new Error('Erro ao excluir gasto');
}


// --- LÓGICA DA PÁGINA ---

let editId = null;

const form = document.getElementById('form-gasto');
const tabelaBody = document.querySelector('#tabela-gastos tbody');
const feedbackBox = document.getElementById('mensagem-feedback');

// Renderizar tabela
async function renderTabela() {
    tabelaBody.innerHTML = '<tr><td colspan="6">Carregando...</td></tr>';
    try {
        const gastos = await buscarGastos();
        if (!gastos.length) {
            tabelaBody.innerHTML = `<tr><td colspan="6">Nenhum gasto cadastrado.</td></tr>`;
            if (chartInstance) chartInstance.destroy(); // Limpa o gráfico se não houver dados
            return;
        }
        tabelaBody.innerHTML = '';
        gastos.forEach((g) => {
            // Garante que o ID do Firebase está no botão
            tabelaBody.insertAdjacentHTML(
                'beforeend',
                `
                <tr>
                  <td data-label="Descrição">${g.descricao}</td>
                  <td data-label="Categoria">${g.categoria}</td>
                  <td data-label="Tipo">${g.tipo}</td>
                  <td data-label="Valor">R$ ${Number(g.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td data-label="Data">${new Date(g.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                  <td data-label="Ações" class="acoes">
                    <button data-editar="${g.id}">Editar</button>
                    <button data-excluir="${g.id}">Excluir</button>
                  </td>
                </tr>
                `
            );
        });
    } catch (err) {
        console.error(err);
        tabelaBody.innerHTML = `<tr><td colspan="6">Erro ao carregar gastos. Tente novamente.</td></tr>`;
    }
}


// Submissão do formulário
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const descricao = form.descricao.value.trim();
    const categoria = form.categoria.value.trim();
    const tipo = form.tipo.value;
    const valor = Number(form.valor.value); // Salva como número
    const data = form.data.value;

    if (!descricao || !categoria || !tipo || isNaN(valor) || !data) {
        mostrarMensagem('Preencha todos os campos corretamente.');
        return;
    }

    const novoGasto = {
        descricao,
        categoria,
        tipo,
        valor,
        data,
        usuarioId: usuarioLogado.id
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
        await renderTabela(); // Atualiza a tabela
        await gerarGrafico(); // Atualiza o gráfico
    } catch (err) {
        console.error(err);
        mostrarMensagem('Erro ao salvar gasto.');
    }
});

// Ações editar/excluir
tabelaBody.addEventListener('click', async (e) => {
    const idEditar = e.target.dataset.editar;
    const idExcluir = e.target.dataset.excluir;

    if (idEditar) {
        try {
            const gastos = await buscarGastos();
            const g = gastos.find(g => g.id === idEditar);
            if (!g) return mostrarMensagem('Gasto não encontrado.');

            form.descricao.value = g.descricao;
            form.categoria.value = g.categoria;
            form.tipo.value = g.tipo;
            form.valor.value = Number(g.valor);
            form.data.value = g.data;
            editId = g.id;
            form.scrollIntoView({ behavior: 'smooth' }); // Rola a tela para o formulário
        } catch(err) {
            console.error(err);
            mostrarMensagem('Erro ao buscar gasto para edição.');
        }
    }

    if (idExcluir) {
        if (confirm('Deseja realmente excluir este gasto?')) {
            try {
                await excluirGastoBackend(idExcluir);
                mostrarMensagem('Gasto removido com sucesso.');
                await renderTabela(); // Atualiza a tabela
                await gerarGrafico(); // Atualiza o gráfico
            } catch(err) {
                console.error(err);
                mostrarMensagem('Erro ao excluir gasto.');
            }
        }
    }
});

// Feedback
function mostrarMensagem(txt) {
    feedbackBox.textContent = txt;
    feedbackBox.className = 'feedback mostrar';
    setTimeout(() => {
        feedbackBox.className = 'feedback';
    }, 3000);
}

// Gráfico por categoria
async function gerarGrafico() {
    let dados;
    try {
        dados = await buscarGastos();
    } catch(err) {
        console.error(err);
        return;
    }

    if (chartInstance) {
        chartInstance.destroy(); // Limpa o gráfico anterior
    }

    if (!dados.length) {
      document.getElementById('grafico-container').style.display = 'none';
      return;
    }
    
    document.getElementById('grafico-container').style.display = 'block';

    const totalCat = {};
    dados.forEach(({ categoria, valor }) => {
        totalCat[categoria] = (totalCat[categoria] || 0) + Number(valor);
    });

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
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                title: {
                    display: true,
                    text: 'Distribuição de Gastos por Categoria',
                    font: { size: 16 }
                },
            },
        },
    });
}

// Inicializar
window.addEventListener('load', () => {
    renderTabela();
    gerarGrafico();
});