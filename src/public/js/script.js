
    document.addEventListener('DOMContentLoaded', () => {

        // --- CONFIGURAÇÕES GLOBAIS ---
        const FIREBASE_URL = 'https://dbgestao-1208c-default-rtdb.firebaseio.com';
        let todosConteudos = []; // Este array guardará todos os itens de todas as categorias
        
        // Mapeamento de elementos do HTML para evitar repetição
        const resultadosDiv = document.getElementById("resultados-conteudo");
        const tituloCategoriaH2 = document.getElementById("titulo-categoria-selecionada");
        const searchInput = document.getElementById("searchInput");
        const searchBtn = document.getElementById("searchBtn");
        const listaCategoriasUl = document.getElementById("listaCategorias");

        // --- FUNÇÕES AUXILIARES ---
        const firebaseObjectToArray = (data) => data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
        const formatarCategoria = (cat) => cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : "Sem Categoria";

        // --- FUNÇÕES DE RENDERIZAÇÃO E LÓGICA DA UI ---

        const renderizarConteudos = (conteudosParaExibir) => {
            resultadosDiv.innerHTML = "";
            if (conteudosParaExibir.length === 0) {
                resultadosDiv.innerHTML = "<p>Nenhum conteúdo encontrado.</p>";
                return;
            }

            conteudosParaExibir.forEach(item => {
                const card = document.createElement("div");
                card.className = "card-conteudo";
                card.innerHTML = `
                    <h3>${item.titulo}</h3>
                    <p>${item.resumo || item.descricao}</p>
                    <small>Categoria: ${formatarCategoria(item.categoria)}</small>
                    <button class="ler-mais" data-id="${item.id}">Ler mais</button>
                `;
                resultadosDiv.appendChild(card);
            });

            // Adiciona os eventos de clique aos novos botões "Ler mais"
            document.querySelectorAll('.ler-mais').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.dataset.id;
                    mostrarConteudoCompleto(id);
                });
            });
        };

        const mostrarConteudoCompleto = (id) => {
            const conteudo = todosConteudos.find(item => item.id === id);
            if (!conteudo) return;

            resultadosDiv.innerHTML = `
                <div class="conteudo-detalhado">
                    <button id="btn-voltar">← Voltar</button>
                    <h2>${conteudo.titulo}</h2>
                    ${conteudo.imagem ? `<img src="${conteudo.imagem}" alt="${conteudo.titulo}" style="max-width: 100%; border-radius: 8px; margin-bottom: 15px;">` : ''}
                    <div class="conteudo-texto">${conteudo.texto || conteudo.conteudoCompleto}</div>
                    ${conteudo.autor ? `<p><strong>Autor:</strong> ${conteudo.autor}</p>` : ''}
                    ${conteudo.data ? `<p><strong>Data:</strong> ${conteudo.data}</p>` : ''}
                </div>
            `;
            document.getElementById('btn-voltar').addEventListener('click', () => renderizarConteudos(todosConteudos));
        };

        const carregarMenuCategorias = (categorias) => {
            listaCategoriasUl.innerHTML = '<li><a href="#" class="categoria-link active" data-categoria="todos">Todos os Conteúdos</a></li>';
            categorias.forEach(cat => {
                listaCategoriasUl.innerHTML += `<li><a href="#" class="categoria-link" data-categoria="${cat}">${formatarCategoria(cat)}</a></li>`;
            });

            document.querySelectorAll('.categoria-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    document.querySelectorAll('.categoria-link').forEach(l => l.classList.remove('active'));
                    e.target.classList.add('active');
                    
                    const categoria = e.target.dataset.categoria;
                    const conteudosFiltrados = (categoria === "todos")
                        ? todosConteudos
                        : todosConteudos.filter(item => item.categoria === categoria);
                    
                    tituloCategoriaH2.textContent = formatarCategoria(categoria);
                    renderizarConteudos(conteudosFiltrados);
                });
            });
        };

        // --- FUNÇÃO DE INICIALIZAÇÃO (FETCH DOS DADOS) ---
        
        async function init() {
            try {
                resultadosDiv.innerHTML = '<p>Carregando todos os conteúdos...</p>';

                const categoriasParaBuscar = ['educacao', 'noticias', 'investimento'];
                const requests = categoriasParaBuscar.map(cat => fetch(`${FIREBASE_URL}/${cat}.json`).then(res => res.json()));
                const resultados = await Promise.all(requests);
                
                todosConteudos = [];
                resultados.forEach((data, index) => {
                    const categoriaNome = categoriasParaBuscar[index];
                    const lista = firebaseObjectToArray(data);
                    lista.forEach(item => item.categoria = categoriaNome); // Garante que cada item sabe sua categoria
                    todosConteudos.push(...lista);
                });

                // Ordena todos os conteúdos por data (se houver) para mostrar os mais recentes primeiro
                todosConteudos.sort((a, b) => new Date(b.data) - new Date(a.data));

                carregarMenuCategorias(categoriasParaBuscar); // Monta o menu lateral de categorias
                renderizarConteudos(todosConteudos); // Renderiza a lista completa inicial

            } catch (error) {
                console.error("Erro fatal ao carregar a página:", error);
                resultadosDiv.innerHTML = "<p>Ocorreu um erro crítico ao carregar os conteúdos.</p>";
            }
        }
        
        // --- EVENT LISTENERS DA BUSCA ---

        const executarBusca = () => {
            const termo = searchInput.value.toLowerCase();
            const resultados = todosConteudos.filter(item => 
                item.titulo.toLowerCase().includes(termo) || 
                (item.resumo && item.resumo.toLowerCase().includes(termo))
            );
            tituloCategoriaH2.textContent = `Resultados da busca por: "${termo}"`;
            renderizarConteudos(resultados);
        };
        
        searchBtn.addEventListener("click", executarBusca);
        searchInput.addEventListener("keyup", (event) => {
            if (event.key === "Enter") executarBusca();
        });

        // --- INICIA TUDO ---
        init();
    });