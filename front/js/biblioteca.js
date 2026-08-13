const livros = [
  { titulo: "O Pequeno Príncipe", prateleira: "Lidos" },
  { titulo: "Amor Teoricaamente", prateleira: "Lidos" },
  { titulo: "Harry Potter", prateleira: "Lendo" },
  { titulo: "Jane Eyre", prateleira: "Em pausa" },
  { titulo: "Coraline", prateleira: "Quero ler" }
];

const conteudo = document.getElementById("conteudo-biblioteca");

function mostrarPrateleiras(lista) {
  conteudo.innerHTML = "";

  const categorias = ["Lidos", "Lendo", "Em pausa", "Quero ler"];

  categorias.forEach(cat => {
    const livrosFiltrados = lista.filter(l => l.prateleira === cat);

    const container = document.createElement("div");
    container.className = "prateleira-container";

    container.innerHTML = `
      <div class="prateleira-header">
        <span class="categoria-label">${cat}</span>
        <a href="#" class="ver-mais" data-categoria="${cat}">Ver mais →</a>
      </div>

      <div class="livros-wrapper">
        <div class="livros-lista">
          ${livrosFiltrados
            .map(l => `<div class="livro" title="${l.titulo}"></div>`)
            .join("")}
        </div>
      </div>
    `;

    conteudo.appendChild(container);
  });

  ativarVerMais();
}

function mostrarCategoria(categoria) {
  const filtrados = livros.filter(l => l.prateleira === categoria);

  conteudo.innerHTML = `
    <div class="categoria-view-header">
      <div style="display: flex; align-items: center; gap: 15px;">
        <img src="/front/images/decoracaos.png" style="height: 70px;" alt="estrela">
        <h2 class="categoria-view-titulo">${categoria}</h2>
      </div>
      
      <a href="#" id="voltar" class="btn-voltar">
        <span>←</span> Voltar
      </a>
    </div>

    <div class="categoria-livros-box">
      <div class="grid-livros">
        ${filtrados.map(l => `<div class="livro" title="${l.titulo}"></div>`).join("")}
      </div>
    </div>
  `;

  window.scrollTo({ top: 0, behavior: 'smooth' });

  document.getElementById("voltar").onclick = function (e) {
    e.preventDefault();
    mostrarPrateleiras(livros);
  };
}

function ativarVerMais() {
  document.querySelectorAll(".ver-mais").forEach(link => {
    link.onclick = function (e) {
      e.preventDefault();
      const categoria = this.dataset.categoria;
      mostrarCategoria(categoria);
    };
  });
}

mostrarPrateleiras(livros);

// Filtros
document.getElementById("filtro-prateleiras").onclick = function () {
  this.classList.add("ativo");
  document.getElementById("filtro-todos").classList.remove("ativo");
  mostrarPrateleiras(livros);
};

document.getElementById("filtro-todos").onclick = function () {
  this.classList.add("ativo");
  document.getElementById("filtro-prateleiras").classList.remove("ativo");

  conteudo.innerHTML = `
    <div class="livros-lista" style="flex-wrap:wrap;">
      ${livros.map(l => `<div class="livro" title="${l.titulo}"></div>`).join("")}
    </div>
  `;
};

