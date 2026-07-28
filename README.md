# 📦 Controle de Estoque — App Full-stack

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Flask](https://img.shields.io/badge/Flask-000000?logo=flask&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white)
![License](https://img.shields.io/badge/licença-MIT-blue)

Aplicação **full-stack** de controle de estoque: um **frontend em React** consome uma **API REST em Flask** que persiste os dados em um **banco SQLite**. Permite cadastrar, editar e remover produtos, filtrar por categoria/nome e acompanhar indicadores — inclusive **alertas de estoque baixo**.

## 🏗️ Arquitetura

```
┌─────────────────┐    HTTP/JSON      ┌──────────────────┐     SQL      ┌──────────┐
│  Frontend React │ ───────────────▶  │    API Flask     │ ───────────▶ │  SQLite  │
│   (Vite, :5173) │ ◀───────────────  │   REST (:5000)   │ ◀─────────── │   .db    │
└─────────────────┘                   └──────────────────┘              └──────────┘
```

- **Frontend** cuida da interface e do estado; não sabe SQL.
- **API** valida entradas, aplica regras e fala com o banco.
- **Banco** é criado e populado automaticamente na primeira execução.

## ✨ Funcionalidades

- 📋 **CRUD completo** de produtos (criar, listar, editar, remover)
- 🔎 **Busca por nome** (com debounce) e **filtro por categoria** — feitos na API
- 📊 **Dashboard** com indicadores: nº de produtos, itens em estoque, valor total e **alertas de estoque baixo**
- 🚨 **Destaque visual** para produtos abaixo do estoque mínimo
- ✅ **Validação no backend** (campos obrigatórios, tipos e valores não-negativos)
- 🌐 **CORS** configurado para o frontend consumir a API

## 🔌 API REST

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/produtos` | Lista produtos (`?categoria=&busca=`) |
| `GET` | `/api/produtos/<id>` | Detalha um produto |
| `POST` | `/api/produtos` | Cria um produto |
| `PUT` | `/api/produtos/<id>` | Atualiza um produto |
| `DELETE` | `/api/produtos/<id>` | Remove um produto |
| `GET` | `/api/resumo` | Indicadores do dashboard |
| `GET` | `/api/categorias` | Categorias distintas |

## 🛠️ Tecnologias

**Backend:** Python, **Flask**, flask-cors, **SQLite** (`sqlite3` da biblioteca padrão)

**Frontend:** **React 19**, Vite, Fetch API

## 🧠 O que este projeto demonstra

- **Separação em camadas**: `db.py` (acesso a dados) isolado de `app.py` (rotas/regras); no front, `services/api.js` isola o HTTP dos componentes.
- **API RESTful** com verbos e códigos de status corretos (`201`, `400`, `404`).
- **Validação e segurança**: *prepared statements* (evitam SQL Injection) e checagem de payload.
- **Integração front-back** com tratamento de estados de carregamento e erro.
- **Consultas SQL** com filtros dinâmicos e agregações para os indicadores.

## 🚀 Como rodar

Você precisa de **dois terminais** (um para o backend, outro para o frontend).

### 1) Backend (API Flask)

```bash
cd backend
pip install -r requirements.txt
python app.py          # sobe em http://localhost:5000
```

### 2) Frontend (React)

```bash
cd frontend
npm install
npm run dev            # sobe em http://localhost:5173
```

Abra `http://localhost:5173` no navegador. O banco `estoque.db` é criado e populado com exemplos automaticamente.

> Para apontar o frontend para outra URL de API, crie um arquivo `frontend/.env` com `VITE_API_URL=http://seu-host/api`.

## 📂 Estrutura

```
Controle-de-Estoque/
├── backend/
│   ├── app.py            # Rotas da API + validação
│   ├── db.py             # Conexão, criação e seed do SQLite
│   └── requirements.txt
└── frontend/
    └── src/
        ├── components/   # SummaryCards, Toolbar, ProductTable, ProductForm
        ├── hooks/        # useEstoque (CRUD + carregamento), useDebounce
        ├── services/     # api.js (comunicação com o backend)
        └── App.jsx
```

## 📄 Licença

MIT — veja [LICENSE](./LICENSE).

---

Feito por **Iasmin Ribeiro de Souza** · [LinkedIn](https://linkedin.com/in/SEU-PERFIL) · [GitHub](https://github.com/IasminRDS)
