import React from 'react'
import {RiCloseLine} from "react-icons/ri"
import "../css/Modal.css";
import { useNavigate } from 'react-router-dom';

function Modal({setModalOpen}) {
    const naviagate=useNavigate();

  return (
    <div className="darkBg" onClick={()=>setModalOpen(false)}>
        <div className="centered">
        <div className='modal'>
        {/* modal header */}
        <div className="modalHeader">
            <h5 className='heading'>Confirm</h5>
        </div>
        <button className='closeBtn' onClick={()=>setModalOpen(false)}>
            <RiCloseLine></RiCloseLine>
        </button>
        {/* modalContent */}
        <div className="modalContent">
            Do you really want to Log Out?
        </div>
        <div className="modalActions">
            <div className="actionContainer">
                <button className='logOutBtn' onClick={()=>{
                    setModalOpen(false)
                    localStorage.clear()
                    naviagate("./signin")
                }}>Log Out</button>
                <button className='cancelBtn' onClick={()=>setModalOpen(false)}>Cancel</button>
            </div>
        </div>
    </div>
    </div>
    </div>
    
    
  )
}

export default Modal