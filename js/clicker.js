/* ============================================
   PARTY POWER CLICKER - MAIN GAME
   ============================================ */

// ==========================================
// GAME STATE
// ==========================================

const gameState = {
    partyPower: 0,
    totalEarned: 0,
    clickPower: 1,
    passiveIncome: 0,
    partyStars: 0,
    globalMultiplier: 1,

    upgrades: {},
    helpers: {},
    decorations: {},
    boosts: {},
    themes: {},

    achievements: [],
    currentTheme: 'default'
};

// ==========================================
// UPGRADE DEFINITIONS
// ==========================================

const UPGRADES = {
    clicking: [
        { id: 'click1', name: 'Party Tap', icon: '👆', desc: 'Tap with more energy!', effect: '+1 per click', cost: 10, power: 1, maxLevel: 50 },
        { id: 'click2', name: 'Double Tap', icon: '✌️', desc: 'Two fingers, double fun!', effect: '+2 per click', cost: 50, power: 2, maxLevel: 50, requires: { click1: 5 } },
        { id: 'click3', name: 'Power Poke', icon: '💪', desc: 'Strong party vibes!', effect: '+5 per click', cost: 200, power: 5, maxLevel: 40, requires: { click2: 5 } },
        { id: 'click4', name: 'Super Slap', icon: '🖐️', desc: 'Party slap!', effect: '+10 per click', cost: 1000, power: 10, maxLevel: 35, requires: { click3: 5 } },
        { id: 'click5', name: 'Mega Mash', icon: '👊', desc: 'Mash that party button!', effect: '+25 per click', cost: 5000, power: 25, maxLevel: 30, requires: { click4: 5 } },
        { id: 'click6', name: 'Ultra Touch', icon: '✨', desc: 'Magical fingertips!', effect: '+50 per click', cost: 25000, power: 50, maxLevel: 25, requires: { click5: 5 } },
        { id: 'click7', name: 'Cosmic Click', icon: '🌟', desc: 'Click from the stars!', effect: '+100 per click', cost: 100000, power: 100, maxLevel: 20, requires: { click6: 5 } },
        { id: 'click8', name: 'Galaxy Grip', icon: '🌌', desc: 'The power of galaxies!', effect: '+250 per click', cost: 500000, power: 250, maxLevel: 15, requires: { click7: 5 } },
        { id: 'click9', name: 'Universe Unleash', icon: '💫', desc: 'Universal party power!', effect: '+500 per click', cost: 2000000, power: 500, maxLevel: 10, requires: { click8: 5 } },
        { id: 'click10', name: 'Infinity Tap', icon: '♾️', desc: 'Infinite party energy!', effect: '+1000 per click', cost: 10000000, power: 1000, maxLevel: 10, requires: { click9: 5 } },
    ],

    helpers: [
        { id: 'puppy1', name: 'Party Puppy', icon: '🐶', desc: 'A cute puppy joins the party!', effect: '+1/sec', cost: 50, income: 1, maxLevel: 20, helperType: 'puppy' },
        { id: 'puppy2', name: 'Dancing Dog', icon: '🐕', desc: 'This pup has moves!', effect: '+3/sec', cost: 200, income: 3, maxLevel: 20, helperType: 'puppy', requires: { puppy1: 3 } },
        { id: 'panda1', name: 'Red Panda', icon: '🐼', desc: 'Adorable helper!', effect: '+5/sec', cost: 500, income: 5, maxLevel: 15, helperType: 'panda' },
        { id: 'panda2', name: 'Party Panda', icon: '🐻', desc: 'Panda with balloons!', effect: '+10/sec', cost: 2000, income: 10, maxLevel: 15, helperType: 'panda', requires: { panda1: 3 } },
        { id: 'bunny1', name: 'Birthday Bunny', icon: '🐰', desc: 'Hop hop party!', effect: '+15/sec', cost: 5000, income: 15, maxLevel: 12, helperType: 'bunny', requires: { puppy2: 5 } },
        { id: 'cat1', name: 'Confetti Cat', icon: '🐱', desc: 'Meow-velous helper!', effect: '+25/sec', cost: 15000, income: 25, maxLevel: 12, helperType: 'cat', requires: { bunny1: 3 } },
        { id: 'unicorn1', name: 'Party Unicorn', icon: '🦄', desc: 'Magical party creature!', effect: '+50/sec', cost: 50000, income: 50, maxLevel: 10, helperType: 'special', requires: { cat1: 3 } },
        { id: 'dragon1', name: 'Friendly Dragon', icon: '🐲', desc: 'Breathes confetti!', effect: '+100/sec', cost: 200000, income: 100, maxLevel: 8, helperType: 'special', requires: { unicorn1: 3 } },
        { id: 'phoenix1', name: 'Party Phoenix', icon: '🔥', desc: 'Eternal party spirit!', effect: '+200/sec', cost: 1000000, income: 200, maxLevel: 6, helperType: 'special', requires: { dragon1: 3 } },
        { id: 'dubai1', name: 'Dubai Chocolate Panda', icon: '🍫', desc: 'Super rare! Unwraps chocolate!', effect: '+10% global', cost: 5000000, income: 0, boost: 0.1, maxLevel: 5, helperType: 'special', requires: { phoenix1: 2 } },
    ],

    decorations: [
        { id: 'balloon1', name: 'Balloons', icon: '🎈', desc: 'Colorful balloons!', effect: '+5% click power', cost: 100, clickBoost: 0.05, maxLevel: 10 },
        { id: 'streamer1', name: 'Streamers', icon: '🎊', desc: 'Party streamers!', effect: '+5% passive', cost: 150, passiveBoost: 0.05, maxLevel: 10 },
        { id: 'confetti1', name: 'Confetti Cannon', icon: '🎉', desc: 'Boom! Confetti!', effect: '+10% click power', cost: 500, clickBoost: 0.1, maxLevel: 8, requires: { balloon1: 3 } },
        { id: 'banner1', name: 'Party Banner', icon: '🏳️', desc: 'Happy Birthday banner!', effect: '+10% passive', cost: 750, passiveBoost: 0.1, maxLevel: 8, requires: { streamer1: 3 } },
        { id: 'disco1', name: 'Disco Ball', icon: '🪩', desc: 'Let\'s disco!', effect: '+15% all income', cost: 2000, globalBoost: 0.15, maxLevel: 6, requires: { confetti1: 3 } },
        { id: 'lights1', name: 'Party Lights', icon: '💡', desc: 'Sparkly lights!', effect: '+15% click power', cost: 3000, clickBoost: 0.15, maxLevel: 6, requires: { banner1: 3 } },
        { id: 'cake_deco1', name: 'Giant Cake Display', icon: '🎂', desc: 'Impressive centerpiece!', effect: '+20% passive', cost: 10000, passiveBoost: 0.2, maxLevel: 5, requires: { disco1: 2 } },
        { id: 'fountain1', name: 'Chocolate Fountain', icon: '⛲', desc: 'Delicious decoration!', effect: '+20% all income', cost: 25000, globalBoost: 0.2, maxLevel: 5, requires: { lights1: 2 } },
        { id: 'fireworks1', name: 'Fireworks', icon: '🎆', desc: 'Spectacular display!', effect: '+25% all income', cost: 100000, globalBoost: 0.25, maxLevel: 4, requires: { cake_deco1: 2 } },
        { id: 'rainbow1', name: 'Rainbow Arch', icon: '🌈', desc: 'Magical rainbow!', effect: '+30% all income', cost: 500000, globalBoost: 0.3, maxLevel: 3, requires: { fireworks1: 2 } },
    ],

    boosts: [
        { id: 'sugar1', name: 'Sugar Rush', icon: '🍬', desc: 'Sweet energy boost!', effect: '2x clicks for 30s', cost: 500, temporary: true, duration: 30, multiplier: 2, maxLevel: 1 },
        { id: 'party1', name: 'Party Mode', icon: '🥳', desc: 'Maximum party vibes!', effect: '2x all income for 60s', cost: 2000, temporary: true, duration: 60, multiplier: 2, maxLevel: 1, requires: { sugar1: 1 } },
        { id: 'lucky1', name: 'Lucky Charm', icon: '🍀', desc: '10% chance for 5x clicks', effect: 'Lucky clicks!', cost: 5000, luck: 0.1, luckMulti: 5, maxLevel: 10 },
        { id: 'magnet1', name: 'Party Magnet', icon: '🧲', desc: 'Attract more party power!', effect: '+25% passive income', cost: 10000, passiveBoost: 0.25, maxLevel: 8, requires: { party1: 1 } },
        { id: 'clock1', name: 'Party Time', icon: '⏰', desc: 'Time flies when having fun!', effect: '+50% helper speed', cost: 25000, helperBoost: 0.5, maxLevel: 6, requires: { magnet1: 3 } },
        { id: 'star1', name: 'Star Power', icon: '⭐', desc: 'Starlight energy!', effect: '+1% per Party Star', cost: 50000, starBoost: 0.01, maxLevel: 10, requires: { clock1: 2 } },
        { id: 'mega1', name: 'Mega Multiplier', icon: '🔥', desc: 'Everything is better!', effect: '+50% global', cost: 200000, globalBoost: 0.5, maxLevel: 5, requires: { star1: 3 } },
        { id: 'golden1', name: 'Golden Touch', icon: '👑', desc: 'Everything you touch turns to gold!', effect: '3x click power', cost: 1000000, clickMulti: 3, maxLevel: 3, requires: { mega1: 2 } },
        { id: 'infinite1', name: 'Infinite Energy', icon: '♾️', desc: 'Unlimited power source!', effect: '+100% all income', cost: 10000000, globalBoost: 1.0, maxLevel: 3, requires: { golden1: 2 } },
        { id: 'cosmic1', name: 'Cosmic Blessing', icon: '🌠', desc: 'Blessed by the party gods!', effect: '+200% all income', cost: 100000000, globalBoost: 2.0, maxLevel: 2, requires: { infinite1: 2 } },
    ],

    themes: [
        { id: 'theme_night', name: 'Night Party', icon: '🌙', desc: 'Party under the stars!', effect: 'New visual style', cost: 10000, themeClass: 'theme-night', maxLevel: 1 },
        { id: 'theme_neon', name: 'Neon Dance Floor', icon: '💜', desc: 'Glow in the dark!', effect: 'Neon visual style', cost: 50000, themeClass: 'theme-neon', maxLevel: 1, requires: { theme_night: 1 } },
        { id: 'theme_puppy', name: 'Puppy Pajama Party', icon: '💤', desc: 'Cozy puppy theme!', effect: 'Cozy visual style', cost: 100000, themeClass: 'theme-puppy', maxLevel: 1, requires: { theme_neon: 1 } },
        { id: 'theme_panda', name: 'Red Panda Festival', icon: '🎋', desc: 'Bamboo paradise!', effect: 'Nature visual style', cost: 250000, themeClass: 'theme-panda', maxLevel: 1, requires: { theme_puppy: 1 } },
    ]
};

