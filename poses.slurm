#!/bin/bash
#SBATCH --job-name=poses
#SBATCH --ntasks=1
#SBATCH --cpus-per-task=1
#SBATCH --mem-per-cpu=4G
#SBATCH --gres=gpu:1
#SBATCH --time=00:10:00
#SBATCH --nodes=1
module purge 
module load anaconda3/2023.9
conda activate cryodrgn
 
cryodrgn parse_pose_csparc /scratch/network/vyfeng/cryodrgn/vite-drgncommands/.empty -D 320 -o poses.pkl 