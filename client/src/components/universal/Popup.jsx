import React, { useState } from 'react';
import './Popup.scss'

const Popup = (props) => {
    const [notas_v, setNotas_V] = useState('')
    const handleNotas_VChange = (event) => {
        // console.log(event.target.value)
        setNotas_V(event.target.value)
    }
    
    const handleAccept = () => {
        if (props.type == 0) {
            props.fun(props.id)
        } else if (props.type == 1) {
            props.fun(1, props.id, notas_v)
        }
        props.setTrigger({trigger:false, type: -1})
    }

    if (props.type == 0) {
        return (props.trigger) ? (
            <div className='popup_container'>
                <div className='popup_inner'>
                    <button className='cancel-btn' onClick={() => props.setTrigger({trigger: false, type: -1})}>Cancelar</button>
                    <button className='accept-btn' onClick={handleAccept}>Aceptar</button>
                    {props.children}
                </div>
            </div>
        ) : ""
    } else if (props.type == 1) {
        console.log(props.id)
        return (props.trigger) ? (
            <div className='popup_container'>
                <div className='popup_inner'>
                    <div className="notas_container" onChange={handleNotas_VChange}>
                        <textarea className="form-control  user_input_notas" id="exampleFormControlTextarea1" rows="3" placeholder="Razón de Veto: " value={notas_v}></textarea>
                    </div>
                    <button className='cancel-btn' onClick={() => props.setTrigger({trigger: false, type: -1})}>Cancelar</button>
                    <button className='accept-btn' onClick={handleAccept}>Vetar</button>
                    {props.children}
                </div>
            </div>
        ) : ""
    }
}

export default Popup