let listaResenhasSalvas = JSON.parse(localStorage.getItem('listaResenhasGeral'));
let listaResenhas = listaResenhasSalvas ? listaResenhasSalvas.map(r => ({
    ...r,
    dataPostagem: new Date(r.dataPostagem)
})) : [
    {
        id: 1,
        usuario: "Usuário 2",
        fotoPerfil: "",
        livro: "Romeu e Julieta",
        capa: "",
        nota: 4,
        dataPostagem: new Date(Date.now() - 1000 * 60 * 180),
        texto: "Uma história que continua atual mesmo séculos depois. Shakespeare constrói personagens muito humanos e um romance intenso. O final é conhecido, mas isso não diminui o impacto da leitura.",
        curtidas: 300,
        foiCurtido: false,
        comentarios: [
            {
                autor: "Visitante",
                texto: "Que resenha incrível!",
                curtidas: 0,
                euCurti: false,
                respostas: []
            }
        ],
        qtdComentariosOriginal: 12
    },
    {
        id: 2,
        usuario: "Usuário 3",
        fotoPerfil: "",
        livro: "Romeu e Julieta",
        capa: "",
        nota: 5,
        dataPostagem: new Date(Date.now() - 1000 * 60 * 60 * 8),
        texto: "Foi a primeira obra do Shakespeare que li e fiquei surpresa com a escrita. Achei que seria cansativo, mas a narrativa prende muito e a tragédia é construída de forma excelente.",
        curtidas: 247,
        foiCurtido: false,
        comentarios: [
            {
                autor: "Visitante",
                texto: "Também foi meu primeiro Shakespeare!",
                curtidas: 2,
                euCurti: false,
                respostas: []
            }
        ],
        qtdComentariosOriginal: 7
    },
    {
        id: 3,
        usuario: "Usuário 4",
        fotoPerfil: "",
        livro: "Romeu e Julieta",
        capa: "",
        nota: 3.5,
        dataPostagem: new Date(Date.now() - 1000 * 60 * 60 * 24),
        texto: "Gostei bastante da obra, principalmente dos diálogos. Em alguns momentos achei o romance muito acelerado, mas entendo que faz parte da proposta da peça.",
        curtidas: 189,
        foiCurtido: false,
        comentarios: [
            {
                autor: "Visitante",
                texto: "Concordo totalmente.",
                curtidas: 1,
                euCurti: false,
                respostas: []
            }
        ],
        qtdComentariosOriginal: 5
    }
];

const dadosEstatisticas = {
    avaliacoes: [
        { nota: 0.5, qtd: 10 },
        { nota: 1.0, qtd: 15 },
        { nota: 1.5, qtd: 30 },
        { nota: 2.0, qtd: 25 },
        { nota: 2.5, qtd: 95 },
        { nota: 3.0, qtd: 50 },
        { nota: 3.5, qtd: 85 },
        { nota: 4.0, qtd: 60 },
        { nota: 4.5, qtd: 75 },
        { nota: 5.0, qtd: 55 }
    ]
};

let notaUsuario = parseFloat(localStorage.getItem('notaUsuarioGeral')) || 0;
let eFavoritoObra = JSON.parse(localStorage.getItem('favoritoObraGeral')) || false;

let mostrandoTodas = false;
let mostrandoAtividade = false;
let htmlOriginalGrid = "";

let respostaPendente = null;
let editandoComentario = null;
let editandoResposta = null;
let idResenhaEditando = null;
let eFavoritoModal = false;

function toggleBiblioteca() {
    const statusBox = document.getElementById('status-biblioteca');
    if (statusBox) {
        statusBox.style.display = statusBox.style.display === 'none' ? 'block' : 'none';
    }
}

function renderizarHistograma() {
    const container = document.getElementById('container-barras');
    if (!container) return;
    
    container.innerHTML = ''; 
    const maxVotos = Math.max(...dadosEstatisticas.avaliacoes.map(d => d.qtd));

    dadosEstatisticas.avaliacoes.forEach(dado => {
        let altura = (dado.qtd / maxVotos) * 90; 
        if (dado.qtd === 0) altura = 2;
        const divCol = document.createElement('div');
        divCol.className = 'coluna-barra';
        divCol.title = `Nota ${dado.nota}: ${dado.qtd} votos`; 

        divCol.innerHTML = `
            <div class="barra" style="height: ${altura}%;"></div>
        `;
        container.appendChild(divCol);
    });
}

function atualizarEstrelasVisual(nota, estrelas) {
    if (!estrelas) return;
    estrelas.forEach((estrela, index) => {
        const valor = index + 1;
        estrela.classList.remove(
            "fa-solid",
            "fa-regular",
            "fa-star",
            "fa-star-half-stroke"
        );

        if (nota >= valor) {
            estrela.classList.add("fa-solid", "fa-star");
        } else if (nota >= valor - 0.5) {
            estrela.classList.add("fa-solid", "fa-star-half-stroke");
        } else {
            estrela.classList.add("fa-regular", "fa-star");
        }
    });
}