// ==========================================
// GAME INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    loadGame();
    initGame();
    startGameLoop();
});

function initGame() {
    initCake();
    initTabs();
    initUpgrades();
    initRebirth();
    initBackButton();
    updateDisplay();

    // Start background music
    document.addEventListener('click', function startMusic() {
        if (window.partyAudio) {
            window.partyAudio.init();
            window.partyAudio.startBgMusic('clicker');
        }
        document.removeEventListener('click', startMusic);
    }, { once: true });

    // Easter eggs
    if (window.easterEggs) {
        window.easterEggs.createEgg('clicker-1', '2%', '95%');
    }
}

// ==========================================
// CAKE CLICKING
// ==========================================

function initCake() {
    const cake = document.getElementById('mainCake');
    if (!cake) return;

    let isHolding = false;
    let holdInterval = null;

    const handleClick = (e) => {
        const rect = cake.getBoundingClientRect();
        const x = e.clientX || (e.touches && e.touches[0].clientX) || rect.left + rect.width / 2;
        const y = e.clientY || (e.touches && e.touches[0].clientY) || rect.top;

        doClick(x, y);
    };

    const startHold = (e) => {
        isHolding = true;
        holdInterval = setInterval(() => {
            if (isHolding) {
                const rect = cake.getBoundingClientRect();
                doClick(rect.left + rect.width / 2, rect.top, true);
            }
        }, 100);
    };

    const endHold = () => {
        isHolding = false;
        if (holdInterval) {
            clearInterval(holdInterval);
            holdInterval = null;
        }
    };

    cake.addEventListener('click', handleClick);
    cake.addEventListener('mousedown', startHold);
    cake.addEventListener('mouseup', endHold);
    cake.addEventListener('mouseleave', endHold);
    cake.addEventListener('touchstart', (e) => { handleClick(e); startHold(e); });
    cake.addEventListener('touchend', endHold);
}

