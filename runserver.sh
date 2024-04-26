root=${1}
# if the user does not supply a directory, default to the parent directory of the gui
if [ ${#root} == 0 ]; then
  dir=$(pwd)
  root=$(dirname $dir)
  echo "No root directory provided, using parent directory ${root} as root."
else
  echo "Using root directory: ${root}"
fi
env=web-gui-env

server=$(get_free_port)

echo "Starting backend server on port: ${server}"

# update the server port recorded in vite.config.js
sed -i "s/^const serverPort.*/const serverPort=${server}/" ./frontend/vite.config.js

module load anaconda3/2023.9
eval "$(conda shell.bash hook)"
conda activate ${env}

python ./backend/server.py $server $root > /dev/null 2>&1 &

pid=$! # get the pid of the previous command
wait $pid
kill $pid




