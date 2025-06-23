import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom"; // React Router para navegação
import './pages/Menu.css'; // Estilo da barra de navegação

// Importação das páginas
import Produtos from "./pages/Produtos.jsx";
import CadastrarProduto from "./pages/CadastrarProduto.jsx";
import Login from "./pages/LoginCadastro2.jsx"; // ✅ Corrigido nome do componente de Login
import CadastroUsuario from "./pages/CadastroUsuario.jsx"; 
import Home from "./pages/Home.jsx";
import LoginCadastro2 from "./pages/LoginCadastro2.jsx";

// Componente simples para o carrinho (pode ser melhorado depois)
function Carrinho() {
  return <div className="page-content"><h2>Carrinho</h2></div>;
}

// Componente principal da aplicação
function App() {
  const [tipoUsuario, setTipoUsuario] = useState("");

  useEffect(() => {
    const tipo = localStorage.getItem("tipoUsuario");
    setTipoUsuario(tipo);
  }, []);

  return (
    <div>
      {/* ----------------------------- */}
      {/* BARRA DE NAVEGAÇÃO SUPERIOR */}
      {/* ----------------------------- */}
      <nav className="menu">
        <span className="logo">Bodega Ecológica</span>

        <div className="menu-links">
          {/* Links para as páginas principais */}
          <Link to="/home">Home</Link>
          <Link to="/Login">Login</Link>
          <Link to="/produtos">Produtos</Link>
          <Link to="/carrinho">Carrinho</Link>

          {/* ✅ Mostrar apenas se tipoUsuario for "produtor" */}
          {tipoUsuario === "produtor" && (
            <Link to="/cadastrar">Cadastrar Produto</Link>
          )}

          <Link to="/cadastro">Cadastrar Usuário</Link>
        </div>
      </nav>

      {/* ----------------------------- */}
      {/* ROTAS DO SISTEMA (React Router) */}
      {/* ----------------------------- */}
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/Login" element={<LoginCadastro2 />} /> {/* ✅ Corrigido */}
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/cadastrar" element={<CadastrarProduto />} />
        <Route path="/cadastro" element={<CadastroUsuario />} />
      </Routes>
    </div>
  );
}

export default App;


