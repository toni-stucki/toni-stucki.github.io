var map = new L.Map('map', {
    crs: L.CRS.EPSG3857,
    continuousWorld: true,
    worldCopyJump: false
  });
  var url = 'https://wms.geo.admin.ch/?';
  var tileLayer = new L.tileLayer('https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg');
  map.addLayer(tileLayer);
  map.setView(L.latLng(46.57591, 7.84956), 8);
  

  var skLayer = L.geoJSON(null, {onEachFeature}).addTo(map);
  var akLayer = L.geoJSON(null, {onEachFeature}).addTo(map);
  
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
      var endPoint = feature.geometry.coordinates[numOfPoints-1];
      var marker = L.marker([endPoint[1], endPoint[0]]);
      marker.bindPopup('<strong>' +feature.properties.gipfel + '</strong>')
      //onEachFeature(feature, marker);
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
  
    var popupContent = '<strong>' +feature.properties.description + '</strong>';
      popupContent += '<br/>' + "- Anreisezeit/Kletterzeit[h]: " + feature.properties.anreisezeit + "/" + feature.properties.kletterzeit;
      popupContent += '<br/>' + "- Literatur";
      for (const book of feature.properties.Books){
          popupContent += '<br/>' + '&nbsp'  + "- " + book.title;
      }
      layer.bindPopup(popupContent);
  }
  
  
  const overlays = {
      'Sportklettern': skLayer,
      'Alpines Klettern' : akLayer
  };
  
  const layerControl = L.control.layers(null, overlays).addTo(map);