function doClick(x, y, isHold = false) {
    // Calculate click value
    let clickValue = calculateClickPower();

    // Lucky click check
    const luckyLevel = gameState.upgrades['lucky1'] || 0;
    if (luckyLevel > 0) {
        const luckChance = UPGRADES.boosts.find(u => u.id === 'lucky1').luck * luckyLevel;
        const luckMulti = UPGRADES.boosts.find(u => u.id === 'lucky1').luckMulti;
        if (Math.random() < luckChance) {
            clickValue *= luckMulti;
            showFloatingNumber(x, y - 30, `LUCKY! +${formatNumber(clickValue)}`, '#f1c40f');
            if (window.partyAudio) window.partyAudio.playSparkle();
        }
    }

    // Add party power
    gameState.partyPower += clickValue;
    gameState.totalEarned += clickValue;

    // Visual feedback
    if (!isHold) {
        const cake = document.getElementById('mainCake');
        cake.classList.add('clicking');
        setTimeout(() => cake.classList.remove('clicking'), 100);

        // Sound
        if (window.partyAudio) window.partyAudio.playCoin();
    }

    // Floating number
    showFloatingNumber(x, y - 20, `+${formatNumber(clickValue)}`);

    // Create sparkle
    createCakeSparkle();

    updateDisplay();
    checkAchievements();
}

