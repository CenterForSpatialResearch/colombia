## Data dictionary for the *SamllTest200K.csv* file

### Field names:
* `cod_persona`: id of victim (this can be duplicate, one victim can submit multiple complaints)
* `para_hecho`: type of event:
  * `1`: Terrorist act / combats / skirmishes
  * `2`: Threats
  * `3`: Sexual violence
  * `4`: Disappearance
  * `5`: Forced displacement
  * `6`: Homicide
  * `7`: Land mines
  * `8`: Kidnapping
  * `9`: Torture
  * `10`: Recruitment of minors
  * `11`: Forced to abandon land
  * `12`: Damage to property
  * `14`: No information
* `f_ocurrencia_hecho`: date of event
* `dane_ocurrencia`: municipality of the event (code)
* `f_reporte_hecho`: date of report
* `tipo_pais`: country type (??)
* `dane_decla`: municipality of report (code)
* `f_llega`: date of arrival for those displaced
* `dane_llega`: municipality of arrival for displaced (code)
* `tipo_desplazamiento`: type of displacement (massive or individual)
* `autor_guerrillas`: perpetrator was guerrillas
* `autor_paramilitares`: perpetrator was paramilitaries
* `autor_fuerza_publica`: perpetrator was the army
* `autor_bacrim`: perpetrator was the "Bacrim" (offshoot of the paramilitaries)
* `autor_otros`: perpetrator was other
* `autor_no_identifica`: perpetrator is non-identified
* `tipo_victima`: type of victim (direct or indirect)
* `fecha_valoracion`: date of review of the case
* `cod_caso`: id of the case
* `vvg`: ???? (the law that's protecting the victims)
* `dane_ub`: municipality where the victim was last reviewed
* `mpio_ocurrencia`: municipality of event (name)
* `mpio_llegada`: municipality of arrival for displaced victims (name)
* `mpio_ubicacion`: municipality of last check (name)
* `mpio_declaracion`: municipality of report (name)
* `gid`: id for the geometry
* `tipo_doc`: type of id document:
  * `cc`: adult standard id
  * `ti`: minor standard id
  * `rc`: birth certificate
  * others...
* `genero_hom`: gender
* `discap`: handicap
* `pert_etnica`: ethnic belonging
* `cuentadecod_persona`: number of people associated with this case
* `highlight`: type of municipality of event (tied to population of municipality)