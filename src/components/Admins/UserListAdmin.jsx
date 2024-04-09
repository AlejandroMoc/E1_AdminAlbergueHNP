import React, { useState } from 'react';
import { Form } from 'react-bootstrap'; 
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';
import DatePicker from 'react-datepicker'; // Importar react-datepicker
import 'react-datepicker/dist/react-datepicker.css'; // Estilos de react-datepicker
import "./UserListAdmin.css"
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
    <div class='App-minheight'>
      {/* Div para los campos de entrada */}
      <h1>Administración de Usuarios</h1>

      <div class='fecha-input-container'>
        {/* Div para fechas */}
        <div class='fecha-picker-container'>
          {/* Div para fecha 1 */}
          <DatePicker
            selected={fecha1}
            onChange={date => setFecha1(date)}
            placeholderText='DD/MM/YY'
            class='fecha-input'
            dateFormat='dd/MM/yy'
          />
        </div>
        <div class='fecha-picker-container'>
          {/* Div para fecha 2 */}
          <DatePicker
            selected={fecha2}
            onChange={date => setFecha2(date)}
            placeholderText='DD/MM/YY'
            class='fecha-input'
            dateFormat='dd/MM/yy'
          />
        </div>
      </div>

      <div class='dropdown-container'>
        {/* Div para dropdown */}
        <Dropdown>
            <Dropdown.Toggle variant='success' id='dropdown-basic' class='dropdown-toggle-custom'>
              Filtros
            </Dropdown.Toggle>
            <Dropdown.Menu class='dropdown-menu-custom'>
              {/* Checkbox de Filtros*/}
              {filters.map((option) => (
                <Form.Check
                  class='custom-checkbox'
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

      <div class='deuda-input-container'>
        {/* Div para deudas */}
        {isDebt && (
          <div class='deuda-input'>
          {/* Div para deuda 1 */}
          <input name='Deuda1'/>
          {/* Div para deuda 2*/}
          <input name='Deuda2'/>
        </div>
        )}
      </div>

      <div class='table-container'>
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
  )
}

export default UserListAdmin