function calculateClickPower() {
    let power = 1;

    // Base click upgrades
    UPGRADES.clicking.forEach(upgrade => {
        const level = gameState.upgrades[upgrade.id] || 0;
        power += upgrade.power * level;
    });

    // Click boost from decorations
    let clickBoost = 1;
    UPGRADES.decorations.forEach(upgrade => {
        if (upgrade.clickBoost) {
            const level = gameState.upgrades[upgrade.id] || 0;
            clickBoost += upgrade.clickBoost * level;
        }
    });

    // Click multiplier from boosts
    let clickMulti = 1;
    UPGRADES.boosts.forEach(upgrade => {
        if (upgrade.clickMulti) {
            const level = gameState.upgrades[upgrade.id] || 0;
            clickMulti *= Math.pow(upgrade.clickMulti, level);
        }
    });

    // Apply multipliers
    power *= clickBoost * clickMulti * gameState.globalMultiplier;

    // Party Stars bonus
    const starBoostLevel = gameState.upgrades['star1'] || 0;
    if (starBoostLevel > 0 && gameState.partyStars > 0) {
        const starBoost = UPGRADES.boosts.find(u => u.id === 'star1').starBoost;
        power *= (1 + starBoost * starBoostLevel * gameState.partyStars);
    }

    return Math.floor(power);
}

function createCakeSparkle() {
    const container = document.getElementById('cakeSparkles');
    if (!container) return;

    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = (30 + Math.random() * 40) + '%';
    sparkle.style.top = (30 + Math.random() * 40) + '%';

    container.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 600);
}

