import argparse
import os
import subprocess

def add_args(parser):
  parser.add_argument(
    "-d", "--dir", type=os.path.abspath, help="Full path to the directory in which to start the GUI, e.g., /home/vyfeng/Desktop/"
  )
  parser.add_argument(
    "-e", "--email", help="Login email for Della or Della-GPU, e.g., vyfeng@della.princeton.edu"
  )

def main(args):
    cmd = ["bash", "run.sh"]
    if args.dir:
       cmd.append("-d " + args.dir)
    if args.email:
       cmd.append("-e " + args.email)

    p = subprocess.Popen(cmd)
    try:
        p.wait()
    except KeyboardInterrupt:
        try:
          p.terminate()
        except OSError:
          pass
        p.wait()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    add_args(parser)
    main(parser.parse_args())

    # parser = argparse.ArgumentParser(description="Start the web GUI for cryoDRGN")
    # add_args(parser)
    # args = parser.parse_args() 
    # cmd = ["bash", "run.sh"]
    # if args.dir:
    #    cmd.append("-d " + args.dir)
    # if args.email:
    #    cmd.append("-e " + args.email)

    # p = subprocess.Popen(cmd)
    # try:
    #     p.wait()
    # except KeyboardInterrupt:
    #     try:
    #       p.terminate()
    #     except OSError:
    #       pass
    #     p.wait()

  