import datetime, csv, praw, time, threading, os, sys, inspect
from threading import Thread
from textblob import TextBlob

#importing mongo push module
import importlib.util

path=os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
path=path[0:51]
path+='db/serve.py'

spec = importlib.util.spec_from_file_location("serve.py", path)
serve = importlib.util.module_from_spec(spec)
spec.loader.exec_module(serve)
#end of module importation

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
		user_agent='MacOS:Reddit Sentiment Scraper:v1.2 (by /u/zsmerritt)'
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

		post={
			'date' : str(datetime.datetime.now()),
			'polarity' : str(comment_blob.sentiment.polarity),
			'subjectivity' : str(comment_blob.sentiment.subjectivity)
		}

		serve.serve(post, 'BitcoinReddit')


		''' CSV saving
		with open('RedditSentimentBTC.csv', 'a', newline='') as csvfile:    
			#Use csv Writer
			csvWriter = csv.writer(csvfile, delimiter=',')
			#writes the message
			csvWriter.writerow([datetime.datetime.now(),comment_blob.sentiment.polarity,comment_blob.sentiment.subjectivity])
		csvfile.close()
		'''

	def getSentimentETH():
		user_agent='MacOS:Reddit Sentiment Scraper:v1.2 (by /u/zsmerritt)'
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

		post={
			'date' : str(datetime.datetime.now()),
			'polarity' : str(comment_blob.sentiment.polarity),
			'subjectivity' : str(comment_blob.sentiment.subjectivity)
		}

		serve.serve(post, 'EthereumReddit')
		'''
		with open('RedditSentimentETH.csv', 'a', newline='') as csvfile:    
			#Use csv Writer
			csvWriter = csv.writer(csvfile, delimiter=',')
			#writes the message
			csvWriter.writerow([datetime.datetime.now(),comment_blob.sentiment.polarity,comment_blob.sentiment.subjectivity])
		csvfile.close()
		'''


	def getSentimentLTC():
		user_agent='MacOS:Reddit Sentiment Scraper:v1.2 (by /u/zsmerritt)'
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

		post={
			'date' : str(datetime.datetime.now()),
			'polarity' : str(comment_blob.sentiment.polarity),
			'subjectivity' : str(comment_blob.sentiment.subjectivity)
		}

		serve.serve(post, 'LitecoinReddit')
		'''
		with open('RedditSentimentLTC.csv', 'a', newline='') as csvfile:    
			#Use csv Writer
			csvWriter = csv.writer(csvfile, delimiter=',')
			#writes the message
			csvWriter.writerow([datetime.datetime.now(),comment_blob.sentiment.polarity,comment_blob.sentiment.subjectivity])
		csvfile.close()
		'''

def main():
	print("starting reddit sentiment")
	startTime=time.time()
	redditSentiment.getSentimentLTC()
	print('LTC Done')
	redditSentiment.getSentimentETH()
	print('ETH Done')
	redditSentiment.getSentimentBTC()
	print(' BTC Done')
	endTime=time.time()
	print("ending reddit sentiment")
	print('Time taken: '+str(endTime-startTime))

if __name__ == "__main__":
	# calling main function
	main()