function sincronizarNotaGeral(novaNota) {
    notaUsuario = novaNota;
    localStorage.setItem('notaUsuarioGeral', notaUsuario);

    listaResenhas.forEach(r => {
        if (r.usuario === "Você") {
            r.nota = notaUsuario;
        }
    });
    localStorage.setItem('listaResenhasGeral', JSON.stringify(listaResenhas));

    atualizarSuaAvaliacaoLateral();
    if (mostrandoAtividade) {
        atualizarPainelMinhaAvaliacaoAtividade();
    }
}

function atualizarSuaAvaliacaoLateral() {
    const containerLateral = document.getElementById("user-stars");
    if (containerLateral) {
        const estrelas = containerLateral.querySelectorAll("i");
        atualizarEstrelasVisual(notaUsuario, estrelas);
    }
}

function formatarTempo(data) {
    const agora = new Date();
    const diferenca = Math.floor((agora - new Date(data)) / 1000);
    if (diferenca < 60) return `agora mesmo`;
    if (diferenca < 3600) return `há ${Math.floor(diferenca / 60)}min`;
    if (diferenca < 86400) return `há ${Math.floor(diferenca / 3600)}h`;
    return new Date(data).toLocaleDateString('pt-BR');
}

function gerarEstrelasHTML(nota) {
    let html = "";
    for (let i = 1; i <= 5; i++) {
        if (nota >= i) {
            html += '<i class="fa-solid fa-star"></i>';
        } else if (nota >= i - 0.5) {
            html += '<i class="fa-solid fa-star-half-stroke"></i>';
        } else {
            html += '<i class="fa-regular fa-star"></i>';
        }
    }
    return html;
}

function obterDataHoje() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

function limparDataLeitura() {
    const inputData = document.getElementById('data-leitura-input');
    if (inputData) {
        inputData.value = "";
    }
}

function toggleFavoritoModal() {
    eFavoritoModal = !eFavoritoModal;
    eFavoritoObra = eFavoritoModal; 
    localStorage.setItem('favoritoObraGeral', JSON.stringify(eFavoritoObra));
    atualizarIconeFavoritoModal();
    atualizarVisualFavoritoGlobal();
    if (mostrandoAtividade) {
        atualizarPainelMinhaAvaliacaoAtividade();
    }
}

function atualizarIconeFavoritoModal() {
    const btnFav = document.getElementById('btn-favoritar-modal');
    if (!btnFav) return;
    
    const icone = btnFav.querySelector('i');
    if (eFavoritoModal) {
        btnFav.classList.add('ativo');
        icone.className = 'fa-solid fa-heart';
    } else {
        btnFav.classList.remove('ativo');
        icone.className = 'fa-regular fa-heart';
    }
}

function abrirModal(idEdicao = null) {
    const modal = document.getElementById('modal-resenha');
    const editor = document.getElementById('editor-texto');
    const inputData = document.getElementById('data-leitura-input');
    const estrelasContainer = document.getElementById('user-stars-modal');
    
    idResenhaEditando = idEdicao;

    if (idEdicao) {
        const resenha = listaResenhas.find(r => r.id === idEdicao);
        if (resenha) {
            if (editor) editor.innerHTML = resenha.texto;
            notaUsuario = resenha.nota || 5;
            eFavoritoModal = !!resenha.favorito;
            eFavoritoObra = eFavoritoModal;
            if (inputData) {
                inputData.value = resenha.dataLeitura || obterDataHoje();
            }
        }
    } else {
        if (editor) editor.innerHTML = "";
        if (notaUsuario === 0) notaUsuario = 5; 
        eFavoritoModal = eFavoritoObra; 
        if (inputData) inputData.value = obterDataHoje();
    }

    atualizarIconeFavoritoModal();

    if (estrelasContainer) {
        const estrelas = estrelasContainer.querySelectorAll('i');
        atualizarEstrelasVisual(notaUsuario, estrelas);
    }

    if (modal) modal.style.display = 'flex';
}

function fecharModal() {
    const modal = document.getElementById('modal-resenha');
    idResenhaEditando = null;
    if (modal) modal.style.display = 'none';
}

