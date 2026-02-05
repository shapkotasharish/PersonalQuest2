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
    // CLICKING UPGRADES - Balanced for progression to trillions
    clicking: [
        { id: 'click1', name: 'Party Tap', icon: '👆', desc: 'Tap with more energy!', effect: '+1 per click', cost: 15, power: 1, maxLevel: 50, costScale: 1.10 },
        { id: 'click2', name: 'Double Tap', icon: '✌️', desc: 'Two fingers, double fun!', effect: '+3 per click', cost: 150, power: 3, maxLevel: 50, costScale: 1.12, requires: { click1: 5 } },
        { id: 'click3', name: 'Power Poke', icon: '💪', desc: 'Strong party vibes!', effect: '+10 per click', cost: 2000, power: 10, maxLevel: 40, costScale: 1.14, requires: { click2: 5 } },
        { id: 'click4', name: 'Super Slap', icon: '🖐️', desc: 'Party slap!', effect: '+50 per click', cost: 25000, power: 50, maxLevel: 35, costScale: 1.15, requires: { click3: 5 } },
        { id: 'click5', name: 'Mega Mash', icon: '👊', desc: 'Mash that party button!', effect: '+250 per click', cost: 500000, power: 250, maxLevel: 30, costScale: 1.16, requires: { click4: 5 } },
        { id: 'click6', name: 'Ultra Touch', icon: '✨', desc: 'Magical fingertips!', effect: '+1.5K per click', cost: 15000000, power: 1500, maxLevel: 25, costScale: 1.18, requires: { click5: 5 } },
        { id: 'click7', name: 'Cosmic Click', icon: '🌟', desc: 'Click from the stars!', effect: '+10K per click', cost: 500000000, power: 10000, maxLevel: 20, costScale: 1.20, requires: { click6: 5 } },
        { id: 'click8', name: 'Galaxy Grip', icon: '🌌', desc: 'The power of galaxies!', effect: '+75K per click', cost: 25000000000, power: 75000, maxLevel: 15, costScale: 1.22, requires: { click7: 5 } },
        { id: 'click9', name: 'Universe Unleash', icon: '💫', desc: 'Universal party power!', effect: '+500K per click', cost: 2e12, power: 500000, maxLevel: 12, costScale: 1.25, requires: { click8: 5 } },
        { id: 'click10', name: 'Infinity Tap', icon: '♾️', desc: 'Infinite party energy!', effect: '+5M per click', cost: 500e12, power: 5000000, maxLevel: 10, costScale: 1.28, requires: { click9: 5 } },
    ],

    // HELPER UPGRADES - Party animals that generate passive income
    // Balanced so late-game helpers provide massive income
    helpers: [
        { id: 'puppy1', name: 'Party Puppy', icon: '🐶', desc: 'A cute puppy joins the party!', effect: '+1/sec', cost: 50, income: 1, maxLevel: 25, helperType: 'puppy', costScale: 1.10 },
        { id: 'puppy2', name: 'Dancing Dog', icon: '🐕', desc: 'This pup has moves!', effect: '+8/sec', cost: 800, income: 8, maxLevel: 25, helperType: 'puppy', costScale: 1.12, requires: { puppy1: 3 } },
        { id: 'panda1', name: 'Red Panda', icon: '🐼', desc: 'Adorable helper!', effect: '+40/sec', cost: 10000, income: 40, maxLevel: 20, helperType: 'panda', costScale: 1.13 },
        { id: 'panda2', name: 'Party Panda', icon: '🐻', desc: 'Panda with balloons!', effect: '+200/sec', cost: 150000, income: 200, maxLevel: 20, helperType: 'panda', costScale: 1.14, requires: { panda1: 3 } },
        { id: 'bunny1', name: 'Birthday Bunny', icon: '🐰', desc: 'Hop hop party!', effect: '+1K/sec', cost: 3000000, income: 1000, maxLevel: 18, helperType: 'bunny', costScale: 1.15, requires: { puppy2: 5 } },
        { id: 'cat1', name: 'Confetti Cat', icon: '🐱', desc: 'Meow-velous helper!', effect: '+8K/sec', cost: 75000000, income: 8000, maxLevel: 15, helperType: 'cat', costScale: 1.16, requires: { bunny1: 3 } },
        { id: 'unicorn1', name: 'Party Unicorn', icon: '🦄', desc: 'Magical party creature!', effect: '+50K/sec', cost: 3000000000, income: 50000, maxLevel: 12, helperType: 'special', costScale: 1.18, requires: { cat1: 3 } },
        { id: 'dragon1', name: 'Friendly Dragon', icon: '🐲', desc: 'Breathes confetti!', effect: '+400K/sec', cost: 150000000000, income: 400000, maxLevel: 10, helperType: 'special', costScale: 1.20, requires: { unicorn1: 3 } },
        { id: 'phoenix1', name: 'Party Phoenix', icon: '🔥', desc: 'Eternal party spirit!', effect: '+5M/sec', cost: 10e12, income: 5000000, maxLevel: 8, helperType: 'special', costScale: 1.22, requires: { dragon1: 3 } },
        { id: 'dubai1', name: 'Dubai Chocolate Panda', icon: '🍫', desc: 'Super rare! Unwraps chocolate!', effect: '+50M/sec & +25% global', cost: 2e15, income: 50000000, boost: 0.25, maxLevel: 5, helperType: 'special', costScale: 1.30, requires: { phoenix1: 2 } },
    ],

    // DECORATION UPGRADES - Visual upgrades that boost stats
    decorations: [
        { id: 'balloon1', name: 'Balloons', icon: '🎈', desc: 'Colorful balloons!', effect: '+10% click power', cost: 200, clickBoost: 0.10, maxLevel: 10, costScale: 1.18 },
        { id: 'streamer1', name: 'Streamers', icon: '🎊', desc: 'Party streamers!', effect: '+10% passive', cost: 350, passiveBoost: 0.10, maxLevel: 10, costScale: 1.18 },
        { id: 'confetti1', name: 'Confetti Cannon', icon: '🎉', desc: 'Boom! Confetti!', effect: '+15% click power', cost: 8000, clickBoost: 0.15, maxLevel: 8, costScale: 1.22, requires: { balloon1: 3 } },
        { id: 'banner1', name: 'Party Banner', icon: '🏳️', desc: 'Happy Birthday banner!', effect: '+15% passive', cost: 12000, passiveBoost: 0.15, maxLevel: 8, costScale: 1.22, requires: { streamer1: 3 } },
        { id: 'disco1', name: 'Disco Ball', icon: '🪩', desc: 'Let\'s disco!', effect: '+25% all income', cost: 500000, globalBoost: 0.25, maxLevel: 6, costScale: 1.28, requires: { confetti1: 3 } },
        { id: 'lights1', name: 'Party Lights', icon: '💡', desc: 'Sparkly lights!', effect: '+25% click power', cost: 1000000, clickBoost: 0.25, maxLevel: 6, costScale: 1.28, requires: { banner1: 3 } },
        { id: 'cake_deco1', name: 'Giant Cake Display', icon: '🎂', desc: 'Impressive centerpiece!', effect: '+35% passive', cost: 100000000, passiveBoost: 0.35, maxLevel: 5, costScale: 1.32, requires: { disco1: 2 } },
        { id: 'fountain1', name: 'Chocolate Fountain', icon: '⛲', desc: 'Delicious decoration!', effect: '+40% all income', cost: 1000000000, globalBoost: 0.40, maxLevel: 5, costScale: 1.32, requires: { lights1: 2 } },
        { id: 'fireworks1', name: 'Fireworks', icon: '🎆', desc: 'Spectacular display!', effect: '+50% all income', cost: 100e9, globalBoost: 0.50, maxLevel: 4, costScale: 1.35, requires: { cake_deco1: 2 } },
        { id: 'rainbow1', name: 'Rainbow Arch', icon: '🌈', desc: 'Magical rainbow!', effect: '+75% all income', cost: 25e12, globalBoost: 0.75, maxLevel: 3, costScale: 1.40, requires: { fireworks1: 2 } },
    ],

    // BOOST UPGRADES - Powerful multipliers and special effects
    boosts: [
        { id: 'sugar1', name: 'Sugar Rush', icon: '🍬', desc: 'Sweet energy boost!', effect: '2x clicks for 30s', cost: 1500, temporary: true, duration: 30, multiplier: 2, maxLevel: 1 },
        { id: 'party1', name: 'Party Mode', icon: '🥳', desc: 'Maximum party vibes!', effect: '2x all income for 60s', cost: 10000, temporary: true, duration: 60, multiplier: 2, maxLevel: 1, requires: { sugar1: 1 } },
        { id: 'lucky1', name: 'Lucky Charm', icon: '🍀', desc: '10% chance for 5x clicks', effect: 'Lucky clicks!', cost: 50000, luck: 0.10, luckMulti: 5, maxLevel: 10, costScale: 1.30 },
        { id: 'magnet1', name: 'Party Magnet', icon: '🧲', desc: 'Attract more party power!', effect: '+50% passive income', cost: 1000000, passiveBoost: 0.50, maxLevel: 8, costScale: 1.35, requires: { party1: 1 } },
        { id: 'clock1', name: 'Party Time', icon: '⏰', desc: 'Time flies when having fun!', effect: '+75% helper speed', cost: 25000000, helperBoost: 0.75, maxLevel: 6, costScale: 1.38, requires: { magnet1: 3 } },
        { id: 'star1', name: 'Star Power', icon: '⭐', desc: 'Starlight energy!', effect: '+5% per Party Star', cost: 2000000000, starBoost: 0.05, maxLevel: 10, costScale: 1.40, requires: { clock1: 2 } },
        { id: 'mega1', name: 'Mega Multiplier', icon: '🔥', desc: 'Everything is better!', effect: '+100% global', cost: 100e9, globalBoost: 1.0, maxLevel: 5, costScale: 1.50, requires: { star1: 3 } },
        { id: 'golden1', name: 'Golden Touch', icon: '👑', desc: 'Everything you touch turns to gold!', effect: '10x click power', cost: 10e12, clickMulti: 10, maxLevel: 3, costScale: 1.60, requires: { mega1: 2 } },
        { id: 'infinite1', name: 'Infinite Energy', icon: '♾️', desc: 'Unlimited power source!', effect: '+200% all income', cost: 1e15, globalBoost: 2.0, maxLevel: 3, costScale: 1.80, requires: { golden1: 2 } },
        { id: 'cosmic1', name: 'Cosmic Blessing', icon: '🌠', desc: 'Blessed by the party gods!', effect: '+500% all income', cost: 500e15, globalBoost: 5.0, maxLevel: 2, costScale: 2.0, requires: { infinite1: 2 } },
    ],

    // THEME UPGRADES - Visual styles
    themes: [
        { id: 'theme_night', name: 'Night Party', icon: '🌙', desc: 'Party under the stars!', effect: 'New visual style', cost: 25000, themeClass: 'theme-night', maxLevel: 1 },
        { id: 'theme_neon', name: 'Neon Dance Floor', icon: '💜', desc: 'Glow in the dark!', effect: 'Neon visual style', cost: 2000000, themeClass: 'theme-neon', maxLevel: 1, requires: { theme_night: 1 } },
        { id: 'theme_puppy', name: 'Puppy Pajama Party', icon: '💤', desc: 'Cozy puppy theme!', effect: 'Cozy visual style', cost: 250000000, themeClass: 'theme-puppy', maxLevel: 1, requires: { theme_neon: 1 } },
        { id: 'theme_panda', name: 'Red Panda Festival', icon: '🎋', desc: 'Bamboo paradise!', effect: 'Nature visual style', cost: 50000000000, themeClass: 'theme-panda', maxLevel: 1, requires: { theme_puppy: 1 } },
    ]
};

