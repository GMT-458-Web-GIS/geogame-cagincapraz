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

function gameOver(msg) {
    clearInterval(gameInterval);
    alert(msg);
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
                },
                onEachFeature: function (feature, layer) {
                    layer.on("click", function () {
                        let clicked = feature.properties.name;
                        console.log("Tıklanan il:", clicked);
                        // ✔ Bir sonraki aşamada burada doğru/yanlış kontrolü yapacağız
                    });
                }
            }).addTo(map);
        });
}

function pickRandomProvinces() {
    const features = provincesData.features;
    startProvince = features[Math.floor(Math.random() * features.length)];
    targetProvince = features[Math.floor(Math.random() * features.length)];

    if (startProvince === targetProvince) {
        pickRandomProvinces(); // Aynı gelirse yeniden seç
        return;
    }

    console.log("BAŞLANGIÇ:", startProvince.properties.name);
    console.log("HEDEF:", targetProvince.properties.name);
}

function colorProvinces() {
    provincesLayer.setStyle(f => {
        if (f === startProvince)
            return { color: "green", fillColor: "#90ee90" };
        if (f === targetProvince)
            return { color: "red", fillColor: "#ffcccc" };
        return { color: "#444", fillColor: "#ddd" };
    });
}
