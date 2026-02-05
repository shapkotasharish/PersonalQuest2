/* ============================================
   PARTY POWER - GLOBAL AUDIO SYSTEM
   With Real Music Player & Shuffle
   ============================================ */

// Song library - using exact file names from Naavya's playlist
const SONG_LIBRARY = [
    { file: 'Firework.mp3', title: 'Firework', color: '#e74c3c' },
    { file: 'Golden.mp3', title: 'Golden', color: '#f1c40f' },
    { file: 'Mean Girls.mp3', title: 'Mean Girls', color: '#e91e8c' },
    { file: 'NUNU NANA.mp3', title: 'NUNU NANA', color: '#9b59b6' },
    { file: 'Newsflash.mp3', title: 'Newsflash', color: '#3498db' },
    { file: 'Numb Little Bug.mp3', title: 'Numb Little Bug', color: '#1abc9c' },
    { file: 'On The Ground.mp3', title: 'On The Ground', color: '#f39c12' },
    { file: 'Rockstar.mp3', title: 'Rockstar', color: '#2c3e50' },
    { file: 'Strategy.mp3', title: 'Strategy', color: '#8e44ad' },
    { file: 'ZOOM.mp3', title: 'ZOOM', color: '#e74c3c' },
    { file: 'like JENNIE.mp3', title: 'like JENNIE', color: '#e91e8c' }
];

class PartyAudio {
    constructor() {
        this.audioContext = null;
        this.isMuted = localStorage.getItem('partyAudioMuted') === 'true';
        this.volume = parseFloat(localStorage.getItem('partyAudioVolume')) || 0.3;
        this.musicVolume = parseFloat(localStorage.getItem('partyMusicVolume')) || 0.5;
        this.initialized = false;
        this.bgMusicNode = null;
        this.bgMusicGain = null;
        this.currentTrack = null;

        // Music player state
        this.musicPlayer = null;
        this.playlist = [];
        this.currentSongIndex = -1;
        this.isPlaying = false;
        this.currentSong = null;
        this.hasUserInteracted = false;
        this.autoplayBlocked = false;
    }

    // Initialize audio context on first user interaction
    init() {
        if (this.initialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.value = this.isMuted ? 0 : this.volume;
            this.initialized = true;

            // Initialize music player
            this.initMusicPlayer();

            console.log('Audio system initialized');
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
        }
    }

    // Initialize the music player
    initMusicPlayer() {
        this.musicPlayer = new Audio();
        this.musicPlayer.volume = this.isMuted ? 0 : this.musicVolume;

        // When song ends, play next
        this.musicPlayer.addEventListener('ended', () => {
            this.playNextSong();
        });

        // Update UI when metadata loads
        this.musicPlayer.addEventListener('loadedmetadata', () => {
            this.updateNowPlayingUI();
        });

        // Save playback position periodically for cross-page persistence
        this.musicPlayer.addEventListener('timeupdate', () => {
            if (this.isPlaying && this.musicPlayer.currentTime > 0) {
                sessionStorage.setItem('partySongTime', this.musicPlayer.currentTime.toString());
            }
        });

        // Shuffle and prepare playlist
        this.shufflePlaylist();
    }

    // Shuffle the playlist
    shufflePlaylist() {
        // Check if we have a saved playlist order from sessionStorage
        const savedPlaylist = sessionStorage.getItem('partyPlaylist');
        const savedIndex = sessionStorage.getItem('partySongIndex');
        const savedTime = sessionStorage.getItem('partySongTime');

        if (savedPlaylist) {
            try {
                this.playlist = JSON.parse(savedPlaylist);
                this.currentSongIndex = savedIndex ? parseInt(savedIndex) - 1 : -1;
                this.savedTime = savedTime ? parseFloat(savedTime) : 0;
                return;
            } catch (e) {
                // Fall through to normal shuffle
            }
        }

        this.playlist = [...SONG_LIBRARY];
        // Fisher-Yates shuffle
        for (let i = this.playlist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.playlist[i], this.playlist[j]] = [this.playlist[j], this.playlist[i]];
        }
        this.currentSongIndex = -1;
        this.savedTime = 0;

