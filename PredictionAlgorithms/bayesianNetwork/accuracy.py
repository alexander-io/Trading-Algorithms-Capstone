import statistics as STAT, bayesianNetwork as BN, generalLinearModel as GLM, csv

'''
def testDataLengths(timePeriod):
	data=BN.getData(timePeriod)
	dataLength=BN.getDataLength(data)
	for dataLimit in range(1,dataLength):
		for start in range(dataLength-dataLimit):

	print('24 hour prediction')
	#pp.pprint(data)
	print('\n',makePrediction(data,'BTC'))
'''

def sliceData(data, sliceLength, start):
	newData={}
	for symbol in data:
		newData[symbol]={}
		for key in data[symbol]:
			newData[symbol][key]=data[symbol][key][start:start+sliceLength]
	return newData


#tests accuracy at the hour by hour level
def testTimePeriods(coinSymbol,maxTimePeriod):
	with open('accuracyGraph.csv', 'w', newline='') as csvfile:
		csvWriter = csv.writer(csvfile)
		for timePeriod in range(1,maxTimePeriod):
			data=BN.getData(timePeriod*60)
			timePeriodError=0
			dataLength=lenData(data)
			#print(dataLength)
			#for x in range(dataLength//2,dataLength-1):
			trainSet=sliceData(data,len(data)-1,0)

			output=BN.makePrediction(dataSet=trainSet,coinSymbol=coinSymbol,verbose=True,status='testing timePeriod '+str(timePeriod)+'/'+str(maxTimePeriod))
			timePeriodError+=((data[coinSymbol]['price_usd'+coinSymbol][-1]-output)**2)/dataLength
			csvWriter.writerow((timePeriodError,timePeriod))
		csvfile.close()


def lenData(data):
	#print(data[list(data)[0]][list(data[list(data)[0]])[0]])
	#print(data[list(data.keys())[0]])
	#print(len(data[data.keys()]))
	#fix. right now only returns symbols list
	return len(data[list(data)[0]][list(data[list(data)[0]])[0]])


def main():
	testTimePeriods('BTC',24*7)








#########################################
#										#
#			main execution 				#
#										#
#########################################

if __name__ == '__main__':
	main()
