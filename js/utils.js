/* ============================================
   PARTY POWER - UTILITIES
   ============================================ */

// ==========================================
// SPARKLE TRAIL SYSTEM
// ==========================================

class SparkleTrail {
    constructor() {
        this.container = null;
        this.enabled = true;
        this.lastSparkle = 0;
        this.throttle = 50; // ms between sparkles
    }

    init() {
        this.container = document.createElement('div');
        this.container.className = 'sparkle-container';
        document.body.appendChild(this.container);

        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('touchmove', (e) => this.onTouchMove(e));
    }

    onMouseMove(e) {
        if (!this.enabled) return;
        const now = Date.now();
        if (now - this.lastSparkle < this.throttle) return;
        this.lastSparkle = now;
        this.createSparkle(e.clientX, e.clientY);
    }

    onTouchMove(e) {
        if (!this.enabled) return;
        const now = Date.now();
        if (now - this.lastSparkle < this.throttle) return;
        this.lastSparkle = now;
        const touch = e.touches[0];
        this.createSparkle(touch.clientX, touch.clientY);
    }

    createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';

        // Random offset
        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = (Math.random() - 0.5) * 20;

        sparkle.style.left = (x + offsetX) + 'px';
        sparkle.style.top = (y + offsetY) + 'px';

        // Random color variation
        const colors = ['#ffeaa7', '#fff', '#fdcb6e', '#f8b4d9', '#81ecec'];
        sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];

        // Random size
        const size = 5 + Math.random() * 10;
        sparkle.style.width = size + 'px';
        sparkle.style.height = size + 'px';

        this.container.appendChild(sparkle);

        // Remove after animation
        setTimeout(() => sparkle.remove(), 600);
    }
}

// ==========================================
// CONFETTI SYSTEM
// ==========================================

class ConfettiSystem {
    constructor() {
        this.colors = ['#e91e8c', '#9b59b6', '#3498db', '#ffeaa7', '#81ecec', '#f39c12', '#e74c3c', '#2ecc71'];
    }

    burst(x, y, count = 30) {
        for (let i = 0; i < count; i++) {
            this.createPiece(x, y);
        }
        if (window.partyAudio && window.partyAudio.initialized) {
            window.partyAudio.playSparkle();
        }
    }

    rain(duration = 3000) {
        const interval = setInterval(() => {
            const x = Math.random() * window.innerWidth;
            this.createPiece(x, -10);
        }, 50);

        setTimeout(() => clearInterval(interval), duration);
    }

    createPiece(x, y) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';

        // Random properties
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        const size = 8 + Math.random() * 8;
        const shape = Math.random() > 0.5 ? '50%' : '0';

        confetti.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: ${shape};
            animation-duration: ${2 + Math.random() * 2}s;
            transform: rotate(${Math.random() * 360}deg);
        `;

        // Add horizontal drift
        const drift = (Math.random() - 0.5) * 200;
        confetti.animate([
            { transform: `translateY(0) translateX(0) rotate(0deg)` },
            { transform: `translateY(100vh) translateX(${drift}px) rotate(${720 + Math.random() * 360}deg)` }
        ], {
            duration: 2000 + Math.random() * 2000,
            easing: 'ease-out'
        });

        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 4000);
    }

    wipeTransition(callback) {
        // Create transition overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
            z-index: 99999;
            transform: translateY(100%);
            transition: transform 0.5s ease-in-out;
        `;
        document.body.appendChild(overlay);

        // Burst confetti
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.createPiece(Math.random() * window.innerWidth, window.innerHeight);
            }, i * 20);
        }

        // Animate overlay
        requestAnimationFrame(() => {
            overlay.style.transform = 'translateY(0)';
        });

        setTimeout(() => {
            if (callback) callback();
        }, 500);
    }
}

// ==========================================
// FLOATING NUMBER SYSTEM
// ==========================================

function showFloatingNumber(x, y, text, color = '#ffeaa7') {
    const num = document.createElement('div');
    num.className = 'floating-number';
    num.textContent = text;
    num.style.left = x + 'px';
    num.style.top = y + 'px';
    num.style.color = color;

    document.body.appendChild(num);
    setTimeout(() => num.remove(), 1000);
}

// ==========================================
// TOAST NOTIFICATION
// ==========================================

function showToast(message, duration = 3000) {
    // Remove existing toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ==========================================
// SCREEN GLOW EFFECT
// ==========================================

function triggerScreenGlow() {
    let glow = document.querySelector('.screen-glow');
    if (!glow) {
        glow = document.createElement('div');
        glow.className = 'screen-glow';
        document.body.appendChild(glow);
    }
    glow.classList.add('active');
    setTimeout(() => glow.classList.remove('active'), 1000);
}

// ==========================================
// PRESS AND HOLD DETECTION
// ==========================================

class PressAndHold {
    constructor(element, duration = 2000, callback) {
        this.element = element;
        this.duration = duration;
        this.callback = callback;
        this.timer = null;
        this.progress = 0;

        this.init();
    }

    init() {
        const start = (e) => {
            if (e.target.closest('button, a, .interactive')) return;
            this.startHold();
        };

        const end = () => this.endHold();

        this.element.addEventListener('mousedown', start);
        this.element.addEventListener('touchstart', start);
        this.element.addEventListener('mouseup', end);
        this.element.addEventListener('mouseleave', end);
        this.element.addEventListener('touchend', end);
    }

    startHold() {
        this.progress = 0;
        this.timer = setInterval(() => {
            this.progress += 50;
            if (this.progress >= this.duration) {
                this.endHold();
                this.callback();
            }
        }, 50);
    }

    endHold() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.progress = 0;
    }
}

