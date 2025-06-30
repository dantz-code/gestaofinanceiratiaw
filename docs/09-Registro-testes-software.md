
# Registro de Testes de Software

> **Pré-requisitos:** [Projeto de interface](05-Projeto-interface.md), [Plano de testes de software](08-Plano-testes-software.md)

Este documento apresenta as evidências dos testes realizados sobre a aplicação, de acordo com os casos definidos no plano de testes.

---

### ✅ Registro de Evidências

| **Caso de teste** | **CT-001 – Visualizar conteúdos de educação financeira** |
|-------------------|------------------------------------------------------------|
| Requisito associado | RF-001 – A aplicação deve apresentar conteúdos educativos sobre finanças. |
| Registro de evidência | <img src="/docs/imgs/prints/printeducação.PNG"> |

---

| **Caso de teste** | **CT-002 – Exibir detalhes de notícias** |
|-------------------|--------------------------------------------|
| Requisito associado | RF-002 – A aplicação deve permitir ao usuário visualizar detalhes de uma notícia. |
| Registro de evidência | <img src="/docs/imgs/prints/printnotícias.PNG"> |

---

| **Caso de teste** | **CT-003 – Cadastrar metas financeiras** |
|-------------------|-------------------------------------------|
| Requisito associado | RF-003 – A aplicação deve permitir o registro de metas financeiras. |
| Registro de evidência | <img src="/docs/imgs/prints/printmeta.PNG"> |

---

| **Caso de teste** | **CT-004 – Navegar entre páginas** |
|-------------------|-------------------------------------|
| Requisito associado | RF-004 – A aplicação deve permitir navegação funcional entre as seções do site. |
| Registro de evidência | <img src="/docs/imgs/prints/navegaçãoprint.PNG"> |

---

## ✅ Avaliação

Durante a execução dos testes, observou-se que a maioria dos requisitos definidos foi **atendida com sucesso**. A aplicação apresentou:

### Pontos Fortes:
- Carregamento correto dos dados a partir do `db.json`;
- Navegação funcional entre páginas;
- Exibição clara e intuitiva de conteúdos educativos e notícias.

### Pontos de Melhoria:
- Em alguns momentos, o carregamento do pop-up de notícias pode ser levemente demorado;
- Falta de feedback visual após salvar metas financeiras;
- Algumas imagens não carregam corretamente quando o nome do arquivo está incorreto no JSON.

### Ações Futuras:
- Adicionar mensagens de confirmação em todas as ações (cadastro, edição, remoção);
- Melhorar responsividade para dispositivos móveis;
- Criar sistema de autenticação real para usuários.
