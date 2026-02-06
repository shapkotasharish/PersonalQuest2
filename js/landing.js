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
// FLOATING PARTY EMOJIS (replaces balloons)
// ==========================================

function initBalloons() {
    const container = document.getElementById('balloonsContainer');
    if (!container) return;

    const partyEmojis = ['🎁', '🎀', '⭐', '✨', '🌟', '🎉', '💫', '🧁'];

    // Create floating emojis
    for (let i = 0; i < 8; i++) {
        createFloatingEmoji(container, partyEmojis);
    }
}

function createFloatingEmoji(container, emojis) {
    const emoji = document.createElement('div');
    emoji.className = 'floating-party-emoji';
    emoji.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
    emoji.style.fontSize = (1.5 + Math.random() * 1.5) + 'rem';
    emoji.style.left = (5 + Math.random() * 90) + '%';
    emoji.style.top = (10 + Math.random() * 80) + '%';

    // Click to sparkle
    emoji.addEventListener('click', (e) => {
        e.stopPropagation();
        sparkleEmoji(emoji, emojis);
    });

    container.appendChild(emoji);
    animateEmojiFloat(emoji);
}

function animateEmojiFloat(emoji) {
    const startX = parseFloat(emoji.style.left);
    const startY = parseFloat(emoji.style.top);
    let time = Math.random() * 100;
    const speedX = 0.3 + Math.random() * 0.3;
    const speedY = 0.2 + Math.random() * 0.3;
    const rangeX = 3 + Math.random() * 4;
    const rangeY = 3 + Math.random() * 4;

    function drift() {
        if (!emoji.parentElement) return;
        time += 0.01;
        emoji.style.left = (startX + Math.sin(time * speedX) * rangeX) + '%';
        emoji.style.top = (startY + Math.cos(time * speedY) * rangeY) + '%';
        requestAnimationFrame(drift);
    }
    requestAnimationFrame(drift);
}

function sparkleEmoji(emoji, emojis) {
    if (window.partyAudio) window.partyAudio.playPop();

    emoji.style.transform = 'scale(1.5) rotate(20deg)';
    emoji.style.opacity = '1';

    // Sparkle burst
    const rect = emoji.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    for (let i = 0; i < 6; i++) {
        const spark = document.createElement('div');
        spark.textContent = ['✨', '💫', '⭐'][Math.floor(Math.random() * 3)];
        spark.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;font-size:1.2rem;pointer-events:none;z-index:999;`;
        document.body.appendChild(spark);
        const angle = (i / 6) * Math.PI * 2;
        const dist = 40 + Math.random() * 30;
        spark.animate([
            { transform: 'translate(0,0) scale(1)', opacity: 1 },
            { transform: `translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist}px) scale(0)`, opacity: 0 }
        ], { duration: 600, easing: 'ease-out' });
        setTimeout(() => spark.remove(), 600);
    }

    setTimeout(() => {
        emoji.style.transform = 'scale(1) rotate(0deg)';
        emoji.style.opacity = '0.7';
        emoji.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
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
        if (e.target.closest('button, a, .floating-party-emoji, .peek-character, .easter-egg')) return;

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
