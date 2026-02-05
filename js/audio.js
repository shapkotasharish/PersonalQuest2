/* ============================================
   PARTY POWER - GLOBAL AUDIO SYSTEM
   ============================================ */

class PartyAudio {
    constructor() {
        this.audioContext = null;
        this.isMuted = localStorage.getItem('partyAudioMuted') === 'true';
        this.volume = parseFloat(localStorage.getItem('partyAudioVolume')) || 0.3;
        this.initialized = false;
        this.bgMusicNode = null;
        this.bgMusicGain = null;
        this.currentTrack = null;
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
            console.log('Audio system initialized');
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
        }
    }

    // Toggle mute
    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('partyAudioMuted', this.isMuted);
        if (this.masterGain) {
            this.masterGain.gain.value = this.isMuted ? 0 : this.volume;
        }
        return this.isMuted;
    }

    // Set volume (0-1)
    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
        localStorage.setItem('partyAudioVolume', this.volume);
        if (this.masterGain && !this.isMuted) {
            this.masterGain.gain.value = this.volume;
        }
    }

    // Create oscillator-based sound
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

    // Soft hover chime
    playHover() {
        if (!this.initialized) return;
        this.playTone(800, 0.1, 'sine', 0.01, 0.05);
    }

    // Gentle click pop
    playClick() {
        if (!this.initialized) return;
        this.playTone(400, 0.15, 'sine', 0.005, 0.1);
        setTimeout(() => this.playTone(600, 0.1, 'sine', 0.005, 0.05), 30);
    }

    // Sparkle/unlock sound
    playSparkle() {
        if (!this.initialized) return;
        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.2, 'sine', 0.01, 0.1), i * 60);
        });
    }

    // Balloon pop sound
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

    // Giggle sound (playful)
    playGiggle() {
        if (!this.initialized) return;
        const notes = [400, 500, 400, 600, 500];
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.08, 'sine', 0.01, 0.04), i * 50);
        });
    }

    // Success/achievement sound
    playSuccess() {
        if (!this.initialized) return;
        const notes = [392, 523, 659, 784]; // G4, C5, E5, G5
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.25, 'sine', 0.02, 0.15), i * 100);
        });
    }

    // Whoosh sound
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

    // Magical chime (for hold interaction)
    playMagicalChime() {
        if (!this.initialized) return;
        const notes = [523, 659, 784, 880, 1047, 1319]; // C5, E5, G5, A5, C6, E6
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.4, 'sine', 0.02, 0.25), i * 80);
        });
    }

    // Error/oops sound (soft, playful)
    playOops() {
        if (!this.initialized) return;
        this.playTone(300, 0.15, 'sine', 0.01, 0.1);
        setTimeout(() => this.playTone(250, 0.2, 'sine', 0.01, 0.1), 100);
    }

    // Coin/point earned sound
    playCoin() {
        if (!this.initialized) return;
        this.playTone(880, 0.08, 'square', 0.005, 0.04);
        setTimeout(() => this.playTone(1100, 0.12, 'square', 0.005, 0.06), 60);
    }

    // Upgrade purchased sound
    playUpgrade() {
        if (!this.initialized) return;
        const notes = [440, 554, 659, 880]; // A4, C#5, E5, A5
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.15, 'triangle', 0.01, 0.08), i * 70);
        });
    }

    // Level up / rebirth sound
    playLevelUp() {
        if (!this.initialized) return;
        const notes = [262, 330, 392, 523, 659, 784, 1047];
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.3, 'sine', 0.02, 0.2), i * 100);
        });
    }

    // Game over sound
    playGameOver() {
        if (!this.initialized) return;
        const notes = [400, 350, 300, 250];
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.3, 'sine', 0.02, 0.2), i * 150);
        });
    }

    // Catch sound (for catching cakes)
    playCatch() {
        if (!this.initialized) return;
        this.playTone(600, 0.1, 'sine', 0.005, 0.05);
        this.playTone(800, 0.1, 'sine', 0.005, 0.05);
    }

    // Whack sound
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

    // Egg found sound
    playEggFound() {
        if (!this.initialized) return;
        const notes = [659, 784, 988, 1319]; // E5, G5, B5, E6
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.2, 'sine', 0.01, 0.12), i * 70);
        });
    }

    // Background music using oscillators (simple ambient)
    startBgMusic(type = 'landing') {
        if (!this.initialized || !this.audioContext) return;

        this.stopBgMusic();

        const tracks = {
            landing: { baseFreq: 220, tempo: 0.5, notes: [1, 1.25, 1.5, 1.25] },
            hub: { baseFreq: 262, tempo: 0.4, notes: [1, 1.2, 1.5, 1.33] },
            clicker: { baseFreq: 330, tempo: 0.35, notes: [1, 1.125, 1.25, 1.5] }
        };

        const track = tracks[type] || tracks.landing;
        this.currentTrack = type;

        this.bgMusicGain = this.audioContext.createGain();
        this.bgMusicGain.connect(this.masterGain);
        this.bgMusicGain.gain.value = 0.1;

        let noteIndex = 0;
        const playNote = () => {
            if (!this.bgMusicGain) return;

            const osc = this.audioContext.createOscillator();
            const noteGain = this.audioContext.createGain();

            osc.connect(noteGain);
            noteGain.connect(this.bgMusicGain);

            osc.type = 'sine';
            osc.frequency.value = track.baseFreq * track.notes[noteIndex % track.notes.length];

            const now = this.audioContext.currentTime;
            noteGain.gain.setValueAtTime(0, now);
            noteGain.gain.linearRampToValueAtTime(0.15, now + 0.1);
            noteGain.gain.exponentialRampToValueAtTime(0.01, now + track.tempo * 0.9);

            osc.start(now);
            osc.stop(now + track.tempo);

            noteIndex++;
        };

        playNote();
        this.bgMusicInterval = setInterval(playNote, track.tempo * 1000);
    }

    stopBgMusic() {
        if (this.bgMusicInterval) {
            clearInterval(this.bgMusicInterval);
            this.bgMusicInterval = null;
        }
        if (this.bgMusicGain) {
            this.bgMusicGain.disconnect();
            this.bgMusicGain = null;
        }
        this.currentTrack = null;
    }

    // Chaos mode sounds
    playChaos() {
        if (!this.initialized) return;
        const freq = 200 + Math.random() * 800;
        const type = ['sine', 'square', 'triangle', 'sawtooth'][Math.floor(Math.random() * 4)];
        this.playTone(freq, 0.1, type, 0.01, 0.05);
    }
}

// Create global audio instance
window.partyAudio = new PartyAudio();

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
    return control;
}

// Auto-initialize on first interaction
document.addEventListener('click', function initOnClick() {
    window.partyAudio.init();
    document.removeEventListener('click', initOnClick);
}, { once: true });

document.addEventListener('touchstart', function initOnTouch() {
    window.partyAudio.init();
    document.removeEventListener('touchstart', initOnTouch);
}, { once: true });
