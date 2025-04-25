
var map = new L.Map('map', {
  crs: L.CRS.EPSG3857,
  continuousWorld: true,
  worldCopyJump: false
});
var url = 'https://wms.geo.admin.ch/?';
var tileLayer = new L.tileLayer('https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg');
map.addLayer(tileLayer);
map.setView(L.latLng(46.57591, 7.84956), 8);

var myStyle = {
    "color": "#7703fc",
    "weight": 10,
    "opacity": 0.65
};

var skLayer = L.geoJSON(null, {style: myStyle, onEachFeature: onEachFeature}).addTo(map);
var akLayer = L.geoJSON(null, {style: myStyle, onEachFeature: onEachFeature}).addTo(map);

for (var feature of tourenpunkte.features)
{
    switch (feature.properties.type){
        case "Sportklettern":
            skLayer.addData(feature);
            break;
        case "Alpines Klettern":
            akLayer.addData(feature);
            break;
        default:
    }
}

for (var feature of tourenlinien.features)
{
    var numOfPoints = feature.geometry.coordinates.length;
    var markerIndex = Math.ceil(numOfPoints/2);
    var endPoint = feature.geometry.coordinates[markerIndex-1];
    var marker = L.marker([endPoint[1], endPoint[0]]);
    marker.bindPopup(getPopUpContent(feature));

    switch (feature.properties.type){
        case "Sportklettern":
            skLayer.addData(feature);
            marker.addTo(skLayer);
            break;
        case "Alpines Klettern":
            akLayer.addData(feature);
            marker.addTo(akLayer);
            break;
        default:
    }
}


function onEachFeature (feature, layer)
{
    if (feature.geometry.type == 'Point')
    {
        layer.bindPopup(getPopUpContent(feature));
    }
}

function getPopUpContent (feature)
{
    var popupContent = '<strong>' +feature.properties.description + '</strong>';
    popupContent += '<br/>' + "- Anreisezeit/Kletterzeit[h]: " + feature.properties.anreisezeit + "/" + feature.properties.kletterzeit;
    popupContent += '<br/>' + "- Literatur";
    for (const book of feature.properties.Books){
        popupContent += '<br/>' + '&nbsp'  + "- " + book.title;
    }
    return popupContent;
}


const overlays = {
    'Sportklettern': skLayer,
    'Alpines Klettern' : akLayer
};

const layerControl = L.control.layers(null, overlays).addTo(map);



