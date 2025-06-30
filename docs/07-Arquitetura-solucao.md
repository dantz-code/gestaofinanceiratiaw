
# Sistema de Gestão Financeira Educacional

Este projeto é uma aplicação web desenvolvida para promover educação financeira por meio de conteúdos, metas, investimentos e notícias interativas.

## 🧱 Arquitetura da Solução

> **Pré-requisitos:** [Projeto de interface](05-Projeto-interface.md)

A aplicação é estruturada como uma Single Page Application (SPA), com backend simulado via JSON Server. É composta por:

- **Frontend (`public/`)**: páginas HTML/CSS/JS.
- **Backend (`server.js` + `json-server`)**: simulação de API REST.
- **Banco de dados (`db/db.json`)**: fonte de dados local em JSON.

Com `npm start`, o servidor:
- Roda em `http://localhost:3000`
- Expõe endpoints REST a partir de `db.json`
- Serve páginas estáticas da pasta pública

---

## ✨ Funcionalidades

### Funcionalidade 1 – Conteúdos de Educação Financeira

- Exibe artigos informativos sobre economia, inflação, organização financeira etc.
- Acesso pelas páginas `paginaEducacao.html` e `detalhesEducacao.html`

### Funcionalidade 2 – Notícias

- Exibe cards com notícias atuais e botão para detalhes via pop-up
- Página: `notícias.html`

### Funcionalidade 3 – Metas Financeiras

- Permite acompanhar o progresso de metas econômicas
- Página: `metas.html`

### Funcionalidade 4 – Investimentos

- Apresenta tipos de investimentos e detalhamento
- Páginas: `investimentos.html`, `detalhesinvestimentos.html`

---

## 🗂️ Estruturas de Dados

### `educacao`

```json
{
  "id": "1",
  "titulo": "Como o dólar alto afeta o bolso dos brasileiros",
  "resumo": "Apesar dos recentes recuos...",
  "texto": "<p>Texto completo em HTML</p>"
}
```

### `noticias`

```json
{
  "id": 2,
  "titulo": "Novo programa educacional é lançado",
  "resumo": "Capacitação de professores em tecnologia...",
  "imagem": "programa-educacional.png",
  "texto": "Conteúdo completo da notícia"
}
```

### `metas`

```json
{
  "id": 3,
  "titulo": "Economizar R$ 5.000 até dezembro",
  "descricao": "Meta de economia mensal",
  "valorAtual": 1800,
  "valorMeta": 5000
}
```

### `investimentos`

```json
{
  "id": 4,
  "titulo": "Tesouro Direto",
  "descricao": "Investimento de renda fixa...",
  "imagem": "tesouro.jpg",
  "texto": "Texto explicando o investimento"
}
```

---

## 📦 Módulos e APIs

### Bibliotecas e Ferramentas

- **Express**
- **JSON Server**
- **CORS**
- **Bootstrap / Font Awesome**
- **Chart.js**
- **jQuery**

---

## ☁️ Hospedagem

### Passos para rodar localmente:

```bash
npm install
npm start
```

Isso executa:

```bash
json-server --watch ./db/db.json --port 3000 --static ./public
```

### Acesse pelo navegador:
```
http://localhost:3000/index.html
```

---
