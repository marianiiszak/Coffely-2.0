const btnAdd = document.querySelector(".btn-add");
const modal = document.getElementById("modalLivro");
const modalConteudo = document.querySelector(".modal-livro");
const btnFechar = document.querySelector(".btn-fechar");
const btnSalvar = document.querySelector(".btn-salvar");

let libroRecemCriado = null;

if (btnAdd && modal) {
  btnAdd.addEventListener("click", () => {
    modal.classList.add("ativo");
  });
}

if (btnFechar && modal) {
  btnFechar.addEventListener("click", () => {
    modal.classList.remove("ativo");
  });
}

if (modal && modalConteudo) {
  modal.addEventListener("click", (event) => {
    if (!modalConteudo.contains(event.target)) {
      modal.classList.remove("ativo");
    }
  });
}

if (btnSalvar) {
  btnSalvar.addEventListener("click", (e) => {
    e.preventDefault(); 
    const titulo = document.getElementById("novoTitulo").value.trim();

    if (titulo === "") {
      alert("Por favor, preencha o nome do livro.");
      return;
    }

    livroRecemCriado = {
      titulo: titulo,
      prateleira: "Quero ler"
    };

    if (typeof livrosGlobais !== 'undefined') {
      const existe = livrosGlobais.some(livro => livro.titulo.toLowerCase() === titulo.toLowerCase());
      if (!existe) {
          livrosGlobais.push(livroRecemCriado);
          if (typeof exibirLivros === 'function') exibirLivros(livrosGlobais);
      }
    }

    document.getElementById("novoTitulo").value = "";
    document.getElementById("novoAutor").value = "";
    document.getElementById("novoAno").value = "";
    modal.classList.remove("ativo");

    const modal2 = document.getElementById("modalConfirmacao");
    if (modal2) {
      modal2.classList.add("ativo");
    }
    
    setTimeout(() => {
      const x = window.innerWidth / 2;
      const y = window.innerHeight / 2;
      const confetes = new SistemaConfetes();
      confetes.estourar(x, y);
    }, 100);
  });
}

const modalConfirmacao = document.getElementById("modalConfirmacao");
const confirmarCategoria = document.getElementById("confirmarCategoria");
const pularCategoria = document.getElementById("pularCategoria");

if (confirmarCategoria && modalConfirmacao) {
  confirmarCategoria.addEventListener("click", () => {
    const categoria = document.getElementById("categoriaLivro").value;
    if (livroRecemCriado) {
      livroRecemCriado.prateleira = categoria;
    }
    modalConfirmacao.classList.remove("ativo");
    if (typeof mostrarPrateleiras === 'function') {
      mostrarPrateleiras(livrosGlobais);
    }
  });
}

if (pularCategoria && modalConfirmacao) {
  pularCategoria.addEventListener("click", () => {
    modalConfirmacao.classList.remove("ativo");
    if (typeof mostrarPrateleiras === 'function') {
      mostrarPrateleiras(livrosGlobais);
    }
  });
}

// Zs
function criarZ() {
    const container = document.getElementById("z-container");
    if (!container) return;

    const z = document.createElement("span");
    z.className = "letra-z";
    z.textContent = "Z";

    const tamanho = Math.random() * 8 + 32;
    z.style.fontSize = `${tamanho}px`;

    container.appendChild(z);

    const duracao = (Math.random() * 1000) + 7500;
    const inicio = performance.now();
    const startY = (Math.random() * 12) - 6;
    const distanciaX = 320;
    const alturaFinal = -20;
    const amplitude = 30;

    function animar(tempo) {
        let t = (tempo - inicio) / duracao;

        if (t >= 1) {
            z.remove();
            return;
        }

        const x = distanciaX * t;
        const yBase = startY + alturaFinal * t;
        const curva = Math.sin(Math.PI * t);
        const y = yBase + curva * amplitude;

        let opacidade = t < 0.1 ? (t / 0.1 * 0.8) : (t > 0.8 ? ((1 - t) / 0.2 * 0.8) : 0.8);
        const escala = 0.45 + t * 0.55;

        z.style.opacity = opacidade;
        z.style.transform = `translate(${x}px, ${y}px) scale(${escala})`;

        requestAnimationFrame(animar);
    }
    requestAnimationFrame(animar);
}
setInterval(criarZ, 1600);

// Confetes
class SistemaConfetes {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    
    this.canvas.style.position = "fixed";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.width = "100vw";
    this.canvas.style.height = "100vh";
    this.canvas.style.pointerEvents = "none"; 
    this.canvas.style.zIndex = "999999"; 
    
    document.body.appendChild(this.canvas);
    
    this.particulas = [];
    this.cores = ["#fffbb2", "#faaad6", "#ddfcac", "#9bf8ff", "#bf8df5"];
    this.ajustarTamanho();
  }

  ajustarTamanho() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  estourar() {
    const totalParticulas = 250; 

    for (let i = 0; i < totalParticulas; i++) {
      this.particulas.push({
        x: Math.random() * window.innerWidth, 
        y: Math.random() * -150 - 20, 
        vx: Math.random() * 1.5 - 0.75, 
        vy: Math.random() * 3 + 4, 
        raio: Math.random() * 2 + 1.5, 
        cor: this.cores[Math.floor(Math.random() * this.cores.length)],
        brilho: Math.random(),
        velocidadeBrilho: Math.random() * 0.1 + 0.05,
        opacidade: 1
      });
    }

    this.animar();
  }

  animar() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalCompositeOperation = "screen";

    for (let i = this.particulas.length - 1; i >= 0; i--) {
      const p = this.particulas[i];
      p.x += p.vx;
      p.y += p.vy;
      p.brilho += p.velocidadeBrilho;
      let alphaAtual = p.opacidade * (0.3 + Math.abs(Math.sin(p.brilho)) * 0.7);
      if (p.y > this.canvas.height * 0.7) {
        p.opacidade -= 0.015;
      }

      if (p.opacidade <= 0 || p.y > this.canvas.height) {
        this.particulas.splice(i, 1);
        continue;
      }
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.raio, 0, Math.PI * 2);
      this.ctx.globalAlpha = alphaAtual;
      this.ctx.fillStyle = p.cor;
      this.ctx.fill();
    }

    if (this.particulas.length > 0) {
      requestAnimationFrame(() => this.animar());
    } else {
      this.canvas.remove();
    }
  }
}

//resenhas

