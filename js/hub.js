/* ============================================
   GAME HUB JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initHub();
});

function initHub() {
    initGameCards();
    initBackButton();
    initEasterEggs();

    // Start background music
    document.addEventListener('click', function startMusic() {
        if (window.partyAudio) {
            window.partyAudio.init();
            window.partyAudio.startBgMusic('hub');
        }
        document.removeEventListener('click', startMusic);
    }, { once: true });
}

// ==========================================
// GAME CARDS
// ==========================================

function initGameCards() {
    const cards = document.querySelectorAll('.game-card');

    const gameUrls = {
        clicker: 'clicker.html',
        cakes: 'cakes.html',
        whack: 'whack.html',
        eggs: 'eggs.html',
        chaos: 'chaos.html'
    };

    cards.forEach(card => {
        // Hover sound
        card.addEventListener('mouseenter', () => {
            if (window.partyAudio) {
                window.partyAudio.init();
                window.partyAudio.playHover();
            }
        });

        // Click to navigate
        card.addEventListener('click', () => {
            const game = card.dataset.game;
            if (window.partyAudio) {
                window.partyAudio.playClick();
                window.partyAudio.stopBgMusic();
            }

            // Add click animation
            card.style.transform = 'scale(0.95)';

            // Navigate after animation
            setTimeout(() => {
                if (gameUrls[game]) {
                    // Confetti transition for main game
                    if (game === 'clicker' && window.confetti) {
                        window.confetti.wipeTransition(() => {
                            window.location.href = gameUrls[game];
                        });
                    } else {
                        window.location.href = gameUrls[game];
                    }
                }
            }, 150);
        });

        // Touch feedback
        card.addEventListener('touchstart', () => {
            card.style.transform = 'scale(0.98)';
        });

        card.addEventListener('touchend', () => {
            card.style.transform = '';
        });
    });
}

// ==========================================
// BACK BUTTON
// ==========================================

function initBackButton() {
    const backBtn = document.getElementById('backBtn');
    if (!backBtn) return;

    backBtn.addEventListener('mouseenter', () => {
        if (window.partyAudio) window.partyAudio.playHover();
    });

    backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.partyAudio) {
            window.partyAudio.playClick();
            window.partyAudio.stopBgMusic();
        }
        window.location.href = 'index.html';
    });
}

// ==========================================
// EASTER EGGS
// ==========================================

function initEasterEggs() {
    if (window.easterEggs) {
        window.easterEggs.createEgg('hub-1', '3%', '50%');
        window.easterEggs.createEgg('hub-2', '95%', '90%');
    }
}