// ==========================================
// GAME INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    loadGame();
    initGame();
    startGameLoop();

    // Ensure helpers and decorations are loaded after everything is initialized
    // This handles both fresh loads and returning to the page
    setTimeout(() => {
        loadHelpers();
        loadDecorations();
        loadTheme();
    }, 150);
});

function initGame() {
    initCake();
    initTabs();
    initUpgrades();
    initRebirth();
    initBackButton();
    initPanelToggle();
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
// PANEL TOGGLE
// ==========================================

function initPanelToggle() {
    const panel = document.getElementById('upgradesPanel');
    const toggle = document.getElementById('panelToggle');

    if (!panel || !toggle) return;

    // Load saved state
    const isCollapsed = localStorage.getItem('shopCollapsed') === 'true';
    if (isCollapsed) {
        panel.classList.add('collapsed');
    }

    toggle.addEventListener('click', () => {
        panel.classList.toggle('collapsed');
        localStorage.setItem('shopCollapsed', panel.classList.contains('collapsed'));
        if (window.partyAudio) window.partyAudio.playClick();
    });
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
    // Use per-upgrade cost scaling if defined, otherwise default to 1.15
    const scale = upgrade.costScale || 1.15;
    return Math.floor(upgrade.cost * Math.pow(scale, level));
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

    // Special handling for clicking upgrades - add visual effects
    if (category === 'clicking') {
        addPartyElements(); // Refresh power ring and golden hour effect
    }

    // Special handling for boosts - add orb effects
    if (category === 'boosts') {
        addPartyElements(); // Refresh boost orbs
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
// INTERACTIVE HELPERS SYSTEM
// ==========================================

const helperSystem = {
    helpers: [],
    maxHelpers: 150, // No limit - show ALL helpers (max possible is ~123)
    updateInterval: null,
    helperScale: 1 // Will shrink as more helpers are added
};

const HELPER_PHRASES = {
    puppy: ['Woof!', 'Party time!', '*wags tail*', 'Yay!', '*happy dance*', 'Bork!', 'Best day ever!', '*spins*'],
    panda: ['Nom nom!', '*munch*', 'Bamboo!', 'So fluffy!', '*rolls around*', 'Yawn~', 'Snack time?', '*cuddles*'],
    bunny: ['Hop hop!', '*wiggles nose*', 'Wheee!', 'Bouncy!', '*thump thump*', 'Carrots!', '*zoomies*'],
    cat: ['Meow!', '*purrrr*', 'Party cat!', '*stretches*', 'Confetti!', '*naps*', 'Fancy!', '*pounces*'],
    special: ['Sparkle!', 'Magic!', '✨✨✨', 'Woooow!', '*glitters*', 'Amazing!', 'Enchanted!', '*shimmers*']
};

// Helper action emojis that appear when doing special things
const HELPER_ACTIONS = {
    dance: ['💃', '🕺', '🎵', '🎶'],
    sleep: ['💤', '😴', '💭'],
    eat: ['🍰', '🧁', '🍪', '🍭'],
    play: ['⚽', '🎾', '🎈', '🪀'],
    celebrate: ['🎉', '🥳', '🎊', '✨']
};

// Get a random position that avoids the center (where cake is)
function getRandomHelperPosition() {
    // The cake is in the center, so we create zones around it
    // Helpers can be in corners and edges, avoiding center 30-70% area
    const zones = [
        { minX: 5, maxX: 25, minY: 10, maxY: 90 },   // Left side
        { minX: 75, maxX: 95, minY: 10, maxY: 90 },  // Right side
        { minX: 25, maxX: 75, minY: 5, maxY: 25 },   // Top
        { minX: 25, maxX: 75, minY: 75, maxY: 95 },  // Bottom
    ];

    const zone = zones[Math.floor(Math.random() * zones.length)];
    return {
        x: zone.minX + Math.random() * (zone.maxX - zone.minX),
        y: zone.minY + Math.random() * (zone.maxY - zone.minY)
    };
}

function createInteractiveHelper(upgrade, index, scale) {
    const helpersArea = document.getElementById('helpersArea');
    if (!helpersArea) return null;

    const helper = document.createElement('div');
    helper.className = `helper ${upgrade.helperType}`;
    helper.textContent = upgrade.icon;
    helper.dataset.type = upgrade.helperType;
    helper.dataset.id = `helper-${Date.now()}-${index}`;

    // Random starting position (avoiding cake in center)
    const startPos = getRandomHelperPosition();
    helper.style.left = startPos.x + '%';
    helper.style.top = startPos.y + '%';

    // Apply scale for crowded scenes
    helper.style.fontSize = (2.8 * scale) + 'rem';

    // Direction (1 = right, -1 = left)
    const dir = Math.random() > 0.5 ? 1 : -1;
    helper.style.setProperty('--dir', dir);

    // Helper state - simplified for performance
    const helperData = {
        element: helper,
        x: startPos.x,
        y: startPos.y,
        targetX: startPos.x,
        targetY: startPos.y,
        direction: dir,
        state: 'idle',
        type: upgrade.helperType,
        speed: 0.15 + Math.random() * 0.1,
        nextActionTime: Date.now() + 2000 + Math.random() * 4000
    };

    // Click interaction
    helper.addEventListener('click', () => {
        helperClicked(helperData);
    });

    // No entering animation for performance
    helpersArea.appendChild(helper);

    return helperData;
}

function helperClicked(helperData) {
    const helper = helperData.element;

    // Play sound
    if (window.partyAudio) window.partyAudio.playGiggle();

    // Show speech bubble
    showHelperSpeech(helper, helperData.type);

    // Excited animation
    helper.classList.add('excited');
    setTimeout(() => helper.classList.remove('excited'), 900);

    // Small bonus
    const bonus = Math.max(1, Math.floor(calculateClickPower() * 0.1));
    gameState.partyPower += bonus;
    gameState.totalEarned += bonus;

    const rect = helper.getBoundingClientRect();
    showFloatingNumber(rect.left + rect.width/2, rect.top, `+${formatNumber(bonus)}`, '#81ecec');

    updateDisplay();
}

function showHelperSpeech(helper, type) {
    // Remove existing speech
    const existing = helper.querySelector('.helper-speech');
    if (existing) existing.remove();

    const phrases = HELPER_PHRASES[type] || HELPER_PHRASES.special;
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];

    const speech = document.createElement('div');
    speech.className = 'helper-speech';
    speech.textContent = phrase;
    helper.appendChild(speech);

    setTimeout(() => speech.remove(), 2000);
}

function updateHelpers() {
    const now = Date.now();

    helperSystem.helpers.forEach(helperData => {
        if (!helperData.element.parentElement) return;

        // Time for new action?
        if (now >= helperData.nextActionTime) {
            decideHelperAction(helperData);
            helperData.nextActionTime = now + 2000 + Math.random() * 4000;
        }

        // Move if walking
        if (helperData.state === 'walking') {
            moveHelper(helperData);
        }
    });
}

function decideHelperAction(helperData) {
    const action = Math.random();

    if (action < 0.4) {
        // Walk to new position (avoiding center cake area)
        helperData.state = 'walking';
        const newPos = getRandomHelperPosition();
        helperData.targetX = newPos.x;
        helperData.targetY = newPos.y;
        helperData.direction = helperData.targetX > helperData.x ? 1 : -1;
        helperData.element.style.setProperty('--dir', helperData.direction);
        helperData.element.classList.add('walking');
    } else if (action < 0.5) {
        // Random speech (less frequent for performance)
        helperData.state = 'idle';
        helperData.element.classList.remove('walking');
        showHelperSpeech(helperData.element, helperData.type);
    } else if (action < 0.6) {
        // Do a special action (dance, sleep, eat, etc.)
        helperData.state = 'idle';
        helperData.element.classList.remove('walking');
        doHelperSpecialAction(helperData);
    } else if (action < 0.7) {
        // Celebrate (jump and show emojis)
        helperData.state = 'idle';
        helperData.element.classList.remove('walking');
        helperCelebrate(helperData);
    } else if (action < 0.8) {
        // Look at cake (turn towards center)
        helperData.state = 'idle';
        helperData.element.classList.remove('walking');
        helperLookAtCake(helperData);
    } else {
        // Just idle
        helperData.state = 'idle';
        helperData.element.classList.remove('walking');
    }
}

// Helper does a special action with emoji
function doHelperSpecialAction(helperData) {
    const actions = ['dance', 'sleep', 'eat', 'play'];
    const actionType = actions[Math.floor(Math.random() * actions.length)];
    const emojis = HELPER_ACTIONS[actionType];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];

    // Add action class
    helperData.element.classList.add('doing-action');

    // Show action emoji above helper
    showHelperActionEmoji(helperData.element, emoji);

    // Remove after animation
    setTimeout(() => {
        helperData.element.classList.remove('doing-action');
    }, 2000);
}

// Helper celebrates with jump and sparkles
function helperCelebrate(helperData) {
    const emojis = HELPER_ACTIONS.celebrate;
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];

    helperData.element.classList.add('celebrating');
    showHelperActionEmoji(helperData.element, emoji);

    if (window.partyAudio && Math.random() < 0.3) {
        window.partyAudio.playSparkle();
    }

    setTimeout(() => {
        helperData.element.classList.remove('celebrating');
    }, 1500);
}

