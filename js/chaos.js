/* ============================================
   CHAOS MODE - PURE SILLY FUN!
   ============================================ */

const CHAOS_EMOJIS = [
    '🎈', '🎉', '🎊', '🎁', '🧸', '🦄', '🐶', '🐼', '🐱', '🐰',
    '🌟', '⭐', '✨', '💖', '🍰', '🧁', '🍩', '🍭', '🌈', '🎵',
    '🎶', '🔮', '🎪', '🎠', '🎡', '🎢', '🏰', '👑', '💎', '🦋'
];

const GOOFY_SOUNDS = ['pop', 'sparkle', 'giggle', 'whoosh', 'coin'];

let chaosInterval = null;
let rainbowMode = false;

document.addEventListener('DOMContentLoaded', () => {
    initChaosMode();
});

function initChaosMode() {
    initControls();
    initBackButton();
    startChaos();
    placeEasterEggs();

    // Auto-spawn elements
    for (let i = 0; i < 15; i++) {
        spawnChaosElement();
    }

    // Audio init
    document.addEventListener('click', function startAudio() {
        if (window.partyAudio) window.partyAudio.init();
        document.removeEventListener('click', startAudio);
    }, { once: true });

    // Chaos title animation
    animateChaosTitle();
}

function startChaos() {
    // Continuously spawn new elements
    chaosInterval = setInterval(() => {
        if (document.querySelectorAll('.chaos-element').length < 30) {
            spawnChaosElement();
        }
    }, 2000);
}

function spawnChaosElement() {
    const area = document.getElementById('chaosArea');
    if (!area) return;

    const element = document.createElement('div');
    element.className = 'chaos-element';
    element.textContent = CHAOS_EMOJIS[Math.floor(Math.random() * CHAOS_EMOJIS.length)];

    // Random position
    element.style.left = (5 + Math.random() * 85) + '%';
    element.style.top = (5 + Math.random() * 85) + '%';

    // Random animation delay and speed
    element.style.animationDelay = Math.random() * 2 + 's';
    element.style.animationDuration = (1 + Math.random() * 3) + 's';

    // Random rotation
    element.style.transform = `rotate(${Math.random() * 360}deg)`;

    // Random size
    element.style.fontSize = (2 + Math.random() * 3) + 'rem';

    // Click interaction
    element.addEventListener('click', () => {
        chaosClick(element);
    });

    area.appendChild(element);
}

function chaosClick(element) {
    // Play random sound
    if (window.partyAudio) {
        const sound = GOOFY_SOUNDS[Math.floor(Math.random() * GOOFY_SOUNDS.length)];
        switch (sound) {
            case 'pop': window.partyAudio.playPop(); break;
            case 'sparkle': window.partyAudio.playSparkle(); break;
            case 'giggle': window.partyAudio.playGiggle(); break;
            case 'whoosh': window.partyAudio.playWhoosh(); break;
            case 'coin': window.partyAudio.playCoin(); break;
        }
    }

    // Visual effect
    const rect = element.getBoundingClientRect();
    if (window.confetti) {
        window.confetti.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 10);
    }

    // Transform into different emoji
    element.textContent = CHAOS_EMOJIS[Math.floor(Math.random() * CHAOS_EMOJIS.length)];

    // Random movement
    element.style.left = (5 + Math.random() * 85) + '%';
    element.style.top = (5 + Math.random() * 85) + '%';

    // Pop animation
    element.style.transform = 'scale(1.5)';
    setTimeout(() => {
        element.style.transform = `scale(1) rotate(${Math.random() * 360}deg)`;
    }, 200);
}

function initControls() {
    // Spawn more
    document.getElementById('btnSpawn').addEventListener('click', () => {
        if (window.partyAudio) window.partyAudio.playClick();
        for (let i = 0; i < 10; i++) {
            setTimeout(() => spawnChaosElement(), i * 50);
        }
    });

    // Rainbow mode
    document.getElementById('btnRainbow').addEventListener('click', () => {
        if (window.partyAudio) window.partyAudio.playSparkle();
        rainbowMode = !rainbowMode;
        if (rainbowMode) {
            document.body.classList.add('chaos-mode');
        } else {
            document.body.classList.remove('chaos-mode');
        }
    });

    // Confetti explosion
    document.getElementById('btnConfetti').addEventListener('click', () => {
        if (window.partyAudio) window.partyAudio.playSuccess();
        if (window.confetti) {
            window.confetti.rain(2000);
        }
    });

    // Sound burst
    document.getElementById('btnSound').addEventListener('click', () => {
        if (window.partyAudio) {
            // Play multiple sounds
            window.partyAudio.playChaos();
            setTimeout(() => window.partyAudio.playChaos(), 100);
            setTimeout(() => window.partyAudio.playChaos(), 200);
            setTimeout(() => window.partyAudio.playChaos(), 300);
            setTimeout(() => window.partyAudio.playChaos(), 400);
        }
    });

    // Clear all
    document.getElementById('btnClear').addEventListener('click', () => {
        if (window.partyAudio) window.partyAudio.playWhoosh();
        const elements = document.querySelectorAll('.chaos-element');
        elements.forEach((el, i) => {
            setTimeout(() => {
                el.style.transform = 'scale(0)';
                setTimeout(() => el.remove(), 300);
            }, i * 30);
        });
    });
}

function animateChaosTitle() {
    const title = document.getElementById('chaosTitle');
    if (!title) return;

    const colors = ['#e91e8c', '#9b59b6', '#3498db', '#2ecc71', '#f39c12', '#e74c3c'];
    let colorIndex = 0;

    setInterval(() => {
        title.style.color = colors[colorIndex];
        title.style.textShadow = `3px 3px 0 ${colors[(colorIndex + 1) % colors.length]}`;
        colorIndex = (colorIndex + 1) % colors.length;
    }, 500);
}

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

        // Stop chaos
        if (chaosInterval) clearInterval(chaosInterval);
        document.body.classList.remove('chaos-mode');

        window.location.href = 'hub.html';
    });
}

// Make chaos area clickable to spawn
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('chaos-area')) {
        spawnChaosElement();
        if (window.partyAudio) window.partyAudio.playChaos();
    }
});
