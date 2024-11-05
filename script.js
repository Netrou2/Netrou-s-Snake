const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('start');
const gameDiv = document.getElementById('game');
const endMenu = document.getElementById('endMenu');
const endMessage = document.getElementById('endMessage');
const restartButton = document.getElementById('restart');
const exitButton = document.getElementById('exit');
const scoreDiv = document.getElementById('score');

let snake = [{ x: 10, y: 10 }];
let snakeLength = 1;
let food = {};
let bonuses = [];
let scoreBonuses = []; // Bonus de score
let direction = { x: 0, y: 0 };
let gameInterval;
let score = 0;

// Gestion des événements de clavier
document.addEventListener('keydown', (event) => {
    if (event.code === 'ArrowUp' && direction.y === 0) {
        direction = { x: 0, y: -1 };
    } else if (event.code === 'ArrowDown' && direction.y === 0) {
        direction = { x: 0, y: 1 };
    } else if (event.code === 'ArrowLeft' && direction.x === 0) {
        direction = { x: -1, y: 0 };
    } else if (event.code === 'ArrowRight' && direction.x === 0) {
        direction = { x: 1, y: 0 };
    }
});

// Démarrer le jeu
startButton.addEventListener('click', startGame);

// Fonction pour démarrer le jeu
function startGame() {
    score = 0;
    snake = [{ x: 10, y: 10 }];
    snakeLength = 1;
    direction = { x: 0, y: 0 };
    gameDiv.style.display = 'block';
    document.getElementById('menu').style.display = 'none';
    generateFood();
    generateBonuses(3); // Générer 3 bonus de taille au départ
    generateScoreBonuses(2); // Générer 2 bonus de score au départ
    gameInterval = setInterval(gameLoop, 100);
}

// Boucle de jeu
function gameLoop() {
    updateSnake();
    if (checkCollision()) {
        endGame();
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    drawBonuses();
    drawScoreBonuses(); // Dessiner les bonus de score
    scoreDiv.textContent = `Score: ${score}`; // Met à jour le score
}

// Mettre à jour la position du serpent
function updateSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    // Vérifie si le serpent mange de la nourriture
    if (head.x === food.x && head.y === food.y) {
        score++;
        snakeLength++;
        generateFood();
    }

    // Vérifie si le serpent mange un bonus de taille
    for (let i = bonuses.length - 1; i >= 0; i--) {
        if (head.x === bonuses[i].x && head.y === bonuses[i].y) {
            snakeLength += bonuses[i].size; // Augmente la taille du serpent
            bonuses.splice(i, 1); // Retire le bonus une fois mangé
            generateBonuses(1); // Générer un nouveau bonus
        }
    }

    // Vérifie si le serpent mange un bonus de score
    for (let i = scoreBonuses.length - 1; i >= 0; i--) {
        if (head.x === scoreBonuses[i].x && head.y === scoreBonuses[i].y) {
            score += scoreBonuses[i].value; // Augmente le score
            snakeLength += 1; // Augmente également la taille du serpent
            scoreBonuses.splice(i, 1); // Retire le bonus une fois mangé
            generateScoreBonuses(1); // Générer un nouveau bonus de score
        }
    }

    if (snake.length > snakeLength) {
        snake.pop();
    }
}

// Vérifier les collisions
function checkCollision() {
    const head = snake[0];
    // Vérifie les murs
    if (head.x < 0 || head.x >= canvas.width / 10 || head.y < 0 || head.y >= canvas.height / 10) {
        return true;
    }
    // Vérifie les collisions avec le corps du serpent
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

// Finir le jeu
function endGame() {
    clearInterval(gameInterval);
    endMessage.textContent = `Vous avez perdu ! Votre score : ${score}`;
    endMenu.style.display = 'block';
    gameDiv.style.display = 'none';
}

// Recommencer le jeu
restartButton.addEventListener('click', startGame);

// Quitter le jeu
exitButton.addEventListener('click', () => {
    window.close(); // Ferme la fenêtre, fonctionne sur certaines plateformes
});

// Générer de la nourriture
function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / 10)),
        y: Math.floor(Math.random() * (canvas.height / 10))
    };
}

// Générer des bonus de taille
function generateBonuses(count) {
    const sizes = [1, 2, 3]; // Taille du bonus
    for (let i = 0; i < count; i++) {
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        const bonus = {
            x: Math.floor(Math.random() * (canvas.width / 10)),
            y: Math.floor(Math.random() * (canvas.height / 10)),
            size: size
        };
        bonuses.push(bonus);
    }
}

// Générer des bonus de score
function generateScoreBonuses(count) {
    for (let i = 0; i < count; i++) {
        const scoreBonus = {
            x: Math.floor(Math.random() * (canvas.width / 10)),
            y: Math.floor(Math.random() * (canvas.height / 10)),
            value: 5 // Valeur du bonus de score
        };
        scoreBonuses.push(scoreBonus);
    }
}

// Dessiner le serpent
function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach((segment) => {
        ctx.fillRect(segment.x * 10, segment.y * 10, 10, 10);
    });
}

// Dessiner la nourriture
function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * 10, food.y * 10, 10, 10);
}

// Dessiner les bonus de taille
function drawBonuses() {
    bonuses.forEach(bonus => {
        ctx.fillStyle = 'gold';
        ctx.fillRect(bonus.x * 10, bonus.y * 10, 10, 10);
    });
}

// Dessiner les bonus de score
function drawScoreBonuses() {
    scoreBonuses.forEach(scoreBonus => {
        ctx.fillStyle = 'blue';
        ctx.fillRect(scoreBonus.x * 10, scoreBonus.y * 10, 10, 10);
    });
}
