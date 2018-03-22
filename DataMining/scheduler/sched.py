import os, subprocess, time, inspect, pymongo, datetime
import datetime

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


def time_update_txt_daily():
    now = datetime.datetime.now()
    today = str(now.year) + " " + str(now.month) + " " + str(now.day) + " " + str(now.hour) + " " + str(now.minute)

    today = "daily server update " + today

    client.messages.create(
        to="+12623542930",
        from_="+12623144555",
        body=today)

def once_per_day_scripts():
    subprocess.Popen(['nodejs', path+wiki])
    time_update_txt_daily()

def once_per_15_min_scripts():
    subprocess.Popen(['nodejs', path+cmarketcap])
    subprocess.Popen(['python3', path+blockchain])
    subprocess.Popen(['python3', path+twitter])

def once_per_hour_scripts():
    pass

def twenty_four_hours_have_elapsed_unix(start_time, end_time):
    if (end_time - start_time >= ((60*60)*24)):
        print('twenty_four_hours_have_elapsed_unix')
        return True
    else: return False

def one_hour_has_elapsed_unix(start_time, end_time):
    if (end_time - start_time >= 60*60):
        print('one hour has elapsed')
        return True
    else: return False

def fifteen_mins_have_elapsed_unix(start_time, end_time):
    if (end_time - start_time >= (60*15)):
        print('fifteen minutes have elapsed')
        return True
    else: return False

def five_mins_have_elapsed_unix(start_time, end_time):
    if (end_time - start_time >= (60*5)):
        print('fifteen minutes have elapsed')
        return True
    else: return False

def one_min_has_elapsed_unix(start_time, end_time):
    if (end_time - start_time >= (60*1)):
        print('fifteen minutes have elapsed')
        return True
    else: return False

def mins_to_secs(mins): return mins*60
def secs_to_mins(secs): return secs/60

def serve():

    time_update_txt_daily()

    server_start_time = time.localtime()
    server_start_time_unix = time.time()
    print('server start time\n\t', server_start_time, server_start_time_unix)

    once_per_15_min_scripts()
    once_per_day_scripts()

    last_15_min_call = server_start_time
    last_24_hr_call = server_start_time

    last_1_min_call_unix = server_start_time_unix
    last_5_min_call_unix = server_start_time_unix
    last_15_min_call_unix = server_start_time_unix
    last_60_min_call_unix = server_start_time_unix
    last_24_hr_call_unix = server_start_time_unix

    while True:
        current_time =  time.localtime()
        current_time_unix = time.time()
        print('::::: current time\n\t', current_time)

        if (fifteen_mins_have_elapsed_unix(last_15_min_call_unix, current_time_unix)):
            last_15_min_call_unix = current_time_unix
            once_per_15_min_scripts()

        if (twenty_four_hours_have_elapsed_unix(last_24_hr_call_unix, current_time_unix)):
            last_24_hr_call_unix = current_time_unix
            once_per_day_scripts()

        time.sleep(mins_to_secs(5))

serve()
