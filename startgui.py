import argparse
import os
import subprocess

# env="web-gui-env"

def add_args(parser):
  parser.add_argument(
    "-d", "--rootdir", type=os.path.abspath, help="Full path to the directory in which to start the GUI, e.g., /home/vyfeng/Desktop/"
  )
  parser.add_argument(
    "-e", "--email", help="Login email for Della or Della-GPU, e.g., vyfeng@della.princeton.edu"
  )

def start_server(rootdir):
    p1 = subprocess.Popen(["bash", "runserver.sh", rootdir]) if rootdir else subprocess.Popen(["bash", "runserver.sh"])
    return p1

    # if rootdir:
    #   print(f"Using root directory: {rootdir}")
    # else:
    #   result = subprocess.run(["dirname $(pwd)"], capture_output=True, shell=True)
    #   rootdir = result.stdout.decode('utf-8').split('\n')[0]
    #   print(f"No root directory provided, using parent directory {rootdir} as root.")
    
    # process_1 = subprocess.run(["get_free_port"], capture_output=True, shell=True)
    # server_port = process_1.stdout.decode('utf-8').split('\n')[0]
    # print(f"Backend server running on port: {server_port}")
    # # update the server port recorded in vite.config.js
    # _ = subprocess.call(f"sed -i 's/^const serverPort.*/const serverPort={server_port}/' ./frontend/vite.config.js", shell=True)

    # subprocess.run(f"module load anaconda3/2023.9; source activate {env}; python ./backend/server.py {server_port} {rootdir} &", shell=True)
    # output = pr

    # p = subprocess.Popen(["bash", "runserver.sh", rootdir], shell=True) if rootdir else subprocess.Popen(["bash", "runserver.sh"])
    # try:
    #     p.wait()
    # except KeyboardInterrupt:
    #     try:
    #       p.terminate()
    #     except OSError:
    #       pass
    #     p.wait()
    # pid = process_2.stdout.decode('utf-8').split('\n')[0]
    # print(pid)
    # if process_2.returncode == 0:
    #    print("Successfully started server \n")
    # else:
    #    print(f"Server failed with return code {process_2.returncode} and error {output} \n")

def start_website(email):
    p2 = subprocess.Popen(["bash", "rungui.sh", email], shell=True) if email else subprocess.Popen(["bash", "rungui.sh"])
    return p2
    # output = process.stdout.decode('utf-8').split('\n')
    # if email:
    #   print(f"Port forwarding command: {output[0]}")
    # print(f"Link to GUI: {output[1]}")

    # if process.returncode == 0:
    #    print("Successfully started GUI \n")
    # else:
    #    print(f"Server failed with return code {process.returncode} and error {process.stdout} \n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    add_args(parser)
    args = parser.parse_args() 
    # start_server(args.rootdir)
    # start_website(args.email)
    # try:
    #   p1 = start_server(args.rootdir)
    #   p2 = start_website(args.email)
    # except KeyboardInterrupt:
    #   p1.terminate()
    #   p2.terminate()
    p = subprocess.Popen(["bash", "exe.sh"])
    try:
        p.wait()
    except KeyboardInterrupt:
        try:
          p.terminate()
        except OSError:
          pass
        p.wait()

  