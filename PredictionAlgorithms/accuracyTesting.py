import bayesianNetwork as BN
import generalLinearModel as GLM
import itertools, decimal

decimal.getcontext().prec = 7

'''
Gives a 2d list of all possible distribution combonations. 
i.e. with n of 2, and only binomial and normal distributions, the output would look like:
			[['normal','normal'],['normal','binomial'],['binomial','normal'],['binomial','binomial']]
param 		n 		the number of variables. The length of each substring
return 				all combonations of distributions
'''
def distributionCombos(n):
	dists=BN.getDistributions()
	#print(dists)
	return list(itertools.product(dists,repeat=n))


'''
def findBestDistributions(inputVariables,outputVariable):
	#number of iterations of tests to run to find best distributions
	numberTests=10000
	distCombos=distributionCombos(len(inputVariables))
	GLMfunctions=GLM.getFunctions()
	for dist in distCombos:
		#for use when multiple accuracy trials are run
		#for x in range(numberTests)
			#distOutputs=[]
		price=GLM.intercept()
		for y in range(len(inputVariables)):
			#dist[y] is distribution fuction
			output=BN.dist[y](inputVariables[y])
			#glmfunctions[y] is glm function for input
			price+=GLM.GLMfunctions[y](output)
'''

def testDistribution(inputVariable,distribution):
	totalError=decimal.Decimal(0)
	trials=100
	for y in range(trials):
		progress(y,trials,distribution)
		individualError=decimal.Decimal(0)
		for x in range(len(inputVariable)//2,len(inputVariable)-1):
			start=x-len(inputVariable)//2
			testSet=inputVariable[start:x]
			output=getattr(BN, distribution)(testSet)
			individualError+=(decimal.Decimal(inputVariable[x+1]-output)**2)/decimal.Decimal(len(inputVariable))
		totalError+=individualError
	return totalError/trials


def findBestDistribution(inputVariable):
	distributions=BN.getDistributions()
	errorList=[]
	for dist in distributions:
		#print('starting',dist)
		error=testDistribution(inputVariable,dist)
		errorList.append((error,dist))
		print('\nfinished',dist,'with error',error)
	return errorList.sort()


		
'''
progress bar for longer calls
from vladignatyev on github
'''
import sys
def progress(count, total, status=''):
    bar_len = 60
    filled_len = int(round(bar_len * count / float(total)))

    percents = round(100.0 * count / float(total), 1)
    bar = '#' * filled_len + '*' * (bar_len - filled_len)

    sys.stdout.write('[%s] %s%s ...%s\r' % (bar, percents, '%', status))
    sys.stdout.flush()

'''

#calculates error from probability function. 
def calculateErrorSimple(inputVariable, actualValues, probabilityFunction):
	error=0
	for value in inputVariable:
		predicted=probabilityFunction(inputVariable,value)
		error+=((value-predicted)**2)/len(inputVariable)
	return error/len(inputVariable)

#calculates error from probability function. leaves one datum out to use as test set
def calculateErrorRobust(inputVariable, actualValues, probabilityFunction):
	error=0
	for x in range(1,len(inputVariable)):
		trainSet=inputVariable[0:x-1]+inputVariable[x+1:len(inputVariable)]
		testSet=inputVariable[x]
		predicted=probabilityFunction(trainSet,testSet)
		error+=((actualValues[x]-predicted)**2)/len(inputVariable)

	return error/len(inputVariable)

#calculates model with normal distribution but limits range for normal distribution.
def calculateModelErrorWithSizeLimit(inputVariable, actualValues, probabilityFunction, size):
	error=0
	#all points with  at least 'size' many datum on either side
	for x in range(size,len(inputVariable)-size):
		trainingSet=inputVariable[x-size:x]+inputVariable[x+1:x+size+1]
		predicted=probabilityFunction(trainingSet,actualValues[x])
		error+=((actualValues[x]-predicted)**2)/len(inputVariable)
	return error/len(inputVariable)

#finds and ranks the best ranges for the normal curve ** In progress, So far has only returned that more data is better **
def findBestNormalRange(inputVariable, actualValues, probabilityFunction):
	errors=[]
	for size in range(1,len(inputVariable)//2):
		modelError=calculateModelErrorWithSizeLimit(inputVariable,actualValues,probabilityFunction,size)
		errors.append((modelError,size))
	errors.sort()
	print(errors)

'''
