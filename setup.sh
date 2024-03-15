envname=${1}

if [ $# -lt 2 ]; then
  echo 1>&2 "$0: not enough arguments; please enter a port number for the server followed by a port number for the website, e.g., ./run.sh 3001 3002"
  exit 2
elif [ $# -gt 2 ]; then
  echo 1>&2 "$0: too many arguments; please enter a port number for the server followed by a port number for the website, e.g., ./run.sh 3001 3002"
  exit 2
fi

conda env create --name envname --file=env.yml
conda activate envname
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash #install nvm
nvm install --lts
cd frontend
npm i