// Helper turns to look at the cake
function helperLookAtCake(helperData) {
    // Face towards center (cake is at 50%)
    const newDir = helperData.x < 50 ? 1 : -1;
    helperData.direction = newDir;
    helperData.element.style.setProperty('--dir', newDir);

    // Show admiring expression
    if (Math.random() < 0.5) {
        showHelperSpeech(helperData.element, helperData.type);
    }
}

// Show emoji above helper for actions
function showHelperActionEmoji(helper, emoji) {
    const existing = helper.querySelector('.helper-action');
    if (existing) existing.remove();

    const action = document.createElement('div');
    action.className = 'helper-action';
    action.textContent = emoji;
    helper.appendChild(action);

    setTimeout(() => action.remove(), 2000);
}

function moveHelper(helperData) {
    const diffX = helperData.targetX - helperData.x;
    const diffY = helperData.targetY - helperData.y;
    const dist = Math.sqrt(diffX * diffX + diffY * diffY);

    if (dist < 1) {
        // Arrived
        helperData.state = 'idle';
        helperData.element.classList.remove('walking');
        return;
    }

    // Move towards target (normalized direction)
    const moveX = (diffX / dist) * helperData.speed;
    const moveY = (diffY / dist) * helperData.speed;

    helperData.x += moveX;
    helperData.y += moveY;
    helperData.element.style.left = helperData.x + '%';
    helperData.element.style.top = helperData.y + '%';

    // Update direction based on horizontal movement
    if (Math.abs(diffX) > 0.5) {
        helperData.direction = diffX > 0 ? 1 : -1;
        helperData.element.style.setProperty('--dir', helperData.direction);
    }
}

