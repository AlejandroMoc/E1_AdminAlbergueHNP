import React, { useState } from 'react';
import ReactTable from "react-table";
// import "react-table/react-table.css"; 
import { Form } from 'react-bootstrap'; 
import "./UserListAdmin.css"
import 'bootstrap/dist/css/bootstrap.min.css';

const UserListAdmin = () => {
  const [select_Filters, set_Select_Filters] = useState([]); 
  const [isOpen, setIsOpen] = useState(false); 
  const filters = [
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
                            {filters.map((option) => ( 
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
                                {filters.find(option =>  
                                    option.id === optionId)?.label} 
                            </li> 
                        ))} 
                    </ul> 
                </div> 
            </div>
      
        {/* <ReactTable data={[{"noCama": "1", "nombre": "César", "fechaIngreso": "1/1/1", "paciente": "Odin", "noCarnet": "11111", "nSocioE": "0"}]} columns={[
          {
            Header: "No. Cama",
            accessor: "noCama"
          },
          {
            Header: "Nombre",
            accessor: "nombre"
          },
          {
            Header: "Fecha de Ingreso",
            accessor: "fechaIngreso"
          },
          {
            Header: "Paciente",
            accessor: "paciente"
          },
          {
            Header: "No. Carnet",
            accessor: "noCarnet"
          },
          {
            Header: "N. Socio-económico",
            accessor: "nSocioE"
          }
        ]}
        /> */}
    </div>
  )
}

export default UserListAdmin