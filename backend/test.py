import json
import os

node_id = 0

def list_files(path):
    global node_id
    d = {'name': os.path.basename(path)}
    d['id'] = node_id
    node_id += 1
    if os.path.isdir(path):
        d['type'] = "directory"
        d['children'] = [list_files(os.path.join(path,x)) for x in os.listdir(path)]
    else:
        d['type'] = "file"
    return d

if __name__=='__main__':
    dir_json = list_files('/Users/vickyfeng/Desktop/Thesis/vite-drgncommands/frontend')
    dir_json['id'] = 'root'
    with open('test_output.json', 'w') as f:
        f.write(json.dumps(dir_json, indent=2))
    # print(json.dumps(dir_json))