document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('noticias-container');

  try {
    const response = await fetch('http://localhost:3000/noticias'); // Caminho absoluto
    if (!response.ok) throw new Error('Erro ao buscar notícias');

    const noticias = await response.json();

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

      // Ações
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

  function abrirModal(noticia) {
    document.getElementById('modal-titulo').textContent = noticia.titulo;
    document.getElementById('modal-imagem').src = noticia.imagem;
    document.getElementById('modal-conteudo').innerHTML = noticia.texto;
    document.getElementById('modal').style.display = 'block';
  }

  const closeBtn = document.getElementById('close-modal');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      document.getElementById('modal').style.display = 'none';
    });
  }

  async function toggleFavorito(id, icon) {
    try {
      const url = `http://localhost:3000/noticias/${id}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Erro ao buscar notícia para favoritar');

      const noticia = await res.json();
      const novoStatus = !noticia.favoritado;

      const patch = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ favoritado: novoStatus })
      });

      if (!patch.ok) throw new Error('Erro ao atualizar favorito');

      icon.classList.toggle('favorito', novoStatus);
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error);
    }
  }
});
