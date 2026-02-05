/* ============================================
   CHAOS MODE - ULTIMATE SILLY FUN!
   ============================================ */

// Drawing State
const drawState = {
    isDrawing: false,
    color: '#e91e8c',
    size: 10,
    tool: 'brush',
    rainbowHue: 0,
    lastX: 0,
    lastY: 0
};

// Chaos State
const chaosState = {
    rainbowMode: false,
    wobbleInterval: null,
    popupInterval: null
};

// Fun Data
const CHAOS_EMOJIS = [
    '🎈', '🎉', '🎊', '🎁', '🧸', '🦄', '🐶', '🐼', '🐱', '🐰',
    '🌟', '⭐', '✨', '💖', '🍰', '🧁', '🍩', '🍭', '🌈', '🎵',
    '🦋', '🐸', '👻', '🤪', '😜', '🥳', '🤩', '💃', '🕺', '🎪',
    '🚀', '🛸', '🌮', '🍕', '🍦', '🎸', '🎺', '🥁', '🎭', '🦖'
];

const SILLY_MESSAGES = [
    "WOOHOO!", "Party time!", "You're awesome!", "YEET!", "Boing boing!",
    "Wheeeee!", "So chaotic!", "Much wow!", "Very party!", "Epic!",
    "Naavya rocks!", "Level 9 unlocked!", "Birthday vibes!", "Let's gooo!",
    "Chaos reigns!", "Pure madness!", "Wahoo!", "Bonkers!", "Wild!",
    "Fantastic!", "Amazeballs!", "Super duper!", "Wowzers!", "Yippee!"
];

const STAMP_EMOJIS = ['😜', '🤪', '😝', '🥳', '🤩', '😎', '🤓', '👻', '💀', '🎃', '🦄', '🐶', '🐼', '🦋', '🌈'];

let canvas, ctx;

document.addEventListener('DOMContentLoaded', () => {
    initChaosMode();
});

function initChaosMode() {
    initCanvas();
    initDrawingControls();
    initChaosControls();
    initBackButton();
    placeEasterEggs();
    startRandomPopups();
    spawnInitialElements();

    // Audio init
    document.addEventListener('click', function startAudio() {
        if (window.partyAudio) window.partyAudio.init();
        document.removeEventListener('click', startAudio);
    }, { once: true });

    // Animate title
    animateChaosTitle();
}

// ==========================================
// CANVAS DRAWING
// ==========================================

function initCanvas() {
    canvas = document.getElementById('chaosCanvas');
    ctx = canvas.getContext('2d');

    // Set canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Drawing events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    // Touch events
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', stopDrawing);
}

function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
}

function startDrawing(e) {
    drawState.isDrawing = true;
    const pos = getCanvasPos(e);
    drawState.lastX = pos.x;
    drawState.lastY = pos.y;

    // For single clicks, draw a dot
    if (drawState.tool === 'brush' || drawState.tool === 'spray') {
        drawDot(pos.x, pos.y);
    } else if (drawState.tool === 'stars') {
        drawStar(pos.x, pos.y);
    } else if (drawState.tool === 'emoji') {
        stampEmoji(pos.x, pos.y);
    }
}

function draw(e) {
    if (!drawState.isDrawing) return;

    const pos = getCanvasPos(e);

    if (drawState.tool === 'brush') {
        drawLine(drawState.lastX, drawState.lastY, pos.x, pos.y);
    } else if (drawState.tool === 'spray') {
        drawSpray(pos.x, pos.y);
    } else if (drawState.tool === 'stars') {
        drawStar(pos.x, pos.y);
    } else if (drawState.tool === 'emoji') {
        // Emoji stamps on mousedown only
    }

    drawState.lastX = pos.x;
    drawState.lastY = pos.y;

    // Play subtle sound occasionally
    if (Math.random() < 0.1 && window.partyAudio) {
        window.partyAudio.playChaos();
    }
}

