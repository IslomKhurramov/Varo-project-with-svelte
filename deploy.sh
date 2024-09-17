npm install pm2@latest -g
npm i serve -g
npm i
npm run build
pm2 start "npm run serve" --name=VAVO-FRONT
