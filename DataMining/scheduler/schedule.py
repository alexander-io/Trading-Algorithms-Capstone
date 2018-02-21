import os, subprocess, time, inspect, pymongo, progressbar
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

bar = progressbar.ProgressBar(redirect_stdout=True)
x = 0
#infinite loop for gathering data
while True:
	# update progress indicator
	bar(range(x))
	bar.update(x)
	x+=1
	#get current time (seconds from 1970, posix/unix/epoch format) and divide by sixty to get minutes
	currentTime = int(time.time())//60
	print('current time', currentTime)
	print('current time mod 86400 ' + str(currentTime%86400))

	print('current time mod 9 ' + str(currentTime%3))

	#once a day stuff
	if currentTime%86400==0:
		print('executing daily data collection')
		os.system("node "+path+wiki)
		os.system("python3 "+path+blockchain)
	#every 15 min stuff
	if currentTime%3==0:
		print('executing 15min data collection')
		os.system("node "+path+cmarketcap)
		os.system("python3 "+path+blockchain)
		os.system("python3 "+path+twitter)

	time.sleep(3)