// ==========================================
// MODAL SYSTEM
// ==========================================

function showModal(title, message, buttons = []) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'modal';

    modal.innerHTML = `
        <h2>${title}</h2>
        <p>${message}</p>
        <div class="modal-buttons"></div>
    `;

    const btnContainer = modal.querySelector('.modal-buttons');
    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.className = `btn ${btn.primary ? 'btn-primary' : 'btn-secondary'}`;
        button.textContent = btn.text;
        button.addEventListener('click', () => {
            if (window.partyAudio) window.partyAudio.playClick();
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 300);
            if (btn.onClick) btn.onClick();
        });
        btnContainer.appendChild(button);
    });

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => overlay.classList.add('active'));

    return overlay;
}

// ==========================================
// GLOBAL RESET SYSTEM
// ==========================================

function createResetButton() {
    const btn = document.createElement('button');
    btn.className = 'reset-btn';
    btn.innerHTML = '🎁';
    btn.setAttribute('aria-label', 'Reset all progress');

    btn.addEventListener('click', () => {
        if (window.partyAudio) window.partyAudio.playClick();
        showResetConfirmation();
    });

    document.body.appendChild(btn);
}

function showResetConfirmation() {
    showModal(
        '🎁 Reset Everything?',
        'This will reset all your progress, scores, and collected eggs. Are you sure?',
        [
            {
                text: 'Cancel',
                primary: false
            },
            {
                text: 'Yes, Reset',
                primary: true,
                onClick: () => {
                    showModal(
                        '⚠️ Really Reset?',
                        'This cannot be undone! All progress will be lost forever.',
                        [
                            {
                                text: 'Never mind',
                                primary: false
                            },
                            {
                                text: 'Reset Everything',
                                primary: true,
                                onClick: performGlobalReset
                            }
                        ]
                    );
                }
            }
        ]
    );
}

function performGlobalReset() {
    // Clear all localStorage keys related to the game
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
            key.startsWith('party') ||
            key.startsWith('clicker') ||
            key.startsWith('eggs') ||
            key.startsWith('highScore') ||
            key.startsWith('theme')
        )) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));

    showToast('All progress has been reset! 🎉');
    if (window.partyAudio) window.partyAudio.playLevelUp();

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// ==========================================
// EASTER EGG SYSTEM
// ==========================================

class EasterEggSystem {
    constructor() {
        this.eggs = this.loadEggs();
        this.totalEggs = 15; // Total eggs across all pages
    }

    loadEggs() {
        const saved = localStorage.getItem('eggsFound');
        return saved ? JSON.parse(saved) : [];
    }

    saveEggs() {
        localStorage.setItem('eggsFound', JSON.stringify(this.eggs));
    }

    isFound(eggId) {
        return this.eggs.includes(eggId);
    }

    findEgg(eggId) {
        if (this.isFound(eggId)) return false;

        this.eggs.push(eggId);
        this.saveEggs();

        if (window.partyAudio) window.partyAudio.playEggFound();
        showToast(`🥚 Egg found! (${this.eggs.length}/${this.totalEggs})`);

        if (this.eggs.length === this.totalEggs) {
            this.celebrateCompletion();
        }

        return true;
    }

    celebrateCompletion() {
        setTimeout(() => {
            if (window.partyAudio) window.partyAudio.playLevelUp();
            window.confetti.rain(5000);
            showToast('🎉 ALL EGGS FOUND! You are an Egg Master! 🎉', 5000);
        }, 1000);
    }

    getProgress() {
        return { found: this.eggs.length, total: this.totalEggs };
    }

    createEgg(id, x, y, parent = document.body) {
        const egg = document.createElement('div');
        egg.className = 'easter-egg';
        egg.innerHTML = '🥚';
        egg.style.left = x;
        egg.style.top = y;

        if (this.isFound(id)) {
            egg.classList.add('found');
            egg.innerHTML = '✨';
        }

        egg.addEventListener('click', () => {
            if (!this.isFound(id)) {
                this.findEgg(id);
                egg.classList.add('found');
                egg.innerHTML = '✨';
            }
        });

        parent.appendChild(egg);
        return egg;
    }
}

// ==========================================
// PERFORMANCE CHECK
// ==========================================

