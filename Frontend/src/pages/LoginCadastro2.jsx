// Importa hooks do React e ferramentas auxiliares
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Biblioteca para chamadas HTTP
import './LoginCadastro2.css'; // Estilo opcional

export default function Login() {
  const navigate = useNavigate(); // Usado para redirecionar após login/cadastro

  // Alterna entre modo login e modo cadastro
  const [modoCadastro, setModoCadastro] = useState(false);

  // Estados do formulário de login
  const [emailLogin, setEmailLogin] = useState('');
  const [senhaLogin, setSenhaLogin] = useState('');

  // Estados do formulário de cadastro
  const [nome, setNome] = useState('');
  const [emailCadastro, setEmailCadastro] = useState('');
  const [senhaCadastro, setSenhaCadastro] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('cliente'); // cliente, produtor, administrador

  // Mensagem de feedback (sucesso ou erro)
  const [mensagem, setMensagem] = useState('');

  // --- Função de login ---
  const handleLogin = async (e) => {
    e.preventDefault(); // Evita recarregamento da página

    try {
      const resposta = await axios.post('http://localhost:5000/login', {
        email: emailLogin,
        senha: senhaLogin,
      });

      // Salva os dados retornados no localStorage
      localStorage.setItem('token', resposta.data.token);
      localStorage.setItem('nome', resposta.data.nome);
      localStorage.setItem('tipoUsuario', resposta.data.tipo); // usado para condicionar navbar

      setMensagem(`✅ Bem-vindo(a), ${resposta.data.nome}`);
      
      // Redireciona para a página de produtos
      navigate('/produtos');
    } catch (erro) {
      setMensagem('❌ Erro no login: ' + (erro.response?.data?.erro || 'Erro desconhecido'));
    }
  };

  // --- Função de cadastro ---
  const handleCadastro = async (e) => {
    e.preventDefault();

    try {
      // Envia os dados do formulário para a API
      const resposta = await axios.post('http://localhost:5000/cadastrar', {
        nome,
        email: emailCadastro,
        senha: senhaCadastro,
        tipo_usuario: tipoUsuario,
      });

      // ✅ Armazena o tipo no localStorage (usado para controlar acesso na navbar)
      localStorage.setItem('tipoUsuario', tipoUsuario);

      // ✅ Se for produtor, redireciona para a tela de cadastrar produto
      if (tipoUsuario === 'produtor') {
        navigate('/cadastrar');
      } else {
        // Para clientes ou outros tipos, volta para o login
        setMensagem('✅ Cadastro realizado com sucesso! Faça login agora.');
        setModoCadastro(false); // Alterna para o modo login
      }
    } catch (erro) {
      setMensagem('❌ Erro no cadastro: ' + (erro.response?.data?.erro || 'Erro desconhecido'));
    }
  };

  // --- JSX com formulários condicionais ---
  return (
    <div className="auth-container">
      <h2>{modoCadastro ? 'Cadastro de Usuário' : 'Login'}</h2>

      {!modoCadastro ? (
        // --- Formulário de Login ---
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={emailLogin}
            onChange={(e) => setEmailLogin(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senhaLogin}
            onChange={(e) => setSenhaLogin(e.target.value)}
            required
          />
          <button type="submit">Entrar</button>
        </form>
      ) : (
        // --- Formulário de Cadastro ---
        <form onSubmit={handleCadastro}>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={emailCadastro}
            onChange={(e) => setEmailCadastro(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senhaCadastro}
            onChange={(e) => setSenhaCadastro(e.target.value)}
            required
          />
          <label>Tipo de Usuário:</label>
          <select
            value={tipoUsuario}
            onChange={(e) => setTipoUsuario(e.target.value)}
          >
            <option value="cliente">Cliente</option>
            <option value="produtor">Produtor</option>
            <option value="administrador">Administrador</option>
          </select>
          <button type="submit">Cadastrar</button>
        </form>
      )}

      {/* Mensagem de feedback */}
      {mensagem && <p style={{ marginTop: '1rem', color: 'green' }}>{mensagem}</p>}

      {/* Botão para alternar entre login e cadastro */}
      <p style={{ marginTop: '1rem' }}>
        {modoCadastro ? 'Já tem conta?' : 'Ainda não tem conta?'}{' '}
        <button className="btn-link" onClick={() => setModoCadastro(!modoCadastro)}>
          {modoCadastro ? 'Fazer Login' : 'Cadastre-se'}
        </button>
      </p>
    </div>
  );
}
