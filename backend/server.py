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
node_id = 0

def list_files(path):
    global node_id
    d = {'name': os.path.basename(path)}
    d['path'] = path
    d['id'] = str(node_id)
    node_id += 1
    if os.path.isdir(path):
        d['children'] = [list_files(os.path.join(path,x)) for x in os.listdir(path)]
        d['children'].sort(key= lambda x: x['name'])
    return d 
 
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
    
    # resp = Flask.response("Done")
    # resp.headers['Access-Control-Allow-Origin'] = '*'
    # resp.headers.add("Access-Control-Allow-Origin", "*")
    return jsonify(process_1.stdout.decode('utf-8'))

@app.route('/dirs', methods=['POST'])
@cross_origin()
def get_dirs():
    f = open('dirs.json')
    dirs = json.load(f)
    f.close()
    return dirs
     
# Running app
if __name__ == '__main__':
    # process the server side file structure and save to json
    dir_json = list_files('/Users/vickyfeng/Desktop/Thesis/vite-drgncommands/frontend')
    dir_json['id'] = 'root'
    with open('dirs.json', 'w') as f:
        f.write(json.dumps(dir_json, indent=2, sort_keys=True))

    app.run(debug=True, port=3000)
   