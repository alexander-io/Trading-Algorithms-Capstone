from pymongo import MongoClient

def serve(post, collectionTitle):
	client=MongoClient('mongodb://localhost:27017/')
	db = client.crypto_trading
	collection = db[collectionTitle]
	postid=collection.insert_one(post).inserted_id
