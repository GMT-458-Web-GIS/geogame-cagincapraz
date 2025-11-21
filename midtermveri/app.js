let map;
let score = 0;
let lives = 3;
let timeLeft = 60;
let gameInterval = null;

document.getElementById("startBtn").addEventListener("click", startGame);

function startGame() {
    score = 0;
    lives = 3;
    timeLeft = 60;
    updateUI();

    if (!map) initMap();

    startTimer();
}

function updateUI() {
    document.getElementById("score").innerText = score;
    document.getElementById("lives").innerHTML = "❤️".repeat(lives);
    document.getElementById("timer").innerText = timeLeft;
}

function startTimer() {
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        timeLeft--;
        updateUI();

        if (timeLeft <= 0) {
            gameOver();
        }
    }, 1000);
}

function gameOver() {
    clearInterval(gameInterval);
    alert("Süre doldu! Oyun bitti!");
}

function initMap() {
    map = L.map('map').setView([39.0, 35.0], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 10,
    }).addTo(map);
}
