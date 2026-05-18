#!/usr/bin/env bash

echo "🚀 Run the app: navigate into SE2 📂 and start with: pm2 start ecosystem.config.js --env production ✅"
cd ~/SE2 || exit 1
pm2 start ecosystem.config.js --env production
pm2 save
pm2 status
