const AudioEngine = {
    ctx: null,
    enabled: true,

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        this.enabled = localStorage.getItem('k50_sound') !== 'false';
    },

    playTone(freq, type, duration, vol = 0.1) {
        if (!this.enabled || !this.ctx) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },

    correct() {
        this.playTone(600, 'sine', 0.1);
        setTimeout(() => this.playTone(800, 'sine', 0.15), 100);
    },

    skip() {
        this.playTone(300, 'sawtooth', 0.2);
        setTimeout(() => this.playTone(250, 'sawtooth', 0.2), 100);
    },

    tick() {
        this.playTone(1000, 'square', 0.05, 0.02);
    },

    gameOver() {
        this.playTone(400, 'triangle', 0.2);
        setTimeout(() => this.playTone(300, 'triangle', 0.4), 200);
        setTimeout(() => this.playTone(200, 'triangle', 0.6), 600);
    }
};
