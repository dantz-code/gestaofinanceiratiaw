'use strict';

// --- CONFIGURAÇÃO ---
const API_URL = "http://localhost:3000/metas";

// --- SELETORES DO DOM ---
const btnNovaMeta = document.getElementById("btnNovaMeta");
const secaoFormulario = document.getElementById("formularioMeta");
const formMeta = document.getElementById("formMeta");
const btnCancelar = document.getElementById("cancelarMeta");
const corpoTabela = document.getElementById("corpoTabelaMetas");
const idMetaInput = document.getElementById("idMeta");
const tituloFormulario = document.querySelector("#formularioMeta h3");

// --- FUNÇÕES DE LÓGICA DA APLICAÇÃO ---

// Carrega todas as metas da API e renderiza na tabela
async function carregarMetas() {
    try {
        const user = JSON.parse(localStorage.getItem("usuarioLogado"));
        const response = await fetch(`${API_URL}?usuarioId=${user.id}`);
        if (!response.ok) throw new Error("Erro de rede ao buscar metas.");
        const metas = await response.json();

        corpoTabela.innerHTML = "";
        metas.forEach(renderizarLinhaMeta);
    } catch (error) {
        console.error("Erro em carregarMetas:", error);
        mostrarNotificacao("❌ Falha ao carregar dados do servidor.");
    }
}

// Lida com o envio do formulário (CRIAR ou EDITAR)
async function handleFormSubmit(event) {
    event.preventDefault();
    const id = idMetaInput.value;
    const user = JSON.parse(localStorage.getItem("usuarioLogado"));

    const dadosMeta = {
        nome: document.getElementById("nomeMeta").value,
        valorObjetivo: parseFloat(document.getElementById("valorObjetivo").value),
        valorAtual: parseFloat(document.getElementById("valorAtual").value),
        dataLimite: document.getElementById("dataLimite").value,
        usuarioId: user.id
    };

    const isEditing = !!id;
    const url = isEditing ? `${API_URL}/${id}` : API_URL;
    const method = isEditing ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosMeta)
        });

        if (!response.ok) throw new Error("Falha ao salvar a meta.");

        mostrarNotificacao(isEditing ? "✏️ Meta atualizada!" : "✅ Meta criada!");
        fecharFormulario();
        carregarMetas();
    } catch (error) {
        console.error("Erro ao salvar:", error);
        mostrarNotificacao("❌ Erro ao salvar a meta.");
    }
}

// Deleta uma meta do servidor
async function removerMeta(id) {
    if (!confirm("Tem certeza que deseja remover esta meta?")) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error("Falha ao remover a meta.");

        mostrarNotificacao("🗑️ Meta removida com sucesso!");
        carregarMetas();
    } catch (error) {
        console.error("Erro em removerMeta:", error);
        mostrarNotificacao("❌ Erro ao remover a meta.");
    }
}

// Prepara o formulário para edição de uma meta
async function editarMeta(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Meta não encontrada.");
        const meta = await response.json();

        idMetaInput.value = meta.id;
        document.getElementById("nomeMeta").value = meta.nome;
        document.getElementById("valorObjetivo").value = meta.valorObjetivo;
        document.getElementById("valorAtual").value = meta.valorAtual;
        document.getElementById("dataLimite").value = meta.dataLimite;

        abrirFormulario(true);
    } catch (error) {
        console.error("Erro em editarMeta:", error);
        mostrarNotificacao("❌ Erro ao carregar meta para edição.");
    }
}

