var map = L.map('map').setView([40.134091, -106.962891], 13);

L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.{ext}', {
    minZoom: 0,
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: 'png'
}).addTo(map);

fetch('data/naSpadefoot.geojson')
    .then(response => response.json())
    .then(data => {
        const groupedData = {};
        data.features.forEach(feature => {
            const countyName = feature.properties.place_county_name;
            if (!groupedData[countyName]) {
                groupedData[countyName] = [];
            }
            groupedData[countyName].push(feature);
        });

        const scale = d3.scaleLinear()
            .domain([0, d3.max(Object.values(groupedData), d => d.length)])
            .range([5, 20]); // Adjust range for desired symbol sizes

        Object.keys(groupedData).forEach(countyName => {
            const count = groupedData[countyName].length;
            const markerSize = scale(count);
            groupedData[countyName].forEach(feature => {
                const marker = L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
                    radius: markerSize
                }).addTo(map);
                marker.bindPopup(`County: ${countyName}<br>Observation Count: ${count}`);
            });
        });
    })
    .catch(error => console.error('Error!!!', error)); 

// Popup on map click
var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);

