const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Configuração da conexão com o PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "wellcontroled",
  password: "admin",
  port: 5432,
});

// --- ROTAS DO CRUD ---
app.get("/transacoes/:usuario_id", async (req, res) => {
  const { usuario_id } = req.params;
  try {
    const transacoes = await pool.query(
      "SELECT * FROM transacoes WHERE usuario_id = $1 ORDER BY id DESC",
      [usuario_id],
    );
    res.json(transacoes.rows);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar transações." });
  }
});

// 1. Cadastrar Usuário (CREATE)
app.post("/usuarios", async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const novoUsuario = await pool.query(
      "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *",
      [nome, email, senha],
    );
    res.status(201).json(novoUsuario.rows[0]);
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao cadastrar usuário (E-mail já existe?)." });
  }
});

// 2. Listar Transações de um Usuário (READ)
app.get("/transacoes/:usuario_id", async (req, res) => {
  const { usuario_id } = req.params;
  try {
    const transacoes = await pool.query(
      "SELECT * FROM transacoes WHERE usuario_id = $1 ORDER BY id DESC",
      [usuario_id],
    );
    res.json(transacoes.rows);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar transações." });
  }
});

// 3. Adicionar Transação (CREATE)
app.post("/transacoes", async (req, res) => {
  const { usuario_id, descricao, valor } = req.body;
  try {
    const novaTransacao = await pool.query(
      "INSERT INTO transacoes (usuario_id, descricao, valor) VALUES ($1, $2, $3) RETURNING *",
      [usuario_id, descricao, valor],
    );
    res.status(201).json(novaTransacao.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao criar transação." });
  }
});

// 4. Deletar Transação (DELETE)
app.delete("/transacoes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM transacoes WHERE id = $1", [id]);
    res.json({ mensagem: "Transação deletada com sucesso!" });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao deletar transação." });
  }
});

// 5. Atualizar Transação (UPDATE)
app.put("/transacoes/:id", async (req, res) => {
  const { id } = req.params;
  const { descricao, valor } = req.body;
  try {
    const transacaoAtualizada = await pool.query(
      "UPDATE transacoes SET descricao = $1, valor = $2 WHERE id = $3 RETURNING *",
      [descricao, valor, id],
    );
    res.json(transacaoAtualizada.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar transação." });
  }
});

// Rota de Login
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const resultado = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1 AND senha = $2",
      [email, senha],
    );

    if (resultado.rows.length > 0) {
      const usuario = resultado.rows.logado || resultado.rows[0];
      res.json({ mensagem: "Login bem-sucedido!", usuario });
    } else {
      res.status(401).json({ erro: "E-mail ou senha inválidos." });
    }
  } catch (err) {
    res.status(500).json({ erro: "Erro no servidor ao tentar fazer login." });
  }
});

// Inicializando o Servidor
app.listen(3000, () => {
  console.log("🚀 Servidor rodando na porta 3000");
});
