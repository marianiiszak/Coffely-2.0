const inputBusca = document.getElementById("input-busca");
const conteudoDescubra = document.getElementById("conteudo-descubra");

let livrosGlobais = [];

async function carregarLivros() {
try {
const resposta = await fetch("/api/obras/");

```
    if (!resposta.ok) {
        throw new Error("Não foi possível carregar as obras.");
    }

    livrosGlobais = await resposta.json();
    exibirLivros(livrosGlobais);
} catch (erro) {
    console.error("Erro ao carregar livros:", erro);

    conteudoDescubra.innerHTML = `
        <p style="font-family:'Alice', serif; font-size:20px; color:#8a6b58; text-align:center; width:100%;">
            Não foi possível carregar os livros.
        </p>
    `;
}
```

}

function exibirLivros(lista) {
conteudoDescubra.innerHTML = "";

```
if (lista.length === 0) {
    conteudoDescubra.innerHTML = `
        <p style="font-family:'Alice', serif; font-size:20px; color:#8a6b58; text-align:center; width:100%;">
            Nenhum livro encontrado...
        </p>
    `;
    return;
}

lista.forEach(livro => {
    const card = document.createElement("div");
    card.className = "livro";
    card.title = livro.titulo;

    if (livro.capa) {
        const imagem = document.createElement("img");
        imagem.src = livro.capa;
        imagem.alt = `Capa de ${livro.titulo}`;
        imagem.className = "capa-livro";

        imagem.onerror = () => {
            imagem.remove();
            card.classList.add("sem-capa");
        };

        card.appendChild(imagem);
    } else {
        card.classList.add("sem-capa");
    }

    const informacoes = document.createElement("div");
    informacoes.className = "info-livro";

    const titulo = document.createElement("h3");
    titulo.textContent = livro.titulo;

    const autor = document.createElement("p");
    autor.textContent = livro.autor || "Autor não informado";

    informacoes.appendChild(titulo);
    informacoes.appendChild(autor);
    card.appendChild(informacoes);

    conteudoDescubra.appendChild(card);
});
```

}

if (inputBusca) {
inputBusca.addEventListener("input", () => {
const termo = inputBusca.value.trim().toLowerCase();

```
    const filtrados = livrosGlobais.filter(livro =>
        (livro.titulo || "").toLowerCase().includes(termo) ||
        (livro.autor || "").toLowerCase().includes(termo)
    );

    exibirLivros(filtrados);
});
```

}

const btnAddDescubra = document.querySelector(".btn-add");

if (btnAddDescubra) {
btnAddDescubra.addEventListener("click", () => {
const modal = document.getElementById("modalLivro");

```
    setTimeout(() => {
        const canvas = document.querySelector("#phaser-layer canvas");

        if (!canvas || !modal) return;

        const rect = modal.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();

        const x = rect.left - canvasRect.left + rect.width / 2;
        const y = rect.top - canvasRect.top + rect.height / 2;

        if (window.fxModalEntrada) {
            window.fxModalEntrada(x, y);
        }
    }, 20);
});
```

}

carregarLivros();
