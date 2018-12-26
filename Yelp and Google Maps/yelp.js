var map = null;
var radius = null;
var latitude = 32.75;
var longitude = -97.13;
var markers = [];

function initMap() {
    var map_Location = {lat: latitude, lng: longitude};
    map = new google.maps.Map(
        document.getElementById('maparea'), {zoom: 16, center: map_Location});
    new google.maps.Marker({position: map_Location, map: map});
    google.maps.event.addListener(map, 'bounds_changed',function () {
        updateBounds();
    });
}

function updateBounds() {
    var bounds = map.getBounds();
    var center = bounds.getCenter();
    var northEast = bounds.getNorthEast();
    latitude = center.lat();
    longitude = center.lng();
    updateRadius(center, northEast);
}

function updateRadius(center, northEast) {
    radius = Math.round(google.maps.geometry.spherical.computeDistanceBetween(center, northEast));
}

function addMarker(lat, lng, label) {
    if (map == null) {
        return;
    }
    // var labels = '0123456789';
    // var labelIndex = 0;
    var markerProperty = {
        position: {lat: lat, lng: lng},
        //label: labels[labelIndex++ % labels.length],
        map: map
    };
    if (label) {
        markerProperty.label = {
            text: label && label.toString() || "",
            fontWeight: "bold"
        }
    }
    markers.push(new google.maps.Marker(markerProperty));
}

function sendRequest() {
    clearMarkers();
    clearDocument();
     var out = document.getElementById("output");
    var xhr = new XMLHttpRequest();
    var Query = encodeURIComponent(document.getElementById("search").value);
    var url = "proxy.php?term=" + Query + "&latitude=" + latitude + "&longitude=" + longitude + "&limit=10";
    if (radius != null)
        url += "&radius=" + radius;
    xhr.open("GET", url);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
            var response = JSON.parse(this.responseText);
            var res = response.businesses;
           for (var i=0;i<res.length;i++){
            var bus =res[i];
            var br = document.createElement("br");
            var lin = document.createElement('a');
            var rat = document.createElement('rat');
            var results = document.createTextNode(bus.name);
            var rating = document.createTextNode("Rating:  "+bus.rating);
            lin.setAttribute("href",bus.url);
            lin.appendChild(results);
            rat.appendChild(rating);
            out.appendChild(lin);
            out.appendChild(rat);
            var x = document.createElement("IMG");
            x.setAttribute("src", bus.image_url);
            x.setAttribute("width", "200");
            x.setAttribute("height", "128");
            x.setAttribute("alt", "The Pulpit Rock");
            out.appendChild(x);
            out.appendChild(br);
            var coordinates = bus.coordinates;
            addMarker(coordinates.latitude, coordinates.longitude, i + 1);
            }
        }
    };
    xhr.send(null);
}

function clearMarkers() {
    for (var i = 0; i < markers.length; ++i) {
        markers[i].setMap(null);
    }
    markers = [];
}
function clearDocument(){
  var tex = document.getElementById("output");
  while(tex.firstChild)
  {
    tex.removeChild(tex.firstChild);
  }
}