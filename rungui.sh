email=${1}

env=web-gui-env

website=$(get_free_port)

# update the gui port recorded in vite.config.js
sed -i "s/^const websitePort.*/const websitePort=${website}/" ./frontend/vite.config.js

module load anaconda3/2023.9
eval "$(conda shell.bash hook)"
conda activate ${env}

PURPLE='\033[1;35m'
BLUE='\e[34m'
NC='\033[0m' # No Color

cd ./frontend
echo -e "${PURPLE}ssh -N -f -L localhost:${website}:localhost:${website} ${email}${NC}"
echo -e "${BLUE}http://localhost:${website}/${NC}"
# npx vite &
npx vite > /dev/null 2>&1 &

pid=$! # get the process id of the previous command
wait $pid
kill $pid