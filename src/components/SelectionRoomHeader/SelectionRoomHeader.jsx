import {react} from 'react'
import "./SelectionRoomHeader.css"
import { IoMdExit } from "react-icons/io";
import { LuAlignJustify } from "react-icons/lu";
import SelectionRoomSideBar from '../SelectionRoomSideBar/SelectionRoomSideBar';

function SelectionRoomHeader({onToggleSidebar, currentView}) {


    return(
        <div className='header_selection_room'>
            <button className='icon_exit' style={{marginLeft: '10px'}} onClick={onToggleSidebar}>
                <LuAlignJustify size={40} color="#ffffffff"/>                 
            </button>
            
            {currentView === 'houses' && (
                <h1>Sala de cômodos</h1>
            )}
            
            <a href="/">
                <button className='icon_exit'>
                    <IoMdExit size={40} color="#ffffffff"/>
                </button>
            </a>
        </div>
    )
}

export default SelectionRoomHeader;