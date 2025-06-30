document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('favoritos-container');
  const categorias = ['noticias', 'educacao', 'investimento'];

  if (!container) return;

  try {
    let favoritosTotais = [];

    for (const categoria of categorias) {
      const response = await fetch(`http://localhost:3000/${categoria}`);
      if (!response.ok) throw new Error(`Erro ao buscar ${categoria}`);
      const dados = await response.json();

      const favoritos = dados
        .filter(item => item.favoritado)
        .map(item => ({ ...item, categoria }));

      favoritosTotais = favoritosTotais.concat(favoritos);
    }

    if (favoritosTotais.length === 0) {
      container.innerHTML = '<p>Você ainda não favoritou nenhum conteúdo.</p>';
      return;
    }

    favoritosTotais.forEach(item => {
      const caminhoImagem = item.banner || item.imagem;

      const card = document.createElement('div');
      card.className = 'card-noticia favorito-card';
      card.style.position = 'relative';

      card.innerHTML = `
        <img src="${caminhoImagem}" alt="${item.titulo}">
        <h3>${item.titulo}</h3>
        <p>${item.resumo}</p>
        <p class="categoria-label">Categoria: ${item.categoria}</p>
        <i class="fa-solid fa-heart favorite-icon favorito" data-id="${item.id}" data-categoria="${item.categoria}"></i>
      `;

      // Ações de clique
      card.querySelector('img').addEventListener('click', () => abrirModal(item));
      card.querySelector('h3').addEventListener('click', () => abrirModal(item));
      card.querySelector('p').addEventListener('click', () => abrirModal(item));

      const icon = card.querySelector('.favorite-icon');
      icon.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorito(item.id, item.categoria, icon, card);
      });

      container.appendChild(card);
    });

    function abrirModal(item) {
      document.getElementById('modal-titulo').textContent = item.titulo;
      document.getElementById('modal-imagem').src = item.banner || item.imagem;
      document.getElementById('modal-conteudo').innerHTML = item.texto || item.conteudo;
      document.getElementById('modal').style.display = 'block';
    }

    const closeBtn = document.getElementById('close-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        document.getElementById('modal').style.display = 'none';
      });
    }

    async function toggleFavorito(id, categoria, icon, card) {
      const url = `http://localhost:3000/${categoria}/${id}`;
      const res = await fetch(url);
      const item = await res.json();
      const novoStatus = !item.favoritado;

      await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ favoritado: novoStatus })
      });

      // Remove se desfavoritar
      if (!novoStatus) {
        card.remove();
      }

      // Atualiza visual
      icon.classList.toggle("fa-solid", novoStatus);
      icon.classList.toggle("fa-regular", !novoStatus);
      icon.classList.toggle("favorito", novoStatus);
    }

  } catch (error) {
    console.error("Erro ao carregar favoritos:", error);
  }
});
