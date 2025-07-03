document.addEventListener('DOMContentLoaded', async () => {
    // URL do seu banco de dados Firebase
    const FIREBASE_URL = 'https://dbgestao-1208c-default-rtdb.firebaseio.com';
    const container = document.getElementById('noticias-container');

    if (!container) return;

    // Função auxiliar para converter a resposta do Firebase (objeto) em uma lista (array)
    function firebaseObjectToArray(data) {
        return data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
    }

    try {
        // ALTERADO: Busca os dados do Firebase
        const response = await fetch(`${FIREBASE_URL}/noticias.json`);
        if (!response.ok) throw new Error('Erro ao buscar notícias');

        const data = await response.json();
        // ALTERADO: Converte o objeto de dados em uma lista
        const noticias = firebaseObjectToArray(data);

        noticias.forEach(noticia => {
            const card = document.createElement('div');
            card.className = 'card-noticia favorito-card';

            const favoritoClass = noticia.favoritado ? 'favorito' : '';

            card.innerHTML = `
                <img src="${noticia.imagem}" alt="${noticia.titulo}">
                <h3>${noticia.titulo}</h3>
                <p>${noticia.resumo}</p>
                <i class="fas fa-heart favorite-icon ${favoritoClass}" data-id="${noticia.id}"></i>
            `;

            // Ações (esta parte não precisa mudar)
            card.querySelector('img').addEventListener('click', () => abrirModal(noticia));
            card.querySelector('h3').addEventListener('click', () => abrirModal(noticia));
            card.querySelector('p').addEventListener('click', () => abrirModal(noticia));
            card.querySelector('.favorite-icon').addEventListener('click', async (e) => {
                e.stopPropagation(); // Evita abrir modal
                await toggleFavorito(noticia.id, e.target);
            });

            container.appendChild(card);
        });
    } catch (error) {
        console.error('Erro ao carregar notícias:', error);
        container.innerHTML = '<p>Erro ao carregar notícias.</p>';
    }

    // A função do Modal não precisa de alterações, pois já recebe o objeto 'noticia'
    function abrirModal(noticia) {
        document.getElementById('modal-titulo').textContent = noticia.titulo;
        document.getElementById('modal-imagem').src = noticia.imagem;
        document.getElementById('modal-conteudo').innerHTML = noticia.texto;
        document.getElementById('modal').style.display = 'block';
    }

    // Lógica para fechar o modal (não precisa de alterações)
    const closeBtn = document.getElementById('close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            document.getElementById('modal').style.display = 'none';
        });
    }

    async function toggleFavorito(id, icon) {
        try {
            // ALTERADO: A URL agora aponta para o item específico no Firebase
            const url = `${FIREBASE_URL}/noticias/${id}.json`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('Erro ao buscar notícia para favoritar');

            const noticia = await res.json();
            const novoStatus = !noticia.favoritado;

            // ALTERADO: O PATCH também aponta para a URL do Firebase
            const patch = await fetch(url, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ favoritado: novoStatus })
            });

            if (!patch.ok) throw new Error('Erro ao atualizar favorito');

            icon.classList.toggle('favorito', novoStatus);
        } catch (error) {
            console.error('Erro ao atualizar favorito:', error);
        }
    }
});