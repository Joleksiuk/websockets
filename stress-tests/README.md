- Utworzenie niestandardowej sieci Dockera

docker network create --subnet=192.168.1.0/24 test_network

- Odłaczenie aplikacji od poprzedniej sieci

docker network disconnect websockets_app-network websocket-app
docker network disconnect websockets_app-network postgres-db

- Podłączenie aplikacji do utworzonej sieci

docker network connect test_network websocket-app
docker network connect test_network postgres-db

- Uruchomienie pętli W pętli tworzysz kontenery K6, przypisując im różne adresy IP:

dockerIpsSetup.bash

- Zamykanie testów

docker ps -q --filter "ancestor=loadimpact/k6" | xargs docker rm -f

- Oczyszczenie po zakończeniu testów Po zakończeniu testów możesz usunąć kontenery i sieć:

docker network rm test_network
