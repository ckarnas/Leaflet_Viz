// // Function to determine marker size based on population
function markerSize(earthquake_size) {
    return Math.pow((earthquake_size *100.5),2);
  }
  
  function createMap(magnitudes, earthquakes, plates) {
  
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
      Earthquakes: earthquakes,
      Plates: plates
    };
    //console.log("++++++++++++++++")
   // console.log(overlayMaps.Earthquakes)
    //console.log(overlayMaps.Magnitudes)
    //console.log("++++++++++++++")
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        //37.09, -95.71
        17.5, 4
      ],
      zoom: 3,
      layers: [streetmap, magnitudes,earthquakes, plates]
    });
  
  
  
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map

    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  }
  var sizeMarkers = [];
  var plateMarkers=[];
  
  function createFeatures(earthquakeData) {
  
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
  
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  
        var two_coords =[]
        two_coords.push(feature.geometry.coordinates[1]); 
        two_coords.push(feature.geometry.coordinates[0]); 
        //console.log(feature.properties.mag);
  
        //console.log("Circle coords",two_coords)
  
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




    //console.log("All together")
    //console.log(sizeMarkers);
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature
    });



    function test(callback){
        d3.json(link, function(data) {
            // Creating a geoJSON layer with the retrieved data
            var latlng=[];
            var i;
            for (i = 0; i < data.features.length; i++) { 
                var i2;
                for (i2=0; i2<data.features[i].geometry.coordinates.length; i2++){
                    var temp = [];
                    temp = data.features[i].geometry.coordinates[i2]
                    var a = temp[0];
                    var b = temp[1];
                    var better = []
                    better.push(temp[1]);
                    better.push(temp[0]);
                    latlng.push(better)
                    //latlng.push(data.features[i].geometry.coordinates[i2]);
                }
            }
            //var latlng = data.features[0].geometry.coordinates;
            //console.log("Latlang",latlng)
           callback(latlng);
        });
     }
    
    test(function(latlng){

       plateMarkers=[];
       console.log("First latlng",latlng[0]);
       latlng.forEach(function(element) {
          
         console.log("Line coords",element);
         plateMarkers.push(
             L.circle(element, {color: 'black'})


         );
       });
     // var polyline = L.polyline(plates, {color: 'red'}).addTo(myMap);
//////////////////////////////////////////////////////////////////////////////////////////////////////////

    var magnitudes = L.layerGroup(sizeMarkers);
    var plates = L.layerGroup(plateMarkers);
    //console.log("let's compare Mags:")
    //console.log(magnitudes)
    //console.log("These are the plates")
    //console.log(plates)
    // Sending our earthquakes layer to the createMap function
    createMap(magnitudes,earthquakes, plates);
    //console.log(sizeMarkers)
  
});
  
  }
  
  
  
  
  // Store our API endpoint inside queryUrl

  var queryUrl="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_day.geojson";
  //var queryUrl="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";
  // Perform a GET request to the query URL
  d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });
  
  
  


  var link="https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
  // Our style object
  var mapStyle = {
    color: "white",
    fillColor: "pink",
    fillOpacity: 0.5,
    weight: 1.5
  };
  
