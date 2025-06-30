let imagensJSON = [];

/* DropDown do botão de categoria */
function abrirDropDown() {
  const abrirDrop = document.getElementById("conteudoDropDown");
  const botao = document.getElementById("inputCat");

  const estaAberto = abrirDrop.style.display === "block"
  abrirDrop.style.display = estaAberto ? "none" : "block";

  if (!estaAberto) {
    botao.style.borderRadius = "18px 18px 0 0 ";
  } else {
    botao.style.borderRadius = "18px"
  }
}

/* Fecahr o Dropdrown clicando na tela */
window.addEventListener('click', function (event) {
  const dropdown = document.getElementById("dropDownCategoria");
  const botao = document.getElementById("inputCat");
  const conteudoDrop = document.getElementById("conteudoDropDown");

  if (dropdown && botao && conteudoDrop && !dropdown.contains(event.target)) {
    conteudoDrop.style.display = "none";
    botao.style.borderRadius = "18px";
  }
});

/* As bordas debaixo deixando de ter curvatura e somente as de cima possuem do botão de categoria */
function selecionarCategoria(botao) {
  const categoriaEscolhida = botao.textContent;
  const botaoPrincipal = document.getElementById("inputCat");

  document.getElementById("inputCat").textContent = categoriaEscolhida;
  document.getElementById("conteudoDropDown").style.display = "none";

  botaoPrincipal.style.borderRadius = "18px";
}

/* Criar o campo de subtítulo/corpo notícia/imagem complementar */
function adicionarSubtitulo() {
  document.querySelectorAll(".adicionarSub").forEach(botao => botao.remove());
  const bloco = document.getElementById("blocoSubtitulos");

  const grupo = document.createElement("div");
  grupo.className = "grupoSubtitulo";

  const h2Sub = document.createElement("h2");
  h2Sub.textContent = "Subtítulo da Notícia";
  h2Sub.className = "subtitulo";

  const inputSub = document.createElement("input");
  inputSub.type = "text";
  inputSub.placeholder = "Insira aqui o subtítulo...";
  inputSub.className = "inputSubNovo";

  const h2Corpo = document.createElement("h2");
  h2Corpo.textContent = "Insira o Corpo da Notícia";
  h2Corpo.className = "subtitulo";

  const inputCorpo = document.createElement("input");
  inputCorpo.type = "text";
  inputCorpo.placeholder = "Insira o corpo da notícia...";
  inputCorpo.className = "inputCorpoSub";

  const h2Img = document.createElement("h2");
  h2Img.textContent = "Insira uma imagem complementar"
  h2Img.className = "subtitulo";

  const inputImg = document.createElement("input");
  inputImg.type = "file";
  inputImg.accept = "image/*";
  inputImg.name = "Imagem Complementar";
  inputImg.className = "imagemInput";



  const divBtn = document.createElement("div");
  divBtn.className = "container-flex";

  const novoBtn = document.createElement("button");
  novoBtn.textContent = "Adicionar Subtítulo";
  novoBtn.className = "adicionarSub";
  novoBtn.onclick = adicionarSubtitulo;

  grupo.appendChild(h2Sub);
  grupo.appendChild(inputSub);
  grupo.appendChild(h2Corpo);
  grupo.appendChild(inputCorpo);
  grupo.appendChild(h2Img);
  grupo.appendChild(inputImg);
  divBtn.appendChild(novoBtn);
  grupo.appendChild(divBtn);
  bloco.appendChild(grupo);
}

