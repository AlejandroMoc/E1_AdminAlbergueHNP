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
  const [data, setData] = useState([{id_cliente: 0, id_cama: 0, nombre_c: '', apellidos_c: '', fecha_i: '', lugar_o: '', nombre_p: '', apellidos_p: '', carnet: '', nivel_se: 0}])

  //Estado para almacenar los filtros
  const [select_Filters, set_Select_Filters] = useState([]); 

  //Estado para almacenar las fechas
  // const [fecha1, setFecha1] = useState(null);
  // const [fecha2, setFecha2] = useState(null);

  //Estado para almacenar las deudas
  const [acceptDeuda, setAcceptDeuda] = useState(false);
  const [deuda1, setDeuda1] = useState(null);
  const [deuda2, setDeuda2] = useState(null);

  //Lista de filtros
  const filters = [
    { id: 1, label: 'Hombres'}, 
    { id: 2, label: 'Mujeres'}, 
    { id: 3, label: 'Huéspedes' }, 
    { id: 4, label: 'Entradas Únicas' }, 
    { id: 5, label: 'Vetados' },
    { id: 6, label: 'No Vetados' },
    { id: 7, label: 'Deudores' }
  ]; 

  //Llamada a las funciones de filtrado
  useEffect(() => {
    if (select_Filters.length !== 0) {
      fetch('http://localhost:8000/someclients', {
        method: 'POST',
        body: JSON.stringify({filters: select_Filters}),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      })
      .then((res) => res.json())
      .then((clientes) => setData(clientes))
      .catch((error) => console.error('Error fetching data:', error));
    }
    else {
      fetch('http://localhost:8000/allclients')
      .then((res) => res.json())
      .then((clientes) => setData(clientes));
    }
  }, [select_Filters])
  
  //Función para mostrar que filtros fueron seleccionados
  const filterChange = (event) => {
    if (event) {
      console.log('Hola')
      const filterId = parseInt(event.target.value); 
      const choosen = event.target.checked;

      if (choosen) { 
        set_Select_Filters([...select_Filters, filterId]); 
      } else { 
        set_Select_Filters(select_Filters.filter((id) => id !== filterId)); 
      }
    }

    // if (fecha1 || fecha2) {
    //   console.log('Hola?')
    //   if (handleDateRange()) {
    //     console.log('FECHA ACEPTADA');
    //     set_Select_Filters([...select_Filters, [8, fecha1, fecha2]])
    //   }
    // }
    if (deuda1 || deuda2) {
      if (handleDebtRange()) {
        console.log('DEUDA ACEPTADA');
        set_Select_Filters([...select_Filters, [9, deuda1, deuda2]])
      }
    }
  };

  //Función para aceptar las entradas de fecha
  // const handleDateRange = () => {
  //   const before = new Date('2020-01-01T00:00:00Z');
  //   const today = new Date();

  //   if (fecha1 && fecha2) {
  //     if (fecha1 > fecha2) {
  //       console.log('ALERTA: Fecha de inicio posterior a fecha de fin')
  //       return false;
  //     } else if (fecha1 < before || fecha2 < before) {
  //       console.log('ALERTA: Fecha anterior al año 2020')
  //       return false;
  //     } else if (fecha1 > today || fecha2 > today) {
  //       console.log('ALERTA: Fecha posterior a la fecha actual')
  //       return false;
  //     }
  //   } else {
  //     console.log('ALERTA: Se necesitan 2 fechas')
  //     return false;
  //   }
  //   return true;
  // }

  //Función para aceptar las entradas de deuda
  const handleDebtRange = () => {
    if (deuda1 && deuda2) {
      if (deuda1 > deuda2) {
        console.log('ALERTA: Deuda mínima mayor a deuda máxima')
        return false;
      } else if (deuda1 < 0 || deuda2 < 0) {
        console.log('ALERTA: Deuda menor a 0')
        return false;
      } else if (deuda1 > 10000 || deuda2 > 10000) {
        console.log('ALERTA: Deuda mayor a $10,000')
        return false;
      }
    } else {
      console.log('ALERTA: Se necesitan 2 deudas')
      return false;
    }
    return true;
  }

  //Función para controlar entradas de input fecha
  // const handleDateChange = (e, setter) => {
  //   setter(e);
  //   console.log(fecha1)
  //   console.log(fecha2)
  //   filterChange();
  // };

  //Función para controlar entradas de input deuda
  const handleDebtChange = (e, setter) => {
    const inputValue = e.target.value;
    if (/^\d*$/.test(inputValue)) {
      setter(parseInt(inputValue));
    }
    filterChange();
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

          {/* <div className='fecha-input-container'>
            <div className='fecha-picker-container'>
              <DatePicker
                className='fecha-input'
                selected={fecha1}
                onChange={(e) => handleDateChange(e, setFecha1)}
                placeholderText='Fecha de Inicio'
                dateFormat='dd/MM/yy'
              />
            </div>
            <div className='guion-container'>
              <p> - </p>
            </div>
            <div className='fecha-picker-container'>
              <DatePicker
                className='fecha-input'
                selected={fecha2}
                onChange={(e) => handleDateChange(e, setFecha2)}
                placeholderText='Fecha de Fin'
                dateFormat='dd/MM/yy'
              />
            </div>
          </div> */}

          <div className='deuda-input-container'>
            <div className='deuda-picker-container'>
                <div className='deuda-box-container'>
                  {/* Div para deuda 1 */}
                  <input
                    className='deuda-input'
                    type='number'
                    onChange={(e) => handleDebtChange(e, setDeuda1)}
                    placeholder='Deuda Mínima'
                    min='0'
                    max='10000'
                  />
                </div>
            </div>
            <div className='guion-container'>
              <p> - </p>
            </div>
            <div className='deuda-picker-container'>
              {/* Div para deudas */}
                <div className='deuda-box-container'>
                  {/* Div para deuda 2*/}
                  <input
                    className='deuda-input'
                    type='number'
                    onChange={(e) => handleDebtChange(e, setDeuda2)}
                    placeholder='Deuda Máxima'
                    min='0'
                    max='10000'
                  />
              </div>
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
              {(
                data.map((item) => (
                  <tr key={item.id_cliente}>
                    <td>{item.id_cama}</td>
                    <td>{item.nombre_c} {item.apellidos_c}</td>
                    <td>{item.fecha_i}</td>
                    <td>{item.lugar_o}</td>
                    <td>{item.nombre_p} {item.apellidos_p}</td>
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
