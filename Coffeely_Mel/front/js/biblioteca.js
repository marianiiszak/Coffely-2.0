let livros = [];

const usuarioId = localStorage.getItem("usuario_id");
const conteudo = document.getElementById("conteudo-biblioteca");

const modalLivro = document.getElementById("modalLivro");
const modalConfirmacao = document.getElementById("modalConfirmacao");

const btnAdd = document.querySelector(".btn-add");
const btnFechar = document.querySelector(".btn-fechar");

const inputCapa = document.getElementById("inputCapa");
const capaPreview = document.getElementById("capaPreview");

async function carregarBiblioteca() {
    if (!usuarioId) {
        alert("Usuário não identificado. Faça login novamente.");
        window.location.href = "/front/entrar.html";
        return;
    }

    try {
        const resposta = await fetch(`/api/biblioteca/?usuario=${usuarioId}`);

        if (!resposta.ok) {
            throw new Error("Erro ao carregar biblioteca");
        }

        const dados = await resposta.json();

        livros = dados.map(item => {
            const obra = item.obra_dados || item.obra;

            return {
                id: obra.id,
                titulo: obra.titulo,
                autor: obra.autor,
                ano: obra.ano_publicacao,
                capa: obra.capa,
                prateleira: item.categoria
            };
        });

        mostrarPrateleiras(livros);

    } catch (erro) {
        console.error("Erro ao carregar biblioteca:", erro);

        conteudo.innerHTML = `
            <p>Não foi possível carregar sua biblioteca.</p>
        `;
    }
}

function mostrarPrateleiras(lista) {
    conteudo.innerHTML = "";

    const categorias = [
        "Lidos",
        "Lendo",
        "Em Pausa",
        "Quero Ler"
    ];

    categorias.forEach(categoria => {
        const livrosFiltrados = lista.filter(
            livro => livro.prateleira === categoria
        );

        const container = document.createElement("div");
        container.className = "prateleira-container";

        container.innerHTML = `
            <div class="prateleira-header">
                <span class="categoria-label">${categoria}</span>

                <a href="#"
                   class="ver-mais"
                   data-categoria="${categoria}">
                    Ver mais →
                </a>
            </div>

            <div class="livros-wrapper">
                <div class="livros-lista">
                    ${
                        livrosFiltrados.length > 0
                        ? livrosFiltrados.map(livro => `
                            <div
                                class="livro"
                                title="${livro.titulo}"
                                style="background-image: url('${livro.capa || ""}');"
                            ></div>
                        `).join("")
                        : `
                            <p class="sem-livros">
                                Nenhum livro aqui ainda.
                            </p>
                        `
                    }
                </div>
            </div>
        `;

        conteudo.appendChild(container);
    });

    ativarVerMais();
}

function mostrarCategoria(categoria) {
    const filtrados = livros.filter(
        livro => livro.prateleira === categoria
    );

    conteudo.innerHTML = `
        <div class="categoria-view-header">

            <div style="
                display: flex;
                align-items: center;
                gap: 15px;
            ">
                <img
                    src="/front/images/decoracaos.png"
                    style="height: 70px;"
                    alt="estrela"
                >

                <h2 class="categoria-view-titulo">
                    ${categoria}
                </h2>
            </div>

            <a href="#" id="voltar" class="btn-voltar">
                <span>←</span> Voltar
            </a>

        </div>

        <div class="categoria-livros-box">
            <div class="grid-livros">
                ${
                    filtrados.length > 0
                    ? filtrados.map(livro => `
                        <div
                            class="livro"
                            title="${livro.titulo}"
                            style="background-image: url('${livro.capa || ""}');"
                        ></div>
                    `).join("")
                    : `<p>Nenhum livro nesta categoria.</p>`
                }
            </div>
        </div>
    `;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    document.getElementById("voltar").onclick = function(e) {
        e.preventDefault();
        mostrarPrateleiras(livros);
    };
}

function ativarVerMais() {
    document.querySelectorAll(".ver-mais").forEach(link => {
        link.onclick = function(e) {
            e.preventDefault();

            const categoria = this.dataset.categoria;

            mostrarCategoria(categoria);
        };
    });
}

document.getElementById("filtro-prateleiras").onclick = function() {
    this.classList.add("ativo");

    document
        .getElementById("filtro-todos")
        .classList.remove("ativo");

    mostrarPrateleiras(livros);
};

