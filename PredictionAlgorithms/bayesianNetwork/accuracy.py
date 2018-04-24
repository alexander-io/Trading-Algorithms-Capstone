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
		for timePeriod in range(1,maxTimePeriod):
			print('testing timePeriod',timePeriod,'out of',maxTimePeriod)
			data=BN.getData(timePeriod*60)
			timePeriodError=0
			dataLength=lenData(data)
			#print(dataLength)
			for x in range(dataLength//2,dataLength-1):
				testSet=sliceData(data,x,0)
				output=BN.makePrediction(testSet,coinSymbol)
				timePeriodError+=((data[coinSymbol]['price_usd'+coinSymbol][x+1]-output)**2)/x
			with open('accuracyGraph.csv', 'w', newline='') as csvfile:
				csvWriter = csv.writer(csvfile)
				csvWriter.writerow((timePeriodError,timePeriod))
			csvfile.close()


def lenData(data):
	#print(data[list(data)[0]][list(data[list(data)[0]])[0]])
	#print(data[list(data.keys())[0]])
	#print(len(data[data.keys()]))
	#fix. right now only returns symbols list
	return len(data[list(data)[0]][list(data[list(data)[0]])[0]])


def main():
	testTimePeriods('BTC',24)



#########################################
#										#
#				Progress Bar 			#
#										#
#########################################
'''
progress bar for longer calls
from vladignatyev on github
'''
import sys
def progress(count, total, status=''):
    bar_len = 100
    filled_len = int(round(bar_len * count / float(total)))

    percents = round(100.0 * count / float(total), 1)
    bar = '#' * filled_len + '*' * (bar_len - filled_len)

    sys.stdout.write('[%s] %s%s ...%s\r' % (bar, percents, '%', status))
    sys.stdout.flush()






#########################################
#										#
#			main execution 				#
#										#
#########################################

if __name__ == '__main__':
	main()