function stopDrawing() {
    drawState.isDrawing = false;
}

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    startDrawing(mouseEvent);
}

function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    draw(mouseEvent);
}

function getCanvasPos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function getCurrentColor() {
    if (drawState.color === 'rainbow') {
        drawState.rainbowHue = (drawState.rainbowHue + 5) % 360;
        return `hsl(${drawState.rainbowHue}, 100%, 50%)`;
    }
    return drawState.color;
}

function drawDot(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, drawState.size / 2, 0, Math.PI * 2);
    ctx.fillStyle = getCurrentColor();
    ctx.fill();
}

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = getCurrentColor();
    ctx.lineWidth = drawState.size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
}

function drawSpray(x, y) {
    const density = drawState.size * 2;
    for (let i = 0; i < density; i++) {
        const offsetX = (Math.random() - 0.5) * drawState.size * 2;
        const offsetY = (Math.random() - 0.5) * drawState.size * 2;
        const radius = Math.random() * 2;
        ctx.beginPath();
        ctx.arc(x + offsetX, y + offsetY, radius, 0, Math.PI * 2);
        ctx.fillStyle = getCurrentColor();
        ctx.fill();
    }
}

function drawStar(x, y) {
    const color = getCurrentColor();
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.random() * Math.PI * 2);

    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const radius = drawState.size;
        if (i === 0) {
            ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        } else {
            ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        }
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}

