import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap'; 
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';
import DatePicker from 'react-datepicker'; // Importar react-datepicker
import 'react-datepicker/dist/react-datepicker.css'; // Estilos de react-datepicker
import "./UserListAdmin.scss"
import 'bootstrap/dist/css/bootstrap.min.css';

//PRESELECT RADIO GENERAL
//CAMBIA TABLA SERVICIOS

const UserListAdmin = () => {
  //Estado para almacenar data
  const [data, setData] = useState([])

  //Estado para almacenar los filtros
  const [select_Filters, set_Select_Filters] = useState([]); 
  const [select_View, set_Select_View] = useState(6)

  //Estado para almacenar las fechas
  const [dateRange, setDateRange] = useState([])
  const [fecha1, setFecha1] = useState(null);
  const [fecha2, setFecha2] = useState(null);

  const before = new Date('2020-01-01T00:00:00Z');
  const today = new Date();

  //Estado para almacenar las deudas
  const [debtRange, setDebtRange] = useState([])
  const [deuda1, setDeuda1] = useState(null);
  const [deuda2, setDeuda2] = useState(null);

  //Lista de filtros
  const filters = [
    { id: 1, label: 'Hombres'}, 
    { id: 2, label: 'Mujeres'},
    { id: 3, label: 'Vetados' },
    { id: 4, label: 'No Vetados'},
    { id: 5, label: 'Deudores'}
  ]; 

  const views = [
    {id: 6, label: 'General'},
    {id: 7, label: 'Huéspedes'},
    {id: 8, label: 'Visitas Previas'},
    {id: 9, label: 'Uso de Servicios'}
  ];

  //Llamada a las funciones de filtrado
  useEffect(() => {
    if (select_Filters.length !== 0 || select_View !== 6 || debtRange.length !== 0 || dateRange.length !== 0) {
      console.log(data)
      fetch('http://localhost:8000/someclients', {
        method: 'POST',
        body: JSON.stringify({filters: select_Filters, views: select_View, debts: debtRange, dates: dateRange}),
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
  }, [select_Filters, select_View, debtRange, dateRange])
  
  //Función para mostrar que filtros fueron seleccionados
  const filterChange = (event) => {
    const filterId = parseInt(event.target.value); 
    const choosen = event.target.checked;

    if (choosen) { 
      set_Select_Filters([...select_Filters, filterId]); 
    }
    else { 
      set_Select_Filters(select_Filters.filter((id) => id !== filterId)); 
    }
  };

  const viewChange = (event) => {
    set_Select_View(event.target.value)
    console.log(select_View)
  }

  //Función para aceptar las entradas de fecha
  const handleDate1Change = (event) => {
    // if (event.length === 0) {
    //   setFecha1(null)
    //   setDateRange([])
    // }
    // else {
      setFecha1(event);
      if (event && fecha2) {
        if (event > fecha2) {
          console.log('ALERTA: Fecha de inicio posterior a fecha de fin')
          return false;
        } else if (event < before || fecha2 < before) {
          console.log('ALERTA: Fecha anterior al año 2020')
          return false;
        } else if (event > today || fecha2 > today) {
          console.log('ALERTA: Fecha posterior a la fecha actual')
          return false;
        }
      } else {
        console.log('ALERTA: Se necesitan 2 fechas')
        return false;
      }
      setDateRange([event, fecha2]);
    // }
  }

  const handleDate2Change = (event) => {
    // if (event.length === 0) {
    //   setFecha2(null)
    //   setDateRange([])
    // }
    // else {
      setFecha2(event)
      if (fecha1 && event) {
        if (fecha1 > event) {
          console.log('ALERTA: Fecha de inicio posterior a fecha de fin')
          return false;
        } else if (fecha1 < before || event < before) {
          console.log('ALERTA: Fecha anterior al año 2020')
          return false;
        } else if (fecha1 > today || event > today) {
          console.log('ALERTA: Fecha posterior a la fecha actual')
          return false;
        }
      } else {
        console.log('ALERTA: Se necesitan 2 fechas')
        return false;
      }
      setDateRange([fecha1, event]);
    // }
  }

  //Función para controlar entradas de input deuda
  const handleDebt1Change = (event) => {
    const tmpDebt1 = event.target.value
    if (tmpDebt1.length === 0) {
      setDeuda1(null)
      setDebtRange([])
    }
    else {
      if (/^\d*$/.test(tmpDebt1)) {
        setDeuda1(parseInt(tmpDebt1));
      }
      if (tmpDebt1 && deuda2) {
        if (tmpDebt1 > deuda2) {
          console.log('ALERTA: Deuda mínima mayor a deuda máxima')
          setDebtRange([0, 10000])
        } else if (tmpDebt1 < 0 || deuda2 < 0) {
          console.log('ALERTA: Deuda menor a 0')
          setDebtRange([0, 10000])
        } else if (tmpDebt1 > 10000 || deuda2 > 10000) {
          console.log('ALERTA: Deuda mayor a $10,000')
          setDebtRange([0, 10000])
        }
      } else {
        console.log('ALERTA: Se necesitan 2 deudas')
        setDebtRange([0, 10000])
      }
      setDebtRange([parseInt(tmpDebt1), deuda2]);
    }
  }

  const handleDebt2Change = (event) => {
    const tmpDebt2 = event.target.value
    if (tmpDebt2.length === 0) {
      setDeuda2(null)
      setDebtRange([])
    }
    else {
      if (/^\d*$/.test(tmpDebt2)) {
        setDeuda2(parseInt(tmpDebt2));
      }
      if (deuda1 && tmpDebt2) {
        if (deuda1 > tmpDebt2) {
          console.log('ALERTA: Deuda mínima mayor a deuda máxima')
          setDebtRange([0, 10000])
        } else if (deuda1 < 0 || tmpDebt2 < 0) {
          console.log('ALERTA: Deuda menor a 0')
          setDebtRange([0, 10000])
        } else if (deuda1 > 10000 || tmpDebt2 > 10000) {
          console.log('ALERTA: Deuda mayor a $10,000')
          setDebtRange([0, 10000])
        }
      } else {
        console.log('ALERTA: Se necesitan 2 deudas')
        setDebtRange([0, 10000])
      }
      setDebtRange([deuda1, parseInt(tmpDebt2)]);
    }
  }

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
            <div className='fecha-picker-container'>
              <DatePicker
                className='fecha-input'
                selected={fecha1}
                onChange={handleDate1Change}
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
                onChange={handleDate2Change}
                placeholderText='Fecha de Fin'
                dateFormat='dd/MM/yy'
              />
            </div>
          </div>

          <div className='deuda-input-container'>
            <div className='deuda-picker-container'>
                <div className='deuda-box-container'>
                  {/* Div para deuda 1 */}
                  <input
                    className='deuda-input'
                    type='number'
                    onChange={handleDebt1Change}
                    placeholder='Deuda Mínima'
                    min='0'
                    max='10000'
                  />
                  {/* Deuda 1: {deuda1} */}
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
                    onChange={handleDebt2Change}
                    placeholder='Deuda Máxima'
                    min='0'
                    max='10000'
                  />
                  {/* Deuda 2: {deuda2}
                  Rango: {debtRange} */}
              </div>
            </div>
          </div>
        </div>

        <div className='lower-contenedor'>
          <div className='radio-container'>
              {views.map((option) => (
                <label key={option.id}>
                  <input 
                    type='radio' 
                    name='view' 
                    value={option.id}
                    onChange={viewChange}
                    />
                  {option.label}
                </label>
              ))}
          </div>

          <Table>
            <thead>
              {(select_View == 6 || select_View == 7) && (
                <tr>
                  <th>No. Cama</th>
                  <th>Nombre</th>
                  <th>Fecha de Ingreso</th>
                  <th>Lugar de Origen</th>
                  <th>No. Carnet</th>
                  <th>N. Socio-económico</th>
                  <th>Deuda</th>
                </tr>
              )}
              {select_View == 8 && (
                <tr>
                  <th>No. Cama</th>
                  <th>Nombre</th>
                  <th>Fecha de Ingreso</th>
                  <th>Fecha de Salida</th>
                  <th>Lugar de Origen</th>
                  <th>No. Carnet</th>
                  <th>N. Socio-económico</th>
                  <th>Deuda</th>
                </tr>
              )}
              {select_View == 9 && (
                <tr>
                  <th>Nombre</th>
                  <th>Tipo Cliente</th>
                  <th>No. Carnet</th>
                  <th>Ultima Fecha de Uso</th>
                  <th>Desayuno</th>
                  <th>Comida</th>
                  <th>Cena</th>
                  <th>N. Socio-económico</th>
                  <th>Deuda</th>
                </tr>
              )}
            </thead>
            <tbody>
              {(select_View == 6 || select_View == 7) && (
                data.map((item) => (
                  <tr key={item.id_cliente + ' ' + item.nombre_c}>
                    <td>{item.id_cama}</td>
                    <td>{item.nombre_c} {item.apellidos_c}</td>
                    <td>{item.fecha_i}</td>
                    <td>{item.lugar_o}</td>
                    <td>{item.carnet}</td>
                    <td>{item.nivel_se}</td>
                    <td>{item.total}</td>
                  </tr>
                ))
              )}
              {select_View == 8 && (
                data.map((item) => (
                  <tr key={item.id_cliente + ' ' + item.fecha_i + ' ' + item.fecha_s}>
                    <td>{item.id_cama}</td>
                    <td>{item.nombre_c} {item.apellidos_c}</td>
                    <td>{item.fecha_i}</td>
                    <td>{item.fecha_s}</td>
                    <td>{item.lugar_o}</td>
                    <td>{item.carnet}</td>
                    <td>{item.nivel_se}</td>
                    <td>{item.total}</td>
                  </tr>
                ))
              )}
              {select_View == 9 && (
                data.map((item) => (
                  <tr key={item.id_cliente + ' ' + item.l_fecha_u}>
                    <td>{item.nombre_c} {item.apellidos_c}</td>
                    <td>{item.tipo_cliente ? 'Huésped' : 'Visitante'}</td>
                    <td>{item.carnet}</td>
                    <td>{item.l_fecha_u}</td>
                    <td>{item.desayuno}</td>
                    <td>{item.comida}</td>
                    <td>{item.cena}</td>
                    <td>{item.nivel_se}</td>
                    <td>{item.total}</td>
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
