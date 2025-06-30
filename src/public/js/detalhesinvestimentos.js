// Pega o ID da URL
function getIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  console.log("ID encontrado na URL:", id);
  return id;
}

// Carrega os detalhes do investimento
async function carregarDetalhes() {
  const id = getIdFromURL();
  if (!id) {
    document.getElementById('titulo').textContent = 'ID não informado.';
    return;
  }

  try {
    const url = `http://localhost:3000/investimento/${id}`;
    console.log("Buscando dados em:", url);

    const resposta = await fetch(url);

    console.log("Status da resposta:", resposta.status);

    if (!resposta.ok) {
      throw new Error("Investimento não encontrado");
    }

    const investimento = await resposta.json();
    console.log("Dados recebidos:", investimento);

    document.getElementById('titulo').textContent = investimento.titulo;
    document.getElementById('imagem').src = investimento.imagem;
    document.getElementById('imagem').alt = investimento.titulo;
    document.getElementById('resumo').textContent = investimento.resumo;
    document.getElementById('conteudo').innerHTML = investimento.texto;

  } catch (erro) {
    console.error("Erro ao carregar os dados:", erro.message);
    document.querySelector('.container').innerHTML = `<p style="color:red;">Erro ao carregar os dados: ${erro.message}</p>`;
  }
}

// Carrega os comentários do investimento
async function carregarComentarios(id) {
  const lista = document.getElementById('listaComentarios');
  lista.innerHTML = '';

  try {
    const resposta = await fetch(`http://localhost:3000/investimento/${id}`);
    if (!resposta.ok) throw new Error("Investimento não encontrado para carregar comentários");

    const investimento = await resposta.json();

    investimento.comentario?.forEach(c => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${c.usuario || "Anônimo"}:</strong> ${c.comentario}`;
      lista.appendChild(li);
    });

  } catch (erro) {
    console.error("Erro ao carregar comentários:", erro);
    lista.innerHTML = `<li style="color:red;">Erro ao carregar comentários.</li>`;
  }
}

// Salva novo comentário no investimento (faz PUT no investimento inteiro)
async function salvarComentario(id, texto) {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const nomeUsuario = usuarioLogado?.nome;
  try {

    // Busca investimento atual
    const res = await fetch(`http://localhost:3000/investimento/${id}`);
    if (!res.ok) throw new Error("Investimento não encontrado para salvar comentário");

    const investimento = await res.json();

    const novoComentario = {
      id: Date.now(),
      usuario: JSON.parse(localStorage.getItem("usuarioLogado"))?.nome,
      comentario: texto
    };

    if (!investimento.comentario) investimento.comentario = [];
    investimento.comentario.push(novoComentario);

    // Atualiza investimento inteiro via PUT
    const putRes = await fetch(`http://localhost:3000/investimento/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(investimento)
    });

    if (!putRes.ok) throw new Error("Falha ao salvar comentário");

    carregarComentarios(id);

  } catch (erro) {
    console.error("Erro ao salvar comentário:", erro);
    alert("Erro ao salvar comentário. Tente novamente.");
  }
}

// Inicializa tudo quando o DOM carregar
document.addEventListener('DOMContentLoaded', () => {
  carregarDetalhes();

  const id = getIdFromURL();

  carregarComentarios(id);

  const form = document.getElementById('formComentario');
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const texto = document.getElementById('comentarioTexto').value.trim();
    if (texto) {
      salvarComentario(id, texto);
      document.getElementById('comentarioTexto').value = '';
    }
  });
});
