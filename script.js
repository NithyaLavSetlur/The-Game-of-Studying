// Game Data
const player = {
    xp: 0,
    level: 1,
    streak: 0,
    lastStudyDay: null,
    inventory: []
};

const LEVELS = { 1: 0, 2: 200, 3: 500, 4: 1000, 5: 2000 };
let timerInterval;
let seconds = 0;

// DOM Elements
const xpDisplay = document.getElementById("xp");
const levelDisplay = document.getElementById("level");
const nextLevelDisplay = document.getElementById("next-level");
const streakDisplay = document.getElementById("streak");
const xpBar = document.getElementById("xp-bar");
const timerDisplay = document.getElementById("timer-display");
const startTimerBtn = document.getElementById("start-timer");
const stopTimerBtn = document.getElementById("stop-timer");
const logStudyBtn = document.getElementById("log-study");
const bossBattleBtn = document.getElementById("boss-battle");
const log = document.getElementById("log");
const character = document.getElementById("character");
const characterSpeech = document.getElementById("character-speech");
const characterLevel = document.getElementById("character-level");
const particlesContainer = document.getElementById("particles");

// Audio Elements
const soundLevelUp = document.getElementById("sound-levelup");
const soundXpGain = document.getElementById("sound-xpgain");
const soundClick = document.getElementById("sound-click");
const soundBoss = document.getElementById("sound-boss");

// Circular Progress
const progressRing = document.querySelector(".progress-ring__fill");
const radius = progressRing.r.baseVal.value;
const circumference = 2 * Math.PI * radius;

progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
progressRing.style.strokeDashoffset = circumference;

// Create background particles
function createParticles() {
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.width = `${Math.random() * 3 + 1}px`;
        particle.style.height = particle.style.width;
        particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particlesContainer.appendChild(particle);
    }
}

// Create XP particles
function createXParticles(amount) {
    for (let i = 0; i < amount; i++) {
        const particle = document.createElement('div');
        particle.className = 'xparticle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 0.5}s`;
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

// Load saved game
function loadGame() {
    const saved = localStorage.getItem("studyQuestSave");
    if (saved) {
        const data = JSON.parse(saved);
        Object.assign(player, data);
    }
    updateUI();
    updateCharacter();
    createParticles();
}

// Save game
function saveGame() {
    localStorage.setItem("studyQuestSave", JSON.stringify(player));
}

// Update UI
function updateUI() {
    xpDisplay.textContent = player.xp;
    levelDisplay.textContent = player.level;
    characterLevel.textContent = player.level;
    nextLevelDisplay.textContent = LEVELS[player.level + 1] || "MAX";
    streakDisplay.textContent = player.streak;
    
    // Update XP bar
    const currentLevelXP = LEVELS[player.level];
    const nextLevelXP = LEVELS[player.level + 1] || LEVELS[player.level];
    const xpProgress = ((player.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
    xpBar.style.width = `${xpProgress}%`;
}

// Update character
function updateCharacter() {
    if (player.level >= 5) {
        character.src = "assets/sprites/character-lvl3.gif";
        characterSpeech.textContent = "Legendary Scholar!";
    } else if (player.level >= 3) {
        character.src = "assets/sprites/character-lvl2.gif";
        characterSpeech.textContent = "Great progress!";
    }
}

// Format time
function formatTime(totalSeconds) {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Update circular progress
function updateProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    progressRing.style.strokeDashoffset = offset;
}

// Start timer
startTimerBtn.addEventListener("click", () => {
    soundClick.play();
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            seconds++;
            timerDisplay.textContent = formatTime(seconds);
            updateProgress((seconds % 60) / 60 * 100); // Animate every minute
        }, 1000);
    }
});

// Stop timer
stopTimerBtn.addEventListener("click", () => {
    soundClick.play();
    clearInterval(timerInterval);
    timerInterval = null;
});

// Log study session
logStudyBtn.addEventListener("click", () => {
    soundClick.play();
    if (seconds > 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        
        // Calculate XP (10 XP per minute)
        const minutesStudied = Math.floor(seconds / 60);
        const xpEarned = minutesStudied * 10;
        
        // Update player
        const today = new Date().toLocaleDateString();
        if (player.lastStudyDay !== today) {
            player.streak = player.lastStudyDay ? player.streak + 1 : 1;
            player.lastStudyDay = today;
        }
        
        player.xp += xpEarned;
        soundXpGain.play();
        createXParticles(15);
        addLog(`📚 Studied for ${formatTime(seconds)}! +${xpEarned} XP`);
        
        // Reset timer
        seconds = 0;
        timerDisplay.textContent = "00:00:00";
        updateProgress(0);
        
        checkLevelUp();
        updateUI();
        saveGame();
    }
});

// Boss battle
bossBattleBtn.addEventListener("click", () => {
    soundClick.play();
    const topic = prompt("⚔️ BOSS BATTLE! Enter a topic to test yourself on:");
    if (topic) {
        const success = confirm(`Did you defeat the ${topic} boss? (Passed your quiz?)`);
        if (success) {
            player.xp += 150;
            soundBoss.play();
            createXParticles(25);
            addLog(`⚔️ Defeated ${topic} boss! +150 XP`);
            checkLevelUp();
            updateUI();
            saveGame();
        } else {
            addLog(`💀 Failed to defeat ${topic} boss... Try again!`);
        }
    }
});

// Check for level up
function checkLevelUp() {
    if (player.xp >= (LEVELS[player.level + 1] || Infinity)) {
        player.level++;
        soundLevelUp.play();
        createXParticles(30);
        addLog(`🎉 LEVEL UP! Now Level ${player.level}!`);
        updateCharacter();
        updateUI();
        saveGame();
        return true;
    }
    return false;
}

// Add log message
function addLog(message) {
    const entry = document.createElement("p");
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

// Theme switcher
document.querySelectorAll('.theme-switcher button').forEach(btn => {
    btn.addEventListener('click', () => {
        soundClick.play();
        const theme = btn.dataset.theme;
        document.getElementById('theme-style').href = `themes/${theme}.css`;
    });
});

// Initialize
loadGame();