import React, { useState } from 'react';
import { Form } from 'react-bootstrap'; 
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';
import DatePicker from 'react-datepicker'; // Importar react-datepicker
import 'react-datepicker/dist/react-datepicker.css'; // Estilos de react-datepicker
import "./UserListAdmin.scss"
import 'bootstrap/dist/css/bootstrap.min.css';

//FALTA:
  //GUARDAR EN DEUDA1 Y DEUDA2

const UserListAdmin = () => {
  //Estado para almacenar las fechas
  const [fecha1, setFecha1] = useState(null);
  const [fecha2, setFecha2] = useState(null);

  //Estado para almacenar las deudas
  const [isDebt, setIsDebt] = useState(false);
  const [deuda1, setDeuda1] = useState(null);
  const [deuda2, setDeuda2] = useState(null);

  const handleInputChange = (e, setter) => {
    const inputValue = e.target.value;
    if (/^\d*$/.test(inputValue)) {
      setter(inputValue);
    }
  };

  //Estado para almacenar los filtros
  const [select_Filters, set_Select_Filters] = useState([]); 

  //Lista de filtros
  const filters = [
    { id: 1, label: 'Hombres' }, 
    { id: 2, label: 'Mujeres' }, 
    { id: 3, label: 'Huéspedes' }, 
    { id: 4, label: 'Entradas Únicas' }, 
    { id: 5, label: 'Vetados' },
    { id: 6, label: 'No Vetados' },
    { id: 7, label: 'Deudores' }
  ]; 
  
  //Función para mostrar o no el rango de deudas
  const handleIsDebt = () => {
    setIsDebt(!isDebt); 
  }; 
  
  //Función para mostrar que filtros fueron seleccionados
  const filterChange = (event) => {
    const filterId = parseInt(event.target.value); 
    const choosen = event.target.checked;

    if (filterId == 7) {
      handleIsDebt();
    }

    if (choosen) { 
      set_Select_Filters([...select_Filters, filterId]); 
    } else { 
      set_Select_Filters(select_Filters.filter((id) => id !== filterId)); 
    } 
  };

  return (
    <div className='App-minheight'>
      <div className='flex-contenedor'>
        <div className='upper-contenedor'>  
          <div className='dropdown-container'>
            {/* Div para dropdown */}
            <Dropdown className='dropdown-container-dropdown'>
              <Dropdown.Toggle  className='dropdown-toggle-custom' variant='success' id='dropdown-basic'>
                Filtros
              </Dropdown.Toggle>
              <Dropdown.Menu className='dropdown-menu-custom'>
                {/* Checkbox de Filtros*/}
                {filters.map((option) => (
                  <Form.Check
                    key={option.id}
                    type='checkbox'
                    id='option_${option.id}'
                    label={option.label}
                    checked={select_Filters.includes(option.id)}
                    onChange={filterChange}
                    value={option.id}
                  />
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className='fecha-input-container'>
            {/* Div para fechas */}
            <div className='fecha-picker-container'>
              {/* Div para fecha 1 */}
              <DatePicker
                className='fecha-input'
                selected={fecha1}
                onChange={date => setFecha1(date)}
                placeholderText='DD/MM/YY'
                dateFormat='dd/MM/yy'
              />
            </div>
            <div className='fecha-picker-container'>
              {/* Div para fecha 2 */}
              <DatePicker
                className='fecha-input'
                selected={fecha2}
                onChange={date => setFecha2(date)}
                placeholderText='DD/MM/YY'
                dateFormat='dd/MM/yy'
              />
            </div>
          </div>

          <div className='deuda-input-container'>
            <div className='deuda-picker-container'>
              {/* Div para deudas */}
              {isDebt && (
                <div className='deuda-box-container'>
                  {/* Div para deuda 1 */}
                  <input
                    className='deuda-input'
                    type='number'
                    onChange={(e) => handleInputChange(e, setDeuda1)}
                    placeholder='Deuda'
                  />
                </div>
              )}
            </div>
            <div className='deuda-picker-container'>
              {/* Div para deudas */}
              {isDebt && (
                <div className='deuda-box-container'>
                  {/* Div para deuda 2*/}
                  <input
                    className='deuda-input'
                    type='number'
                    onChange={(e) => handleInputChange(e, setDeuda2)}
                    placeholder='Deuda'
                  />
              </div>
              )}
            </div>
          </div>
        </div>

        <div className='lower-contenedor'>
          <Table>
            <thead>
              <tr>
                <th>No. Cama</th>
                <th>Nombre</th>
                <th>Fecha de Ingreso</th>
                <th>Lugar de Origen</th>
                <th>Nombre del Paciente</th>
                <th>No. Carnet</th>
                <th>N. Socio-económico</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Mark</td>
                <td>01/04/2024</td>
                <td>Champoton</td>
                <td>Mark</td>
                <td>1234567890</td>
                <td>-5</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jacob</td>
                <td>02/03/2002</td>
                <td>El Paso</td>
                <td>Jacobo</td>
                <td>0987654321</td>
                <td>100</td>
              </tr>
            </tbody>
          </Table>
        </div>

      </div>
    </div>
  )
}

export default UserListAdmin