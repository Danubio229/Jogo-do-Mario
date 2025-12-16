const mario = document.querySelector('.mario');
const cano = document.querySelector('.cano');
const scoreEl = document.getElementById('score');
const recordEl = document.getElementById('record');
const restartBtn = document.getElementById('restartBtn');
const music = document.getElementById('music');
const jumpSound = document.getElementById('jumpSound');
const deadSound = document.getElementById('deadSound');
const startScreen = document.getElementById('startScreen');
const startBtn = document.getElementById('startBtn');
const musicBtn = document.getElementById('musicBtn');

let score = 0;
let record = localStorage.getItem('record-mario') || 0;
let running = false;
let musicOn = true;

recordEl.innerText = record;

startBtn.addEventListener('click', ()=>{
    startScreen.style.display = 'none';
    running = true;
    music.volume = 0.4;
    music.play();
});

musicBtn.addEventListener('click', ()=>{
    musicOn = !musicOn;
    if(musicOn){
        music.play();
        musicBtn.textContent = '🔊';
    }else{
        music.pause();
        musicBtn.textContent = '🔇';
    }
});

function jump(){
    if(!running) return;
    mario.classList.add('jump');
    jumpSound.currentTime = 0;
    jumpSound.play();
    setTimeout(()=> mario.classList.remove('jump'), 500);
}

document.addEventListener('keydown', jump);

const loop = setInterval(()=>{
    if(!running) return;

    const canoPosition = cano.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px','');

    score++;
    scoreEl.innerText = score;

    if(canoPosition <= 125 && canoPosition > 0 && marioPosition < 80){
        running = false;
        cano.style.animation = 'none';
        cano.style.left = `${canoPosition}px`;
        mario.style.animation = 'none';
        mario.style.bottom = `${marioPosition}px`;
        mario.src = 'img/game-over.png';
        mario.style.width = '75px';
        mario.style.marginLeft = '50px';

        if(musicOn) music.pause();
        deadSound.play();

        restartBtn.style.display = 'block';

        if(score > record){
            record = score;
            localStorage.setItem('record-mario', record);
            recordEl.innerText = record;
        }
    }
}, 10);
function resetGame(){
    // Resetar estado
    running = true;
    score = 0;
    scoreEl.innerText = score;
    restartBtn.style.display = "none";

    // Resetar Mario
    mario.src = 'img/mario.gif';
    mario.style.width = '150px';
    mario.style.marginLeft = '0px';
    mario.style.bottom = '0px';
    mario.style.animation = 'none';
    setTimeout(()=> mario.style.animation = '', 10);

    // Resetar cano
    cano.style.animation = 'none';
    cano.style.left = '100%'; // volta para direita
    setTimeout(()=> {
        cano.style.animation = 'cano-infinito 2s infinite linear';
    }, 10);

    // Música volta se estiver ativada
    if(musicOn){
        music.currentTime = 0;
        music.play();
    }
}


restartBtn.addEventListener('click', resetGame);
