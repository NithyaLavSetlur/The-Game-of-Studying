// Load player data
const player = JSON.parse(localStorage.getItem("studyQuestSave")) || {
    xp: 0,
    inventory: []
};

const REWARDS = [
    { name: "5-minute break", cost: 50, description: "Take a short breather", icon: "☕" },
    { name: "Favorite snack", cost: 100, description: "Enjoy a tasty treat", icon: "🍕" },
    { name: "Music session", cost: 150, description: "15 mins of your playlist", icon: "🎵" },
    { name: "Watch a video", cost: 200, description: "10 mins of YouTube", icon: "📺" },
    { name: "Game time", cost: 300, description: "20 mins of gaming", icon: "🎮" }
];

const shopXP = document.getElementById("shop-xp");
const rewardsList = document.getElementById("rewards-list");
const soundClick = document.getElementById("sound-click");
const soundPurchase = document.getElementById("sound-purchase");

// Create background particles
function createParticles() {
    const container = document.getElementById("particles");
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.width = `${Math.random() * 3 + 1}px`;
        particle.style.height = particle.style.width;
        particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(particle);
    }
}

// Update UI
function updateShop() {
    shopXP.textContent = player.xp;
    
    rewardsList.innerHTML = REWARDS.map(reward => `
        <div class="reward-item">
            <div class="reward-icon">${reward.icon}</div>
            <h3>${reward.name}</h3>
            <p>${reward.description}</p>
            <p class="reward-cost">${reward.cost} XP</p>
            <button onclick="buyReward(${reward.cost}, '${reward.name}')" 
                ${player.xp < reward.cost ? 'disabled' : ''}>
                Buy
            </button>
        </div>
    `).join("");
}

// Buy reward
function buyReward(cost, name) {
    soundClick.play();
    if (player.xp >= cost) {
        player.xp -= cost;
        player.inventory.push(name);
        localStorage.setItem("studyQuestSave", JSON.stringify(player));
        soundPurchase.play();
        createXParticles(10);
        alert(`🎉 You bought: ${name}!`);
        updateShop();
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

// Theme switcher
document.querySelectorAll('.theme-switcher button').forEach(btn => {
    btn.addEventListener('click', () => {
        soundClick.play();
        const theme = btn.dataset.theme;
        document.getElementById('theme-style').href = `themes/${theme}.css`;
    });
});

// Initialize
createParticles();
updateShop();