function publicarResenha() {
    const editor = document.getElementById('editor-texto');
    const textoResenha = editor ? editor.innerHTML : "";
    const checkSpoiler = document.getElementById('check-spoiler');
    const btnRelido = document.getElementById('btn-relido');
    const inputData = document.getElementById('data-leitura-input');
    const dataLeituraEscolhida = inputData ? inputData.value : obterDataHoje();

    const notaFinal = notaUsuario > 0 ? notaUsuario : 5;

    if (idResenhaEditando) {
        const resenha = listaResenhas.find(r => r.id === idResenhaEditando);
        if (resenha) {
            resenha.texto = textoResenha;
            resenha.nota = notaFinal;
            resenha.favorito = eFavoritoModal;
            resenha.dataLeitura = dataLeituraEscolhida;
            resenha.spoiler = checkSpoiler ? checkSpoiler.checked : false;
            resenha.relido = btnRelido ? btnRelido.classList.contains('active') : false;
        }
        alert("Resenha atualizada com sucesso!");
    } else {
        const novaResenha = {
            id: Date.now(),
            usuario: "Você",
            fotoPerfil: "",
            livro: typeof livroAtual !== 'undefined' ? livroAtual : "Romeu e Julieta",
            capa: typeof capaAtual !== 'undefined' ? capaAtual : "",
            nota: notaFinal,
            dataPostagem: new Date().toISOString(),
            dataLeitura: dataLeituraEscolhida,
            favorito: eFavoritoModal,
            spoiler: checkSpoiler ? checkSpoiler.checked : false,
            relido: btnRelido ? btnRelido.classList.contains('active') : false,
            texto: textoResenha,
            curtidas: 0,
            foiCurtido: false,
            comentarios: [],
            qtdComentariosOriginal: 0
        };
        listaResenhas.push(novaResenha);
        alert("Resenha publicada com sucesso!");
    }

    localStorage.setItem('listaResenhasGeral', JSON.stringify(listaResenhas));
    sincronizarNotaGeral(notaFinal);
    editor.innerHTML = "";
    idResenhaEditando = null;
    fecharModal();

    if (mostrandoAtividade) {
        abrirMinhaAtividade();
    } else if (mostrandoTodas) {
        abrirTodasResenhas();
    } else {
        atualizarFeedObra();
    }
}

function abrirModalBiblioteca() {
    const modal = document.getElementById('modal-biblioteca');
    if (modal) modal.style.display = 'flex';
}

function fecharModalBiblioteca() {
    const modal = document.getElementById('modal-biblioteca');
    if (modal) modal.style.display = 'none';
}

function selecionarStatusObra(status) {
    const badgeContainer = document.getElementById('badge-biblioteca-status');
    const txtStatus = document.getElementById('txt-status-atual');
    
    if(badgeContainer && txtStatus) {
        txtStatus.innerText = status;
        badgeContainer.style.display = 'block';
    }
    fecharModalBiblioteca();
}

function revelarSpoiler(id) {
    const post = listaResenhas.find(p => p.id === id);
    if (post) {
        post.reveladoSpoiler = true;
        atualizarInterfaceFeed(id);
    }
}

function atualizarVisualFavoritoGlobal() {
    const btnLateral = document.querySelector('.card-interacao .item-btn:nth-child(3)');
    if (btnLateral) {
        const icone = btnLateral.querySelector('.circulo-icon i');
        const texto = btnLateral.querySelector('.txt-favorito');
        const circulo = btnLateral.querySelector('.circulo-icon');
        if (eFavoritoObra) {
            if (icone) icone.className = 'fa-solid fa-heart';
            if (circulo) circulo.classList.add('curtido-active');
            if (texto) texto.innerText = "Favoritado";
        } else {
            if (icone) icone.className = 'fa-regular fa-heart';
            if (circulo) circulo.classList.remove('curtido-active');
            if (texto) texto.innerText = "Favoritar";
        }
    }
}

function formatar(comando, valor = null) {
    document.execCommand(comando, false, valor);
    const editor = document.getElementById('editor-texto');
    if (editor) editor.focus();
    atualizarEstadoBotoesToolbar();
}

function atualizarEstadoBotoesToolbar() {
    const btnBold = document.getElementById('btn-bold');
    const btnItalic = document.getElementById('btn-italic');
    const btnQuote = document.getElementById('btn-quote');

    if (btnBold) btnBold.classList.toggle('active', document.queryCommandState('bold'));
    if (btnItalic) btnItalic.classList.toggle('active', document.queryCommandState('italic'));
    if (btnQuote) btnQuote.classList.toggle('active', document.queryCommandState('formatBlock', false, 'blockquote'));
}

function excluirResenha(id) {
    if (!confirm("Tem certeza que deseja excluir esta resenha?")) return;
    
    listaResenhas = listaResenhas.filter(r => r.id !== id);
    localStorage.setItem('listaResenhasGeral', JSON.stringify(listaResenhas));

    if (mostrandoAtividade) {
        abrirMinhaAtividade();
    } else if (mostrandoTodas) {
        abrirTodasResenhas();
    } else {
        atualizarFeedObra();
    }
}

window.onclick = function(event) {
    const r = document.getElementById('modal-resenha');
    const b = document.getElementById('modal-biblioteca');
    if (event.target == r) fecharModal();
    if (event.target == b) fecharModalBiblioteca();
}

