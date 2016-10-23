// =======================================================================
// * ~ * ~ * ~ * ~ * ~ * ~ * ~ * ~ * ~ * ~ * ~ * ~ * ~ * ~ * ~ * ~ * ~ * ~
// ~ * ~ * ~ * ~ * ~ * ~ * ~ INTERACTIVE HRW MAP * ~ * ~ * ~ * ~ * ~ * ~ * 
// * ~ * ~ * ~ * ~ * ~ * ~ * ~ * ~ * ~ * ~ * ~ * ~ * ~ * ~ * ~ * ~ * ~ * ~

// Description here

// Juan Saldarriaga & Mike Howard, Center for Spatial Research, Fall 2016

// ====================================================================
// ====================== IMPORTING LIBRARIES =========================
// ====================================================================

// import java.util.*;
// import java.util.Comparator;

// ====================================================================
// ================== GLOBAL VARIABLE DECLARATION =====================
// ====================================================================

var canvasWidth;
var canvasHeight;
var victimsTable;
var currentFrame;
var saveFrame1x = true;
var saveFrame2x = false;
var titleFont;
var mytextFont;
var subtitleFont;
var record;    // Victims[] record;
var margin = 25;
var numberOfYears = 31;
var mainHeight = 800;
// var pixelSize = 1;
var horizontalSpacing = 3;
var verticalSpacing = 3;
var startVictimsY = 70;
var endVictimsY = 1030;
var endVictimsX = 1465;
var popupX = 300;
var popupY = 118;
var textX = 300;
var textY = 118;
var parametros = true; //It was false
var age = false;
var gender = false;
var actor = false;
var race = false;
var highlight = 0;
var highlightOrder = 0;
var damping = 0.07;
var color1, color2, color3, color4;
var bogota = false;
var selectedRecord = 101000;
var save = false; // It was false
var changeRate = 185; // It was 205
var other = false;
var largeList;
var smallList;
var selectedList;
var selectedMunicipality = 0;
var highlightMunicipalities = true; //******
var specialMunicipalities = [76828, 5837, 50325, 27615, 97001, 54810, 13244, 5649, 27099, 76109];
var listSortType = ["Other", "Threat", "Other", "Other", "Forced Displacement", "Homicide / Massacre", "Other", "Other", "Other", "Other", "Other", "Other", "Other", "Other"];


// ====================================================================
// ======================= PRE-LOADING DATA ===========================
// ====================================================================

function settings() {
    //fullScreen();
    if (saveFrame1x){
        canvasWidth = 1920;
        canvasHeight = 1080;
    }
    else{
        canvasWidth = 1920 * 2;
        canvasHeight = 1080 * 2;
    }
    size(canvasWidth, canvasHeight);
    smooth(8);
    pixelDensity(displayDensity());
}

