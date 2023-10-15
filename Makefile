install:
	npm -C users ci && npm -C logs ci && npm -C users/frontend ci && npm -C logs/frontend ci

start:
	npx pm2 start "npm run start" && npm run snap --prefix frontend && pm2 delete 0 && pm2 start src/reCash.js && npm run start

start-local:
	npm run build --prefix users && npm run start-local --prefix users
