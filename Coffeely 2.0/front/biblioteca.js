// Lista de livros
const livros = [
  { titulo: "O Pequeno Príncipe", prateleira: "Lidos" },
  { titulo: "Amor Teoricaamente", prateleira: "Lidos" },
  { titulo: "Harry Potter", prateleira: "Lendo" },
  { titulo: "Jane Eyre", prateleira: "Em pausa" },
  { titulo: "Coraline", prateleira: "Quero ler" }
];

// Elemento principal
const conteudo = document.getElementById("conteudo-biblioteca");

// Mostra prateleiras normalmente
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

// Tela que mostra apenas os livros de uma categoria
function mostrarCategoria(categoria) {
  const filtrados = livros.filter(l => l.prateleira === categoria);

  conteudo.innerHTML = `
    <div class="categoria-view-header">
      <div style="display: flex; align-items: center; gap: 15px;">
        <img src="decoracaos.png" style="height: 70px;" alt="estrela">
        <h2 class="categoria-view-titulo">${categoria}</h2>
      </div>
      
      <a href="#" id="voltar" class="btn-voltar">
        <span>←</span> Voltar para a Estante
      </a>
    </div>

    <div class="grid-livros">
      ${filtrados.length > 0 
        ? filtrados.map(l => `<div class="livro" title="${l.titulo}"></div>`).join("")
        : `<p style="font-family: 'Alice', serif; color: #8a6b58;">Nenhum livro nesta prateleira ainda...</p>`
      }
    </div>
  `;

  // Scroll para o topo para garantir que o usuário veja o início da lista
  window.scrollTo({ top: 0, behavior: 'smooth' });

  document.getElementById("voltar").onclick = function (e) {
    e.preventDefault();
    mostrarPrateleiras(livros);
  };
}
// Ativa os cliques do "Ver mais"
function ativarVerMais() {
  document.querySelectorAll(".ver-mais").forEach(link => {
    link.onclick = function (e) {
      e.preventDefault();
      const categoria = this.dataset.categoria;
      mostrarCategoria(categoria);
    };
  });
}

// Inicialização
mostrarPrateleiras(livros);

// Filtro: Prateleiras
document.getElementById("filtro-prateleiras").onclick = function () {
  this.classList.add("ativo");
  document.getElementById("filtro-todos").classList.remove("ativo");
  mostrarPrateleiras(livros);
};

// Filtro: Todos os livros
document.getElementById("filtro-todos").onclick = function () {
  this.classList.add("ativo");
  document.getElementById("filtro-prateleiras").classList.remove("ativo");

  conteudo.innerHTML = `
    <div class="livros-lista" style="flex-wrap:wrap;">
      ${livros.map(l => `<div class="livro" title="${l.titulo}"></div>`).join("")}
    </div>
  `;
};
// --- LÓGICA DO MODAL ---
const btnAdd = document.querySelector(".btn-add");
const modal = document.getElementById("modalLivro");
const modalConteudo = document.querySelector(".modal-livro");
const btnFechar = document.getElementById("fecharModal");
const btnSalvar = document.querySelector(".btn-salvar");

// Abrir modal
btnAdd.addEventListener("click", () => {
  modal.classList.add("ativo");
});

// Fechar modal pelo botão X
btnFechar.addEventListener("click", () => {
  modal.classList.remove("ativo");
});

// Fechar modal clicando fora da caixa
modal.addEventListener("click", (event) => {
  if (!modalConteudo.contains(event.target)) {
    modal.classList.remove("ativo");
  }
});

let livroRecemCriado = null;

btnSalvar.addEventListener("click", (e) => {
  e.preventDefault();

  const titulo = document.getElementById("novoTitulo").value.trim();

  if (titulo === "") {
    alert("Por favor, preencha o nome do livro.");
    return;
  }

  // Cria o livro
  livroRecemCriado = {
    titulo: titulo,
    prateleira: "Quero ler"
  };

  livros.push(livroRecemCriado);

  // Limpa formulário
  document.getElementById("novoTitulo").value = "";
  document.getElementById("novoAutor").value = "";
  document.getElementById("novoAno").value = "";

  // Fecha modal de cadastro
  modal.classList.remove("ativo");

  // Abre modal de confirmação
  document.getElementById("modalConfirmacao").classList.add("ativo");
});

const modalConfirmacao = document.getElementById("modalConfirmacao");
const confirmarCategoria = document.getElementById("confirmarCategoria");
const pularCategoria = document.getElementById("pularCategoria");

confirmarCategoria.addEventListener("click", () => {
  const categoria = document.getElementById("categoriaLivro").value;

  if (livroRecemCriado) {
    livroRecemCriado.prateleira = categoria;
  }

  modalConfirmacao.classList.remove("ativo");
  mostrarPrateleiras(livros);
});

pularCategoria.addEventListener("click", () => {
  modalConfirmacao.classList.remove("ativo");
  mostrarPrateleiras(livros);
});
function dispararConfetes() {
  for (let i = 0; i < 50; i++) {
    const confete = document.createElement("div");
    confete.className = "confete";
    confete.style.left = Math.random() * 100 + "vw";
    confete.style.backgroundColor = ["#e58f8f", "#f4d1d4", "#d8d672ff", "#9be3dbff"][Math.floor(Math.random() * 4)];
    confete.style.animationDuration = (Math.random() * 2 + 2) + "s";
    confete.style.opacity = Math.random();
    document.body.appendChild(confete);
    
    // Remove do DOM após a animação
    setTimeout(() => confete.remove(), 3000);
  }
}

// Chame essa função dentro do evento de salvar:
btnSalvar.addEventListener("click", (e) => {
  
  // No final, antes de abrir o modal de confirmação:
  dispararConfetes();
  document.getElementById("modalConfirmacao").classList.add("ativo");
});