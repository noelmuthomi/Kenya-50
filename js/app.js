const App = {
    deferredPrompt: null,
    vibrationEnabled: true,

    init() {
        // Mock load time for splash screen
        setTimeout(() => {
            this.showScreen('screen-home');
            AudioEngine.init(); // Initialize audio context on first interaction
        }, 2000);

        this.initPWA();
        this.loadSettings();
    },

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.replace('active', 'hidden'));
        document.getElementById(screenId).classList.replace('hidden', 'active');
    },

    vibrate(pattern) {
        if (this.vibrationEnabled && navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    },

    loadSettings() {
        const sound = localStorage.getItem('k50_sound') !== 'false';
        const vib = localStorage.getItem('k50_vib') !== 'false';
        
        document.getElementById('toggle-sound').checked = sound;
        document.getElementById('toggle-vibration').checked = vib;
        
        AudioEngine.enabled = sound;
        this.vibrationEnabled = vib;
    },

    toggleSound(el) {
        localStorage.setItem('k50_sound', el.checked);
        AudioEngine.enabled = el.checked;
        if(el.checked) AudioEngine.init();
    },

    toggleVibration(el) {
        localStorage.setItem('k50_vib', el.checked);
        this.vibrationEnabled = el.checked;
        if(el.checked) this.vibrate(50);
    },

    resetData() {
        if(confirm("Are you sure you want to reset all high scores?")) {
            localStorage.removeItem('k50_highscores');
            alert("Data reset successfully.");
        }
    },

    initPWA() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./service-worker.js')
                    .then(reg => console.log('SW Registered', reg))
                    .catch(err => console.log('SW Failed', err));
            });
        }

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            const banner = document.getElementById('pwa-install-banner');
            banner.classList.remove('hidden');
            
            document.getElementById('install-btn').addEventListener('click', () => {
                banner.classList.add('hidden');
                this.deferredPrompt.prompt();
                this.deferredPrompt.userChoice.then(() => {
                    this.deferredPrompt = null;
                });
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
