// --- CONFIGURAÇÃO ---
const API_BASE_URL = "https://dbgestao-1208c-default-rtdb.firebaseio.com/investimento";

// --- FUNÇÕES ---

// Pega o ID da URL
function getIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Carrega os detalhes do investimento
async function carregarDetalhes() {
    const id = getIdFromURL();
    if (!id) {
        document.getElementById('titulo').textContent = 'ID do investimento não foi informado na URL.';
        return;
    }

    try {
        // Para buscar um item específico no Firebase, usamos /{id}.json
        const url = `${API_BASE_URL}/${id}.json`;
        const resposta = await fetch(url);

        if (!resposta.ok) {
            // Se o status for 404 (não encontrado) ou outro erro
            throw new Error(`Investimento com ID ${id} não foi encontrado.`);
        }

        const investimento = await resposta.json();

        // Se o Firebase retornar null (o que acontece se o ID não existir)
        if (!investimento) {
            throw new Error(`Nenhum dado encontrado para o investimento com ID ${id}.`);
        }

        document.getElementById('titulo').textContent = investimento.titulo;
        // IMPORTANTE: Assumindo que 'investimento.imagem' já contém a URL completa da imagem (ex: do Firebase Storage)
        document.getElementById('imagem').src = investimento.imagem;
        document.getElementById('imagem').alt = investimento.titulo;
        document.getElementById('resumo').textContent = investimento.resumo;
        document.getElementById('conteudo').innerHTML = investimento.texto;

    } catch (erro) {
        console.error("Erro ao carregar os dados:", erro.message);
        document.querySelector('.container').innerHTML = `<p style="color:red; text-align:center;">${erro.message}</p>`;
    }
}

// Carrega os comentários do investimento
async function carregarComentarios(id) {
    const lista = document.getElementById('listaComentarios');
    lista.innerHTML = '<li>Carregando comentários...</li>';

    try {
        const resposta = await fetch(`${API_BASE_URL}/${id}.json`);
        if (!resposta.ok) throw new Error("Não foi possível carregar o investimento.");

        const investimento = await resposta.json();
        lista.innerHTML = ''; // Limpa a lista antes de adicionar os novos

        // O Firebase pode retornar os comentários como um objeto. Convertemos para array se necessário.
        const comentariosArray = investimento?.comentario ? Object.values(investimento.comentario) : [];

        if (comentariosArray.length === 0) {
            lista.innerHTML = '<li>Nenhum comentário ainda. Seja o primeiro!</li>';
            return;
        }

        comentariosArray.forEach(c => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${c.usuario || "Anônimo"}:</strong> ${c.comentario}`;
            lista.appendChild(li);
        });

    } catch (erro) {
        console.error("Erro ao carregar comentários:", erro);
        lista.innerHTML = `<li style="color:red;">Erro ao carregar comentários.</li>`;
    }
}

// Salva novo comentário no investimento
async function salvarComentario(id, texto) {
    const nomeUsuario = JSON.parse(localStorage.getItem("usuarioLogado"))?.nome || "Anônimo";

    try {
        // 1. Busca o estado atual do investimento no Firebase
        const res = await fetch(`${API_BASE_URL}/${id}.json`);
        if (!res.ok) throw new Error("Investimento não encontrado para adicionar o comentário.");
        const investimento = await res.json();

        // 2. Adiciona o novo comentário ao array local
        const novoComentario = {
            id: Date.now(),
            usuario: nomeUsuario,
            comentario: texto
        };
        
        // Se a lista de comentários não existir, cria uma nova.
        if (!investimento.comentario) {
            investimento.comentario = [];
        }
        investimento.comentario.push(novoComentario);

        // 3. Atualiza o investimento inteiro no Firebase com o novo comentário
        const putRes = await fetch(`${API_BASE_URL}/${id}.json`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(investimento)
        });

        if (!putRes.ok) throw new Error("Falha ao salvar o comentário no servidor.");

        // Recarrega os comentários na tela
        await carregarComentarios(id);

    } catch (erro) {
        console.error("Erro ao salvar comentário:", erro);
        alert("Erro ao salvar comentário. Tente novamente.");
    }
}

// Inicializa tudo quando o DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    const id = getIdFromURL();
    if (id) {
        carregarDetalhes();
        carregarComentarios(id);

        const form = document.getElementById('formComentario');
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const textoInput = document.getElementById('comentarioTexto');
            const texto = textoInput.value.trim();
            if (texto) {
                salvarComentario(id, texto);
                textoInput.value = ''; // Limpa o campo após o envio
            }
        });
    }
});