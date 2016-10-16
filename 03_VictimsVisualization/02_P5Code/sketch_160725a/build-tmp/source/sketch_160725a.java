import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import java.util.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class sketch_160725a extends PApplet {

//******** Importing libraries *******//


//******** Global Variables **********//
int canvasWidth;
int canvasHeight;
Table victimsTable;
float currentFrame;
boolean saveFrame1x = true;
boolean saveFrame2x = false;
PFont titleFont;
PFont textFont;
PFont subtitleFont;
Victims[] record;
float margin = 25;
float numberOfYears = 31;
float mainHeight = 800;
// float pixelSize = 1;
float horizontalSpacing = 3;
float verticalSpacing = 3;
float startVictimsY = 70;
float endVictimsY = 1030;
float endVictimsX = 1465;
float popupX = 300;
float popupY = 118;
float textX = 300;
float textY = 118;
boolean parametros = true; //It was false
boolean age = false;
boolean gender = false;
boolean actor = false;
boolean race = false;
int highlight = 0;
int highlightOrder = 0;
float damping = 0.07f;
int color1, color2, color3, color4;
boolean bogota = false;
int selectedRecord = 101000;
boolean save = false; // It was false
int changeRate = 185; // It was 205
boolean other = false;
IntList largeList;
IntList smallList;
IntList selectedList;
int selectedMunicipality = 0;
boolean highlightMunicipalities = true; //******
int[] specialMunicipalities = {76828, 5837, 50325, 27615, 97001, 54810, 13244, 5649, 27099, 76109};
String[] listSortType = {"Other", "Threat", "Other", "Other", "Forced Displacement", "Homicide / Massacre", "Other", "Other", "Other", "Other", "Other", "Other", "Other", "Other"};

public void settings(){
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

public void loadData() {
	victimsTable = loadTable("SmallTest200K.csv", "header, tsv");
	int numberOfRecords = victimsTable.getRowCount();
	record = new Victims[numberOfRecords];
	int paramHecho, ocurrenciaYear, ocurrenciaMonth, ocurrenciaDay, daneOcurrencia, reporteYear, reporteMonth, reporteDay, daneDeclaracion, llegadaYear, llegadaMonth, llegadaDay, daneUbicacion, daneLlegada, birthYear;
	String actorEvent, dateEvent, dateReport, tipoDesplazamiento, tipoDeVictima, mpioOcurrencia, mpioLlegada, mpioUbicacion, mpioDeclaracion, genero, ethnicity, ageGroup, cityType, sortType;
	boolean autorGuerrillas, autorParamilitares, autorFuerzaPublica, autorBacrim, autorOtros, autorNoId;
	int recordIndex = 0;
	for (TableRow row : victimsTable.rows()) {
		float positionX = margin + floor((recordIndex * verticalSpacing)/(endVictimsY - startVictimsY)) * horizontalSpacing;
		float positionY = startVictimsY + (recordIndex * verticalSpacing) % (endVictimsY - startVictimsY);
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
		ocurrenciaYear = PApplet.parseInt(split(split(row.getString("f_ocurrencia_hecho"), ' ')[0], '-')[0]);
		ocurrenciaMonth = PApplet.parseInt(split(split(row.getString("f_ocurrencia_hecho"), ' ')[0], '-')[1]);
		ocurrenciaDay = PApplet.parseInt(split(split(row.getString("f_ocurrencia_hecho"), ' ')[0], '-')[2]);
		daneOcurrencia = row.getInt("dane_ocurrencia");
		reporteYear = PApplet.parseInt(split(split(row.getString("f_reporte_hecho"), ' ')[0], '-')[0]);
		reporteMonth = PApplet.parseInt(split(split(row.getString("f_reporte_hecho"), ' ')[0], '-')[1]);
		reporteDay = PApplet.parseInt(split(split(row.getString("f_reporte_hecho"), ' ')[0], '-')[2]);
		birthYear = PApplet.parseInt(split(split(row.getString("f_nacimiento"), ' ')[0], '-')[0]);
		if (paramHecho == 5){
			llegadaYear = PApplet.parseInt(split(split(row.getString("f_llegada"), ' ')[0], '-')[0]);
			llegadaMonth = PApplet.parseInt(split(split(row.getString("f_llegada"), ' ')[0], '-')[1]);
			llegadaDay = PApplet.parseInt(split(split(row.getString("f_llegada"), ' ')[0], '-')[2]);
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

public void setup() {
	colorMode(HSB, 360, 100, 100, 100);
	background(0);
	loadData();
	textFont = createFont("AkzidenzGrotesk-Regular.otf", 12, true);
	titleFont = createFont("AkzidenzGrotesk-Medium.otf", 24, true);
	subtitleFont = createFont("AkzidenzGrotesk-Medium.otf", 14, true);
}

public void drawLabels(){
	if(parametros){
		color1 = color(24, 100, 90.2f, 100);
		color2 = color(169, 100, 90.2f, 100);
		color3 = color(211.2f, 73.7f, 82, 100);
		color4 = color(0, 0, 35, 100);
	}
	else if(actor){
		color1 = color(317.8f, 82.2f, 88.2f, 100);
		color2 = color(77.8f, 82.2f, 88.2f, 100);
		color3 = color(197.8f, 82.2f, 88.2f, 100);
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
	textFont(textFont);
	textAlign(LEFT, BOTTOM);
	text("A random sample of 200,000 victims of the conflict", 115, 60);
	text("Symbolize by", 420, 60);
	fill(0, 0, 20, 100);
	for (int i = 0; i < 4; ++i) {
		rect(492 + i * 78, 45, 75, 15);
	}
	if (highlight > 0){
		fill(0, 0, 50, 100);
		rect(492 + (highlight - 1) * 78, 45, 75, 15);
	}
	else{}noStroke();
	fill(0, 0, 100, 100);
	String[] symbolizeLabels = {"Type", "Actor", "Gender", "Ethnicity"};
	textAlign(CENTER, BOTTOM);
	for (int i = 0; i < symbolizeLabels.length; ++i) {
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
	String[] orderLabels = {"Event Date", "Type", "Actor", "Gender", "Ethnicity", "Report Date"};
	fill(0, 0, 20, 100);
	for (int i = 0; i < orderLabels.length; ++i) {
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
	for (int i = 0; i < orderLabels.length; ++i) {
		text(orderLabels[i], 1350 + 37 + i * 78, 60);
	}
}

public void keyPressed(){
	if (key == 's'){
		float newX, newY;
		Arrays.sort(record, new SortRecords("yearEvent"));
		println("Sort year attempted...");
		for (int i = 0; i < record.length; ++i) {
			newX = margin + floor((i * verticalSpacing)/(endVictimsY - startVictimsY)) * horizontalSpacing;
			newY = startVictimsY + (i * verticalSpacing) % (endVictimsY - startVictimsY);
			record[i].updateLocation(newX, newY);
		}
		highlightOrder = 1;
	}
	else if (key == 'g'){
		float newX, newY;
		Arrays.sort(record, new SortRecords("gender"));
		println("Sort gender attempted...");
		for (int i = 0; i < record.length; ++i) {
			newX = margin + floor((i * verticalSpacing)/(endVictimsY - startVictimsY)) * horizontalSpacing;
			newY = startVictimsY + (i * verticalSpacing) % (endVictimsY - startVictimsY);
			record[i].updateLocation(newX, newY);	
		}
		highlightOrder = 4;
	}
	else if (key == 'r'){
		float newX, newY;
		Arrays.sort(record, new SortRecords("report"));
		println("Sort report attempted...");
		for (int i = 0; i < record.length; ++i) {
			newX = margin + floor((i * verticalSpacing)/(endVictimsY - startVictimsY)) * horizontalSpacing;
			newY = startVictimsY + (i * verticalSpacing) % (endVictimsY - startVictimsY);
			record[i].updateLocation(newX, newY);	
		}
		highlightOrder = 6;
	}
	else if (key == 'a'){
		float newX, newY;
		Arrays.sort(record, new SortRecords("eventActor"));
		println("Sort actor attempted...");
		for (int i = 0; i < record.length; ++i) {
			newX = margin + floor((i * verticalSpacing)/(endVictimsY - startVictimsY)) * horizontalSpacing;
			newY = startVictimsY + (i * verticalSpacing) % (endVictimsY - startVictimsY);
			record[i].updateLocation(newX, newY);	
		}
		highlightOrder = 3;
	}
	else if (key == 't'){
		float newX, newY;
		Arrays.sort(record, new SortRecords("typeEvent"));
		println("Sort actor attempted...");
		for (int i = 0; i < record.length; ++i) {
			newX = margin + floor((i * verticalSpacing)/(endVictimsY - startVictimsY)) * horizontalSpacing;
			newY = startVictimsY + (i * verticalSpacing) % (endVictimsY - startVictimsY);
			record[i].updateLocation(newX, newY);	
		}
		highlightOrder = 2;
	}
	else if (key == 'e'){
		float newX, newY;
		Arrays.sort(record, new SortRecords("ethnicitySort"));
		println("Sort actor attempted...");
		for (int i = 0; i < record.length; ++i) {
			newX = margin + floor((i * verticalSpacing)/(endVictimsY - startVictimsY)) * horizontalSpacing;
			newY = startVictimsY + (i * verticalSpacing) % (endVictimsY - startVictimsY);
			record[i].updateLocation(newX, newY);	
		}
		highlightOrder = 5;
	}
	else if (key == 'b'){
		println("Bogota sort attempted...");
		if (bogota){
			bogota = false;
		}
		else {
			bogota = true;
			other = false;
			highlightMunicipalities = false;
		}
	}
	else if (key == 'o'){
		println("Other sort attempted...");
		if (other){
			other = false;
		}
		else {
			other = true;
			bogota = false;
			highlightMunicipalities = false;
		}
	}
	else if (key == 'q'){
		if (save){
			save = false;
		}
		else {
			save = true;
		}
	}
	else if (key == 'm'){
		if (highlightMunicipalities){
			highlightMunicipalities = false;
		}
		else {
			highlightMunicipalities = true;
			bogota = false;
			other = false;
		}
	}
	else if (key == '1'){
		selectedMunicipality = 1;
	}
	else if (key == '2'){
		selectedMunicipality = 2;
	}
	else if (key == '3'){
		selectedMunicipality = 3;
	}
	else if (key == '4'){
		selectedMunicipality = 4;
	}
	else if (key == '5'){
		selectedMunicipality = 5;
	}
	else if (key == '6'){
		selectedMunicipality = 6;
	}
	else if (key == '7'){
		selectedMunicipality = 7;
	}
	else if (key == '8'){
		selectedMunicipality = 8;
	}
	else if (key == '9'){
		selectedMunicipality = 9;
	}
	else if (key == '0'){
		selectedMunicipality = 0;
	}
}

public void drawVictims(){
	noStroke();
	fill(100, 100, 100, 100);
	for (int i = 0; i < record.length; i++){
		record[i].simplePlot();
	}
	for (int i = 0; i < record.length; i++){
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
			textFont(textFont);
			text("Date: " + record[i].month + " " + record[i].ocurrenciaDay + " " + str(record[i].ocurrenciaYear), (record[i].endX - textX + 8), (record[i].endY - textY + 20));
			text("Event: " + record[i].hecho, (record[i].endX - textX + 8), (record[i].endY - textY + 35));
			String autor = "";
			String eventLocation = record[i].location;
			char[] locationCity = eventLocation.toCharArray();
			boolean capitalizeNext = true;
			for (int j = 0; j < locationCity.length; ++j) {
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
			String fixedLocation = join(str(locationCity),"");
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

public void setActive(){
	if (frameCount % changeRate == 0){
		if (bogota){
			largeList = new IntList();
			for (int i = 0; i < record.length; ++i) {
				if (record[i].cityType.equals("large")){
					largeList.append(i);
				} else {
				}
			}
			selectedRecord = largeList.get(round(random(0, largeList.size())));
		}
		else if (other){
			smallList = new IntList();
			for (int i = 0; i < record.length; ++i) {
				if (record[i].cityType.equals("small")){
					smallList.append(i);
				} else {
				}
			}
			selectedRecord = smallList.get(round(random(0, smallList.size())));
		}
		else if (highlightMunicipalities){
			selectedList = new IntList();
			for (int i = 0; i < record.length; i++) {
				if (record[i].daneOcurrencia == specialMunicipalities[selectedMunicipality]){
					selectedList.append(i);
				} else{
				}
			}
			selectedRecord = selectedList.get(round(random(0, selectedList.size())));
		}
		else{
			selectedRecord = round(random(0, record.length));
		}
	}
	for (int i = 0; i < record.length; ++i) {
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

public void draw() {
	background(0, 0, 0, 100);
	drawLabels();
	// text(str(mouseX) + ", " + str(mouseY), mouseX, mouseY);
	drawVictims();
	setActive();
	// saveFrame("/Volumes/SIDL_Current/02_SIDL PROJECTS/1507_Victims_and_Displacement_Colombia/07_Animations/00_Output_Frames_Animation_02/Test2/31Muni_25pixels_3Spacing_####.png");
	if (save){
		saveFrame("/Volumes/SIDL_Current/02_SIDL PROJECTS/1507_Victims_and_Displacement_Colombia/07_Animations/03_Animation_Frames/03_VictimsFramesNew/00_UrabaReplacementMunicipalitiesNewColors_####.png");
		println("Saving frame " + str(frameCount));
	}
	//println("Selected municipality = " + str(selectedMunicipality));
}

public void mousePressed(){
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
class SortRecords implements Comparator {

	String metricToSortOn;

	SortRecords(String _metricToSortOn){
		metricToSortOn = _metricToSortOn;
	}

	public int compare(Object a1, Object a2) {
		if (metricToSortOn == "yearEvent"){
			String int1 = ((Victims) a1).eventDate;
			String int2 = ((Victims) a2).eventDate;
			return int1.compareTo(int2);
		}
		else if (metricToSortOn == "gender"){
			String genero1 = ((Victims) a1).genero;
			String genero2 = ((Victims) a2).genero;
			return genero2.compareTo(genero1);
		}
		else if (metricToSortOn == "report"){
			String report1 = ((Victims) a1).reportDate;
			String report2 = ((Victims) a2).reportDate;
			return report1.compareTo(report2);
		}
		else if (metricToSortOn == "eventActor"){
			String actor1 = ((Victims) a1).actorEvent;
			String actor2 = ((Victims) a2).actorEvent;
			return actor2.compareTo(actor1);
		}
		else if (metricToSortOn == "typeEvent"){
			String actor1 = ((Victims) a1).sortType;
			String actor2 = ((Victims) a2).sortType;
			return actor2.compareTo(actor1);	
		}
		else if (metricToSortOn == "ethnicitySort"){
			String actor1 = ((Victims) a1).ethnicity;
			String actor2 = ((Victims) a2).ethnicity;
			return actor2.compareTo(actor1);	
		}
		else{
			return 0;
		}
	}
}
class Victims {
  //******* Properties *********//
  float startX, startY, endX, endY;
  int paramHecho, ocurrenciaYear, ocurrenciaMonth, ocurrenciaDay, reportDay, reportYear;
  boolean active, autorGuerrillas, autorParamilitares, autorBacrim, autorFuerzaPublica, autorOtros, autorNoId;
  String[] listParamHecho = {"Terrorist Attack / Combat / Skirmish", "Threat", "Crimes Against Sexual Liberty and Integrity", "Forced Disappearance", "Forced Displacement", "Homicide / Massacre", "Landmines / Unexploded Ordnance / IED", "Kidnapping", "Torture", "Recruitment of Minors", "Dispossession / Forced Abandonment of Land", "Other", "No Victim", "No Victim"};
  String[] listMonths = {"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"};
  String hecho, month, location, reportMonth, genero, ethnicity, cityType, sortType;
  int fillColor;
  String eventDate, reportDate, actorEvent;
  int daneLlegada;
  int alphaValue;
  int daneOcurrencia;

  //******* Constructor *******//
  Victims(String actor_event, int param_hecho, int ocurrencia_year, int ocurrencia_month, int ocurrencia_day, int dane_ocurrencia, int reporte_year, int reporte_month, int reporte_day, int daneDeclaracion, int llegadaYear, int llegadaMonth, int llegadaDay, int daneUbicacion, int dane_llegada, String tipoDesplazamiento, String tipoDeVictima, String mpio_ocurrencia, String mpioLlegada, String mpioUbicacion, String mpioDeclaracion, boolean autor_guerrilla, boolean autor_paramilitares, boolean autor_fuerzaPublica, boolean autor_bacrim, boolean autor_otros, boolean autor_noId, float start_x, float start_y, String _genero, String _ethnicity, String date_event, String date_report, String city_type, String sort_type){
    startX = start_x;
    startY = start_y;
    endX = start_x;
    endY = start_y;
    paramHecho = param_hecho;
    ocurrenciaYear = ocurrencia_year;
    month = listMonths[ocurrencia_month - 1];
    ocurrenciaDay = ocurrencia_day;
    reportYear = reporte_year;
    reportDay = reporte_day;
    reportMonth = listMonths[reporte_month - 1];
    active = false;
    hecho = listParamHecho[param_hecho - 1];
    autorGuerrillas = autor_guerrilla;
    autorParamilitares = autor_paramilitares;
    autorBacrim = autor_bacrim;
    autorFuerzaPublica = autor_fuerzaPublica;
    autorOtros = autor_otros;
    autorNoId = autor_noId;
    location = mpio_ocurrencia;
    genero = _genero;
    ethnicity = _ethnicity;
    eventDate = date_event;
    reportDate = date_report;
    actorEvent = actor_event;
    daneLlegada = dane_llegada;
    alphaValue = 100;
    cityType = city_type;
    daneOcurrencia = dane_ocurrencia;
    sortType = sort_type;
  }

  public void updateLocation(float new_x, float new_y){
    startX = new_x;
    startY = new_y;
  }

  //****** Methods *********//
  public void simplePlot(){
    if (abs(startX - endX) > 1 && abs(startY - endY) > 1){
      endX = endX + (startX - endX) * damping;
      endY = endY + (startY - endY) * damping;
    }
    else{
      endX = startX;
      endY = startY;
    }
    noStroke();
    if(parametros){
      color1 = color(24, 100, 90.2f, 100);
      color2 = color(169, 100, 90.2f, 100);
      color3 = color(211.2f, 73.7f, 82, 100);
      color4 = color(0, 0, 35, 100);
    }
    else if(actor){
      color1 = color(317.8f, 82.2f, 88.2f, 100);
      color2 = color(77.8f, 82.2f, 88.2f, 100);
      color3 = color(197.8f, 82.2f, 88.2f, 100);
      color4 = color(0, 0, 35, 100);
    }
    else if(race){
      color1 = color(150, 75, 70, 100);
      color2 = color(39, 75, 100, 100);
      color3 = color(279, 75, 75, 100);
      color4 = color(0, 0, 35, 100);
    }
    if(bogota){
      if (cityType.equals("large")){
        // color1 = color(24, 100, 100, 100);
        // color2 = color(169, 100, 100, 100);
        // color3 = color(211.2, 73.7, 100, 100);
        // color4 = color(0, 0, 35, 100);
        color1 = color(317.8f, 82.2f, 88.2f, 100);
        color2 = color(77.8f, 82.2f, 88.2f, 100);
        color3 = color(197.8f, 82.2f, 88.2f, 100);
        color4 = color(0, 0, 35, 100);
      }
      else{
        // color1 = color(24, 100, 100, 25);
        // color2 = color(169, 100, 100, 25);
        // color3 = color(211.2, 73.7, 100, 25);
        // color4 = color(0, 0, 35, 25);
        color1 = color(317.8f, 82.2f, 88.2f, 25);
        color2 = color(77.8f, 82.2f, 88.2f, 25);
        color3 = color(197.8f, 82.2f, 88.2f, 25);
        color4 = color(0, 0, 35, 25);
      }
    }
    if(other){
      if (cityType.equals("small")){
        // color1 = color(24, 100, 100, 100);
        // color2 = color(169, 100, 100, 100);
        // color3 = color(211.2, 73.7, 100, 100);
        // color4 = color(0, 0, 35, 100);
        color1 = color(317.8f, 82.2f, 88.2f, 100);
        color2 = color(77.8f, 82.2f, 88.2f, 100);
        color3 = color(197.8f, 82.2f, 88.2f, 100);
        color4 = color(0, 0, 35, 100);
      }
      else{
        // color1 = color(24, 100, 100, 25);
        // color2 = color(169, 100, 100, 25);
        // color3 = color(211.2, 73.7, 100, 25);
        // color4 = color(0, 0, 35, 25);
        color1 = color(317.8f, 82.2f, 88.2f, 25);
        color2 = color(77.8f, 82.2f, 88.2f, 25);
        color3 = color(197.8f, 82.2f, 88.2f, 25);
        color4 = color(0, 0, 35, 25);
      }
    }
    if(highlightMunicipalities){
      if (daneOcurrencia == specialMunicipalities[selectedMunicipality]){
        color1 = color(24, 100, 100, 100);
        color2 = color(169, 100, 100, 100);
        color3 = color(211.2f, 73.7f, 100, 100);
        color4 = color(0, 0, 35, 100);
      }
      else{
        color1 = color(24, 100, 100, 25);
        color2 = color(169, 100, 100, 25);
        color3 = color(211.2f, 73.7f, 100, 25);
        color4 = color(0, 0, 35, 25);
      }
    }
    if (parametros){
      if (paramHecho == 5){
        fillColor = color1;
      }
      else if (paramHecho == 6){
        fillColor = color2;
      }
      else if (paramHecho == 2){
        fillColor = color3;
      }
      else{
        fillColor = color4;
      }
    }
    else if (actor){
      if (autorGuerrillas){
        fillColor = color1;
      }
      else if (autorParamilitares){
        fillColor = color2;
      }
      else if (autorFuerzaPublica){
        fillColor = color3;
      }
      else{
        fillColor = color4;
      }
    }
    else if (gender){
      if (genero.equals("Male")){
        fillColor = color1;
      }
      else if (genero.equals("Female")){
        fillColor = color2;
      }
      else if (genero.equals("Other or N/A")){
        fillColor = color3;
      }
      else{
        fillColor = color4;
      }
    }
    else if (race){
      if (ethnicity.equals("None")){
        fillColor = color1;
      }
      else if (ethnicity.equals("Afrocolombian")){
        fillColor = color2;
      }
      else if (ethnicity.equals("Indigenous")){
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
    rect(endX, endY, 2.5f, 2.5f);
  }
}
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "sketch_160725a" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
