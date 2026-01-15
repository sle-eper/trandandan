up:
	@docker compose -f docker-compose.yml up --build 
down:
	@docker compose -f docker-compose.yml down -v --remove-orphans
restart:
	@docker compose -f docker-compose.yml restart
images_ls:
	@docker images
containers_ls:
	@docker ps -a
flash:
fclean:
	@if [ -n "$$(docker ps -aq)" ]; then docker stop $$(docker ps -aq); fi
	@if [ -n "$$(docker ps -aq)" ]; then docker rm $$(docker ps -aq); fi
	@if [ -n "$$(docker images -q)" ]; then docker rmi -f $$(docker images -q); fi
# 	@docker volume rm $(docker volume ls -q)
	docker builder prune -f
re: down  up