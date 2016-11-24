from datetime import datetime
import csv
# import numpy as np

##############################
# Set up data
##############################

# Headers that correspond to Col headers in our CSV to be read
fieldnames = ['cod_persona', 'param_hecho', 'f_ocurrencia_hecho', 'dane_ocurrencia', 'f_reporte_hecho', 'tipo_pais', 'dane_decla', 'f_llegada', 'dane_llegada', 'tipo_desplazamiento', 'autor_guerrillas', 'autor_paramilitares', 'autor_fuerza_publica', 'autor_bacrim', 'autor_otros', 'autor_no_identifica', 'tipo_victima', 'fecha_valoracion', 'cod_caso', 'vvg', 'dane_ub', 'mpio_ocurrencia', 'mpio_llegada', 'mpio_ubicacion', 'mpio_declaracion', 'gid', 'tipo_doc', 'genero_hom', 'discap', 'pert_etnica', 'f_nacimiento', 'cuentadecod_persona', 'highlight']

inputFileName = '50k_opened_correct_wcs_nocomma'

# Open the CSV to be read
inputFile = open(inputFileName+'.csv', "rb")
reader = csv.reader(inputFile, delimiter=',', quotechar='|')

# Create our read and write lists
readList = []
writeList = []

#Place all the data in a list so we can skip the first entry of the data
for row in reader:
	readList.append(row)

# Get rid of header row
readList = readList[1:]

# Flip the list so that each index of newList corresponds to a column of data
flipList = zip(*readList)

##############################
# Create a unique, sorted list of the parameter
##############################

###### Make param_hecho unique, note the map to integer on the second line, no need to sort these ints as set does
list_param_hecho = flipList[fieldnames.index('param_hecho')]
list_param_hecho = list(map(int, list_param_hecho))
unique_param_hecho = list(set(list_param_hecho))

###### Make pert_etnica unique and sort
list_pert_etnica = flipList[fieldnames.index('pert_etnica')]
unique_pert_etnica = list(set(list_pert_etnica))
unique_pert_etnica.sort()

###### Make gender unique
list_genero_hom = flipList[fieldnames.index('genero_hom')]
unique_genero_hom = list(set(list_genero_hom))
unique_genero_hom.sort()

###### Make dates unique
list_ocurrencia_hecho = flipList[fieldnames.index('f_ocurrencia_hecho')]
# print "list of string dates: ", list_ocurrencia_hecho
#convert string dates to python dates
list_event_date = []
for dateString in list_ocurrencia_hecho:
	list_event_date.append(datetime.strptime(dateString, '%m/%d/%y %H:%M'))
# print "list of py dates: ", list_event_date
unique_event_date = list(set(list_event_date))
unique_event_date.sort()
# print "unique py dates sorted: ", unique_event_date

###### Make autor unique and figure out if any have mutliple actors, this overrides
# Load all the actor fields
list_autor_guerrillas = list(map(int, flipList[fieldnames.index('autor_guerrillas')]))
list_autor_paramilitares = list(map(int,flipList[fieldnames.index('autor_paramilitares')]))
list_autor_fuerza_publica = list(map(int,flipList[fieldnames.index('autor_fuerza_publica')]))
list_autor_bacrim = list(map(int,flipList[fieldnames.index('autor_bacrim')]))
list_autor_otros = list(map(int,flipList[fieldnames.index('autor_otros')]))
#check for blank unidenfitified
# list_autor_no_identifica = list(map(int,flipList[fieldnames.index('autor_no_identifica')]))
list_autor_no_identifica = flipList[fieldnames.index('autor_no_identifica')]
int_list_autor_no_identifica = []
for item in list_autor_no_identifica:
	if not item:
		# print "FOUND NONE!"
		int_list_autor_no_identifica.append(0)
	else:
		int_list_autor_no_identifica.append(int(item))
list_autor_no_identifica = int_list_autor_no_identifica
# print list_autor_no_identifica