// Adiciona ou remove valor de uma meta
async function modificarValor(id, tipo) {
    const textoPrompt = tipo === 'adicionar' ? "Digite o valor a adicionar:" : "Digite o valor a remover:";
    const valorTexto = prompt(textoPrompt);
    if (!valorTexto) return;

    const valor = parseFloat(valorTexto);
    if (isNaN(valor) || valor <= 0) {
        mostrarNotificacao("❌ Valor inválido.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Meta não encontrada.");
        const meta = await response.json();

        if (tipo === 'adicionar') {
            meta.valorAtual += valor;
        } else {
            meta.valorAtual -= valor;
            if (meta.valorAtual < 0) meta.valorAtual = 0;
        }

        const updateResponse = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(meta)
        });

        if (!updateResponse.ok) throw new Error("Falha ao atualizar a meta.");

        mostrarNotificacao(tipo === 'adicionar' ? "💰 Valor adicionado!" : "🧾 Valor removido!");
        carregarMetas();
    } catch (error) {
        console.error(`Erro em ${tipo}Valor:`, error);
        mostrarNotificacao("❌ Erro ao atualizar o valor.");
    }
}

// --- FUNÇÕES DE UI E AUXILIARES ---

function renderizarLinhaMeta(meta) {
    const tr = document.createElement("tr");
    const progresso = calcularProgresso(meta.valorAtual, meta.valorObjetivo);
    const status = definirStatus(meta.valorAtual, meta.valorObjetivo, meta.dataLimite);
    const restante = meta.valorObjetivo - meta.valorAtual;
    const textoRestante = restante <= 0 ? "Meta alcançada!" : `Faltam ${formatarMoeda(restante)} para alcançar.`;

    // Adicionamos o atributo data-label em cada <td>
    // O texto em data-label="" corresponde ao cabeçalho da tabela
    tr.innerHTML = `
        <td data-label="Meta">${meta.nome}</td>
        <td data-label="Valor a alcançar (R$)">${formatarMoeda(meta.valorObjetivo)}</td>
        <td data-label="Valor guardado (R$)">${formatarMoeda(meta.valorAtual)}</td>
        <td data-label="Data final">${formatarData(meta.dataLimite)}</td>
        <td data-label="Progresso">
            <progress value="${progresso}" max="100"></progress> ${progresso}%
        </td>
        <td data-label="Status">
            <span class="status status-${status.toLowerCase()}">${status}</span>
        </td>
        <td data-label="Ações" class="acoes">
            <button onclick="modificarValor('${meta.id}', 'adicionar')">+ Valor</button>
            <button onclick="modificarValor('${meta.id}', 'remover')">- Valor</button>
            <button onclick="editarMeta('${meta.id}')">Editar</button>
            <button onclick="removerMeta('${meta.id}')">Remover</button>
        </td>
    `;
    corpoTabela.appendChild(tr);
}

const formatarMoeda = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const formatarData = (data) => new Date(data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
const calcularProgresso = (atual, objetivo) => objetivo > 0 ? Math.min(100, Math.round((atual / objetivo) * 100)) : 100;

function definirStatus(atual, objetivo, dataLimite) {
    if (atual >= objetivo) return "Concluída";
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    if (new Date(dataLimite) < hoje) return "Vencida";
    return "Em Andamento";
}

function abrirFormulario(isEditing = false) {
    if (tituloFormulario) {
        tituloFormulario.textContent = isEditing ? "Editar Meta" : "Cadastrar Nova Meta";
    }
    secaoFormulario.style.display = "block";
    secaoFormulario.scrollIntoView({ behavior: "smooth" });
}

function fecharFormulario() {
    formMeta.reset();
    idMetaInput.value = "";
    secaoFormulario.style.display = "none";
}

function mostrarNotificacao(mensagem) {
    const div = document.getElementById("notificacao");
    if (!div) return;
    div.textContent = mensagem;
    div.className = "toast mostrar";
    setTimeout(() => { div.className = "toast"; }, 3000);
}

// --- INICIALIZAÇÃO E EVENTOS ---
btnNovaMeta.addEventListener("click", () => abrirFormulario(false));
btnCancelar.addEventListener("click", fecharFormulario);
formMeta.addEventListener("submit", handleFormSubmit);
document.addEventListener("DOMContentLoaded", carregarMetas);