let map;
let score = 0;
let lives = 3;
let timeLeft = 60;
let gameInterval = null;

let provincesLayer;
let provincesData;
let startProvince;
let targetProvince;

let route = [];        // Ankara → Bolu → Sakarya → ...
let currentStep = 0;   // Kullanıcının şu an tahmin etmesi gereken il

// --- TÜRKİYE KOMŞU İL TABLOSU (81 il) ---
const neighbors = {
    "Adana": ["Mersin","Osmaniye","Hatay","Kahramanmaraş"],
    "Adıyaman": ["Malatya","Kahramanmaraş","Gaziantep","Şanlıurfa"],
    "Afyonkarahisar": ["Kütahya","Uşak","Isparta","Burdur","Konya","Eskişehir"],
    "Ağrı": ["Erzurum","Muş","Van","Iğdır","Kars"],
    "Aksaray": ["Ankara","Kırşehir","Nevşehir","Niğde","Konya"],
    "Amasya": ["Tokat","Samsun","Çorum"],
    "Ankara": ["Kırıkkale","Kırşehir","Aksaray","Konya","Eskişehir","Bolu","Çankırı"],
    "Antalya": ["Muğla","Burdur","Isparta","Konya","Karaman","Mersin"],
    "Artvin": ["Rize","Erzurum","Ardahan"],
    "Aydın": ["İzmir","Manisa","Denizli","Muğla"],
    "Balıkesir": ["İzmir","Manisa","Kütahya","Bursa","Çanakkale"],
    "Bartın": ["Kastamonu","Karabük","Zonguldak"],
    "Batman": ["Siirt","Mardin","Diyarbakır","Muş","Bitlis"],
    "Bayburt": ["Erzurum","Gümüşhane","Trabzon","Rize"],
    "Bilecik": ["Bursa","Kütahya","Eskişehir","Bozüyük"],
    "Bingöl": ["Erzurum","Muş","Tunceli","Elazığ"],
    "Bitlis": ["Van","Muş","Siirt","Batman"],
    "Bolu": ["Ankara","Eskişehir","Bilecik","Bursa","Düzce","Zonguldak","Karabük","Çankırı"],
    "Burdur": ["Isparta","Antalya","Afyonkarahisar","Denizli"],
    "Bursa": ["Balıkesir","Kütahya","Bilecik","Sakarya","Kocaeli","Yalova"],
    "Çanakkale": ["Edirne","Tekirdağ","Balıkesir"],
    "Çankırı": ["Ankara","Kırıkkale","Çorum","Kastamonu","Bolu"],
    "Çorum": ["Amasya","Samsun","Sinop","Kastamonu","Çankırı","Kırıkkale","Yozgat","Tokat"],
    "Denizli": ["Aydın","Muğla","Burdur","Isparta","Afyonkarahisar","Uşak","Manisa"],
    "Diyarbakır": ["Batman","Mardin","Şanlıurfa","Adıyaman","Malatya","Elazığ","Bingöl","Muş"],
    "Düzce": ["Bolu","Sakarya","Zonguldak"],
    "Edirne": ["Kırklareli","Tekirdağ","Çanakkale"],
    "Elazığ": ["Malatya","Diyarbakır","Mardin","Şanlıurfa","Tunceli","Bingöl"],
    "Erzincan": ["Erzurum","Gümüşhane","Sivas","Tunceli","Malatya","Bingöl"],
    "Erzurum": ["Ağrı","Kars","Ardahan","Artvin","Rize","Bayburt","Erzincan","Bingöl","Muş"],
    "Eskişehir": ["Ankara","Kütahya","Bilecik","Bursa","Kocaeli","Konya","Afyonkarahisar"],
    "Gaziantep": ["Kilis","Şanlıurfa","Adıyaman","Kahramanmaraş","Osmaniye","Hatay"],
    "Giresun": ["Ordu","Sivas","Erzincan","Gümüşhane","Trabzon"],
    "Gümüşhane": ["Erzincan","Bayburt","Trabzon","Giresun","Erzurum"],
    "Hakkari": ["Van","Şırnak","Yüksekova"],
    "Hatay": ["Osmaniye","Gaziantep","Adana"],
    "Iğdır": ["Ağrı","Kars","Ardahan"],
    "Isparta": ["Burdur","Antalya","Konya","Afyonkarahisar"],
    "İstanbul": ["Kocaeli","Tekirdağ","Edirne"],
    "İzmir": ["Aydın","Manisa","Balıkesir"],
    "Kahramanmaraş": ["Adana","Osmaniye","Gaziantep","Adıyaman","Malatya","Sivas"],
    "Karabük": ["Bolu","Zonguldak","Bartın"],
    "Karaman": ["Konya","Mersin"],
    "Kars": ["Ardahan","Erzurum","Ağrı","Iğdır"],
    "Kastamonu": ["Sinop","Samsun","Çorum","Çankırı","Bolu","Bartın","Karabük"],
    "Kayseri": ["Sivas","Yozgat","Nevşehir","Niğde","Adana","Kahramanmaraş"],
    "Kırıkkale": ["Ankara","Kırşehir","Çorum","Çankırı","Yozgat"],
    "Kırklareli": ["Edirne","Tekirdağ"],
    "Kırşehir": ["Aksaray","Ankara","Kırıkkale","Yozgat","Nevşehir"],
    "Kilis": ["Gaziantep","Hatay"],
    "Kocaeli": ["Sakarya","Bursa","Yalova","İstanbul"],
    "Konya": ["Ankara","Eskişehir","Afyonkarahisar","Isparta","Antalya","Karaman","Aksaray"],
    "Kütahya": ["Manisa","Uşak","Afyonkarahisar","Eskişehir","Bilecik","Balıkesir"],
    "Malatya": ["Sivas","Kayseri","Kahramanmaraş","Adıyaman","Elazığ","Erzincan"],
    "Manisa": ["İzmir","Aydın","Denizli","Uşak","Kütahya","Balıkesir"],
    "Mardin": ["Diyarbakır","Batman","Siirt","Şırnak"],
    "Mersin": ["Adana","Karaman","Konya","Antalya"],
    "Muğla": ["Izmir","Aydın","Denizli","Burdur","Antalya"],
    "Muş": ["Bingöl","Erzurum","Ağrı","Bitlis","Diyarbakır"],
    "Nevşehir": ["Kırşehir","Aksaray","Niğde","Kayseri","Yozgat"],
    "Niğde": ["Aksaray","Nevşehir","Kayseri","Adana","Mersin"],
    "Ordu": ["Samsun","Tokat","Sivas","Giresun"],
    "Osmaniye": ["Hatay","Adana","Gaziantep","Kahramanmaraş"],
    "Rize": ["Artvin","Erzurum","Bayburt","Trabzon"],
    "Sakarya": ["Düzce","Bolu","Bilecik","Bursa","Kocaeli"],
    "Samsun": ["Sinop","Çorum","Amasya","Tokat","Ordu"],
    "Siirt": ["Batman","Bitlis","Mardin","Şırnak"],
    "Sinop": ["Kastamonu","Samsun","Çorum"],
    "Sivas": ["Ordu","Tokat","Yozgat","Kayseri","Kahramanmaraş","Malatya","Erzincan","Giresun"],
    "Şanlıurfa": ["Gaziantep","Adıyaman","Diyarbakır","Mardin"],
    "Şırnak": ["Siirt","Mardin","Hakkari"],
    "Tekirdağ": ["Edirne","Kırklareli","İstanbul"],
    "Tokat": ["Samsun","Amasya","Çorum","Yozgat","Sivas"],
    "Trabzon": ["Rize","Bayburt","Gümüşhane","Giresun"],
    "Tunceli": ["Erzincan","Bingöl","Elazığ"],
    "Uşak": ["Manisa","Denizli","Afyonkarahisar","Kütahya"],
    "Van": ["Ağrı","Muş","Bitlis","Hakkari"],
    "Yalova": ["Bursa","Kocaeli","İstanbul"],
    "Yozgat": ["Çorum","Kırıkkale","Kırşehir","Nevşehir","Kayseri","Sivas"],
    "Zonguldak": ["Bolu","Düzce","Bartın","Karabük"]
};

