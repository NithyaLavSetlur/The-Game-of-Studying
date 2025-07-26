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

// Load saved game
function loadGame() {
    const saved = localStorage.getItem("studyQuestSave");
    if (saved) {
        const data = JSON.parse(saved);
        Object.assign(player, data);
    }
    updateUI();
}

// Save game
function saveGame() {
    localStorage.setItem("studyQuestSave", JSON.stringify(player));
}

// Update UI
function updateUI() {
    xpDisplay.textContent = player.xp;
    levelDisplay.textContent = player.level;
    nextLevelDisplay.textContent = LEVELS[player.level + 1] || "MAX";
    streakDisplay.textContent = player.streak;
    
    // Update XP bar
    const currentLevelXP = LEVELS[player.level];
    const nextLevelXP = LEVELS[player.level + 1] || LEVELS[player.level];
    const xpProgress = ((player.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
    xpBar.style.width = `${xpProgress}%`;
}

// Format time
function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Start timer
startTimerBtn.addEventListener("click", () => {
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            seconds++;
            timerDisplay.textContent = formatTime(seconds);
        }, 1000);
    }
});

// Stop timer
stopTimerBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
});

// Log study session
logStudyBtn.addEventListener("click", () => {
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
        addLog(`📚 Studied for ${formatTime(seconds)}! +${xpEarned} XP`);
        
        // Reset timer
        seconds = 0;
        timerDisplay.textContent = "00:00:00";
        
        checkLevelUp();
        updateUI();
        saveGame();
    }
});

// Boss battle
bossBattleBtn.addEventListener("click", () => {
    const topic = prompt("⚔️ BOSS BATTLE! Enter a topic to test yourself on:");
    if (topic) {
        const success = confirm(`Did you defeat the ${topic} boss? (Passed your quiz?)`);
        if (success) {
            player.xp += 150;
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
        addLog(`🎉 LEVEL UP! Now Level ${player.level}!`);
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

// Initialize
loadGame();