
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
    var scene_url = '/scene_files/three-lights.yaml';

    // If there is a query, use it as the scene_url
    var query = parseQuery(window.location.search.slice(1));
    if (query.url) {
        scene_url = query.url;
    }
    /*** Map ***/

    var map = L.map('map', {
        "keyboardZoomOffset" : 1.,
        "minZoom" : 0,
        "maxZoom" : 15,
        "zoomControl" : true,
        }
    );
    //map._initPathRoot();

    var layer = Tangram.leafletLayer({
        scene: scene_url,
        attribution: '<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | &copy; OSM contributors | <a href="https://mapzen.com/" target="_blank">Mapzen</a>'
    });

    map.createPane('labels');
    //map.createPane('overlayPane');


//LABELS
    var positronLabels = Tangram.leafletLayer({
        scene: '/scene_files/labels.yaml',
        attribution: '<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | &copy; OSM contributors | <a href="https://mapzen.com/" target="_blank">Mapzen</a>',
        pane: 'labels'
    });

   positronLabels.addTo(map);




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

//END OF MAPZEN CODE



var lookup={}
//console.log(lookup);

for (i = 0; i<csv.length; i++)
{
    lookup[csv[i][3]]=csv[i][0];
}

//USE D3 TO LOAD VECTORS AS SVG ELEMENTS




var svg = d3.select(map.getPanes().overlayPane).append("svg"),
    g = svg.append("g").attr("class", "leaflet-zoom-hide");
   

d3.json("DisplacementLargeEdited_200+.geojson", function(error, collection) {
  if (error) throw error;

  var transform = d3.geo.transform({point: projectPoint}),
      path = d3.geo.path().projection(transform);

    

  var feature = g.selectAll("path")
        .attr("class","vector")
      .data(collection.features)
    .enter().append("path");
        



  

    for (i=0; i<collection.features.length;i++)


    {

        var direction
        //POS = south
        var directionLon = collection.features[i].properties.OrgLon-collection.features[i].properties.DestLon;

        //pos = east
        var directionLat = collection.features[i].properties.OrgLat-collection.features[i].properties.DestLat;

        if (directionLon>0)
        {
            if (directionLat>0){
                direction = "NE";
                feature[0][i].setAttribute("direction", "NE");
                feature[0][i].setAttribute("stroke","url(#NE)");

            }
            else{
                direction = "SE";
                feature[0][i].setAttribute("direction", "SE");
                feature[0][i].setAttribute("stroke","url(#SE)");
            }
        }
        else{
            if (directionLat>0){
                direction = "NW";
                feature[0][i].setAttribute("direction", "NW");
                feature[0][i].setAttribute("stroke","url(#NW)");
            }
            else{
                direction = "SW";
                feature[0][i].setAttribute("direction", "SW");
                feature[0][i].setAttribute("stroke","url(#SW)");
            }
        }


        feature[0][i].setAttribute("class",collection.features[i].properties.DestMun.replace(/\s+/g, '-').replace(',',''));

  
   
        feature[0][i].setAttribute("stroke-width",getLineWeight(collection.features[i].properties.Count));
        feature[0][i].setAttribute("destination",collection.features[i].properties.DestMun);

        feature[0][i].setAttribute("origin",collection.features[i].properties.OrgMun.replace(/\s+/g, '-').replace(',',''));

        //console.log(feature[0][i].getAttribute("origin"));


        feature[0][i].setAttribute("hide", "1");

    }






  map.on("viewreset", reset);
  reset();


  // Reposition the SVG to cover the features.
  function reset() {
      console.log("reset");
    var bounds = path.bounds(collection),
        topLeft = bounds[0],
        bottomRight = bounds[1];
        
    svg .attr("width", bottomRight[0] - topLeft[0])
        .attr("height", bottomRight[1] - topLeft[1])
        .style("left", topLeft[0] + "px")
        .style("top", topLeft[1] + "px");

    g   .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

    feature.attr("d", path);

  }

  // Use Leaflet to implement a D3 geometric transformation.
  function projectPoint(x, y) {
    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
    


  }
});


  


