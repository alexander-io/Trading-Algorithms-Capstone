import csv

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

def collectCSVdata():
	candles.runAllDefault()
	for dataFile in gdaxFileNames:



def transitionProbabilitiesCSV(datafile):
	'''
	This function takes a datafile name as its argument and returns price tranition
	probabilities for price data asociate with Bitcoin, Litecoin, and Ethereum.
	It is designed to take candle data
	'''
	with open(dataFile) as csvfile:
	    reader = csv.DictReader(csvfile)
	    for row in reader:
	    	