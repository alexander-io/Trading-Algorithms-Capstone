import datetime, csv, praw, time, threading, os
from threading import Thread
from textblob import TextBlob

'''
possible subreddits:
Ethereum:
/r/ethereum
/r/ether
/r/eth
/r/ethereumclassic
Bitcoin:
/r/bitcoin
/r/bitcoinmarkets
/r/btc

Choose by most paricipation
'''

class redditSentiment():

	def getSentimentBTC():
		user_agent='MacOS:Reddit Sentiment Scraper:v1.1 (by /u/zsmerritt)'
		client_id='h04EaRGHc4uPKQ'
		client_secret='0JX1YF8_AHBSvKHgDGVKaN0aTMU'
		r = praw.Reddit(client_id=client_id,client_secret=client_secret,user_agent=user_agent)

		# let's get the current top 10 submissions
		# since praw interacts with reddit lazily, we wrap the method
		# call in a list
		submissions = list(r.subreddit('bitcoin').hot(limit=200))
		comments =[]
		for submission in submissions:
			submission.comments.replace_more(limit=0)
			for comment in submission.comments.list():
				comments.append(comment.body)
		#print(comments)
		comment_blob = TextBlob(''.join(comments))
		#print('RedditSentimentBTC.csv')
		with open('RedditSentimentBTC.csv', 'a', newline='') as csvfile:    
			#Use csv Writer
			csvWriter = csv.writer(csvfile, delimiter=',')
			#writes the message
			csvWriter.writerow([datetime.datetime.now(),comment_blob.sentiment.polarity,comment_blob.sentiment.subjectivity])
		csvfile.close()

	def getSentimentETH():
		user_agent='MacOS:Reddit Sentiment Scraper:v1.1 (by /u/zsmerritt)'
		client_id='h04EaRGHc4uPKQ'
		client_secret='0JX1YF8_AHBSvKHgDGVKaN0aTMU'
		r = praw.Reddit(client_id=client_id,client_secret=client_secret,user_agent=user_agent)

		# let's get the current top 10 submissions
		# since praw interacts with reddit lazily, we wrap the method
		# call in a list
		submissions = list(r.subreddit('ethereum').hot(limit=200))
		comments =[]
		for submission in submissions:
			submission.comments.replace_more(limit=0)
			for comment in submission.comments.list():
				comments.append(comment.body)
		#print(comments)
		comment_blob = TextBlob(''.join(comments))
		with open('RedditSentimentETH.csv', 'a', newline='') as csvfile:    
			#Use csv Writer
			csvWriter = csv.writer(csvfile, delimiter=',')
			#writes the message
			csvWriter.writerow([datetime.datetime.now(),comment_blob.sentiment.polarity,comment_blob.sentiment.subjectivity])
		csvfile.close()


	def getSentimentETH():
		user_agent='MacOS:Reddit Sentiment Scraper:v1.1 (by /u/zsmerritt)'
		client_id='h04EaRGHc4uPKQ'
		client_secret='0JX1YF8_AHBSvKHgDGVKaN0aTMU'
		r = praw.Reddit(client_id=client_id,client_secret=client_secret,user_agent=user_agent)

		# let's get the current top 10 submissions
		# since praw interacts with reddit lazily, we wrap the method
		# call in a list
		submissions = list(r.subreddit('litecoin').hot(limit=200))
		comments =[]
		for submission in submissions:
			submission.comments.replace_more(limit=0)
			for comment in submission.comments.list():
				comments.append(comment.body)
		#print(comments)
		comment_blob = TextBlob(''.join(comments))
		with open('RedditSentimentLTC.csv', 'a', newline='') as csvfile:    
			#Use csv Writer
			csvWriter = csv.writer(csvfile, delimiter=',')
			#writes the message
			csvWriter.writerow([datetime.datetime.now(),comment_blob.sentiment.polarity,comment_blob.sentiment.subjectivity])
		csvfile.close()

	
	


def redditBitcoinSentiment():
	while True:
		redditSentiment.getSentimentBTC()
		time.sleep(21600)

def redditEthereumSentiment():
	while True:
		redditSentiment.getSentimentETH()
		time.sleep(21600)

def main():
	Thread(target=redditEthereumSentiment).start()
	Thread(target=redditBitcoinSentiment).start()

if __name__ == "__main__":
	# calling main function
	main()







