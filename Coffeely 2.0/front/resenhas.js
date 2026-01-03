let listaResenhas = [
    {
        id: 1,
        usuario: "Usuário 1",
        fotoPerfil: "",
        livro: "Vou te receitar um gato",
        capa: "https://m.media-amazon.com/images/I/81shY9zIuGL._AC_UF1000,1000_QL80_.jpg",
        nota: 4,
        dataPostagem: new Date(Date.now() - 1000 * 60 * 180),
        texto: "É fofo e bem legal. A história é basicamente: Vários pacientes com vários problemas, eles vão até a clínica para conseguir remédios. Mas, quando chegam lá, o médico recomenda um gato. A leitura é fluida, é boa, é fofo, é literatura de cura.",
        curtidas: 252,
        foiCurtido: false,
        comentarios: [
            { texto: "Que resenha incrível!", curtidas: 5, euCurti: false }
        ],
        qtdComentariosOriginal: 12
    },
    {
        id: 2,
        usuario: "Usuário 2",
        fotoPerfil: "",
        livro: "A vida invisível de Addie LaRue",
        capa: "https://m.media-amazon.com/images/I/91SrnWvL7yL._AC_UF1000,1000_QL80_.jpg",
        nota: 4,
        dataPostagem: new Date(Date.now() - (4 * 60 * 60 * 1000)),
        texto: `"nada é só bom ou ruim. a vida é muito mais complicada.”\n\nGente! eu AMEI esse livro. Mas admito que o começo é um pouco lento e demora um pouco pra se envolver com a história, porém vale a pena cada forçadinha. Que maravilha foi esse livro. amei a história de Addie, é triste e sofrida. mas é dela e é incrível. sua determinação, peculiaridade e ser dona de si me ganharam muito.`,
        curtidas: 153,
        foiCurtido: false,
        comentarios: [
            { texto: "Chorei muito com o final!", curtidas: 8, euCurti: false }
        ],
        qtdComentariosOriginal: 12
    }
];

function formatarTempo(data) {
    const agora = new Date();
    const diferenca = Math.floor((agora - data) / 1000);
    if (diferenca < 60) return `agora mesmo`;
    if (diferenca < 3600) return `há ${Math.floor(diferenca / 60)}min`;
    if (diferenca < 86400) return `há ${Math.floor(diferenca / 3600)}h`;
    return data.toLocaleDateString('pt-BR');
}
const livrosPendentes = [

    { nome: "Harry Potter", capa: "https://m.media-amazon.com/images/I/81S9pXpC6pL.jpg" },
    { nome: "Não é amor", capa: "https://m.media-amazon.com/images/I/71Y8X-y2S2L.jpg" },
    { nome: "Carrie, a estranha", capa: "https://m.media-amazon.com/images/I/91mSms38S9L.jpg" },
    { nome: "A menina que roubava livros", capa: "https://m.media-amazon.com/images/I/817RndI7VvL.jpg" }
];

function renderizarFeed(lista) {
    const feedContainer = document.getElementById("feed-posts");
    if (!feedContainer) return;
    feedContainer.innerHTML = "";

    lista.forEach(res => {
        const card = document.createElement("article");
        card.className = "card-resenha";
        card.innerHTML = `
            <div class="card-corpo-flex">
                <div class="resenha-livro-info">
                    <h3>${res.livro}</h3>
                    <div class="livro-placeholder" style="background-image:url('${res.capa}')"></div>
                    <div class="estrelas-container">
                        <div class="estrelas-icones">
                            ${"★".repeat(res.nota)}${"☆".repeat(5 - res.nota)}
                        </div>
                        <span class="nota-texto">${res.nota} de 5 estrelas</span>
                    </div>
                </div>

                <div class="resenha-conteudo">
                    <div class="resenha-user-header">
                        <div class="user-img-placeholder"></div>
                        <div class="user-meta">
                            <strong>${res.usuario}</strong><br>
                            <span>postado ${formatarTempo(res.dataPostagem)}</span>
                        </div>
                    </div>
                    <p class="resenha-texto-corpo">${res.texto}</p>
                    
                    <div class="resenha-footer">
                        <div class="stats-interacao">
                            <button class="btn-interagir ${res.foiCurtido ? 'curtido' : ''}" onclick="curtirPost(${res.id})">
                                <i class="coracao-icon">❤</i>
                                <strong>${res.curtidas}</strong>
                            </button>
                            <button class="btn-interagir btn-comentar-icone" onclick="alternarComentarios(${res.id})">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                <strong>${res.comentarios.length + res.qtdComentariosOriginal}</strong>
                            </button>
                        </div>
                        <div class="btn-group">
                            <button class="btn-acao-3d btn-curtir-main" onclick="curtirPost(${res.id})">Curtir</button>
                            <button class="btn-acao-3d btn-comentar-main" onclick="alternarComentarios(${res.id})">Comentar</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="sessao-comentarios" id="comentarios-${res.id}">
                <div class="lista-comentarios-interna">
                    ${res.comentarios.map((c, index) => `
                        <div class="comentario-item">
                            <div class="comentario-texto-wrapper">
                                <strong>Visitante:</strong> ${c.texto}
                            </div>
                            <button class="btn-curtir-comentario ${c.euCurti ? 'curtido' : ''}" onclick="curtirComentario(${res.id}, ${index})">
                                <i>❤</i>
                                <span>${c.curtidas}</span>
                            </button>
                        </div>
                    `).join("")}
                </div>
                <div class="comentario-input-container">
                    <input type="text" id="input-res-${res.id}" class="input-comentario" placeholder="Escreva algo...">
                    <button class="btn-postar-comentario" onclick="adicionarComentario(${res.id})">Postar</button>
                </div>
            </div>
        `;
        feedContainer.appendChild(card);
    });
}

