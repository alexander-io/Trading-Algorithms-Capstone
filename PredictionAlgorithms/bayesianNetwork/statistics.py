'''
ideas:

	1)
	currently, normal function looks at x datum before and after data point y.
	It would be more realistic if it just looked at the past x datum in refferance to y
	this makes it less accurate however. Instead use past x, but assign lower weights to 
	data farther from y. IDK how the stats would work for this. 

	Maybe keep going back until the weight sums to one or the integral of the curve is 
	equal to one. Im not sure

	2) 
	y=current index of pageviews, x=amount of data, z=number of normal curves

	include x of the past datum, starting from y into a normal curve. Then use a weighted average of the past
	z normal curves drawn in this fashion while decreasing y iterativly.



	3) goodness of fit tests. Take actual data and then use it to compare to generated distribution to get goodness of fit.
		Test several gooness of fits at a time to find best one. Combine this with previous research on good predictors. See which combo ranks highest

'''

import numpy, random, scipy.stats, math, itertools, decimal, statsmodels


#########################################
#										#
#			Descriptive Stats 			#
#										#
#########################################

def simpleAverage(inputVariable,limit=None):
	return numpy.mean(inputVariable)

def calWeights(n):
	triangleNumber=(n*(n+1))/2
	weights=[]
	for x in range(1,n+1):
		weights.append(x/triangleNumber)
	return weights

def movingAverage(inputVariable,limit=None):
	if limit==None:
		weight=calWeights(len(inputVariable))
	else:
		weight=calWeights(limit)
		inputVariable=inputVariable[len(inputVariable)-limit:]
	return numpy.ma.average(inputVariable,weights=weight)

def MA7(inputVariable):
	if len(inputVariable)<7:return -1
	weight=calWeights(7)
	limitedInput=inputVariable[len(inputVariable)-7:]
	return numpy.ma.average(limitedInput,weights=weight)

def MA14(inputVariable):
	if len(inputVariable)<14:return -1
	weight=calWeights(14)
	limitedInput=inputVariable[len(inputVariable)-14:]
	return numpy.ma.average(limitedInput,weights=weight)

def MA21(inputVariable):
	if len(inputVariable)<21:return -1
	weight=calWeights(21)
	limitedInput=inputVariable[len(inputVariable)-21:]
	return numpy.ma.average(limitedInput,weights=weight)

def MA28(inputVariable):
	if len(inputVariable)<28:return -1
	weight=calWeights(28)
	limitedInput=inputVariable[len(inputVariable)-28:]
	return numpy.ma.average(limitedInput,weights=weight)

def MA35(inputVariable):
	if len(inputVariable)<35:return -1
	weight=calWeights(35)
	limitedInput=inputVariable[len(inputVariable)-35:]
	return numpy.ma.average(limitedInput,weights=weight)

def MA42(inputVariable):
	if len(inputVariable)<42:return -1
	weight=calWeights(42)
	limitedInput=inputVariable[len(inputVariable)-42:]
	return numpy.ma.average(limitedInput,weights=weight)

def MA49(inputVariable):
	if len(inputVariable)<49:return -1
	weight=calWeights(49)
	limitedInput=inputVariable[len(inputVariable)-49:]
	return numpy.ma.average(limitedInput,weights=weight)

def mode(inputVariable,limit=None):
	return scipy.stats.mode(inputVariable)[0][0]

def median(inputVariable,limit=None):
	return numpy.median(inputVariable)




#########################################
#										#
#		Probability Distributions		#
#										#
#########################################

distributions=['MA49','MA42','MA35','MA28','MA21','MA14','MA7','median','mode','simpleAverage','movingAverage','binomialDist','RECENTtriangularDist','MEANtriangularDist','triangularDist','betaDist','exponentialDist','uniformDist','cauchyDist','geometricDist','poissonDist','normalDist']

def getDistributions():
	return distributions

def normalDist(inputVariable,limit=None):
	mean=movingAverage(inputVariable)
	standardDeviation=numpy.std(inputVariable) 
	return numpy.random.normal(mean,standardDeviation)

def binomialDist(inputVariable,limit=None): 
	recentValue=inputVariable[len(inputVariable)-1]
	highValue=max(inputVariable[0:len(inputVariable)])
	return numpy.random.binomial(highValue,recentValue/highValue)

def poissonDist(inputVariable,limit=None):
	mean=movingAverage(inputVariable)
	return numpy.random.poisson(mean)

def geometricDist(inputVariable,limit=None):
	mean=movingAverage(inputVariable)
	return numpy.random.geometric(1/mean)

def cauchyDist(inputVariable,limit=None):
	mean=movingAverage(inputVariable[0:len(inputVariable)-1])
	recentValue=inputVariable[len(inputVariable)-1]
	standardDeviation=numpy.std(inputVariable[0:len(inputVariable)-1])
	return scipy.stats.cauchy.pdf(recentValue,mean,standardDeviation)

def uniformDist(inputVariable,limit=None):
	highValue=max(inputVariable)
	lowValue=min(inputVariable)
	return numpy.random.uniform(lowValue,highValue)

