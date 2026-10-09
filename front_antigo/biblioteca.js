let livros = [];
let obras = [];
let obraSelecionada = null;

const conteudo = document.getElementById("conteudo-biblioteca");


// =======================
// CARREGAR BIBLIOTECA
// =======================

async function carregarBiblioteca() {

    try {

        const usuario = localStorage.getItem("usuario_id");

        const response = await fetch(
            `http://127.0.0.1:8000/api/biblioteca/?usuario=${usuario}`
        );

        livros = await response.json();

        mostrarPrateleiras(livros);

    }

    catch (erro) {

        console.error(erro);

    }

}



// =======================
// CARREGAR OBRAS
// =======================

async function carregarObras(){

    try{

        const response = await fetch(
            "http://127.0.0.1:8000/api/obras/"
        );

        obras = await response.json();

    }

    catch(erro){

        console.error(erro);

    }

}



// =======================
// MOSTRAR PRATELEIRAS
// =======================

function mostrarPrateleiras(lista){

    conteudo.innerHTML = "";

    const categorias = [

        "Lidos",
        "Lendo",
        "Em Pausa",
        "Quero Ler"

    ];

    categorias.forEach(cat=>{

        const filtrados = lista.filter(

            livro => livro.categoria === cat

        );

        const div = document.createElement("div");

        div.className = "prateleira-container";

        div.innerHTML = `

        <div class="prateleira-header">

            <span class="categoria-label">

                ${cat}

            </span>

            <a
                href="#"
                class="ver-mais"
                data-categoria="${cat}"
            >

                Ver mais →

            </a>

        </div>

        <div class="livros-wrapper">

            <div class="livros-lista">

                ${filtrados.map(l=>`

                    <div class="livro">

                        <img

                            src="${l.obra.capa}"

                            class="capa-livro"

                            title="${l.obra.titulo}"

                        >

                    </div>

                `).join("")}

            </div>

        </div>

        `;

        conteudo.appendChild(div);

    });

    ativarVerMais();

}



// =======================
// MOSTRAR CATEGORIA
// =======================

function mostrarCategoria(categoria){

    const filtrados = livros.filter(

        l => l.categoria === categoria

    );

    conteudo.innerHTML = `

    <div class="categoria-view-header">

        <div style="display:flex;gap:15px;align-items:center;">

            <img

                src="decoracaos.png"

                style="height:70px"

            >

            <h2 class="categoria-view-titulo">

                ${categoria}

            </h2>

        </div>

        <a

            href="#"

            id="voltar"

            class="btn-voltar"

        >

            ← Voltar

        </a>

    </div>

    <div class="grid-livros">

        ${

            filtrados.length > 0 ?

            filtrados.map(l=>`

                <div class="livro">

                    <img

                        src="${l.obra.capa}"

                        class="capa-livro"

                        title="${l.obra.titulo}"

                    >

                </div>

            `).join("")

            :

            "<p>Nenhum livro nesta categoria.</p>"

        }

    </div>

    `;

    document.getElementById("voltar").onclick = e=>{

        e.preventDefault();

        mostrarPrateleiras(livros);

    };

}



// =======================
// VER MAIS
// =======================

function ativarVerMais(){

    document.querySelectorAll(".ver-mais").forEach(botao=>{

        botao.onclick = e=>{

            e.preventDefault();

            mostrarCategoria(

                botao.dataset.categoria

            );

        }

    });

}



// =======================
// FILTROS
// =======================

document.getElementById("filtro-prateleiras").onclick = ()=>{

    mostrarPrateleiras(livros);

};



document.getElementById("filtro-todos").onclick = ()=>{

    conteudo.innerHTML = `

    <div

        class="livros-lista"

        style="flex-wrap:wrap;"

    >

        ${livros.map(l=>`

            <div class="livro">

                <img

                    src="${l.obra.capa}"

                    class="capa-livro"

                    title="${l.obra.titulo}"

                >

            </div>

        `).join("")}

    </div>

    `;

};



// =======================
// INICIAR
// =======================

carregarBiblioteca();

carregarObras();
// =======================
// MODAL ADICIONAR À BIBLIOTECA
// =======================

const modalAdicionar =
    document.getElementById("modalAdicionarBiblioteca");

const btnAdd =
    document.querySelector(".btn-add");

const fecharAdicionar =
    document.getElementById("fecharAdicionarBiblioteca");

const listaLivrosModal =
    document.getElementById("listaLivrosModal");

const inputBusca =
    document.getElementById("buscarLivro");

const categoriaModal =
    document.getElementById("categoriaModal");

const nomeLivroEscolhido =
    document.getElementById("nomeLivroEscolhido");

const btnAdicionar =
    document.getElementById("adicionarBiblioteca");



// =======================
// ABRIR MODAL
// =======================

btnAdd.onclick = () => {

    obraSelecionada = null;

    nomeLivroEscolhido.innerHTML = "";

    inputBusca.value = "";

    mostrarListaLivros(obras);

    modalAdicionar.classList.add("ativo");

}



// =======================
// FECHAR
// =======================

fecharAdicionar.onclick = () => {

    modalAdicionar.classList.remove("ativo");

}



// =======================
// FECHAR CLICANDO FORA
// =======================

modalAdicionar.onclick = e => {

    if(e.target === modalAdicionar){

        modalAdicionar.classList.remove("ativo");

    }

}



// =======================
// MOSTRAR LIVROS
// =======================

function mostrarListaLivros(lista){

    listaLivrosModal.innerHTML = "";

    lista.forEach(obra=>{

        const item = document.createElement("div");

        item.className = "item-livro";

        item.innerHTML = `

            <img
                src="${obra.capa}"
                width="45"
                height="65"
                style="object-fit:cover;border-radius:6px;"
            >

            <div>

                <strong>${obra.titulo}</strong>

                <br>

                ${obra.autor}

            </div>

        `;

        item.onclick = ()=>{

            obraSelecionada = obra;

            nomeLivroEscolhido.innerHTML =

                "<b>Livro escolhido:</b> " + obra.titulo;

        }

        listaLivrosModal.appendChild(item);

    });

}



// =======================
// PESQUISA
// =======================

inputBusca.oninput = ()=>{

    const termo = inputBusca.value.toLowerCase();

    const filtrados = obras.filter(o=>

        o.titulo.toLowerCase().includes(termo)

    );

    mostrarListaLivros(filtrados);

}



// =======================
// ADICIONAR À BIBLIOTECA
// =======================

btnAdicionar.onclick = async ()=>{

    if(!obraSelecionada){

        alert("Escolha um livro.");

        return;

    }

    const usuario =
        localStorage.getItem("usuario_id");

    const categoria =
        categoriaModal.value;

    try{

        const response = await fetch(

            "http://127.0.0.1:8000/api/biblioteca/",

            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    usuario:usuario,

                    obra:obraSelecionada.id,

                    categoria:categoria

                })

            }

        );

        if(response.ok){

            alert("Livro adicionado!");

            modalAdicionar.classList.remove("ativo");

            carregarBiblioteca();

        }

        else{

            const erro = await response.text();

            console.log(erro);

            alert("Erro ao adicionar livro.");

        }

    }

    catch(e){

        console.error(e);

    }

}