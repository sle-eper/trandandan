up:
	@docker compose -f docker-compose.yml up --build 
down:
	@docker compose -f docker-compose.yml down -v
restart:
	@docker compose -f docker-compose.yml restart
images_ls:
	@docker images
containers_ls:
	@docker ps -a
flash:
# 	@docker rmi -f $(docker images -q)
# 	@docker container rm  -f $(docker container ls -a -q)
re: down  up