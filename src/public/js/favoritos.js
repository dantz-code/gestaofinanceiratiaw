
document.addEventListener('DOMContentLoaded', async () => {

    // --- CONFIGURAÇÕES E FUNÇÕES GLOBAIS ---
    const FIREBASE_URL = 'https://dbgestao-1208c-default-rtdb.firebaseio.com';
    const container = document.getElementById('favoritos-container');

    // Função auxiliar para converter a resposta do Firebase em uma lista
    function firebaseObjectToArray(data) {
        return data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
    }

    // --- FUNÇÕES DA PÁGINA ---

    // Função para buscar e exibir todos os itens favoritados
    async function carregarFavoritos() {
        if (!container) return;
        container.innerHTML = '<p>Buscando seus favoritos...</p>';

        try {
            const categorias = ['noticias', 'educacao', 'investimento'];
            let favoritosTotais = [];

            // Cria uma lista de "promessas" de fetch para buscar tudo em paralelo
            const requests = categorias.map(cat => 
                fetch(`${FIREBASE_URL}/${cat}.json`).then(res => res.json())
            );

            // Espera todas as buscas terminarem
            const resultados = await Promise.all(requests);

            // Processa os resultados de cada categoria
            resultados.forEach((data, index) => {
                const categoria = categorias[index];
                const listaCompleta = firebaseObjectToArray(data);
                
                const favoritosDaCategoria = listaCompleta
                    .filter(item => item.favoritado === true) // Pega apenas os favoritados
                    .map(item => ({ ...item, categoria })); // Adiciona a categoria a cada item

                favoritosTotais.push(...favoritosDaCategoria); // Junta tudo em uma única lista
            });

            // Ordena por data, se disponível
            favoritosTotais.sort((a, b) => new Date(b.data) - new Date(a.data));
            
            renderizarFavoritos(favoritosTotais);

        } catch (error) {
            console.error("Erro ao carregar favoritos:", error);
            container.innerHTML = '<p style="color: red;">Não foi possível carregar seus favoritos.</p>';
        }
    }

    // Função para "desenhar" os cards na tela
    function renderizarFavoritos(favoritos) {
        container.innerHTML = '';

        if (favoritos.length === 0) {
            container.innerHTML = '<p>Você ainda não favoritou nenhum conteúdo.</p>';
            return;
        }

        favoritos.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card-noticia favorito-card'; // Use suas classes CSS
            card.style.position = 'relative';

            card.innerHTML = `
                <a href="detalhes${item.categoria}.html?id=${item.id}" class="card-link">
                    <img src="${item.imagem}" alt="${item.titulo}">
                    <h3>${item.titulo}</h3>
                    <p>${item.resumo}</p>
                    <p class="categoria-label">Categoria: ${item.categoria}</p>
                </a>
                <i class="fas fa-heart favorite-icon favorito" data-id="${item.id}" data-categoria="${item.categoria}"></i>
            `;
            
            // Adiciona o listener de clique para desfavoritar
            const icon = card.querySelector('.favorite-icon');
            icon.addEventListener('click', (e) => {
                e.stopPropagation(); // Impede que o clique no coração ative o link do card
                toggleFavorito(item.id, item.categoria, card);
            });

            container.appendChild(card);
        });
    }

    // Função para desfavoritar um item
    async function toggleFavorito(id, categoria, cardElement) {
        const url = `${FIREBASE_URL}/${categoria}/${id}.json`;
        
        try {
            // No Firebase, para desfavoritar, simplesmente atualizamos o campo para 'false'
            await fetch(url, {
                method: "PATCH", // PATCH atualiza apenas o campo especificado
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ favoritado: false })
            });

            // Remove o card da tela imediatamente, como na sua lógica original
            cardElement.remove();

            // Verifica se a lista de favoritos ficou vazia
            if (container.children.length === 0) {
                 container.innerHTML = '<p>Você não tem mais nenhum conteúdo favoritado.</p>';
            }

        } catch(error) {
            console.error("Erro ao desfavoritar:", error);
            alert("Não foi possível remover dos favoritos.");
        }
    }

    // --- INICIA TUDO ---
    carregarFavoritos();
});