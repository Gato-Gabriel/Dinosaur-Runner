/* Principais variáveis do jogo */
const dino = document.querySelector('#dino');
dino.isJumping = false;
dino.position = 3;

const background = document.querySelector('#background');

let gameOver = false;
let score = 0;
document.addEventListener("keydown", handleKeyUp);

/* Funções para o funcionamento do jogo */
function handleKeyUp(event){
    if(event.keyCode == 32 && !gameOver){   // 32 = Código da Barra de Espaço
        jump(dino);
    }
}

function jump(element){
    if(element.isJumping == true) return;   // Caso ele já esteja no ar, não pulará novamente
    element.isJumping = true;
    let upInterval = setInterval(()=>{
        if(element.position >= 153){   // Ao atingir a altura máxima do pulo...
            clearInterval(upInterval);  // ...ele termina o loop de subir...
            let downInterval = setInterval(() => {  // ...e faz o dinossauro cair.
                if(element.position<=3){   // Ao atingir a altura mínima (chão do fundo)...
                    clearInterval(downInterval);  // ...ele sai do loop que o faz cair.
                    element.isJumping = false;
                } else {   // Caso ainda não tenha atingido o solo...
                    element.position -= 20; // ...continua a cair.
                    element.style.bottom = element.position + 'px';
                }
            },34);
        } else {   // Caso ainda não tenha atingido a altura máxima...
            element.position += 20;  // ...continua a subir.
            element.style.bottom = element.position + 'px';
        }
    }, 34);
}
function createCactus(){
    if(gameOver) return;
    let cactus = document.createElement('div');
    cactus.position = 1100;  // Posição inicial na qual os cactos surgem.
    cactus.speed = 10;  // Velocidade na qual os cactos se aproximam.
    let randomTime = Math.random() * 5800;
    let freezePosition = false;

    cactus.classList.add('cactus');
    cactus.style.left = cactus.position + 'px';
    background.appendChild(cactus);

    const scoreboard = document.querySelector('.scoreboard');

    let leftInterval = setInterval(()=>{
        if(cactus.position < -60){   // Caso o cacto saia completamente da tela...
            clearInterval(leftInterval);   // ...ele para de se mover...
            background.removeChild(cactus);
            score += 10;
            scoreboard.innerHTML = score + ' pts';
            if(score%50 == 0){  // A cada 100 pontos...
                cactus.speed+=50;   // ...a dificuldade do jogo é aumentada (pois os cactos se movem mais rapidamente)
            }
        } else if (cactus.position > 0 && cactus.position < 122 && dino.position < 60 && !gameOver) {  // Colisão com o dinossauro (caso ele nã esteja pulando)
            // GameOver
            gameOver = true;
            clearInterval(leftInterval);
            background.style.animationPlayState = 'paused';  // Pausa a animação do fundo
            scoreboard.style.display = 'none';   // Faz com que a caixa de pontuação no canto superior da tela desapareça
            let gameOverScreen = document.createElement('div');
            gameOverScreen.classList.add('game-over-screen');
            document.body.appendChild(gameOverScreen)
            gameOverScreen.innerHTML = '<div class="game-over-box"><h1 class="game-over-title">Game Over</h1><h2 class="game-over-score">Your score: '+score+' pts</h2><h3 class="play-again" onclick="playGame(true)">Play Again <br><i class="fas fa-redo"></i></h3></div>';
        } else if(gameOver){
            freezePosition = true;
            cactus.remove();   // Caso o player já tenha colidido com algum cacto, os outros na tela somem.
            
        }
        else if(!gameOver && !freezePosition) {
            cactus.position -= cactus.speed;   // Velocidade na qual ele se move para a esquerda;
            cactus.style.left = cactus.position + 'px';
        }
    },20);

    if(!gameOver) setTimeout(createCactus, randomTime);
}

function playGame(hasPlayed=false){
    if(hasPlayed){
        gameOver = false;
        score = 0;
        let scoreboard = document.querySelector('.scoreboard');
        scoreboard.style.display = 'block';  scoreboard.innerHTML = score + ' pts';
        while(true){
            if(document.querySelector('.cactus')!=null){
                console.log(document.querySelector('.cactus'));
                document.querySelector('.cactus').remove();
            }
            else break;
        }
        let gameOverScreen = document.querySelector('.game-over-screen');
        gameOverScreen.remove();
        background.style.animationPlayState = 'running';  // Continua a animação do fundo
        
        
        /* let gameOverCactus = document.querySelector('.cactus');  // Cacto que causou o fim do jogo
        gameOverCactus.remove(); */
    }
    
    createCactus();
}

playGame(false);    // Execução do jogo
