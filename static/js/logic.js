// Initialize map.
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});

// Add a tile layer.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Access JSON data from URL.
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then(response => {
    features = response.features

    // Create a circle marker for each earthquake in the features array.
    for (let i = 0; i < features.length; i++) {
        let feature = features[i];
        let location = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
        L.circle(location, {
            fillOpacity: feature.geometry.coordinates[2]/200,
            color: getColor(feature.properties.mag),
            radius: markerSize(feature.properties.mag)
        }).bindPopup(`<h2>${feature.properties.title}</h2>`).addTo(myMap);
    }
});

// Function which determines the size of the circle marker.
function markerSize(magnitude) {
    return magnitude * 20000;
}

// Function which assigns a color based on the input magnitude.  
function getColor(d) {
    return d > 9 ? '#FF0D0D' :
        d > 7.5 ? '#FF4E11' :
        d > 6 ? '#FF8E15' :
        d > 4.5 ? '#FAB733' :
        d > 4 ? '#FFD700' :
        '#69B34C';
}

// Create map legend.
let legend = L.control({ position: "bottomright" });

legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");

    let grades = [9, 7.5, 6, 4.5, 4, 0];
    let colors = ['#FF0D0D', '#FF4E11', '#FF8E15', '#FAB733', '#FFD700', '#69B34C'];

    // Loop through our intervals and generate a label with a colored square for each interval.
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<div style="display: flex; align-items: center;">' +
            '<p style="margin-right: 10px;">' + (grades[i] === 0 ? '&lt;4' : grades[i] + (grades[i + 1] ? '-' + grades[i + 1] : '+')) + '</p>' +
            '<div style="width: 20px; height: 20px; background-color: ' + colors[i] + ';"></div>' +
            '</div>';
    }
    return div;
};

// Add the legend to the map.
legend.addTo(myMap);
