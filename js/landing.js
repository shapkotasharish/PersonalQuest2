/* ============================================
   LANDING PAGE JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Hide loading screen after content loads
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => loadingScreen.remove(), 500);
        }
        initLandingPage();
    }, 800);
});

function initLandingPage() {
    initBalloons();
    initPeekCharacters();
    initPlayButton();
    initPressAndHold();
    initEasterEggs();

    // Start background music after first interaction
    document.addEventListener('click', function startMusic() {
        if (window.partyAudio) {
            window.partyAudio.init();
            window.partyAudio.startBgMusic('landing');
        }
        document.removeEventListener('click', startMusic);
    }, { once: true });
}

// ==========================================
// BALLOONS
// ==========================================

function initBalloons() {
    const container = document.getElementById('balloonsContainer');
    if (!container) return;

    const balloonEmojis = ['🎈', '🎈', '🎈', '🎈', '🎈', '🎈'];
    const balloonColors = ['#e91e8c', '#9b59b6', '#3498db', '#e74c3c', '#f39c12', '#2ecc71'];

    // Create initial balloons
    for (let i = 0; i < 8; i++) {
        createBalloon(container, balloonEmojis, balloonColors);
    }
}

function createBalloon(container, emojis, colors) {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];

    // Random position
    balloon.style.left = (10 + Math.random() * 80) + '%';
    balloon.style.top = (60 + Math.random() * 30) + '%';

    // Random animation delay and duration
    balloon.style.animationDelay = Math.random() * 2 + 's';
    balloon.style.animationDuration = (3 + Math.random() * 3) + 's';

    // Color filter
    const color = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.filter = `drop-shadow(2px 4px 6px rgba(0,0,0,0.2)) hue-rotate(${Math.random() * 360}deg)`;

    // Click to pop
    balloon.addEventListener('click', (e) => {
        e.stopPropagation();
        popBalloon(balloon, container, emojis, colors);
    });

    // Hover sound
    balloon.addEventListener('mouseenter', () => {
        if (window.partyAudio) window.partyAudio.playHover();
    });

    container.appendChild(balloon);

    // Float up animation
    animateBalloonFloat(balloon);
}

function animateBalloonFloat(balloon) {
    const startY = parseFloat(balloon.style.top);
    let y = startY;
    const speed = 0.02 + Math.random() * 0.03;

    function float() {
        if (!balloon.parentElement) return;

        y -= speed;
        if (y < -10) {
            y = 110;
            balloon.style.left = (10 + Math.random() * 80) + '%';
        }
        balloon.style.top = y + '%';
        requestAnimationFrame(float);
    }

    requestAnimationFrame(float);
}

function popBalloon(balloon, container, emojis, colors) {
    // Play pop sound
    if (window.partyAudio) window.partyAudio.playPop();

    // Add popping animation
    balloon.classList.add('popping');

    // Create confetti burst
    const rect = balloon.getBoundingClientRect();
    if (window.confetti) {
        window.confetti.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 15);
    }

    // Remove balloon and respawn
    setTimeout(() => {
        balloon.remove();

        // Respawn after delay
        setTimeout(() => {
            createBalloon(container, emojis, colors);
        }, 2000 + Math.random() * 3000);
    }, 300);
}

// ==========================================
// PEEK-A-BOO CHARACTERS
// ==========================================

function initPeekCharacters() {
    const container = document.getElementById('peekCharacters');
    if (!container) return;

    const characters = [
        { emoji: '🐶', side: 'left', top: '30%' },
        { emoji: '🐼', side: 'right', top: '40%' },
        { emoji: '🐶', side: 'left', top: '60%' },
        { emoji: '🐼', side: 'right', top: '70%' }
    ];

    characters.forEach((char, index) => {
        createPeekCharacter(container, char, index);
    });
}

function createPeekCharacter(container, config, index) {
    const character = document.createElement('div');
    character.className = `peek-character ${config.side}`;
    character.innerHTML = config.emoji;
    character.style.top = config.top;

    // Initial peek position
    const peekAmount = 30;
    if (config.side === 'left') {
        character.style.left = `-${peekAmount}px`;
    } else {
        character.style.right = `-${peekAmount}px`;
    }

    // Peek in animation
    setTimeout(() => {
        if (config.side === 'left') {
            character.style.left = '-10px';
        } else {
            character.style.right = '-10px';
        }
    }, 500 + index * 300);

    // Hover - wave animation
    character.addEventListener('mouseenter', () => {
        if (window.partyAudio) window.partyAudio.playHover();
    });

    // Click - giggle and hide
    character.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.partyAudio) window.partyAudio.playGiggle();

        // Hide animation
        character.classList.add('hiding');

        // Respawn after delay
        setTimeout(() => {
            character.classList.remove('hiding');
            if (config.side === 'left') {
                character.style.left = '-10px';
            } else {
                character.style.right = '-10px';
            }
        }, 3000 + Math.random() * 2000);
    });

    container.appendChild(character);
}

// ==========================================
// PLAY BUTTON
// ==========================================

function initPlayButton() {
    const playBtn = document.getElementById('playBtn');
    if (!playBtn) return;

    // Hover effect
    playBtn.addEventListener('mouseenter', () => {
        if (window.partyAudio) {
            window.partyAudio.init();
            window.partyAudio.playWhoosh();
        }
    });

    // Click - transition to game hub
    playBtn.addEventListener('click', () => {
        if (window.partyAudio) {
            window.partyAudio.playClick();
            window.partyAudio.stopBgMusic();
        }

        // Confetti wipe transition
        if (window.confetti) {
            window.confetti.wipeTransition(() => {
                window.location.href = 'hub.html';
            });
        } else {
            window.location.href = 'hub.html';
        }
    });
}

// ==========================================
// PRESS AND HOLD INTERACTION
// ==========================================

function initPressAndHold() {
    const landingPage = document.querySelector('.landing-page');
    if (!landingPage) return;

    // Create hold progress indicator
    const progressIndicator = document.createElement('div');
    progressIndicator.className = 'hold-progress';
    progressIndicator.innerHTML = '<div class="hold-progress-fill"></div>';
    document.body.appendChild(progressIndicator);

    let holdTimer = null;
    let holdStart = 0;
    const holdDuration = 2000;

    function startHold(e) {
        // Don't trigger on interactive elements
        if (e.target.closest('button, a, .balloon, .peek-character, .easter-egg')) return;

        holdStart = Date.now();
        progressIndicator.classList.add('active');

        holdTimer = setTimeout(() => {
            triggerMagicMoment();
            progressIndicator.classList.remove('active');
        }, holdDuration);
    }

    function endHold() {
        if (holdTimer) {
            clearTimeout(holdTimer);
            holdTimer = null;
        }
        progressIndicator.classList.remove('active');
    }

    landingPage.addEventListener('mousedown', startHold);
    landingPage.addEventListener('touchstart', startHold);
    landingPage.addEventListener('mouseup', endHold);
    landingPage.addEventListener('mouseleave', endHold);
    landingPage.addEventListener('touchend', endHold);
}

function triggerMagicMoment() {
    // Screen glow
    triggerScreenGlow();

    // Magical chime sound
    if (window.partyAudio) {
        window.partyAudio.playMagicalChime();
    }

    // Confetti rain
    if (window.confetti) {
        window.confetti.rain(3000);
    }

    // Show toast
    showToast('✨ Magic! ✨');
}

// ==========================================
// EASTER EGGS
// ==========================================

function initEasterEggs() {
    // Hidden egg in corner
    if (window.easterEggs) {
        window.easterEggs.createEgg('landing-1', '5%', '85%');
        window.easterEggs.createEgg('landing-2', '92%', '10%');
    }
}
