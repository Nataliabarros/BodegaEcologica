import React, { useEffect, useState } from "react";

// Componente que lista os produtos cadastrados
function ListarProdutos() {
  // Estado que armazena os produtos vindos do backend
  const [produtos, setProdutos] = useState([]);

  // Estado para mostrar o carregamento enquanto busca os produtos
  const [loading, setLoading] = useState(true);

  // useEffect executa quando o componente carrega (monta)
  useEffect(() => {
    // Faz a requisição para buscar os produtos no backend
    fetch("http://localhost:5000/produtos")
      .then((res) => res.json())           // Converte a resposta para JSON
      .then((data) => {
        setProdutos(data);                 // Atualiza o estado com os produtos
        setLoading(false);  
        console.log(produtos)               // Finaliza o carregamento
      })
      .catch((err) => {
        console.error(err);               // Mostra erro no console (caso aconteça)
        alert("Erro ao buscar produtos."); // Alerta de erro na tela
        setLoading(false);                // Finaliza o carregamento mesmo com erro
      });
  }, [produtos]); // Array vazio: executa só uma vez (quando o componente for exibido)

  // Enquanto estiver carregando os dados, mostra esta mensagem
  if (loading) {
    return <p>Carregando produtos...</p>;
  }

  return (
    <div className="container mt-4">
      <h2>Lista de Produtos</h2>

      {/* Se não tiver produtos, mostra mensagem */}
      {produtos.length === 0 ? (
        <p>Nenhum produto encontrado.</p>
      ) : (
        // Se tiver produtos, renderiza a tabela com os dados
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Imagem</th> 
              <th>Descrição</th>
              <th>Preço</th>
              <th>Unidade</th>
              <th>Categoria</th>
              <th>Produtor</th>
            </tr>
          </thead>
          <tbody>
            {/* Mapeia cada produto para exibir uma linha da tabela */}
            {produtos.map((produto) => (
              <tr key={produto.id_produto}>
                <td>{produto.id_produto}</td>

                {/* Mostra a imagem do produto (se tiver URL válida) */}
                <td>
                  <img
                    src={produto.imagem_url}              // URL da imagem
                    alt={produto.nome_produto}            // Texto alternativo
                    style={{
                      width: "100px",                     // Largura fixa
                      height: "80px",                     // Altura fixa
                      objectFit: "cover",                 // Cobre sem distorcer
                      borderRadius: "8px"                 // Cantos arredondados
                    }}
                  />
                </td>

                {/* Exibe os demais dados do produto */}
                <td>{produto.descricao}</td>
                <td>R$ {parseFloat(produto.preco).toFixed(2)}</td>
                <td>{produto.unidade_medida}</td>
                <td>{produto.categoria}</td>
                <td>{produto.nome_produtor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ListarProdutos;