function curtirPost(id) {
    const post = listaResenhas.find(p => p.id === id);
    if (post) {
        post.foiCurtido ? post.curtidas-- : post.curtidas++;
        post.foiCurtido = !post.foiCurtido;
        
        localStorage.setItem('listaResenhasGeral', JSON.stringify(listaResenhas));

        if (mostrandoTodas) {
            const ordenadas = [...listaResenhas].sort((a, b) => b.curtidas - a.curtidas);
            renderizarCardsNaTela(ordenadas);
        } else if (mostrandoAtividade) {
            abrirMinhaAtividade();
        } else {
            atualizarFeedObra();
        }
    }
}

function alternarComentarios(id) {
    const painel = document.getElementById(`comentarios-${id}`);
    if (painel) painel.classList.toggle("ativo");
}

function curtirComentario(resenhaId, comentarioIndex) {
    const post = listaResenhas.find(p => p.id === resenhaId);
    if (post && post.comentarios[comentarioIndex]) {
        const comentario = post.comentarios[comentarioIndex];
        comentario.euCurti ? comentario.curtidas-- : comentario.curtidas++;
        comentario.euCurti = !comentario.euCurti;
        localStorage.setItem('listaResenhasGeral', JSON.stringify(listaResenhas));
        atualizarInterfaceFeed(resenhaId);
    }
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
    if (!input) return;
    const valor = input.value.trim();
    if (!valor) return;

    const post = listaResenhas.find(p => p.id === id);
    if (!post) return;

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
    localStorage.setItem('listaResenhasGeral', JSON.stringify(listaResenhas));
    atualizarInterfaceFeed(id);
}

function ativarEdicaoComentario(resenhaId, comentarioIndex) {
    editandoComentario = { resenhaId, comentarioIndex };
    atualizarInterfaceFeed(resenhaId);
}

function salvarEdicaoComentario(resenhaId, comentarioIndex) {
    const input = document.getElementById(`edit-input-c-${resenhaId}-${comentarioIndex}`);
    if (input && input.value.trim()) {
        const post = listaResenhas.find(p => p.id === resenhaId);
        if (post && post.comentarios[comentarioIndex]) {
            post.comentarios[comentarioIndex].texto = input.value.trim();
            localStorage.setItem('listaResenhasGeral', JSON.stringify(listaResenhas));
        }
    }
    cancelarEdicao();
}

function removerComentario(resenhaId, comentarioIndex) {
    const post = listaResenhas.find(r => r.id === resenhaId);
    if (!post) return;

    if (!confirm("Deseja excluir este comentário?")) return;

    post.comentarios.splice(comentarioIndex, 1);
    localStorage.setItem('listaResenhasGeral', JSON.stringify(listaResenhas));
    atualizarInterfaceFeed(resenhaId);
}

function atualizarFeedObra() {
    const populares = [...listaResenhas]
        .sort((a, b) => b.curtidas - a.curtidas)
        .slice(0, 2);

    renderizarCardsNaTela(populares);
}

function atualizarInterfaceFeed(resenhaId) {
    if (mostrandoTodas) {
        renderizarCardsNaTela([...listaResenhas].sort((a, b) => b.curtidas - a.curtidas));
    } else if (mostrandoAtividade) {
        abrirMinhaAtividade();
    } else {
        atualizarFeedObra();
    }
}

function cancelarEdicao() {
    editandoComentario = null;
    editandoResposta = null;
    atualizarFeedObra();
}

