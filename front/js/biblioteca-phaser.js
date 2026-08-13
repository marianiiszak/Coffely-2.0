class BibliotecaScene extends Phaser.Scene{

constructor(){
super("BibliotecaScene");
}

preload(){

    let g=this.make.graphics({
        x:0,
        y:0,
        add:false
    });

    g.fillStyle(0xffffff,1);
    g.fillCircle(9,9,1.7);
    g.generateTexture("glow",20,20);
    g.clear();

    g.fillStyle(0xffffff,1);
    g.fillCircle(10,10,.9);
    g.generateTexture("tiny",20,20);

    g.destroy();

}

create(){

let w=this.scale.width;
let h=this.scale.height;

for(let i=0;i<240;i++){

let star=this.add.image(
Phaser.Math.Between(0,w),
Phaser.Math.Between(0,h),
Phaser.Math.RND.pick([
"tiny",
"glow"
])
);

star.setBlendMode("ADD");

star.setAlpha(
Phaser.Math.FloatBetween(.28,.6)
);

star.setScale(
Phaser.Math.FloatBetween(.5,.95)
);

this.twinkle(star);

}

this.add.particles(
0,
0,
"tiny",
{
x:{min:0,max:w},
y:{min:0,max:h},
frequency:18,
quantity:2,
scale:{start:.38,end:0},
alpha:{start:.6,end:0},
blendMode:"ADD"
}
);

window.addEventListener("mousemove", e=>{
this.mouseTrail(e.clientX,e.clientY);
});

document.querySelectorAll(
"button,.nav-btn,.filtro,.btn-voltar"
).forEach(btn=>{

btn.addEventListener("click", e=>{
this.clickSpark(e.clientX,e.clientY);
});

});

window.fxModalEntrada = (x,y)=>{
this.modalEntradaFX(x,y);
};

window.fxModalSucesso = (x,y)=>{
this.modalSucessoFX(x,y);
};

window.phaserPronto = true;

}

twinkle(star){

this.tweens.add({

targets:star,

alpha:{from:.5,to:.95},

scale:{
from:star.scale,
to:star.scale + 0.25
},

duration:1800 + Math.random()*1200,

ease:"Sine.easeInOut",

yoyo:true,
repeat:-1,

delay:Math.random()*800

});
}

mouseTrail(x,y){


for(let i=0;i<2;i++){
let p=this.add.image(
x + Phaser.Math.Between(-16,16),
y + Phaser.Math.Between(-16,16),
Phaser.Math.RND.pick(["tiny","glow"])
);

p.setBlendMode("ADD");
p.setAlpha(.72);

p.setScale(
Phaser.Math.FloatBetween(.45,.65)
);

this.tweens.add({

targets:p,

x:p.x + Phaser.Math.Between(-14,14),
y:p.y + Phaser.Math.Between(-14,14),

alpha:0,

scale: {
    from: Phaser.Math.FloatBetween(1.3, 2.5),
    to: 0.35
},

duration:1000,

ease:"Sine.easeOut",

onComplete:()=>p.destroy()

});

}

}

clickSpark(x,y){

for(let i=0;i<8;i++){

let p=this.add.image(x,y,"glow");

p.setBlendMode("ADD");

this.tweens.add({

targets:p,

x:x + Phaser.Math.Between(-35,35),
y:y + Phaser.Math.Between(-35,35),

alpha:0,

scale: {
    from: Phaser.Math.FloatBetween(1.3, 2.5),
    to: 0.35
},

duration:420,

ease:"Quad.out",

onComplete:()=>p.destroy()

});

}

}}

new Phaser.Game({

type:Phaser.AUTO,
width:window.innerWidth,
height:window.innerHeight,
transparent:true,
parent:"phaser-layer",
dom: {
    createContainer: true 
  },
scene:[BibliotecaScene]

});

