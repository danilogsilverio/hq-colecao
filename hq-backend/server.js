import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import Database from 'better-sqlite3';

const app = express();
const db = new Database('hqcolecao.db', { verbose: console.log });

// Middleware
app.use(cors());
app.use(express.json());

// Criação da tabela colecao, se não existir
db.prepare(`
  CREATE TABLE IF NOT EXISTS colecao (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    hq_id TEXT,
    titulo TEXT,
    status TEXT,
    avaliacao INTEGER,
    comentario TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Rota para buscar HQs via ComicVine
app.get('/search', async (req, res) => {
  const q = req.query.q;

  if (!q) return res.status(400).json({ error: 'Parâmetro q é obrigatório' });

  try {
    const apiKey = 'f58bce1890f793149aee9a0d549e3127490e025a';
    const url = `https://comicvine.gamespot.com/api/issues/?api_key=${apiKey}&format=json&filter=name:${encodeURIComponent(q)}`;

    const response = await fetch(url, {
      headers: { 'User-Agent': 'HQ-Colecao-App' }
    });

    const data = await response.json();

    // Retornar só os resultados para o frontend
    res.json(data.results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro na API ComicVine' });
  }
});

// Rota para adicionar HQ na coleção
app.post('/colecao', (req, res) => {
  const { user_id, hq_id, titulo, status, avaliacao, comentario } = req.body;

  if (!user_id || !hq_id || !titulo) {
    return res.status(400).json({ error: 'Campos user_id, hq_id e titulo são obrigatórios' });
  }

  const stmt = db.prepare(`
    INSERT INTO colecao (user_id, hq_id, titulo, status, avaliacao, comentario)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  try {
    stmt.run(user_id, hq_id, titulo, status || 'quero ler', avaliacao || null, comentario || null);
    res.status(201).json({ message: 'HQ adicionada à coleção' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao salvar no banco' });
  }
});

// Rota para deletar HQ da coleção
app.delete('/colecao/:id', (req, res) => {
  const id = req.params.id;

  const stmt = db.prepare(`DELETE FROM colecao WHERE id = ?`);
  const result = stmt.run(id);

  if (result.changes > 0) {
    res.json({ message: 'HQ removida da coleção com sucesso' });
  } else {
    res.status(404).json({ error: 'HQ não encontrada' });
  }
});

// Rota para listar HQs da coleção de um usuário
app.get('/colecao/:user_id', (req, res) => {
  const userId = req.params.user_id;

  const stmt = db.prepare(`SELECT * FROM colecao WHERE user_id = ? ORDER BY criado_em DESC`);
  const colecao = stmt.all(userId);

  res.json(colecao);
});

// Servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});