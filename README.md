# KENYA @ 50 FOSS 🇰🇪

A premium, open-source, offline-first Progressive Web App (PWA) trivia and charades game celebrating Kenyan culture, history, and life. 

Inspired by Heads-up and modern glassmorphism UI/UX patterns. Completely self-contained with zero external dependencies.

## 🌟 Features
- **Two Game Modes:** Classic (60s Team Charades) & Rapid Fire (Combos & High Scores).
- **100% Offline Capable:** Runs off Service Workers.
- **Installable PWA:** Add to your Android/iOS home screen.
- **Algorithmic Audio:** Native Web Audio API sound effects (No `.mp3` payloads).
- **Mobile First:** Swipe gestures (Left to Skip, Right for Correct), Vibration Haptics.
- **Premium UI:** Dark mode, Neon glows, Glassmorphism, CSS Variable theming.

## 🚀 Installation & Deployment

### Local Development
1. Clone the repository: `git clone https://github.com/yourusername/kenya-at-50-foss.git`
2. Run a local server (e.g., `npx serve` or VSCode Live Server). *Note: PWAs and module fetching require a local HTTP server, do not open index.html via `file://` protocol.*

### GitHub Pages Deployment
This project is architecture strictly using HTML/CSS/JS, making it perfect for GitHub pages.
1. Go to your repo **Settings > Pages**.
2. Select the `main` branch as the source.
3. Save. Your PWA is live and installable!

## 🛠 Tech Stack
- **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3.
- **Storage:** LocalStorage API for persistence.
- **PWA:** Manifest.json & Service Workers.
- **Audio:** Custom Web Audio API Synthesizer.

## 🤝 Contributing
Please see `CONTRIBUTING.md` for details on adding new Kenyan datasets to `words.json`.

## 📜 License
This project is licensed under the MIT License.