function loadData() {
    // victimsTable = loadTable("data/SmallTest200K.csv", "header");
    victimsTable = loadTable("data/MH_1k_test.csv", "header");

    println(victimsTable);
    // var numberOfRecords = victimsTable.getRowCount();
    // println(numberOfRecords);
    var numberOfRecords = 1000;
    // record = new Victims[numberOfRecords];
    record = [];
    var paramHecho, ocurrenciaYear, ocurrenciaMonth, ocurrenciaDay, daneOcurrencia, reporteYear, reporteMonth, reporteDay, daneDeclaracion, llegadaYear, llegadaMonth, llegadaDay, daneUbicacion, daneLlegada, birthYear;
    var actorEvent, dateEvent, dateReport, tipoDesplazamiento, tipoDeVictima, mpioOcurrencia, mpioLlegada, mpioUbicacion, mpioDeclaracion, genero, ethnicity, ageGroup, cityType, sortType;
    var autorGuerrillas, autorParamilitares, autorFuerzaPublica, autorBacrim, autorOtros, autorNoId;
    var recordIndex = 0;

    for (var rowIndex = 0; rowIndex < numberOfRecords; rowIndex++) {
        
        var row = victimsTable.getRow(rowIndex)

        var positionX = margin + floor((recordIndex * verticalSpacing)/(endVictimsY - startVictimsY)) * horizontalSpacing;
        var positionY = startVictimsY + (recordIndex * verticalSpacing) % (endVictimsY - startVictimsY);
        cityType = row.getString("highlight");
        if (row.getString("genero_hom").equals("Hombre")){
            genero = "Male";
        }
        else if (row.getString("genero_hom").equals("Mujer")){
            genero = "Female";
        }
        else{
            genero = "Other or N/A";
        }
        if (row.getString("pert_etnica").equals("Negro(a) o Afrocolombiano(a)")){
            ethnicity = "Afrocolombian";
        }
        else if (row.getString("pert_etnica").equals("Gitano(a) ROM")){
            ethnicity = "ROM";
        }
        else if (row.getString("pert_etnica").equals("Indigena")){
            ethnicity = "Indigenous";
        }
        else if (row.getString("pert_etnica").equals("Palenquero")){
            ethnicity = "Palenquero";
        }
        else if (row.getString("pert_etnica").equals("Raizal del Archipielago de San Andres y Providencia")){
            ethnicity = "San Andres and Providencia";
        }
        else{
            ethnicity = "None";
        }
        paramHecho = row.getInt("param_hecho");
        sortType = listSortType[paramHecho - 1];
        dateEvent = row.getString("f_ocurrencia_hecho");
        dateReport = row.getString("f_reporte_hecho");
        ocurrenciaYear = parseInt(split(split(row.getString("f_ocurrencia_hecho"), ' ')[0], '-')[0]);
        ocurrenciaMonth = parseInt(split(split(row.getString("f_ocurrencia_hecho"), ' ')[0], '-')[1]);
        ocurrenciaDay = parseInt(split(split(row.getString("f_ocurrencia_hecho"), ' ')[0], '-')[2]);
        daneOcurrencia = row.getInt("dane_ocurrencia");
        reporteYear = parseInt(split(split(row.getString("f_reporte_hecho"), ' ')[0], '-')[0]);
        reporteMonth = parseInt(split(split(row.getString("f_reporte_hecho"), ' ')[0], '-')[1]);
        reporteDay = parseInt(split(split(row.getString("f_reporte_hecho"), ' ')[0], '-')[2]);
        birthYear = parseInt(split(split(row.getString("f_nacimiento"), ' ')[0], '-')[0]);
        if (paramHecho == 5){
            llegadaYear = parseInt(split(split(row.getString("f_llegada"), ' ')[0], '-')[0]);
            llegadaMonth = parseInt(split(split(row.getString("f_llegada"), ' ')[0], '-')[1]);
            llegadaDay = parseInt(split(split(row.getString("f_llegada"), ' ')[0], '-')[2]);
            daneLlegada = row.getInt("dane_llegada");
            mpioLlegada = row.getString("mpio_llegada");
            tipoDesplazamiento = row.getString("tipo_desplazamiento");
        }
        else{
            llegadaYear = 0;
            llegadaMonth = 0;
            llegadaDay = 0;
            daneLlegada = 0;
            mpioLlegada = "N/A";
            tipoDesplazamiento = "N/A"; 
        }
        daneDeclaracion = row.getInt("dane_decla");
        daneUbicacion = row.getInt("dane_ub");
        mpioOcurrencia = row.getString("mpio_ocurrencia");
        mpioUbicacion = row.getString("mpio_ubicacion");
        mpioDeclaracion = row.getString("mpio_declaracion");
        tipoDeVictima = row.getString("tipo_victima");
        if (row.getInt("autor_guerrillas") == 0){
            autorGuerrillas = false;
        }
        else{
            autorGuerrillas = true;
        }
        if (row.getInt("autor_paramilitares") == 0){
            autorParamilitares = false;
        }
        else{
            autorParamilitares = true;
        }
        if (row.getInt("autor_fuerza_publica") == 0){
            autorFuerzaPublica = false;
        }
        else{
            autorFuerzaPublica = true;
        }
        if (row.getInt("autor_bacrim") == 0){
            autorBacrim = false;
        }
        else{
            autorBacrim = true;
        }
        if (row.getInt("autor_otros") == 0){
            autorOtros = false;
        }
        else{
            autorOtros = true;
        }
        if (row.getInt("autor_no_identifica") == 0){
            autorNoId = false;
        }
        else{
            autorNoId = true;
        }
        if (autorGuerrillas){
            actorEvent = "Guerrillas";
        }
        else if (autorParamilitares){
            actorEvent = "Paramilitaries";
        }
        else if (autorFuerzaPublica){
            actorEvent = "Armed Forces";
        }
        else{
            actorEvent = "Other";
        }
        record[recordIndex] = new Victims(actorEvent, paramHecho, ocurrenciaYear, ocurrenciaMonth, ocurrenciaDay, daneOcurrencia, reporteYear, reporteMonth, reporteDay, daneDeclaracion, llegadaYear, llegadaMonth, llegadaDay, daneUbicacion, daneLlegada, tipoDesplazamiento, tipoDeVictima, mpioOcurrencia, mpioLlegada, mpioUbicacion, mpioDeclaracion, autorGuerrillas, autorParamilitares, autorFuerzaPublica, autorBacrim, autorOtros, autorNoId, positionX, positionY, genero, ethnicity, dateEvent, dateReport, cityType, sortType);
        recordIndex++;
    }
    println("Finished loading the data... " + str(numberOfRecords) + " records loaded...");
}