window.addEventListener("resize",()=>location.reload());

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('phaser-bemvindo-layer');
  if (!container) return;

  const config = {
    type: Phaser.AUTO,
    parent: 'phaser-bemvindo-layer',
    width: container.clientWidth,
    height: container.clientHeight,
    transparent: true,
    physics: { default: 'false' },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };

  const game = new Phaser.Game(config);
  let mouseGlow;
  let bgCircles = [];
  let lastMouse = { x: 0, y: 0 };

  // Paleta de confetes vibrante e limpa (sem cinzas)
  const paletaCores = [
    { nome: 'rosaClaro',    hex: '#f4d1d4', rgb: [244, 209, 212] },
    { nome: 'rosaConfete',  hex: '#ffb4bf', rgb: [250, 170, 214] },
    { nome: 'lilasSuave',   hex: '#e4d5f7', rgb: [228, 213, 247] },
    { nome: 'azulSuave',    hex: '#cbf7ff', rgb: [192, 243, 252] },
    { nome: 'verdeSuave',   hex: '#e0ffbf', rgb: [213, 247, 176] },
    { nome: 'amareloSuave', hex: '#fff8b5', rgb: [255, 245, 160] }
  ];

  let indexCor = 0;

  // Função auxiliar para gerar texturas puras com degradê colorido
  function criarTexturaGradiente(scene, key, rgb) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const [r, g, b] = rgb;
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.95)`);
    gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.6)`);
    gradient.addColorStop(0.8, `rgba(${r}, ${g}, ${b}, 0.15)`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(128, 128, 128, 0, Math.PI * 2);
    ctx.fill();

    scene.textures.addCanvas(key, canvas);
  }

  function preload() {
    // Gerar uma textura própria e bem saturada para cada cor
    paletaCores.forEach(cor => {
      criarTexturaGradiente(this, `glow_${cor.nome}`, cor.rgb);
    });
  }

  function create() {
    const scene = this;

    // 1. Criar bolhas circulares de fundo bem vivas
    for (let i = 0; i < 10; i++) {
      const x = Phaser.Math.Between(100, config.width - 100);
      const y = Phaser.Math.Between(80, config.height - 80);
      const corObj = paletaCores[i % paletaCores.length];
      
      const circle = scene.add.image(x, y, `glow_${corObj.nome}`);

      const isLarge = i < 4;
      const scaleBase = isLarge ? Phaser.Math.FloatBetween(2.2, 3.2) : Phaser.Math.FloatBetween(1.1, 1.8);
      
      circle.setScale(scaleBase);
      circle.setAlpha(isLarge ? 0.6 : 0.85);

      circle.userData = {
        baseX: x,
        baseY: y,
        baseScale: scaleBase,
        isLarge: isLarge
      };

      // Flutuação contínua e suave
      scene.tweens.add({
        targets: circle,
        x: x + Phaser.Math.Between(-70, 70),
        y: y + Phaser.Math.Between(-40, 40),
        duration: Phaser.Math.Between(5000, 9000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      bgCircles.push(circle);
    }

    // 2. Bolha Interativa do Mouse
    mouseGlow = scene.add.image(config.width / 2, config.height / 2, `glow_${paletaCores[0].nome}`);
    mouseGlow.setScale(2.2);
    mouseGlow.setAlpha(0.95);

    // Mudar a cor da bolha do mouse trocando suavemente a textura (sem desbotar)
    function alternarCorMouse() {
      indexCor = (indexCor + 1) % paletaCores.length;
      const proximaCor = paletaCores[indexCor];

      scene.tweens.add({
        targets: mouseGlow,
        alpha: 0.2,
        duration: 800,
        ease: 'Sine.easeInOut',
        onComplete: () => {
          mouseGlow.setTexture(`glow_${proximaCor.nome}`);
          scene.tweens.add({
            targets: mouseGlow,
            alpha: 0.95,
            duration: 800,
            ease: 'Sine.easeInOut',
            onComplete: () => {
              scene.time.delayedCall(2000, alternarCorMouse);
            }
          });
        }
      });
    }

    scene.time.delayedCall(2000, alternarCorMouse);

    // Eventos do Cursor
    const section = document.querySelector('.bem-vindo');
    section.addEventListener('mousemove', (e) => {
      const rect = section.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const deltaX = mouseX - lastMouse.x;
      const deltaY = mouseY - lastMouse.y;
      const speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      lastMouse.x = mouseX;
      lastMouse.y = mouseY;

      // Seguir cursor suavemente
      scene.tweens.add({
        targets: mouseGlow,
        x: mouseX,
        y: mouseY,
        duration: 200,
        ease: 'Power1.easeOut'
      });

      // Deformação sutil e fluida
      const stretch = Math.min(speed * 0.018, 0.7);
      scene.tweens.add({
        targets: mouseGlow,
        scaleX: 2.2 + stretch,
        scaleY: Math.max(1.4, 2.2 - stretch * 0.4),
        duration: 150,
        yoyo: true,
        ease: 'Quad.easeOut'
      });

      // Interatividade com as bolhas do fundo
      bgCircles.forEach((circle) => {
        const dist = Phaser.Math.Distance.Between(mouseX, mouseY, circle.x, circle.y);
        
        if (dist < 200) {
          const factor = (200 - dist) / 200;
          
          scene.tweens.add({
            targets: circle,
            scaleX: circle.userData.baseScale + factor * 0.6,
            scaleY: circle.userData.baseScale + factor * 0.3,
            duration: 250,
            ease: 'Power1.easeOut'
          });
        } else {
          scene.tweens.add({
            targets: circle,
            scaleX: circle.userData.baseScale,
            scaleY: circle.userData.baseScale,
            duration: 500,
            ease: 'Sine.easeOut'
          });
        }
      });
    });

    window.addEventListener('resize', () => {
      if (container) {
        game.scale.resize(container.clientWidth, container.clientHeight);
      }
    });
  }

  function update() {
    if (mouseGlow) {
      mouseGlow.rotation += 0.002;
    }
  }
});