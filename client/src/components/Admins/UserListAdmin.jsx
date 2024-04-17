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
      setter(parseInt(inputValue));
    }
    Console.log(deuda1);
    Conssole.log(deuda2);
  };

  //Estado para los filtros TRAMPA
  const [isHombre, setIsHombre] = useState(false);
  const [isMujer, setIsMujer] = useState(false);
  const [isHuesped, setIsHuesped] = useState(false);
  const [isUnico, setIsUnico] = useState(false);
  const [isVetado, setIsVetado] = useState(false);
  const [isNoVetado, setIsNoVetado] = useState(false);

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

  //Función para mostrar resultados de filtro TRAMPA
  const handleIsHombre = () => {
    setIsHombre(!isHombre); 
  }; 
  const handleIsMujer = () => {
    setIsMujer(!isMujer); 
  }; 
  const handleIsHuesped = () => {
    setIsHuesped(!isHuesped); 
  }; 
  const handleIsUnico = () => {
    setIsUnico(!isUnico); 
  }; 
  const handleIsVetado = () => {
    setIsVetado(!isVetado); 
  }; 
  const handleIsNoVetado = () => {
    setIsNoVetado(!isNoVetado); 
  };

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

    //TRAMPA
    if (filterId == 1) {
      handleIsHombre();
    }
    else if (filterId == 2) {
      handleIsMujer();
    }
    else if (filterId == 3) {
      handleIsHuesped();
    }
    else if (filterId == 4) {
      handleIsUnico();
    }
    else if (filterId == 5) {
      handleIsVetado();
    }
    else if (filterId == 6) {
      handleIsNoVetado();
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
              {/* TABLA TRAMPA */}
              {(isHombre || select_Filters.length === 0) && (
                <tr>
                  <td>1</td>
                  <td>Mark</td>
                  <td>01/04/2024</td>
                  <td>Champoton</td>
                  <td>Mark</td>
                  <td>1234567890</td>
                  <td>-5</td>
                </tr>
              )}
              {(isMujer || select_Filters.length === 0) && (
                <tr>
                  <td>2</td>
                  <td>Maria</td>
                  <td>01/04/2022</td>
                  <td>Lomas</td>
                  <td>Mark</td>
                  <td>1234567890</td>
                  <td>2</td>
                </tr>
              )}
              {(isHuesped || select_Filters.length === 0) && (
                <tr>
                  <td>3</td>
                  <td>Marko</td>
                  <td>05/07/2014</td>
                  <td>Champoton</td>
                  <td>Mark</td>
                  <td>1234567890</td>
                  <td>0</td>
                </tr>
              )}
              {(isUnico || select_Filters.length === 0) && (
                <tr>
                  <td>4</td>
                  <td>Marcelo</td>
                  <td>01/04/2024</td>
                  <td>Tabasco</td>
                  <td>Mark</td>
                  <td>1234567890</td>
                  <td>-5</td>
                </tr>
              )}
              {(isVetado || select_Filters.length === 0) && (
                <tr>
                  <td>5</td>
                  <td>Marisol</td>
                  <td>01/01/2024</td>
                  <td>Chiapas</td>
                  <td>Carla</td>
                  <td>127890</td>
                  <td>4</td>
                </tr>
              )}
              {(isNoVetado || select_Filters.length === 0) && (
                <tr>
                  <td>6</td>
                  <td>Cortisol</td>
                  <td>01/04/2022</td>
                  <td>Salina Cruz</td>
                  <td>Javier</td>
                  <td>12340</td>
                  <td>2</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

      </div>
    </div>
  )
}

export default UserListAdmin