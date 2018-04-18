import statistics as STAT
import generalLinearModel as GLM
import bayesianNetwork as BN


def testDataLengths(timePeriod):
	data=BN.getData(timePeriod)
	for dataLimit in range(data[data.keys()[0]]):
		for start in range():
	print('24 hour prediction')
	#pp.pprint(data)
	print('\n',makePrediction(data,'BTC'))