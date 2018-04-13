JSONSERVER="json-server"
JSONSERVERPORT="3004"
DBFILE="./db.json"

start:
	@echo "Starting json server..."
	${JSONSERVER} ${DBFILE} --port ${JSONSERVERPORT} &
	@echo "Starting npm dev server..."
	npm start
