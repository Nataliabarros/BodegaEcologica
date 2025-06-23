// Importando as bibliotecas necessárias
const express = require('express');           // Framework web (rotas, servidor, etc.)
const bcrypt = require('bcrypt');             // Para criptografar a senha
const jwt = require('jsonwebtoken');          // Para criar o token de autenticação
const router = express.Router();              // Criando o objeto de rotas
const db = require('../db');                  // Importando a conexão com o banco (PostgreSQL)

// Chave secreta usada para assinar o token ( colocar isso depois em um arquivo .env)
const JWT_SECRET = 'segredo123';

// ==========================================
// ========== ROTA DE CADASTRO ==============
// ==========================================
router.post('/register', async (req, res) => {
  // Pegando os dados enviados pelo frontend
  const { nome, email, senha, tipo_usuario } = req.body;

  try {
    // Criptografando a senha antes de salvar no banco
    const hash = await bcrypt.hash(senha, 10); // 10 é o número de "salt rounds"

    // Inserindo o usuário no banco com a senha criptografada
    await db.query(
      'INSERT INTO usuarios (nome, email, senha, tipo_usuario) VALUES ($1, $2, $3, $4)',
      [nome, email, hash, tipo_usuario]
    );

    // Respondendo com sucesso
    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso' });
  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
    res.status(500).json({ erro: 'Erro no cadastro' });
  }
});

// ==========================================
// ============== ROTA DE LOGIN =============
// ==========================================
router.post('/login', async (req, res) => {
  // Pegando os dados enviados pelo frontend
  const { email, senha } = req.body;

  try {
    // Buscando o usuário no banco pelo email
    const resultado = await db.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );

    const usuario = resultado.rows[0]; // Pegando o primeiro resultado

    // Se não encontrou nenhum usuário com esse email
    if (!usuario) {
      return res.status(401).json({ erro: 'Usuário não encontrado' });
    }

    // Comparando a senha digitada com a senha do banco (criptografada)
    const senhaOk = await bcrypt.compare(senha, usuario.senha);

    // Se a senha estiver errada
    if (!senhaOk) {
      return res.status(401).json({ erro: 'Senha incorreta' });
    }

    // Gerando um token JWT com o id e tipo do usuário
    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo_usuario },
      JWT_SECRET,
      { expiresIn: '1h' } // expira em 1 hora
    );

    // Enviando o token como resposta
    res.json({ mensagem: 'Login realizado com sucesso', token });
  } catch (err) {
    console.error('Erro ao fazer login:', err);
    res.status(500).json({ erro: 'Erro no login' });
  }
});

// Exportando esse conjunto de rotas para usar no app principal
module.exports = router;