// --------------------------------------------------------
//  HARİTA BAŞLATMA
// --------------------------------------------------------
document.getElementById("startBtn").addEventListener("click", startGame);

function startGame() {
    score = 0;
    lives = 3;
    timeLeft = 60;
    updateUI();

    if (!map) initMap();

    pickStartAndTarget();
    createRoute();
    colorStartAndTarget();

    currentStep = 0; // İlk tahmin edilmesi gereken il
    startTimer();
}

function updateUI() {
    document.getElementById("score").innerText = score;
    document.getElementById("lives").innerHTML = "❤️".repeat(lives);
    document.getElementById("timer").innerText = timeLeft;
}

// --------------------------------------------------------
function initMap() {
    map = L.map('map').setView([39, 35], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    fetch("data/turkiye_iller.geojson")
        .then(res => res.json())
        .then(data => {
            provincesData = data;

            provincesLayer = L.geoJSON(data, {
                style: {
                    color: "#444",
                    weight: 1,
                    fillColor: "#ddd",
                    fillOpacity: 0.6
                },
                onEachFeature: onProvinceClick
            }).addTo(map);
        });
}

// --------------------------------------------------------
// BAŞLANGIÇ VE HEDEF SEÇİMİ
// --------------------------------------------------------
function pickStartAndTarget() {
    let feats = provincesData.features;

    startProvince = feats[Math.floor(Math.random() * feats.length)];
    targetProvince = feats[Math.floor(Math.random() * feats.length)];

    if (startProvince.properties.name === targetProvince.properties.name) {
        pickStartAndTarget();
        return;
    }
}

// --------------------------------------------------------
// KOMŞU İLLER ÜZERİNDEN ROTA ÜRETME
// --------------------------------------------------------
function createRoute() {
    route = [];
    let current = startProvince.properties.name;

    while (current !== targetProvince.properties.name) {
        let next = findBestNeighbor(current, targetProvince.properties.name);
        route.push(next);
        current = next;

        // sonsuz döngü güvenliği
        if (route.length > 20) break;
    }

    console.log("Rota:", route);
}

function findBestNeighbor(current, target) {
    let list = neighbors[current];
    if (!list) return target;

    // hedefe en yakın komşuyu seç
    let tx = getCoord(target)[0];
    let ty = getCoord(target)[1];
    let best = list[0];
    let bestDist = 999999;

    for (let il of list) {
        let [x, y] = getCoord(il);
        let d = Math.sqrt((x - tx) ** 2 + (y - ty) ** 2);
        if (d < bestDist) {
            bestDist = d;
            best = il;
        }
    }
    return best;
}

function getCoord(cityName) {
    for (let f of provincesData.features) {
        if (f.properties.name === cityName) {
            return f.geometry.coordinates[0][0];
        }
    }
    return [0, 0];
}

// --------------------------------------------------------
// TIKLAMA KONTROLÜ
// --------------------------------------------------------
function onProvinceClick(feature, layer) {
    layer.on("click", function () {
        let clicked = feature.properties.name;
        console.log("Tıklanan:", clicked);

        let correctCity = route[currentStep];

        if (clicked === correctCity) {
            // DOĞRU
            score++;
            layer.setStyle({ fillColor: "lightblue" });
            currentStep++;

            if (currentStep >= route.length) {
                alert("Tebrikler! Rotayı tamamladın!");
            }
        } else {
            // YANLIŞ
            lives--;
            if (lives <= 0) {
                alert("Oyun bitti! Can kalmadı.");
            }
        }

        updateUI();
    });
}


// --------------------------------------------------------
function colorStartAndTarget() {
    provincesLayer.setStyle(f => {
        if (f.properties.name === startProvince.properties.name)
            return { fillColor: "lightgreen", color: "green" };
        if (f.properties.name === targetProvince.properties.name)
            return { fillColor: "pink", color: "red" };
        return { fillColor: "#ddd", color: "#444" };
    });
}

// --------------------------------------------------------
function startTimer() {
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        timeLeft--;
        updateUI();

        if (timeLeft <= 0) {
            alert("Süre doldu!");
            clearInterval(gameInterval);
        }
    }, 1000);
}
