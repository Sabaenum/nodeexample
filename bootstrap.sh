#filename: Vagrantfile.provision.sh
#!/usr/bin/env bash

###########################################
# by Ricardo Canelas                      #
# https://gist.github.com/ricardocanelas  #
#-----------------------------------------#
# + Apache                                #
# + PHP 5.6                               #
# + MySQL 5.6 or MariaDB 10.1             #
# + NodeJs, Git, Composer, etc...         #
###########################################



# basic server setup:
#
#   * mongodb
#   * git
#   * node
#   * build-essential
#   * pm2
#   * zsh
#
##

# import mongo GPG key
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10

# create a file list for mongo
echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list

# update the packages list
sudo apt-get update

# install mongodb
sudo apt-get install -y mongodb-org

# install git
sudo apt-get install git

# setup node 4.x
curl --silent --location https://deb.nodesource.com/setup_4.x | sudo bash -

# install node
sudo apt-get install --yes nodejs

# install build tools for node addons
apt-get install --yes build-essential

# install pm2 globally
npm install -g pm2

# install zsh
apt-get install zsh

# install oh-my-zsh
wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | zsh

# use zsh as default shell
chsh -s `which zsh`





# ---------------------------------------------------------------------------------------------------------------------
# Variables & Functions
# ---------------------------------------------------------------------------------------------------------------------
echoTitle () {
    echo -e "\033[0;30m\033[42m -- $1 -- \033[0m"
}



# ---------------------------------------------------------------------------------------------------------------------
echoTitle 'Virtual Machine Setup'
# ---------------------------------------------------------------------------------------------------------------------
# Update packages
apt-get update -qq
apt-get -y install git curl vim



echoTitle "Your machine has been provisioned"
echo "-------------------------------------------"
echo "MySQL is available on port 3306 with username 'root' and password 'password'"
echo "(you have to use 127.0.0.1 as opposed to 'localhost')"
echo "Apache is available on port 80"
echo -e "Head over to http://192.168.33.77 to get started"