function renderizarCardsNaTela(lista) {
    const feedContainer = document.getElementById("feed-posts");
    if (!feedContainer) return;

    feedContainer.innerHTML = "";

    if (lista.length === 0) {
        feedContainer.innerHTML = `<p style="text-align: center; color: #777; padding: 20px;">Nenhuma resenha encontrada.</p>`;
        return;
    }

    lista.forEach(res => {
        const card = document.createElement("article");
        card.className = "card-resenha-obra";

        const htmlComentarios = geradorHtmlComentarios(res);

        card.innerHTML = `
            <div class="obra-header">
                <div class="obra-user">
                    <div class="user-avatar-resenha"></div>
                    <div class="user-meta-resenha">
                        <strong class="user-nome-resenha">${res.usuario}</strong>
                        <div class="obra-data">${formatarTempo(res.dataPostagem)}</div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    ${res.relido ? `<span class="badge-relido-resenha" title="Obra relida"><i class="fa-solid fa-repeat"></i> Relido</span>` : ''}
                    <div class="obra-estrelas" data-id="${res.id}">
                        ${gerarEstrelasHTML(res.nota)}
                    </div>
                </div>
            </div>

            <div class="obra-texto-wrapper ${res.spoiler && !res.reveladoSpoiler ? 'com-spoiler' : ''}">
                <div class="obra-texto">
                    ${res.texto}
                </div>
                ${res.spoiler && !res.reveladoSpoiler ? `
                    <div class="overlay-spoiler">
                        <button type="button" class="btn-ver-resenha-spoiler" onclick="revelarSpoiler(${res.id})">
                            <i class="fa-solid fa-triangle-exclamation"></i> Contém spoiler. Ver resenha
                        </button>
                    </div>
                ` : ''}
            </div>
            
            <div class="resenha-footer">
                <div class="stats-interacao">
                    <button class="btn-interagir ${res.foiCurtido ? 'curtido' : ''}" onclick="curtirPost(${res.id})">
                        <i class="coracao-icon">❤</i>
                        <strong>${res.curtidas}</strong>
                    </button>

                    <button class="btn-interagir btn-comentar-icone" onclick="alternarComentarios(${res.id})">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2"
                             stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        <strong>${(res.comentarios ? res.comentarios.length : 0) + (res.qtdComentariosOriginal || 0)}</strong>
                    </button>
                </div>

                <div class="btn-group">
                    <button class="btn-acao-3d btn-curtir-main" onclick="curtirPost(${res.id})">Curtir</button>
                    <button class="btn-acao-3d btn-comentar-main" onclick="alternarComentarios(${res.id})">Comentar</button>
                    ${res.usuario === "Você" ? `
                        <button class="btn-acao-3d btn-editar-main" onclick="abrirModal(${res.id})" title="Editar sua resenha">Editar</button>
                        <button class="btn-acao-3d btn-excluir-main btn-excluir-link" onclick="excluirResenha(${res.id})" title="Excluir resenha">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    ` : ''}
                </div>
            </div>

            <div class="sessao-comentarios" id="comentarios-${res.id}">
                <div class="lista-comentarios-interna">
                    ${htmlComentarios}
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

function geradorHtmlComentarios(res) {
    if (!res.comentarios || res.comentarios.length === 0) return "";

    return res.comentarios.map((c, index) => {
        if (!c.respostas) c.respostas = [];
        const autor = c.autor || "Visitante";
        const estáEditandoC = editandoComentario && editandoComentario.resenhaId === res.id && editandoComentario.comentarioIndex === index;

        let itemComentarioHTML = "";
        if (estáEditandoC) {
            itemComentarioHTML = `
                <div class="wrapper-edicao-inline">
                    <input type="text" id="edit-input-c-${res.id}-${index}" class="input-edicao-inline" value="${c.texto}">
                    <div class="botoes-edicao-flex">
                        <button onclick="salvarEdicaoComentario(${res.id}, ${index})" class="btn-salvar-inline">Salvar</button>
                        <button onclick="cancelarEdicao()" class="btn-cancelar-inline">Cancelar</button>
                    </div>
                </div>`;
        } else {
            itemComentarioHTML = `
                <div class="comentario-lado-esquerdo">
                    <span class="comentario-autor">${autor}</span>
                    <p class="comentario-texto-conteudo">${c.texto}</p>
                </div>
                <div class="comentario-lado-direito">
                    <div class="comentario-acoes">
                        <button class="btn-curtir-comentario-novo ${c.euCurti ? 'curtido' : ''}" onclick="curtirComentario(${res.id}, ${index})">
                            <i>❤</i>
                            <span>${c.curtidas || 0}</span>
                        </button>                                        
                        <button class="btn-acao-comentario" onclick="prepararResposta(${res.id}, ${index})">
                            Responder
                        </button>
                        ${autor === "Você" ? `
                            <button class="btn-acao-comentario btn-editar-link" onclick="ativarEdicaoComentario(${res.id}, ${index})" title="Editar">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="btn-acao-comentario btn-excluir-link" onclick="removerComentario(${res.id}, ${index})" title="Excluir">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>`;
        }

        const listaRespostasHTML = c.respostas.map((resp, respIndex) => {
            const autorResp = resp.autor || "Visitante";
            const estáEditandoR = editandoResposta && editandoResposta.resenhaId === res.id && editandoResposta.comentarioIndex === index && editandoResposta.respostaIndex === respIndex;

            if (estáEditandoR) {
                return `
                <div class="comentario-item resposta-item">
                    <div class="wrapper-edicao-inline">
                        <input type="text" id="edit-input-r-${res.id}-${index}-${respIndex}" class="input-edicao-inline" value="${resp.texto}">
                        <div class="botoes-edicao-flex">
                            <button onclick="salvarEdicaoResposta(${res.id}, ${index}, ${respIndex})" class="btn-salvar-inline">Salvar</button>
                            <button onclick="cancelarEdicao()" class="btn-cancelar-inline">Cancelar</button>
                        </div>
                    </div>
                </div>`;
            } else {
                return `
                <div class="comentario-item resposta-item">
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
                                <button class="btn-acao-comentario btn-editar-link" onclick="ativarEdicaoResposta(${res.id}, ${index}, ${respIndex})" title="Editar">
                                    <i class="fa-solid fa-pen"></i>
                                </button>
                                <button class="btn-acao-comentario btn-excluir-link" onclick="removerResposta(${res.id}, ${index}, ${respIndex})" title="Excluir">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>`;
            }
        }).join("");

        return `
            <div class="comentario-container-completo">
                <div class="comentario-item">
                    ${itemComentarioHTML}
                </div>
                <div class="lista-respostas-internas">
                    ${listaRespostasHTML}
                </div>
            </div>
        `;
    }).join("");
}