function tryHelperInteraction(helperData) {
    // Find nearby helper using 2D distance
    const nearby = helperSystem.helpers.find(other => {
        if (other === helperData) return false;
        const dx = other.x - helperData.x;
        const dy = other.y - helperData.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < 20;
    });

    if (nearby) {
        // Show hearts!
        helperData.element.classList.add('hearts');
        nearby.element.classList.add('hearts');

        setTimeout(() => {
            helperData.element.classList.remove('hearts');
            nearby.element.classList.remove('hearts');
        }, 1000);

        // Both say something
        showHelperSpeech(helperData.element, helperData.type);
        setTimeout(() => {
            showHelperSpeech(nearby.element, nearby.type);
        }, 300);

        if (window.partyAudio) window.partyAudio.playSparkle();
    }
}

function addHelper(upgrade) {
    if (helperSystem.helpers.length >= helperSystem.maxHelpers) return;

    // Recalculate scale with new helper (same logic as loadHelpers)
    const totalHelpers = helperSystem.helpers.length + 1;
    let scale = 1.0;
    if (totalHelpers > 100) {
        scale = 0.22;
    } else if (totalHelpers > 75) {
        scale = 0.28;
    } else if (totalHelpers > 50) {
        scale = 0.35;
    } else if (totalHelpers > 30) {
        scale = 0.45;
    } else if (totalHelpers > 15) {
        scale = 0.6;
    } else if (totalHelpers > 5) {
        scale = 0.8;
    }

    // If scale changed significantly, reload all helpers to resize them
    if (Math.abs(scale - helperSystem.helperScale) > 0.05) {
        loadHelpers();
        return;
    }

    const helperData = createInteractiveHelper(upgrade, helperSystem.helpers.length, scale);
    if (helperData) {
        helperSystem.helpers.push(helperData);
    }

    // Start update loop if not running
    if (!helperSystem.updateInterval) {
        const updateSpeed = totalHelpers > 50 ? 250 : (totalHelpers > 30 ? 200 : 100);
        helperSystem.updateInterval = setInterval(updateHelpers, updateSpeed);
    }
}

