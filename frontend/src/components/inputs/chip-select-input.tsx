import {useEffect, useState, useRef, SyntheticEvent} from 'react'
import {Chip, Menu, MenuItem} from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {ChipSelectInputPropTypes} from './types'


const ChipSelectInput = ({options, onChange}: ChipSelectInputPropTypes) => {
    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const [currentlySelectedMenuItem, setCurrentlySelectedMenuItem] = useState(options[0]);
    const chipEl = useRef<HTMLDivElement | null>(null);
    const openMenu = (e: any) => { 
        setMenuAnchorEl(chipEl.current);
        setMenuIsOpen(true);
    }
    const closeMenu = () => {
        setMenuIsOpen(false);
        setMenuAnchorEl(null);
    }
    return(
        <div>
            <Chip
                ref={chipEl}
                label={currentlySelectedMenuItem}
                onDelete={(e) => openMenu(e)}
                deleteIcon={<KeyboardArrowDownIcon /> }
                onClick={(e) => openMenu(e)}/>
                
            <Menu
                anchorEl={menuAnchorEl}
                open={menuIsOpen}
                onClose={(e) => closeMenu()}>
                {options.map((option) => (
                    <MenuItem
                        key={option}
                        selected={option === currentlySelectedMenuItem}
                        onClick={(e) => {
                            setCurrentlySelectedMenuItem(option);
                            closeMenu();
                            if(onChange !== undefined){
                                onChange(option);
                            }
                    }}>{option}</MenuItem>
                ))}
            </Menu>
        </div>
    );
}

export default ChipSelectInput