function abrirTodasResenhas() {
    const gridPrincipal = document.querySelector(".grid-principal");
    if (!gridPrincipal) return;

    if (!htmlOriginalGrid) {
        htmlOriginalGrid = gridPrincipal.innerHTML;
    }

    const ordenadas = [...listaResenhas].sort((a, b) => b.curtidas - a.curtidas);
    mostrandoTodas = true;
    mostrandoAtividade = false;

    gridPrincipal.innerHTML = `
        <div style="width: 100%; grid-column: 1 / -1;">
            
            <div class="faixa-estatisticas-obra">
                <div class="container-estatisticas-obra">
                    <div class="quadrinho-estatistica">
                        <i class="fa-solid fa-star estrela-icone"></i>
                        <span>4,6</span>
                    </div>
                    <div class="quadrinho-estatistica">
                        <i class="fa-solid fa-heart"></i>
                        <span>324 favoritos</span>
                    </div>
                    <div class="quadrinho-estatistica">
                        <i class="fa-solid fa-comment"></i>
                        <span>${listaResenhas.length} resenhas</span>
                    </div>
                    <div class="quadrinho-estatistica">
                        <i class="fa-solid fa-book-open"></i>
                        <span>512 lidos</span>
                    </div>
                </div>
            </div>

            <div class="caixa-todas-resenhas">
                <div class="cabecalho-todas-resenhas-limpo">
                    <div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
                        <img src="/front/images/decoracaos.png" style="height: 60px;" alt="estrela">
                        <h2 class="titulo-todas-resenhas-texto">
                            Todas as resenhas de <span class="nome-livro-destaque">Romeu e Julieta</span>
                        </h2>
                    </div>
                    
                    <div class="acoes-cabecalho-resenhas">
                        <div class="info-contador-resenhas">
                            Total: <strong>${listaResenhas.length}</strong> ${listaResenhas.length === 1 ? 'resenha' : 'resenhas'}
                        </div>
                        <a href="#" id="voltar-resenhas" class="btn-voltar">
                            <span>←</span> Voltar
                        </a>
                    </div>
                </div>

                <div class="divisor-com-coracao">
                    <i class="fa-solid fa-heart"></i>
                </div>
                
                <div id="feed-posts" class="lista-resenhas-obra"></div>
            </div>
        </div>
    `;

    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderizarCardsNaTela(ordenadas);

    document.getElementById("voltar-resenhas").onclick = function (e) {
        e.preventDefault();
        mostrandoTodas = false;
        gridPrincipal.innerHTML = htmlOriginalGrid;
        htmlOriginalGrid = ""; 

        const btnPop = document.getElementById("ver-populares");
        if(btnPop) {
            btnPop.onclick = function(event) {
                event.preventDefault();
                abrirTodasResenhas();
            };
        }
        
        reconfigurarBotaoAtividade();
        sincronizarAvaliacaoInicial();
        configurarEventosSuaAvaliacaoLateral(); 
        atualizarVisualFavoritoGlobal();
        atualizarFeedObra();
    };
}

