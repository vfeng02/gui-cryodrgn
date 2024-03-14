#!/bin/bash

# while getopts 's:p:h' opt; do
#   case "$opt" in
#     s)
#       server=${OPTARG}
#       echo "Serving data from port '${OPTARG}'"
#       ;;
#     p)
#       port=${OPTARG}
#       echo "Starting website at port '${OPTARG}'"
#       ;;
#     ?|h)
#       echo "Usage: $(basename $0) [-p website-port] [-s server-port]"
#       exit 1
#       ;;
#   esac
# done
# shift "$(($OPTIND -1))"

# echo "done"

# server=${1?missing port number for server}
# port=${2?missing port number for website}  
# server=${1?Please enter port number for server}
# port=${2?Please enter port number for website} 

server=${1}
website=${2} 
# email=${3}

# if [ $# -lt 3 ]; then
#   echo 1>&2 "$0: not enough arguments; please enter a port number for the server, a port number for the website, followed by your email, e.g., ./run.sh 3001 3002 vyfeng@della.princeton.edu"
#   exit 2
# elif [ $# -gt 3 ]; then
#   echo 1>&2 "$0: too many arguments; please enter a port number for the server, a port number for the website, followed by your email, e.g., ./run.sh 3001 3002 vyfeng@della.princeton.edu"
#   exit 2
# fi

if [ $# -lt 2 ]; then
  echo 1>&2 "$0: not enough arguments; please enter a port number for the server followed by a port number for the website, e.g., ./run.sh 3001 3002"
  exit 2
elif [ $# -gt 2 ]; then
  echo 1>&2 "$0: too many arguments; please enter a port number for the server followed by a port number for the website, e.g., ./run.sh 3001 3002"
  exit 2
fi

sed -i "s/^const serverPort.*/const serverPort=${server}/" ./frontend/vite.config.js
sed -i "s/^const websitePort.*/const websitePort=${website}/" ./frontend/vite.config.js

cd ..
python vite-drgncommands/backend/server.py $server &
cd vite-drgncommands/frontend
npx vite
cd ../../

# ssh -N -f -L localhost:${server}:localhost:${server} ${email}
# ssh -N -f -L localhost:${website}:localhost:${website} ${email}


