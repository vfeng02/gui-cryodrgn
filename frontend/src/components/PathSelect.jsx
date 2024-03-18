import React, { useEffect, useState } from 'react';
import '../App.css';
import './PathSelect.css';
import { Modal, CircularProgress, InputAdornment, IconButton, Button } from '@mui/material';
import {TreeView, TreeItem } from '@mui/x-tree-view'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ClearIcon from '@mui/icons-material/Clear';
import CustomTextField from './CustomTextField';

const PathSelect = ({ command_name, arg_name, details, required, values, setValues }) => {
    const [dir, setDir] = useState("");
    const [selected, setSelected] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [expanded, setExpanded] = useState([]);

    const handleOpenModal = () => setOpenModal(true);
    const updateValue = (newValue) => setValues({
      ...values,
      [command_name]: {
          ...values[command_name],
          [arg_name]: newValue
      },
    });

    const handleCloseModal = () => {
      updateValue(selected);
      setOpenModal(false);
    };

    const handleClearPath = (e) => {
      const newValues = values[command_name]
      delete newValues[arg_name]
      setValues({
        ...values,
        newValues,
      });
      e.stopPropagation();
    }

    const handleConfirm = (e) => {
      e.preventDefault();
      setOpenModal(false);
    }

    useEffect(() => {
        getFiles();
    },[expanded]);

    async function getFiles() {
        const resp = await fetch("/files", {
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
            <TreeItem className="loading" id={"node-" + node.id} key={node.id} nodeId={node.path} label={node.name}><CircularProgress/></TreeItem>
          )
        }
        // render expanded directory
        return (
          <TreeItem id={"node-" + node.id} key={node.id} nodeId={node.path} label={node.name}>
              {node.children.map((n) => renderTree(n))}
              {/* <CircularProgress size={20} /> test loading icon */}
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
            label={details.flags ? details.flags.join(',') : arg_name}
            help={details.help}
            type="text"
            id={arg_name+"-path"}
            name={arg_name}
            value={values[command_name] ? (values[command_name][arg_name] ?? "") : ""}
            required={required}
            placeholder='Click arrow to select path'
            multiline={true}
            maxRows={3}
            inputProps={{
              startAdornment: <InputAdornment position="start" className="upload-icon">
                <IconButton
                  onClick={handleOpenModal}
                  >
                  <FileUploadIcon/>
                </IconButton>
            </InputAdornment>,
              endAdornment: <InputAdornment position="end" className="clear-icon">
                <IconButton
                  onClick={(e) => handleClearPath(e)}
                  >
                  {values[command_name] ? (values[command_name][arg_name] ? <ClearIcon/> : null) : null}
                </IconButton>
            </InputAdornment>
            }}
            onChange={(e) => updateValue(e.target.value)}
            />
        </div>
        <div>
            <Modal
            className='modal'
                open={openModal}
                onClose={handleCloseModal}
            >
                <div className='tree-view-outer'>
                  <div className='close-modal'>
                    <IconButton onClick={handleCloseModal}>
                      <ClearIcon/>
                    </IconButton>
                  </div>
                  <div className='tree-view'>
                      <TreeView
                      defaultCollapseIcon={<ExpandMoreIcon />}
                      defaultExpandIcon={<ChevronRightIcon />}
                      onNodeToggle={(e, nodeIds) => setExpanded(nodeIds)}
                      onNodeSelect={(e, nodeId) => setSelected(nodeId)}
                      >
                      {renderTree(dir)}
                      </TreeView>
                  </div>
                  <div className='confirm-selected'>
                    {(selected.length > 0) ? <Button className="secondary-button" onClick={handleCloseModal}>Confirm</Button> : undefined}
                  </div>
                </div>
            </Modal>
        </div>
        </div>
    );
}
 
export default PathSelect;