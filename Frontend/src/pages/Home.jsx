import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Home.css";

function Home() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    arrows: false,
    pauseOnHover: false
  };

  return (
    <div className="home-container">
      <Slider {...settings} className="carousel">
        <div>
          <img src="/imagens/Banana.jpg" alt="Feira 1" />
        </div>
        <div>
          <img src="/imagens/Castanha.jpg" alt="Feira 2" />
        </div>
        <div>
          <img src="/imagens/venda.jpg" alt="Feira 3" />
        </div>
        <div>
          <img src="/imagens/queijo.jpg" alt="Feira 4" />
        </div>
      </Slider>

      <div className="apresentacao">
        <h2>Bem-vindo à Bodega Ecológica</h2>
        <p>
          A Bodega Ecológica é uma plataforma voltada para a valorização da agricultura familiar.
          Aqui, produtores podem anunciar seus produtos naturais, orgânicos e sustentáveis,
          conectando diretamente com os consumidores da região.
        </p>
      </div>
    </div>
  );
}

export default Home;