function getLineWeight(c) {
    return c > 40000  ? 6 :
           c > 30000  ? 5 :
           c > 20000  ? 4 :
           c > 10000  ? 3 :
           c > 5000   ? 2 :
           c > 2500   ? 0.7 :
           c > 1000   ? 0.4 :
                        0.2;
};









  




var cities = [
["BOGOTÁ D.C.", [4.65052840264, -74.105971599], 6376000,],
["SANTIAGO DE CALI", [3.417586541, -76.5223324663],2040000],
["MEDELLÍN", [6.24894080931, -75.577055625699899], 2184000],
["SANTA MARÍA", [2.93902635801, -75.586686826999895],383991],
["VALLEDUPAR", [10.461893398500001, -73.258517044399895], 294731],
["BUENAVENTURA", [3.87547430591, -77.011535895500003], 290475] ,
["POPAYÁN", [2.4476985537, -76.6244690332],227840],
["SINCELEJO", [9.30045521524, -75.395996064399895],218430],
["TUMACO", [1.76133367771, -78.781544044499896], 203971],
["FLORENCIA", [1.61733394988, -75.606890209100001],163323],
["APARTADÓ", [7.88271669619, -76.626185972299893],114840],
["TURBO", [8.09409673761, -76.7264318309999], 163525],
["SAN FRANCISCO DE QUIBDO", [5.69234946496, -76.651124632600002], 100113],
["CIÉNAGA DE ORO", [8.87817659507, -75.622109338499897], 100908],
["EL CARMEN DE BOLÍVAR", [9.718034220970001, -75.121138832699899], 159987],
["SEGOVIA", [7.07992032695, -74.699300037499896], 40714],
["TIBÚ", [8.639717700409991, -72.735919371600005], 36502],
["MITÚ", [1.25114267922, -70.234986307900002], 14112],
["RIOSUCIO", [7.43338275367, -77.111109838], 57220],
["SAN PABLO", [7.47747543639, -73.924557832700003], 27108],
["EL CHARCO", [2.47697407881, -78.1102980565],28673],
["SAMANÁ", [5.41307433341, -74.9923802604999], 25649],
["ITUANGO", [7.17162301036, -75.76416656], 22952],
["INÍRIDA", [3.86469882092, -67.917962587700003], 17866],
["MUTATÁ", [7.24396317282, -76.436704695499898], 32500],
["SAN LUIS", [6.04286525408, -74.994392230900004], 11009],
["ARGELIA", [5.7315608939, -75.142715590500003], 10091],
["GRANADA", [3.5448713658, -73.706271300799898], 98824],
["RICAURTE (COLOSO)", [9.49099729992999, -75.3560877468], 6214]
];


var citiesNoAccent=[
"BOGOTA-DC","SANTIAGO-DE-CALI", "MEDELLIN", "SANTA-MARIA", "VALLEDUPAR","BUENAVENTURA","POPAYAN","SINCELEJO", "TUMACO","FLORENCIA","APARTADO","TURBO", "SAN-FRANCISCO-DE-QUIBDO", "CIENAGA-DE-ORO", "EL-CARMEN-DE-BOLIVAR", "SEGOVIA","TIBU","MITU", "RIOSUCIO", "SAN-PABLO","EL-CHARCO", "SAMANA", "ITUANGO", "INIRIDA","MUTATA", "SAN-LUIS","ARGELIA", "GRANADA", "RICAURTE-(COLOSO)"];



var smallIcon = L.icon({
    iconUrl: 'icon.png',
    iconSize: [20, 23.75],
    iconAnchor: [10, 23.5/2],
    popupAnchor: [-0.75, -16.5]
});


var mediumIcon = L.icon({
    iconUrl: 'icon.png',
    iconSize: [30, 35.625],
    iconAnchor: [15, 35.625/2],
    popupAnchor: [-0.75, -16.5]
});


