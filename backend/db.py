"""
Camada de banco de dados (SQLite via biblioteca padrão do Python).

Responsável por abrir conexões, criar a tabela na primeira execução e
popular com alguns produtos de exemplo. Mantém o SQL isolado da API.
"""

import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "estoque.db"


def get_connection() -> sqlite3.Connection:
    """Abre uma conexão cujas linhas se comportam como dicionários."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # acesso por nome de coluna
    return conn


def init_db() -> None:
    """Cria a tabela (se não existir) e insere dados de exemplo uma vez."""
    conn = get_connection()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS produtos (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            nome          TEXT    NOT NULL,
            categoria     TEXT    NOT NULL,
            quantidade    INTEGER NOT NULL DEFAULT 0,
            preco         REAL    NOT NULL DEFAULT 0,
            estoque_min   INTEGER NOT NULL DEFAULT 5
        )
        """
    )

    # Semeia apenas se a tabela estiver vazia.
    total = conn.execute("SELECT COUNT(*) AS n FROM produtos").fetchone()["n"]
    if total == 0:
        exemplos = [
            ("Fone Bluetooth", "Eletrônicos", 24, 179.90, 10),
            ("Mouse Gamer", "Informática", 8, 129.90, 10),
            ("Teclado Mecânico", "Informática", 15, 319.00, 8),
            ("Cadeira Ergonômica", "Móveis", 3, 899.00, 5),
            ("Garrafa Térmica", "Casa", 40, 59.90, 15),
            ("Luminária LED", "Casa", 6, 89.90, 10),
            ("Smartwatch", "Eletrônicos", 12, 449.00, 6),
            ("Caderno A5", "Papelaria", 120, 19.90, 30),
        ]
        conn.executemany(
            """INSERT INTO produtos (nome, categoria, quantidade, preco, estoque_min)
               VALUES (?, ?, ?, ?, ?)""",
            exemplos,
        )
        conn.commit()

    conn.close()
