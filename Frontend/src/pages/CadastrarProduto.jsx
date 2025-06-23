import React, { useState, useEffect } from "react";
import './CadastrarProdutos.css'; // Importa o arquivo de estilo CSS

// Função principal do componente
function CadastrarProduto() {
  // Estado para armazenar os dados do formulário
  const [form, setForm] = useState({
    descricao: "",        // Nome do produto
    preco: "",            // Preço
    unidade_medida: "",   // Unidade (ex: kg, litro)
    id_categoria: "",     // Categoria (chave estrangeira)
    id_produtor: "",      // Produtor (chave estrangeira)
    imagem_url: ""        // URL da imagem do produto
  });

  // Estados para armazenar as opções vindas da API
  const [categorias, setCategorias] = useState([]);  // Lista de categorias
  const [produtores, setProdutores] = useState([]);  // Lista de produtores

  // useEffect executa quando o componente é carregado
  useEffect(() => {
    // Busca categorias no backend
    fetch("http://localhost:5000/categorias")
      .then(res => res.json())
      .then(data => setCategorias(data)) // Armazena categorias no estado
      .catch(err => console.error("Erro ao buscar categorias", err));

    // Busca produtores rurais no backend
    fetch("http://localhost:5000/produtores-rurais")
      .then(res => res.json())
      .then(data => setProdutores(data)) // Armazena produtores no estado
      .catch(err => console.error("Erro ao buscar produtores", err));
  }, []);

  // Função que atualiza os campos do formulário
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Função chamada ao enviar o formulário
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que a página recarregue

    // Envia os dados para o backend via POST
    fetch("http://localhost:5000/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        alert("Produto cadastrado com sucesso!");

        // Limpa o formulário após o cadastro
        setForm({
          descricao: "",
          preco: "",
          unidade_medida: "",
          id_categoria: "",
          id_produtor: "",
          imagem_url: ""
        });
      })
      .catch(err => {
        console.error(err);
        alert("Erro ao cadastrar produto.");
      });
  };

  // Interface HTML que será renderizada
  return (
    <div className="container mt-4">
      <h2>Cadastrar Produto</h2>
      <form onSubmit={handleSubmit}>
        {/* Campo: Descrição do produto */}
        <div className="mb-2">
          <label>Nome (Descrição):</label>
          <input
            type="text"
            className="form-control"
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            required
          />
        </div>

        {/* Campo: Preço */}
        <div className="mb-2">
          <label>Preço:</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            name="preco"
            value={form.preco}
            onChange={handleChange}
            required
          />
        </div>

        {/* Campo: Unidade de medida */}
        <div className="mb-2">
          <label>Unidade de Medida:</label>
          <input
            type="text"
            className="form-control"
            name="unidade_medida"
            value={form.unidade_medida}
            onChange={handleChange}
          />
        </div>

        {/* Campo: Selecionar categoria */}
        <div className="mb-2">
          <label>Categoria:</label>
          <select
            className="form-control"
            name="id_categoria"
            value={form.id_categoria}
            onChange={handleChange}
            required
          >
            <option value="">Selecione a categoria</option>
            {categorias.map(cat => (
              <option key={cat.id_categoria} value={cat.id_categoria}>
                {cat.descricao}
              </option>
            ))}
          </select>
        </div>

        {/* Campo: Selecionar produtor rural */}
        <div className="mb-2">
          <label>Produtor Rural:</label>
          <select
            className="form-control"
            name="id_produtor"
            value={form.id_produtor}
            onChange={handleChange}
            required
          >
            <option value="">Selecione o produtor</option>
            {produtores.map(prod => (
              <option key={prod.id_produtor} value={prod.id_produtor}>
                {prod.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Campo: URL da imagem do produto */}
        <div className="mb-2">
          <label>URL da Imagem do Produto:</label>
          <input
            type="text"
            className="form-control"
            name="imagem_url"
            value={form.imagem_url}
            onChange={handleChange}
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>

        {/* Botão para enviar o formulário */}
        <button type="submit" className="btn btn-success">Cadastrar</button>
      </form>
    </div>
  );
}

export default CadastrarProduto;