// ==========================================
// PASSIVE INCOME
// ==========================================

function calculatePassiveIncome() {
    let income = 0;

    // Helper income
    UPGRADES.helpers.forEach(upgrade => {
        const level = gameState.upgrades[upgrade.id] || 0;
        income += upgrade.income * level;
    });

    // Passive boost from decorations
    let passiveBoost = 1;
    UPGRADES.decorations.forEach(upgrade => {
        if (upgrade.passiveBoost) {
            const level = gameState.upgrades[upgrade.id] || 0;
            passiveBoost += upgrade.passiveBoost * level;
        }
    });

    // Passive boost from boosts
    UPGRADES.boosts.forEach(upgrade => {
        if (upgrade.passiveBoost) {
            const level = gameState.upgrades[upgrade.id] || 0;
            passiveBoost += upgrade.passiveBoost * level;
        }
        if (upgrade.helperBoost) {
            const level = gameState.upgrades[upgrade.id] || 0;
            passiveBoost += upgrade.helperBoost * level;
        }
    });

    // Global boosts
    let globalBoost = 1;
    UPGRADES.decorations.forEach(upgrade => {
        if (upgrade.globalBoost) {
            const level = gameState.upgrades[upgrade.id] || 0;
            globalBoost += upgrade.globalBoost * level;
        }
    });
    UPGRADES.boosts.forEach(upgrade => {
        if (upgrade.globalBoost) {
            const level = gameState.upgrades[upgrade.id] || 0;
            globalBoost += upgrade.globalBoost * level;
        }
    });

    // Dubai Panda boost
    const dubaiLevel = gameState.upgrades['dubai1'] || 0;
    if (dubaiLevel > 0) {
        const dubaiBoost = UPGRADES.helpers.find(u => u.id === 'dubai1').boost;
        globalBoost += dubaiBoost * dubaiLevel;
    }

    income *= passiveBoost * globalBoost * gameState.globalMultiplier;

    // Party Stars bonus
    income *= (1 + gameState.partyStars * 0.1);

    return income;
}

// ==========================================
// GAME LOOP
// ==========================================

function startGameLoop() {
    setInterval(() => {
        const income = calculatePassiveIncome();
        if (income > 0) {
            gameState.partyPower += income / 10; // 10 ticks per second
            gameState.totalEarned += income / 10;
        }
        updateDisplay();
        saveGame();
    }, 100);
}

// ==========================================
// TABS
// ==========================================

function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (window.partyAudio) window.partyAudio.playClick();

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Show corresponding upgrade list
            const category = tab.dataset.tab;
            document.querySelectorAll('.upgrade-list').forEach(list => {
                list.classList.remove('active');
            });
            document.querySelector(`[data-category="${category}"]`).classList.add('active');
        });

        tab.addEventListener('mouseenter', () => {
            if (window.partyAudio) window.partyAudio.playHover();
        });
    });
}

// ==========================================
// UPGRADES
// ==========================================

function initUpgrades() {
    renderUpgrades('clicking', 'clickingUpgrades');
    renderUpgrades('helpers', 'helpersUpgrades');
    renderUpgrades('decorations', 'decorationsUpgrades');
    renderUpgrades('boosts', 'boostsUpgrades');
    renderUpgrades('themes', 'themesUpgrades');
}

