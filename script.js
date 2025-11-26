// ===========================================
// GLOBAL DEĞİŞKENLER VE AYARLAR
// ===========================================

let map;
let geoJsonLayer;
let timerInterval;
let timeLeft = 60;
let score = 0;
let lives = 3;
let targetProvinces = []; // Bulunması gereken iller listesi (KÜÇÜK HARF)
let selectedProvinceName = null; // Kullanıcının tıkladığı ilin adı (BÜYÜK HARF)
let isGameActive = false;

let currentStartProvince = '';
let currentEndProvince = '';
const PROXIMITY_THRESHOLD = 0.8; 



// Türkiye illerinin merkez koordinatları
const PROVINCE_CENTROIDS = {
    "Ardahan": [41.106, 43.440], "Artvin": [41.431, 42.451], "Sirnak": [37.303, 43.362],
    "Hakkari": [37.303, 43.362], "Iğdir": [39.642, 44.458], "Agri": [39.969, 43.318],
    "Van": [37.733, 43.386], "Kirklareli": [41.540, 28.203], "Edirne": [41.975, 26.837],
    "Kars": [40.599, 42.536], "Mardin": [37.713, 41.816], "Sanliurfa": [37.375, 39.999],
    "Kilis": [36.673, 37.522], "Gaziantep": [37.445, 38.039], "Hatay": [36.960, 36.451],
    "Istanbul": [41.013, 29.018], "Tekirdag": [40.725, 26.786], "Çanakkale": [39.550, 26.667],
    "Rize": [41.301, 41.199], "Trabzon": [40.994, 40.352], "Giresun": [41.072, 39.148],
    "Bitlis": [39.491, 42.279], "Ordu": [40.958, 38.114], "Sinop": [41.641, 35.500],
    "Kastamonu": [41.960, 34.216], "Bartin": [41.859, 32.798], "Zinguldak": [41.599, 32.134],
    "Düzce": [41.150, 31.346], "Sakarya": [41.082, 30.955], "Kocaeli": [40.875, 29.253],
    "Yalova": [40.690, 29.428], "Bursa": [40.577, 29.926], "Balikesir": [40.459, 27.645],
    "Izmir": [39.170, 26.778], "Kütahya": [39.589, 28.967], "Mugla": [37.412, 27.403],
    "Denizli": [38.730, 29.032], "Afyonkarahisar": [39.206, 30.441], "Mersin": [36.093, 32.571],
    "Karaman": [36.438, 32.651], "Konya": [36.673, 32.456], "Nigde": [37.387, 34.791],
    "Kirsehir": [39.001, 33.930], "Sivas": [40.523, 38.158], "Erzincan": [40.054, 38.761],
    "Tunceli": [39.037, 38.745], "Elazig": [38.603, 37.284], "Mus": [39.491, 42.279],
    "Erzurum": [40.924, 42.279], "Bingöl": [39.548, 40.554], "Osmaniye": [37.271, 36.721],
    "Batman": [37.713, 41.816], "Siirt": [37.731, 43.023], "Yozgat": [39.833, 35.109],
    "Çorum": [40.554, 34.958], "Kinkkale": [40.054, 33.518], "Ankara": [39.930, 32.850],
    "Eskisehir": [39.776, 30.520], "Bolu": [40.732, 31.603], "Bilecik": [40.142, 30.125],
    "Amasya": [40.650, 35.833], "Aydin": [37.840, 27.840], "K. Maras": [37.585, 36.932], 
    "Tokat": [40.315, 36.550], "Gümüshane": [40.450, 39.450], "Bayburt": [40.250, 40.250], 
    "Samsun": [41.284, 36.330], "Çankiri": [40.600, 33.616]
};
// KRİTİK: YouTube API hazır olduğunda çağrılır ve oynatıcı nesnesini oluşturur
function onYouTubeIframeAPIReady() {
  youtubePlayer = new YT.Player('youtube-audio', {});
}
// ===========================================
// SABİT SORU LİSTESİ (9 ROTA) - SON HALİ
// ===========================================
const FIXED_ROUTES = [
    { 
        start: "Istanbul", 
        end: "Ankara", 
        targets: ["Bolu", "Kocaeli", "Sakarya"] 
    },
    { 
        start: "Antalya", 
        end: "Izmir", 
        targets: ["Aydin", "Mugla"] 
    },
    { 
        start: "Malatya", 
        end: "Adana", 
        targets: ["K. Maras", "Osmaniye"] 
    },
    { 
        start: "Van", 
        end: "Kastamonu", 
        targets: ["Sinop", "Samsun", "Ordu", "Giresun", "Gümüshane", "Bayburt", "Erzurum", "Agri"] 
    },
    { 
        start: "Eskisehir", 
        end: "Sivas", 
        targets: ["Ankara", "Kinkkale", "Yozgat"]
    },
    { 
        start: "Bursa", 
        end: "Ordu", 
        targets: ["Bilecik", "Bolu", "Çankiri", "Çorum", "Amasya", "Tokat"] 
    },
    { 
        start: "Trabzon", 
        end: "Samsun", 
        targets: ["Rize", "Giresun", "Ordu"] 
    },
    { 
        start: "Konya", 
        end: "Bursa", 
        targets: ["Afyonkarahisar", "Kütahya"] 
    },
    { 
        start: "Çanakkale", 
        end: "Mersin", 
        targets: ["Balikesir", "Kütahya", "Afyonkarahisar", "Konya", "Karaman"] 
    }
];


