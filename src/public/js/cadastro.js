document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURAÇÕES E FUNÇÕES GLOBAIS ---
    const FIREBASE_URL = 'https://dbgestao-1208c-default-rtdb.firebaseio.com';

    function firebaseObjectToArray(data) {
        return data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
    }

    // --- LÓGICA DO FORMULÁRIO DE CADASTRO ---
    const formCadastro = document.getElementById("formCadastro");

    // Adicionamos apenas UM listener para o formulário
    if (formCadastro) {
        formCadastro.addEventListener("submit", async (e) => {
            e.preventDefault(); // Impede o recarregamento da página

            const nome = document.getElementById("nome").value;
            const data = document.getElementById("nascimento").value;
            const endereco = document.getElementById("endereco").value;
            const usuario = document.getElementById("usuario").value;
            const senha = document.getElementById("senha").value;
            const salario = document.getElementById("salario").value;

            // Validação simples para campos vazios
            if (!nome || !data || !endereco || !usuario || !senha || !salario) {
                alert("Por favor, preencha todos os campos.");
                return;
            }

            const novoUsuario = { nome, data, endereco, usuario, senha, salario, admin: false };

            try {
                // ETAPA 1: Verificar se o nome de usuário já existe no Firebase
                const response = await fetch(`${FIREBASE_URL}/usuarios.json`);
                const dataUsuarios = await response.json();
                const usuarios = firebaseObjectToArray(dataUsuarios);

                const usuarioExiste = usuarios.some(u => u.usuario === usuario);

                if (usuarioExiste) {
                    alert("Este nome de usuário já está em uso. Por favor, escolha outro.");
                    return; // Para a execução se o usuário já existir
                }

                // ETAPA 2: Se não existe, cria o novo usuário com POST
                const createResponse = await fetch(`${FIREBASE_URL}/usuarios.json`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(novoUsuario),
                });

                if (!createResponse.ok) {
                    throw new Error("Ocorreu um erro ao cadastrar o usuário no servidor.");
                }

                alert("Cadastro realizado com sucesso! Você será redirecionado para o login.");
                window.location.href = "login.html"; // Redireciona para a página de login

            } catch (error) {
                console.error("Erro no processo de cadastro:", error);
                alert("Não foi possível completar o cadastro. Verifique sua conexão ou tente mais tarde.");
            }
        });
    }

});