        // Save the shuffled playlist
        sessionStorage.setItem('partyPlaylist', JSON.stringify(this.playlist));
    }

    // Start playing music
    startMusic() {
        if (!this.musicPlayer) {
            this.initMusicPlayer();
        }
        this.playNextSong();
    }

    // Play next song in shuffled playlist
    playNextSong() {
        this.currentSongIndex++;

        // If we've played all songs, reshuffle
        if (this.currentSongIndex >= this.playlist.length) {
            // Clear saved playlist to get a fresh shuffle
            sessionStorage.removeItem('partyPlaylist');
            this.playlist = [...SONG_LIBRARY];
            for (let i = this.playlist.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.playlist[i], this.playlist[j]] = [this.playlist[j], this.playlist[i]];
            }
            sessionStorage.setItem('partyPlaylist', JSON.stringify(this.playlist));
            this.currentSongIndex = 0;
        }

        this.currentSong = this.playlist[this.currentSongIndex];
        const songPath = `music/${encodeURIComponent(this.currentSong.file)}`;

        this.musicPlayer.src = songPath;
        this.musicPlayer.volume = this.isMuted ? 0 : this.musicVolume;

        // Save current state
        sessionStorage.setItem('partySongIndex', this.currentSongIndex.toString());

        this.musicPlayer.play().then(() => {
            this.isPlaying = true;
            this.autoplayBlocked = false;

            // Restore saved position if we have one
            if (this.savedTime && this.savedTime > 0) {
                this.musicPlayer.currentTime = this.savedTime;
                this.savedTime = 0;
            }

            this.updateNowPlayingUI();
        }).catch(e => {
            console.warn('Could not play music:', e);
            this.autoplayBlocked = true;
            this.updateNowPlayingUI();
            // Don't auto-retry, wait for user interaction
        });
    }

    // Skip to next song
    skipSong() {
        this.playNextSong();
    }

    // Pause/resume music
    toggleMusic() {
        if (!this.musicPlayer) return;

        if (this.isPlaying) {
            this.musicPlayer.pause();
            this.isPlaying = false;
        } else {
            this.musicPlayer.play();
            this.isPlaying = true;
        }
        this.updateNowPlayingUI();
    }

    // Update now playing UI
    updateNowPlayingUI() {
        const container = document.getElementById('nowPlaying');
        if (!container || !this.currentSong) return;

        const titleEl = container.querySelector('.np-title');
        const barsContainer = container.querySelector('.np-bars');

        if (titleEl) titleEl.textContent = this.currentSong.title;

        // Update color theme
        container.style.setProperty('--song-color', this.currentSong.color);

        // Update playing animation
        if (barsContainer) {
            if (this.isPlaying && !this.isMuted) {
                barsContainer.classList.add('playing');
            } else {
                barsContainer.classList.remove('playing');
            }
        }

        // Show the container
        container.classList.add('visible');
    }

    // Toggle mute
    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('partyAudioMuted', this.isMuted);

        if (this.masterGain) {
            this.masterGain.gain.value = this.isMuted ? 0 : this.volume;
        }

        if (this.musicPlayer) {
            this.musicPlayer.volume = this.isMuted ? 0 : this.musicVolume;
        }

        this.updateNowPlayingUI();
        return this.isMuted;
    }

    // Set SFX volume (0-1)
    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
        localStorage.setItem('partyAudioVolume', this.volume);
        if (this.masterGain && !this.isMuted) {
            this.masterGain.gain.value = this.volume;
        }
    }

    // Set music volume (0-1)
    setMusicVolume(value) {
        this.musicVolume = Math.max(0, Math.min(1, value));
        localStorage.setItem('partyMusicVolume', this.musicVolume);
        if (this.musicPlayer && !this.isMuted) {
            this.musicPlayer.volume = this.musicVolume;
        }
    }

    // Stop music
    stopMusic() {
        if (this.musicPlayer) {
            this.musicPlayer.pause();
            this.musicPlayer.currentTime = 0;
            this.isPlaying = false;
        }
    }

    // Create oscillator-based sound effect
    playTone(frequency, duration, type = 'sine', attack = 0.01, decay = 0.1) {
        if (!this.initialized || !this.audioContext) return;

        const osc = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        osc.connect(gainNode);
        gainNode.connect(this.masterGain);

        osc.type = type;
        osc.frequency.value = frequency;

        const now = this.audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + attack);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

        osc.start(now);
        osc.stop(now + duration);
    }

    // Sound effects (same as before)
    playHover() {
        if (!this.initialized) return;
        this.playTone(800, 0.1, 'sine', 0.01, 0.05);
    }

    playClick() {
        if (!this.initialized) return;
        this.playTone(400, 0.15, 'sine', 0.005, 0.1);
        setTimeout(() => this.playTone(600, 0.1, 'sine', 0.005, 0.05), 30);
    }

    playSparkle() {
        if (!this.initialized) return;
        const notes = [523, 659, 784, 1047];
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.2, 'sine', 0.01, 0.1), i * 60);
        });
    }

    playPop() {
        if (!this.initialized || !this.audioContext) return;

        const osc = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGain);

        osc.type = 'sawtooth';
        osc.frequency.value = 150;
        filter.type = 'lowpass';
        filter.frequency.value = 1000;

        const now = this.audioContext.currentTime;
        gainNode.gain.setValueAtTime(0.4, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);

        osc.start(now);
        osc.stop(now + 0.15);
    }

    playGiggle() {
        if (!this.initialized) return;
        const notes = [400, 500, 400, 600, 500];
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.08, 'sine', 0.01, 0.04), i * 50);
        });
    }

    playSuccess() {
        if (!this.initialized) return;
        const notes = [392, 523, 659, 784];
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.25, 'sine', 0.02, 0.15), i * 100);
        });
    }

    playWhoosh() {
        if (!this.initialized || !this.audioContext) return;

        const osc = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGain);

        osc.type = 'sawtooth';
        filter.type = 'bandpass';
        filter.Q.value = 1;

        const now = this.audioContext.currentTime;
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
        filter.frequency.setValueAtTime(200, now);
        filter.frequency.exponentialRampToValueAtTime(2000, now + 0.15);

        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.15, now + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        osc.start(now);
        osc.stop(now + 0.2);
    }

    playMagicalChime() {
        if (!this.initialized) return;
        const notes = [523, 659, 784, 880, 1047, 1319];
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.4, 'sine', 0.02, 0.25), i * 80);
        });
    }

    playOops() {
        if (!this.initialized) return;
        this.playTone(300, 0.15, 'sine', 0.01, 0.1);
        setTimeout(() => this.playTone(250, 0.2, 'sine', 0.01, 0.1), 100);
    }

    playCoin() {
        if (!this.initialized) return;
        this.playTone(880, 0.08, 'square', 0.005, 0.04);
        setTimeout(() => this.playTone(1100, 0.12, 'square', 0.005, 0.06), 60);
    }

    playUpgrade() {
        if (!this.initialized) return;
        const notes = [440, 554, 659, 880];
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.15, 'triangle', 0.01, 0.08), i * 70);
        });
    }

    playLevelUp() {
        if (!this.initialized) return;
        const notes = [262, 330, 392, 523, 659, 784, 1047];
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.3, 'sine', 0.02, 0.2), i * 100);
        });
    }

    playGameOver() {
        if (!this.initialized) return;
        const notes = [400, 350, 300, 250];
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.3, 'sine', 0.02, 0.2), i * 150);
        });
    }

    playCatch() {
        if (!this.initialized) return;
        this.playTone(600, 0.1, 'sine', 0.005, 0.05);
        this.playTone(800, 0.1, 'sine', 0.005, 0.05);
    }

    playWhack() {
        if (!this.initialized || !this.audioContext) return;

        const osc = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        osc.connect(gainNode);
        gainNode.connect(this.masterGain);

        osc.type = 'square';
        osc.frequency.value = 200;

        const now = this.audioContext.currentTime;
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);

        osc.start(now);
        osc.stop(now + 0.1);
    }

    playEggFound() {
        if (!this.initialized) return;
        const notes = [659, 784, 988, 1319];
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.2, 'sine', 0.01, 0.12), i * 70);
        });
    }

    playChaos() {
        if (!this.initialized) return;
        const freq = 200 + Math.random() * 800;
        const type = ['sine', 'square', 'triangle', 'sawtooth'][Math.floor(Math.random() * 4)];
        this.playTone(freq, 0.1, type, 0.01, 0.05);
    }

    // Legacy method - now starts real music
    startBgMusic(type = 'landing') {
        this.startMusic();
    }

    stopBgMusic() {
        // Don't stop music when changing pages - let it continue
    }
}