// ====================================================================
// ============================= SET-UP ===============================
// ====================================================================

function setup() {
    colorMode(HSB, 360, 100, 100, 100);
    background(0);
    loadData();
    // textFont = createFont("AkzidenzGrotesk-Regular.otf", 12, true);
    // titleFont = createFont("AkzidenzGrotesk-Medium.otf", 24, true);
    // subtitleFont = createFont("AkzidenzGrotesk-Medium.otf", 14, true);
    // textFont = titleFont = subtitleFont = ("Arial");
    titleFont = mytextFont = subtitleFont = "Arial";
    // text("Font Style Normal", 10, 30);
}


// ====================================================================
// ====================== INTERACTIVE DRAWING =========================
// ====================================================================

function drawLabels(){
    if(parametros){
        color1 = color(24, 100, 90.2, 100);
        color2 = color(169, 100, 90.2, 100);
        color3 = color(211.2, 73.7, 82, 100);
        color4 = color(0, 0, 35, 100);
    }
    else if(actor){
        color1 = color(317.8, 82.2, 88.2, 100);
        color2 = color(77.8, 82.2, 88.2, 100);
        color3 = color(197.8, 82.2, 88.2, 100);
        color4 = color(0, 0, 35, 100);
    }
    else if(race){
        color1 = color(150, 75, 70, 100);
        color2 = color(39, 75, 100, 100);
        color3 = color(279, 75, 75, 100);
        color4 = color(0, 0, 35, 100);
    }
    noStroke();
    fill(0, 0, 100, 100);
    textFont(titleFont);
    textAlign(LEFT, BOTTOM);
    text("Victims", margin, 60);
    textFont(mytextFont);
    textAlign(LEFT, BOTTOM);
    text("A random sample of 200,000 victims of the conflict", 115, 60);
    text("Symbolize by", 420, 60);
    fill(0, 0, 20, 100);
    for (var i = 0; i < 4; ++i) {
        rect(492 + i * 78, 45, 75, 15);
    }
    if (highlight > 0){
        fill(0, 0, 50, 100);
        rect(492 + (highlight - 1) * 78, 45, 75, 15);
    }
    else{}
    noStroke();
    fill(0, 0, 100, 100);
    var symbolizeLabels = ["Type", "Actor", "Gender", "Ethnicity"];
    textAlign(CENTER, BOTTOM);
    for (var i = 0; i < symbolizeLabels.length; ++i) {
        text(symbolizeLabels[i], 492 + 37 + i * 78, 60);
    }
    textAlign(LEFT, BOTTOM);
    if (parametros) {
        fill(color1);
        rect(825, 49, 8, 8);
        fill(color2);
        rect(920, 49, 8, 8);
        fill(color3);
        rect(1055, 49, 8, 8);
        fill(color4);
        rect(1115, 49, 8, 8);
        fill(0, 0, 100, 100);
        text("Displacement", 837, 60);
        text("Homicide / Massacre", 932, 60);
        text("Threat", 1067, 60);
        text("Other", 1127, 60);
    }
    if (actor) {
        fill(color1);
        rect(825, 49, 8, 8);
        fill(color2);
        rect(900, 49, 8, 8);
        fill(color3);
        rect(995, 49, 8, 8);
        fill(color4);
        rect(1095, 49, 8, 8);
        fill(0, 0, 100, 100);
        text("Guerrillas", 837, 60);
        text("Paramilitaries", 912, 60);
        text("Armed Forces", 1007, 60);
        text("Other or Non Identified", 1107, 60);
    }
    if (race) {
        fill(color1);
        rect(825, 49, 8, 8);
        fill(color2);
        rect(880, 49, 8, 8);
        fill(color3);
        rect(980, 49, 8, 8);
        fill(color4);
        rect(1065, 49, 8, 8);
        fill(0, 0, 100, 100);
        text("None", 837, 60);
        text("Afrocolombian", 892, 60);
        text("Indigenous", 992, 60);
        text("Other", 1077, 60);
    }
    if (gender) {
        fill(color1);
        rect(825, 49, 8, 8);
        fill(color2);
        rect(900, 49, 8, 8);
        fill(color3);
        rect(995, 49, 8, 8);
        fill(0, 0, 100, 100);
        text("Male", 837, 60);
        text("Female", 912, 60);
        text("Other or N/A", 1007, 60);
    }
    textAlign(LEFT, BOTTOM);
    fill(0, 0, 100, 100);
    text("Order by", 1300, 60);
    noStroke();
    fill(0, 0, 100, 100);
    var orderLabels = ["Event Date", "Type", "Actor", "Gender", "Ethnicity", "Report Date"];
    fill(0, 0, 20, 100);
    for (var i = 0; i < orderLabels.length; ++i) {
        rect(1350 + i * 78, 45, 75, 15);
    }
    if (highlightOrder > 0){
        fill(0, 0, 50, 100);
        rect(1350 + (highlightOrder - 1) * 78, 45, 75, 15);
    }
    else{
    }
    fill(0, 0, 100, 100);
    textAlign(CENTER, BOTTOM);
    for (var i = 0; i < orderLabels.length; ++i) {
        text(orderLabels[i], 1350 + 37 + i * 78, 60);
    }
}

