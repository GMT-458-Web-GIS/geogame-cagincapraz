let map;
let score = 0;
let lives = 3;
let timeLeft = 60;
let gameInterval = null;

let provincesLayer;
let provincesData;
let startProvince;
let targetProvince;

document.getElementById("startBtn").addEventListener("click", startGame);

function startGame() {
    score = 0;
    lives = 3;
    timeLeft = 60;
    updateUI();

    if (!map) initMap();

    pickRandomProvinces();
    colorProvinces();
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
            gameOver("Süre doldu!");
        }
    }, 1000);
}

function gameOver(message) {
    clearInterval(gameInterval);
    alert(message);
}

function initMap() {
    map = L.map('map').setView([39.0, 35.0], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 10,
    }).addTo(map);

    fetch("data/turkiye_iller.geojson")
        .then(res => res.json())
        .then(data => {
            provincesData = data;
            provincesLayer = L.geoJSON(provincesData, {
                style: {
                    color: "#444",
                    weight: 1,
                    fillColor: "#ddd",
                    fillOpacity: 0.6
                }
            }).addTo(map);
        });
}

function pickRandomProvinces() {
    const features = provincesData.features;
    startProvince = features[Math.floor(Math.random() * features.length)];
    targetProvince = features[Math.floor(Math.random() * features.length)];

    if (startProvince === targetProvince)
        pickRandomProvinces(); // farklı olmazsa tekrar seç

    console.log("Başlangıç:", startProvince.properties.name);
    console.log("Hedef:", targetProvince.properties.name);
}

function colorProvinces() {
    provincesLayer.setStyle(feature => {
        if (feature === startProvince)
            return { color: "green", fillColor: "lightgreen" };
        if (feature === targetProvince)
            return { color: "red", fillColor: "pink" };
        return { color: "#444", fillColor: "#ddd" };
    });

    // Marker ekle
    const startCenter = turf.center(startProvince).geometry.coordinates.reverse();
    const targetCenter = turf.center(targetProvince).geometry.coordinates.reverse();

    L.marker(startCenter).addTo(map).bindPopup("Başlangıç İl: " + startProvince.properties.name);
    L.marker(targetCenter).addTo(map).bindPopup("Hedef İl: " + targetProvince.properties.name);
}