document.getElementById("filtro-todos").onclick = function() {
    this.classList.add("ativo");

    document
        .getElementById("filtro-prateleiras")
        .classList.remove("ativo");

    conteudo.innerHTML = `
        <div
            class="livros-lista"
            style="flex-wrap: wrap;"
        >
            ${
                livros.length > 0
                ? livros.map(livro => `
                    <div
                        class="livro"
                        title="${livro.titulo}"
                        style="background-image: url('${livro.capa || ""}');"
                    ></div>
                `).join("")
                : `<p>Nenhum livro na biblioteca.</p>`
            }
        </div>
    `;
};

btnAdd.onclick = function() {
    modalLivro.classList.add("ativo");
};

btnFechar.onclick = function() {
    modalLivro.classList.remove("ativo");
};

capaPreview.onclick = function() {
    inputCapa.click();
};

inputCapa.onchange = function() {
    const arquivo = this.files[0];

    if (!arquivo) {
        return;
    }

    const leitor = new FileReader();

    leitor.onload = function(e) {
        capaPreview.style.backgroundImage = `url('${e.target.result}')`;
        capaPreview.style.backgroundSize = "cover";
        capaPreview.style.backgroundPosition = "center";

        const span = capaPreview.querySelector("span");

        if (span) {
            span.style.display = "none";
        }
    };

    leitor.readAsDataURL(arquivo);
};

const btnSalvar = document.querySelector(
    "#modalLivro .btn-salvar"
);

btnSalvar.onclick = async function() {
    const titulo = document
        .getElementById("novoTitulo")
        .value
        .trim();

    const autor = document
        .getElementById("novoAutor")
        .value
        .trim();

    const ano = document
        .getElementById("novoAno")
        .value
        .trim();

    const arquivoCapa = inputCapa.files[0];

    if (!titulo || !autor || !ano) {
        alert("Preencha o nome, autor e ano do livro.");
        return;
    }

    btnSalvar.disabled = true;

    try {
        const formulario = new FormData();

        formulario.append("titulo", titulo);
        formulario.append("autor", autor);
        formulario.append("ano_publicacao", ano);

        if (arquivoCapa) {
            formulario.append("capa", arquivoCapa);
        }

        console.log("Enviando obra...");

        const resposta = await fetch("/api/obras/", {
            method: "POST",
            body: formulario
        });

        const texto = await resposta.text();

        let dados;

        try {
            dados = JSON.parse(texto);
        } catch {
            dados = {};
        }

        console.log("Resposta da obra:", resposta.status, dados);

        if (!resposta.ok) {
            alert(
                dados.detail ||
                dados.error ||
                "Não foi possível cadastrar a obra."
            );

            return;
        }

        window.obraCriada = dados;

        modalLivro.classList.remove("ativo");

        document.getElementById("novoTitulo").value = "";
        document.getElementById("novoAutor").value = "";
        document.getElementById("novoAno").value = "";

        inputCapa.value = "";

        capaPreview.style.backgroundImage = "";

        const span = capaPreview.querySelector("span");

        if (span) {
            span.style.display = "";
        }

        modalConfirmacao.classList.add("ativo");

    } catch (erro) {
        console.error("Erro ao cadastrar obra:", erro);

        alert("Não foi possível conectar ao servidor.");

    } finally {
        btnSalvar.disabled = false;
    }
};

document.getElementById("confirmarCategoria").onclick = async function() {
    const categoria = document.getElementById("categoriaLivro").value;

    if (!window.obraCriada || !window.obraCriada.id) {
        alert("Não foi possível identificar a obra.");
        return;
    }

    const btnConfirmar = document.getElementById("confirmarCategoria");

    btnConfirmar.disabled = true;

    try {
        console.log("Enviando livro para biblioteca...");

        const resposta = await fetch("/api/biblioteca/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usuario: Number(usuarioId),
                obra: Number(window.obraCriada.id),
                categoria: categoria
            })
        });

        const texto = await resposta.text();

        let dados;

        try {
            dados = JSON.parse(texto);
        } catch {
            dados = {};
        }

        console.log(
            "Resposta da biblioteca:",
            resposta.status,
            dados
        );

        if (!resposta.ok) {
            alert(
                dados.detail ||
                dados.error ||
                "Não foi possível adicionar o livro à biblioteca."
            );

            return;
        }

        modalConfirmacao.classList.remove("ativo");

        window.obraCriada = null;

        await carregarBiblioteca();

    } catch (erro) {
        console.error(
            "Erro ao adicionar à biblioteca:",
            erro
        );

        alert("Não foi possível conectar ao servidor.");

    } finally {
        btnConfirmar.disabled = false;
    }
};

document.getElementById("pularCategoria").onclick = function() {
    modalConfirmacao.classList.remove("ativo");

    window.obraCriada = null;

    carregarBiblioteca();
};

carregarBiblioteca();