// function keyPressed(){
//     if (key == 's'){
//         var newX, newY;
//         Arrays.sort(record, new SortRecords("yearEvent"));
//         println("Sort year attempted...");
//         for (var i = 0; i < record.length; ++i) {
//             newX = margin + floor((i * verticalSpacing)/(endVictimsY - startVictimsY)) * horizontalSpacing;
//             newY = startVictimsY + (i * verticalSpacing) % (endVictimsY - startVictimsY);
//             record[i].updateLocation(newX, newY);
//         }
//         highlightOrder = 1;
//     }
//     else if (key == 'g'){
//         var newX, newY;
//         Arrays.sort(record, new SortRecords("gender"));
//         println("Sort gender attempted...");
//         for (var i = 0; i < record.length; ++i) {
//             newX = margin + floor((i * verticalSpacing)/(endVictimsY - startVictimsY)) * horizontalSpacing;
//             newY = startVictimsY + (i * verticalSpacing) % (endVictimsY - startVictimsY);
//             record[i].updateLocation(newX, newY);   
//         }
//         highlightOrder = 4;
//     }
//     else if (key == 'r'){
//         var newX, newY;
//         Arrays.sort(record, new SortRecords("report"));
//         println("Sort report attempted...");
//         for (var i = 0; i < record.length; ++i) {
//             newX = margin + floor((i * verticalSpacing)/(endVictimsY - startVictimsY)) * horizontalSpacing;
//             newY = startVictimsY + (i * verticalSpacing) % (endVictimsY - startVictimsY);
//             record[i].updateLocation(newX, newY);   
//         }
//         highlightOrder = 6;
//     }
//     else if (key == 'a'){
//         var newX, newY;
//         Arrays.sort(record, new SortRecords("eventActor"));
//         println("Sort actor attempted...");
//         for (var i = 0; i < record.length; ++i) {
//             newX = margin + floor((i * verticalSpacing)/(endVictimsY - startVictimsY)) * horizontalSpacing;
//             newY = startVictimsY + (i * verticalSpacing) % (endVictimsY - startVictimsY);
//             record[i].updateLocation(newX, newY);   
//         }
//         highlightOrder = 3;
//     }
//     else if (key == 't'){
//         var newX, newY;
//         Arrays.sort(record, new SortRecords("typeEvent"));
//         println("Sort actor attempted...");
//         for (var i = 0; i < record.length; ++i) {
//             newX = margin + floor((i * verticalSpacing)/(endVictimsY - startVictimsY)) * horizontalSpacing;
//             newY = startVictimsY + (i * verticalSpacing) % (endVictimsY - startVictimsY);
//             record[i].updateLocation(newX, newY);   
//         }
//         highlightOrder = 2;
//     }
//     else if (key == 'e'){
//         var newX, newY;
//         Arrays.sort(record, new SortRecords("ethnicitySort"));
//         println("Sort actor attempted...");
//         for (var i = 0; i < record.length; ++i) {
//             newX = margin + floor((i * verticalSpacing)/(endVictimsY - startVictimsY)) * horizontalSpacing;
//             newY = startVictimsY + (i * verticalSpacing) % (endVictimsY - startVictimsY);
//             record[i].updateLocation(newX, newY);   
//         }
//         highlightOrder = 5;
//     }
//     else if (key == 'b'){
//         println("Bogota sort attempted...");
//         if (bogota){
//             bogota = false;
//         }
//         else {
//             bogota = true;
//             other = false;
//             highlightMunicipalities = false;
//         }
//     }
//     else if (key == 'o'){
//         println("Other sort attempted...");
//         if (other){
//             other = false;
//         }
//         else {
//             other = true;
//             bogota = false;
//             highlightMunicipalities = false;
//         }
//     }
//     else if (key == 'q'){
//         if (save){
//             save = false;
//         }
//         else {
//             save = true;
//         }
//     }
//     else if (key == 'm'){
//         if (highlightMunicipalities){
//             highlightMunicipalities = false;
//         }
//         else {
//             highlightMunicipalities = true;
//             bogota = false;
//             other = false;
//         }
//     }
//     else if (key == '1'){
//         selectedMunicipality = 1;
//     }
//     else if (key == '2'){
//         selectedMunicipality = 2;
//     }
//     else if (key == '3'){
//         selectedMunicipality = 3;
//     }
//     else if (key == '4'){
//         selectedMunicipality = 4;
//     }
//     else if (key == '5'){
//         selectedMunicipality = 5;
//     }
//     else if (key == '6'){
//         selectedMunicipality = 6;
//     }
//     else if (key == '7'){
//         selectedMunicipality = 7;
//     }
//     else if (key == '8'){
//         selectedMunicipality = 8;
//     }
//     else if (key == '9'){
//         selectedMunicipality = 9;
//     }
//     else if (key == '0'){
//         selectedMunicipality = 0;
//     }
// }

