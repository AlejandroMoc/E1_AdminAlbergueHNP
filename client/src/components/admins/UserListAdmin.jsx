import React, {useEffect, useState } from 'react';
import Popup from '../universal/Popup';
import MyToastContainer, {successToast, errorToast } from '../universal/MyToast';
import {Form } from 'react-bootstrap'; 
import {Link } from "react-router-dom";
import {Menu, Dropdown as DP} from 'antd';
import {FaTrashAlt, FaBan, FaCheck } from 'react-icons/fa';
import Table from 'react-bootstrap/Table';
import MyPagination from '../universal/MyPagination';
import Dropdown from 'react-bootstrap/Dropdown';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "./UserListAdmin.scss"
import 'bootstrap/dist/css/bootstrap.min.css';

//MENÚ CLICK DERECHO

const UserListAdmin = () => {

  //Para mensajes de error
  const [dateErrorMessage, setDateErrorMessage] = useState('')
  const [debtErrorMessage, setDebtErrorMessage] = useState('')

  //Para popup
  const [showPopUp, setShowPopUp] = useState({trigger: false, type: -1, id: null, fun: null})

  //Estado para almacenar data
  const [data, setData] = useState([])

  //Para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  //Estado para almacenar los filtros
  const [select_Filters, set_Select_Filters] = useState([]); 
  const [select_View, set_Select_View] = useState(10)

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
    {id: 1, label: 'Hombres'}, 
    {id: 2, label: 'Mujeres'},
    {id: 3, label: 'Vetados' },
    {id: 4, label: 'No Vetados'},
    {id: 5, label: 'Deudores'},
    {id: 6, label: 'A Confirmar'}
  ]; 

  

  const views = [
    // {id: 10, label: 'General'},
    {id: 7, label: 'Huéspedes'},
    {id: 8, label: 'Visitas Previas'},
    {id: 9, label: 'Uso de Servicios'}
  ];

  //Llamada a las funciones de filtrado
  useEffect(() => {
    if (select_Filters.length !== 0 || select_View !== 10 || debtRange.length !== 0 || dateRange.length !== 0) {
      // console.log(data)
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
  }, [select_Filters, select_View, debtRange, dateRange, showPopUp])

  //Llamada a la función de vetar
  const vetarCliente = (id_u, id_c, n_v) => {
    fetch('http://localhost:8000/banclient', {
        method: 'POST',
        body: JSON.stringify({id_u: id_u, id_c: id_c, n_v: n_v}),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      })
      .then((response) => {
        if (response.ok) {
          successToast()
        }
      })
      .catch((error) => {
        errorToast()
        console.error('Error fetching data:', error)
      })
  }

  //Llamada a la función de desvetar
  const desvetarCliente = (id_c) => {
    fetch('http://localhost:8000/unbanclient', {
        method: 'POST',
        body: JSON.stringify({id_c: id_c}),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      })
      .then((response) => {
        if (response.ok) {
          successToast()
        }
      })
      .catch((error) => {
        errorToast()
        console.error('Error fetching data:', error)
      })
  }

  //Llamada a la función de eliminar
  const eliminarCliente = (id_c) => {
    fetch('http://localhost:8000/deleteclient', {
        method: 'POST',
        body: JSON.stringify({id_c: id_c}),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      })
      .then((response) => {
        if (response.ok) {
          successToast()
        }
      })
      .catch((error) => {
        errorToast()
        console.error('Error fetching data:', error)
      })
  }

  //Función para paginación
  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
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

  const handleDateFormat = (date) => {
    const dbDate = new Date(date)
    const localDate = dbDate.toLocaleString()
    // console.log(localDate)
    return(localDate)
  }

  //Función para aceptar las entradas de fecha
  const handleDate1Change = (event) => {
    if (event === null) {
      setFecha1(null)
      setDateRange([])
      setDateErrorMessage('')
      return false
    }
    else {
      const adjustedDate1 = new Date(event)
      adjustedDate1.setHours(0, 0, 1)

      setFecha1(adjustedDate1);
      if (adjustedDate1 && fecha2) {
        if (adjustedDate1 > fecha2) {
          console.log('ALERTA: Fecha de inicio posterior a fecha de fin')
          setDateErrorMessage('ALERTA: Fecha de inicio posterior a fecha de fin')
          return false;
        } else if (adjustedDate1 < before || fecha2 < before) {
          console.log('ALERTA: Fecha anterior al año 2020')
          setDateErrorMessage('ALERTA: Fecha anterior al año 2020')
          return false;
        }
      } else {
        console.log('ALERTA: Se necesitan 2 fechas')
        setDateErrorMessage('ALERTA: Se necesitan 2 fechas')
        return false;
      }
      setDateRange([adjustedDate1, fecha2]);
      setDateErrorMessage('')
    }
  }

  const handleDate2Change = (event) => {
    if (event === null) {
      setFecha2(null)
      setDateRange([])
      setDateErrorMessage('')
      return false
    }
    else {
      const adjustedDate2 = new Date(event)
      adjustedDate2.setHours(23, 59, 59)

      setFecha2(adjustedDate2)
      if (fecha1 && adjustedDate2) {
        if (fecha1 > adjustedDate2) {
          console.log('ALERTA: Fecha de inicio posterior a fecha de fin')
          setDateErrorMessage('ALERTA: Fecha de inicio posterior a fecha de fin')
          return false;
        } else if (fecha1 < before || adjustedDate2 < before) {
          console.log('ALERTA: Fecha anterior al año 2020')
          setDateErrorMessage('ALERTA: Fecha anterior al año 2020')
          return false;
        }
      } else {
        console.log('ALERTA: Se necesitan 2 fechas')
        setDateErrorMessage('ALERTA: Se necesitan 2 fechas')
        return false;
      }
      setDateRange([fecha1, adjustedDate2]);
      setDateErrorMessage('')
    }
  }

  //Función para controlar entradas de input deuda
  const handleDebt1Change = (event) => {
    const tmpDebt1 = event.target.value
    if (tmpDebt1.length === 0) {
      setDeuda1(null)
      setDebtRange([])
      setDebtErrorMessage('')
      return false
    }
    else {
      if (/^\d*$/.test(tmpDebt1)) {
        console.log('ENTRA')
        setDeuda1(parseInt(tmpDebt1));
      }
      if (tmpDebt1 !== null && deuda2 !== null) {
        if (tmpDebt1 > deuda2) {
          console.log('ALERTA: Deuda mínima mayor a deuda máxima')
          setDebtErrorMessage('ALERTA: Deuda mínima mayor a deuda máxima')
          setDebtRange([])
          return false;
        } else if (tmpDebt1 < 0 || deuda2 < 0) {
          console.log('ALERTA: Deuda menor a 0')
          setDebtErrorMessage('ALERTA: Deuda menor a 0')
          setDebtRange([])
          return false;
        } else if (tmpDebt1 > 10000 || deuda2 > 10000) {
          console.log('ALERTA: Deuda mayor a $10,000')
          setDebtErrorMessage('ALERTA: Deuda mayor a $10,000')
          setDebtRange([])
          return false;
        }
      } else {
        console.log('ALERTA: Se necesitan 2 deudas')
        setDebtErrorMessage('ALERTA: Se necesitan 2 deudas')
        setDebtRange([])
        return false;
      }
      setDebtRange([parseInt(tmpDebt1), deuda2]);
      setDebtErrorMessage('')
    }
  }

  const handleDebt2Change = (event) => {
    const tmpDebt2 = event.target.value
    if (tmpDebt2.length === 0) {
      setDeuda2(null)
      setDebtRange([])
      setDebtErrorMessage('')
      return false
    }
    else {
      if (/^\d*$/.test(tmpDebt2)) {
        console.log('entra')
        setDeuda2(parseInt(tmpDebt2));
      }
      console.log(deuda1)
      console.log(tmpDebt2)
      if (deuda1 !== null && tmpDebt2 !== null) {
        if (deuda1 > tmpDebt2) {
          console.log('ALERTA: Deuda mínima mayor a deuda máxima')
          setDebtErrorMessage('ALERTA: Deuda mínima mayor a deuda máxima')
          setDebtRange([])
          return false;
        } else if (deuda1 < 0 || tmpDebt2 < 0) {
          console.log('ALERTA: Deuda menor a 0')
          setDebtErrorMessage('ALERTA: Deuda menor a 0')
          setDebtRange([])
          return false;
        } else if (deuda1 > 10000 || tmpDebt2 > 10000) {
          console.log('ALERTA: Deuda mayor a $10,000')
          setDebtErrorMessage('ALERTA: Deuda mayor a $10,000')
          setDebtRange([])
          return false;
        }
      } else {
        console.log('ALERTA: Se necesitan 2 deudas')
        setDebtErrorMessage('ALERTA: Se necesitan 2 deudas')
        setDebtRange([])
        return false;
      }
      setDebtRange([deuda1, parseInt(tmpDebt2)]);
      setDebtErrorMessage('')
    }
  }

  // Para menú click derecho
  const menu = (id, name, last_m, veto) => {
    return (
      <Menu onClick={(event) => handleMenuClick(event, id)}
        items={[
          {key: 'nombre', label: <strong>{name + ' ' + last_m}</strong>},
          veto ? {key: 'noVetar', label: <span style={{color: 'green' }}>Desvetar</span>, icon: <span style={{color: 'green' }}><FaCheck /></span>} : {key: 'vetar', label: 'Vetar', icon: <FaBan />, danger: true},
          veto ? '' : {key: 'eliminar', label: 'Eliminar', icon: <FaTrashAlt />, danger: true},
        ]}>
      </Menu>
    )
  }

  const handleMenuClick = (event, id) => {
    if (event.key == 'vetar') {
      console.log('Vetar')
      setShowPopUp({trigger: true, type: 1, id: id, fun: vetarCliente})
      // setType(0)
    }
    else if (event.key == 'noVetar') {
      console.log('Des-Vetar?')
      setShowPopUp({trigger: true, type: 0, id: id, fun: desvetarCliente})
      // setType(1)
    }
    else if (event.key == 'eliminar') {
      console.log('Eliminar')
      setShowPopUp({trigger: true, type: 0, id: id, fun: eliminarCliente})
      // setType(2)
    }
  }

  return (
    <div className='App_minheight App_minpadding'>
      <div className='userlist_container_flex'>
        <div className='userlist_container_upper'>  
          <div className='universal_container_dropdown universal_container_pickerdate'>
            {/* Div para dropdown */}
            <Dropdown className='universal_container_dropdown'>
              <Dropdown.Toggle  className='userlist_toggle_dropdown universal_toggle_dropdown' variant='success' id='dropdown-basic'>
                Filtros
              </Dropdown.Toggle>
              <Dropdown.Menu className='userlist_dropdown_custommenu'>
                {/* Checkbox de Filtros*/}
                {filters.map((option) => (
                  <Form.Check
                    className='userlist_padding_formcheck'
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

          <div>
            <div className='userlist_container_inputs'>
              <div>
                <DatePicker
                  className='universal_input_date'
                  selected={fecha1}
                  onChange={handleDate1Change}
                  placeholderText='Inicio (DD/MM/YY)'
                  dateFormat='dd/MM/yy'
                />
              </div>
              <div className='container_dash'>
                <p> - </p>
              </div>
              <div>
                <DatePicker 
                  className='universal_input_date universal_container_pickerdate'
                  selected={fecha2}
                  onChange={handleDate2Change}
                  placeholderText='Fin (DD/MM/YY)'
                  dateFormat='dd/MM/yy'
                />
              </div>
            </div>
            <div className='universal_text_error'>
              <p>{dateErrorMessage}</p>
            </div>
          </div>

          <div>
            <div className='userlist_container_inputs'>
              <div className='deuda-picker-container'>
                  <div className='deuda-box-container'>
                    {/* Div para deuda 1 */}
                    <input
                      className='userlist_inputdebt'
                      type='number'
                      onChange={handleDebt1Change}
                      placeholder='Deuda Mínima'
                      min='0'
                      max='10000'
                    />
                    {/* Deuda 1: {deuda1} */}
                  </div>
              </div>
              <div className='container_dash'>
                <p> - </p>
              </div>
              <div className='deuda-picker-container'>
                {/* Div para deudas */}
                  <div className='deuda-box-container'>
                    {/* Div para deuda 2*/}
                    <input
                      className='userlist_inputdebt'
                      type='number'
                      onChange={handleDebt2Change}
                      placeholder='Deuda Máxima'
                      min='0'
                      max='10000'
                    />
                    {/* Deuda 2: {deuda2} */}
                    {/* Rango: {debtRange} */}
                </div>
              </div>
            </div>
            <div className='universal_text_error'>
              <p>{debtErrorMessage}</p>
            </div>
          </div>
        </div>

        <div className='userlist_container_lower'>
          <div>
              <label className='userlist_container_radio universal_label_radio' key={10}>
                <input 
                  className="form-check-input universal_text_HM"
                  type='radio' 
                  name='view' 
                  value={10}
                  onChange={viewChange}
                  defaultChecked
                />
                {'General'}
              </label>
              {views.map((option) => (
                <label className='userlist_container_radio universal_label_radio' key={option.id}>
                  <input 
                    className="form-check-input universal_text_HM"
                    type='radio'
                    name='view'
                    value={option.id}
                    onChange={viewChange}
                  />
                  {option.label}
                </label>
              ))}
          </div>

          {data.length !== 0 ? (
            <Table striped bordered hover>
              <thead>
                {select_View == 10 && (
                  <tr>
                    {/*TODO ver si dividir nombre y apellidos para estandarizacion*/}
                    <th>No. Cama</th>
                    <th>Nombre</th>
                    <th>Tipo de Cliente</th>
                    <th>Lugar de Origen</th>
                    <th>No. Carnet</th>
                    <th>N. Socio-económico</th>
                    <th>Deuda</th>
                  </tr>
                )}
                {select_View == 7 && (
                  <tr>
                    {/*TODO ver si dividir nombre y apellidos para estandarizacion*/}
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
                {select_View == 10 && (
                  paginatedData.map((item, i) => (
                    <DP overlay={menu(item.id_cliente, item.nombre_c, item.apellidos_c, item.vetado)} trigger={['contextMenu']}>
                      <tr key={i} style={{background: '#fff' }}>
                        <td>{item.id_cama ? item.id_cama : '-'}</td>
                        {/*TODO ver si conviene dividir en nombre y apellidos*/}
                        <td>
                          {item.nombre_c ?
                            <Link className='userlist_color_personlink' to={'/infouser/'+item.id_cliente}>{item.nombre_c} {item.apellidos_c}</Link>
                            : '-'}
                        </td>
                        <td>{item.vetado ? 'Vetado' : (item.fecha_i ? 'Huésped' : 'Vistante')}</td>
                        <td>{item.lugar_o ? item.lugar_o : '-'}</td>
                        <td>{item.carnet ? item.carnet : '-'}</td>
                        <td>{item.nivel_se ? item.nivel_se : '-'}</td>
                        <td>${item.total ? item.total : '-'}</td>
                      </tr>
                    </DP>
                  ))
                )}
                {select_View == 7 && (
                  paginatedData.map((item, i) => (
                    <DP overlay={menu(item.id_cliente, item.nombre_c, item.apellidos_c, item.vetado)} trigger={['contextMenu']}>
                      <tr key={i} style={{background: '#fff' }}>
                        <td>{item.id_cama ? item.id_cama : '-'}</td>
                        {/*TODO ver si conviene dividir en nombre y apellidos*/}
                        <td>
                          {item.nombre_c ?
                            <Link className='userlist_color_personlink' to={'/infouser/'+item.id_cliente}>{item.nombre_c} {item.apellidos_c}</Link>
                            : '-'}
                        </td>
                        <td>{item.fecha_i ? handleDateFormat(item.fecha_i) : '-'}</td>
                        <td>{item.lugar_o ? item.lugar_o : '-'}</td>
                        <td>{item.carnet ? item.carnet : '-'}</td>
                        <td>{item.nivel_se ? item.nivel_se : '-'}</td>
                        <td>${item.total ? item.total : '-'}</td>
                      </tr>
                    </DP>
                  ))
                )}
                {select_View == 8 && (
                  paginatedData.map((item, i) => (
                    <DP overlay={menu(item.id_cliente, item.nombre_c, item.apellidos_c, item.vetado)} trigger={['contextMenu']}>
                      <tr key={i} style={{background: '#fff' }}>
                        <td>{item.id_cama}</td>
                        <td>
                          {item.nombre_c ?
                            <Link className='userlist_color_personlink' to={'/infouser/'+item.id_cliente}>{item.nombre_c} {item.apellidos_c}</Link>
                            : '-'}
                        </td>
                        <td>{item.fecha_i ? handleDateFormat(item.fecha_i) : ''}</td>
                        <td>{item.fecha_s ? handleDateFormat(item.fecha_s) : ''}</td>
                        <td>{item.lugar_o ? item.lugar_o : '-'}</td>
                        <td>{item.carnet ? item.carnet : '-'}</td>
                        <td>{item.nivel_se ? item.nivel_se : '-'}</td>
                        <td>${item.total ? item.total : '-'}</td>
                      </tr>
                    </DP>
                  ))
                )}
                {select_View == 9 && (
                  paginatedData.map((item, i) => (
                    <DP overlay={menu(item.id_cliente, item.nombre_c, item.apellidos_c, item.vetado)} trigger={['contextMenu']}>
                      <tr key={i} style={{background: '#fff' }}>
                        <td>
                          {item.nombre_c ?
                            <Link className='userlist_color_personlink' to={'/infouser/'+item.id_cliente}>{item.nombre_c} {item.apellidos_c}</Link>
                            : '-'}
                        </td>
                        <td>{item.vetado ? 'Vetado' : (item.tipo_cliente ? 'Huésped' : 'Visitante')}</td>
                        <td>{item.carnet ? item.carnet : '-'}</td>
                        <td>{item.l_fecha_u ? handleDateFormat(item.l_fecha_u) : ''}</td>
                        <td>{item.desayuno ? item.desayuno : '-'}</td>
                        <td>{item.comida ? item.comida : '-'}</td>
                        <td>{item.cena ? item.cena : '-'}</td>
                        <td>{item.nivel_se ? item.nivel_se : '-'}</td>
                        <td>${item.total ? item.total : '-'}</td>
                      </tr>
                    </DP>
                  ))
                )}
              </tbody>
            </Table>
          ) : (
            <div className='userlist_text_noresults'>
              <h1>No existen resultados que coincidan.</h1>
            </div>
          )}
          <div className="userlist_pagination">
            {data.length > 0 &&
              <>
                <MyPagination
                  itemsCount={data.length}
                  itemsPerPage={pageSize}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  alwaysShown={true}
                />
              </>
            }
          <Popup trigger={showPopUp.trigger} type={showPopUp.type} id={showPopUp.id} fun={showPopUp.fun} setTrigger={setShowPopUp}>
            ¿Estas Seguro?
          </Popup>
          <MyToastContainer />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserListAdmin