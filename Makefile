install:
	npm -C users ci && npm -C logs ci && npm -C frontend ci

start:
	pm2 start "make start-users" -n node.js/users && pm2 start "make start-logs" -n node.js/logs

start-local:
	npm run build --prefix users && npm run start-local --prefix users

start-local-logs:
	npm run start-local --prefix logs

start-users:
	npm run start --prefix users

start-logs:
	npm run start --prefix logs

start-frontend:
	npm run start --prefix frontend
