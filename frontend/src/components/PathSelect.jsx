import React, { useEffect, useState } from 'react';
import '../App.css';
import './PathSelect.css';
import { Modal, CircularProgress } from '@mui/material';
// import { TreeView } from "mui-lazy-tree-view";
import {TreeView, TreeItem } from '@mui/x-tree-view'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CustomTextField from './CustomTextField';

const PathSelect = ({ name, details, required, values, setValues }) => {
    const [dir, setDir] = useState("");
    const [selected, setSelected] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [expanded, setExpanded] = useState([]);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => {
        setValues({
            ...values,
            [name]: selected,
        });
        setOpenModal(false);
    };

    useEffect(() => {
        getFiles();
    },[expanded]);

    async function getFiles() {
        const resp = await fetch("http://localhost:3002/files", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"expanded": expanded})
        });
        if (!resp.ok) {
            console.log("Error in getting files");
        }
    
        const data = await resp.json();
        setDir(data);
    }

    const renderTree = (node) => {
      if (Array.isArray(node.children)) {
        if (node.children.length === 0) { //directory not expanded
          return (
            <TreeItem id={"node-" + node.id} key={node.id} nodeId={node.path} label={node.name}><CircularProgress/></TreeItem>
          )
        }
        // render expanded directory
        return (
          <TreeItem id={"node-" + node.id} key={node.id} nodeId={node.path} label={node.name}>
              {node.children.map((n) => renderTree(n))}
          </TreeItem>
      )
      }
      // render file 
      return (
        <TreeItem id={"node-" + node.id} key={node.id} nodeId={node.path} label={node.name}/>
      )
    }

    return (
        <div>
        <div className='path-select'>
            <CustomTextField
            help={details.help}
            type="text"
            id={name+"-path"}
            name={name}
            value={name in values ? values[name] : ""}
            required={required}
            placeholder='Click to select path'
            readOnly
            onClick={handleOpenModal}
            />
        </div>
        <div className='modal'>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
            >
                <div className='tree-view-outer'>
                    <div className='tree-view'>
                        <TreeView
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpandIcon={<ChevronRightIcon />}
                        onNodeToggle={(e, nodeIds) => setExpanded(nodeIds)}
                        onNodeSelect={(e, nodeId) => setSelected(nodeId)}
                        >
                        {renderTree(dir)}
                        </TreeView>
                        {/* <TreeView
                          expanded={expanded}
                          onNodeToggle={(e, nodeIds) => setExpanded(nodeIds)}
                          treeData={dir}
                          selected={selected}
                          onNodeSelect={(e, nodeId) => setSelected(nodeId)}
                          titleRender={(node) => {
                              return <>{node.title}</>;
                          }}
                          lazyLoadFn={getFiles}
                      /> */}
                    </div>
                </div>
            </Modal>
        </div>
        </div>
    );
}
 
export default PathSelect;