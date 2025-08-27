// ====== Baralho padrão (12 cartas) ======
// Você pode trocar nomes/emojis/valores à vontade, mantendo 4 atributos: força, velocidade, inteligência, defesa.
const BARALHO_BASE = [
    C("Lince", "🦊", 70, 92, 64, 58),
    C("Touro", "🐂", 92, 58, 40, 86),
    C("Falcão", "🦅", 48, 97, 72, 51),
    C("Cérbero", "🐺", 86, 69, 55, 88),
    C("Titã", "🗿", 98, 41, 47, 96),
    C("Oráculo", "🧙‍♂️", 38, 51, 99, 44),
    C("Ninfa", "🧚‍♀️", 42, 83, 88, 49),
    C("Drácon", "🐉", 95, 82, 61, 79),
    C("Quimera", "🐲", 91, 77, 57, 74),
    C("Gárgula", "🪨", 73, 39, 52, 90),
    C("Sereia", "🧜‍♀️", 44, 85, 81, 55),
    C("Centauro", "🏹", 76, 88, 59, 63),
  ];
  
  function C(nome, emoji, forca, velocidade, inteligencia, defesa){
    return { nome, emoji, attrs:{ forca, velocidade, inteligencia, defesa } };
  }
  
  const ATRIBUTOS = [
    { key:"forca", label:"Força" },
    { key:"velocidade", label:"Velocidade" },
    { key:"inteligencia", label:"Inteligência" },
    { key:"defesa", label:"Defesa" }
  ];
  
  // ====== Estado do jogo ======
  let deckJog = []; // cartas do jogador
  let deckCpu = []; // cartas da cpu
  let monteEmpate = []; // acumula cartas quando dá empate
  
  let cartaJog = null;
  let cartaCpu = null;
  let rodada = 0;
  
  // ====== Util ======
  const $ = sel => document.querySelector(sel);
  function shuffle(arr){
    // Fisher-Yates
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  
  function atualizarPlacar(){
    $("#placar").textContent = `Você: ${deckJog.length} cartas • CPU: ${deckCpu.length} cartas — Rodada ${rodada}`;
  }
  
  function bloquearEscolha(b){
    document.querySelectorAll(".attr button").forEach(btn=> btn.disabled = b);
  }
  
  // ====== Renderização de cartas ======
  function renderCartaJog(){
    if(!cartaJog) return;
    $("#emojiJog").textContent = cartaJog.emoji;
    $("#attrsJog").innerHTML = ATRIBUTOS.map((a,idx)=>{
      return `<div class="attr">
        <span class="name">${a.label}</span>
        <span class="value">${cartaJog.attrs[a.key]}</span>
        <button class="btn pickBtn" data-attr="${a.key}" aria-keyshortcuts="${idx+1}">Escolher</button>
      </div>`;
    }).join("");
    document.querySelectorAll(".pickBtn").forEach(btn=>{
      btn.addEventListener("click",()=> escolherAtributo(btn.dataset.attr));
    })
  }
  
  function renderCartaCpu(revelar=false, atributoEscolhido=null){
    if(!cartaCpu) return;
    $("#emojiCpu").textContent = revelar ? cartaCpu.emoji : "❓";
    $("#attrsCpu").innerHTML = ATRIBUTOS.map(a=>{
      const val = revelar ? cartaCpu.attrs[a.key] : "? ? ?";
      const destaque = revelar && a.key===atributoEscolhido ? 'style="outline:2px solid var(--accent); border-radius:10px;"' : "";
      return `<div class="attr" ${destaque}>
        <span class="name">${a.label}</span>
        <span class="value">${val}</span>
      </div>`;
    }).join("");
  }
  
  // ====== Fluxo do jogo ======
  function novoJogo(){
    const baralho = shuffle(BARALHO_BASE);
    const metade = Math.ceil(baralho.length/2);
    deckJog = baralho.slice(0, metade);
    deckCpu = baralho.slice(metade);
    monteEmpate = [];
    rodada = 0;
    $("#msg").textContent = "";
    $("#btnProxima").disabled = true;
    proximaRodada();
  }
  
  function proximaRodada(){
    if(deckJog.length===0 || deckCpu.length===0){
      fimDeJogo();
      return;
    }
    rodada++;
    $("#rodada").textContent = `Rodada ${rodada}`;
    $("#msg").textContent = "Escolha um atributo da sua carta.";
  
    cartaJog = deckJog.shift();
    cartaCpu = deckCpu.shift();
  
    renderCartaJog();
    renderCartaCpu(false);
    atualizarPlacar();
    $("#btnProxima").disabled = true;
    bloquearEscolha(false);
  }
  
  function escolherAtributo(attr){
    bloquearEscolha(true);
    renderCartaCpu(true, attr);
  
    const vJog = cartaJog.attrs[attr];
    const vCpu = cartaCpu.attrs[attr];
  
    let vencedor = null; // "jog", "cpu" ou "empate"
    if(vJog > vCpu) vencedor = "jog";
    else if(vCpu > vJog) vencedor = "cpu";
    else vencedor = "empate";
  
    const pot = [cartaJog, cartaCpu, ...monteEmpate];
    monteEmpate = [];
  
    if(vencedor === "jog"){
      deckJog.push(...pot);
      mensagem(`Você venceu a rodada! (${vJog} vs ${vCpu})`, "win");
    } else if(vencedor === "cpu"){
      deckCpu.push(...pot);
      mensagem(`CPU venceu a rodada. (${vJog} vs ${vCpu})`, "lose");
    } else {
      monteEmpate.push(cartaJog, cartaCpu);
      mensagem(`Empate! (${vJog} vs ${vCpu}) — as cartas vão para o monte e valem mais na próxima.`, "tie");
    }
  
    atualizarPlacar();
    $("#btnProxima").disabled = false;
  
    if(deckJog.length===0 || deckCpu.length===0){
      fimDeJogo();
    }
  }
  
  function mensagem(txt, tipo){
    const el = $("#msg");
    el.textContent = txt;
    el.className = `msg ${tipo||""}`;
  }
  
  function fimDeJogo(){
    bloquearEscolha(true);
    $("#btnProxima").disabled = true;
    let txt = "";
    if(deckJog.length===0 && deckCpu.length===0){
      txt = "Deu empate geral!";
    } else if(deckJog.length===0){
      txt = "Fim de jogo: CPU venceu. Tente novamente!";
    } else if(deckCpu.length===0){
      txt = "Parabéns! Você venceu o jogo!";
    } else {
      txt = "Jogo encerrado.";
    }
    mensagem(txt);
  }
  
  // ====== Controles ======
  document.addEventListener("DOMContentLoaded", ()=>{
    $("#btnNovoJogo").addEventListener("click", novoJogo);
    $("#btnProxima").addEventListener("click", proximaRodada);
  
    // Atalhos de teclado 1..4
    document.addEventListener("keydown", (e)=>{
      if(["1","2","3","4"].includes(e.key)){
        const idx = Number(e.key)-1;
        const btn = document.querySelectorAll(".pickBtn")[idx];
        if(btn && !btn.disabled) btn.click();
      }
    });
  
    // Iniciar automaticamente
    novoJogo();
  });
  