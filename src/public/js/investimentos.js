let currentIndex = 0;
let slides = [];
let investimentosData = [];

document.addEventListener("DOMContentLoaded", () => {
  const carrossel = document.querySelector('.carrossel');
  const nextBtn = document.querySelector('.next');
  const prevBtn = document.querySelector('.prev');
  const resumoContainer = document.getElementById("resumo-investimento");

  fetch('http://localhost:3000/investimento')
    .then(res => res.json())
    .then(data => {
      investimentosData = data; // Guarda todos os investimentos

      data.forEach(investimento => {
        // Slide
        const slide = document.createElement('div');
        slide.classList.add('slide');
        slide.setAttribute('data-id', investimento.id);
        slide.style.position = 'relative';

        slide.innerHTML = `
          <a href="detalhesinvestimentos.html?id=${investimento.id}">
            <img src="${investimento.imagem}" alt="${investimento.titulo}" />
          </a>
        `;

        // Botão de favorito
        const btn = document.createElement('button');
        btn.classList.add('favorito-btn');
        btn.setAttribute('data-id', investimento.id);

        btn.innerHTML = `
          <i class="${investimento.favoritado ? 'fa-solid' : 'fa-regular'} fa-heart"
             style="color: ${investimento.favoritado ? 'red' : '#333'};"></i>
        `;

        btn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const icon = btn.querySelector('i');
          const id = btn.getAttribute('data-id');

          try {
            const res = await fetch(`http://localhost:3000/investimento/${id}`);
            const investimento = await res.json();
            const novoStatus = !investimento.favoritado;

            await fetch(`http://localhost:3000/investimento/${id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ favoritado: novoStatus })
            });

            icon.classList.toggle('fa-regular', !novoStatus);
            icon.classList.toggle('fa-solid', novoStatus);
            icon.style.color = novoStatus ? 'red' : '#333';

          } catch (error) {
            console.error("Erro ao favoritar:", error);
          }
        });

        slide.appendChild(btn);
        carrossel.appendChild(slide);
      });

      slides = document.querySelectorAll('.slide');
      updateCarrossel();

      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarrossel();
      });

      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarrossel();
      });
    })
    .catch(err => console.error("Erro ao carregar investimentos:", err));
});

function updateCarrossel() {
  const carrossel = document.querySelector('.carrossel');
  const offset = -currentIndex * 100;
  carrossel.style.transform = `translateX(${offset}%)`;

  // Atualiza o resumo com base no investimento atual
  const resumoContainer = document.getElementById("resumo-investimento");
  const investimento = investimentosData[currentIndex];

  resumoContainer.innerHTML = `
    <div class="card-investimento">
      <h3>${investimento.titulo}</h3>
      <p>${investimento.resumo}</p>
    </div>
  `;
}
