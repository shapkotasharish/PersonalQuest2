/* ============================================
   CATCH THE FALLING CAKES GAME
   ============================================ */

const cakesGame = {
    score: 0,
    highScore: parseInt(localStorage.getItem('highScoreCakes')) || 0,
    lives: 3,
    isPlaying: false,
    gameLoop: null,
    spawnInterval: null,
    difficulty: 1,
    catcherX: 50,
    items: []
};

const CAKE_EMOJIS = ['🍰', '🧁', '🎂', '🍩', '🍪', '🍫'];
const BAD_ITEMS = ['💣', '🌶️'];

document.addEventListener('DOMContentLoaded', () => {
    initCakesGame();
});

function initCakesGame() {
    updateDisplay();
    initControls();
    initStartButton();
    initBackButton();

    // Easter egg
    if (window.easterEggs) {
        window.easterEggs.createEgg('cakes-1', '95%', '5%');
    }

    // Audio init
    document.addEventListener('click', function startAudio() {
        if (window.partyAudio) window.partyAudio.init();
        document.removeEventListener('click', startAudio);
    }, { once: true });
}

function initControls() {
    const gameArea = document.getElementById('gameArea');
    const catcher = document.getElementById('catcher');

    // Mouse control
    gameArea.addEventListener('mousemove', (e) => {
        if (!cakesGame.isPlaying) return;
        const rect = gameArea.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        cakesGame.catcherX = Math.max(10, Math.min(90, x));
        catcher.style.left = cakesGame.catcherX + '%';
    });

    // Touch control
    gameArea.addEventListener('touchmove', (e) => {
        if (!cakesGame.isPlaying) return;
        e.preventDefault();
        const rect = gameArea.getBoundingClientRect();
        const touch = e.touches[0];
        const x = ((touch.clientX - rect.left) / rect.width) * 100;
        cakesGame.catcherX = Math.max(10, Math.min(90, x));
        catcher.style.left = cakesGame.catcherX + '%';
    }, { passive: false });

    // Keyboard control
    document.addEventListener('keydown', (e) => {
        if (!cakesGame.isPlaying) return;
        if (e.key === 'ArrowLeft') {
            cakesGame.catcherX = Math.max(10, cakesGame.catcherX - 5);
        } else if (e.key === 'ArrowRight') {
            cakesGame.catcherX = Math.min(90, cakesGame.catcherX + 5);
        }
        catcher.style.left = cakesGame.catcherX + '%';
    });
}

function initStartButton() {
    const startBtn = document.getElementById('startBtn');
    startBtn.addEventListener('click', () => {
        if (window.partyAudio) window.partyAudio.playClick();
        startGame();
    });
}

function startGame() {
    cakesGame.score = 0;
    cakesGame.lives = 3;
    cakesGame.difficulty = 1;
    cakesGame.isPlaying = true;
    cakesGame.items = [];

    // Hide overlay
    document.getElementById('gameOverlay').classList.add('hidden');

    // Clear any existing items
    document.querySelectorAll('.falling-item').forEach(item => item.remove());

    updateDisplay();

    // Start spawning
    spawnItem();
    cakesGame.spawnInterval = setInterval(() => {
        spawnItem();
        // Increase difficulty over time
        if (cakesGame.score > 0 && cakesGame.score % 10 === 0) {
            cakesGame.difficulty = Math.min(3, cakesGame.difficulty + 0.1);
        }
    }, 1500 / cakesGame.difficulty);

    // Start game loop
    cakesGame.gameLoop = setInterval(checkCollisions, 50);
}

function spawnItem() {
    if (!cakesGame.isPlaying) return;

    const gameArea = document.getElementById('gameArea');
    const item = document.createElement('div');
    item.className = 'falling-item';

    // 90% chance for good item, 10% for bad
    const isBad = Math.random() < 0.1;
    const emojis = isBad ? BAD_ITEMS : CAKE_EMOJIS;
    item.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    item.dataset.bad = isBad;

    // Random horizontal position
    const x = 10 + Math.random() * 80;
    item.style.left = x + '%';
    item.style.top = '-50px';

    // Calculate fall duration based on difficulty
    const duration = 4000 / cakesGame.difficulty;
    item.style.animationDuration = duration + 'ms';

    gameArea.appendChild(item);

    // Track item
    const itemData = {
        element: item,
        x: x,
        startTime: Date.now(),
        duration: duration,
        isBad: isBad
    };
    cakesGame.items.push(itemData);

    // Remove after animation
    setTimeout(() => {
        if (item.parentElement && !item.classList.contains('caught')) {
            if (!itemData.isBad) {
                // Missed a good item
                loseLife();
                item.classList.add('missed');
            }
            setTimeout(() => {
                item.remove();
                cakesGame.items = cakesGame.items.filter(i => i !== itemData);
            }, 500);
        }
    }, duration);
}

