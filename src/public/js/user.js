// user.js - Versão Final para Firebase

// Define a URL base do seu banco de dados para ser reutilizada
const FIREBASE_URL = 'https://dbgestao-1208c-default-rtdb.firebaseio.com';

/**
 * Função auxiliar que converte a resposta de objeto do Firebase em um array.
 * @param {object} data O objeto de dados retornado pelo Firebase.
 * @returns {Array} Uma lista de itens.
 */
function firebaseObjectToArray(data) {
    if (data) {
        return Object.keys(data).map(key => ({
            id: key, // O ID agora é a chave única gerada pelo Firebase
            ...data[key]
        }));
    }
    return []; // Retorna um array vazio se não houver dados
}

// Espera o HTML carregar para executar o código
document.addEventListener("DOMContentLoaded", () => {

    // --- LÓGICA DE CADASTRO (PÁGINA DE CADASTRO) ---
    const formCadastro = document.getElementById("formCadastro");
    if (formCadastro) {
        formCadastro.addEventListener("submit", function (e) {
            e.preventDefault();
            const nome = document.getElementById("nome").value;
            const data = document.getElementById("nascimento").value;
            const endereco = document.getElementById("endereco").value;
            const usuario = document.getElementById("usuario").value;
            const senha = document.getElementById("senha").value;
            const salario = document.getElementById("salario").value;
            const novoUsuario = { nome, data, endereco, usuario, senha, salario, admin: false };

            // A lógica de POST para o Firebase é a mesma que para o json-server
            fetch(`${FIREBASE_URL}/usuarios.json`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novoUsuario)
            })
            .then(res => res.json())
            .then(data => {
                novoUsuario.id = data.name; // O Firebase retorna o ID no campo 'name'
                localStorage.setItem("usuarioLogado", JSON.stringify(novoUsuario));
                alert("Cadastro realizado e login efetuado!");
                window.location.href = "index.html";
            })
            .catch(err => console.error("Erro ao cadastrar:", err));
        });
    }

    // --- LÓGICA DE LOGIN (PÁGINA DE LOGIN) ---
    const formLogin = document.getElementById("formLogin");
    if (formLogin) {
        formLogin.addEventListener("submit", (e) => {
            e.preventDefault();
            const usuarioInput = document.getElementById("usuario").value;
            const senhaInput = document.getElementById("senha").value;

            fetch(`${FIREBASE_URL}/usuarios.json`)
                .then(res => res.json())
                .then(data => {
                    const usuarios = firebaseObjectToArray(data);
                    const usuarioEncontrado = usuarios.find(u => u.usuario === usuarioInput && u.senha === senhaInput);
                    
                    if (usuarioEncontrado) {
                        localStorage.setItem("usuarioLogado", JSON.stringify(usuarioEncontrado));
                        alert("Login realizado com sucesso!");
                        window.location.href = "index.html";
                    } else {
                        alert("Usuário ou senha inválidos.");
                    }
                })
                .catch(err => console.error("Erro ao fazer login:", err));
        });
    }

    // --- LÓGICA GERAL DE EXIBIÇÃO ---
    const user = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (user) {
        const userMenu = document.getElementById("userMenu");
        if (userMenu) {
            userMenu.innerHTML = `<span style="padding: 15px; color: white;">Olá, ${user.nome}</span><li><a href="#" onclick="logout()">Sair</a></li>`;
        }
    }
});

// --- FUNÇÃO GLOBAL DE LOGOUT ---
function logout() {
    localStorage.removeItem("usuarioLogado");
    alert("Você saiu da conta.");
    window.location.href = "login.html";
}