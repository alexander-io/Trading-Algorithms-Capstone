#uses a general linear model to approximate value of bitcoin from wikipedia page views
#in order to keep functions working correctly with other functions, it must have two
#input variables even though it only uses one

functions=['BTC_WIKI_to_BTC_Value','BTC_Trade_Volume_to_BTC_Value','BTC_Market_Cap_to_BTC_Value']

def getFunctions():
	return functions

def intercept():
	return 35.36

def BTC_WIKI_to_BTC_Value(pageViews):
	return pageViews*0.0005666

def BTC_Trade_Volume_to_BTC_Value(tradeVolume):
	return tradeVolume*-0.00000001253

def BTC_Market_Cap_to_BTC_Value(marketCap):
	return marketCap*0.00000005930