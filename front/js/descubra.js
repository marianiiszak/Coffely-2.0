const livrosGlobais = [
    { titulo: "O Pequeno Príncipe" },
    { titulo: "Amor Teoricamente" },
    { titulo: "Harry Potter" },
    { titulo: "Jane Eyre" },
    { titulo: "Coraline" },
    { titulo: "É Assim que Acaba" },
    { titulo: "A Biblioteca da Meia-Noite" }
];

const inputBusca = document.getElementById("inputBusca");
const conteudoDescubra = document.getElementById("conteudo-descubra"); 

function exibirLivros(lista) {
    conteudoDescubra.innerHTML = "";

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
        conteudoDescubra.appendChild(card);
    });
}
exibirLivros(livrosGlobais);


inputBusca.addEventListener("input", e => {
    const termo = e.target.value.toLowerCase();
    const filtrados = livrosGlobais.filter(livro =>
        livro.titulo.toLowerCase().includes(termo)
    );
    exibirLivros(filtrados);
});

const btnAddDescubra = document.querySelector(".btn-add");
btnAddDescubra.addEventListener("click", () => {
    const modal = document.getElementById("modalLivro");
    setTimeout(() => {
        const canvas = document.querySelector("#phaser-layer canvas");
        if (!canvas) return;

        const rect = modal.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();

        const x = rect.left - canvasRect.left + rect.width / 2;
        const y = rect.top - canvasRect.top + rect.height / 2;

        if (window.fxModalEntrada) {
            window.fxModalEntrada(x, y);
        }
    }, 20);
});