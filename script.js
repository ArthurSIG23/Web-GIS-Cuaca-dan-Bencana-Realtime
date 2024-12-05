// Inisialisasi peta OpenStreetMap
var map = L.map('map').setView([-3.795, 102.2655], 12); // Koordinat Bengkulu

// Tambahkan layer peta OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Fungsi untuk menambahkan marker ke peta
function addMarker(lat, lng, title, description) {
    var marker = L.marker([lat, lng]).addTo(map)
        .bindPopup(`<b>${title}</b><br>${description}`)
        .openPopup();
}

// Ambil data bencana dari GDACS
function getDisasterData() {
    var url = 'https://www.gdacs.org/gdacsapi/api/disasters.json';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.forEach(feature => {
                if (feature.location && feature.location.includes("Bengkulu")) {
                    var coords = feature.geometry.coordinates;
                    var title = feature.title;
                    var description = `Tipe: ${feature.type}, Status: ${feature.status}`;
                    addMarker(coords[1], coords[0], title, description);
                }
            });
        })
        .catch(error => console.error('Error fetching disaster data:', error));
}

// Ambil data cuaca dari Open-Meteo
function getWeatherData() {
    var lat = -3.795; // Koordinat Bengkulu
    var lon = 102.2655; // Koordinat Bengkulu
    var url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            var weather = data.current_weather;
            var title = "Cuaca Saat Ini";
            var description = `Suhu: ${weather.temperature}°C, Kecepatan Angin: ${weather.windspeed} km/h`;
            addMarker(lat, lon, title, description);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

// Panggil fungsi untuk mendapatkan data bencana dan cuaca
getDisasterData();
getWeatherData();