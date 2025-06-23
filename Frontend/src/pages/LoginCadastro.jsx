// Importa o useState do React para controlar os campos digitados e a exibição
import { useState } from 'react';
// Importa o axios para enviar dados para o backend via requisição HTTP
import axios from 'axios';
import './LoginCadastro.css';


// Exporta o componente LoginCadastro para ser usado no App
export default function LoginCadastro() {
  // ---------------------
  // ESTADOS DO LOGIN
  // ---------------------

  // Guarda o email digitado no campo de login
  const [emailLogin, setEmailLogin] = useState('');
  // Guarda a senha digitada no campo de login
  const [senhaLogin, setSenhaLogin] = useState('');

  // ---------------------
  // ESTADOS DO CADASTRO
  // ---------------------

  // Controla se o formulário de cadastro vai aparecer ou não na tela
  const [mostrarCadastro, setMostrarCadastro] = useState(false);
  // Campos do formulário de cadastro
  const [nome, setNome] = useState('');
  const [emailCadastro, setEmailCadastro] = useState('');
  const [senhaCadastro, setSenhaCadastro] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('cliente'); // valor padrão

  // ---------------------
  // FUNÇÃO DE LOGIN
  // ---------------------
  const handleLogin = async (e) => {
    e.preventDefault(); // evita recarregar a página

    try {
      // Envia os dados de login para o backend
      const res = await axios.post('http://localhost:3000/login', {
        email: emailLogin,
        senha: senhaLogin,
      });

      // Salva o token e o tipo de usuário no localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('tipo_usuario', res.data.tipo);

      alert('Login realizado com sucesso!');
      window.location.href = '/'; // redireciona para a página principal
    } catch (err) {
      alert('Erro no login: ' + (err.response?.data || 'Erro desconhecido'));
    }
  };

  // ---------------------
  // FUNÇÃO DE CADASTRO
  // ---------------------
  const handleCadastro = async (e) => {
    e.preventDefault();

    try {
      // Envia os dados de cadastro para o backend
      await axios.post('http://localhost:3000/cadastrar', {
        nome,
        email: emailCadastro,
        senha: senhaCadastro,
        tipo_usuario: tipoUsuario,
      });

      alert('Cadastro realizado com sucesso!');
      // Após cadastro, oculta o formulário de cadastro
      setMostrarCadastro(false);
    } catch (err) {
      alert('Erro no cadastro: ' + (err.response?.data || 'Erro desconhecido'));
    }
  };

  // ---------------------
  // INTERFACE DO COMPONENTE (HTML JSX)
  // ---------------------
  return (
     <div className="auth-container">
      <h2>Login</h2>

      {/* Formulário de Login */}
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

      {/* Botão para abrir ou fechar o formulário de cadastro */}
      <p>
        Ainda não tem cadastro?{' '}
        <button onClick={() => setMostrarCadastro(!mostrarCadastro)}>
          {mostrarCadastro ? 'Fechar cadastro' : 'Clique aqui'}
        </button>
      </p>

      {/* Formulário de Cadastro (só aparece se mostrarCadastro for true) */}
      {mostrarCadastro && (
        <>
          <h2>Cadastro</h2>
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

            {/* Campo tipo de usuário: cliente ou produtor */}
            <label>Tipo de Usuário:</label>
            <select
              value={tipoUsuario}
              onChange={(e) => setTipoUsuario(e.target.value)}
            >
              <option value="cliente">Cliente</option>
              <option value="produtor">Produtor</option>
            </select>

            <button type="submit">Cadastrar</button>
          </form>
        </>
      )}
    </div>
  );
}
