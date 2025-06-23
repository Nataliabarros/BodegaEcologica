// Importa os hooks do React e a biblioteca axios para requisições HTTP
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Importa o CSS para estilização do componente
import "./Produtos.css"; 

// Função principal do componente Produtos
function Produtos() {
  // Hook de estado para armazenar a lista de produtos
  const [produtos, setProdutos] = useState([]);

  // useEffect executa a função apenas uma vez quando o componente é montado
  useEffect(() => {
    // Requisição GET ao backend para buscar os produtos cadastrados
    axios.get('http://localhost:5000/produtos') // endpoint da sua API backend
      .then(res => setProdutos(res.data)) // Se a requisição for bem-sucedida, atualiza o estado com os dados recebidos
      .catch(err => console.error('Erro ao buscar produtos:', err)); // Se houver erro, exibe no console
  }, []); // Array vazio = executa apenas uma vez na montagem do componente

  // Retorna o JSX (HTML + JS) que será renderizado na tela
  return (
    <div className="container mt-4"> {/* Container principal com margem no topo */}
      <h2 className="mb-4">Produtos Disponíveis</h2> {/* Título da página */}
      
      <div className="row"> {/* Linha Bootstrap para layout responsivo */}
        {/* Percorre todos os produtos e exibe cada um em um card */}
        {produtos.map(produto => (
          <div className="col-md-4 mb-4" key={produto.id_produto}> {/* Coluna para cada produto */}
            <div className="card h-100 shadow"> {/* Cartão com sombra e altura igual */}
              
              {/* Imagem buscando o url no bando de dados*/}
             

              <img 
                src={produto.imagem_url} 
                className="card-img-top" 
                alt={produto.nome} 
              />

              
              <div className="card-body"> {/* Corpo do card com informações do produto */}
                <h5 className="card-title">{produto.nome}</h5>
                
                <p className="card-text">
                  {/* Informações detalhadas do produto */}
                  <strong>Preço:</strong> R$ {produto.preco}<br />
                  <strong>Unidade:</strong> {produto.unidade_medida}<br />
                  <strong>Categoria:</strong> {produto.categoria}<br />
                  <strong>Produtor:</strong> {produto.nome_produtor}
                </p>
                
                {/* Botão para interação (pode futuramente abrir WhatsApp, etc) */}
                <button className="btn btn-success">Falar com o produtor</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Exporta o componente para ser usado em outras partes do projeto
export default Produtos;
