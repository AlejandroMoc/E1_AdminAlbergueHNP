// React
import {useState } from 'react';

// Components
import {useAuth } from '../../auth/AuthProvider';

// CSS
import './Popup.scss'

const Popup = (props) => {
    const id_u = useAuth().getUser().id_usuario

    const [notas_v, setNotas_V] = useState('')
    const handleNotas_VChange = (event) => {
        setNotas_V(event.target.value)
    }
    
    const handleAccept = () => {
        if (props.type == 0) {
            props.fun(props.id)
        } else if (props.type == 1) {
            props.fun(id_u, props.id, notas_v)
        } else if (props.type == 2) {
            props.fun(notas_v)
        }
        props.setTrigger({trigger:false, type: -1})
    }

    if (props.type == 0) {
        return (props.trigger) ? (
            <div className='popup_container'>
                <div className='popup_inner'>
                    {props.children}
                    <div className="popup_spacing">
                        <button className='cancel-btn' onClick={() => props.setTrigger({trigger: false, type: -1})}>Cancelar</button>
                        <button className='accept-btn' onClick={handleAccept}>Aceptar</button>
                    </div>
                </div>
            </div>
        ) : ""
    } else if (props.type == 1) {
        return (props.trigger) ? (
            <div className='popup_container'>
                <div className='popup_inner'>
                    {props.children}
                    <div className="notas_container" onChange={handleNotas_VChange}>
                        <textarea className="form-control  user_input_notas" id="exampleFormControlTextarea1" rows="3" placeholder="Razón de Veto: " value={notas_v}></textarea>
                    </div>
                    <div className="popup_spacing">
                        <button className='cancel-btn' onClick={() => props.setTrigger({trigger: false, type: -1})}>Cancelar</button>
                        <button className='accept-btn' onClick={handleAccept}>Vetar</button>
                    </div>
                </div>
            </div>
        ) : ""
    } else if (props.type == 2) {
        return (props.trigger) ? (
            <div className='popup_container'>
                <div className='popup_inner'>
                    {props.children}
                    <div className="popup_spacing">
                        <button className='cancel-btn' onClick={() => props.setTrigger({trigger: false, type: -1})}>Cancelar</button>
                        <button className='accept-btn' onClick={handleAccept}>Aceptar</button>
                    </div>
                </div>
            </div>
        ) : ""
    }
}

export default Popup
