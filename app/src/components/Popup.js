/**
 * Custom component for displaying a popup.
 *
 * @author Cristian Mitoi
 */



import React from 'react'
import CloseButton from 'react-bootstrap/CloseButton';
import './Popup.css'

function Popup(props) {
    return (props.trigger) ? (
        <div className='popup'>
            <div className='popup-inner'>  
                <CloseButton  className='close-btn' onClick={() => props.setTrigger(false)} />
                {props.children}
            </div>

        </div>
    ) : "";
}

export default Popup
