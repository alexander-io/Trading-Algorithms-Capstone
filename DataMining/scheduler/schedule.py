import os, subprocess, time, inspect, pymongo
from threading import Thread


# we are here Trading-Algorithm/DataMining/scheduler/
# scripts to call here :

wiki="=Wiki/scrape.js"
reddit="Reddit/Sentiment.py"
blockchain="blockchain/getData.py"
twitter="Twitter/Sentiment.py"
cmarketcap="blockchain/cmarketcap.js"

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
	#once a day stuff
	if currentTime%86400==0:
		print('executing daily data collection')
		os.system("node "+path+wiki)
		os.system("python3 "+path+blockchain)
	#every 15 min stuff
	if currentTime%900==0:
		print('executing 15min data collection')
		os.system("node "+path+cmarketcap)
		os.system("python3 "+path+blockchain)
		os.system("python3 "+path+twitter)

	time.sleep(60)