// Create global audio instance
window.partyAudio = new PartyAudio();

// Create now playing UI
function createNowPlayingUI() {
    // Check if already exists
    if (document.getElementById('nowPlaying')) return;

    const isCollapsed = localStorage.getItem('npCollapsed') === 'true';

    const container = document.createElement('div');
    container.id = 'nowPlaying';
    container.className = 'now-playing visible' + (isCollapsed ? ' collapsed' : '');
    container.innerHTML = `
        <button class="np-collapse" title="Collapse">◀</button>
        <div class="np-bars">
            <div class="np-bar"></div>
            <div class="np-bar"></div>
            <div class="np-bar"></div>
            <div class="np-bar"></div>
            <div class="np-bar"></div>
        </div>
        <div class="np-info">
            <div class="np-title">Click to play music!</div>
        </div>
        <button class="np-skip" title="Skip">⏭️</button>
    `;

    // Collapse button
    container.querySelector('.np-collapse').addEventListener('click', (e) => {
        e.stopPropagation();
        container.classList.toggle('collapsed');
        localStorage.setItem('npCollapsed', container.classList.contains('collapsed'));
    });

    // Skip button
    container.querySelector('.np-skip').addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.partyAudio) {
            window.partyAudio.skipSong();
            window.partyAudio.playClick();
        }
    });

    // Click to toggle play/pause (or start if autoplay was blocked)
    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('np-collapse') || e.target.classList.contains('np-skip')) return;

        if (window.partyAudio) {
            // If music hasn't started yet (autoplay blocked), start it
            if (window.partyAudio.autoplayBlocked || !window.partyAudio.isPlaying) {
                window.partyAudio.init();
                window.partyAudio.startMusic();
            } else {
                window.partyAudio.toggleMusic();
            }
        }
    });

    document.body.appendChild(container);

    // Add styles
    addNowPlayingStyles();
}

