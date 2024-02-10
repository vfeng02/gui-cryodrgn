# Import flask and datetime module for showing date and time
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import subprocess
import os
import json
 
# Initializing flask app
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# get all files in a directory
def list_files(dir_path, expanded, node_id):
    d = {'name': os.path.basename(dir_path)}
    d['path'] = dir_path
    d['id'] = str(node_id)
    node_id += 1
    d['children'] = []

    # get the paths of all the children of this dir
    contents = next(os.walk(dir_path))
    for x in contents[1]:
        child = {'path': os.path.join(dir_path,x)}
        if child['path'] in expanded: 
            child = list_files(child['path'], expanded, node_id)
        else: 
          child['name'] = x
          child['id'] = str(node_id)
          node_id += 1
          child['children'] = []
        
        d['children'].append(child)

    for x in contents[2]:
        child = {'name': x}
        child['path'] = os.path.join(dir_path,x)
        child['id'] = str(node_id)
        node_id += 1
        d['children'].append(child)

    return d

# def list_files(dir_path):
#     d = {'title': os.path.basename(dir_path)}
#     d['key'] = dir_path
#     d['children'] = []

#     # get the paths of all the children of this dir
#     contents = next(os.walk(dir_path))
#     for x in contents[1]:
#         child = {'title': x}
#         child['key'] = os.path.join(dir_path,x)
#         child['children'] = []
#         d['children'].append(child)

#     for x in contents[2]:
#         child = {'title': x}
#         child['key'] = os.path.join(dir_path,x)
#         d['children'].append(child)

#     return jsonify(d)

@app.route('/run', methods=['POST'])
@cross_origin()
def save_and_run_script():
    command=request.json['command']
    path = request.json['path']
    content = request.json['content']

    # if not os.path.exists(path): os.path.join(path)
    #     os.makedirs(path)

    with open(path, 'w') as run_script:
        run_script.write(content) # to write multiple lines, need to use writeLines
    
    process_1 = subprocess.run([command, path], capture_output=True)
    
    return jsonify(process_1.stdout.decode('utf-8'))

@app.route('/files', methods=['POST'])
@cross_origin()
def get_files():
    expanded=set(request.json['expanded']) # passed in as a list of paths
    return jsonify(list_files(os.getcwd(), expanded, 0))

@app.route('/envs', methods=['POST'])
@cross_origin()
def get_envs():
    process_1 = subprocess.run("module load anaconda3/2023.9; conda env list", capture_output=True, shell=True)
    output = process_1.stdout.decode('utf-8').split('\n')
    envs_list = []
    for line in output[2:]: 
        if len(line) > 0:
          envs_list.append(line.split(None, 1)[0])
    return jsonify(envs_list)
     
# Running app
if __name__ == '__main__':
    app.run(debug=True, port=3002)
   