function checkPerformance() {
    // Simple FPS counter
    let lastTime = performance.now();
    let frames = 0;
    let fps = 60;

    function checkFrame() {
        frames++;
        const now = performance.now();
        if (now - lastTime >= 1000) {
            fps = frames;
            frames = 0;
            lastTime = now;

            // If FPS drops below 30, reduce effects
            if (fps < 30) {
                document.body.classList.add('reduced-motion');
            } else {
                document.body.classList.remove('reduced-motion');
            }
        }
        requestAnimationFrame(checkFrame);
    }

    requestAnimationFrame(checkFrame);
}

// ==========================================
// FORMAT NUMBERS
// ==========================================

function formatNumber(num) {
    if (num >= 1e21) return (num / 1e21).toFixed(2) + 'Sx';  // Sextillion
    if (num >= 1e18) return (num / 1e18).toFixed(2) + 'Qi';  // Quintillion
    if (num >= 1e15) return (num / 1e15).toFixed(2) + 'Qa';  // Quadrillion
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';   // Trillion
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';     // Billion
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';     // Million
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';     // Thousand
    return Math.floor(num).toString();
}

// ==========================================
// INITIALIZE GLOBAL SYSTEMS
// ==========================================

window.sparkleTrail = new SparkleTrail();
window.confetti = new ConfettiSystem();
window.easterEggs = new EasterEggSystem();

document.addEventListener('DOMContentLoaded', () => {
    window.sparkleTrail.init();
    createAudioControl();
    createResetButton();
    checkPerformance();
    initSecretEggs();
});

// ==========================================
// SECRET EASTER EGG TRIGGERS
// ==========================================

function initSecretEggs() {
    // SECRET-1: Hold down anywhere for 3 seconds
    let holdTimer = null;
    const holdDuration = 3000;

    const startHold = () => {
        if (window.easterEggs && window.easterEggs.isFound('secret-1')) return;
        holdTimer = setTimeout(() => {
            if (window.easterEggs) {
                window.easterEggs.findEgg('secret-1');
                if (window.confetti) window.confetti.rain(2000);
            }
        }, holdDuration);
    };

    const cancelHold = () => {
        if (holdTimer) {
            clearTimeout(holdTimer);
            holdTimer = null;
        }
    };

    document.addEventListener('mousedown', startHold);
    document.addEventListener('mouseup', cancelHold);
    document.addEventListener('mouseleave', cancelHold);
    document.addEventListener('touchstart', startHold);
    document.addEventListener('touchend', cancelHold);

    // SECRET-2: Pop 5 balloons in a row
    initBalloonPops();

    // SECRET-3: Reach 1000 Party Power (checked via polling)
    setInterval(() => {
        if (window.easterEggs && !window.easterEggs.isFound('secret-3')) {
            const saved = localStorage.getItem('clickerSave');
            if (saved) {
                try {
                    const data = JSON.parse(saved);
                    if (data.totalEarned >= 1000) {
                        window.easterEggs.findEgg('secret-3');
                    }
                } catch(e) {}
            }
        }
    }, 2000);
}

function initBalloonPops() {
    if (window.easterEggs && window.easterEggs.isFound('secret-2')) return;

    let popsInARow = 0;
    let lastPopTime = 0;
    const balloonColors = ['🎈', '🩷', '🩵', '💜', '💛'];

    function spawnBalloon() {
        if (window.easterEggs && window.easterEggs.isFound('secret-2')) return;

        const balloon = document.createElement('div');
        balloon.className = 'pop-balloon';
        balloon.textContent = balloonColors[Math.floor(Math.random() * balloonColors.length)];
        balloon.style.left = (10 + Math.random() * 80) + '%';
        balloon.style.bottom = '-50px';
        balloon.style.position = 'fixed';
        balloon.style.fontSize = '2.5rem';
        balloon.style.cursor = 'pointer';
        balloon.style.zIndex = '999';
        balloon.style.transition = 'transform 0.15s ease';
        balloon.style.animation = 'balloon-rise ' + (4 + Math.random() * 3) + 's linear forwards';
        balloon.style.pointerEvents = 'auto';

        balloon.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();

            const now = Date.now();
            if (now - lastPopTime < 5000) {
                popsInARow++;
            } else {
                popsInARow = 1;
            }
            lastPopTime = now;

            // Pop effect
            balloon.style.transform = 'scale(1.5)';
            balloon.style.opacity = '0';
            if (window.partyAudio) window.partyAudio.playPop();

            // Show pop count
            showToast(`🎈 Pop! (${popsInARow}/5)`);

            setTimeout(() => balloon.remove(), 200);

            if (popsInARow >= 5 && window.easterEggs) {
                window.easterEggs.findEgg('secret-2');
                if (window.confetti) window.confetti.rain(2000);
            }
        });

        document.body.appendChild(balloon);

        // Remove after animation ends
        setTimeout(() => {
            if (balloon.parentElement) balloon.remove();
        }, 8000);
    }

    // Spawn balloons periodically
    setInterval(() => {
        if (window.easterEggs && window.easterEggs.isFound('secret-2')) return;
        if (Math.random() < 0.4) spawnBalloon();
    }, 5000);

    // Spawn first one after a short delay
    setTimeout(spawnBalloon, 3000);
}
