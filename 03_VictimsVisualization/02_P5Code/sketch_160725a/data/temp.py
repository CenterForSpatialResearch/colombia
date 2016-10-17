import csv

output = open('SmallTest200K.csv', 'wb')
with open('Random_200K_New.csv', 'rb') as baseData:
	reader = csv.reader(baseData, delimiter = '\t')
	baseList = list(reader)

with open('medium_small.csv', 'rb') as baseData2:
	reader2 = csv.reader(baseData2, delimiter = ',')
	baseList2 = list(reader2)

output.write('\t'.join(baseList[0]) + '\t' + 'highlight' + '\n')

baseCodes = []
for line in baseList2:
	baseCodes.append(line[0])

largeCodes = ['11001', '5001', '76001']

smallCount = 0
largeCount = 0
noneCount = 0
for line in baseList[1:]:
	daneCode = line[8]
	if daneCode in baseCodes:
		smallCount += 1
		output.write('\t'.join(line) + '\t' + 'small' + '\n')
	elif daneCode in largeCodes:
		largeCount += 1
		output.write('\t'.join(line) + '\t' + 'large' + '\n')
	else:
		output.write('\t'.join(line) + '\t' + 'none' + '\n')
		noneCount += 1


print smallCount
print largeCount
print noneCount
print noneCount + smallCount + largeCount
output.close()