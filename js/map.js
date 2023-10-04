function initMap() {
    var uluru = {lat: parseFloat($('#lat')[0].value), lng: parseFloat($('#lng')[0].value)};
    var mapOptions = {
        zoom: 12,
        center: uluru,
        panControl: true,
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true,
        overviewMapControl: true,
        rotateControl: true
    };
    document.onscroll = map.resize;
    map.resize();
    map.map = new google.maps.Map(map.container, /*{zoom: 7, center: uluru}*/mapOptions);
    map.map.setMapTypeId(google.maps.MapTypeId.HYBRID);
}

let map = {};
map.markers = [];
map.shapes = [];
map.map = null;
map.container = $('#map')[0];
map.wrapper = $('#map-wrapper')[0];
map.addMarker = function (properties) {
    let marker = new google.maps.Marker({position: properties.position, map: map.map});
    if (properties.icon) {
        marker.setIcon(properties.icon);
    }
    if (properties.content) {
        var infoWindow = new google.maps.InfoWindow({
            content: properties.content
        });
        marker.addListener('click', function () {
            infoWindow.open(map.map, marker);
        });
    }
    map.markers.push(marker);
    return marker;
}
map.addPolyline = function (properties) {
    let polyline = new google.maps.Polyline({
        path: properties.path,
        geodesic: true,
        strokeColor: '#0000FF',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    polyline.setMap(map.map);
    map.shapes.push(polyline);
    return polyline;
}
map.clearAll = function () {
    map.clearMarkers();
    map.clearShapes();
}
map.clearMarkers = function () {
    map.clear(map.markers);
}
map.clearShapes = function () {
    map.clear(map.shapes);
}
map.clear = function (items) {
    items.forEach((item, index) => {
        item.setMap(null);
        item = null;
    });
    items = [];
}
map.resize = function () {
    let newSize = window.innerHeight - (map.wrapper.offsetTop - window.scrollY - 40 >= 0 ? map.wrapper.offsetTop - window.scrollY : 0) - 32;
    w3.addStyle('#map', 'height', newSize + 'px');
    let padding = window.scrollY - map.wrapper.offsetTop;
    w3.addStyle('#map-wrapper', 'padding-top', parseInt((padding > 0 ? padding : 0)) + 'px');
}