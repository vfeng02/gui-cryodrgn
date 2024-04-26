import sys
import os
import importlib
import argparse
import json

def get_arg_details(module):
    parser = argparse.ArgumentParser()
    if module.__name__ == "direct_traversal": 
        parser = module.parse_args()
    else:
        module.add_args(parser)
    info={}
    args = {}

    if module.__doc__ is not None:
        desc = module.__doc__.split('\n')
        if len(desc) > 1:
            info["desc"] = desc[1]
        else:
            info["desc"] = desc[0]
    else:
        info["desc"] = ""

    for arg_group in parser._action_groups:
        arg_group_title = arg_group.title.lower()
        if arg_group_title == "options": 
            arg_group_title = "additional arguments"
        elif arg_group_title == "positional arguments":
            arg_group_title = "required arguments"
        
        args[arg_group_title] = {}
        for arg in arg_group._group_actions:
            details = {}

            if arg.dest == "help":
                continue

            if arg.choices is not None:
                details["choices"] = arg.choices
            if arg.const is not None:
                details["const"] = arg.const
            if arg.default is not None:
                details["default"] = arg.default
            if arg.help is not None:
                details["help"] = arg.help
            if arg.metavar is not None:
                details["metavar"] = arg.metavar
            if arg.nargs is not None:
                details["nargs"] = arg.nargs
            if arg.type is not None:
                details["type"] = arg.type.__name__
            
            if len(arg.option_strings) > 0:
                details["flags"] = arg.option_strings
            
            if arg.required: 
              args["required arguments"][arg.dest] = details
            else: 
              args[arg_group_title][arg.dest] = details
        if len(args[arg_group_title]) == 0:
            del args[arg_group_title]
    
    info["args"] = args
    return info

def extract_args(cryodrgn_path):
    sys.path.append(cryodrgn_path)

    commands_path = cryodrgn_path + '/cryodrgn/commands'
    commands_utils_path = cryodrgn_path + '/cryodrgn/commands_utils'
    utils_path = cryodrgn_path + '/utils'

    all_commands = {}

    preprocess = ["parse_pose_star", "parse_pose_csparc", "parse_ctf_star", "parse_ctf_csparc", "downsample", "preprocess"]
    training = ["train_vae", "train_nn"]
    analysis = ["analyze", "pc_traversal", "direct_traversal", "graph_traversal", "analyze_landscape", "analyze_landscape_full"]
    abinit = ["abinit_homo", "abinit_het"]
    misc = ["eval_images", "view_config", "eval_vol", "backproject_voxel"]
    utils = [f[:-3] for f in os.listdir(commands_utils_path) if (f != '__init__.py' and f != '__pycache__')] + ["analyze_convergence"]

    commands_groups = {"Preprocess Inputs": preprocess, "CryoDRGN Training": training, "CryoDRGN Analysis": analysis, "CryoDRGN2 Ab Initio Reconstruction": abinit, "Misc": misc, "Utils": utils}
    # commands_groups = {"Preprocess Inputs": ["downsample"]}

    for path in [commands_path, commands_utils_path, utils_path]:
        sys.path.append(path)
    
    for group_name, modules in commands_groups.items():
        all_commands[group_name] = {}
        for command in modules:
          globals()[command] = importlib.import_module(command)
          info = get_arg_details(globals()[command])
          all_commands[group_name][command] = info
            
    with open('../data/commands.json', 'w', encoding='utf-8') as f:
            json.dump(all_commands, f, ensure_ascii=False, indent=4)

# example usage: python extract.py '/scratch/gpfs/vyfeng/cryodrgn'
if __name__ == "__main__":
    parser = argparse.ArgumentParser(
                    prog='extract',
                    description='extract the arguments when given a path to cryoDRGN')
    parser.add_argument('cryodrgn', type=str, help='the path to the cryoDRGN repository') 
    args = parser.parse_args()
    extract_args(args.cryodrgn)