function stampEmoji(x, y) {
    const emoji = STAMP_EMOJIS[Math.floor(Math.random() * STAMP_EMOJIS.length)];
    ctx.font = `${drawState.size * 3}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, x, y);

    if (window.partyAudio) window.partyAudio.playPop();
}

// ==========================================
// DRAWING CONTROLS
// ==========================================

function initDrawingControls() {
    // Color buttons
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            drawState.color = btn.dataset.color;
            if (window.partyAudio) window.partyAudio.playClick();
        });
    });

    // Size slider
    const sizeSlider = document.getElementById('brushSize');
    const sizeValue = document.getElementById('sizeValue');
    sizeSlider.addEventListener('input', () => {
        drawState.size = parseInt(sizeSlider.value);
        sizeValue.textContent = drawState.size;
    });

    // Tool buttons
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            drawState.tool = btn.dataset.tool;
            if (window.partyAudio) window.partyAudio.playClick();
        });
    });
}

// ==========================================
// CHAOS CONTROLS
// ==========================================

function initChaosControls() {
    // Spawn stuff
    document.getElementById('btnSpawn').addEventListener('click', () => {
        if (window.partyAudio) window.partyAudio.playSparkle();
        for (let i = 0; i < 15; i++) {
            setTimeout(() => spawnChaosElement(), i * 50);
        }
    });

    // Explosion
    document.getElementById('btnExplode').addEventListener('click', () => {
        if (window.partyAudio) window.partyAudio.playPop();
        createExplosion();
    });

    // Rainbow mode
    document.getElementById('btnRainbow').addEventListener('click', () => {
        chaosState.rainbowMode = !chaosState.rainbowMode;
        document.body.classList.toggle('rainbow-mode', chaosState.rainbowMode);
        if (window.partyAudio) window.partyAudio.playSparkle();
    });

    // Confetti
    document.getElementById('btnConfetti').addEventListener('click', () => {
        if (window.partyAudio) window.partyAudio.playSuccess();
        if (window.confetti) window.confetti.rain(3000);
    });

    // Wobble
    document.getElementById('btnWobble').addEventListener('click', () => {
        if (window.partyAudio) window.partyAudio.playWhoosh();
        document.body.classList.add('screen-wobble');
        setTimeout(() => document.body.classList.remove('screen-wobble'), 500);

        // Wobble all elements
        document.querySelectorAll('.chaos-element').forEach(el => {
            el.classList.add('wobble');
            setTimeout(() => el.classList.remove('wobble'), 500);
        });
    });

    // Silly sounds
    document.getElementById('btnSound').addEventListener('click', () => {
        if (window.partyAudio) {
            const sounds = ['playChaos', 'playGiggle', 'playPop', 'playSparkle', 'playWhoosh'];
            for (let i = 0; i < 8; i++) {
                setTimeout(() => {
                    const sound = sounds[Math.floor(Math.random() * sounds.length)];
                    window.partyAudio[sound]();
                }, i * 100);
            }
        }
    });

    // Clear
    document.getElementById('btnClear').addEventListener('click', () => {
        if (window.partyAudio) window.partyAudio.playWhoosh();

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Remove chaos elements with animation
        const elements = document.querySelectorAll('.chaos-element');
        elements.forEach((el, i) => {
            setTimeout(() => {
                el.style.transform = 'scale(0) rotate(360deg)';
                el.style.opacity = '0';
                setTimeout(() => el.remove(), 300);
            }, i * 20);
        });

        // Clear popups
        document.getElementById('randomPopups').innerHTML = '';
    });
}

// ==========================================
// CHAOS ELEMENTS
// ==========================================

function spawnChaosElement() {
    const container = document.getElementById('chaosElements');
    const element = document.createElement('div');
    element.className = 'chaos-element';
    element.textContent = CHAOS_EMOJIS[Math.floor(Math.random() * CHAOS_EMOJIS.length)];

    // Random position
    element.style.left = (5 + Math.random() * 85) + '%';
    element.style.top = (5 + Math.random() * 85) + '%';
    element.style.fontSize = (2 + Math.random() * 3) + 'rem';
    element.style.animationDelay = Math.random() * 2 + 's';
    element.style.animationDuration = (1.5 + Math.random() * 2) + 's';

    // Click to interact
    element.addEventListener('click', (e) => {
        e.stopPropagation();
        chaosElementClick(element);
    });

    container.appendChild(element);

    // Limit total elements
    const allElements = container.querySelectorAll('.chaos-element');
    if (allElements.length > 50) {
        allElements[0].remove();
    }
}

function chaosElementClick(element) {
    // Random reaction
    const reactions = [
        () => {
            // Transform into different emoji
            element.textContent = CHAOS_EMOJIS[Math.floor(Math.random() * CHAOS_EMOJIS.length)];
            element.style.transform = 'scale(1.5) rotate(360deg)';
            setTimeout(() => element.style.transform = '', 300);
        },
        () => {
            // Explode into confetti
            const rect = element.getBoundingClientRect();
            if (window.confetti) window.confetti.burst(rect.left + rect.width/2, rect.top + rect.height/2, 10);
            element.remove();
        },
        () => {
            // Multiply!
            for (let i = 0; i < 3; i++) {
                setTimeout(() => spawnChaosElement(), i * 100);
            }
        },
        () => {
            // Fly away
            element.classList.add('flying-emoji');
            setTimeout(() => element.remove(), 2000);
        },
        () => {
            // Grow big then pop
            element.style.transition = 'transform 0.3s ease';
            element.style.transform = 'scale(3)';
            setTimeout(() => {
                if (window.partyAudio) window.partyAudio.playPop();
                element.remove();
            }, 300);
        }
    ];

    if (window.partyAudio) window.partyAudio.playChaos();
    reactions[Math.floor(Math.random() * reactions.length)]();
}

function spawnInitialElements() {
    for (let i = 0; i < 12; i++) {
        setTimeout(() => spawnChaosElement(), i * 100);
    }
}

// ==========================================
// RANDOM POPUPS
// ==========================================

function startRandomPopups() {
    chaosState.popupInterval = setInterval(() => {
        if (Math.random() < 0.3) {
            createRandomPopup();
        }
    }, 3000);
}

function createRandomPopup() {
    const container = document.getElementById('randomPopups');
    const popup = document.createElement('div');
    popup.className = 'popup-message';
    popup.textContent = SILLY_MESSAGES[Math.floor(Math.random() * SILLY_MESSAGES.length)];

    // Random position
    popup.style.left = (10 + Math.random() * 60) + '%';
    popup.style.top = (10 + Math.random() * 60) + '%';

    // Random rotation
    popup.style.transform = `rotate(${(Math.random() - 0.5) * 20}deg)`;

    // Click to dismiss
    popup.addEventListener('click', () => {
        if (window.partyAudio) window.partyAudio.playPop();
        popup.style.transform = 'scale(0)';
        setTimeout(() => popup.remove(), 300);
    });

    container.appendChild(popup);

    // Auto-remove after some time
    setTimeout(() => {
        if (popup.parentElement) {
            popup.style.opacity = '0';
            popup.style.transform = 'scale(0)';
            setTimeout(() => popup.remove(), 300);
        }
    }, 5000 + Math.random() * 3000);

    // Limit popups
    const allPopups = container.querySelectorAll('.popup-message');
    if (allPopups.length > 5) {
        allPopups[0].remove();
    }
}

// ==========================================
// EXPLOSION EFFECT
// ==========================================

function createExplosion() {
    const container = document.getElementById('chaosElements');

    // Center explosion
    const explosion = document.createElement('div');
    explosion.className = 'explosion';
    explosion.textContent = '💥';
    explosion.style.left = '50%';
    explosion.style.top = '50%';
    explosion.style.transform = 'translate(-50%, -50%)';
    container.appendChild(explosion);

    setTimeout(() => explosion.remove(), 500);

    // Spawn flying emojis in all directions
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const emoji = document.createElement('div');
            emoji.className = 'chaos-element';
            emoji.textContent = CHAOS_EMOJIS[Math.floor(Math.random() * CHAOS_EMOJIS.length)];
            emoji.style.left = '50%';
            emoji.style.top = '50%';
            emoji.style.fontSize = '2rem';

            const angle = (i / 20) * Math.PI * 2;
            const distance = 150 + Math.random() * 100;
            const endX = 50 + Math.cos(angle) * distance / 5;
            const endY = 50 + Math.sin(angle) * distance / 5;

            emoji.style.transition = 'all 0.5s ease-out';
            container.appendChild(emoji);

            requestAnimationFrame(() => {
                emoji.style.left = endX + '%';
                emoji.style.top = endY + '%';
                emoji.style.transform = `rotate(${Math.random() * 720}deg)`;
            });
        }, i * 30);
    }

    // Screen shake
    document.body.classList.add('screen-wobble');
    setTimeout(() => document.body.classList.remove('screen-wobble'), 500);
}

// ==========================================
// TITLE ANIMATION
// ==========================================

function animateChaosTitle() {
    const title = document.getElementById('chaosTitle');
    if (!title) return;

    const colors = ['#e91e8c', '#9b59b6', '#3498db', '#2ecc71', '#f39c12', '#e74c3c'];
    let colorIndex = 0;

    setInterval(() => {
        title.style.color = colors[colorIndex];
        title.style.textShadow = `3px 3px 0 ${colors[(colorIndex + 2) % colors.length]}, -2px -2px 0 ${colors[(colorIndex + 4) % colors.length]}`;
        colorIndex = (colorIndex + 1) % colors.length;
    }, 300);
}

// ==========================================
// EASTER EGGS & BACK BUTTON
// ==========================================

function placeEasterEggs() {
    if (window.easterEggs) {
        window.easterEggs.createEgg('chaos-1', '8%', '25%');
        window.easterEggs.createEgg('chaos-2', '88%', '75%');
    }
}

function initBackButton() {
    const backBtn = document.getElementById('backBtn');
    backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.partyAudio) window.partyAudio.playClick();

        // Cleanup
        clearInterval(chaosState.popupInterval);
        document.body.classList.remove('rainbow-mode');

        window.location.href = 'hub.html';
    });
}