function curtirPost(id) {
    const post = listaResenhas.find(p => p.id === id);
    if (!post) return;
    post.foiCurtido ? post.curtidas-- : post.curtidas++;
    post.foiCurtido = !post.foiCurtido;
    renderizarFeed(listaResenhas);
}

function curtirComentario(resenhaId, comentarioIndex) {
    const resenha = listaResenhas.find(r => r.id === resenhaId);
    const comentario = resenha.comentarios[comentarioIndex];
    
    if (comentario.euCurti) {
        comentario.curtidas--;
        comentario.euCurti = false;
    } else {
        comentario.curtidas++;
        comentario.euCurti = true;
    }
    renderizarFeed(listaResenhas);
    document.getElementById(`comentarios-${resenhaId}`).classList.add("ativo");
}

function alternarComentarios(id) {
    const box = document.getElementById(`comentarios-${id}`);
    if (box) box.classList.toggle("ativo");
}

function adicionarComentario(id) {
    const input = document.getElementById(`input-res-${id}`);
    const valor = input.value.trim();
    if (!valor) return;

    const post = listaResenhas.find(p => p.id === id);
    post.comentarios.push({ texto: valor, curtidas: 0, euCurti: false });
    input.value = "";

    renderizarFeed(listaResenhas);
    document.getElementById(`comentarios-${id}`).classList.add("ativo");
}

// Inicializar
document.addEventListener("DOMContentLoaded", () => {
    renderizarFeed(listaResenhas);
});

//  FILTROS 
document.querySelectorAll(".filtro-pill").forEach(btn => {
    btn.addEventListener("click", function () {
        document.querySelector(".filtro-pill.ativo")?.classList.remove("ativo");
        this.classList.add("ativo");

        const tipo = this.dataset.tipo;
        let listaFiltrada = [...listaResenhas];

        if (tipo === "recentes") {
            // Ordena pela data de postagem (maior timestamp primeiro)
            listaFiltrada.sort((a, b) => b.dataPostagem - a.dataPostagem);
        } else if (tipo === "curtidas") {
            listaFiltrada.sort((a, b) => b.curtidas - a.curtidas);
        }

        renderizarFeed(listaFiltrada);
    });
});
//SIDEBAR 
function renderizarSidebar() {
    const sidebar = document.getElementById("lista-sidebar");
    if (!sidebar) return;

    sidebar.innerHTML = livrosPendentes.map(livro => `
        <div class="sidebar-item">
            <div class="sidebar-capa-placeholder" style="background-image:url('${livro.capa}')"></div>
            <div class="sidebar-info">
                <span class="sidebar-livro-nome">${livro.nome}</span>
                <button class="btn-avaliar-sidebar">Avaliar</button>
            </div>
        </div>
    `).join("");
}

//  MODAIS 
const modalLivro = document.getElementById("modalLivro");
const modalConfirmacao = document.getElementById("modalConfirmacao");
const btnAdd = document.querySelector(".btn-add");
const btnFechar = document.getElementById("fecharModal");
const btnSalvarObra = document.querySelector(".modal-form .btn-salvar");
const btnConfirmarCategoria = document.getElementById("confirmarCategoria");
const btnPularCategoria = document.getElementById("pularCategoria");


btnAdd.addEventListener("click", () => {
    modalLivro.classList.add("ativo");
});

btnFechar.addEventListener("click", () => {
    modalLivro.classList.remove("ativo");
});

window.addEventListener("click", (e) => {
    if (e.target === modalLivro) {
        modalLivro.classList.remove("ativo");
    }
    if (e.target === modalConfirmacao) {
        modalConfirmacao.classList.remove("ativo");
    }
});

btnSalvarObra.addEventListener("click", () => {
    const titulo = document.getElementById("novoTitulo").value.trim();
    const autor = document.getElementById("novoAutor").value.trim();

    if (titulo === "" || autor === "") {
        alert("Por favor, preencha pelo menos o título e o autor.");
        return;
    }

    modalLivro.classList.remove("ativo");

    dispararConfetes();

    setTimeout(() => {
        modalConfirmacao.classList.add("ativo");
    }, 300);
});

btnConfirmarCategoria.addEventListener("click", () => {
    const categoria = document.getElementById("categoriaLivro").value;
    console.log(`Livro movido para a prateleira: ${categoria}`);
    
    fecharTudoELimpar();
    alert("Obra organizada com sucesso!");
});

btnPularCategoria.addEventListener("click", () => {
    fecharTudoELimpar();
});


function fecharTudoELimpar() {
    modalConfirmacao.classList.remove("ativo");
    document.getElementById("novoTitulo").value = "";
    document.getElementById("novoAutor").value = "";
    document.getElementById("novoAno").value = "";
}
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

renderizarFeed(listaResenhas);
renderizarSidebar();