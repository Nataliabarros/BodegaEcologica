// LoginUsuario.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa para redirecionamento

function LoginUsuario() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate(); // Hook para redirecionar

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const resposta = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        // ✅ Armazena dados no localStorage
        localStorage.setItem('token', dados.token);
        localStorage.setItem('nome', dados.nome);

        setMensagem(`✅ Bem-vindo(a), ${dados.nome}`);

        // ✅ Redireciona para a tela de produtos
        navigate('/produtos');
      } else {
        setMensagem(`❌ ${dados.erro || 'Login falhou'}`);
      }
    } catch (erro) {
      setMensagem('Erro ao conectar com o servidor');
      console.error(erro);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label>Senha:</label><br />
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: '1rem' }}>Entrar</button>
      </form>
      {mensagem && <p style={{ marginTop: '1rem', color: 'green' }}>{mensagem}</p>}
    </div>
  );
}

export default LoginUsuario;


