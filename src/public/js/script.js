// ignore 
const conteudos = [
    {
      id: 1,
      titulo: "Como criar um orçamento pessoal",
      categoria: "Educacao-financeira",
      descricao: "Aprenda a controlar seus gastos em 5 passos simples.",
      conteudoCompleto: "Passo 1: Liste todas suas receitas mensais... Passo 2: Categorize seus gastos... (texto completo com exemplos práticos)"
    },
    {
      id: 2,
      titulo: "Guia da renda passiva para iniciantes",
      categoria: "Educacao-financeira",
      descricao: "Entenda como seu dinheiro pode trabalhar para você.",
      conteudoCompleto: "Explicação sobre dividendos, aluguéis, royalties... (texto detalhado com casos reais)"
    },
    {
      id: 3,
      titulo: "Como ler um holerite corretamente",
      categoria: "Educacao-financeira",
      descricao: "Não cometa erros na análise do seu contracheque.",
      conteudoCompleto: "Análise item por item: base de cálculo INSS, FGTS... (exemplos visuais)"
    },
    {
      id: 4,
      titulo: "Melhores investimentos para iniciantes",
      categoria: "Investimentos",
      descricao: "Conheça as opções de baixo risco para começar.",
      conteudoCompleto: "Comparativo entre Tesouro Direto, CDB, LCI/LCA... (com tabelas de rentabilidade)"
    },
    {
      id: 5,
      titulo: "Análise técnica vs. análise fundamentalista",
      categoria: "Investimentos",
      descricao: "Qual método usar na bolsa de valores?",
      conteudoCompleto: "Vantagens de cada abordagem com exemplos gráficos... (passo-a-passo)"
    },
    {
      id: 6,
      titulo: "Como montar uma carteira diversificada",
      categoria: "Investimentos",
      descricao: "Reduza riscos com a estratégia certa.",
      conteudoCompleto: "Proporções ideais por classe de ativos... (modelos para diferentes perfis)"
    },
    {
      id: 7,
      titulo: "10 hábitos para economizar no supermercado",
      categoria: "Economia-domestica",
      descricao: "Dicas práticas para reduzir gastos sem sacrificar qualidade.",
      conteudoCompleto: "Lista detalhada com: planejamento de compras, marcas próprias... (testes comparativos)"
    },
    {
      id: 8,
      titulo: "Como negociar dívidas com bancos",
      categoria: "Economia-domestica",
      descricao: "Estratégias comprovadas para reduzir juros.",
      conteudoCompleto: "Roteiro de negociação passo-a-passo... (modelos de argumentação)"
    },
    {
      id: 9,
      titulo: "Apps para controle financeiro comparados",
      categoria: "Economia-domestica",
      descricao: "Encontre o melhor aplicativo para suas necessidades.",
      conteudoCompleto: "Análise de Mobills, Guiabolso, Organizze... (comparativo com screenshots)"
    },
    {
      id: 10,
      titulo: "Como declarar IRPF pela primeira vez",
      categoria: "Impostos",
      descricao: "Guia completo para não cometer erros.",
      conteudoCompleto: "Preenchimento tela por tela... (com imagens da declaração)"
    },
    {
      id: 11,
      titulo: "Seguros: quais valem a pena?",
      categoria: "Protecao-financeira",
      descricao: "Análise dos produtos essenciais para sua segurança.",
      conteudoCompleto: "Comparativo entre seguros de vida, residencial... (casos de uso reais)"
    },
    {
      id: 12,
      titulo: "Planejamento para aposentadoria aos 20, 30 e 40 anos",
      categoria: "Previdencia",
      descricao: "Estratégias diferentes para cada fase da vida.",
      conteudoCompleto: "Projeções matemáticas com diferentes aportes... (gráficos comparativos)"
    }
  ];
  
  // Função para carregar conteúdos por categoria
  function carregarConteudos(categoria = "educacao-financeira") {
    const resultadosDiv = document.getElementById("resultados-conteudo");
    const tituloDiv = document.getElementById("titulo-categoria-selecionada");
    
    // Filtra os conteúdos
    const conteudosFiltrados = conteudos.filter(item => 
      item.categoria === categoria
    );
  
    // Atualiza o título
    tituloDiv.textContent = `Conteúdos: ${formatarCategoria(categoria)}`;
    
    // Limpa e recarrega os resultados
    resultadosDiv.innerHTML = "";
    
    if (conteudosFiltrados.length === 0) {
      resultadosDiv.innerHTML = "<p>Nenhum conteúdo encontrado nesta categoria.</p>";
      return;
    }
  
    conteudosFiltrados.forEach(item => {
      const card = document.createElement("div");
      card.className = "card-conteudo";
      card.innerHTML = `
        <h3>${item.titulo}</h3>
        <p>${item.descricao}</p>
        <button class="ler-mais" data-id="${item.id}">Ler mais</button>
      `;
      resultadosDiv.appendChild(card);
    });
  
    // eventos aos botões
    document.querySelectorAll('.ler-mais').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);
        mostrarConteudoCompleto(id);
      });
    });
  }
  
  // conteúdo completo
  function mostrarConteudoCompleto(id) {
    const conteudo = conteudos.find(item => item.id === id);
    const resultadosDiv = document.getElementById("resultados-conteudo");
    
    resultadosDiv.innerHTML = `
      <div class="conteudo-detalhado">
        <button onclick="carregarConteudos('${conteudo.categoria}')">← Voltar</button>
        <h2>${conteudo.titulo}</h2>
        <p>${conteudo.conteudo}</p>
      </div>
    `;
  }
  
  // Função auxiliar para formatar o nome da categoria
  function formatarCategoria(categoria) {
    return categoria.split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  // Eventos de clique nas categorias
  document.querySelectorAll('.categoria-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const categoria = e.target.dataset.categoria;
      carregarConteudos(categoria);
    });
  });
  
  // Evento de pesquisa
  document.getElementById("searchBtn").addEventListener("click", () => {
    const termo = document.getElementById("searchInput").value.toLowerCase();
    if (!termo) return carregarConteudos();
    
    const resultados = conteudos.filter(item => 
      item.titulo.toLowerCase().includes(termo) || 
      item.descricao.toLowerCase().includes(termo)
    );
    
    const resultadosDiv = document.getElementById("resultados-conteudo");
    resultadosDiv.innerHTML = "";
    
    if (resultados.length === 0) {
      resultadosDiv.innerHTML = "<p>Nenhum resultado encontrado.</p>";
      return;
    }
    
    resultados.forEach(item => {
      const card = document.createElement("div");
      card.className = "card-conteudo";
      card.innerHTML = `
        <h3>${item.titulo}</h3>
        <p>${item.descricao}</p>
        <small>Categoria: ${formatarCategoria(item.categoria)}</small>
        <button class="ler-mais" data-id="${item.id}">Ler mais</button>
      `;
      resultadosDiv.appendChild(card);
    });
  });
  
  // Carrega os conteúdos iniciais
  carregarConteudos();