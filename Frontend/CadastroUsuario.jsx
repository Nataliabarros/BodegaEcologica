import { useState } from 'react';

function CadastroUsuario() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState('cliente'); // cliente ou produtor
  const [mensagem, setMensagem] = useState('');

  const handleCadastro = async (e) => {
    e.preventDefault();

    try {
      const resposta = await fetch('http://localhost:5000/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          email,
          senha,
          tipo_usuario: tipo,
        }),
      });

      if (resposta.ok) {
        setMensagem('✅ Usuário cadastrado com sucesso!');
        setNome('');
        setEmail('');
        setSenha('');
      } else {
        const dados = await resposta.text();
        setMensagem(`❌ Erro: ${dados}`);
      }
    } catch (erro) {
      setMensagem('Erro ao conectar com o servidor.');
      console.error(erro);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Cadastro de Usuário</h2>
      <form onSubmit={handleCadastro}>
        <div>
          <label>Nome:</label><br />
          <input value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label><br />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Senha:</label><br />
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        </div>
        <div>
          <label>Tipo de Usuário:</label><br />
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="cliente">Cliente</option>
            <option value="produtor">Produtor</option>
          </select>
        </div>
        <button type="submit" style={{ marginTop: '1rem' }}>Cadastrar</button>
      </form>
      {mensagem && <p style={{ marginTop: '1rem' }}>{mensagem}</p>}
    </div>
  );
}

export default CadastroUsuario;
