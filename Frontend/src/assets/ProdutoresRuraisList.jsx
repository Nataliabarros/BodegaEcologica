
import React, { useEffect, useState } from 'react';
import './ProdutoresRuraisList.css';

const ProdutoresRuraisList = () => {
  const [produtores, setProdutores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/produtores-rurais')
      .then(response => response.json())
      .then(data => {
        setProdutores(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar produtores:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Carregando produtores...</p>;

  return (
    <div className="produtores-container">
      <h2>Produtores Rurais</h2>
      {produtores.map(produtor => (
        <div className="produtor-card" key={produtor.id_produtor}>
          <p><strong>Nome:</strong> {produtor.nome}</p>
          <p><strong>CPF:</strong> {produtor.cpf}</p>
          <p><strong>Telefone:</strong> {produtor.telefone || 'Não informado'}</p>
        </div>
      ))}
    </div>
  );
};

export default ProdutoresRuraisList;