function drawVictims(){
    noStroke();
    fill(100, 100, 100, 100);
    for (var i = 0; i < record.length; i++){
        record[i].simplePlot();
    }
    for (var i = 0; i < record.length; i++){
        if (record[i].active){
            if (record[i].endX < 325){
                popupX = -300;
                textX = 0;
            }
            else {
                popupX = 300;
                textX = 300;
            }
            if (record[i].endY < 170){
                popupY = -88;
                textY = 0;
            }
            else {
                popupY = 88;
                textY = 88;
            }
            fill(0, 0, 0, 75);
            rect(record[i].endX, record[i].endY, -popupX, -popupY);
            textAlign(LEFT, BOTTOM);
            fill(0, 0, 100, 100);
            textFont(mytextFont);
            text("Date: " + record[i].month + " " + record[i].ocurrenciaDay + " " + str(record[i].ocurrenciaYear), (record[i].endX - textX + 8), (record[i].endY - textY + 20));
            text("Event: " + record[i].hecho, (record[i].endX - textX + 8), (record[i].endY - textY + 35));
            var autor = "";
            var eventLocation = record[i].location;
            var locationCity = eventLocation.toCharArray();
            var capitalizeNext = true;
            for (var j = 0; j < locationCity.length; ++j) {
                if (Character.isSpace(locationCity[j])){
                    capitalizeNext = true;
                }
                else if (capitalizeNext){
                    locationCity[j] = Character.toUpperCase(locationCity[j]);
                    capitalizeNext = false;
                }
                else{
                    locationCity[j] = Character.toLowerCase(locationCity[j]);
                }
            }
            var fixedLocation = join(str(locationCity),"");
            if (record[i].autorGuerrillas){
                autor = autor + "Guerrillas";
            }
            if (record[i].autorParamilitares){
                if (autor.length() > 0){
                    autor = autor + " / Paramilitaries";
                }
                else{
                    autor = autor + "Paramilitaries";
                }
            }
            if (record[i].autorBacrim){
                if (autor.length() > 0){
                    autor = autor + " / Bacrim";
                }
                else{
                    autor = autor + "Bacrim";
                }
            }
            if (record[i].autorFuerzaPublica){
                if (autor.length() > 0){
                    autor = autor + " / Armed Forces";
                }
                else{
                    autor = autor + "Armed Forces";
                }
            }
            if (record[i].autorOtros){
                if (autor.length() > 0){
                    autor = autor + " / Other";
                }
                else{
                    autor = autor + "Other";
                }
            }
            if (record[i].autorNoId){
                if (autor.length() > 0){
                    autor = autor + " / Non Identified";
                }
                else{
                    autor = autor + "Non Identified";
                }
            }
            text("Actor: " + autor, (record[i].endX - textX + 8), (record[i].endY - textY + 50));
            // text("Location of Event: " + fixedLocation, (record[i].endX - textX + 8), (record[i].endY - textY + 65));
            text("Gender: " + record[i].genero, (record[i].endX - textX + 8), (record[i].endY - textY + 65));
            text("Ethnicity: " + record[i].ethnicity, (record[i].endX - textX + 8), (record[i].endY - textY + 80));
            // text("Date of Report: " + record[i].reportMonth + " " + record[i].reportDay + " " + str(record[i].reportYear), (record[i].endX - textX + 8), (record[i].endY - textY + 110));
            // text("Date of Report: " + record[i].daneLlegada + " " + record[i].reportDay + " " + str(record[i].reportYear), (record[i].endX - textX + 8), (record[i].endY - textY + 110));
            rect(record[i].endX, record[i].endY, 4, 4);
        }
        else{
        }
    }
}