#Find multiple actors
# list_count_allActors = []
list_actors = []
for i in range(0, len(list_autor_guerrillas)):
	sumAllActors = list_autor_guerrillas[i] + list_autor_paramilitares[i] + list_autor_fuerza_publica[i] + list_autor_bacrim[i] + list_autor_otros[i] + list_autor_no_identifica[i]
	# list_count_allActors.append()
	if sumAllActors > 1:
		list_actors.append("Multiple Actors")
	else:
		myTestItem = list_autor_guerrillas[i]*'Guerrillas' + list_autor_paramilitares[i]*'Paramilitares' + list_autor_fuerza_publica[i]*'Fuerza_Publica' + list_autor_bacrim[i]*'Bacrim' + list_autor_otros[i]*'Other' + list_autor_no_identifica[i]*'Unknown'
		list_actors.append(myTestItem)
# print list_actors
unique_actors = list(set(list_actors))
unique_actors.sort()
# print unique_actors


###### PRINT CHECK
# print "unique pert_etnica: ", unique_pert_etnica
print "unique len p,e: ", len(unique_pert_etnica), ", vs original len: ", len(list_pert_etnica)
print "unique len generohom ", len(unique_genero_hom), ", vs original len :", len(list_genero_hom)
# print "unique genero hom", unique_genero_hom
print "unique len eventdate ", len(unique_event_date)
print "unqiue len actors ", len(unique_actors)

print ""

##############################
# Count the number of occurances of each unique item
##############################

# Count unique Param hecho
count_param_hecho = []
for item in unique_param_hecho:
	count_param_hecho.append(list_param_hecho.count(item))
print "count p_h: ", count_param_hecho

# Count pert_etnica
count_pert_etnica = []
for item in unique_pert_etnica:
	count_pert_etnica.append(list_pert_etnica.count(item))
print "count pert etnica: ", count_pert_etnica

# Count genero_hom
count_genero_hom = []
for item in unique_genero_hom:
	count_genero_hom.append(list_genero_hom.count(item))
print "count genero hom: ", count_genero_hom

# Count event_date
count_event_date = []
for item in unique_event_date:
	count_event_date.append(list_event_date.count(item))
# print "count event date: ", count_event_date

#Count actors
count_actors = []
for item in unique_actors:
	count_actors.append(list_actors.count(item))
print "count actors: ", count_actors

print ""

##############################
# Compute a running total of this items rank
##############################

#param hecho current Rank
currentRank_param_hecho = []
runningRank = 0
for i in range(0,len(count_param_hecho)):
	# print count_param_hecho[i], i
	if i == 0:
		currentRank_param_hecho.append(0)
	elif i < len(count_param_hecho):
		currentRank_param_hecho.append(runningRank)
	else:
		currentRank_param_hecho.append(count_param_hecho[i])
	runningRank = runningRank + count_param_hecho[i]
print "current Rank P_H: ", currentRank_param_hecho

#pert_etnica current rank
currentRank_pert_etnica = []
runningRank = 0
for i in range(0,len(count_pert_etnica)):
	if i == 0:
		currentRank_pert_etnica.append(0)
	elif i < len(count_pert_etnica):
		currentRank_pert_etnica.append(runningRank)
	else:
		currentRank_pert_etnica.append(count_pert_etnica[i])
	runningRank = runningRank + count_pert_etnica[i]
print "current Rank P_E: ", currentRank_pert_etnica

#genero_hom current rank
currentRank_genero_hom = []
runningRank = 0
for i in range(0, len(count_genero_hom)):
	if i ==0 :
		currentRank_genero_hom.append(0)
	elif i < len(count_genero_hom):
		currentRank_genero_hom.append(runningRank)
	else:
		currentRank_genero_hom.append(count_genero_hom[i])
	runningRank = runningRank + count_genero_hom[i]
print "current Rank genero_hom: ", currentRank_genero_hom

#eventdate current rank
currentRank_event_date = []
runningRank = 0
for i in range(0, len(count_event_date)):
	if i == 0:
		currentRank_event_date.append(0)
	elif i < len(count_event_date):
		currentRank_event_date.append(runningRank)
	else:
		currentRank_event_date.append(count_event_date[i])
	runningRank = runningRank + count_event_date[i]
# print "current Rank event date: ", currentRank_event_date

#actors current rank
currentRank_actors = []
runningRank = 0
for i in range(0, len(count_actors)):
	if i == 0:
		currentRank_actors.append(0)
	elif i < len(count_actors):
		currentRank_actors.append(runningRank)
	else:
		currentRank_actors.append(count_actors[i])
	runningRank = runningRank + count_actors[i]
