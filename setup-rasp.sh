sudo apt-get -y update 

for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do sudo apt-get remove $pkg; done

sudo apt-get -y install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get -y update
sudo systemctl enable docker
sudo apt-get -y install  docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo curl -o docker-compose.yaml https://raw.githubusercontent.com/zouzarf/alia-all/refs/heads/main/docker-compose.yaml

echo "RASP_IP=192.168.1.167" > .env
sudo docker compose --profile rasp up -d