function checkCollisions() {
    if (!cakesGame.isPlaying) return;

    const catcher = document.getElementById('catcher');
    const catcherRect = catcher.getBoundingClientRect();
    const gameArea = document.getElementById('gameArea');
    const gameRect = gameArea.getBoundingClientRect();

    cakesGame.items.forEach(itemData => {
        if (!itemData.element.parentElement) return;
        if (itemData.element.classList.contains('caught')) return;

        const itemRect = itemData.element.getBoundingClientRect();

        // Calculate item's current Y position
        const elapsed = Date.now() - itemData.startTime;
        const progress = elapsed / itemData.duration;
        const itemY = progress * (gameRect.height + 100);

        // Check if item is at catcher level
        if (itemY > gameRect.height - 80 && itemY < gameRect.height - 20) {
            // Check horizontal overlap
            const itemCenterX = itemRect.left + itemRect.width / 2;
            const catcherCenterX = catcherRect.left + catcherRect.width / 2;
            const distance = Math.abs(itemCenterX - catcherCenterX);

            if (distance < 60) {
                catchItem(itemData);
            }
        }
    });
}

function catchItem(itemData) {
    const item = itemData.element;
    item.classList.add('caught');

    if (itemData.isBad) {
        // Caught a bad item
        if (window.partyAudio) window.partyAudio.playOops();
        loseLife();
    } else {
        // Caught a good item
        cakesGame.score++;
        if (window.partyAudio) window.partyAudio.playCatch();

        // Show floating score
        const rect = item.getBoundingClientRect();
        showFloatingNumber(rect.left, rect.top, '+1', '#2ecc71');
    }

    // Remove from tracking
    cakesGame.items = cakesGame.items.filter(i => i !== itemData);

    setTimeout(() => item.remove(), 300);
    updateDisplay();
}

function loseLife() {
    cakesGame.lives--;

    if (window.partyAudio) window.partyAudio.playOops();

    // Screen shake
    const gameArea = document.getElementById('gameArea');
    gameArea.style.animation = 'shake 0.3s ease-out';
    setTimeout(() => gameArea.style.animation = '', 300);

    updateDisplay();

    if (cakesGame.lives <= 0) {
        endGame();
    }
}

function endGame() {
    cakesGame.isPlaying = false;

    // Stop intervals
    clearInterval(cakesGame.spawnInterval);
    clearInterval(cakesGame.gameLoop);

    // Update high score
    if (cakesGame.score > cakesGame.highScore) {
        cakesGame.highScore = cakesGame.score;
        localStorage.setItem('highScoreCakes', cakesGame.highScore);
        if (window.partyAudio) window.partyAudio.playLevelUp();
    } else {
        if (window.partyAudio) window.partyAudio.playGameOver();
    }

    // Show overlay
    const overlay = document.getElementById('gameOverlay');
    const title = document.getElementById('overlayTitle');
    const text = document.getElementById('overlayText');
    const btn = document.getElementById('startBtn');

    title.textContent = 'Game Over!';
    text.innerHTML = `Score: ${cakesGame.score}<br>${cakesGame.score === cakesGame.highScore ? '🎉 New High Score!' : `High Score: ${cakesGame.highScore}`}`;
    btn.textContent = 'Play Again';

    overlay.classList.remove('hidden');

    updateDisplay();
}

function updateDisplay() {
    document.getElementById('score').textContent = cakesGame.score;
    document.getElementById('highScore').textContent = cakesGame.highScore;

    const livesStr = '❤️'.repeat(cakesGame.lives) + '🖤'.repeat(3 - cakesGame.lives);
    document.getElementById('lives').textContent = livesStr;
}

function initBackButton() {
    const backBtn = document.getElementById('backBtn');
    backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.partyAudio) window.partyAudio.playClick();
        window.location.href = 'hub.html';
    });
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-10px); }
        40%, 80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);
