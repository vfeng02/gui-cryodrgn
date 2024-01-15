# Import flask and datetime module for showing date and time
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import subprocess
import os
 
# Initializing flask app
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
 
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

@app.route('/data')
@cross_origin()
def get_time():
 
    # Returning an api for showing in  reactjs
    return {
        'Name':"geek", 
        "Age":"22",
        "programming":"python"
        }
     
# Running app
if __name__ == '__main__':
    app.run(debug=True, port=3000)