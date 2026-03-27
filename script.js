const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const millisecondsElement = document.getElementById('milliseconds');
function updateTimer() {
    const IST_OFFSET = 19800000;
    const MS_PER_DAY = 86400000;
    const now = Date.now();
    const currentMsInIST = now + IST_OFFSET;
    const elapsedToday = currentMsInIST % MS_PER_DAY;
    let diff = MS_PER_DAY - elapsedToday;
    if (diff < 0) diff = 0;
    const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);
    const ms = diff % 1000;
    hoursElement.textContent = hrs.toString().padStart(2, '0');
    minutesElement.textContent = mins.toString().padStart(2, '0');
    secondsElement.textContent = secs.toString().padStart(2, '0');
    millisecondsElement.textContent = ms.toString().padStart(3, '0');
    requestAnimationFrame(updateTimer);
}
requestAnimationFrame(updateTimer);
const tickerContainer = document.getElementById('ticker-container');
const stockSymbols = ['SB', 'TPT2', 'ENPT', 'ERLC', 'JJKI', 'PS99', 'GPO', 'DWIS', 'BBRG', 'BEDW', 'STSC'];
function initTickers() {
    let tickerHTML = '';
    stockSymbols.forEach(symbol => {
        const change = (Math.random() * 10 - 5).toFixed(2);
        const isPos = change >= 0;
        const colorVar = isPos ? 'var(--neon-green)' : 'var(--neon-red)';
        const shadowVar = isPos ? 'rgba(57, 211, 83, 0.4)' : 'rgba(248, 81, 73, 0.4)';
        tickerHTML += `<div class="ticker__item" style="color: ${colorVar}; text-shadow: 0 0 8px ${shadowVar}">
            <span class="symbol">${symbol}</span> 
            <span class="price-change">${isPos ? '+' : ''}${change}%</span>
        </div>`;
    });
    tickerHTML += `<div class="ticker__item highlight">UPDATE DROPS SOON!</div>`;
    if (tickerContainer) {
        tickerContainer.innerHTML = tickerHTML + tickerHTML;
    }
}
function updateStockPrices() {
    if (!tickerContainer) return;
    const items = tickerContainer.querySelectorAll('.ticker__item:not(.highlight)');
    items.forEach(item => {
        if (Math.random() > 0.3) return;
        const change = (Math.random() * 10 - 5).toFixed(2);
        const isPos = change >= 0;
        const changeEl = item.querySelector('.price-change');
        if (changeEl) {
            changeEl.textContent = `${isPos ? '+' : ''}${change}%`;
            item.style.color = isPos ? 'var(--neon-green)' : 'var(--neon-red)';
            item.style.textShadow = isPos ? '0 0 8px rgba(57, 211, 83, 0.4)' : '0 0 8px rgba(248, 81, 73, 0.4)';
        }
    });
}
initTickers();
setInterval(updateStockPrices, 1500); 
const titleEl = document.querySelector('.title');
const textToType = "UPDATE DROPS IN";
let charIndex = 0;
function typeWriter() {
    if (charIndex < textToType.length) {
        titleEl.textContent += textToType.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, Math.random() * 100 + 50);
    }
}
setTimeout(typeWriter, 500);
document.addEventListener('click', function(e) {
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    const size = 60;
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - size/2}px`;
    ripple.style.top = `${e.clientY - size/2}px`;
    document.body.appendChild(ripple);
    setTimeout(() => {
        ripple.remove();
    }, 600);
});
let portfolioVal = 0;
let clickPower = 0.50;
let idleIncome = 0;
const upgrades = [
    { id: 'bot1', name: 'Trade Bot 1.0', desc: '+$0.10/sec', cost: 10, mult: 1.15, count: 0, type: 'idle', val: 0.1 },
    { id: 'monitors', name: 'Extra Monitor', desc: '+$0.25/click', cost: 50, mult: 1.4, count: 0, type: 'click', val: 0.25 },
    { id: 'sub', name: 'FinTwit Sub', desc: '+$1.50/sec', cost: 150, mult: 1.15, count: 0, type: 'idle', val: 1.5 },
    { id: 'options', name: 'Options Algo', desc: '+$6.00/sec', cost: 500, mult: 1.15, count: 0, type: 'idle', val: 6 },
    { id: 'inside', name: 'Inside Info', desc: '+$2.50/click', cost: 1200, mult: 1.5, count: 0, type: 'click', val: 2.5 },
    { id: 'intern', name: 'Wall St Intern', desc: '+$45/sec', cost: 3500, mult: 1.15, count: 0, type: 'idle', val: 45 },
    { id: 'crypto', name: 'Mining Farm', desc: '+$150/sec', cost: 10000, mult: 1.15, count: 0, type: 'idle', val: 150 },
    { id: 'terminal', name: 'Bloomberg Term', desc: '+$25/click', cost: 25000, mult: 1.5, count: 0, type: 'click', val: 25 },
    { id: 'marketmaker', name: 'Market Maker', desc: '+$1,200/sec', cost: 80000, mult: 1.15, count: 0, type: 'idle', val: 1200 },
    { id: 'lobby', name: 'Lobbyist', desc: '+$5,000/sec', cost: 250000, mult: 1.15, count: 0, type: 'idle', val: 5000 },
    { id: 'ceo', name: 'AI CEO', desc: '+$25,000/sec', cost: 1000000, mult: 1.15, count: 0, type: 'idle', val: 25000 }
];
const valEl = document.querySelector('.portfolio-val');
const pumpBtn = document.getElementById('pump-btn');
const upgradesStore = document.getElementById('upgrades-store');
const clickPowerDisplay = document.getElementById('click-power-display');
const idleIncomeDisplay = document.getElementById('idle-income-display');
function formatMoney(num) {
    if (num >= 1000000) return `$${(num/1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num/1000).toFixed(2)}k`;
    return `$${num.toFixed(2)}`;
}
function renderStore() {
    upgradesStore.innerHTML = '';
    upgrades.forEach((u, index) => {
        const btn = document.createElement('button');
        btn.className = 'upgrade-btn';
        btn.disabled = portfolioVal < (u.cost * Math.pow(u.mult, u.count));
        const currentCost = (u.cost * Math.pow(u.mult, u.count)).toFixed(2);
        btn.innerHTML = `
            <div class="upgrade-details">
                <span class="upgrade-name">${u.name}</span>
                <span class="upgrade-desc">${u.desc}</span>
            </div>
            <div class="upgrade-cost">
                <span>$${currentCost}</span>
                <span class="upgrade-count">x${u.count}</span>
            </div>
        `;
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            buyUpgrade(index);
        });
        upgradesStore.appendChild(btn);
    });
}
function buyUpgrade(index) {
    const u = upgrades[index];
    const currentCost = u.cost * Math.pow(u.mult, u.count);
    if (portfolioVal >= currentCost) {
        portfolioVal -= currentCost;
        u.count++;
        if (u.type === 'idle') {
            idleIncome += u.val;
        } else if (u.type === 'click') {
            clickPower += u.val;
        }
        updateStockDisplay();
    }
}
function updateStockDisplay() {
    valEl.textContent = formatMoney(portfolioVal);
    clickPowerDisplay.textContent = `Power: ${formatMoney(clickPower)}`;
    idleIncomeDisplay.textContent = `Auto: ${formatMoney(idleIncome)}/s`;
    renderStore(); 
}
pumpBtn.addEventListener('click', (e) => {
    e.stopPropagation(); 
    portfolioVal += clickPower;
    valEl.style.transform = 'scale(1.1)';
    setTimeout(() => valEl.style.transform = 'scale(1)', 100);
    updateStockDisplay();
});
setInterval(() => {
    if (idleIncome > 0) {
        portfolioVal += (idleIncome / 10);
        updateStockDisplay();
    }
}, 100);
renderStore();
const light = document.getElementById('reaction-light');
const result = document.getElementById('reaction-result');
const resetBtn = document.getElementById('reaction-btn');
let reactionState = 'waiting'; 
let reactionTimeout;
let startTime;
function resetReaction() {
    reactionState = 'waiting';
    light.className = 'light red';
    light.textContent = 'WAIT...';
    result.textContent = '0.000s';
    const delay = Math.random() * 3000 + 1000; 
    reactionTimeout = setTimeout(() => {
        reactionState = 'ready';
        light.className = 'light green';
        light.textContent = 'TRADE NOW!';
        startTime = Date.now();
    }, delay);
}
light.addEventListener('click', (e) => {
    e.stopPropagation();
    if (reactionState === 'waiting') {
        clearTimeout(reactionTimeout);
        light.textContent = 'TOO EARLY!';
        reactionState = 'finished';
    } else if (reactionState === 'ready') {
        const time = Date.now() - startTime;
        result.textContent = `${(time / 1000).toFixed(3)}s`;
        reactionState = 'finished';
    }
});
resetBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    resetReaction();
});
resetReaction();
