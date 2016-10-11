/*jslint browser: true*/
/*global Tangram, gui */

function parseQuery (qstr) {
    var query = {};
    var a = qstr.split('&');
    for (var i in a) {
        var b = a[i].split('=');
        query[decodeURIComponent(b[0])] = decodeURIComponent(b[1]);
    }
    return query;
}



map = (function () {
    'use strict';

    var map_start_location = [4.624335, -74.063644, 12]; // Bogota

    /*** URL parsing ***/

    // leaflet-style URL hash pattern:
    // #[zoom],[lat],[lng]
    var url_hash = window.location.hash.slice(1, window.location.hash.length).split('/');

    if (url_hash.length == 3) {
        map_start_location = [url_hash[1],url_hash[2], url_hash[0]];
        // convert from strings
        map_start_location = map_start_location.map(Number);
    }

    // determine the scene url and content to load during start-up
    var scene_url = 'three-lights.yaml';

    // If there is a query, use it as the scene_url
    var query = parseQuery(window.location.search.slice(1));
    if (query.url) {
        scene_url = query.url;
    }
    /*** Map ***/

    var map = L.map('map', {
        "keyboardZoomOffset" : 1.,
        "minZoom" : 2,
        "maxZoom" : 16,
        }
    );

    var layer = Tangram.leafletLayer({
        scene: scene_url,
        attribution: '<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | &copy; OSM contributors | <a href="https://mapzen.com/" target="_blank">Mapzen</a>'
    });

    if (query.quiet) {
        layer.options.attribution = "";
        map.attributionControl.setPrefix('');
        window.addEventListener("load", function() {
            var div = document.getElementById("mz-bug");
            if (div != null) {div.style.display = "none";}
            div = document.getElementById("mz-citysearch");
            if (div != null) {div.style.display = "none";}
            div = document.getElementById("mz-geolocator");
            if (div != null) {div.style.display = "none";}
        });
    }

    if (query.noscroll) {
        map.scrollWheelZoom.disable();
    }

    window.layer = layer;
    var scene = layer.scene;
    window.scene = scene;

    // setView expects format ([lat, long], zoom)
    map.setView(map_start_location.slice(0, 3), map_start_location[2]);

    var hash = new L.Hash(map);

    layer.addTo(map);

 

    return map;

}());
/*
var myLines = [{ "type": "LineString",
    "coordinates": [ [-77.011535895500003,3.8754743059100001],[-77.002845043838448,3.8778107638653778] ]
    }];*/

var myStyle = {
        "color": "#ff0000",
        "weight": 1,
        "opacity": 0.65
};

function addDataToMap(data, map) {
    L.geoJSON(data, {
        style: myStyle
        }).addTo(map);

    //dataLayer.addTo(map);
}



$.getJSON("DisplacementSample2.geojson",function(data) {addDataToMap(data, map); });

/*
L.geoJSON(myLines, {
    style: myStyle
    }).addTo(map);*/








