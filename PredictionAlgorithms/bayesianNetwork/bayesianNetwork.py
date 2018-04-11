import statistics as STAT
import generalLinearModel as GLM

#importing mongo query module
import importlib.util, os, inspect

path=os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
path=path[0:len(path)-36]
path+='db/query.py'

spec = importlib.util.spec_from_file_location("query.py", path)
query = importlib.util.module_from_spec(spec)
spec.loader.exec_module(query)
#end of module importation

collections=[
	{'collectionTitle':'coinmarketcap_ticker','projection':{'_id':0,'id':0,'name':0,'rank':0,'last_updated':0,'post_created_time_hour':0,'post_created_time_minute':0,'price_usd_int':0}},
	{'collectionTitle':'wiki_views','projection':{'pagetitle':1,'views':1}}
	]
wikiTranslation={'Bitcoin':'BTC','Litecoin':'LTC','Ripple_(payment_protocol)':'XRP','Dogecoin':'DOGE','Bitcoin_Cash':'BCH','Ethereum':'ETH'}

def getData():
	dataSets={}
	cursor=query.queryDistinct(collectionTitle='coinmarketcap_ticker',field='symbol')
	for symbol in cursor:
		dataSets[symbol]={}
	for collection in collections:
		cursor=query.queryWithParameters(projection=collection['projection'],collectionTitle=collection['collectionTitle'])
		for doc in cursor:
			if collection['collectionTitle']=='wiki_views':
				if wikiTranslation[doc['pagetitle']] in dataSets.keys(): data=dataSets[wikiTranslation[doc['pagetitle']]]
				else: continue
			else:data=dataSets[doc['symbol']]
			for key in doc.keys():
				if key=='symbol' or key=='pagetitle': continue
				if key in data.keys(): data[key].append(doc[key])
				else: data[key]=[doc[key]]
	return dataSets

def main():
	print(getData())

if __name__ == '__main__':
	main()