// ===========================================
// DOM ELEMENTLERİ
// ===========================================
const startButton = document.getElementById('start-btn');
const submitButton = document.getElementById('submit-btn');
const provinceInput = document.getElementById('province-input');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const instructionText = document.getElementById('instruction-text');
const feedbackMessage = document.getElementById('feedback-message');


// ===========================================
// HARİTA VE VERİ YÜKLEME
// ===========================================

function initMap() {
    map = L.map('map').setView([39.0, 35.0], 6);
    
    // KRİTİK: Harita alt katmanını sadeleştirmek için CartoDB Positron kullanıldı
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors, © CartoDB'
    }).addTo(map);

    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    
    if (map.getContainer().parentNode.id === 'game-container') {
        map.on('locationfound', function(e) {
            map.setView([39.0, 35.0], 6);
        });
    }
    startButton.disabled = true; 
}

function loadGeoJSON() {
    fetch('tr.json') 
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            geoJsonLayer = L.geoJson(data, {
                style: getProvinceStyle, 
                onEachFeature: onEachFeature
            }).addTo(map);
            
            startButton.disabled = false; 
            feedbackMessage.textContent = "Harita yüklendi. Oyuna başlamak için basınız.";
            updateUI(); 
        })
        .catch(error => {
            console.error('GeoJSON yüklenirken bir hata oluştu:', error);
            feedbackMessage.textContent = `Hata: Harita verileri yüklenemedi. (${error.message}). Lütfen Live Server kullandığınızdan emin olun.`;
            startButton.disabled = true;
        });
}

// İL STİLLERİ VE GÖRÜNÜRLÜK MANTIĞI (KRİTİK)
function getProvinceStyle(feature) {
    const name = feature.properties.name;
    const nameLower = name ? name.toLocaleLowerCase('tr') : '';
    
    if (!name) return {}; 

    // Oyun aktif değilken tüm iller varsayılan stilde görünür.
    if (!isGameActive) {
        return { 
             className: 'province-default',
             interactive: true 
        };
    }
    
    const targetLower = targetProvinces; 

    // 1. Başlangıç/Bitiş illeri için özel stil (MAVİ)
    if (name === currentStartProvince || name === currentEndProvince) {
        return { 
            className: 'province-target', 
            interactive: true,
            fillOpacity: 0.8,
            color: '#004488',
            weight: 2
        };
    } 
    
    // 2. Bulunmuş iller (YEŞİL)
    if (feature.layerRef && feature.layerRef.isFound) {
        return { 
            className: 'province-found', 
            interactive: true,
            fillOpacity: 0.8,
            color: '#009900',
            weight: 2
        };
    }

    // 3. Hedef İller Listesi'ndeki BULUNMAMIŞ iller (KIRMIZI)
    if (targetLower.includes(nameLower)) {
        return { 
            className: 'province-default', 
            interactive: true,
            fillOpacity: 0.7,
            color: '#990000',
            weight: 1
        };
    }
    
    // 4. Diğer TÜM İLLER (Rota dışı) - Görünmez ve Tıklanamaz (Oyun Kuralı)
    return {
        fillColor: '#FFFFFF', 
        color: '#FFFFFF',     
        weight: 0.1,          
        opacity: 0.0,         
        fillOpacity: 0.0,     
        interactive: false    
    };
}

