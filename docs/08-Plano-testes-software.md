
# Plano de Testes de Software

> **Pré-requisitos:** [Especificação do projeto](03-Product-design.md), [Projeto de interface](05-Projeto-interface.md)

Este plano de testes contempla os principais cenários de uso do sistema, conforme as funcionalidades implementadas. Os testes foram realizados por membros do grupo, considerando as ações do usuário final.

---

## ✅ Casos de Teste

| **Caso de teste**  | **CT-001 – Visualizar conteúdos de educação financeira** |
|--------------------|------------------------------------------------------------|
| Requisito associado | RF-001 – A aplicação deve apresentar conteúdos educativos sobre finanças. |
| Objetivo do teste | Verificar se os conteúdos são carregados corretamente e exibidos ao usuário. |
| Passos | - Acessar o navegador<br>- Ir para `paginaEducacao.html`<br>- Conferir o carregamento dos cards com título e imagem<br>- Clicar em um card para abrir a página de detalhes |
| Critério de êxito | O conteúdo completo é exibido corretamente e sem erros. |
| Responsável pela elaboração do caso de teste | João Vitor Vieira Guedes |

---

| **Caso de teste**  | **CT-002 – Exibir detalhes de notícias** |
|--------------------|------------------------------------------|
| Requisito associado | RF-002 – A aplicação deve permitir ao usuário visualizar detalhes de uma notícia. |
| Objetivo do teste | Verificar se os dados completos da notícia são exibidos corretamente no pop-up/modal. |
| Passos | - Acessar `notícias.html`<br>- Verificar se os cards de notícias aparecem<br>- Clicar em uma notícia<br>- Verificar se o pop-up abre com título, imagem e texto |
| Critério de êxito | O conteúdo completo da notícia é exibido e o botão de fechar funciona. |
| Responsável pela elaboração do caso de teste | João Vitor Vieira Guedes |

---

| **Caso de teste**  | **CT-003 – Cadastrar metas financeiras** |
|--------------------|------------------------------------------|
| Requisito associado | RF-003 – A aplicação deve permitir o registro de metas financeiras. |
| Objetivo do teste | Validar se o formulário de metas registra e armazena os dados corretamente. |
| Passos | - Acessar `metas.html`<br>- Inserir título, descrição e valor da meta<br>- Clicar em “Salvar”<br>- Verificar se a nova meta aparece na lista |
| Critério de êxito | A meta é registrada no `db.json` e exibida corretamente. |
| Responsável pela elaboração do caso de teste | João Vitor Vieira Guedes |

---

| **Caso de teste**  | **CT-004 – Navegar entre páginas** |
|--------------------|------------------------------------|
| Requisito associado | RF-004 – A aplicação deve permitir navegação funcional entre as seções do site. |
| Objetivo do teste | Validar se os botões/links do menu funcionam corretamente. |
| Passos | - Acessar `homepage.html`<br>- Clicar nos links do menu lateral e do header<br>- Verificar se as páginas são carregadas sem erros |
| Critério de êxito | Todas as páginas são acessadas normalmente. |
| Responsável pela elaboração do caso de teste | João Vitor Vieira Guedes |

---

## 🛠️ Ferramentas de Teste

- Testes manuais realizados no navegador (Google Chrome e Firefox)
- Validação de JSON via [jsonlint.com](https://jsonlint.com/)
- Inspeção de elementos com DevTools
- Testes de abertura e navegação realizados com usuários do grupo
