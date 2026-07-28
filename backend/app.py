"""
API REST de Controle de Estoque (Flask + SQLite).

Endpoints:
    GET    /api/produtos          Lista produtos (?categoria=&busca=)
    GET    /api/produtos/<id>     Detalha um produto
    POST   /api/produtos          Cria um produto
    PUT    /api/produtos/<id>     Atualiza um produto
    DELETE /api/produtos/<id>     Remove um produto
    GET    /api/resumo            Indicadores do estoque
    GET    /api/categorias        Lista de categorias distintas

Rodar:
    pip install -r requirements.txt
    python app.py
"""

from flask import Flask, jsonify, request
from flask_cors import CORS

from db import get_connection, init_db

app = Flask(__name__)
CORS(app)  # libera o acesso do frontend React (outra porta)

# Campos obrigatórios e seus tipos para validação de entrada.
CAMPOS = {
    "nome": str,
    "categoria": str,
    "quantidade": int,
    "preco": float,
    "estoque_min": int,
}


def validar_payload(dados: dict) -> tuple[dict, str | None]:
    """Valida e converte o corpo da requisição. Retorna (limpo, erro)."""
    if not dados:
        return {}, "Corpo da requisição vazio."

    limpo = {}
    for campo, tipo in CAMPOS.items():
        if campo not in dados:
            return {}, f"Campo obrigatório ausente: '{campo}'."
        try:
            valor = tipo(dados[campo])
        except (ValueError, TypeError):
            return {}, f"Campo '{campo}' deve ser do tipo {tipo.__name__}."
        limpo[campo] = valor

    if not limpo["nome"].strip():
        return {}, "O nome não pode ser vazio."
    if limpo["quantidade"] < 0 or limpo["estoque_min"] < 0:
        return {}, "Quantidade e estoque mínimo não podem ser negativos."
    if limpo["preco"] < 0:
        return {}, "O preço não pode ser negativo."

    return limpo, None


@app.get("/api/produtos")
def listar_produtos():
    categoria = request.args.get("categoria", "").strip()
    busca = request.args.get("busca", "").strip()

    sql = "SELECT * FROM produtos WHERE 1=1"
    params = []
    if categoria:
        sql += " AND categoria = ?"
        params.append(categoria)
    if busca:
        sql += " AND nome LIKE ?"
        params.append(f"%{busca}%")
    sql += " ORDER BY nome"

    conn = get_connection()
    linhas = conn.execute(sql, params).fetchall()
    conn.close()
    return jsonify([dict(l) for l in linhas])


@app.get("/api/produtos/<int:produto_id>")
def detalhar_produto(produto_id: int):
    conn = get_connection()
    linha = conn.execute(
        "SELECT * FROM produtos WHERE id = ?", (produto_id,)
    ).fetchone()
    conn.close()
    if linha is None:
        return jsonify({"erro": "Produto não encontrado."}), 404
    return jsonify(dict(linha))


@app.post("/api/produtos")
def criar_produto():
    limpo, erro = validar_payload(request.get_json(silent=True))
    if erro:
        return jsonify({"erro": erro}), 400

    conn = get_connection()
    cur = conn.execute(
        """INSERT INTO produtos (nome, categoria, quantidade, preco, estoque_min)
           VALUES (?, ?, ?, ?, ?)""",
        (limpo["nome"], limpo["categoria"], limpo["quantidade"],
         limpo["preco"], limpo["estoque_min"]),
    )
    conn.commit()
    novo = conn.execute(
        "SELECT * FROM produtos WHERE id = ?", (cur.lastrowid,)
    ).fetchone()
    conn.close()
    return jsonify(dict(novo)), 201


@app.put("/api/produtos/<int:produto_id>")
def atualizar_produto(produto_id: int):
    limpo, erro = validar_payload(request.get_json(silent=True))
    if erro:
        return jsonify({"erro": erro}), 400

    conn = get_connection()
    existe = conn.execute(
        "SELECT id FROM produtos WHERE id = ?", (produto_id,)
    ).fetchone()
    if existe is None:
        conn.close()
        return jsonify({"erro": "Produto não encontrado."}), 404

    conn.execute(
        """UPDATE produtos
           SET nome = ?, categoria = ?, quantidade = ?, preco = ?, estoque_min = ?
           WHERE id = ?""",
        (limpo["nome"], limpo["categoria"], limpo["quantidade"],
         limpo["preco"], limpo["estoque_min"], produto_id),
    )
    conn.commit()
    atualizado = conn.execute(
        "SELECT * FROM produtos WHERE id = ?", (produto_id,)
    ).fetchone()
    conn.close()
    return jsonify(dict(atualizado))


@app.delete("/api/produtos/<int:produto_id>")
def remover_produto(produto_id: int):
    conn = get_connection()
    cur = conn.execute("DELETE FROM produtos WHERE id = ?", (produto_id,))
    conn.commit()
    conn.close()
    if cur.rowcount == 0:
        return jsonify({"erro": "Produto não encontrado."}), 404
    return jsonify({"mensagem": "Produto removido."})


@app.get("/api/resumo")
def resumo():
    """Indicadores para os cartões do dashboard."""
    conn = get_connection()
    linhas = conn.execute("SELECT quantidade, preco, estoque_min FROM produtos").fetchall()
    conn.close()

    total_produtos = len(linhas)
    valor_estoque = sum(l["quantidade"] * l["preco"] for l in linhas)
    itens = sum(l["quantidade"] for l in linhas)
    estoque_baixo = sum(1 for l in linhas if l["quantidade"] <= l["estoque_min"])

    return jsonify({
        "total_produtos": total_produtos,
        "itens_em_estoque": itens,
        "valor_estoque": round(valor_estoque, 2),
        "alertas_estoque_baixo": estoque_baixo,
    })


@app.get("/api/categorias")
def categorias():
    conn = get_connection()
    linhas = conn.execute(
        "SELECT DISTINCT categoria FROM produtos ORDER BY categoria"
    ).fetchall()
    conn.close()
    return jsonify([l["categoria"] for l in linhas])


if __name__ == "__main__":
    init_db()
    app.run(debug=True, port=5000)
