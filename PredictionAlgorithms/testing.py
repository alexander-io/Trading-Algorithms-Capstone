import bayesianNetwork as BN
import generalLinearModel as GLM
import accuracyTesting as AccTest

def main():
	print('\n\n\n\n\n')
	price,views=[],[]
	with open('marketPriceBTC.csv') as marketPrice:
		for line in marketPrice:
			price.append(float(line))
	with open('pageviewsBTC.csv') as pageViews:
		for line in pageViews:
			views.append(float(line))
	print('robust GLM',AccTest.calculateErrorRobust(views,price,GLM.simple_GLM_WIKI_to_BTC_Value))
	print('simple GLM',AccTest.calculateErrorSimple(views,price,GLM.simple_GLM_WIKI_to_BTC_Value))
	print('robust NORMAL',AccTest.calculateErrorRobust(views,price,BN.normalized_model_WIKI_to_BTC_value))
	print('simple NORMAL',AccTest.calculateErrorSimple(views,price,BN.normalized_model_WIKI_to_BTC_value))
	print('\n\n\n\n\n')
	print('normalized model')
	AccTest.findBestNormalRange(views,price,BN.normalized_model_WIKI_to_BTC_value)
	print('\n\n\n\n\n')
	print('glm model')
	AccTest.findBestNormalRange(views,price,GLM.simple_GLM_WIKI_to_BTC_Value)

if __name__ == "__main__":
	# calling main function
	main()