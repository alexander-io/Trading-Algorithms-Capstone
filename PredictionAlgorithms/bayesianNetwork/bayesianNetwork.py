import statistics as STAT
import generalLinearModel as GLM
import pprint,copy

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
	'projection':{'unix_time':1,'pagetitle':1,'views':1,'_id':0},
	'id':'pagetitle',
	'time':'unix_time'
	}]
symbolTranslationTable={'Bitcoin':'BTC','Litecoin':'LTC','Ripple_(payment_protocol)':'XRP','Dogecoin':'DOGE','Bitcoin_Cash':'BCH','Ethereum':'ETH','BTC':'BTC','LTC':'LTC','XRP':'XRP','DOGE':'DOGE','BCH':'BCH','ETH':'ETH'}
timeTranslationTable={'wiki_views':60*1000,'coinmarketcap_ticker':60}

#timePeriod in minutes. lower limit is 1
def getData(timePeriod, dataLimit=1024):
	if dataLimit>1024: dataLimit=1024
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

		previousDocs={}
		for symbol in dataSets:
			previousDocs[symbol]=None
		#for each param...
		for doc in cursor:
			#get translated symbol
			try:symbol=symbolTranslationTable[doc[collection['id']]]
			except KeyError: continue
			if symbol not in dataSets.keys(): continue
			#get correct dataset
			data=dataSets[symbol]

			#check how many time periods have gone by since previous time period
			if previousDocs[symbol] == None: previousDocs[symbol]=doc
			#time difference
			try:
				currentTime=int(doc[collection['time']])
				previousTime=int(previousDocs[symbol][collection['time']])
			except:
				pass
			dTimePeriods=((currentTime-previousTime)//timeTranslationTable[collection['collectionTitle']])/timePeriod
			#skip datapoint if not enough time has passed
			if dTimePeriods<1 and dTimePeriods!=0: 
				#print('skipping datum')
				continue
			#interpolate missing data and create list for each new datapoint
			docList=interpolate(previousDocs[symbol],doc,int(dTimePeriods))

			previousDocs[symbol]=doc
			for entry in docList:
				#for each field..
				for key in entry.keys():
					#filter further unwanted fields
					if key=='symbol' or key=='pagetitle' or key=='unix_time' or key=='last_updated': continue

					if type(entry[key])==str:
						try: entry[key]=float(entry[key])
						except: pass
					#create or add to list of data
					if key+symbol in data.keys():
						data[key+symbol].append(entry[key])
					else: 
						data[key+symbol]=[entry[key]]

	for symbol in dataSets:
		for data in dataSets[symbol]:
			if len(dataSets[symbol][data])>dataLimit:
				dataSets[symbol][data]=dataSets[symbol][data][len(dataSets[symbol][data])-dataLimit:]
	#print(len(dataSets['BTC']['price_usdBTC']))
	return dataSets


def interpolate(previousDatum,currentDatum,dTimePeriod):
	if dTimePeriod<=1:return [currentDatum]
	data=[]
	for x in range(1,dTimePeriod-1):
		newDatum=copy.deepcopy(previousDatum)
		for key in newDatum:
			try:
				valueChange=(float(currentDatum[key])-float(previousDatum[key]))/dTimePeriod
				newDatum[key]=float(previousDatum[key])+valueChange*x
			except:
				continue
		data.append(newDatum)
	data.append(currentDatum)
	return data


def sliceData(data, sliceLength, start):
	newData={}
	for symbol in data:
		newData[symbol]={}
		for key in data[symbol]:
			newData[symbol][key]=data[symbol][key][start:start+sliceLength]
	return newData


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
		#print('\nadded factor')
	return prediction


def main():
	
	data=getData(60*24)
	print('24 hour prediction')
	pp.pprint(data)
	print('\n',makePrediction(data,'BTC'))
	data=getData(60)
	print('60 min prediction')
	#pp.pprint(data)
	print('\n',makePrediction(data,'BTC'))
	data=getData(10)
	print('10 min prediction')
	#pp.pprint(data)
	print('\n',makePrediction(data,'BTC'))


if __name__ == '__main__':
	main()