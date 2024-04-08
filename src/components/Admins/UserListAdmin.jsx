import React, { useState } from 'react'; 
import { Form } from 'react-bootstrap'; 
import "./UserListAdmin.css"
import 'bootstrap/dist/css/bootstrap.min.css';

const UserListAdmin = () => {
  const [select_Filters, set_Select_Filters] = useState([]); 
  const [isOpen, setIsOpen] = useState(false); 
  const courses = [
    { id: 1, label: 'Hombres' }, 
    { id: 2, label: 'Mujeres' }, 
    { id: 3, label: 'Huéspedes' }, 
    { id: 4, label: 'Entradas Únicas' }, 
    { id: 5, label: 'Vetados' },
    { id: 6, label: 'Deudores' } 
  ]; 
  const dropDownShow = () => {
    setIsOpen(!isOpen); 
  }; 
  const filterChange = (event) => {
    const filterId = parseInt(event.target.value); 
    const choosen = event.target.checked; 
  
    if (choosen) { 
      set_Select_Filters([...select_Filters, filterId]); 
    } else { 
      set_Select_Filters(select_Filters.filter((id) => id !== filterId)); 
    } 
  };
  return (
    <div className='App-minheight'>
      <h1>Administración de Usuarios</h1>

      <div className="d-flex"> 
                <div className="custom-dropdown"> 
                    <button 
                        className= 
                            "custom-dropdown-toggle"
                        type="button"
                        id="multiSelectDropdown"
                        onClick={dropDownShow} 
                    > 
                        Filtros
                    </button> 
                    {isOpen && ( 
                        <div className= 
                                {`custom-dropdown-menu  
                                    ${isOpen ? 'show' : ''}`}  
                                aria-labelledby="multiSelectDropdown"> 
                            {courses.map((option) => ( 
                                <Form.Check 
                                    className="custom-checkbox"
                                    key={option.id} 
                                    type="checkbox"
                                    id={`option_${option.id}`} 
                                    label={option.label} 
                                    checked= 
                                        {select_Filters.includes(option.id)} 
                                    onChange={filterChange} 
                                    value={option.id} 
                                /> 
                            ))} 
                        </div> 
                    )} 
                </div> 
                <div style={{ marginLeft: '20px', width: '50%' }}> 
                    <h2>Selected Items:</h2> 
                    <ul> 
                        {select_Filters.map((optionId) => ( 
                            <li key={optionId}> 
                                {courses.find(option =>  
                                    option.id === optionId)?.label} 
                            </li> 
                        ))} 
                    </ul> 
                </div> 
            </div>
            
    </div>
  )
}

export default UserListAdmin