function renderUpgrades(category, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    UPGRADES[category].forEach(upgrade => {
        const level = gameState.upgrades[upgrade.id] || 0;
        const cost = calculateCost(upgrade, level);
        const canAfford = gameState.partyPower >= cost;
        const isMaxed = level >= upgrade.maxLevel;
        const isLocked = !checkRequirements(upgrade);

        const item = document.createElement('div');
        item.className = 'upgrade-item';
        if (canAfford && !isMaxed && !isLocked) item.classList.add('affordable');
        if (level > 0) item.classList.add('owned');
        if (isMaxed) item.classList.add('maxed');
        if (isLocked) item.classList.add('locked');

        item.innerHTML = `
            <div class="upgrade-header">
                <span class="upgrade-name">
                    <span class="upgrade-icon">${upgrade.icon}</span>
                    ${upgrade.name}
                </span>
                ${!isMaxed ? `<span class="upgrade-cost">🎉 ${formatNumber(cost)}</span>` : '<span class="upgrade-cost">MAX</span>'}
            </div>
            <div class="upgrade-desc">${upgrade.desc}</div>
            <div class="upgrade-effect">${upgrade.effect}</div>
            ${level > 0 ? `<span class="upgrade-count">Owned: ${level}/${upgrade.maxLevel}</span>` : ''}
        `;

        if (!isMaxed && !isLocked) {
            item.addEventListener('click', () => purchaseUpgrade(upgrade, category));
            item.addEventListener('mouseenter', () => {
                if (window.partyAudio) window.partyAudio.playHover();
            });
        }

        container.appendChild(item);
    });
}

function calculateCost(upgrade, level) {
    return Math.floor(upgrade.cost * Math.pow(1.15, level));
}

function checkRequirements(upgrade) {
    if (!upgrade.requires) return true;

    for (const [reqId, reqLevel] of Object.entries(upgrade.requires)) {
        if ((gameState.upgrades[reqId] || 0) < reqLevel) {
            return false;
        }
    }
    return true;
}

function purchaseUpgrade(upgrade, category) {
    const level = gameState.upgrades[upgrade.id] || 0;
    const cost = calculateCost(upgrade, level);

    if (gameState.partyPower < cost) {
        if (window.partyAudio) window.partyAudio.playOops();
        return;
    }

    if (level >= upgrade.maxLevel) return;

    // Deduct cost
    gameState.partyPower -= cost;

    // Add upgrade
    gameState.upgrades[upgrade.id] = level + 1;

    // Play sound
    if (window.partyAudio) window.partyAudio.playUpgrade();

    // Show toast
    showToast(`${upgrade.icon} ${upgrade.name} upgraded!`);

    // Special handling for helpers
    if (category === 'helpers' && upgrade.helperType) {
        addHelper(upgrade);
    }

    // Special handling for decorations
    if (category === 'decorations') {
        addDecoration(upgrade);
    }

    // Special handling for themes
    if (category === 'themes' && upgrade.themeClass) {
        unlockTheme(upgrade);
    }

    // Update display
    updateDisplay();
    renderUpgrades(category, `${category}Upgrades`);

    // Check achievements
    checkAchievements();
}

// ==========================================
// HELPERS
// ==========================================

function addHelper(upgrade) {
    const helpersArea = document.getElementById('helpersArea');
    if (!helpersArea) return;

    // Limit visible helpers
    const existingHelpers = helpersArea.querySelectorAll('.helper');
    if (existingHelpers.length >= 8) return;

    const helper = document.createElement('div');
    helper.className = `helper ${upgrade.helperType} entering`;
    helper.textContent = upgrade.icon;

    helpersArea.appendChild(helper);

    setTimeout(() => helper.classList.remove('entering'), 500);
}

function loadHelpers() {
    const helpersArea = document.getElementById('helpersArea');
    if (!helpersArea) return;

    helpersArea.innerHTML = '';

    let count = 0;
    UPGRADES.helpers.forEach(upgrade => {
        const level = gameState.upgrades[upgrade.id] || 0;
        for (let i = 0; i < Math.min(level, 2) && count < 8; i++) {
            const helper = document.createElement('div');
            helper.className = `helper ${upgrade.helperType}`;
            helper.textContent = upgrade.icon;
            helpersArea.appendChild(helper);
            count++;
        }
    });
}

// ==========================================
// DECORATIONS
// ==========================================