function addNowPlayingStyles() {
    if (document.getElementById('nowPlayingStyles')) return;

    const styles = document.createElement('style');
    styles.id = 'nowPlayingStyles';
    styles.textContent = `
        .now-playing {
            position: fixed;
            top: 70px;
            right: 16px;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 12px 18px;
            display: flex;
            align-items: center;
            gap: 14px;
            z-index: 1000;
            cursor: pointer;
            opacity: 1;
            transform: translateX(0);
            transition: all 0.3s ease;
            border: 3px solid rgba(255, 255, 255, 0.15);
            max-width: 320px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .now-playing:hover {
            background: rgba(0, 0, 0, 0.85);
            border-color: var(--song-color, #e91e8c);
            box-shadow: 0 4px 25px rgba(0, 0, 0, 0.4), 0 0 20px var(--song-color, #e91e8c);
        }

        /* Collapse button */
        .np-collapse {
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.8rem;
            cursor: pointer;
            padding: 4px;
            transition: all 0.2s ease;
            flex-shrink: 0;
        }

        .np-collapse:hover {
            color: white;
            transform: scale(1.2);
        }

        /* Collapsed state */
        .now-playing.collapsed {
            padding: 10px 14px;
            max-width: 80px;
        }

        .now-playing.collapsed .np-info,
        .now-playing.collapsed .np-skip {
            display: none;
        }

        .now-playing.collapsed .np-collapse {
            transform: rotate(180deg);
        }

        .now-playing.collapsed:hover .np-collapse {
            transform: rotate(180deg) scale(1.2);
        }

        /* Music bars animation */
        .np-bars {
            display: flex;
            align-items: flex-end;
            gap: 3px;
            height: 32px;
            min-width: 28px;
        }

        .np-bar {
            width: 4px;
            background: var(--song-color, #e91e8c);
            border-radius: 3px;
            height: 6px;
            transition: height 0.1s ease;
        }

        .np-bars.playing .np-bar {
            animation: musicBar 0.5s ease-in-out infinite;
        }

        .np-bars.playing .np-bar:nth-child(1) { animation-delay: 0s; }
        .np-bars.playing .np-bar:nth-child(2) { animation-delay: 0.1s; }
        .np-bars.playing .np-bar:nth-child(3) { animation-delay: 0.15s; }
        .np-bars.playing .np-bar:nth-child(4) { animation-delay: 0.25s; }
        .np-bars.playing .np-bar:nth-child(5) { animation-delay: 0.35s; }

        @keyframes musicBar {
            0%, 100% { height: 6px; }
            50% { height: 28px; }
        }

        /* Song info */
        .np-info {
            flex: 1;
            min-width: 0;
            overflow: hidden;
        }

        .np-title {
            font-family: 'Fredoka', sans-serif;
            font-size: 1.1rem;
            font-weight: 600;
            color: white;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        /* Skip button */
        .np-skip {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            font-size: 1.4rem;
            cursor: pointer;
            opacity: 0.8;
            transition: all 0.2s ease;
            padding: 8px;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .np-skip:hover {
            opacity: 1;
            transform: scale(1.15);
            background: rgba(255, 255, 255, 0.2);
        }

        /* Responsive */
        @media (max-width: 600px) {
            .now-playing {
                top: auto;
                bottom: 80px;
                right: 10px;
                max-width: 260px;
                padding: 10px 14px;
            }

            .now-playing.collapsed {
                max-width: 70px;
                padding: 8px 12px;
            }

            .np-title {
                font-size: 0.95rem;
            }

            .np-bars {
                height: 26px;
            }

            .np-bar {
                width: 3px;
            }

            .np-skip {
                width: 36px;
                height: 36px;
                font-size: 1.2rem;
            }
        }
    `;
    document.head.appendChild(styles);
}

