'use strict';

// --- CONFIGURAÇÃO ---
const API_BASE_URL = "https://dbgestao-1208c-default-rtdb.firebaseio.com";

// --- LÓGICA DA PÁGINA ---

/* DropDown do botão de categoria */
function abrirDropDown() {
    const abrirDrop = document.getElementById("conteudoDropDown");
    const botao = document.getElementById("inputCat");
    const estaAberto = abrirDrop.style.display === "block";
    abrirDrop.style.display = estaAberto ? "none" : "block";
    botao.style.borderRadius = estaAberto ? "18px" : "18px 18px 0 0";
}

/* Fechar o Dropdown clicando na tela */
window.addEventListener('click', function (event) {
    const dropdown = document.getElementById("dropDownCategoria");
    const botao = document.getElementById("inputCat");
    const conteudoDrop = document.getElementById("conteudoDropDown");
    if (dropdown && !dropdown.contains(event.target)) {
        conteudoDrop.style.display = "none";
        botao.style.borderRadius = "18px";
    }
});

/* Atualiza o botão de categoria */
function selecionarCategoria(botao) {
    document.getElementById("inputCat").textContent = botao.textContent;
    document.getElementById("conteudoDropDown").style.display = "none";
    document.getElementById("inputCat").style.borderRadius = "18px";
}

/* Criar o campo de subtítulo/corpo notícia/imagem complementar */
function adicionarSubtitulo() {
    document.querySelectorAll(".adicionarSub").forEach(botao => botao.remove());
    const bloco = document.getElementById("blocoSubtitulos");

    const grupo = document.createElement("div");
    grupo.className = "grupoSubtitulo";
    grupo.innerHTML = `
        <h2 class="subtitulo">Subtítulo da Notícia</h2>
        <input type="text" placeholder="Insira aqui o subtítulo..." class="inputSubNovo">
        <h2 class="subtitulo">Insira o Corpo da Notícia</h2>
        <textarea placeholder="Insira o corpo da notícia..." class="inputCorpoSub"></textarea>
        <h2 class="subtitulo">Insira uma imagem complementar</h2>
        <input type="file" accept="image/*" name="Imagem Complementar" class="imagemInput">
        <div class="container-flex">
            <button type="button" class="adicionarSub" onclick="adicionarSubtitulo()">Adicionar Mais Conteúdo</button>
        </div>
    `;
    bloco.appendChild(grupo);
}

/* Criar Notícia e enviar para o Firebase */
async function criarNoticia() {
    try {
        const titulo = document.getElementById("inputTitulo").value;
        const resumo = document.getElementById("inputResumo").value;
        const autor = document.getElementById("inputAutor").value;
        const corpo = document.getElementById("inputCorpo").value;
        const data = document.getElementById("inputData").value;
        const categoria = document.getElementById("inputCat").textContent.trim();
        const bannerFile = document.getElementById("imagemBanner").files[0];

        if (!titulo || !resumo || !autor || !data || categoria === 'Escolha uma categoria' || !bannerFile) {
            alert("Preencha todos os campos obrigatórios, incluindo título, resumo, autor, data, categoria e imagem de banner.");
            return;
        }

        const bannerBase64 = await lerImagemComoBase64(bannerFile);
        const grupos = document.querySelectorAll(".grupoSubtitulo");
        const blocosExtras = [];

        for (let grupo of grupos) {
            const sub = grupo.querySelector(".inputSubNovo")?.value || "";
            const corpoExtra = grupo.querySelector(".inputCorpoSub")?.value || "";
            const imgFile = grupo.querySelector(".imagemInput")?.files[0];
            let imagem = "";

            if (imgFile) {
                imagem = await lerImagemComoBase64(imgFile);
            }
            if (sub && corpoExtra) {
                blocosExtras.push({
                    subtitulo: sub,
                    corpo: corpoExtra,
                    imagem: imagem
                });
            }
        }

        const noticia = {
            titulo,
            resumo,
            texto: corpo, // Salva o corpo principal
            favoritado: false,
            autor,
            data,
            categoria,
            imagem: bannerBase64,
            descricao: titulo,
            extras: blocosExtras,
            comentario: []
        };

        // O Firebase gera o ID automaticamente com o método POST
        const response = await fetch(`${API_BASE_URL}/${categoria}.json`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(noticia)
        });

        if (!response.ok) throw new Error("Falha ao cadastrar a notícia.");

        alert("Notícia cadastrada com sucesso!");
        window.location.reload();

    } catch (err) {
        console.error("Erro ao criar notícia:", err);
        alert("Erro ao cadastrar a notícia. Verifique o console para mais detalhes.");
    }
}

/* Converte imagem para Base64 */
function lerImagemComoBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

// ATENÇÃO: As funções abaixo (`favorito` e `EnviarComentario`) estão com a categoria "educacao" fixa.
// Se elas precisarem funcionar para outras categorias, a categoria precisará ser passada dinamicamente.

/* Alterna o status de favorito de uma notícia */
async function favorito(iconElement, id, categoria = 'educacao') { // Categoria pode ser passada como parâmetro
    try {
        const res = await fetch(`${API_BASE_URL}/${categoria}/${id}.json`);
        if (!res.ok) throw new Error("Notícia não encontrada para favoritar.");
        const data = await res.json();
        const novoStatus = !data.favoritado;

        const patchRes = await fetch(`${API_BASE_URL}/${categoria}/${id}.json`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ favoritado: novoStatus })
        });

        if (!patchRes.ok) throw new Error("Erro ao atualizar favorito");

        iconElement.classList.toggle('favorito', novoStatus);
        iconElement.classList.toggle('far', !novoStatus);
        iconElement.classList.toggle('fas', novoStatus);

    } catch (error) {
        console.error("Erro ao favoritar:", error);
        alert("Não foi possível atualizar o favorito.");
    }
}

/* Envia um novo comentário */
async function EnviarComentario(id, categoria = 'educacao') { // Supondo que 'id' e 'categoria' venham de algum lugar
    try {
        const inputComentario = document.getElementById("InserirComentario");
        const textoComentario = inputComentario.value.trim();
        if (!textoComentario) return;

        const nomeUsuario = JSON.parse(localStorage.getItem("usuarioLogado"))?.nome || "Anônimo";
        
        // No Firebase, é mais eficiente adicionar um novo comentário diretamente
        // sem precisar buscar e reenviar o objeto inteiro.
        // A URL para POSTar em uma sub-lista é /comentario.json
        const postUrl = `${API_BASE_URL}/${categoria}/${id}/comentario.json`;

        const response = await fetch(postUrl, {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({ usuario: nomeUsuario, comentario: textoComentario })
        });

        if (!response.ok) throw new Error("Falha ao enviar comentário.");
        
        // Limpa o campo e atualiza a lista de comentários na tela
        inputComentario.value = "";
        // Aqui você chamaria uma função para recarregar os comentários da tela
        // Ex: carregarComentarios(id, categoria);

    } catch (err) {
        console.error("Erro ao enviar comentário:", err);
        alert("Não foi possível enviar o comentário.");
    }
}


// Evento para o botão principal de envio
document.addEventListener('DOMContentLoaded', () => {
    const btnEnviar = document.getElementById("btnEnviar");
    if (btnEnviar) {
        btnEnviar.addEventListener("click", criarNoticia);
    }
});