function abrirMinhaAtividade(e) {
    if (e) e.preventDefault();
    const gridPrincipal = document.querySelector(".grid-principal");
    if (!gridPrincipal) return;

    if (!htmlOriginalGrid) {
        htmlOriginalGrid = gridPrincipal.innerHTML;
    }

    const minhasResenhas = listaResenhas.filter(r => r.usuario === "Você");
    mostrandoAtividade = true;
    mostrandoTodas = false;

    gridPrincipal.innerHTML = `
        <div style="width: 100%; grid-column: 1 / -1;">
            
            <div class="caixa-todas-resenhas">
                
                <div class="cabecalho-todas-resenhas-limpo">
                    <div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
                        <img src="/front/images/decoracaos.png" style="height: 60px;" alt="decoração">
                        <h2 class="titulo-todas-resenhas-texto">
                            Minha Atividade em <span class="nome-livro-destaque">Romeu e Julieta</span>
                        </h2>
                    </div>
                    
                    <div class="acoes-cabecalho-resenhas">
                        <div class="info-contador-resenhas">
                            Total: <strong>${minhasResenhas.length}</strong> ${minhasResenhas.length === 1 ? 'resenha' : 'resenhas'}
                        </div>
                        <a href="#" id="voltar-resenhas" class="btn-voltar">
                            <span>←</span> Voltar
                        </a>
                    </div>
                </div>

                <div class="divisor-com-coracao">
                    <i class="fa-solid fa-heart"></i>
                </div>

                <div class="grid-conteudo-atividade">
                    
                    <div id="feed-posts" class="lista-resenhas-obra"></div>

                    <div class="coluna-quadros-atividade">
                        
                        <div class="quadro-estilo-card">
                            <h3 class="titulo-quadro-atividade">
                                Sua Avaliação & Favorito
                            </h3>
                            <div id="painel-minha-avaliacao-atividade" style="display: flex; flex-direction: column; gap: 15px;">
                            </div>
                        </div>

                        <div class="quadro-estilo-card">
                            <h3 class="titulo-quadro-atividade">
                                Resenhas Curtidas por Você nesta Obra
                            </h3>
                            <div id="lista-curtidas-lateral"></div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    `;

    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderizarCardsNaTela(minhasResenhas);
    atualizarPainelMinhaAvaliacaoAtividade();

    const lateralContainer = document.getElementById("lista-curtidas-lateral");
    if (lateralContainer) {
        const curtidasOutros = listaResenhas.filter(r => r.usuario !== "Você" && r.foiCurtido);
        if (curtidasOutros.length === 0) {
            lateralContainer.innerHTML = `<p style="font-size: 13px; color: #8a6b58; font-style: italic;">Nenhuma outra resenha curtida por você ainda.</p>`;
        } else {
            lateralContainer.innerHTML = curtidasOutros.map(r => `
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid #f2f2f2;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 32px; height: 32px; background: #e58f8f; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #fff; font-weight: bold;">
                            ${r.usuario.charAt(0)}
                        </div>
                        <span style="font-size: 14px; font-weight: 500; color: #8a6b58;">${r.usuario}</span>
                    </div>
                    <div style="color: #ffdb79; font-size: 13px; font-weight: bold; display: flex; align-items: center; gap: 4px;">
                        ${gerarEstrelasHTML(r.nota)}
                    </div>
                </div>
            `).join("");
        }
    }

    document.getElementById("voltar-resenhas").onclick = function (event) {
        event.preventDefault();
        mostrandoAtividade = false;
        gridPrincipal.innerHTML = htmlOriginalGrid;
        htmlOriginalGrid = ""; 

        const btnPop = document.getElementById("ver-populares");
        if(btnPop) {
            btnPop.onclick = function(ev) {
                ev.preventDefault();
                abrirTodasResenhas();
            };
        }
        
        reconfigurarBotaoAtividade();
        sincronizarAvaliacaoInicial();
        configurarEventosSuaAvaliacaoLateral(); 
        atualizarVisualFavoritoGlobal();
        atualizarFeedObra();
    };
}