function loadHelpers() {
    const helpersArea = document.getElementById('helpersArea');
    if (!helpersArea) return;

    // Clear existing helpers
    helpersArea.innerHTML = '';
    helperSystem.helpers = [];

    // Stop existing update loop
    if (helperSystem.updateInterval) {
        clearInterval(helperSystem.updateInterval);
        helperSystem.updateInterval = null;
    }

    // Count total helpers first to calculate scale
    let totalHelpers = 0;
    UPGRADES.helpers.forEach(upgrade => {
        totalHelpers += gameState.upgrades[upgrade.id] || 0;
    });

    // Calculate scale - shrink helpers as more are added
    // This ensures ALL helpers fit on screen, even at max (123 helpers)
    // 1-5 helpers: full size (1.0)
    // 6-15 helpers: large (0.8)
    // 16-30 helpers: medium (0.6)
    // 31-50 helpers: small (0.45)
    // 51-75 helpers: tiny (0.35)
    // 76-100 helpers: mini (0.28)
    // 100+ helpers: micro (0.22) - packed party!
    let scale = 1.0;
    if (totalHelpers > 100) {
        scale = 0.22;
    } else if (totalHelpers > 75) {
        scale = 0.28;
    } else if (totalHelpers > 50) {
        scale = 0.35;
    } else if (totalHelpers > 30) {
        scale = 0.45;
    } else if (totalHelpers > 15) {
        scale = 0.6;
    } else if (totalHelpers > 5) {
        scale = 0.8;
    }
    helperSystem.helperScale = scale;

    // Create ALL helpers
    let count = 0;
    UPGRADES.helpers.forEach(upgrade => {
        const level = gameState.upgrades[upgrade.id] || 0;
        // Show ALL purchased helpers
        for (let i = 0; i < level && count < helperSystem.maxHelpers; i++) {
            const helperData = createInteractiveHelper(upgrade, count, scale);
            if (helperData) {
                helperSystem.helpers.push(helperData);
                count++;
            }
        }
    });

    // Start update loop with slower interval for many helpers
    if (helperSystem.helpers.length > 0) {
        // Slow down updates when there are many helpers for performance
        let updateSpeed = 100;
        if (totalHelpers > 100) {
            updateSpeed = 300; // Very slow for 100+ helpers
        } else if (totalHelpers > 50) {
            updateSpeed = 250;
        } else if (totalHelpers > 30) {
            updateSpeed = 200;
        } else if (totalHelpers > 15) {
            updateSpeed = 150;
        }
        helperSystem.updateInterval = setInterval(updateHelpers, updateSpeed);
    }

    // Add party elements (visual effects for other upgrades)
    addPartyElements();
}

