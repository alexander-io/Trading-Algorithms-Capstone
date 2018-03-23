import bayesianNetwork as BN
import generalLinearModel as GLM


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
