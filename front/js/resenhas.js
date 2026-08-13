let listaResenhas = [
    {
        id: 1,
        usuario: "Usuário 1",
        fotoPerfil: "",
        livro: " Nome Livro",
        capa: "",
        nota: 4,
        dataPostagem: new Date(Date.now() - 1000 * 60 * 180),
        texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum iaculis, tellus ac sollicitudin feugiat, elit nisl tempor turpis, id ornare nisl arcu vel magna. Cras a felis cursus, iaculis erat non, bibendum risus. Duis consequat ligula sed convallis interdum. Proin tristique tortor ut erat porttitor, sit amet pharetra nunc bibendum. Phasellus interdum risus ante, eu convallis erat condimentum sit amet.",
        curtidas: 252,
        foiCurtido: false,
        comentarios: [
            { texto: "Que resenha incrível!", curtidas: 5, euCurti: false, respostas: [] }
        ],
        qtdComentariosOriginal: 12
    },
    {
        id: 1,
        usuario: "Usuário 2",
        fotoPerfil: "",
        livro: " Nome Livro",
        capa: "",
        nota: 4,
        dataPostagem: new Date(Date.now() - 1000 * 60 * 180),
        texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum iaculis, tellus ac sollicitudin feugiat, elit nisl tempor turpis, id ornare nisl arcu vel magna. Cras a felis cursus, iaculis erat non, bibendum risus. Duis consequat ligula sed convallis interdum. Proin tristique tortor ut erat porttitor, sit amet pharetra nunc bibendum. Phasellus interdum risus ante, eu convallis erat condimentum sit amet.",
        curtidas: 300,
        foiCurtido: false,
        comentarios: [
            { texto: "Que resenha incrível!", curtidas: 0, euCurti: false, respostas: [] }
        ],
        qtdComentariosOriginal: 12
    },
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

//  FILTROS 
document.getElementById("filtro-recentes").onclick = function () {

    this.classList.add("ativo");
    document.getElementById("filtro-curtidas").classList.remove("ativo");

    listaResenhas.sort((a, b) => b.dataPostagem - a.dataPostagem);

    renderizarFeed(listaResenhas);
};

document.getElementById("filtro-curtidas").onclick = function () {

    this.classList.add("ativo");
    document.getElementById("filtro-recentes").classList.remove("ativo");

    listaResenhas.sort((a, b) => b.curtidas - a.curtidas);

    renderizarFeed(listaResenhas);
};
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
                    ${res.comentarios.map((c, index) => {
                        if (!c.respostas) c.respostas = [];
                        const autor = c.autor || "Visitante";
                        const estáEditandoC = editandoComentario && editandoComentario.resenhaId === res.id && editandoComentario.comentarioIndex === index;

                        return `
                        <div class="comentario-container-completo">
                            <div class="comentario-item">
                                ${estáEditandoC ? `
                                    <div class="wrapper-edicao-inline">
                                        <input type="text" id="edit-input-c-${res.id}-${index}" class="input-edicao-inline" value="${c.texto}">
                                        <div class="botoes-edicao-flex">
                                            <button onclick="salvarEdicaoComentario(${res.id}, ${index})" class="btn-salvar-inline">Salvar</button>
                                            <button onclick="cancelarEdicao()" class="btn-cancelar-inline">Cancelar</button>
                                        </div>
                                    </div>
                                ` : `
                                    <div class="comentario-lado-esquerdo">
                                        <span class="comentario-autor">${autor}</span>
                                        <p class="comentario-texto-conteudo">${c.texto}</p>
                                    </div>
                                    <div class="comentario-lado-direito">
                                        <div class="comentario-acoes">
                                            <button class="btn-curtir-comentario-novo ${c.euCurti ? 'curtido' : ''}" onclick="curtirComentario(${res.id}, ${index})">
                                                <i>❤</i> <span>${c.curtidas || 0}</span>
                                            </button>
                                            <button class="btn-acao-comentario" onclick="prepararResposta(${res.id}, ${index})">
                                                Responder
                                            </button>
                                            ${autor === "Você" ? `
                                                <button class="btn-acao-comentario btn-editar-link" onclick="ativarEdicaoComentario(${res.id}, ${index})">
                                                    Editar
                                                </button>
                                            ` : ''}
                                        </div>
                                    </div>
                                `}
                            </div>

                            <div class="lista-respostas-internas">
                                ${c.respostas.map((resp, respIndex) => {
                                    const autorResp = resp.autor || "Você";
                                    const estáEditandoR = editandoResposta && editandoResposta.resenhaId === res.id && editandoResposta.comentarioIndex === index && editandoResposta.respostaIndex === respIndex;

                                    return `
                                    <div class="comentario-item resposta-item">
                                        ${estáEditandoR ? `
                                            <div class="wrapper-edicao-inline">
                                                <input type="text" id="edit-input-r-${res.id}-${index}-${respIndex}" class="input-edicao-inline" value="${resp.texto}">
                                                <div class="botoes-edicao-flex">
                                                    <button onclick="salvarEdicaoResposta(${res.id}, ${index}, ${respIndex})" class="btn-salvar-inline">Salvar</button>
                                                    <button onclick="cancelarEdicao()" class="btn-cancelar-inline">Cancelar</button>
                                                </div>
                                            </div>
                                        ` : `
                                            <div class="comentario-lado-esquerdo">
                                                <span class="comentario-autor">${autorResp}</span>
                                                <p class="comentario-texto-conteudo">${resp.texto}</p>
                                            </div>
                                            <div class="comentario-lado-direito">
                                                <div class="comentario-acoes">
                                                    <button class="btn-curtir-comentario-novo ${resp.euCurti ? 'curtido' : ''}" onclick="curtirResposta(${res.id}, ${index}, ${respIndex})">
                                                        <i>❤</i> <span>${resp.curtidas || 0}</span>
                                                    </button>
                                                    ${autorResp === "Você" ? `
                                                        <button class="btn-acao-comentario btn-editar-link" onclick="ativarEdicaoResposta(${res.id}, ${index}, ${respIndex})">
                                                            Editar
                                                        </button>
                                                    ` : ''}
                                                </div>
                                            </div>
                                        `}
                                    </div>
                                    `;
                                }).join("")}
                            </div>
                        </div>
                        `;
                    }).join("")}
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

let respostaPendente = null;
let editandoComentario = null; 
let editandoResposta = null;  



function alternarComentarios(id) {
    const painel = document.getElementById(`comentarios-${id}`);
    if (painel) painel.classList.toggle("ativo");
}
function prepararResposta(resenhaId, comentarioIndex) {
    const input = document.getElementById(`input-res-${resenhaId}`);
    if (!input) return;
    input.placeholder = "Respondendo a este comentário...";
    input.focus();
    respostaPendente = { resenhaId, comentarioIndex };
}
function adicionarComentario(id) {
    const input = document.getElementById(`input-res-${id}`);
    const valor = input.value.trim();
    if (!valor) return;

    const post = listaResenhas.find(p => p.id === id);

    if (respostaPendente && respostaPendente.resenhaId === id) {
        const comentarioPai = post.comentarios[respostaPendente.comentarioIndex];
        if (!comentarioPai.respostas) comentarioPai.respostas = [];
        
        comentarioPai.respostas.push({ 
            autor: "Você", 
            texto: valor, 
            curtidas: 0, 
            euCurti: false 
        });
        respostaPendente = null; 
    } else {
        post.comentarios.push({ autor: "Você", texto: valor, curtidas: 0, euCurti: false, respostas: [] });
    }

    input.value = "";
    input.placeholder = "Escreva algo...";
    if(document.body.classList.contains("pagina-obra")){
    atualizarFeedObra();
    }else{
    renderizarFeed(listaResenhas);
}
    document.getElementById(`comentarios-${id}`).classList.add("ativo");
}
function curtirPost(id) {
    const post = listaResenhas.find(p => p.id === id);
    if (post) {
        post.foiCurtido ? post.curtidas-- : post.curtidas++;
        post.foiCurtido = !post.foiCurtido;
        if(document.body.classList.contains("pagina-obra")){
        atualizarFeedObra();
        }else{
        renderizarFeed(listaResenhas);
}
    }
}
function curtirComentario(resenhaId, comentarioIndex) {
    const post = listaResenhas.find(p => p.id === resenhaId);
    const comentario = post.comentarios[comentarioIndex];
    comentario.euCurti ? comentario.curtidas-- : comentario.curtidas++;
    comentario.euCurti = !comentario.euCurti;
    if(document.body.classList.contains("pagina-obra")){
    atualizarFeedObra();
    }else{
    renderizarFeed(listaResenhas);
}
    document.getElementById(`comentarios-${resenhaId}`).classList.add("ativo");
}
function curtirResposta(resenhaId, comentarioIndex, respostaIndex) {
    const post = listaResenhas.find(p => p.id === resenhaId);
    const resposta = post.comentarios[comentarioIndex].respostas[respostaIndex];
    resposta.euCurti ? resposta.curtidas-- : resposta.curtidas++;
    resposta.euCurti = !resposta.euCurti;
    if(document.body.classList.contains("pagina-obra")){
    atualizarFeedObra();
    }else{
    renderizarFeed(listaResenhas);
}
    document.getElementById(`comentarios-${resenhaId}`).classList.add("ativo");
}
function ativarEdicaoComentario(resenhaId, comentarioIndex) {
    cancelarEdicao();
    editandoComentario = { resenhaId, comentarioIndex };
    if(document.body.classList.contains("pagina-obra")){
    atualizarFeedObra();
}else{
    renderizarFeed(listaResenhas);
}
    document.getElementById(`comentarios-${resenhaId}`).classList.add("ativo");
}
function ativarEdicaoResposta(resenhaId, comentarioIndex, respostaIndex) {
    cancelarEdicao();
    editandoResposta = { resenhaId, comentarioIndex, respostaIndex };
    if(document.body.classList.contains("pagina-obra")){
    atualizarFeedObra();
}else{
    renderizarFeed(listaResenhas);
}
    document.getElementById(`comentarios-${resenhaId}`).classList.add("ativo");
}
function cancelarEdicao() {
    editandoComentario = null;
    editandoResposta = null;
    if(document.body.classList.contains("pagina-obra")){
    atualizarFeedObra();
}else{
    renderizarFeed(listaResenhas);
}
}
function salvarEdicaoComentario(resenhaId, comentarioIndex) {
    const input = document.getElementById(`edit-input-c-${resenhaId}-${comentarioIndex}`);
    if (input && input.value.trim()) {
        listaResenhas.find(p => p.id === resenhaId).comentarios[comentarioIndex].texto = input.value.trim();
    }
    cancelarEdicao();
}
function salvarEdicaoResposta(resenhaId, comentarioIndex, respostaIndex) {
    const input = document.getElementById(`edit-input-r-${resenhaId}-${comentarioIndex}-${respostaIndex}`);
    if (input && input.value.trim()) {
        listaResenhas.find(p => p.id === resenhaId).comentarios[comentarioIndex].respostas[respostaIndex].texto = input.value.trim();
    }
    cancelarEdicao();
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.body.classList.contains("pagina-obra")) {
        if (typeof atualizarFeedObra === "function") {
            atualizarFeedObra();
        }
    } else {
        if (typeof renderizarFeed === "function") {
            const populares = [...listaResenhas]
                .sort((a, b) => b.curtidas - a.curtidas)
                .slice(0, 3);
                
            renderizarFeed(populares);
        }
    }
});

renderizarSidebar();
renderizarFeed(listaResenhas);