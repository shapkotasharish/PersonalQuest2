/* ============================================
   BIRTHDAY WHACK-A-THING GAME
   ============================================ */

const whackGame = {
    score: 0,
    highScore: parseInt(localStorage.getItem('highScoreWhack')) || 0,
    lives: 3,
    isPlaying: false,
    gameTimer: null,
    spawnTimer: null,
    activeHoles: new Set(),
    difficulty: 1
};

// Good targets - whack these!
const GOOD_TARGETS = ['🐶', '🐼', '🐰', '🐱', '🦊'];

// Bad targets - don't whack!
const BAD_TARGETS = ['🎈', '🎁', '🧸', '🌸', '⭐'];

document.addEventListener('DOMContentLoaded', () => {
    initWhackGame();
});

function initWhackGame() {
    updateDisplay();
    initHoles();
    initStartButton();
    initBackButton();

    // Easter egg
    if (window.easterEggs) {
        window.easterEggs.createEgg('whack-1', '3%', '50%');
    }

    // Audio init
    document.addEventListener('click', function startAudio() {
        if (window.partyAudio) window.partyAudio.init();
        document.removeEventListener('click', startAudio);
    }, { once: true });
}

function initHoles() {
    const holes = document.querySelectorAll('.whack-hole');

    holes.forEach(hole => {
        hole.addEventListener('click', () => {
            if (!whackGame.isPlaying) return;
            if (!hole.classList.contains('active')) return;

            whackTarget(hole);
        });
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
    whackGame.score = 0;
    whackGame.lives = 3;
    whackGame.difficulty = 1;
    whackGame.isPlaying = true;
    whackGame.activeHoles = new Set();

    // Hide overlay
    document.getElementById('gameOverlay').classList.add('hidden');

    // Clear any active holes
    document.querySelectorAll('.whack-hole').forEach(hole => {
        hole.classList.remove('active', 'hit', 'wrong');
    });

    updateDisplay();

    // Start spawning targets
    spawnTarget();

    // Increase difficulty over time
    whackGame.gameTimer = setInterval(() => {
        whackGame.difficulty = Math.min(3, whackGame.difficulty + 0.05);
    }, 5000);
}

function spawnTarget() {
    if (!whackGame.isPlaying) return;

    // Find available holes
    const holes = document.querySelectorAll('.whack-hole');
    const availableHoles = Array.from(holes).filter(
        (hole, idx) => !whackGame.activeHoles.has(idx)
    );

    if (availableHoles.length === 0) {
        // All holes are active, wait
        whackGame.spawnTimer = setTimeout(spawnTarget, 200);
        return;
    }

    // Pick random hole
    const hole = availableHoles[Math.floor(Math.random() * availableHoles.length)];
    const holeIndex = parseInt(hole.dataset.index);

    // Decide if good or bad (70% good, 30% bad)
    const isGood = Math.random() < 0.7;
    const targets = isGood ? GOOD_TARGETS : BAD_TARGETS;
    const emoji = targets[Math.floor(Math.random() * targets.length)];

    // Set target
    const target = hole.querySelector('.whack-target');
    target.textContent = emoji;
    target.dataset.isGood = isGood;

    // Activate hole
    hole.classList.add('active');
    whackGame.activeHoles.add(holeIndex);

    // Auto-hide after time
    const showDuration = 2000 / whackGame.difficulty;
    setTimeout(() => {
        if (hole.classList.contains('active') && !hole.classList.contains('hit')) {
            // Missed a good target
            if (target.dataset.isGood === 'true') {
                loseLife();
            }
            hideTarget(hole, holeIndex);
        }
    }, showDuration);

    // Schedule next spawn
    const spawnDelay = 1000 / whackGame.difficulty;
    whackGame.spawnTimer = setTimeout(spawnTarget, spawnDelay);
}

function whackTarget(hole) {
    const target = hole.querySelector('.whack-target');
    const holeIndex = parseInt(hole.dataset.index);
    const isGood = target.dataset.isGood === 'true';

    if (isGood) {
        // Hit a good target
        whackGame.score++;
        hole.classList.add('hit');
        if (window.partyAudio) window.partyAudio.playWhack();

        // Show floating score
        const rect = hole.getBoundingClientRect();
        showFloatingNumber(rect.left + rect.width / 2, rect.top, '+1', '#2ecc71');
    } else {
        // Hit a bad target
        hole.classList.add('wrong');
        if (window.partyAudio) window.partyAudio.playOops();
        loseLife();
    }

    setTimeout(() => {
        hideTarget(hole, holeIndex);
    }, 300);

    updateDisplay();
}

function hideTarget(hole, holeIndex) {
    hole.classList.remove('active', 'hit', 'wrong');
    whackGame.activeHoles.delete(holeIndex);
}

function loseLife() {
    whackGame.lives--;

    // Screen flash
    const gameArea = document.getElementById('gameArea');
    gameArea.style.boxShadow = 'inset 0 0 50px rgba(231, 76, 60, 0.5)';
    setTimeout(() => {
        gameArea.style.boxShadow = '';
    }, 200);

    updateDisplay();

    if (whackGame.lives <= 0) {
        endGame();
    }
}

function endGame() {
    whackGame.isPlaying = false;

    // Stop timers
    clearInterval(whackGame.gameTimer);
    clearTimeout(whackGame.spawnTimer);

    // Clear all holes
    document.querySelectorAll('.whack-hole').forEach(hole => {
        hole.classList.remove('active', 'hit', 'wrong');
    });

    // Update high score
    if (whackGame.score > whackGame.highScore) {
        whackGame.highScore = whackGame.score;
        localStorage.setItem('highScoreWhack', whackGame.highScore);
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
    text.innerHTML = `Score: ${whackGame.score}<br>${whackGame.score === whackGame.highScore && whackGame.score > 0 ? '🎉 New High Score!' : `High Score: ${whackGame.highScore}`}`;
    btn.textContent = 'Play Again';

    overlay.classList.remove('hidden');

    updateDisplay();
}

function updateDisplay() {
    document.getElementById('score').textContent = whackGame.score;
    document.getElementById('highScore').textContent = whackGame.highScore;

    const livesStr = '❤️'.repeat(whackGame.lives) + '🖤'.repeat(3 - whackGame.lives);
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
