install:
	npm -C users ci && npm -C logs ci && npm -C frontend ci

start:
	cd users && pm2 start npm --name "app name" -- start "start-local"

start-local:
	npm run build --prefix users && npm run start-local --prefix users

start-local-logs:
	npm run start-local --prefix logs

start-frontend:
	npm run start --prefix frontend
