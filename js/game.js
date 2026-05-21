const Game = {
    mode: 'classic',
    score: 0,
    timeLeft: 60,
    timerInt: null,
    words: [],
    currentWord: {},
    combo: 1,
    lastAnswerTime: 0,
    touchStartX: 0,

    async init(mode) {
        this.mode = mode;
        this.score = 0;
        this.combo = 1;
        this.timeLeft = mode === 'classic' ? 60 : 30;
        
        // Ensure AudioContext is running (browser requires user gesture)
        if(AudioEngine.ctx && AudioEngine.ctx.state === 'suspended') {
            AudioEngine.ctx.resume();
        }

        document.getElementById('game-score').innerText = '0';
        document.getElementById('game-timer').innerText = this.timeLeft;
        document.getElementById('game-timer').classList.remove('warning');
        
        const comboEl = document.getElementById('game-combo');
        if (mode === 'rapid') {
            comboEl.classList.remove('hidden');
            comboEl.innerText = 'x1';
        } else {
            comboEl.classList.add('hidden');
        }

        await this.loadWords();
        App.showScreen('screen-game');
        this.setupSwipes();
        this.nextWord();
        this.startTimer();
    },

    async loadWords() {
        try {
            const res = await fetch('./data/words.json');
            const data = await res.json();
            // Flatten categories and shuffle
            this.words = data.flatMap(category => 
                category.items.map(word => ({ text: word, category: category.name }))
            ).sort(() => Math.random() - 0.5);
        } catch (e) {
            console.error("Failed to load words, using fallback", e);
            // Fallback for strict offline environments if fetch fails
            this.words = [
                {text: "Ugali", category: "Food"},
                {text: "Matatu", category: "Culture"},
                {text: "Sheng", category: "Language"}
            ].sort(() => Math.random() - 0.5);
        }
    },

    nextWord() {
        if (this.words.length === 0) {
            this.endGame();
            return;
        }
        
        this.currentWord = this.words.pop();
        const card = document.getElementById('word-card');
        
        // Reset animation
        card.style.transition = 'none';
        card.className = 'word-card glass';
        void card.offsetWidth; // Trigger reflow
        card.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s';
        
        document.getElementById('current-word').innerText = this.currentWord.text;
        document.getElementById('word-category').innerText = this.currentWord.category;
        
        this.lastAnswerTime = Date.now();
    },

    handleAnswer(isCorrect) {
        const card = document.getElementById('word-card');
        
        if (isCorrect) {
            AudioEngine.correct();
            App.vibrate([30, 50, 30]);
            
            // Calculate combo for rapid fire
            if (this.mode === 'rapid') {
                const answerTime = (Date.now() - this.lastAnswerTime) / 1000;
                if (answerTime < 2.0) {
                    this.combo = Math.min(this.combo + 1, 5);
                } else {
                    this.combo = 1;
                }
                document.getElementById('game-combo').innerText = `x${this.combo}`;
                this.score += (10 * this.combo);
            } else {
                this.score += 1;
            }
            
            document.getElementById('game-score').innerText = this.score;
            card.classList.add('swipe-right');
        } else {
            AudioEngine.skip();
            App.vibrate(100);
            this.combo = 1;
            if (this.mode === 'rapid') document.getElementById('game-combo').innerText = `x1`;
            card.classList.add('swipe-left');
        }

        setTimeout(() => this.nextWord(), 300);
    },

    startTimer() {
        clearInterval(this.timerInt);
        const timerEl = document.getElementById('game-timer');
        
        this.timerInt = setInterval(() => {
            this.timeLeft--;
            timerEl.innerText = this.timeLeft;

            if (this.timeLeft <= 10) {
                timerEl.classList.add('warning');
                AudioEngine.tick();
            }

            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    },

    endGame() {
        clearInterval(this.timerInt);
        AudioEngine.gameOver();
        App.vibrate([200, 100, 200]);
        
        document.getElementById('result-score').innerText = this.score;
        
        // Handle High Scores
        const hsKey = `k50_hs_${this.mode}`;
        const currentHs = parseInt(localStorage.getItem(hsKey) || '0');
        const hsNotify = document.getElementById('high-score-notify');
        
        if (this.score > currentHs) {
            localStorage.setItem(hsKey, this.score);
            hsNotify.classList.remove('hidden');
        } else {
            hsNotify.classList.add('hidden');
        }

        App.showScreen('screen-results');
    },

    retry() {
        this.init(this.mode);
    },

    // Touch Support for mobile swiping
    setupSwipes() {
        const cardArea = document.querySelector('.card-area');
        
        cardArea.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});

        cardArea.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const diff = touchEndX - this.touchStartX;
            
            if (diff > 50) this.handleAnswer(true);  // Swipe Right = Correct
            if (diff < -50) this.handleAnswer(false); // Swipe Left = Skip
        }, {passive: true});
    }
};