print "current Rank actors: ", currentRank_actors

print ""

##############################
# Compute unqiue rank
# Now run through original list again and now increment currentRank list as we run through and this will be our uniqueRank
##############################

# Param hecho unique rank
uniqueRank_param_hecho = []
for item in list_param_hecho:
	# print item, unique_param_hecho.index(item)
	# Add the current count to the list
	uniqueRank_param_hecho.append(currentRank_param_hecho[unique_param_hecho.index(item)])
	# Incrememnt this items currentRank
	currentRank_param_hecho[unique_param_hecho.index(item)] += 1 
# print "param_hecho list: ", list_param_hecho
# print "uniqueRank p_h l: ", uniqueRank_param_hecho
# print "test unique rank : ", set(uniqueRank_param_hecho)

# Pert Etnica Unique Rank
uniqueRank_pert_etnica = []
for item in list_pert_etnica:
	#Add the current count to the list
	uniqueRank_pert_etnica.append(currentRank_pert_etnica[unique_pert_etnica.index(item)])
	#increment this items currentRank
	currentRank_pert_etnica[unique_pert_etnica.index(item)] += 1
# print "unique Rank p_e l: ", uniqueRank_pert_etnica
# print "test unique rank P_e: ", set(uniqueRank_pert_etnica)

#Genero Hom Unique Rank
uniqueRank_genero_hom = []
for item in list_genero_hom:
	# Add teh current count to the list
	uniqueRank_genero_hom.append(currentRank_genero_hom[unique_genero_hom.index(item)])
	#increment this items current rank
	currentRank_genero_hom[unique_genero_hom.index(item)] += 1
# print "unique Rank g_h l: ", uniqueRank_genero_hom
# print "test unique rank g_e: ", set(uniqueRank_genero_hom)

#Event date Unique Rank
uniqueRank_event_date = []
for item in list_event_date:
	# Add the current count to the list
	uniqueRank_event_date.append(currentRank_event_date[unique_event_date.index(item)])
	#increment this items current rank
	currentRank_event_date[unique_event_date.index(item)] += 1
# print "unique Rank event date l: ", uniqueRank_event_date
# print "test unique rank e_d: ", set(uniqueRank_event_date)

#Actors Unique Rank
uniqueRank_actors = []
for item in list_actors:
	# Add the current count to the list
	uniqueRank_actors.append(currentRank_actors[unique_actors.index(item)])
	#increment this items current rank
	currentRank_actors[unique_actors.index(item)] += 1
# print "unique rank actors l: ", uniqueRank_actors
# print "test unique rank actors: ", set(uniqueRank_actors)

#print ""

##############################
# Output all these nice results we found into a csv
##############################

outputList = []

# Now let's add this sorted rank to our original dataset and to the header table

#append our uniqueRanked data to our master list
flipList.append(list_actors)	#append our list actors so we can know if it was multiple
flipList.append(uniqueRank_param_hecho)				
flipList.append(uniqueRank_pert_etnica)
flipList.append(uniqueRank_genero_hom)
flipList.append(uniqueRank_event_date)
flipList.append(uniqueRank_actors)

flipList = zip(*flipList)							#un flip our flippedlistlist
# print flipList[0]

#append our uniqueRankedFieldNames
fieldnames.append("actors")
fieldnames.append("uniqueRank_param_hecho")	
fieldnames.append("uniqueRank_pert_etnica")	
fieldnames.append("uniqueRank_genero_hom")
fieldnames.append("uniqueRank_event_date")
fieldnames.append("uniqueRank_actors")

outputList.append(fieldnames)						#include our header column (as a list) in our output list

outputList = outputList + flipList 					#concate the header list with our flipped list
# print outputList[2]

#Export the data toa csv
outputFileName = inputFileName + "_OUTPUT"
outputFile = open(outputFileName+".csv", 'wb')
wr = csv.writer(outputFile, delimiter=",")
for row in outputList:
	wr.writerow(row)

# Close all the files
outputFile.close()
inputFile.close()

print "Successfully sorted ", len(flipList), " records"