function onEachFeature(feature, layer) {
    const provinceName = feature.properties.name; 
    layer.feature.layerRef = layer; 
    layer.setStyle(getProvinceStyle(feature));
    
    // KRİTİK: İl adlarını kalıcı etiket olarak ekleme (Görünürlük updateMapVisualization içinde yönetilir)
    if (layer.options.interactive) {
        layer.bindTooltip(provinceName, { 
            permanent: true, 
            direction: 'center', 
            className: 'province-name-label'
        });
        // Başlangıçta etiketler kapalı tutulur.
        layer.closeTooltip();
    }


    layer.on({
        click: (e) => handleProvinceClick(e, provinceName, layer),
        mouseover: (e) => {
            if(isGameActive && layer.options.interactive) e.target.setStyle({ weight: 3, opacity: 1, fillOpacity: 0.9 });
        },
        mouseout: (e) => {
            if(isGameActive && layer.options.interactive) {
                 e.target.setStyle(getProvinceStyle(feature));
            }
        }
    });
}



function handleProvinceClick(e, name, layer) {
    // Tıklanan il rotada değilse veya oyun aktif değilse çık
    if (!isGameActive || !layer.options.interactive) return; 

    updateMapVisualization(); // Önceki seçimin vurgusunu kaldır
    
    // KRİTİK DÜZELTME: İl adını sadece değişkende sakla, kullanıcıya gösterme
    selectedProvinceName = name;
    
    // Placeholder metnini sabit bir ifade yap
    provinceInput.placeholder = `Tahmin ettiğiniz ilin adını girin...`; 
    
    // Tıklanan ilin görsel vurgusu (Sarı)
    layer.setStyle({ 
        fillColor: '#ffee58', 
        weight: 3 
    });
    
    provinceInput.focus();
}

function updateMapVisualization() {
    if (!geoJsonLayer) return;

    geoJsonLayer.eachLayer(layer => {
        layer.feature.layerRef.setStyle(getProvinceStyle(layer.feature));
        
        // Etiket Görünürlüğü Yönetimi:
        const name = layer.feature.properties.name;
        
        // Sadece Başlangıç/Bitiş ve Bulunmuş illerin adını göster. Hedef (Kırmızı) iller gizli kalır.
        if (name === currentStartProvince || name === currentEndProvince || layer.isFound) {
             if (layer.getTooltip()) layer.openTooltip();
        } else if (layer.getTooltip()) {
             layer.closeTooltip(); // Kırmızı hedef illerin isimlerini gizle
        }
    });
}


// ===========================================
// OYUN ALGORİTMASI VE DÖNGÜSÜ
// ===========================================

// Haversine Formülü (Sadece mesafe kontrolü için tutulmuştur)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; 
}


// YENİ FONKSİYON: Rastgele sabit bir rotayı seçer
function getFixedRoute() {
    if (FIXED_ROUTES.length === 0) {
        console.error("Sabit rota listesi boş!");
        return { start: "Ankara", end: "Istanbul", targets: [] };
    }
    
    const randomIndex = Math.floor(Math.random() * FIXED_ROUTES.length);
    return FIXED_ROUTES[randomIndex];
}


function updateUI() {
    timerDisplay.textContent = `SÜRE: ${timeLeft.toString().padStart(2, '0')}`;
    scoreDisplay.textContent = `SKOR: ${score}`;
    livesDisplay.textContent = `CAN: ${'❤️'.repeat(lives)}${'🤍'.repeat(3 - lives)}`;
}



// script.js dosyasından:

function gameOver(isWin) {
    // KRİTİK: Zamanlayıcıyı hemen durdur
    clearInterval(timerInterval); 
    
    // MÜZİK KONTROLÜ ÇIKARILDI. Müzik arka planda çalmaya devam edecek.

    isGameActive = false;
    provinceInput.disabled = true;
    submitButton.disabled = true;
    startButton.textContent = "YENİ OYUN BAŞLAT";
    startButton.disabled = false;
    map.dragging.disable(); 
    
    currentStartProvince = '';
    currentEndProvince = '';
    
    const remainingTargets = targetProvinces; 
    targetProvinces = []; 
    
    updateMapVisualization();

    if (isWin) {
        feedbackMessage.textContent = `TEBRİKLER! Tüm illeri buldunuz! Final Skorunuz: ${score}`;
        feedbackMessage.style.color = 'green';
    } else {
        // KAYIP İLLERİ GÖSTERME MANTIĞI
        let message = `OYUN BİTTİ! Kalan can/süre kalmadı. Skorunuz: ${score}.`;
        feedbackMessage.style.color = 'red';
        
        if (remainingTargets.length > 0) {
            const missedProvinces = remainingTargets.map(name => 
                name.charAt(0).toUpperCase() + name.slice(1)
            ).join(', ');
            
            message += ` Bulmanız gereken kalan iller: ${missedProvinces}`;
        }
        
        feedbackMessage.textContent = message;
    }
}
function updateTimer() {
    timeLeft--;
    updateUI(); 
    if (timeLeft <= 0) {
        gameOver(false); 
    }
}