// ==========================================
// PARTY SCENE ELEMENTS
// ==========================================

function addPartyElements() {
    const scene = document.getElementById('partyScene');
    if (!scene) return;

    // Remove old party elements
    scene.querySelectorAll('.party-element, .click-power-ring, .boost-orb, .streamer, .passive-indicator').forEach(el => el.remove());

    // Calculate total party elements for scaling
    const balloonLevel = gameState.upgrades['balloon1'] || 0;
    const streamerLevel = gameState.upgrades['streamer1'] || 0;
    const discoLevel = gameState.upgrades['disco1'] || 0;
    const totalElements = balloonLevel + streamerLevel + discoLevel;

    // Scale elements down as more are added
    let elementScale = 1.0;
    if (totalElements > 20) {
        elementScale = 0.6;
    } else if (totalElements > 15) {
        elementScale = 0.7;
    } else if (totalElements > 10) {
        elementScale = 0.8;
    } else if (totalElements > 5) {
        elementScale = 0.9;
    }

    // Add floating balloons based on decorations - ALL of them
    const balloonEmojis = ['🎈', '🎈', '🎈', '🎀', '🎁', '🎈', '🎈', '🎊', '🎈', '🎈'];
    for (let i = 0; i < balloonLevel; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'party-element floating-balloon';
        balloon.textContent = balloonEmojis[i % balloonEmojis.length];
        // Spread balloons across the top and sides
        const xPos = 5 + (i * 9) % 90;
        balloon.style.left = xPos + '%';
        balloon.style.top = (3 + Math.random() * 15 + (i % 3) * 5) + '%';
        balloon.style.animationDelay = (i * 0.3) + 's';
        balloon.style.fontSize = (2 * elementScale) + 'rem';
        scene.appendChild(balloon);
    }

    // Add streamers based on streamer upgrade - ALL of them
    if (streamerLevel > 0) {
        const colors = ['#e91e8c', '#9b59b6', '#3498db', '#2ecc71', '#f39c12', '#e74c3c', '#1abc9c', '#f1c40f', '#8e44ad', '#16a085'];
        const streamerWidth = Math.max(90 / streamerLevel, 5);
        for (let i = 0; i < streamerLevel; i++) {
            const streamer = document.createElement('div');
            streamer.className = 'streamer';
            streamer.style.left = (5 + i * streamerWidth) + '%';
            streamer.style.top = '0';
            streamer.style.background = `linear-gradient(180deg, ${colors[i % colors.length]}, transparent)`;
            streamer.style.animationDelay = (i * 0.2) + 's';
            streamer.style.width = Math.max(3, 8 * elementScale) + 'px';
            scene.appendChild(streamer);
        }
    }

    // Add disco lights if disco ball owned - ALL of them
    if (discoLevel > 0) {
        const lightSpacing = 80 / Math.max(discoLevel, 1);
        for (let i = 0; i < discoLevel; i++) {
            const light = document.createElement('div');
            light.className = 'party-element disco-light';
            light.style.left = (10 + i * lightSpacing) + '%';
            light.style.top = (15 + (i % 2) * 10) + '%';
            light.style.animationDelay = (i * 0.5) + 's';
            light.style.transform = `scale(${elementScale})`;
            scene.appendChild(light);
        }
    }

    // Add click power ring if click upgrades owned
    const totalClickLevel = UPGRADES.clicking.reduce((sum, u) => sum + (gameState.upgrades[u.id] || 0), 0);
    if (totalClickLevel >= 5) {
        const ring = document.createElement('div');
        ring.className = 'click-power-ring';
        ring.classList.add(totalClickLevel >= 20 ? 'powered' : 'active');
        const cakeContainer = document.querySelector('.main-cake-container');
        if (cakeContainer) cakeContainer.appendChild(ring);
    }

    // Add boost orbs for active boosts
    addBoostOrbs(scene);

    // Add passive income indicator if helpers owned
    const passiveIncome = calculatePassiveIncome();
    if (passiveIncome > 0) {
        const indicator = document.createElement('div');
        indicator.className = 'passive-indicator';
        indicator.innerHTML = `<span class="income-icon">⚡</span> +${formatNumber(passiveIncome)}/sec`;
        scene.appendChild(indicator);
    }

    // Golden hour effect if very high click power
    if (totalClickLevel >= 30) {
        scene.classList.add('golden-hour');
    } else {
        scene.classList.remove('golden-hour');
    }

    // Add confetti if confetti cannon owned (only start once)
    const confettiLevel = gameState.upgrades['confetti1'] || 0;
    if (confettiLevel > 0 && !scene.dataset.confettiStarted) {
        scene.dataset.confettiStarted = 'true';
        setInterval(() => {
            if (Math.random() < 0.2) {
                createSceneConfetti(scene);
            }
        }, 600);
    }
}