/* Criar Noticia JSON Server */
function criarNoticia() {
  const btnEnviar = document.getElementById("btnEnviar");

  btnEnviar.addEventListener("click", async () => {
    const titulo = document.getElementById("inputTitulo").value;
    const subtitulo = document.getElementById("inputResumo").value;
    const autor = document.getElementById("inputAutor").value;
    const corpo = document.getElementById("inputCorpo").value;
    const data = document.getElementById("inputData").value;
    const categoria = document.getElementById("inputCat").textContent;
    const banner = document.getElementById("imagemBanner");
    const bannerFile = banner.files[0];

    if (!titulo || !subtitulo || !autor || !data || !categoria || !banner || !bannerFile) {
      alert("Preencha todos os campos");
      return;
    }

    const resposta = await fetch(`http://localhost:3000/${categoria}`);
    const dados = await resposta.json();

    const novoId = dados.length > 0
      ? (Math.max(...dados.map(item => item.id)) + 1).toString()
      : "1";

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
          corpo: `<h2>${sub}</h2><p>${corpoExtra}</p>`,
          imagem: imagem
        });
      }
    }


    const noticia = {
      id: novoId,
      titulo,
      resumo: subtitulo,
      texto: `<h1>${titulo}</h1><p>${corpo}</p>`,
      favoritado: false,
      autor,
      data,
      categoria,
      imagem: bannerBase64,
      descricao: titulo,
      extras: blocosExtras,
      comentario: []
    };

    fetch(`http://localhost:3000/${categoria}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(noticia)
    })
      .then(res => res.json())
      .then(() => {
        alert("Item cadastrado com sucesso!");
        window.location.reload();
      })
      .catch(err => {
        console.error("Erro ao enviar:", err);
        alert("Erro ao cadastrar o item.");
      });
  });
}

/* Carregar imagem */
function lerImagemComoBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

function mostrarNoticias() {
  let noticiasEducativas = document.getElementById("noticiaEducativa");
  let inicio = 0;
  let strNoticia = "";
  const fim = paginaAtual * porPagina;
  for (let i = inicio; i < fim && i < noticias.length; i++) {
    const noticia = noticias[i];
    strNoticia += `
      <div class="noticia text-center">
        <a href="detalhesEducacao.html?id=${noticia.id}">
        <div class="imagemNoticia text-center">
            <img src="${noticia.banner}" class="imagem" alt="${noticia.descricao || noticia.titulo}">
        </div>
        <div class="texto">
            <h1>${noticia.titulo}</h1></a>
          <p class="resumo">${noticia.resumo}</p>
          <p class="autor">${noticia.autor}</p>
          <p class="data">${noticia.data}</p>
<i class="${noticia.favoritado ? 'fas' : 'far'} fa-heart favorite-icon ${noticia.favoritado ? 'favorito' : ''}" onclick="favorito(this, '${noticia.id}')" data-id="${noticia.id}"></i>


          <i class="fas fa-heart favorite-icon ${noticia.favoritado ? 'favorito' : ''}" onclick="favorito(this, '${noticia.id}')" data-id="${noticia.id}"></i>
        </div>
      </div >
    `;
  }
  function favorito(iconElement, id) {
    fetch(`http://localhost:3000/educacao/${id}`)
      .then(res => res.json())
      .then(data => {
        const novoStatus = !data.favoritado;

        return fetch(`http://localhost:3000/educacao/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ favoritado: novoStatus })
        }).then(res => {
          if (!res.ok) throw new Error("Erro ao atualizar favorito");

          // Aqui está o efeito visual que você queria do segundo código
          iconElement.classList.toggle('favorito', novoStatus);
          iconElement.classList.toggle('far', !novoStatus);  // ícone contorno
          iconElement.classList.toggle('fas', novoStatus);   // ícone preenchido
        });
      })
      .catch(error => {
        console.error("Erro ao favoritar:", error);
        alert("Não foi possível atualizar o favorito.");
      });
  }

  noticiasEducativas.innerHTML = strNoticia;
  const botao = document.querySelector(".vejaMais");
  if (fim >= noticias.length) {
    botao.style.display = "none";
  } else {
    botao.style.display = "block";
  }
}

/* Função para enviar comentário pelo botão Enviar */
function EnviarComentario() {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const inputComentario = document.getElementById("InserirComentario");
  const textoComentario = inputComentario.value;
  const novoComentario = {
    usuario: JSON.parse(localStorage.getItem("usuarioLogado"))?.nome,
    comentario: textoComentario
  }

  /* Fetch para adicionar o comentário */
  fetch(`http://localhost:3000/educacao/${id}`)
    .then(res => res.json())
    .then(noticia => {
      noticia.comentario.push(novoComentario);
      return fetch(`http://localhost:3000/educacao/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(noticia)
      });
    })

    /* Cria o comentário */
    .then(data => {
      const containerUsuario = document.getElementById("comentariosUsuarios");
      let strCampoComentario = "";
      strCampoComentario += `
                    <div id="comentarioInserido">
                        <p> ${novoComentario.usuario}</p>
                        <img src="/img/img-educacao/chat.png" class="iconeUsuario" alt="Icone Usuario">
                        <input type="text" class="comentarioUsuario" value="${textoComentario}"readonly>
                    </div>`;
      containerUsuario.innerHTML += strCampoComentario;
      inputComentario.value = "";
    })
    .catch(err => {
      console.error("Erro:", err);
      alert("Não foi possível enviar o comentário.");
    });
}


