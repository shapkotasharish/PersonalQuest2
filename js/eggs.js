/* ============================================
   EASTER EGG HUNT PAGE
   ============================================ */

const EGG_DATA = [
    { id: 'landing-1', hint: 'Near the bottom left of the welcome page', page: 'Landing Page' },
    { id: 'landing-2', hint: 'Top right corner where stars twinkle', page: 'Landing Page' },
    { id: 'hub-1', hint: 'Left side of the game selection', page: 'Game Hub' },
    { id: 'hub-2', hint: 'Bottom right, almost off screen', page: 'Game Hub' },
    { id: 'clicker-1', hint: 'Bottom left while partying', page: 'Party Clicker' },
    { id: 'cakes-1', hint: 'Top right, catching views', page: 'Catch Cakes' },
    { id: 'whack-1', hint: 'Left side, hiding from whacks', page: 'Whack-A-Thing' },
    { id: 'chaos-1', hint: 'Somewhere in the chaos', page: 'Chaos Mode' },
    { id: 'chaos-2', hint: 'Another chaotic corner', page: 'Chaos Mode' },
    { id: 'eggs-1', hint: 'Right here on this page!', page: 'Egg Hunt' },
    { id: 'eggs-2', hint: 'Check every corner carefully', page: 'Egg Hunt' },
    { id: 'eggs-3', hint: 'Sometimes eggs hide in plain sight', page: 'Egg Hunt' },
    { id: 'secret-1', hint: 'Hold down anywhere for magic', page: 'Secret' },
    { id: 'secret-2', hint: 'Tap the screen 5 times quickly!', page: 'Secret' },
    { id: 'secret-3', hint: 'Reach 1000 Party Power', page: 'Secret' }
];

document.addEventListener('DOMContentLoaded', () => {
    initEggsPage();
});

function initEggsPage() {
    renderEggGrid();
    renderHints();
    updateProgress();
    initBackButton();
    placePageEggs();

    // Audio init
    document.addEventListener('click', function startAudio() {
        if (window.partyAudio) window.partyAudio.init();
        document.removeEventListener('click', startAudio);
    }, { once: true });

    // Check for completion
    checkCompletion();
}

function renderEggGrid() {
    const grid = document.getElementById('eggsGrid');
    if (!grid) return;

    const found = window.easterEggs ? window.easterEggs.eggs : [];

    grid.innerHTML = '';

    EGG_DATA.forEach(egg => {
        const slot = document.createElement('div');
        slot.className = 'egg-slot';

        if (found.includes(egg.id)) {
            slot.classList.add('found');
            slot.innerHTML = '🥚';
        } else {
            slot.classList.add('empty');
            slot.innerHTML = '❓';
        }

        grid.appendChild(slot);
    });
}

function renderHints() {
    const hintList = document.getElementById('hintList');
    if (!hintList) return;

    const found = window.easterEggs ? window.easterEggs.eggs : [];

    hintList.innerHTML = '';

    EGG_DATA.forEach(egg => {
        const li = document.createElement('li');
        const isFound = found.includes(egg.id);

        li.innerHTML = `
            <span>${isFound ? '✅' : '🔍'}</span>
            <span class="${isFound ? 'found' : ''}">${egg.page}: ${egg.hint}</span>
        `;

        hintList.appendChild(li);
    });
}

function updateProgress() {
    const found = window.easterEggs ? window.easterEggs.eggs.length : 0;
    const total = EGG_DATA.length;

    document.getElementById('foundCount').textContent = found;
    document.getElementById('totalCount').textContent = total;

    const progressFill = document.getElementById('progressFill');
    progressFill.style.width = (found / total * 100) + '%';
}

function checkCompletion() {
    const found = window.easterEggs ? window.easterEggs.eggs.length : 0;

    if (found === EGG_DATA.length) {
        document.getElementById('celebration').style.display = 'block';
        if (window.confetti) window.confetti.rain(3000);
    }
}

function placePageEggs() {
    // Place eggs specific to this page
    if (window.easterEggs) {
        window.easterEggs.createEgg('eggs-1', '92%', '30%');
        window.easterEggs.createEgg('eggs-2', '5%', '70%');
        window.easterEggs.createEgg('eggs-3', '50%', '95%');
    }

    // Listen for egg found events to refresh the display
    const originalFindEgg = window.easterEggs?.findEgg?.bind(window.easterEggs);
    if (originalFindEgg) {
        window.easterEggs.findEgg = function(eggId) {
            const result = originalFindEgg(eggId);
            if (result) {
                renderEggGrid();
                renderHints();
                updateProgress();
                checkCompletion();
            }
            return result;
        };
    }
}

function initBackButton() {
    const backBtn = document.getElementById('backBtn');
    backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.partyAudio) window.partyAudio.playClick();
        window.location.href = 'hub.html';
    });
}
