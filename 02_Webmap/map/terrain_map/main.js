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

    var map_start_location = [4.624335, -74.063644, 6]; // Bogota

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
        "minZoom" : 6,
        "maxZoom" : 15,
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



    /*function getColor(c){
        if ("BUENAVENTURA"==c){
            return '#ffa500';
        }
        else if ("TIBÚ"==c)
            return '#0000ff';
        else {
            return '#ffffff';
        }
    }*/






    //var search;

    //STYLE FUNCTION
    //READ BY L.geoJSON function
    function style(feature) {   
    return {
        weight: getLineWeight(feature.properties.Count),
        //color: '#ffa500',
        opacity: 0.5,
        color: '#ffa500'
        /*
        if("BUENAVENTURA"==leafletLayer.feature.properties.OrgMun){
            color:'#ffffff'
        } else {
            color: '#00ff00'
        }*/
        
        };
    };

    //COMPUTE LINE WEIGHT FROM count: PROPERTY
    function getLineWeight(c) {
    return c > 40000  ? 4 :
           c > 30000  ? 3.5 :
           c > 20000  ? 3 :
           c > 10000  ? 2.5 :
           c > 5000   ? 2 :
           c > 2500   ? 1.5 :
           c > 1000   ? 1 :
                        0.5;
}
/*
    function style(feature){
        if("BUENAVENTURA"==feature.properties.OrgMun){
                    return {color:'#ffffff'};
                } else {
                    return {color: '#00ff00'};
                }
    }*/

    //ADD GEOJSON LAYER TO MAP OBJECT
    var leafletLayer;
    function addDataToMap(data, map){
        leafletLayer = L.geoJSON(data, {
            style: style    
            }).addTo(map);
    };
    //GET DATA FROM GEOJSON
    $.getJSON("Displacement_Edited.geojson",
        function(data) {
            addDataToMap(data, map); 
        });



//NOT SURE WHY THIS IS .ONLOAD
window.onload = function(){
    //var vectors = new Lines();

    document.getElementById("hide").onclick=function(){  
    //var vectors = new Lines();
    map.removeLayer(leafletLayer);
    //leafletLayer.setStyle({color: lineColor})

    };

    document.getElementById("refresh").onclick=function(){  
    //var vectors = new Lines();
        refresh();
        leafletLayer.addTo(map);
    };

    /*document.getElementById("color").onclick=function(){
        leafletLayer.setStyle({color: lineColor});
    };*/
};


//RESETS ALL VECTOR OPACITY
function refresh(){
    leafletLayer.eachLayer(function (layer){
        layer.setStyle({opacity:0.5});
    });
}

//
function filter() {
    map.removeLayer(leafletLayer);
    refresh();
    var x = document.getElementById("mySelect").value;

    leafletLayer.eachLayer(function (layer){
        if (layer.feature.properties.OrgMun!=x){
            layer.setStyle({opacity: 0});
        };
    });
    leafletLayer.addTo(map);
}
//CHANGE COLOR WITH COLOR PICKRE
function update(jscolor){
    var line = '#'+jscolor;
    leafletLayer.setStyle({color:line});
}








/*
var lineColor;
function update(jscolor) {
        // 'jscolor' instance can be used as a string
        lineColor = '#' + jscolor;
        leafletLayer.setStyle({color:lineColor});
};
    */

/*
L.geoJSON(myLines, {
    style: myStyle
    }).addTo(map);*/








