import os, subprocess, time, inspect, pymongo, progressbar, datetime

# test class day
class Day:
    def __init__(self, tm_mon, tm_mday,tm_hour, tm_min):
        self.tm_mon = tm_mon
        self.tm_mday = tm_mday
        self.tm_hour = tm_hour
        self.tm_min =  tm_min

wiki="Wiki/scrape.js"
reddit="Reddit/Sentiment.py"
blockchain="blockchain/getData.py"
twitter="Twitter/Sentiment.py"
cmarketcap="blockchain/cmarketcap.js"

#get current file directory
path=os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
#chop off last 9 charecters (scheduler) from the end
path=path[0:len(path)-9]

def once_per_day_scripts():
    subprocess.Popen(['node', path+wiki])
    subprocess.Popen(['python3', path+blockchain])

def once_per_15_min_scripts():
    subprocess.Popen(['node', path+cmarketcap])
    subprocess.Popen(['python3', path+blockchain])
    subprocess.Popen(['python3', path+twitter])

# returns true if 24 hours has elapsed
def twenty_four_hours_have_elapsed(start_time, end_time):
    if ((end_time.tm_mday > start_time.tm_mday and end_time.tm_hour >= start_time.tm_hour) or end_time.tm_mon > start_time.tm_mon): return True
    else: return False

# returns true if 15 minutes has elapsed
def fifteen_mins_have_elapsed(start_time, end_time):
    is_next_month = end_time.tm_mon != start_time.tm_mon
    is_next_day = end_time.tm_mday != start_time.tm_mday
    is_next_hour = end_time.tm_hour != start_time.tm_hour

    if (is_next_month or is_next_day or is_next_hour):
        if ((60 - start_time.tm_min) + end_time.tm_min >= 15):
            return True
        else: return False
    else: return (end_time.tm_min - start_time.tm_min >= 15)

def start_server():
    server_start_time = time.localtime()
    print(server_start_time)

start_server()