function atualizarPainelMinhaAvaliacaoAtividade() {
    const container = document.getElementById("painel-minha-avaliacao-atividade");
    if (!container) return;

    container.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.03); padding: 12px 15px; border-radius: 8px;">
            <span style="font-weight: 500; font-size: 14px;">Sua Nota:</span>
            <div id="estrelas-atividade" style="color: #ffdb79; font-size: 18px; cursor: pointer; display: flex; gap: 4px;">
                ${gerarEstrelasHTML(notaUsuario)}
            </div>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.03); padding: 12px 15px; border-radius: 8px;">
            <span style="font-weight: 500; font-size: 14px;">Status de Favorito:</span>
            <button onclick="toggleFavoritoModal()" style="background: none; border: none; cursor: pointer; font-size: 18px; display: flex; align-items: center; gap: 6px; color: #e58f8f;">
                <i class="${eFavoritoObra ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                <span style="font-size: 14px; font-weight: bold; font-family: 'Alice', serif;">${eFavoritoObra ? 'Favoritado' : 'Favoritar'}</span>
            </button>
        </div>
    `;

    const estrelasContainer = document.getElementById("estrelas-atividade");
    if (estrelasContainer) {
        function calcularNota(e) {
            const rect = estrelasContainer.getBoundingClientRect();
            const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
            return Math.ceil((x / rect.width) * 10) / 2;
        }

        estrelasContainer.onclick = (e) => {
            const novaNota = calcularNota(e);
            sincronizarNotaGeral(novaNota);
        };

        estrelasContainer.onmousemove = (e) => {
            const notaHover = calcularNota(e);
            const estrelas = estrelasContainer.querySelectorAll("i");
            atualizarEstrelasVisual(notaHover, estrelas);
        };

        estrelasContainer.onmouseleave = () => {
            const estrelas = estrelasContainer.querySelectorAll("i");
            atualizarEstrelasVisual(notaUsuario, estrelas);
        };
    }
}

function reconfigurarBotaoAtividade() {
    const btnMinha = document.getElementById("ver-minha-atividade");
    if(btnMinha){
        btnMinha.onclick = abrirMinhaAtividade;
    }
}

function removerResposta(resenhaId, comentarioIndex, respostaIndex) {
    if (!confirm("Tem certeza que deseja excluir esta resposta?")) return;
    
    const post = listaResenhas.find(p => p.id === resenhaId);
    if (post && post.comentarios && post.comentarios[comentarioIndex]) {
        post.comentarios[comentarioIndex].respostas.splice(respostaIndex, 1);
        localStorage.setItem('listaResenhasGeral', JSON.stringify(listaResenhas));
    }
    
    atualizarInterfaceFeed(resenhaId);
}

function salvarEdicaoResposta(resenhaId, comentarioIndex, respostaIndex){
    const input = document.getElementById(`edit-input-r-${resenhaId}-${comentarioIndex}-${respostaIndex}`);
    if(!input) return;

    const texto = input.value.trim();
    if(texto === "") return;

    const post = listaResenhas.find(r => r.id === resenhaId);
    if (post && post.comentarios && post.comentarios[comentarioIndex] && post.comentarios[comentarioIndex].respostas[respostaIndex]) {
        post.comentarios[comentarioIndex].respostas[respostaIndex].texto = texto;
        localStorage.setItem('listaResenhasGeral', JSON.stringify(listaResenhas));
    }
    cancelarEdicao();
    atualizarInterfaceFeed(resenhaId);
}

function ativarEdicaoResposta(resenhaId, comentarioIndex, respostaIndex) {
    editandoResposta = { resenhaId, comentarioIndex, respostaIndex };
    atualizarInterfaceFeed(resenhaId);
}

function curtirResposta(resenhaId, comentarioIndex, respostaIndex) {
    const post = listaResenhas.find(r => r.id === resenhaId);
    if (post && post.comentarios && post.comentarios[comentarioIndex] && post.comentarios[comentarioIndex].respostas[respostaIndex]) {
        const resp = post.comentarios[comentarioIndex].respostas[respostaIndex];
        resp.euCurti ? resp.curtidas-- : resp.curtidas++;
        resp.euCurti = !resp.euCurti;
        localStorage.setItem('listaResenhasGeral', JSON.stringify(listaResenhas));
        atualizarInterfaceFeed(resenhaId);
    }
}

function inicializarEventosEstrelasModal() {
    const container = document.getElementById('user-stars-modal');
    if (!container) return;

    function calcularNotaPorPosicao(e) {
        const rect = container.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        return Math.ceil((x / rect.width) * 10) / 2;
    }

    container.onclick = (e) => {
        notaUsuario = calcularNotaPorPosicao(e);
        const estrelas = container.querySelectorAll('i');
        atualizarEstrelasVisual(notaUsuario, estrelas);
    };

    container.onmousemove = (e) => {
        const notaHover = calcularNotaPorPosicao(e);
        const estrelas = container.querySelectorAll('i');
        atualizarEstrelasVisual(notaHover, estrelas);
    };

    container.onmouseleave = () => {
        const estrelas = container.querySelectorAll('i');
        atualizarEstrelasVisual(notaUsuario, estrelas);
    };
}

function sincronizarAvaliacaoInicial() {
    const minhaResenha = listaResenhas.find(r => r.usuario === "Você");
    if (minhaResenha && notaUsuario === 0) {
        notaUsuario = minhaResenha.nota;
    }
    atualizarSuaAvaliacaoLateral();
}

function configurarEventosSuaAvaliacaoLateral() {
    const containerLateral = document.getElementById("user-stars");
    if (!containerLateral) return;

    function calcularNota(e) {
        const rect = containerLateral.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        return Math.ceil((x / rect.width) * 10) / 2;
    }

    containerLateral.onclick = (e) => {
        const novaNota = calcularNota(e);
        sincronizarNotaGeral(novaNota);

        if (mostrandoAtividade) {
            abrirMinhaAtividade();
        } else if (mostrandoTodas) {
            renderizarCardsNaTela([...listaResenhas].sort((a, b) => b.curtidas - a.curtidas));
        } else {
            atualizarFeedObra();
        }
    };

    containerLateral.onmousemove = (e) => {
        const notaHover = calcularNota(e);
        const estrelas = containerLateral.querySelectorAll("i");
        atualizarEstrelasVisual(notaHover, estrelas);
    };

    containerLateral.onmouseleave = () => {
        const estrelas = containerLateral.querySelectorAll("i");
        atualizarEstrelasVisual(notaUsuario, estrelas);
    };
}

document.addEventListener("DOMContentLoaded", () => {
    renderizarHistograma();
    sincronizarAvaliacaoInicial();
    configurarEventosSuaAvaliacaoLateral();
    atualizarVisualFavoritoGlobal();
    atualizarFeedObra();
    reconfigurarBotaoAtividade();
    inicializarEventosEstrelasModal();

    const editor = document.getElementById('editor-texto');
    if (editor) {
        editor.addEventListener('keyup', atualizarEstadoBotoesToolbar);
        editor.addEventListener('mouseup', atualizarEstadoBotoesToolbar);
    }

    const btnPopulares = document.getElementById("ver-populares");
    if (btnPopulares) {
        btnPopulares.onclick = function(e) {
            e.preventDefault();
            abrirTodasResenhas();
        };
    }
});