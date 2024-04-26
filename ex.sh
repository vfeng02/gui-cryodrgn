root=${1}
email=${2}

env=web-gui-env

# if the user does not supply a directory, default to the parent directory of the gui
if [ ${#root} == 0 ]; then
  dir=$(pwd)
  root=$(dirname $dir)
  echo "No root directory provided, using parent directory ${root} as root."
else
  echo "Using root directory: ${root}"
fi

server=$(get_free_port)
website=$(get_free_port)

echo "Starting backend server on port: ${server}"

# update ports recorded in vite.config.js
sed -i "s/^const serverPort.*/const serverPort=${server}/" ./frontend/vite.config.js
sed -i "s/^const websitePort.*/const websitePort=${website}/" ./frontend/vite.config.js

module load anaconda3/2023.9
eval "$(conda shell.bash hook)"
conda activate ${env}

PURPLE='\033[1;35m'
BLUE='\e[34m'
NC='\033[0m' # no Color

python ./backend/server.py $server $root > /dev/null 2>&1 & # execute in the background and hide output
pid_server=$! # get the pid of the previous command

cd ./frontend
echo -e "${PURPLE}ssh -N -f -L localhost:${website}:localhost:${website} ${email}${NC}"
echo -e "${BLUE}http://localhost:${website}/${NC}"
npx vite > /dev/null 2>&1 &
pid_website=$!

control_c() {
    kill $pid_website
    kill $pid_server
    exit
}

trap control_c SIGINT

wait $pid_website