function addDecoration(upgrade) {
    const layer = document.getElementById('decorationsLayer');
    if (!layer) return;

    const existing = layer.querySelectorAll('.decoration');
    if (existing.length >= 12) return;

    const deco = document.createElement('div');
    deco.className = 'decoration';
    deco.textContent = upgrade.icon;
    deco.style.left = (10 + Math.random() * 80) + '%';
    deco.style.top = (5 + Math.random() * 30) + '%';
    deco.style.animationDelay = Math.random() * 2 + 's';

    layer.appendChild(deco);
}

function loadDecorations() {
    const layer = document.getElementById('decorationsLayer');
    if (!layer) return;

    layer.innerHTML = '';

    let count = 0;
    UPGRADES.decorations.forEach(upgrade => {
        const level = gameState.upgrades[upgrade.id] || 0;
        for (let i = 0; i < Math.min(level, 2) && count < 12; i++) {
            const deco = document.createElement('div');
            deco.className = 'decoration';
            deco.textContent = upgrade.icon;
            deco.style.left = (10 + Math.random() * 80) + '%';
            deco.style.top = (5 + Math.random() * 30) + '%';
            deco.style.animationDelay = Math.random() * 2 + 's';
            layer.appendChild(deco);
            count++;
        }
    });
}

// ==========================================
// THEMES
// ==========================================

function unlockTheme(upgrade) {
    // Remove old theme classes
    document.body.classList.remove('theme-night', 'theme-neon', 'theme-puppy', 'theme-panda');

    // Add new theme
    document.body.classList.add(upgrade.themeClass);
    gameState.currentTheme = upgrade.id;

    // Celebration
    if (window.confetti) window.confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 50);
    showAchievement('🎨', 'NEW PARTY STYLE!');
}

function loadTheme() {
    if (gameState.currentTheme && gameState.currentTheme !== 'default') {
        const theme = UPGRADES.themes.find(t => t.id === gameState.currentTheme);
        if (theme) {
            document.body.classList.add(theme.themeClass);
        }
    }
}

// ==========================================
// REBIRTH
// ==========================================

function initRebirth() {
    const rebirthBtn = document.getElementById('rebirthBtn');
    if (!rebirthBtn) return;

    rebirthBtn.addEventListener('click', () => {
        if (gameState.partyPower >= 1000000) {
            showRebirthConfirmation();
        }
    });

    rebirthBtn.addEventListener('mouseenter', () => {
        if (window.partyAudio) window.partyAudio.playHover();
    });
}

function showRebirthConfirmation() {
    const starsToGain = calculateRebirthStars();

    showModal(
        '⭐ Ultimate Party Rebirth?',
        `Reset your progress to gain ${starsToGain} Party Stars!\n\nParty Stars permanently boost all income by 10% each.`,
        [
            { text: 'Not Yet', primary: false },
            { text: `Rebirth (+${starsToGain} ⭐)`, primary: true, onClick: performRebirth }
        ]
    );
}

function calculateRebirthStars() {
    return Math.floor(Math.sqrt(gameState.partyPower / 1000000));
}

function performRebirth() {
    const starsGained = calculateRebirthStars();

    // Add stars
    gameState.partyStars += starsGained;

    // Reset progress
    gameState.partyPower = 0;
    gameState.totalEarned = 0;
    gameState.upgrades = {};
    gameState.currentTheme = 'default';

    // Remove theme
    document.body.classList.remove('theme-night', 'theme-neon', 'theme-puppy', 'theme-panda');

    // Clear visual elements
    loadHelpers();
    loadDecorations();

    // Re-render upgrades
    initUpgrades();

    // Effects
    if (window.partyAudio) window.partyAudio.playLevelUp();
    if (window.confetti) window.confetti.rain(3000);
    showAchievement('⭐', `+${starsGained} Party Stars!`);

    updateDisplay();
    saveGame();
}

// ==========================================
// ACHIEVEMENTS
// ==========================================

