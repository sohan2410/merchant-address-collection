#!/bin/bash

pm2 stop mac_moxey
npm run build
cd build
pm2 start server.js --name "mac_moxey"  --log-date-format "YYYY-MM-DD HH:mm"