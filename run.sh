server=${1}
website=${2} 
env=web-env
# email=${3}

if [ $# -lt 2 ]; then
  echo 1>&2 "$0: not enough arguments; please enter a port number for the server followed by a port number for the website, e.g., ./run.sh 3001 3002"
  exit 2
elif [ $# -gt 2 ]; then
  echo 1>&2 "$0: too many arguments; please enter a port number for the server followed by a port number for the website, e.g., ./run.sh 3001 3002"
  exit 2
fi

sed -i "s/^const serverPort.*/const serverPort=${server}/" ./frontend/vite.config.js
sed -i "s/^const websitePort.*/const websitePort=${website}/" ./frontend/vite.config.js

module load anaconda3/2023.9
eval "$(conda shell.bash hook)"
conda activate web-env
cd ..
python vite-drgncommands/backend/server.py $server &
cd vite-drgncommands/frontend
npx vite
cd ../../

# ssh -N -f -L localhost:${server}:localhost:${server} ${email}
# ssh -N -f -L localhost:${website}:localhost:${website} ${email}