function addBoostOrbs(scene) {
    const cakeContainer = document.querySelector('.main-cake-container');
    if (!cakeContainer) return;

    // Lucky charm orb
    const luckyLevel = gameState.upgrades['lucky1'] || 0;
    if (luckyLevel > 0) {
        const orb = document.createElement('div');
        orb.className = 'boost-orb luck';
        orb.textContent = '🍀';
        cakeContainer.appendChild(orb);
    }

    // Clock/speed orb
    const clockLevel = gameState.upgrades['clock1'] || 0;
    if (clockLevel > 0) {
        const orb = document.createElement('div');
        orb.className = 'boost-orb speed';
        orb.textContent = '⏰';
        cakeContainer.appendChild(orb);
    }

    // Star power orb
    const starLevel = gameState.upgrades['star1'] || 0;
    if (starLevel > 0 && gameState.partyStars > 0) {
        const orb = document.createElement('div');
        orb.className = 'boost-orb star';
        orb.textContent = '⭐';
        cakeContainer.appendChild(orb);
    }

    // Mega/power orb
    const megaLevel = gameState.upgrades['mega1'] || 0;
    if (megaLevel > 0) {
        const orb = document.createElement('div');
        orb.className = 'boost-orb power';
        orb.textContent = '🔥';
        cakeContainer.appendChild(orb);
    }
}

