// CADASTRO DE NOVO USUÁRIO
document.getElementById("formCadastro")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const data = document.getElementById("nascimento").value;
  const endereco = document.getElementById("endereco").value;
  const usuario = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;
  const salario = document.getElementById("salario").value;

  const novoUsuario = { nome, data, endereco, usuario, senha, salario };

  fetch(`http://localhost:3000/usuarios?usuario=${usuario}`)
    .then(res => res.json())
    .then(dados => {
      if (dados.length > 0) {
        alert("Usuário já existe!");
      } else {
        return fetch("http://localhost:3000/usuarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(novoUsuario)
        });
      }
    })
    .then(res => res?.json())
    .then(usuarioCriado => {
      if (usuarioCriado) {
        localStorage.setItem("usuarioLogado", JSON.stringify(usuarioCriado));
        alert("Cadastro realizado e login efetuado!");
        window.location.href = "homepage.html";
      }
    })
    .catch(err => {
      console.error("Erro:", err);
      alert("Erro ao cadastrar.");
    });
});

// FUNÇÃO DE LOGIN
function fazerLogin() {
  const usuario = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;

  fetch(`http://localhost:3000/usuarios?usuario=${usuario}&senha=${senha}`)
    .then(res => res.json())
    .then(dados => {
      if (dados.length === 1) {
        localStorage.setItem("usuarioLogado", JSON.stringify(dados[0]));
        alert("Login realizado com sucesso!");
        window.location.href = "homepage.html";
      } else {
        alert("Usuário ou senha inválidos.");
      }
    })
    .catch(err => {
      console.error("Erro:", err);
      alert("Erro ao fazer login.");
    });
}

// VERIFICAÇÃO DE LOGIN EM TODAS AS PÁGINAS
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("usuarioLogado"));

  if (!user && !location.href.includes("usuarios.html")) {
    alert("Você precisa estar logado.");
    location.href = "login.html";
  }

  const adicionar = document.getElementById("adminVisivel");

  if (user.admin === true) {
    adicionar.style.display = "block";
  } else {
    adicionar.style.display = "none";
  }


  if (user) {
    const menu = document.getElementById("userMenu");
    if (menu) {
      menu.innerHTML = `
      <li><span style="display: block; text-align: center;">Olá, ${user.nome}</span></li>
      <li><a href="#" onclick="logout()">Sair</a></li>
    `;
    }

    // Esconde o botão "Login" se o usuário estiver logado
    const loginItem = document.querySelector('#userDropdown li a[href="login.html"]');
    if (loginItem) {
      loginItem.parentElement.style.display = "none";
    }

    // Mostrar menus restritos
    document.querySelectorAll(".somente-logado").forEach(el => el.style.display = "block");
  } else {
    document.querySelectorAll(".somente-logado").forEach(el => el.style.display = "none");
  }

});

// FUNÇÃO LOGOUT
function logout() {
  localStorage.removeItem("usuarioLogado");
  alert("Você saiu da conta.");
  location.href = "login.html";
}

function toggleMenu() {
  const menu = document.querySelector(".pages");
  menu.classList.toggle("show");
}

function toggleUserMenu() {
  const menu = document.getElementById('userDropdown');
  menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}

// Fecha o menu se clicar fora
window.addEventListener('click', function (e) {
  if (!e.target.matches('.fa-user')) {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown && dropdown.style.display === 'block') {
      dropdown.style.display = 'none';
    }
  }
});

//Função dropdown do menu//
function toggleMenu() {
  const menu = document.getElementById("menuDropdown");
  menu.classList.toggle("show");
}

// Fecha o menu-dropdown ao clicar fora
document.addEventListener("click", function (event) {
  const dropdown = document.getElementById("menuDropdown");
  const menuIcon = document.querySelector(".fa-bars");

  // Se o clique for fora do menu e do ícone, fecha
  if (!dropdown.contains(event.target) && !menuIcon.contains(event.target)) {
    dropdown.classList.remove("show");
  }
});

// Página de privacidade: preencher e atualizar dados
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("usuarioLogado"));
  const form = document.getElementById("formPrivacidade");
  if (!user || !form) return;

  // Preenche os campos
  document.getElementById("nome").value = user.nome;
  document.getElementById("nascimento").value = user.data;
  document.getElementById("endereco").value = user.endereco;
  document.getElementById("usuario").value = user.usuario;
  document.getElementById("senha").value = user.senha;
  document.getElementById("salario").value = user.salario;

  form.addEventListener("submit", e => {
    e.preventDefault();

    const dadosAtualizados = {
      id: user.id, // obrigatório para PUT
      nome: document.getElementById("nome").value,
      data: document.getElementById("nascimento").value,
      endereco: document.getElementById("endereco").value,
      usuario: document.getElementById("usuario").value,
      senha: document.getElementById("senha").value,
      salario: document.getElementById("salario").value
    };

    fetch(`http://localhost:3000/usuarios/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dadosAtualizados)
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao atualizar");
        return res.json();
      })
      .then(usuarioAtualizado => {
        localStorage.setItem("usuarioLogado", JSON.stringify(usuarioAtualizado));
        alert("Dados atualizados com sucesso!");
        location.reload();
      })
      .catch(err => {
        console.error("Erro ao atualizar:", err);
        alert("Erro ao atualizar os dados.");
      });
  });
});
