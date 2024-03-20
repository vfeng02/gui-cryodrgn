# server=${1}
# website=${2} 

# email=${1}

# if [ $# -lt 2 ]; then
#   echo 1>&2 "$0: not enough arguments; please enter a port number for the server followed by a port number for the website, e.g., ./run.sh 3001 3002"
#   exit 2
# elif [ $# -gt 2 ]; then
#   echo 1>&2 "$0: too many arguments; please enter a port number for the server followed by a port number for the website, e.g., ./run.sh 3001 3002"
#   exit 2
# fi

env=web-gui-env

server=$(get_free_port)
website=$(get_free_port)

sed -i "s/^const serverPort.*/const serverPort=${server}/" ./frontend/vite.config.js
sed -i "s/^const websitePort.*/const websitePort=${website}/" ./frontend/vite.config.js

module load anaconda3/2023.9
eval "$(conda shell.bash hook)"
conda activate ${env}

dir=$(pwd)
parentdir=$(dirname $dir)
echo $parentdir

python ./backend/server.py $server $parentdir &
cd ./frontend
npx vite

pid_server=$(lsof -t -i :$server)
pid_website=$(lsof -t -i :$website)

kill $pid_server
kill $pid_website

# ssh -N -f -L localhost:$website:localhost:$website ${email}




