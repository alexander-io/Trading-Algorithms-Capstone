import os, subprocess, time, inspect, pymongo
from threading import Thread


# we are here Trading-Algorithm/DataMining/scheduler/
# scripts to call here :
wiki='Wiki/scrape.js'
reddit='Reddit/Sentiment.py'
blockchain='blockchain/getData.py'
twitter='Twitter/Sentiment.py'
#

#os.system("~/node-v8.7.0-linux-x64/bin/node ../Wiki/scrape.js")

#get current file directory
path=os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
#chop off last 9 charecters (scheduler) from the end
path=path[0:len(path)-9]

#infinite loop for gathering data
while True:
	print("in loop")
	#get current time (seconds from 1970, posix/unix/epoch format) and divide by sixty to get minutes
	currentTime = int(time.time())//60
	print(currentTime)
	if currentTime%15==0 or currentTime%1440==0:
		#once a day stuff (1440 minutes in a day)
		if currentTime%1440==0:
			print("daily")
			'''
			wikiPath='node '+path+wiki
			blockchainPath='python3 '+path+blockchain
			Thread(target=os.system, args=(wiki)).start()
			Thread(target=os.system, args=(blockchainPath)).start()
			'''
			os.system('node '+path+wiki)
			os.system('python3 '+path+blockchain)
		#every 15 min stuff
		if currentTime%15==0:#change to 15
			print("doing 15min")
			'''
			redditPath='python3 '+path+reddit
			twitterPath='python3 '+path+twitter
			Thread(target=os.system, args=(redditPath)).start()
			Thread(target=os.system, args=(twitterPath)).start()
			'''
			os.system('python3 '+path+reddit)
			os.system('python3 '+path+twitter)
	else time.sleep(60)