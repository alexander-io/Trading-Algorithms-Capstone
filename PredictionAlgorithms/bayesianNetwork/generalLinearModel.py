
functions=['BTC_intercept','BTC_WIKI_to_BTC_Value','BTC_Trade_Volume_to_BTC_Value','BTC_Market_Cap_to_BTC_Value']

variablesBTC={'viewsBTC':'BTC_WIKI_to_BTC_Value','24h_volume_usdBTC':'BTC_Trade_Volume_to_BTC_Value','market_cap_usdBTC':'BTC_Market_Cap_to_BTC_Value','percent_change_7dBTC':None,'percent_change_24hBTC':None,'percent_change_1hBTC':None,'max_supplyBTC':None,'total_supplyBTC':None,'available_supplyBTC':None,'price_btcBTC':None,'price_usdBTC':None}
variablesLTC={'viewsLTC':'LTC_WIKI_to_LTC_Value','24h_volume_usdLTC':'LTC_Trade_Volume_to_LTC_Value','market_cap_usdLTC':'LTC_Market_Cap_to_LTC_Value','percent_change_7dLTC':None,'percent_change_24hLTC':None,'percent_change_1hLTC':None,'max_supplyLTC':None,'total_supplyLTC':None,'available_supplyLTC':None,'price_btcLTC':None,'price_usdLTC':None}
variablesBCH={'viewsBCH':'BCH_WIKI_to_BCH_Value','24h_volume_usdBCH':'BCH_Trade_Volume_to_BCH_Value','market_cap_usdBCH':'BCH_Market_Cap_to_BCH_Value','percent_change_7dBCH':None,'percent_change_24hBCH':None,'percent_change_1hBCH':None,'max_supplyBCH':None,'total_supplyBCH':None,'available_supplyBCH':None,'price_btcBCH':None,'price_usdBCH':None}
variablesETH={'viewsETH':'ETH_WIKI_to_ETH_Value','24h_volume_usdETH':'ETH_Trade_Volume_to_ETH_Value','market_cap_usdETH':'ETH_Market_Cap_to_ETH_Value','percent_change_7dETH':None,'percent_change_24hETH':None,'percent_change_1hETH':None,'max_supplyETH':None,'total_supplyETH':None,'available_supplyETH':None,'price_btcETH':None,'price_usdETH':None}
variablesXRP={'viewsXRP':'XRP_WIKI_to_XRP_Value','24h_volume_usdXRP':'XRP_Trade_Volume_to_XRP_Value','market_cap_usdXRP':'XRP_Market_Cap_to_XRP_Value','percent_change_7dXRP':None,'percent_change_24hXRP':None,'percent_change_1hXRP':None,'max_supplyXRP':None,'total_supplyXRP':None,'available_supplyXRP':None,'price_btcXRP':None,'price_usdXRP':None}

coins={'BTC':variablesBTC,'LTC':variablesLTC,'BCH':variablesBCH,'ETH':variablesETH,'XRP':variablesXRP}

def getFunctions():
	return functions

def getCoins():
	return coins

def BTC_intercept():
	return 31.92

def BTC_WIKI_to_BTC_Value(pageViews):
	return pageViews*0.0009831

def BTC_Trade_Volume_to_BTC_Value(tradeVolume):
	return tradeVolume*-0.00000002806

def BTC_Market_Cap_to_BTC_Value(marketCap):
	return marketCap*0.00000005917