function setActive(){
    if (frameCount % changeRate == 0){
        if (bogota){
            largeList = [];
            for (var i = 0; i < record.length; ++i) {
                if (record[i].cityType.equals("large")){
                    largeList.append(i);
                } else {
                }
            }
            selectedRecord = largeList[(round(random(0, largeList.length)))];
        }
        else if (other){
            smallList = [];
            for (var i = 0; i < record.length; ++i) {
                if (record[i].cityType.equals("small")){
                    smallList.append(i);
                } else {
                }
            }
            selectedRecord = smallList[(round(random(0, smallList.length)))];
        }
        else if (highlightMunicipalities){
            // selectedList = new IntList();
            selectedList = [];

            for (var i = 0; i < record.length; i++) {
                if (record[i].daneOcurrencia == specialMunicipalities[selectedMunicipality]){
                    selectedList.append(i);
                } else{
                }
            }
            selectedRecord = selectedList[(round(random(0, selectedList.length)))];
        }
        else{
            selectedRecord = round(random(0, record.length));
        }
    }
    for (var i = 0; i < record.length; ++i) {
        if (i == selectedRecord){
            record[i].active = true;
        }
        else {
            record[i].active = false;
        }
    }
    // println(frameCount);
    // println(selectedRecord);
}

function draw() {
    background(0, 0, 0, 100);
    drawLabels();
    // text(str(mouseX) + ", " + str(mouseY), mouseX, mouseY);
    drawVictims();
    setActive();
    // saveFrame("/Volumes/SIDL_Current/02_SIDL PROJECTS/1507_Victims_and_Displacement_Colombia/07_Animations/00_Output_Frames_Animation_02/Test2/31Muni_25pixels_3Spacing_####.png");
    // if (save){
    //     saveFrame("/Volumes/SIDL_Current/02_SIDL PROJECTS/1507_Victims_and_Displacement_Colombia/07_Animations/03_Animation_Frames/03_VictimsFramesNew/00_UrabaReplacementMunicipalitiesNewColors_####.png");
    //     println("Saving frame " + str(frameCount));
    // }
    //println("Selected municipality = " + str(selectedMunicipality));
}

function mousePressed(){
    if (mouseX >= 492 && mouseX <= 570 && mouseY <= 60 && mouseY >=35){
        if (parametros) {
            parametros = false;
            highlight = 0;
        }
        else {
            parametros = true;
            actor = false;
            gender = false;
            race = false;
            highlight = 1;
        }
    }
    if (mouseX >= 492 + 78 && mouseX <= 570 + 78 && mouseY <= 60 && mouseY >=35){
        if (actor) {
            actor = false;
            highlight = 0;
        }
        else {
            actor = true;
            parametros = false;
            gender = false;
            race = false;
            highlight = 2;
        }
    }
    if (mouseX >= 492 + 78 * 2 && mouseX <= 570 + 78 * 2 && mouseY <= 60 && mouseY >=35){
        if (gender) {
            gender = false;
            highlight = 0;
        }
        else {
            gender = true;
            parametros = false;
            actor = false;
            race = false;
            highlight = 3;
        }
    }
    if (mouseX >= 492 + 78 * 3 && mouseX <= 570 + 78 * 3 && mouseY <= 60 && mouseY >=35){
        if (race) {
            race = false;
            highlight = 0;
        }
        else {
            race = true;
            parametros = false;
            actor = false;
            gender = false;
            highlight = 4;
        }
    }
}


// ====================================================================
// ======================= CLASS DEFINITIONS ==========================
// ====================================================================

// // class SortRecords implements Comparator {

//     // var metricToSortOn;

//     // function SortRecords(_metricToSortOn) implements Comparator{
//     function SortRecords(_metricToSortOn){
//         this.metricToSortOn = _metricToSortOn;
//     }

//     public this.compare = function(Object a1, Object a2) {
//         if (this.metricToSortOn == "yearEvent"){
//             var int1 = ((Victims) a1).eventDate;
//             var int2 = ((Victims) a2).eventDate;
//             return int1.compareTo(int2);
//         }
//         else if (this.metricToSortOn == "gender"){
//             var genero1 = ((Victims) a1).genero;
//             var genero2 = ((Victims) a2).genero;
//             return genero2.compareTo(genero1);
//         }
//         else if (this.metricToSortOn == "report"){
//             var report1 = ((Victims) a1).reportDate;
//             var report2 = ((Victims) a2).reportDate;
//             return report1.compareTo(report2);
//         }
//         else if (this.metricToSortOn == "eventActor"){
//             var actor1 = ((Victims) a1).actorEvent;
//             var actor2 = ((Victims) a2).actorEvent;
//             return actor2.compareTo(actor1);
//         }
//         else if (this.metricToSortOn == "typeEvent"){
//             var actor1 = ((Victims) a1).sortType;
//             var actor2 = ((Victims) a2).sortType;
//             return actor2.compareTo(actor1);    
//         }
//         else if (this.metricToSortOn == "ethnicitySort"){
//             var actor1 = ((Victims) a1).ethnicity;
//             var actor2 = ((Victims) a2).ethnicity;
//             return actor2.compareTo(actor1);    
//         }
//         else{
//             return 0;
//         }
//     }
// }

