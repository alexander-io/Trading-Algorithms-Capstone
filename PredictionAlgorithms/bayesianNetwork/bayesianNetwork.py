import statistics as STAT
import generalLinearModel as GLM
import pprint

#importing mongo query module
import importlib.util, os, inspect

path=os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
path=path[0:len(path)-36]
path+='db/query.py'

spec = importlib.util.spec_from_file_location("query.py", path)
query = importlib.util.module_from_spec(spec)
spec.loader.exec_module(query)
#end of module importation

#helps print things better
pp = pprint.PrettyPrinter(indent=4)

collections=[{
	'collectionTitle':'coinmarketcap_ticker',
	'projection':{'_id':0,'id':0,'name':0,'rank':0,'post_created_time_hour':0,'post_created_time_minute':0,'price_usd_int':0},
	'id':'symbol',
	'time':'last_updated'
	},
	{
	'collectionTitle':'wiki_views',
	'projection':{'timestamp':1,'pagetitle':1,'views':1,'_id':0},
	'id':'pagetitle',
	'time':'timestamp'
	}]
translationTable={'Bitcoin':'BTC','Litecoin':'LTC','Ripple_(payment_protocol)':'XRP','Dogecoin':'DOGE','Bitcoin_Cash':'BCH','Ethereum':'ETH','BTC':'BTC','LTC':'LTC','XRP':'XRP','DOGE':'DOGE','BCH':'BCH','ETH':'ETH'}

#timePeriod in minutes. lower limit is 1
def getData(timePeriod):
	#dict to store data
	dataSets={}
	#create dict for each coin's data
	cursor=query.queryDistinct(collectionTitle='coinmarketcap_ticker',field='symbol')
	for symbol in cursor:
		dataSets[symbol]={}
	#for each collection...
	for collection in collections:
		#get inportant params
		cursor=query.queryWithParameters(projection=collection['projection'],collectionTitle=collection['collectionTitle'])
		previousDoc=None
		#for each param...
		for doc in cursor:

			#get translated symbol
			symbol=translationTable[doc[collection['id']]]
			if symbol not in dataSets.keys(): continue
			#get correct dataset
			data=dataSets[symbol]

			#check how many time periods have gone by since previous time period
			if previousDoc == None: previousDoc=doc
			try:
				#time difference
				dTimePeriods=((int(doc[collection['time']])-int(previousDoc[collection['time']]))//60)//timePeriod
			except:
				print('doc',doc)
				print('doc[collection[\'time\']]',doc[collection['time']])
				print('\n')
				prtin('previousDoc',previousDoc)
				print('previousDoc[collection[\'time\']]',previousDoc[collection['time']])
				break
			#interpolate missing data
			if dTimePeriods>1:doc=interpolate(previousDoc,doc,dTimePeriods)
			#skip datapoint if not enough time has passed
			elif dTimePeriods<1 and dTimePeriods!=0:continue
			previousDoc=doc

			#for each field..
			for key in doc.keys():
				#filter further unwanted fields
				if key=='symbol' or key=='pagetitle': continue
				#create or add to list of data
				if key in data.keys():
					if type(doc[key])==list: data[key+symbol]=data[key+symbol]+doc[key]
					else: data[key+symbol].append(doc[key])
				else: 
					if type(doc[key])!=list:value=[doc[key]]
					else: value=doc[key]
					data[key+symbol]=value
	return dataSets


def interpolate(previousDatum,currentDatum,dTimePeriod):
	for field in previousDatum:
		try:
			previous=float(previousDatum[field])
			current=float(currentDatum[field])
			currentDatum[field]=[]
			for x in range(1,dTimePeriod):
				interpolation=previousDatum[field]+((current-previous)/dTimePeriod)*x
				currentDatum[field].append(interpolation)
		except:
			currentDatum[field]=[currentDatum[field]*dTimePeriod]
	return currentDatum


def makePrediction(dataSet,coinSymbol):
	coinFunctions=GLM.getCoins()[coinSymbol]
	usableFunctions=[]
	for symbol in dataSet:
		for field in dataSet[symbol]:
			try:
				function=coinFunctions[field]
				if function!=None:usableFunctions.append((function,dataSet[symbol][field]))
			except KeyError:
				continue
	prediction=getattr(GLM, coinSymbol+'_intercept')()
	for function,data in usableFunctions:
		distribution=STAT.findBestDistribution(data)
		output=getattr(STAT, distribution)(data)
		prediction+=getattr(GLM, function)(output)
	return prediction


def main():
	data=getData(60*24)
	pp.pprint(data)
	data=getData(60)
	pp.pprint(data)
	print(makePrediction(data,'BTC'))


if __name__ == '__main__':
	main()