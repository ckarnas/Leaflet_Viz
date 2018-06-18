// // Function to determine marker size based on population
function markerSize(earthquake_size) {
  return Math.pow((earthquake_size *100.5),2);
}

function createMap(magnitudes, earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiY2thcm5hcyIsImEiOiJjamh4aHJzcXgwYndpM3dydmV6aHNtNXdqIn0.LkWE7jBeB8nZmUqZNLgLvg");

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiY2thcm5hcyIsImEiOiJjamh4aHJzcXgwYndpM3dydmV6aHNtNXdqIn0.LkWE7jBeB8nZmUqZNLgLvg");

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Magnitudes: magnitudes,
    Earthquakes: earthquakes
  };
  console.log("++++++++++++++++")
  console.log(overlayMaps.Earthquakes)
  console.log(overlayMaps.Magnitudes)
  console.log("++++++++++++++")
  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 3,
    layers: [streetmap, magnitudes,earthquakes]
  });




  //Another Test...this plots the magnitude
  // sizeMarkers.forEach(function(element) {
  //   console.log(element);
  //   element.addTo(myMap);
  // });
//Another Test

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
var sizeMarkers = [];

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {

    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");

      var two_coords =[]
      two_coords.push(feature.geometry.coordinates[1]); 
      two_coords.push(feature.geometry.coordinates[0]); 
      console.log(feature.properties.mag);

      

      sizeMarkers.push(
        L.circle(two_coords, {
          color: 'red',
          stroke: false,
          fillColor: '#f03',
          fillOpacity: (feature.properties.mag/5),
          radius: markerSize(feature.properties.mag)
        })
      );
  }
  console.log("All together")
  console.log(sizeMarkers);
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });
  var magnitudes = L.layerGroup(sizeMarkers);
  console.log("let's compare")
  console.log(magnitudes)
  // Sending our earthquakes layer to the createMap function
  createMap(magnitudes,earthquakes);
  //console.log(sizeMarkers)



}




// Store our API endpoint inside queryUrl
//var queryUrl = "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
//  "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";
var queryUrl="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_day.geojson";
//var queryUrl="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});


