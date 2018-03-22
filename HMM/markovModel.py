import numpy

#calculates error from probability function. 
def calculateErrorSimple(inputVariable, actualValues, probabilityFunction):
	error=0
	for x in range(1,len(inputVariable)):
		predicted=probabilityFunction(inputVariable,inputVariable[x])
		error+=((actualValues[x]-predicted)**2)/x
	return error

#calculates error from probability function. leaves one datum out to use as test set
def calculateErrorRobust(inputVariable, actualValues, probabilityFunction):
	error=0
	for x in range(1,len(inputVariable)):
		trainSet=inputVariable[0:x-1]+inputVariable[x+1:len(inputVariable)]
		testSet=inputVariable[x]
		predicted=probabilityFunction(trainSet,testSet)
		error+=((actualValues[x]-predicted)**2)/x
	return error

#uses a general linear model to approximate value of bitcoin from wikipedia page views
#in order to keep functions working correctly with other functions, it must have two
#input variables even though it only uses one
def simple_GLM_WIKI_to_BTC_Value(inputVariable,value):
	return (value*0.09126)

#uses normal curve generated from mean and standard devation of input data to approximate
#the bitcoin price from wikipedia page views
#in order to keep functions working correctly with other functions, it must have two
#input variables even though it only uses one
def normalized_model_WIKI_to_BTC_value(inputVariable, value):
	mean=numpy.mean(inputVariable)
	standardDeviation=numpy.std(inputVariable)
	return numpy.random.normal(mean,standardDeviation)

#finds and ranks the best ranges for the normal curve ** In progress, So far has only returned that more data is better **
def findBestNormalRange(inputVariable, actualValues, probabilityFunction):
	errors=[]
	for size in range(1,len(inputVariable)//2):
		modelError=calculateModelErrorWithSizeLimit(inputVariable,actualValues,probabilityFunction,size)
		errors.append((modelError,size))
	errors.sort()
	print(errors)


#calculates model with normal distribution but limits range for normal distribution.
def calculateModelErrorWithSizeLimit(inputVariable, actualValues, probabilityFunction, size):
	error=0
	#all points with  at least 'size' many datum on either side
	for x in range(size,len(inputVariable)-size):
		trainingSet=inputVariable[x-size:x]+inputVariable[x+1:x+size+1]
		predicted=probabilityFunction(trainingSet,actualValues[x])
		error+=((actualValues[x]-predicted)**2)/x
	return error

#####################################################
#													#
#													#
#					TESTING							#
#													#
#													#
#####################################################

def main():
	print('\n\n\n\n\n')
	price,views=[],[]
	with open('marketPriceBTC.csv') as marketPrice:
		for line in marketPrice:
			price.append(float(line))
	with open('pageviewsBTC.csv') as pageViews:
		for line in pageViews:
			views.append(float(line))
	print('robust GLM',calculateErrorRobust(views,price,simple_GLM_WIKI_to_BTC_Value))
	print('simple GLM',calculateErrorSimple(views,price,simple_GLM_WIKI_to_BTC_Value))
	print('robust NORMAL',calculateErrorRobust(views,price,normalized_model_WIKI_to_BTC_value))
	print('simple NORMAL',calculateErrorSimple(views,price,normalized_model_WIKI_to_BTC_value))
	print('\n\n\n\n\n')
	print('normalized model')
	findBestNormalRange(views,price,normalized_model_WIKI_to_BTC_value)
	print('\n\n\n\n\n')
	print('glm model')
	findBestNormalRange(views,price,simple_GLM_WIKI_to_BTC_Value)

if __name__ == "__main__":
	# calling main function
	main()

#import csv


'''
def defineStates(datafile):
	This function takes a datafile name as its argument and returns price tranition
	probabilities for price data asociate with Bitcoin, Litecoin, and Ethereum.
	It is designed to take candle data. Divides data into 11 states: 0% change, 
	+-2% change, +-5% change, +-10% change, +-15% change, greater than +-25% change. 
	states=[]
	with open(dataFile) as csvfile:
		reader = csv.DictReader(csvfile)
		for row in range(1,len(reader)):
			percentChange=(reader[row][1]-reader[row-1][1])/reader[row-1][1]
			if percentChange == 0: states.append(0)
			elif percentChange < 0:
				if percentChange >=-2: states.append(-2)
				elif percentChange >=-5: states.append(-5)
				elif percentChange >=-10: states.append(-10)
				elif percentChange >=-15: states.append(-15)
				else: states.append(-25)
			else:
				if percentChange <=2: states.append(2)
				elif percentChange <=5: states.append(5)
				elif percentChange <=10: states.append(10)
				elif percentChange <=15: states.append(15)
				else: states.append(25)
	return states
'''


'''
#importing gdax candle  module
import importlib.util,os,inspect

path=os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
path=path[0:len(path)-4]

#import candles to collect new candles from GDAX if need be
spec = importlib.util.spec_from_file_location("candles.py", path+'/DataMining/GdaxScraper/candles.py')
candles = importlib.util.module_from_spec(spec)
spec.loader.exec_module(candles)

#import query to query db for entries.
spec = importlib.util.spec_from_file_location("query.py", path+'/db/query.py')
query = importlib.util.module_from_spec(spec)
spec.loader.exec_module(query)
#end of module importation

gdaxFileNames=['LONGgdaxCandleDataBTC.csv','LONGgdaxCandleDataETH.csv','LONGgdaxCandleDataLTC.csv','SHORTgdaxCandleDataBTC.csv','SHORTgdaxCandleDataETH.csv','SHORTgdaxCandleDataLTC.csv']
'''



'''
def collectCSVdata():
	#get data as csv from candles.py
	candles.runAllDefault()
	#list to hold all percent changes
	percentChanges
	#input each datafile to get transition probability
	for dataFile in range(0,len(gdaxFileNames)):
		states=defineStates(path+'/DataMining/GdaxScraper/'+gdaxFileNames[dataFile])
'''








			