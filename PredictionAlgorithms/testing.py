import statistics as STAT
import generalLinearModel as GLM


def main():
	#print('\n\n\n\n\n')
	#import test data set
	price,views,capital,volume=[],[],[],[]
	with open('marketPriceBTC.csv') as marketPrice:
		for line in marketPrice:
			price.append(float(line))
	with open('pageviewsBTC.csv') as pageViews:
		for line in pageViews:
			views.append(float(line))
	with open('marketCapBTC.csv') as marketCap:
		for line in marketCap:
			capital.append(float(line))
	with open('tradeVolumeBTC.csv') as tradeVolume:
		for line in tradeVolume:
			volume.append(float(line))
	'''
	for dist in distributions:
		for x in range:
			pass
	'''
	print('views')
	#print('\n',STAT.findBestMovingAverageLimit(views))
	print('\n',STAT.findBestDistribution(views))
	print('capital')
	#print('\n',STAT.findBestMovingAverageLimit(capital))
	print('\n',STAT.findBestDistribution(views))
	print('volume')
	#print('\n',STAT.findBestMovingAverageLimit(volume))
	print('\n',STAT.findBestDistribution(volume))
	print('price')
	#print('\n',STAT.findBestMovingAverageLimit(price))
	print('\n',STAT.findBestDistribution(price))

	'''
	print('robust GLM',AccTest.calculateErrorRobust(views,price,GLM.BTC_WIKI_to_BTC_Value))
	print('simple GLM',AccTest.calculateErrorSimple(views,price,GLM.BTC_WIKI_to_BTC_Value))
	print('robust NORMAL',AccTest.calculateErrorRobust(views,price,STAT.normalized_model_WIKI_to_BTC_value))
	print('simple NORMAL',AccTest.calculateErrorSimple(views,price,STAT.normalized_model_WIKI_to_BTC_value))
	print('\n\n\n\n\n')
	print('normalized model')
	AccTest.findBestNormalRange(views,price,STAT.normalized_model_WIKI_to_BTC_value)
	print('\n\n\n\n\n')
	print('glm model')
	AccTest.findBestNormalRange(views,price,GLM.BTC_WIKI_to_BTC_Value)
	'''

if __name__ == "__main__":
	# calling main function
	main()