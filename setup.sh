envname=${1}

if [ $# -lt 1 ]; then
  echo 1>&2 "$0: not enough arguments; please enter a name for the gui conda environment, e.g. ./setup.sh web-gui-env"
  exit 2
elif [ $# -gt 1 ]; then
  echo 1>&2 "$0: too many arguments; please enter a name for the gui conda environment, e.g. ./setup.sh web-gui-env"
  exit 2
fi

module load anaconda3/2023.9
conda env create --name ${envname} --file=env.yml

sed -i "s/^env.*/env=${envname}/" ./run.sh # update run script with the user configured conda environment name

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash #install nvm

# Following three lines allow nvm and npm to run without first restarting the terminal
export NVM_DIR="$HOME/.nvm" 
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" 

nvm install --lts
cd frontend
npm i