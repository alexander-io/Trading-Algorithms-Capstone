'''
ideas:

	1)
	currently, normal function looks at x datum before and after data point y.
	It would be more realistic if it just looked at the past x datum in refferance to y
	this makes it less accurate however. Instead use past x, but assign lower weights to 
	data farther from y. IDK how the stats would work for this. 

	Maybe keep going back until the weight sums to one or the integral of the curve is 
	equal to one. Im not sure

	2) 
	y=current index of pageviews, x=amount of data, z=number of normal curves

	include x of the past datum, starting from y into a normal curve. Then use a weighted average of the past
	z normal curves drawn in this fashion while decreasing y iterativly.

'''
import numpy


#uses normal curve generated from mean and standard devation of input data to approximate
#the bitcoin price from wikipedia page views
#in order to keep functions working correctly with other functions, it must have two
#input variables even though it only uses one
def normalized_model_WIKI_to_BTC_value(inputVariable, value):
	mean=numpy.mean(inputVariable)
	standardDeviation=numpy.std(inputVariable)
	return numpy.random.normal(mean,standardDeviation)


#####################################################
#													#
#													#
#					TESTING							#
#													#
#													#
#####################################################


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








			