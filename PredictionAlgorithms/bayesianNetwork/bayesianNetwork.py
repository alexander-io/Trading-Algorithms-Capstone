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

		previousDocs={}
		for symbol in dataSets:
			previousDocs[symbol]=None
		#for each param...
		for doc in cursor:

			#get translated symbol
			try:symbol=translationTable[doc[collection['id']]]
			except KeyError: continue
			if symbol not in dataSets.keys(): continue
			#get correct dataset
			data=dataSets[symbol]

			#print('START')
			#print('previousDocs')
			#print(previousDocs[symbol])
			#print('doc')
			#print(doc)


			#check how many time periods have gone by since previous time period
			if previousDocs[symbol] == None: previousDocs[symbol]=doc
			#print(previousDocs[symbol])
			#print(previousDocs[symbol][collection['time']])
			#time difference
			dTimePeriods=((int(doc[collection['time']])-int(previousDocs[symbol][collection['time']]))//60)/timePeriod
			#skip datapoint if not enough time has passed
			print(dTimePeriod)
			if dTimePeriods<1:# and dTimePeriods!=0: 
				#print('skipping datum')
				continue
			

			#interpolate missing data and create list for each new datapoint
			docList=interpolate(previousDocs[symbol],doc,int(dTimePeriods))
			#print('dTimePeriods')
			#print(dTimePeriods)
			#print('docList')
			#print(docList)
			#print('END')
			previousDocs[symbol]=doc
			for entry in docList:
				#for each field..
				for key in entry.keys():
					#filter further unwanted fields
					if key=='symbol' or key=='pagetitle' or key=='timestamp' or key=='last_updated' : continue

					if type(entry[key])==str:
						try: entry[key]=float(entry[key])
						except: pass
					#create or add to list of data
					if key+symbol in data.keys():
						data[key+symbol].append(entry[key])
					else: 
						data[key+symbol]=[entry[key]]
	return dataSets

'''
def interpolate(previousDatum,currentDatum,dTimePeriod):
	if dTimePeriod==1:return [currentDatum]
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
'''

def interpolate(previousDatum,currentDatum,dTimePeriod):
	if dTimePeriod<=1:return [currentDatum]
	print('interpolating',dTimePeriod,'datapoints')
	print(currentDatum)
	data=[]
	for x in range(1,dTimePeriod-1):
		newDatum=copy.deepcopy(previousDatum)
		for key in newDatum:
			try:
				valueChange=(float(currentDatum[key])-float(previousDatum[key]))/dTimePeriod
				#print('current:',float(currentDatum[key]))
				#print('previous:',float(previousDatum[key]))
				#print('newValue',newValue)
				newDatum[key]=float(previousDatum[key])+valueChange*x
			except:
				continue
		data.append(newDatum)
	data.append(currentDatum)
	return data


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
	#data=getData(60*24)
	#print('daily data')
	#pp.pprint(data)
	#data=getData(60)
	#print('hourly data')
	#pp.pprint(data)	
	data=getData(60*24)
	print('60 min data')
	pp.pprint(data)
	#print(makePrediction(data,'BTC'))


if __name__ == '__main__':
	main()