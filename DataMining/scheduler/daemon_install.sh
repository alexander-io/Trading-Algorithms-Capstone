#!/bin/bash
# linux ubuntu 16.04 service installer
sudo touch /etc/systemd/system/crypto_datamining_sched.service
sudo touch /usr/local/bin/crypto_datamining_sched.sh
sudo chmod 777 /etc/systemd/system/crypto_datamining_sched.service
sudo chmod 777 /usr/local/bin/crypto_datamining_sched.sh
sudo echo $'[Unit]\nAfter=mongodb.service\n\n[Service]\nExecStart=/bin/bash /usr/local/bin/crypto_datamining_sched.sh\nRestart=on-failure\nRestartSec=42s\n\n[Install]\nWantedBy=default.target' > /etc/systemd/system/crypto_datamining_sched.service

echo -n $'#!/bin/bash\npython3 ' > /usr/local/bin/crypto_datamining_sched.sh
echo -n $PWD >> /usr/local/bin/crypto_datamining_sched.sh
echo -n '/sched.py' >> /usr/local/bin/crypto_datamining_sched.sh
systemctl daemon-reload
systemctl enable mongod.service
systemctl enable crypto_datamining_sched
systemctl restart crypto_datamining_sched
