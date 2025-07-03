document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURAÇÕES GLOBAIS ---
    const FIREBASE_URL = 'https://dbgestao-1208c-default-rtdb.firebaseio.com';
    let currentIndex = 0;
    let slides = [];
    let investimentosData = []; // Guardará os dados para usar no resumo

    // --- ELEMENTOS DO DOM ---
    const carrossel = document.querySelector('.carrossel');
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');
    const resumoContainer = document.getElementById("resumo-investimento");

    // --- FUNÇÃO AUXILIAR ---
    function firebaseObjectToArray(data) {
        return data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
    }

    // --- FUNÇÃO PRINCIPAL PARA CARREGAR DADOS ---
    async function carregarInvestimentos() {
        if (!carrossel) return;

        try {
            // ALTERADO: Busca os dados do Firebase
            const response = await fetch(`${FIREBASE_URL}/investimento.json`);
            if (!response.ok) throw new Error('Erro ao buscar investimentos');
            
            const data = await response.json();
            // ALTERADO: Converte o objeto de dados em uma lista
            investimentosData = firebaseObjectToArray(data);

            // Limpa o carrossel antes de adicionar novos slides
            carrossel.innerHTML = ''; 

            investimentosData.forEach(investimento => {
                const slide = document.createElement('div');
                slide.classList.add('slide');
                slide.setAttribute('data-id', investimento.id);
                slide.style.position = 'relative';

                slide.innerHTML = `
                    <a href="detalhesinvestimentos.html?id=${investimento.id}">
                        <img src="${investimento.imagem}" alt="${investimento.titulo}" />
                    </a>
                `;

                const btn = document.createElement('button');
                btn.classList.add('favorito-btn');
                btn.setAttribute('data-id', investimento.id);
                btn.innerHTML = `<i class="${investimento.favoritado ? 'fa-solid' : 'fa-regular'} fa-heart" style="color: ${investimento.favoritado ? 'red' : '#333'};"></i>`;

                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleFavorito(investimento.id, btn.querySelector('i'));
                });

                slide.appendChild(btn);
                carrossel.appendChild(slide);
            });

            slides = document.querySelectorAll('.slide');
            updateCarrossel(); // Atualiza para mostrar o primeiro slide e resumo

        } catch (err) {
            console.error("Erro ao carregar investimentos:", err);
            carrossel.innerHTML = "<p>Não foi possível carregar os investimentos.</p>";
        }
    }

    // --- FUNÇÕES DE CONTROLE DO CARROSSEL E FAVORITOS ---

    function updateCarrossel() {
        if (slides.length === 0) return;
        const offset = -currentIndex * 100;
        carrossel.style.transform = `translateX(${offset}%)`;

        const investimento = investimentosData[currentIndex];
        if (resumoContainer && investimento) {
            resumoContainer.innerHTML = `
                <div class="card-investimento">
                    <h3>${investimento.titulo}</h3>
                    <p>${investimento.resumo}</p>
                </div>
            `;
        }
    }

    async function toggleFavorito(id, icon) {
        try {
            // ALTERADO: URL agora aponta para o Firebase
            const url = `${FIREBASE_URL}/investimento/${id}.json`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('Erro ao buscar item para favoritar');

            const item = await res.json();
            const novoStatus = !item.favoritado;

            await fetch(url, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ favoritado: novoStatus })
            });
            
            // Atualiza o ícone visualmente
            icon.classList.toggle('fa-regular', !novoStatus);
            icon.classList.toggle('fa-solid', novoStatus);
            icon.style.color = novoStatus ? 'red' : '#333';
            
            // Atualiza os dados locais para que o status permaneça ao navegar
            const itemLocal = investimentosData.find(inv => inv.id === id);
            if(itemLocal) itemLocal.favoritado = novoStatus;

        } catch (error) {
            console.error("Erro ao favoritar:", error);
        }
    }

    // --- EVENT LISTENERS ---
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            if (slides.length === 0) return;
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarrossel();
        });

        prevBtn.addEventListener('click', () => {
            if (slides.length === 0) return;
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarrossel();
        });
    }

    // --- INICIA TUDO ---
    carregarInvestimentos();
});