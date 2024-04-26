email=''
root=''

while getopts 'e:d:' flag; do
  case "${flag}" in
    d) root="${OPTARG}" ;;
    e) email="${OPTARG}" ;;
    *) printf "Usage: Please enter your della or della-gpu email after the -e flag, and the directory to start the GUI after the -p flag, e.g., ./run.sh -e vyfeng@della.princeton.edu -p user/vyfeng/Home/Data \n"
       exit 1 ;;
  esac
done

env=web-gui-env

# if the user does not supply a directory, default to the parent directory of the gui
if [ ${#root} == 0 ]; then
  dir=$(pwd)
  root=$(dirname $dir)
  echo -e "No root directory provided, using parent directory \e[36m${root}\e[0m as root."
else
  echo -e "Using root directory: \e[36m${root}\e[0m"
fi

server=$(get_free_port)
website=$(get_free_port)

# update ports recorded in vite.config.js
sed -i "s/^const serverPort.*/const serverPort=${server}/" ./frontend/vite.config.js
sed -i "s/^const websitePort.*/const websitePort=${website}/" ./frontend/vite.config.js

module load anaconda3/2023.9
eval "$(conda shell.bash hook)"
conda activate ${env}

PURPLE='\033[1;35m'
GREEN='\e[32m'
CYAN='\e[36m'
BLUE='\e[34m'
GRAY='\e[37m'
NC='\033[0m' # no color

python ./backend/server.py $server $root > /dev/null 2>&1 & # execute in the background and hide output
pid_server=$! # get the pid of the previous command

echo -e "Started backend server on port: ${GRAY}${server}${NC}"

cd ./frontend

if [ ${#email} -gt 0 ]; then
  echo -e "Use this command to port forward: ${BLUE}ssh -N -f -L localhost:${website}:localhost:${website} ${email}${NC}"
fi
echo -e "Link to GUI: ${PURPLE}http://localhost:${website}/${NC}"
npx vite > /dev/null 2>&1 &
pid_website=$!

control_c() {
    kill $pid_website
    kill $pid_server
    exit
}

trap control_c SIGINT

wait $pid_website
