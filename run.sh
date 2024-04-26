email=''
root=''

while getopts 'e:p:' flag; do
  case "${flag}" in
    e) email="${OPTARG}" ;;
    p) root="${OPTARG}" ;;
    *) printf "Usage: Please enter your della or della-gpu email after the -e flag, and the directory to start the GUI after the -p flag, e.g., ./run.sh -e vyfeng@della.princeton.edu -p user/vyfeng/Home/Data \n"
       exit 1 ;;
  esac
done

if [ $# -gt 4 ]; then
  echo 1>&2 "$0: too many arguments; please enter your della or della-gpu email after the -e flag, and the directory to start the GUI after the -p flag, e.g., ./run.sh -e vyfeng@della.princeton.edu -p user/vyfeng/Home/Data \n"
  exit 2
fi

if ${#root} == 0; then
  dir=$(pwd)
  root=$(dirname $dir)
  echo 1>&2 "No directory provided, defaulting to parent directory of GUI \n"

env=web-gui-env

server=$(get_free_port)
website=$(get_free_port)

sed -i "s/^const serverPort.*/const serverPort=${server}/" ./frontend/vite.config.js
sed -i "s/^const websitePort.*/const websitePort=${website}/" ./frontend/vite.config.js

module load anaconda3/2023.9
eval "$(conda shell.bash hook)"
conda activate ${env}

# dir=$(pwd)
# parentdir=$(dirname $dir)
COLOR='\033[1;35m'
NC='\033[0m' # No Color

# python ./backend/server.py $server $parentdir &
python ./backend/server.py $server $root &
cd ./frontend
echo -e "${COLOR}ssh -N -f -L localhost:${website}:localhost:${website} ${email}@della.princeton.edu${NC}"
npx vite --host

pid_server=$(lsof -t -i :$server)
pid_website=$(lsof -t -i :$website)

kill $pid_server
kill $pid_website




