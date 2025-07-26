// Game Data
const player = {
    name: "Player",
    xp: 0,
    level: 1,
    streak: 0,
    lastStudyDay: null,
    inventory: []
};

const LEVELS = { 1: 0, 2: 200, 3: 500, 4: 1000 };
const REWARDS = [
    { name: "5-minute break", cost: 50 },
    { name: "Snack", cost: 100 },
    { name: "Listen to music", cost: 150 }
];

// DOM Elements
const xpDisplay = document.getElementById("xp");
const levelDisplay = document.getElementById("level");
const nextLevelDisplay = document.getElementById("next-level");
const streakDisplay = document.getElementById("streak");
const studyBtn = document.getElementById("study-btn");
const bossBtn = document.getElementById("boss-btn");
const shopBtn = document.getElementById("shop-btn");
const shopPanel = document.getElementById("shop");
const rewardsList = document.getElementById("rewards-list");
const closeShopBtn = document.getElementById("close-shop");
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
}

// Add log message
function addLog(message) {
    const entry = document.createElement("p");
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    log.prepend(entry);
}

// Check for level up
function checkLevelUp() {
    if (player.xp >= (LEVELS[player.level + 1] || Infinity)) {
        player.level++;
        addLog(`🎉 Level up! Now Level ${player.level}!`);
        return true;
    }
    return false;
}

// Study task
studyBtn.addEventListener("click", () => {
    const today = new Date().toLocaleDateString();
    if (player.lastStudyDay !== today) {
        player.streak = player.lastStudyDay ? player.streak + 1 : 1;
        player.lastStudyDay = today;
    }
    player.xp += 50;
    addLog("📚 Studied! +50 XP");
    checkLevelUp();
    updateUI();
    saveGame();
});

// Boss battle
bossBtn.addEventListener("click", () => {
    const topic = prompt("⚔️ Boss Battle! Quiz yourself on which topic?");
    if (topic) {
        player.xp += 100;
        addLog(`⚔️ Defeated ${topic} boss! +100 XP`);
        checkLevelUp();
        updateUI();
        saveGame();
    }
});

// Shop
shopBtn.addEventListener("click", () => {
    shopPanel.classList.remove("hidden");
    rewardsList.innerHTML = REWARDS.map(reward => `
        <li>
            ${reward.name} (${reward.cost} XP)
            <button onclick="buyReward(${reward.cost}, '${reward.name}')">Buy</button>
        </li>
    `).join("");
});

closeShopBtn.addEventListener("click", () => {
    shopPanel.classList.add("hidden");
});

function buyReward(cost, name) {
    if (player.xp >= cost) {
        player.xp -= cost;
        player.inventory.push(name);
        addLog(`🎁 Bought: ${name}! (-${cost} XP)`);
        updateUI();
        saveGame();
    } else {
        alert("Not enough XP!");
    }
}

// Initialize
loadGame();