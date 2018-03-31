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

'''
import numpy,random, scipy.stats, math


#########################################
#										#
#				Averages 				#
#										#
#########################################

def simpleAverage(inputVariable):
	return numpy.mean(inputVariable)

def calWeights(n):
	triangleNumber=(n*(n+1))/2
	weights=[]
	for x in range(1,n+1):
		weights.append(x/triangleNumber)
	return weights

def movingAverage(inputVariable):
	weight=calWeights(len(inputVariable))
	return numpy.ma.average(inputVariable,weights=weight)


#########################################
#										#
#		Probability Distributions		#
#										#
#########################################

distributions=['RECENTtriangular','MEANtriangular','triangularDist','betaDist','exponentialDist','lognormalDist','uniformDist','cauchyDist','geometricDist','poissonDist','binomialDist','normalDist']

def getDistributions():
	return distributions

def normalDist(inputVariable):
	mean=movingAverage(inputVariable)
	standardDeviation=numpy.std(inputVariable) 
	return numpy.random.normal(mean,standardDeviation)

def binomialDist(inputVariable): 
	recentValue=inputVariable[len(inputVariable)-1]
	highValue=max(inputVariable[0:len(inputVariable)-1])
	return numpy.random.binomial(highValue,recentValue/highValue)

def poissonDist(inputVariable):
	mean=movingAverage(inputVariable)
	return numpy.random.poisson(mean)

def geometricDist(inputVariable):
	mean=movingAverage(inputVariable)
	return numpy.random.geometric(1/mean)

def cauchyDist(inputVariable):
	mean=movingAverage(inputVariable[0:len(inputVariable)-1])
	recentValue=inputVariable[len(inputVariable)-1]
	standardDeviation=numpy.std(inputVariable[0:len(inputVariable)-1])
	return -scipy.stats.cauchy.logpdf(recentValue,mean,standardDeviation)

def uniformDist(inputVariable):
	highValue=max(inputVariable)
	lowValue=min(inputVariable)
	return numpy.random.uniform(lowValue,highValue)

def lognormalDist(inputVariable):
	mean=movingAverage(inputVariable)
	standardDeviation=numpy.std(inputVariable) 
	return numpy.random.lognormal(mean,standardDeviation)

def exponentialDist(inputVariable):
	mean=movingAverage(inputVariable)
	return numpy.random.exponential(mean)

def betaDist(inputVariable):
	mean=movingAverage(inputVariable)
	standardDeviation=numpy.std(inputVariable)
	modifiedMean=1/math.log(mean,math.e)
	modifiedSTD=1/math.log(standardDeviation,math.e)
	#print('mean',modifiedMean)
	#print('std',modifiedSTD)
	alpha=(((1-modifiedMean)/modifiedSTD)-(1/modifiedMean))*modifiedMean**2
	#print('alpha',alpha)
	beta=alpha*((1/modifiedMean)-1)
	if beta <=0 or alpha <=0: return 0
	#print('beta',beta)
	output= numpy.random.beta(alpha,beta)
	return 1/(output**e)

def triangularDist(inputVariable):
	mode=(scipy.stats.mode(inputVariable))[0][0]
	highValue=max(inputVariable)
	lowValue=min(inputVariable)
	return numpy.random.triangular(lowValue,mode,highValue)

#the next 2 methods are in testing phase still

def MEANtriangularDist(inputVariable):
	mean=movingAverage(inputVariable)
	highValue=max(inputVariable)
	lowValue=min(inputVariable)
	return numpy.random.triangular(lowValue,mean,highValue)

def RECENTtriangularDist(inputVariable):
	recentValue=inputVariable[len(inputVariable)-1]
	highValue=max(inputVariable[0:len(inputVariable)-1])
	lowValue=min(inputVariable[0:len(inputVariable)-1])
	return numpy.random.triangular(lowValue,recentValue,highValue)

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

			