def lognormalDist(inputVariable,limit=None):
	mean=movingAverage(inputVariable)
	standardDeviation=numpy.std(inputVariable) 
	return numpy.random.lognormal(mean,standardDeviation)

def exponentialDist(inputVariable,limit=None):
	mean=movingAverage(inputVariable)
	return numpy.random.exponential(mean)

def betaDist(inputVariable,limit=None):
	mean=movingAverage(inputVariable)
	standardDeviation=numpy.std(inputVariable)
	modifiedMean=1/math.log(mean,math.e)
	modifiedSTD=1/math.log(standardDeviation,math.e)
	alpha=(((1-modifiedMean)/modifiedSTD)-(1/modifiedMean))*modifiedMean**2
	beta=alpha*((1/modifiedMean)-1)
	if beta <=0 or alpha <=0: return 0
	output= numpy.random.beta(alpha,beta)
	return 1/(output**e)

def triangularDist(inputVariable,limit=None):
	mode=(scipy.stats.mode(inputVariable))[0][0]
	highValue=max(inputVariable)
	lowValue=min(inputVariable)
	return numpy.random.triangular(lowValue,mode,highValue)

#the next 2 methods are in testing phase still

def MEANtriangularDist(inputVariable,limit=None):
	mean=movingAverage(inputVariable)
	highValue=max(inputVariable)
	lowValue=min(inputVariable)
	return numpy.random.triangular(lowValue,mean,highValue)

def RECENTtriangularDist(inputVariable,limit=None):
	recentValue=inputVariable[len(inputVariable)-1]
	highValue=max(inputVariable[0:len(inputVariable)])
	lowValue=min(inputVariable[0:len(inputVariable)])
	return numpy.random.triangular(lowValue,recentValue,highValue)


#########################################
#										#
#		Distribution Fit Testing		#
# 		  and Accuracy Testing			#
#										#
#########################################
'''
def findBestMovingAverageLimit(inputVariable):
	error=1000000000000
	bestLimit=-1
	for x in range(7,len(inputVariable),+7):
		#progress(x,len(inputVariable))
		termError=0
		for y in range(x,len(inputVariable)-1):
			limitedInput=inputVariable[y-x:y]
			#print(len(limitedInput))
			output=movingAverage(limitedInput,x)
			termError+=((inputVariable[y+1]-output)**2)/x
		print(bestLimit,'\'s error:',error)
		print(x,'\'s error:',termError)
		print(termError<error)
		if termError<error:
			print('changing limit')
			bestLimit=x
			error=termError
		else: break
	return bestLimit
'''

def findBestDistribution(inputVariable):
	errorList=[]
	for dist in distributions:
		#if dist=='movingAverage':
		#	errorList.append((dist,findBestMovingAverageLimit(inputVariable)))
		#	continue
		#print('starting',dist)
		error=testDistribution(inputVariable,dist)
		errorList.append((error,dist))
		#print('\nfinished',dist,'with error',error)
	errorList.sort()
	return errorList[0][1]

def testDistribution(inputVariable,distribution):
	totalError=decimal.Decimal(0)
	trials=100
	#stuff for calling function from a string name
	possibles = globals().copy()
	possibles.update(locals())
	dist = possibles.get(distribution)
	#if its in another module use instead
	#output=getattr(bayesianNetwork, distribution)(testSet)
	for y in range(trials):
		#progress(y,trials,'Now testing '+distribution)
		individualError=decimal.Decimal(0)
		for x in range(len(inputVariable)//2,len(inputVariable)-1):
			testSet=inputVariable[0:x]
			output=dist(testSet)
			individualError+=(decimal.Decimal(inputVariable[x+1]-output)**2)/x
		totalError+=individualError
	return totalError/trials


#########################################
#										#
#				Progress Bar 			#
#										#
#########################################
'''
progress bar for longer calls
from vladignatyev on github
'''
import sys
def progress(count, total, status=''):
    bar_len = 100
    filled_len = int(round(bar_len * count / float(total)))

    percents = round(100.0 * count / float(total), 1)
    bar = '#' * filled_len + '*' * (bar_len - filled_len)

    sys.stdout.write('[%s] %s%s ...%s\r' % (bar, percents, '%', status))
    sys.stdout.flush()


#####################################################
#													#
#													#
#					TESTING							#
#													#
#													#
#####################################################

def main():
	a=[1,2,3,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6,7,8,9,10]
	print('array',a)
	random.shuffle(a)
	print('shuffled',a)
	print('MA',movingAverage(a))
	print('SA',simpleAverage(a))
	print('normal',normalDist(a))
	print('poisson',poissonDist(a))
	print('geometric',geometricDist(a))
	print('binomial',binomialDist(a))
	print('cauchy',cauchyDist(a))
	print('uniform',uniformDist(a))
	print('beta',betaDist(a))
	print('triangular',triangularDist(a))
	print('MEANtriangular',MEANtriangularDist(a))
	print('RECENTtriangularDist',RECENTtriangularDist(a))


if __name__ == '__main__':
	main()

			