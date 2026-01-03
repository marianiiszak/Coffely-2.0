// Simulação da lista de livros global do sistema
const livrosGlobais = [
  { titulo: "O Pequeno Príncipe" },
  { titulo: "Amor Teoricamente" },
  { titulo: "Harry Potter" },
  { titulo: "Jane Eyre" },
  { titulo: "Coraline" },
  { titulo: "É Assim que Acaba" },
  { titulo: "A Biblioteca da Meia-Noite" }
];

const conteudoDescubra = document.getElementById("conteudo-descubra");
const inputBusca = document.getElementById("inputBusca");

// Função para mostrar todos os livros na grid sem prateleiras
function exibirLivros(lista) {
  conteudoDescubra.innerHTML = "";
  
  if (lista.length === 0) {
    conteudoDescubra.innerHTML = `<p style="font-family: 'Alice', serif; color: #8a6b58;">Nenhum livro encontrado...</p>`;
    return;
  }

  lista.forEach(l => {
    const livroDiv = document.createElement("div");
    livroDiv.className = "livro";
    livroDiv.title = l.titulo;
    conteudoDescubra.appendChild(livroDiv);
  });
}

// Inicializa a página
exibirLivros(livrosGlobais);

// Lógica de Busca em tempo real
inputBusca.addEventListener("input", (e) => {
  const termo = e.target.value.toLowerCase();
  const filtrados = livrosGlobais.filter(l => 
    l.titulo.toLowerCase().includes(termo)
  );
  exibirLivros(filtrados);
});

const btnAdd = document.querySelector(".btn-add");
const modal = document.getElementById("modalLivro");
const modalConteudo = document.querySelector(".modal-livro");
const btnFechar = document.getElementById("fecharModal");
const btnSalvar = document.getElementById("salvarObra");
const modalConfirmacao = document.getElementById("modalConfirmacao");

btnAdd.addEventListener("click", () => {
  modal.classList.add("ativo");
});

btnFechar.addEventListener("click", () => {
  modal.classList.remove("ativo");
});

modal.addEventListener("click", (event) => {
  if (!modalConteudo.contains(event.target)) {
    modal.classList.remove("ativo");
  }
});

// Salvamento e Confetes
btnSalvar.addEventListener("click", (e) => {
  e.preventDefault();
  const titulo = document.getElementById("novoTitulo").value.trim();

  if (titulo === "") {
    alert("Por favor, preencha o nome do livro.");
    return;
  }

  // Adiciona à lista local do Descubra
  livrosGlobais.push({ titulo: titulo });

  // Limpa campos
  document.getElementById("novoTitulo").value = "";
  document.getElementById("novoAutor").value = "";
  document.getElementById("novoAno").value = "";

  modal.classList.remove("ativo");
  dispararConfetes();
  modalConfirmacao.classList.add("ativo");
  exibirLivros(livrosGlobais); // Atualiza a grid
});

// Funções dos botões do Modal de Confirmação
document.getElementById("confirmarCategoria").onclick = () => {
  modalConfirmacao.classList.remove("ativo");
};

document.getElementById("pularCategoria").onclick = () => {
  modalConfirmacao.classList.remove("ativo");
};

function dispararConfetes() {
  for (let i = 0; i < 50; i++) {
    const confete = document.createElement("div");
    confete.className = "confete";
    confete.style.left = Math.random() * 100 + "vw";
    confete.style.backgroundColor = ["#e58f8f", "#f4d1d4", "#d8d672ff", "#9be3dbff"][Math.floor(Math.random() * 4)];
    confete.style.animationDuration = (Math.random() * 2 + 2) + "s";
    confete.style.opacity = Math.random();
    document.body.appendChild(confete);
    setTimeout(() => confete.remove(), 3000);
  }
}