// script.js dosyasından:

// script.js dosyasından:

function startGame() {
    score = 0;
    lives = 3;
    timeLeft = 60;
    isGameActive = true;
    selectedProvinceName = null;
    provinceInput.value = '';
    
    provinceInput.disabled = false;
    submitButton.disabled = false;
    startButton.textContent = "OYNANIYOR...";
    startButton.disabled = true; 
    map.dragging.enable(); 

    // KRİTİK: MÜZİĞİ BAŞLAT (Kullanıcı etkileşiminden sonra sesi aç)
    if (youtubePlayer && typeof youtubePlayer.unMute === 'function') {
        youtubePlayer.unMute(); // Sesi aç
        youtubePlayer.playVideo(); // Video'yu oynat
    }


    // Sabit rotayı seç
    const selectedRoute = getFixedRoute();
    currentStartProvince = selectedRoute.start;
    currentEndProvince = selectedRoute.end;
    
    // Hedef iller listesini küçük harfe çevirip sakla
    targetProvinces = selectedRoute.targets.map(name => name.toLocaleLowerCase('tr'));
    
    if (geoJsonLayer) {
        geoJsonLayer.eachLayer(layer => layer.isFound = false);
    }
    
    // Harita görselleştirmesini güncelle
    updateMapVisualization();

    // Talimat Metnini güncelle
    instructionText.textContent = `Görev: ${currentStartProvince} ile ${currentEndProvince} arasındaki ${selectedRoute.targets.length} ili bulun.`;
    
    // Süre ve Canı güncelle
    updateUI();

    // Zamanlayıcıyı başlat
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}


// script.js dosyasından:

function handleGuess() {
    if (!isGameActive || !selectedProvinceName) {
        feedbackMessage.textContent = "Lütfen önce haritada bir il seçin ve adını girin.";
        return;
    }
    
    const guessedName = provinceInput.value.trim().toLocaleLowerCase('tr');
    const correctName = selectedProvinceName.toLocaleLowerCase('tr');
    
    let clickedLayer = null;
    geoJsonLayer.eachLayer(layer => {
        if (layer.feature.properties.name === selectedProvinceName) {
            clickedLayer = layer;
        }
    });

    const isTarget = targetProvinces.includes(correctName);
    
    if (clickedLayer && !clickedLayer.isFound && isTarget && correctName === guessedName) {
        // 1. DOĞRU TAHMİN 
        
        score += 10; 
        targetProvinces = targetProvinces.filter(name => name !== correctName); 
        clickedLayer.isFound = true; 
        
        feedbackMessage.textContent = `Doğru! ${selectedProvinceName} bulundu. +10 Puan. Kalan il: ${targetProvinces.length}`;
        feedbackMessage.style.color = 'green';
        
        // KRİTİK: TÜM İLLER BULUNDUĞUNDA OYUNU BİTİR VE FONKSİYONU TERK ET (Süre durur)
        if (targetProvinces.length === 0) {
            gameOver(true); 
            return; 
        }

    } else if (clickedLayer && clickedLayer.isFound) {
        // 2. İL ZATEN BULUNMUŞ
        feedbackMessage.textContent = `${selectedProvinceName} zaten bulundu! Başka bir il dene.`;
        feedbackMessage.style.color = 'orange';
        return;

    } else {
        // 3. YANLIŞ TAHMİN (Canımız azalacak)
        
        lives--;
        
        if (!isTarget) {
            feedbackMessage.textContent = `Yanlış Aralık! ${selectedProvinceName} hedef aralıkta değil. -1 Can.`;
        } else if (correctName !== guessedName) {
            feedbackMessage.textContent = `Yanlış İsim! İl adı doğru değil. -1 Can.`;
        } else {
            feedbackMessage.textContent = `Hata! Tahmin yanlış. -1 Can.`;
        }
        feedbackMessage.style.color = 'red';
    }
    
    // Temizlik ve Arayüz Güncellemesi (Tüm tahminlerden sonra çalışır)
    provinceInput.value = ''; 
    selectedProvinceName = null;
    updateMapVisualization(); 
    updateUI(); 
    
    if (lives <= 0) {
        gameOver(false);
    }
}

// ===========================================
// OLAY DİNLEYİCİLERİ
// ===========================================

startButton.addEventListener('click', startGame);
submitButton.addEventListener('click', handleGuess);
provinceInput.addEventListener('keypress', (e) => { 
    if (e.key === 'Enter' && isGameActive) {
        handleGuess(); 
    }
});

// ===========================================
// BAŞLANGIÇ
// ===========================================
initMap();
loadGeoJSON();