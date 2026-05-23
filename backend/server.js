const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

function validarEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// CREATE
app.post('/devs', async (req, res) => {
  try {
    const { nome, email, nivel } = req.body;

    if (!nome || !email || !nivel) {
      return res.status(422).json({ erro: 'Nome, email e nível são obrigatórios' });
    }

    if (!validarEmail(email)) {
      return res.status(422).json({ erro: 'Email inválido' });
    }

    const nivelValido = ['Junior', 'Pleno', 'Senior'];
    if (!nivelValido.includes(nivel)) {
      return res.status(422).json({ erro: 'Nível deve ser Junior, Pleno ou Senior' });
    }

    const r = await pool.query(
      'INSERT INTO desenvolvedores (nome, email, nivel) VALUES ($1,$2,$3) RETURNING *',
      [nome, email, nivel]
    );
    res.status(201).json(r.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(422).json({ erro: 'Email já cadastrado' });
    }
    res.status(500).json({ erro: 'Erro ao criar desenvolvedor' });
  }
});

// READ
app.get('/devs', async (req, res) => {
  try {
    const r = await pool.query('SELECT * FROM desenvolvedores ORDER BY id');
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar desenvolvedores' });
  }
});

// UPDATE
app.put('/devs/:id', async (req, res) => {
  try {
    const { nome, email, nivel } = req.body;
    const { id } = req.params;

    if (!nome || !email || !nivel) {
      return res.status(422).json({ erro: 'Nome, email e nível são obrigatórios' });
    }

    if (!validarEmail(email)) {
      return res.status(422).json({ erro: 'Email inválido' });
    }

    const nivelValido = ['Junior', 'Pleno', 'Senior'];
    if (!nivelValido.includes(nivel)) {
      return res.status(422).json({ erro: 'Nível deve ser Junior, Pleno ou Senior' });
    }

    const check = await pool.query('SELECT id FROM desenvolvedores WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ erro: 'Desenvolvedor não encontrado' });
    }

    const r = await pool.query(
      'UPDATE desenvolvedores SET nome=$1, email=$2, nivel=$3 WHERE id=$4 RETURNING *',
      [nome, email, nivel, id]
    );
    res.json(r.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(422).json({ erro: 'Email já cadastrado' });
    }
    res.status(500).json({ erro: 'Erro ao atualizar desenvolvedor' });
  }
});

// DELETE
app.delete('/devs/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const check = await pool.query('SELECT id FROM desenvolvedores WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ erro: 'Desenvolvedor não encontrado' });
    }

    await pool.query('DELETE FROM desenvolvedores WHERE id=$1', [id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar desenvolvedor' });
  }
});

// ===== HABILIDADES =====
app.get('/habilidades', async (req, res) => {
  try {
    const r = await pool.query('SELECT * FROM habilidades ORDER BY id');
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar habilidades' });
  }
});

app.post('/habilidades', async (req, res) => {
  try {
    const { nome } = req.body;
    if (!nome) {
      return res.status(422).json({ erro: 'Nome é obrigatório' });
    }
    const r = await pool.query('INSERT INTO habilidades (nome) VALUES ($1) RETURNING *', [nome]);
    res.status(201).json(r.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar habilidade' });
  }
});

app.delete('/habilidades/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM habilidades WHERE id=$1', [id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar habilidade' });
  }
});

// ===== PROJETOS =====
app.get('/projetos', async (req, res) => {
  try {
    const r = await pool.query(`
      SELECT p.*, d.nome as dev_nome 
      FROM projetos p 
      LEFT JOIN desenvolvedores d ON p.dev_id = d.id 
      ORDER BY p.id
    `);
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar projetos' });
  }
});

app.post('/projetos', async (req, res) => {
  try {
    const { nome, descricao, dev_id } = req.body;
    if (!nome || !dev_id) {
      return res.status(422).json({ erro: 'Nome e desenvolvedor são obrigatórios' });
    }
    const r = await pool.query(
      'INSERT INTO projetos (nome, descricao, dev_id) VALUES ($1, $2, $3) RETURNING *',
      [nome, descricao, dev_id]
    );
    res.status(201).json(r.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar projeto' });
  }
});

app.put('/projetos/:id', async (req, res) => {
  try {
    const { nome, descricao, dev_id } = req.body;
    const { id } = req.params;
    if (!nome || !dev_id) {
      return res.status(422).json({ erro: 'Nome e desenvolvedor são obrigatórios' });
    }
    const r = await pool.query(
      'UPDATE projetos SET nome=$1, descricao=$2, dev_id=$3 WHERE id=$4 RETURNING *',
      [nome, descricao, dev_id, id]
    );
    res.json(r.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar projeto' });
  }
});

app.delete('/projetos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM projetos WHERE id=$1', [id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar projeto' });
  }
});

// ===== DEV_HABILIDADES (relação M:N) =====
app.get('/dev-habilidades/:dev_id', async (req, res) => {
  try {
    const { dev_id } = req.params;
    const r = await pool.query(`
      SELECT h.* FROM habilidades h
      INNER JOIN dev_habilidades dh ON h.id = dh.hab_id
      WHERE dh.dev_id = $1
      ORDER BY h.id
    `, [dev_id]);
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar habilidades do desenvolvedor' });
  }
});

app.post('/dev-habilidades', async (req, res) => {
  try {
    const { dev_id, hab_id } = req.body;
    if (!dev_id || !hab_id) {
      return res.status(422).json({ erro: 'dev_id e hab_id são obrigatórios' });
    }
    const r = await pool.query(
      'INSERT INTO dev_habilidades (dev_id, hab_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
      [dev_id, hab_id]
    );
    res.status(201).json(r.rows[0] || { dev_id, hab_id });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao associar habilidade' });
  }
});

app.delete('/dev-habilidades/:dev_id/:hab_id', async (req, res) => {
  try {
    const { dev_id, hab_id } = req.params;
    await pool.query('DELETE FROM dev_habilidades WHERE dev_id=$1 AND hab_id=$2', [dev_id, hab_id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao remover habilidade' });
  }
});

app.listen(3001, '0.0.0.0', () => {
  console.log('✓ API rodando na porta 3001');
  console.log('✓ Conectado ao banco:', process.env.DB_NAME);
});