var largeIcon = L.icon({
    iconUrl: 'icon.png',
    iconSize: [40, 47.5],
    iconAnchor: [20, 47.5/2],
    popupAnchor: [-0.75, -16.5]
});

function chooseIcon(population){
   if (population<100000){
    return smallIcon;
   } else if (population<1000000){
    return mediumIcon;
   } else{
    return largeIcon;
   }
}



for (j=0; j<29; j++)
{
    

    var marker = L.marker(cities[j][1],

        {



        icon: chooseIcon(cities[j][2]),
        opacity: 1} 
 
        )
       
        .addTo(map);

    var icon = document.getElementsByClassName("leaflet-marker-icon")[j];
    icon.className+=" "+cities[j][0].replace(/\s+/g, '-');
    icon.setAttribute("onclick", 'markerClick(this.classList.item(3))');

    
};


var lastClicked=0;
function markerClick(city){
    
    var mapDiv = document.getElementById("console");

    var paths = document.getElementsByTagName('path');
       [].forEach.call(paths, function(test){
  
           test.setAttribute("hide","1");

       });



    
    var icon  = Array.prototype.slice.call(document.getElementsByClassName(city));
    console.log(icon);

    
    lastClicked=city;

    [].forEach.call(icon, function(test){  

        test.setAttribute("hide","0");
        test.setAttribute("display", 'block');

    });









    var paths = document.getElementsByTagName('path');
    [].forEach.call(paths, function(test){
        if(test.getAttribute("hide")>0){

            //$(test).fadeTo(1000,0);
            test.setAttribute("display",'none');
        };
    });
    
    
    

    var info = document.getElementById("image");


    // while (info.hasChildNodes()) {
    //     info.removeChild(info.firstChild);
    // }

    var city_space = city.replace(/-/g,' ');
    console.log(city);


    for (i = 0;i<cities.length; i++)
    {
        if (city.replace(/-/g,' ') ==cities[i][0]){

            $('#image').fadeTo(400,0);
            info.innerHTML='<br>';
           
            info.innerHTML="<img src=img/"+citiesNoAccent[i]+".jpg>";
            info.style.display='block';
            $('#image').fadeTo(400,1);
            break;
        }else if (i==cities.length-1){
            $('#image').fadeTo(400,0);
            info.style.display='none';
        }
    }
    $('#title').html(city);



    //info.innerHTML=getElement(city_space,1);



    mapDiv.style.visibility="visible";
    //mapDiv.style.opacity=1;
    $("#desplazados").animate({'width':''+csv[lookup[city_space]][11]/5000+"px"});
    document.getElementById("dtext").innerHTML=""+ csv[lookup[city_space]][11] +" Desplazados";


    $("#refugiados").animate({'width':''+csv[lookup[city_space]][12]/5000+"px"});
    document.getElementById("rtext").innerHTML=""+ csv[lookup[city_space]][12] +" Refugiados";


    $("#ipc").animate({'width':''+csv[lookup[city_space]][13]/5000+"px"});
    document.getElementById("itext").innerHTML=""+ csv[lookup[city_space]][11] +" ICP's";
    $(mapDiv).fadeTo(1000,1)
    // $('.console').css('opacity','1');

    //mapDiv.appendChild(info);
    //console.log(mapDiv);
    

    

}


function getCity(index){
    return cities[index];
};


$(document).click(function(event){


    if (event.target.classList.item(3)!=lastClicked){

        var mapDiv = document.getElementById("console");

        var paths = document.getElementsByTagName('path');
           [].forEach.call(paths, function(test){
               //$(test).fadeTo(1000,1)
               test.setAttribute("display", 'block');
               test.setAttribute("hide","1");
               //console.log("hello");
           });
           setTimeout(function(){
               //do what you need here
           }, 1000);
           $(mapDiv).fadeTo(1000,0);
    }
    
});





