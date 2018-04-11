from pymongo import MongoClient, UpdateOne

def queryWithParameters(collectionTitle,query=None,projection=None):
	client=MongoClient('mongodb://localhost:27017/')
	db = client.crypto_trading
	collection = db[collectionTitle]
	return collection.find(query,projection)

def queryDistinct(collectionTitle,field):
	client=MongoClient('mongodb://localhost:27017/')
	db = client.crypto_trading
	collection = db[collectionTitle]
	return collection.distinct(field)

def queryNoParameters(collectionTitle):
	client=MongoClient('mongodb://localhost:27017/')
	db = client.crypto_trading
	collection = db[collectionTitle]
	return collection.find()

def updateOne(collectionTitle,filter,update):
	client=MongoClient('mongodb://localhost:27017/')
	db = client.crypto_trading
	collection = db[collectionTitle]
	requests=[UpdateOne(filter=filter,update=update)]
	return collection.bulk_write(requests)