// Helper function to create audio control button
function createAudioControl() {
    const control = document.createElement('button');
    control.className = 'audio-control';
    control.innerHTML = window.partyAudio.isMuted ? '🔇' : '🔊';
    control.setAttribute('aria-label', 'Toggle audio');

    control.addEventListener('click', () => {
        window.partyAudio.init();
        const muted = window.partyAudio.toggleMute();
        control.innerHTML = muted ? '🔇' : '🔊';
        if (!muted) {
            window.partyAudio.playClick();
        }
    });

    document.body.appendChild(control);

    // Also create now playing UI
    createNowPlayingUI();

    return control;
}

// Auto-initialize and show UI on page load
document.addEventListener('DOMContentLoaded', () => {
    // Create the now-playing UI immediately
    createNowPlayingUI();

    // Try to initialize and play music
    window.partyAudio.init();
    window.partyAudio.startMusic();
});

// Also try on window load in case DOMContentLoaded already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    createNowPlayingUI();
    window.partyAudio.init();
    window.partyAudio.startMusic();
}

// Handle user interaction to resume if autoplay was blocked
function handleUserInteraction() {
    if (window.partyAudio && window.partyAudio.autoplayBlocked) {
        window.partyAudio.init();
        window.partyAudio.startMusic();
    }
    document.removeEventListener('click', handleUserInteraction);
    document.removeEventListener('touchstart', handleUserInteraction);
}

document.addEventListener('click', handleUserInteraction);
document.addEventListener('touchstart', handleUserInteraction);
