// Importa módulos necessários
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db'); // Conexão com o banco PostgreSQL

// Módulos extras para autenticação
const bcrypt = require('bcrypt'); // Para criptografar a senha
const jwt = require('jsonwebtoken'); // Para gerar o token JWT

// Inicializa o servidor Express
const app = express();

// Importa rotas externas (ex: produtores)
const produtoresRuraisRoutes = require('./routes/produtoresRurais');

// Middlewares globais
app.use(cors()); // Libera acesso para o front-end
app.use(express.json()); // Permite receber JSON no body

// Usa as rotas de produtores
app.use('/produtores-rurais', produtoresRuraisRoutes);

// ------------------------------
// ROTA RAIZ
// ------------------------------
app.get('/', (req, res) => {
  res.send('🌿 API Bodega Ecológica rodando!');
});


// ------------------------------
// ROTA: Página inicial (Home)
// ------------------------------
app.get('/home', (req, res) => {
  res.send('🌿 Bem-vindo à Home da Bodega Ecológica!');
});


// ------------------------------
// ROTA: Lista todos os produtos com produtor e categoria
// ------------------------------
app.get('/produtos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id_produto,
        p.descricao AS nome,
        p.preco,
        p.unidade_medida,
        p.imagem_url,
        pr.nome AS nome_produtor,
        c.descricao AS categoria
      FROM produto p
      JOIN produtor_rural pr ON p.id_produtor = pr.id_produtor
      JOIN categoria c ON p.id_categoria = c.id_categoria;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    res.status(500).send('Erro no servidor');
  }
});

// ------------------------------
// ROTA: Cadastra novo produto
// ------------------------------
app.post('/produtos', async (req, res) => {
  const { descricao, preco, unidade_medida, id_produtor, id_categoria, imagem_url } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO produto 
        (descricao, preco, unidade_medida, id_produtor, id_categoria, imagem_url) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [descricao, preco, unidade_medida, id_produtor, id_categoria, imagem_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao cadastrar produto:', err);
    res.status(500).json({ erro: 'Erro ao cadastrar produto' });
  }
});

// ------------------------------
// ROTA: Lista categorias
// ------------------------------
app.get('/categorias', async (req, res) => {
  try {
    const result = await pool.query('SELECT id_categoria, descricao FROM categoria');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar categorias:', err);
    res.status(500).json({ erro: 'Erro ao buscar categorias' });
  }
});

// ------------------------------
// ROTA: Lista produtores rurais
// ------------------------------
app.get('/produtores-rurais', async (req, res) => {
  try {
    const result = await pool.query('SELECT id_produtor, nome FROM produtor_rural');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar produtores:', err);
    res.status(500).json({ erro: 'Erro ao buscar produtores' });
  }
});

// ------------------------------
// ROTA: Cadastro de usuários (cliente ou produtor)
// ------------------------------
app.post('/cadastrar', async (req, res) => {
  const { nome, email, senha, tipo_usuario } = req.body;

  try {
    // Verifica se já existe um email cadastrado
    const usuarioExistente = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if (usuarioExistente.rows.length > 0) {
      return res.status(400).send('Email já cadastrado.');
    }

    // Criptografa a senha antes de salvar no banco
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    // Insere novo usuário
    await pool.query(
      'INSERT INTO usuarios (nome, email, senha, tipo_usuario) VALUES ($1, $2, $3, $4)',
      [nome, email, senhaCriptografada, tipo_usuario]
    );

    res.status(201).send('Usuário cadastrado com sucesso!');
  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
    res.status(500).send('Erro ao cadastrar usuário.');
  }
});

// ------------------------------
// ROTA: Login do usuário
// ------------------------------
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Busca o usuário pelo email
    const resultado = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if (resultado.rows.length === 0) {
      return res.status(404).send('Usuário não encontrado.');
    }

    const usuario = resultado.rows[0];

    // Compara senha digitada com senha criptografada no banco
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).send('Senha incorreta.');
    }

    // Gera um token para autenticação
    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo_usuario },
      'segredo_super_secreto', // Substituir por process.env.JWT_SECRET
      { expiresIn: '1h' }
    );

    // Retorna token e dados básicos
    res.json({
      token,
      tipo: usuario.tipo_usuario,
      nome: usuario.nome,
    });
  } catch (err) {
    console.error('Erro ao fazer login:', err);
    res.status(500).send('Erro ao fazer login.');
  }
});

// ------------------------------
// INICIA O SERVIDOR
// ------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});