// function Victims {
  //******* Properties *********//
  // var startX, startY, endX, endY;
  // var paramHecho, ocurrenciaYear, ocurrenciaMonth, ocurrenciaDay, reportDay, reportYear;
  // var active, autorGuerrillas, autorParamilitares, autorBacrim, autorFuerzaPublica, autorOtros, autorNoId;
  // var listParamHecho = ["Terrorist Attack / Combat / Skirmish", "Threat", "Crimes Against Sexual Liberty and Integrity", "Forced Disappearance", "Forced Displacement", "Homicide / Massacre", "Landmines / Unexploded Ordnance / IED", "Kidnapping", "Torture", "Recruitment of Minors", "Dispossession / Forced Abandonment of Land", "Other", "No Victim", "No Victim"];
  // var listMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  // var hecho, month, location, reportMonth, genero, ethnicity, cityType, sortType;
  // color fillColor;
  // var eventDate, reportDate, actorEvent;
  // var daneLlegada;
  // var alphaValue;
  // var daneOcurrencia;

  //******* Constructor *******//
  function Victims(actor_event, param_hecho, ocurrencia_year, ocurrencia_month, ocurrencia_day, dane_ocurrencia, reporte_year, reporte_month, reporte_day, daneDeclaracion, llegadaYear, llegadaMonth, llegadaDay, daneUbicacion, dane_llegada, tipoDesplazamiento, tipoDeVictima, mpio_ocurrencia, mpioLlegada, mpioUbicacion, mpioDeclaracion, autor_guerrilla, autor_paramilitares, autor_fuerzaPublica, autor_bacrim, autor_otros, autor_noId, start_x, start_y, _genero, _ethnicity, date_event, date_report, city_type, sort_type){
    
    this.listParamHecho = ["Terrorist Attack / Combat / Skirmish", "Threat", "Crimes Against Sexual Liberty and Integrity", "Forced Disappearance", "Forced Displacement", "Homicide / Massacre", "Landmines / Unexploded Ordnance / IED", "Kidnapping", "Torture", "Recruitment of Minors", "Dispossession / Forced Abandonment of Land", "Other", "No Victim", "No Victim"];
    this.listMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];



    this.startX = start_x;
    this.startY = start_y;
    this.endX = start_x;
    this.endY = start_y;
    this.paramHecho = param_hecho;
    this.ocurrenciaYear = ocurrencia_year;
    this.month = this.listMonths[ocurrencia_month - 1];
    this.ocurrenciaDay = ocurrencia_day;
    this.reportYear = reporte_year;
    this.reportDay = reporte_day;
    this.reportMonth = listMonths[reporte_month - 1];
    this.active = false;
    this.hecho = this.listParamHecho[param_hecho - 1];
    this.autorGuerrillas = autor_guerrilla;
    this.autorParamilitares = autor_paramilitares;
    this.autorBacrim = autor_bacrim;
    this.autorFuerzaPublica = autor_fuerzaPublica;
    this.autorOtros = autor_otros;
    this.autorNoId = autor_noId;
    this.location = mpio_ocurrencia;
    this.genero = _genero;
    this.ethnicity = _ethnicity;
    this.eventDate = date_event;
    this.reportDate = date_report;
    this.actorEvent = actor_event;
    this.daneLlegada = dane_llegada;
    this.alphaValue = 100;
    this.cityType = city_type;
    this.daneOcurrencia = dane_ocurrencia;
    this.sortType = sort_type;
  }

  this.updateLocation = function(new_x, new_y){
    this.startX = new_x;
    this.startY = new_y;
  }

  //****** Methods *********//
  this.simplePlot = function() {
    if (abs(this.startX - this.endX) > 1 && abs(this.startY - this.endY) > 1){
      this.endX = this.endX + (this.startX - this.endX) * damping;
      this.endY = this.endY + (this.startY - this.endY) * damping;
    }
    else{
      this.endX = this.startX;
      this.endY = this.startY;
    }
    noStroke();
    if(parametros){
      color1 = color(24, 100, 90.2, 100);
      color2 = color(169, 100, 90.2, 100);
      color3 = color(211.2, 73.7, 82, 100);
      color4 = color(0, 0, 35, 100);
    }
    else if(actor){
      color1 = color(317.8, 82.2, 88.2, 100);
      color2 = color(77.8, 82.2, 88.2, 100);
      color3 = color(197.8, 82.2, 88.2, 100);
      color4 = color(0, 0, 35, 100);
    }
    else if(race){
      color1 = color(150, 75, 70, 100);
      color2 = color(39, 75, 100, 100);
      color3 = color(279, 75, 75, 100);
      color4 = color(0, 0, 35, 100);
    }
    if(bogota){
      if (this.cityType.equals("large")){
        // color1 = color(24, 100, 100, 100);
        // color2 = color(169, 100, 100, 100);
        // color3 = color(211.2, 73.7, 100, 100);
        // color4 = color(0, 0, 35, 100);
        color1 = color(317.8, 82.2, 88.2, 100);
        color2 = color(77.8, 82.2, 88.2, 100);
        color3 = color(197.8, 82.2, 88.2, 100);
        color4 = color(0, 0, 35, 100);
      }
      else{
        // color1 = color(24, 100, 100, 25);
        // color2 = color(169, 100, 100, 25);
        // color3 = color(211.2, 73.7, 100, 25);
        // color4 = color(0, 0, 35, 25);
        color1 = color(317.8, 82.2, 88.2, 25);
        color2 = color(77.8, 82.2, 88.2, 25);
        color3 = color(197.8, 82.2, 88.2, 25);
        color4 = color(0, 0, 35, 25);
      }
    }
    if(other){
      if (this.cityType.equals("small")){
        // color1 = color(24, 100, 100, 100);
        // color2 = color(169, 100, 100, 100);
        // color3 = color(211.2, 73.7, 100, 100);
        // color4 = color(0, 0, 35, 100);
        color1 = color(317.8, 82.2, 88.2, 100);
        color2 = color(77.8, 82.2, 88.2, 100);
        color3 = color(197.8, 82.2, 88.2, 100);
        color4 = color(0, 0, 35, 100);
      }
      else{
        // color1 = color(24, 100, 100, 25);
        // color2 = color(169, 100, 100, 25);
        // color3 = color(211.2, 73.7, 100, 25);
        // color4 = color(0, 0, 35, 25);
        color1 = color(317.8, 82.2, 88.2, 25);
        color2 = color(77.8, 82.2, 88.2, 25);
        color3 = color(197.8, 82.2, 88.2, 25);
        color4 = color(0, 0, 35, 25);
      }
    }
    if(highlightMunicipalities){
      if (this.daneOcurrencia == specialMunicipalities[selectedMunicipality]){
        color1 = color(24, 100, 100, 100);
        color2 = color(169, 100, 100, 100);
        color3 = color(211.2, 73.7, 100, 100);
        color4 = color(0, 0, 35, 100);
      }
      else{
        color1 = color(24, 100, 100, 25);
        color2 = color(169, 100, 100, 25);
        color3 = color(211.2, 73.7, 100, 25);
        color4 = color(0, 0, 35, 25);
      }
    }
    if (parametros){
      if (this.paramHecho == 5){
        fillColor = color1;
      }
      else if (this.paramHecho == 6){
        fillColor = color2;
      }
      else if (this.paramHecho == 2){
        fillColor = color3;
      }
      else{
        fillColor = color4;
      }
    }
    else if (actor){
      if (this.autorGuerrillas){
        fillColor = color1;
      }
      else if (this.autorParamilitares){
        fillColor = color2;
      }
      else if (this.autorFuerzaPublica){
        fillColor = color3;
      }
      else{
        fillColor = color4;
      }
    }
    else if (gender){
      if (this.genero.equals("Male")){
        fillColor = color1;
      }
      else if (this.genero.equals("Female")){
        fillColor = color2;
      }
      else if (this.genero.equals("Other or N/A")){
        fillColor = color3;
      }
      else{
        fillColor = color4;
      }
    }
    else if (race){
      if (this.ethnicity.equals("None")){
        fillColor = color1;
      }
      else if (this.ethnicity.equals("Afrocolombian")){
        fillColor = color2;
      }
      else if (this.ethnicity.equals("Indigenous")){
        fillColor = color3;
      }
      else{
        fillColor = color4;
      }
    }
    else {
      fillColor = color(0, 0, 100, 80);
    }
    // if ((round(mouseX) <= endX) && (round(mouseX) > (endX - 1.5)) && (round(mouseY) <= endY) && (round(mouseY) > (endY - 1.5))) {
    //   active = true;
    // }
    // else{
    //   active = false;
    // }
    fill(fillColor);
    rect(endX, endY, 2.5, 2.5);
  }
// }

