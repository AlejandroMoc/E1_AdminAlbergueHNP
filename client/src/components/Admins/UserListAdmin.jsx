import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap'; 
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';
import DatePicker from 'react-datepicker'; // Importar react-datepicker
import 'react-datepicker/dist/react-datepicker.css'; // Estilos de react-datepicker
import "./UserListAdmin.scss"
import 'bootstrap/dist/css/bootstrap.min.css';

const UserListAdmin = () => {
  //Estado para almacenar data
  const [data, setData] = useState([{id_cliente: 0, id_usuario: 0, carnet: '', nombre_c: '', apellidos_c: '', lugar_o: '', notas_c: '', sexo: null, paciente: null, nivel_se: 0}])

  //Estado para almacenar los filtros
  const [select_Filters, set_Select_Filters] = useState([]); 

  //Estado para almacenar las fechas
  const [fecha1, setFecha1] = useState(null);
  const [fecha2, setFecha2] = useState(null);

  //Estado para almacenar las deudas
  const [isDebt, setIsDebt] = useState(false);
  const [deuda1, setDeuda1] = useState(null);
  const [deuda2, setDeuda2] = useState(null);

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

  //Metodo Fetch
  useEffect(() => {
    fetch('http://localhost:8000/cliente')
    .then((res) => res.json())
    .then((clientes) => setData(clientes));
  }, [])
  
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

  //Función para mostrar o no el rango de deudas
  const handleIsDebt = () => {
    setIsDebt(!isDebt); 
  }; 

  //Función para controlar entradas de input deuda
  const handleInputChange = (e, setter) => {
    const inputValue = e.target.value;
    if (/^\d*$/.test(inputValue)) {
      setter(parseInt(inputValue));
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
                placeholderText='Fecha de Inicio'
                dateFormat='dd/MM/yy'
              />
            </div>
            <div className='guion-container'>
              <p> - </p>
            </div>
            <div className='fecha-picker-container'>
              {/* Div para fecha 2 */}
              <DatePicker
                className='fecha-input'
                selected={fecha2}
                onChange={date => setFecha2(date)}
                placeholderText='Fecha de Fin'
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
                    placeholder='Deuda Mínima'
                  />
                </div>
              )}
            </div>
            <p>{deuda1}</p>
            <div className='guion-container'>
              {isDebt && (
                <p> - </p>
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
                    placeholder='Deuda Máxima'
                  />
              </div>
              )}
            </div>
            <p>{deuda2}</p>
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
              {(select_Filters.length === 0) && (
                data.map((item) => (
                  <tr key={item.id_cliente}>
                    <td>Todavía no</td>
                    <td>{item.nombre_c} {item.apellidos_c}</td>
                    <td>Todavía no</td>
                    <td>{item.lugar_o}</td>
                    <td>Todavía no</td>
                    <td>{item.carnet}</td>
                    <td>{item.nivel_se}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>

      </div>
    </div>
  )
}

export default UserListAdmin