const ACHIEVEMENTS = [
    { id: 'first_click', name: 'First Click!', icon: '👆', condition: () => gameState.totalEarned >= 1 },
    { id: 'hundred', name: 'Party Started!', icon: '🎉', condition: () => gameState.totalEarned >= 100 },
    { id: 'thousand', name: 'Getting Good!', icon: '🎊', condition: () => gameState.totalEarned >= 1000 },
    { id: 'ten_k', name: 'Party Animal!', icon: '🦁', condition: () => gameState.totalEarned >= 10000 },
    { id: 'hundred_k', name: 'Party Legend!', icon: '👑', condition: () => gameState.totalEarned >= 100000 },
    { id: 'million', name: 'Party Master!', icon: '🏆', condition: () => gameState.totalEarned >= 1000000 },
    { id: 'first_helper', name: 'First Helper!', icon: '🐶', condition: () => UPGRADES.helpers.some(u => gameState.upgrades[u.id] >= 1) },
    { id: 'first_rebirth', name: 'Reborn!', icon: '⭐', condition: () => gameState.partyStars >= 1 },
];

function checkAchievements() {
    ACHIEVEMENTS.forEach(achievement => {
        if (!gameState.achievements.includes(achievement.id) && achievement.condition()) {
            gameState.achievements.push(achievement.id);
            showAchievement(achievement.icon, achievement.name);
        }
    });
}

function showAchievement(icon, text) {
    const popup = document.getElementById('achievementPopup');
    const iconEl = document.getElementById('achievementIcon');
    const textEl = document.getElementById('achievementText');

    if (!popup || !iconEl || !textEl) return;

    iconEl.textContent = icon;
    textEl.textContent = text;

    popup.classList.add('show');

    setTimeout(() => {
        popup.classList.remove('show');
    }, 3000);
}

// ==========================================
// DISPLAY UPDATE
// ==========================================

function updateDisplay() {
    // Update stats
    document.getElementById('partyPower').textContent = formatNumber(gameState.partyPower);
    document.getElementById('perSecond').textContent = formatNumber(calculatePassiveIncome());
    document.getElementById('perClick').textContent = formatNumber(calculateClickPower());
    document.getElementById('partyStars').textContent = gameState.partyStars;

    // Update rebirth button
    const rebirthBtn = document.getElementById('rebirthBtn');
    const rebirthInfo = document.getElementById('rebirthInfo');

    if (gameState.partyPower >= 1000000) {
        rebirthBtn.disabled = false;
        const stars = calculateRebirthStars();
        rebirthInfo.textContent = `Gain ${stars} Party Star${stars !== 1 ? 's' : ''}!`;
    } else {
        rebirthBtn.disabled = true;
        rebirthInfo.textContent = `Need ${formatNumber(1000000 - gameState.partyPower)} more`;
    }

    // Update global multiplier based on stars
    gameState.globalMultiplier = 1 + (gameState.partyStars * 0.1);
}

// ==========================================
// SAVE/LOAD
// ==========================================

function saveGame() {
    const saveData = {
        partyPower: gameState.partyPower,
        totalEarned: gameState.totalEarned,
        partyStars: gameState.partyStars,
        upgrades: gameState.upgrades,
        achievements: gameState.achievements,
        currentTheme: gameState.currentTheme
    };
    localStorage.setItem('clickerSave', JSON.stringify(saveData));
}

function loadGame() {
    const saved = localStorage.getItem('clickerSave');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            gameState.partyPower = data.partyPower || 0;
            gameState.totalEarned = data.totalEarned || 0;
            gameState.partyStars = data.partyStars || 0;
            gameState.upgrades = data.upgrades || {};
            gameState.achievements = data.achievements || [];
            gameState.currentTheme = data.currentTheme || 'default';

            // Load visual elements after DOM is ready
            setTimeout(() => {
                loadHelpers();
                loadDecorations();
                loadTheme();
            }, 100);
        } catch (e) {
            console.warn('Failed to load save:', e);
        }
    }
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
        saveGame();
        if (window.partyAudio) {
            window.partyAudio.playClick();
            window.partyAudio.stopBgMusic();
        }
        window.location.href = 'hub.html';
    });
}
