import React, { useEffect, useState } from 'react';
import '../App.css';
import './PathSelect.css';
import { Modal } from '@mui/material';
import { TreeView, TreeItem } from '@mui/x-tree-view';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CustomTextField from './CustomTextField';

const PathSelect = ({ name, details, required, values, setValues }) => {
    const [dirs, setDirs] = useState("");
    const [selected, setSelected] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => {
        setValues({
            ...values,
            [name]: selected,
        });
        setOpenModal(false);
    };

    async function getDirs() {
        const resp = await fetch("http://localhost:3001/dirs", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (!resp.ok) {
            console.log("Error in getting directories");
        }
    
        const data = await resp.json();
        setDirs(data);
    }
    
    useEffect(() => {
        getDirs();
    },[]);

    const renderTree = (nodes) => (
        <TreeItem key={nodes.id} nodeId={nodes.path} label={nodes.name}>
            {Array.isArray(nodes.children)
            ? nodes.children.map((node) => renderTree(node))
            : null}
        </TreeItem>
    );

    return (
        <div>
        <div className='path-select'>
            {/* <input
            data-toggle="tooltip" 
            data-placement="top" 
            title={details.help}
            type="text"
            id={name+"_file"}
            name={name}
            // key={name}
            value={name in values ? values[name] : ""}
            required={required}
            placeholder='Click to select path'
            readOnly
            onClick={handleOpenModal}
            /> */}
            <CustomTextField
            label={name}
            helperText={details.help}
            type="text"
            id={name+"_file"}
            name={name}
            // key={name}
            size="small"
            margin="normal"
            value={name in values ? values[name] : ""}
            required={required}
            placeholder='Click to select path'
            readOnly
            onClick={handleOpenModal}
            fullWidth
            InputLabelProps={{ 
              shrink: true,
              style: { color: '#486AA8' },
            }}
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
                        defaultExpanded={['root']}
                        defaultExpandIcon={<ChevronRightIcon />}
                        onNodeSelect={(e, nodeId) => {
                            console.log(e.target);
                            setSelected(nodeId);
                        }}
                        >
                        {renderTree(dirs)}
                        </TreeView>
                    </div>
                </div>
            </Modal>
        </div>
        </div>
    );
}
 
export default PathSelect;