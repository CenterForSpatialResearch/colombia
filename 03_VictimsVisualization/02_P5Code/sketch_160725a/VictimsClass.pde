class Victims {
  //******* Properties *********//
  float startX, startY, endX, endY;
  int paramHecho, ocurrenciaYear, ocurrenciaMonth, ocurrenciaDay, reportDay, reportYear;
  boolean active, autorGuerrillas, autorParamilitares, autorBacrim, autorFuerzaPublica, autorOtros, autorNoId;
  String[] listParamHecho = {"Terrorist Attack / Combat / Skirmish", "Threat", "Crimes Against Sexual Liberty and Integrity", "Forced Disappearance", "Forced Displacement", "Homicide / Massacre", "Landmines / Unexploded Ordnance / IED", "Kidnapping", "Torture", "Recruitment of Minors", "Dispossession / Forced Abandonment of Land", "Other", "No Victim", "No Victim"};
  String[] listMonths = {"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"};
  String hecho, month, location, reportMonth, genero, ethnicity, cityType, sortType;
  color fillColor;
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

  void updateLocation(float new_x, float new_y){
    startX = new_x;
    startY = new_y;
  }

  //****** Methods *********//
  void simplePlot(){
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
      if (cityType.equals("large")){
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
      if (cityType.equals("small")){
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
      if (daneOcurrencia == specialMunicipalities[selectedMunicipality]){
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
    rect(endX, endY, 2.5, 2.5);
  }
}