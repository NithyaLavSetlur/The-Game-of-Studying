// Load player data
const player = JSON.parse(localStorage.getItem("studyQuestSave")) || {
    xp: 0,
    inventory: []
};

const REWARDS = [
    { name: "5-minute break", cost: 50, description: "Take a short breather" },
    { name: "Favorite snack", cost: 100, description: "Enjoy a tasty treat" },
    { name: "Music session", cost: 150, description: "15 mins of your playlist" },
    { name: "Watch a video", cost: 200, description: "10 mins of YouTube" },
    { name: "Game time", cost: 300, description: "20 mins of gaming" }
];

const shopXP = document.getElementById("shop-xp");
const rewardsList = document.getElementById("rewards-list");

// Update UI
function updateShop() {
    shopXP.textContent = player.xp;
    
    rewardsList.innerHTML = REWARDS.map(reward => `
        <div class="reward-item">
            <h3>${reward.name}</h3>
            <p>${reward.description}</p>
            <p>Cost: ${reward.cost} XP</p>
            <button onclick="buyReward(${reward.cost}, '${reward.name}')" 
                ${player.xp < reward.cost ? 'disabled' : ''}>
                Buy
            </button>
        </div>
    `).join("");
}

// Buy reward
function buyReward(cost, name) {
    if (player.xp >= cost) {
        player.xp -= cost;
        player.inventory.push(name);
        localStorage.setItem("studyQuestSave", JSON.stringify(player));
        alert(`🎉 You bought: ${name}!`);
        updateShop();
    }
}

// Initialize
updateShop();