
functions=['BTC_WIKI_to_BTC_Value','BTC_Trade_Volume_to_BTC_Value','BTC_Market_Cap_to_BTC_Value']

variables=['wikiBTC','tradeVolumeBTC','marketCapBTC']

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