function createSceneConfetti(scene) {
    const confetti = document.createElement('div');
    confetti.className = 'party-element confetti-piece';
    confetti.style.left = (10 + Math.random() * 80) + '%';
    confetti.style.top = '10%';
    confetti.style.background = ['#e91e8c', '#9b59b6', '#3498db', '#f39c12', '#2ecc71'][Math.floor(Math.random() * 5)];
    confetti.style.animationDuration = (2 + Math.random() * 2) + 's';

    scene.appendChild(confetti);
    setTimeout(() => confetti.remove(), 4000);
}

// ==========================================
// DECORATIONS
// ==========================================

function addDecoration() {
    // Reload all decorations to properly rescale them
    loadDecorations();
    addPartyElements();
}

function loadDecorations() {
    const layer = document.getElementById('decorationsLayer');
    if (!layer) return;

    layer.innerHTML = '';

    // Count total decorations first to calculate scale
    let totalDecorations = 0;
    UPGRADES.decorations.forEach(upgrade => {
        totalDecorations += gameState.upgrades[upgrade.id] || 0;
    });

    // Calculate scale - shrink decorations as more are added
    // Max possible is ~65 decorations at full upgrades
    // 1-10 decorations: full size (1.0)
    // 11-20 decorations: large (0.85)
    // 21-35 decorations: medium (0.7)
    // 36-50 decorations: small (0.55)
    // 50+ decorations: tiny (0.45) - packed party!
    let scale = 1.0;
    if (totalDecorations > 50) {
        scale = 0.45;
    } else if (totalDecorations > 35) {
        scale = 0.55;
    } else if (totalDecorations > 20) {
        scale = 0.7;
    } else if (totalDecorations > 10) {
        scale = 0.85;
    }

    // Create ALL decorations - spread them across the party scene
    UPGRADES.decorations.forEach(upgrade => {
        const level = gameState.upgrades[upgrade.id] || 0;
        // Show ALL purchased decorations
        for (let i = 0; i < level; i++) {
            const deco = document.createElement('div');
            deco.className = 'decoration';
            deco.textContent = upgrade.icon;

            // Spread decorations across more of the scene
            // Some at top, some at sides, some near bottom (but not center where cake is)
            const zone = Math.random();
            let left, top;
            if (zone < 0.3) {
                // Top area
                left = 5 + Math.random() * 90;
                top = 2 + Math.random() * 20;
            } else if (zone < 0.5) {
                // Left side
                left = 2 + Math.random() * 20;
                top = 10 + Math.random() * 80;
            } else if (zone < 0.7) {
                // Right side
                left = 78 + Math.random() * 20;
                top = 10 + Math.random() * 80;
            } else {
                // Bottom corners (avoiding center)
                if (Math.random() < 0.5) {
                    left = 5 + Math.random() * 25;
                } else {
                    left = 70 + Math.random() * 25;
                }
                top = 70 + Math.random() * 25;
            }

            deco.style.left = left + '%';
            deco.style.top = top + '%';
            deco.style.animationDelay = Math.random() * 2 + 's';

            // Apply scale
            const baseSize = 1.5 + Math.random() * 0.5;
            deco.style.fontSize = (baseSize * scale) + 'rem';

            layer.appendChild(deco);
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
        if (gameState.partyPower >= 100000000000) { // 100 billion
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
    // Rebirth at 100 billion, gain stars based on sqrt of power/100B
    return Math.floor(Math.sqrt(gameState.partyPower / 100000000000));
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
    { id: 'ten_million', name: 'Party Millionaire!', icon: '💎', condition: () => gameState.totalEarned >= 10000000 },
    { id: 'billion', name: 'Party Billionaire!', icon: '🌟', condition: () => gameState.totalEarned >= 1000000000 },
    { id: 'hundred_billion', name: 'Party Tycoon!', icon: '🎯', condition: () => gameState.totalEarned >= 100000000000 },
    { id: 'trillion', name: 'Party Trillionaire!', icon: '🔮', condition: () => gameState.totalEarned >= 1e12 },
    { id: 'quadrillion', name: 'Party Overlord!', icon: '🌈', condition: () => gameState.totalEarned >= 1e15 },
    { id: 'quintillion', name: 'Party GOD!', icon: '👼', condition: () => gameState.totalEarned >= 1e18 },
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

    const REBIRTH_THRESHOLD = 100000000000; // 100 billion
    if (gameState.partyPower >= REBIRTH_THRESHOLD) {
        rebirthBtn.disabled = false;
        const stars = calculateRebirthStars();
        rebirthInfo.textContent = `Gain ${stars} Party Star${stars !== 1 ? 's' : ''}!`;
    } else {
        rebirthBtn.disabled = true;
        rebirthInfo.textContent = `Need ${formatNumber(REBIRTH_THRESHOLD - gameState.partyPower)} more`;
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
