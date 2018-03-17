import os, subprocess, time, inspect, pymongo, datetime

from twilio.rest import Client
x = "AC067a5e1514f4e1592f6a8912a4f84590"
xx = "971b883992a4bbd9d1d17f9a7e0d1960"

client = Client(x, xx)

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
    subprocess.Popen(['nodejs', path+wiki])

def once_per_15_min_scripts():
    subprocess.Popen(['nodejs', path+cmarketcap])
    subprocess.Popen(['python3', path+blockchain])
    subprocess.Popen(['python3', path+twitter])

def once_per_hour_scripts():
    subprocess.Popen(['nodejs', path+wiki])


# returns true if 24 hours has elapsed
def twenty_four_hours_have_elapsed(start_time, end_time):
    if ((end_time.tm_mday > start_time.tm_mday and end_time.tm_hour >= start_time.tm_hour) or end_time.tm_mon > start_time.tm_mon): return True
    else: return False

def one_hour_has_elapsed_unix(start_time, end_time):
    if (end_time - start_time >= 60*60):
        print('one hour has elapsed')

def fifteen_mins_have_elapsed_unix(start_time, end_time):
    if (end_time - start_time >= (60*15)):
        print('fifteen minutes have elapsed')

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

def mins_to_secs(mins): return mins*60
def secs_to_mins(secs): return secs/60

def server_start_txt():
    client.api.account.messages.create(
        to="+12623542930",
        from_="+12623144555",
        body="starting server")
def serve():

    server_start_txt()

    server_start_time = time.localtime()
    server_start_time_unix = time.time()
    print('server start time\n\t', server_start_time, server_start_time_unix)

    once_per_15_min_scripts()
    once_per_day_scripts()

    last_15_min_call = server_start_time
    last_24_hr_call = server_start_time

    last_15_min_call_unix = server_start_time_unix
    last_60_min_call_unix = server_start_time_unix

    while True:
        current_time =  time.localtime()
        current_time_unix = time.time()
        print('::::: current time\n\t', current_time)
        if (fifteen_mins_have_elapsed(last_15_min_call, current_time)):
            last_15_min_call = current_time
            once_per_15_min_scripts()
        if (fifteen_mins_have_elapsed_unix(last_15_min_call_unix, current_time_unix)):
            client.api.account.messages.create(
                to="+12623542930",
                from_="+12623144555",
                body="15 mins have elapsed\n"+((current_time_unix-server_start_time_unix)/60)+":"+(current_time_unix-server_start_time_unix)+" - mins:secs elapsed since server start\n")
        if (twenty_four_hours_have_elapsed(last_24_hr_call, current_time)):
            last_24_hr_call = current_time
            once_per_day_scripts()
        if (one_hour_has_elapsed_unix(last_60_min_call_unix, current_time_unix)):
            last_60_min_call_unix = time.time()
            pass
        time.sleep(mins_to_secs(15))

serve()
