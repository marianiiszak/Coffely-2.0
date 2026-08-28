let livrosGlobais = [];
let idObraCriada = null;

const conteudoDescubra = document.getElementById("conteudo-descubra");
const inputBusca = document.getElementById("inputBusca");

async function carregarLivros() {

  try {

    const response = await fetch("http://127.0.0.1:8000/api/obras/");
    
    const dados = await response.json();

    livrosGlobais = dados;

    exibirLivros(livrosGlobais);

  } catch (error) {

    console.error("Erro ao carregar livros:", error);

  }

}

// Função para mostrar todos os livros na grid
function exibirLivros(lista) {

    conteudoDescubra.innerHTML = "";

    if (lista.length === 0) {
        conteudoDescubra.innerHTML =
        "<p>Nenhum livro encontrado.</p>";
        return;
    }

    lista.forEach(l => {

        const livroDiv = document.createElement("div");
        livroDiv.className = "livro";

        livroDiv.innerHTML = `
            <img
                src="${l.capa}"
                class="capa-livro"
                alt="${l.titulo}"
                title="${l.titulo}">
        `;

        conteudoDescubra.appendChild(livroDiv);

    });

}

//exibirLivros(livrosGlobais);
carregarLivros();

// Lógica de Busca 
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
btnSalvar.addEventListener("click", async (e) => {

  e.preventDefault();

  const titulo = document.getElementById("novoTitulo").value.trim();
  const autor = document.getElementById("novoAutor").value.trim();
  const ano = document.getElementById("novoAno").value.trim();
  const capa = document.getElementById("novaCapa").files[0];
  const usuario = localStorage.getItem("usuario_id");

  if (titulo === "") {
    alert("Por favor, preencha o nome do livro.");
    return;
  }

 try {

    const formData = new FormData();

    formData.append("titulo", titulo);
    formData.append("autor", autor);
    formData.append("ano_publicacao", ano);

    if (capa) {
        formData.append("capa", capa);
    }

    const response = await fetch("http://127.0.0.1:8000/api/obras/", {
    method: "POST",
    body: formData
});

    console.log("Status:", response.status);

    const dados = await response.json();

    console.log(dados);

    idObraCriada = dados.id;

    if (!response.ok) {
        alert("Erro ao salvar livro.");
        return;
    }


    document.getElementById("novoTitulo").value = "";
    document.getElementById("novoAutor").value = "";
    document.getElementById("novoAno").value = "";
    document.getElementById("novaCapa").value = "";

    modal.classList.remove("ativo");

    dispararConfetes();

    modalConfirmacao.classList.add("ativo");

    carregarLivros();

} catch (error) {

    console.error(error);

    alert("Erro de conexão.");

}
});

document.getElementById("confirmarCategoria").onclick = async () => {

    const categoria = document.getElementById("categoriaLivro").value;
    const usuario = localStorage.getItem("usuario_id");

    const response = await fetch("http://127.0.0.1:8000/api/biblioteca/", {

      method: "POST",

      headers: {
          "Content-Type": "application/json"
      },

      body: JSON.stringify({
          usuario: usuario,
          obra: idObraCriada,
          categoria: categoria
      })

    });

      if (response.ok) {

          alert("Livro adicionado à biblioteca!");

          modalConfirmacao.classList.remove("ativo");

      } else {

          const erro = await response.text();
          console.log(erro);
          alert("Erro ao organizar livro.");

      }
      console.log("Status:", response.status);
      console.log(await response.text());

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
const selecionarCapa = document.getElementById("selecionarCapa");
const inputCapa = document.getElementById("novaCapa");
const preview = document.getElementById("previewCapa");
const texto = document.getElementById("textoCapa");

selecionarCapa.addEventListener("click", () => {
    inputCapa.click();
});

inputCapa.addEventListener("change", () => {

    const arquivo = inputCapa.files[0];

    if (!arquivo) return;

    preview.src = URL.createObjectURL(arquivo);
    preview.style.display = "block";
    texto.style.display = "none";

});