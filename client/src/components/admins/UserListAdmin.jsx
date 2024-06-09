/*        _   _
         ( \ / )
        __\ Y /,-')
       (__     .-'
          |   (
          [___]
          |oo |
        ,' \  |
       <___/  |
          |   |
          |   |
          |   |
          |   |
      _,-/_._  \,_
_.-"^`  //   \    `^"-.,__
\     ,//     \          /
 `\,-":;       ;  \-.,_/'
      ||       |   ;
      ||       ;   |
      :\      /    ;
       \`----'    /
        `._____.-'
          | | |
        __| | |__
       /    |    \
       `""""`""""`        */
/*############################################################################################
#
#   Imports
#
############################################################################################*/

// React
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { Link } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';
import DatePicker from 'react-datepicker';
import { useAuth } from '../../auth/AuthProvider';
import { API_URL } from '../../App';

// CSS
import 'react-datepicker/dist/react-datepicker.css';
import "./UserListAdmin.scss"
import 'bootstrap/dist/css/bootstrap.min.css';

// Elementos Externos
import Popup from '../universal/Popup';
import MyPagination from '../universal/MyPagination';
import MyToastContainer, { successToast, errorToast } from '../universal/MyToast';
import { Menu, Dropdown as DP } from 'antd';

// Iconografía
import { FaTrashAlt, FaBan, FaCheck } from 'react-icons/fa'; //Eliminar, Vetar y DesVetar

/*###########################################################################################
#
#   FUNCIÓN vetarCliente
#   Esta fución veta al cliente seleccionado.
#   Parámetros: Id del usuario que veta, id del cliente a vetar, y las notas del veto
#
############################################################################################*/

export const vetarCliente = (id_u, id_c, n_v) => {
  fetch(`${API_URL}/banclient`, {
    method: 'POST',
    body: JSON.stringify({ id_u: id_u, id_c: id_c, n_v: n_v }),
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



/*###########################################################################################
#
#   FUNCIÓN desvetarCliente
#   Esta fución desveta al cliente seleccionado.
#   Parámetros: Id del cliente a desvetar
#
############################################################################################*/

export const desvetarCliente = (id_c) => {
  fetch(`${API_URL}/unbanclient`, {
    method: 'POST',
    body: JSON.stringify({ id_c: id_c }),
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



/*###########################################################################################
#
#   FUNCIÓN eliminarCliente
#   Esta fución elimina, de la base de datos, al cliente seleccionado.
#   Parámetros: Id del cliente a eliminar
#
############################################################################################*/

export const eliminarCliente = (id_c) => {
  fetch(`${API_URL}/deleteclient`, {
    method: 'POST',
    body: JSON.stringify({ id_c: id_c }),
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



/*###########################################################################################
#
#   FUNCIÓN handleDateFormat
#   Esta fución da formato DD/MM/YY, HH/MM/SS a la fecha.
#   Parámetros: Fecha a la que se quiere dar formato
#   Return: String con fecha en nuevo formato.
#
############################################################################################*/

export const handleDateFormat = (date) => {
  const dbDate = new Date(date)
  const localDate = dbDate.toLocaleString()
  // console.log(typeof(localDate))
  return (localDate)
}



/*###########################################################################################
#
#   FUNCIÓN handleKeyDown
#   Esta fución evita entradas de texto en el datepicker.
#   Parámetros: Evento de interacción con el datepicker
#
############################################################################################*/

export const handleKeyDown = (e) => {
  // Verificar si la tecla presionada es una letra
  if ((e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 97 && e.keyCode <= 122)) {
    // Si es una letra, prevenir la acción predeterminada
    e.preventDefault()
  }
};



/*###########################################################################################
#
#   FUNCIÓN UserListAdmin
#   Esta fución es la principal de la Página de Camas.
#   Return: Página /userlist
#
############################################################################################*/

const UserListAdmin = () => {

  // UseEffect para Información de Sesión
  const id_u = useAuth().getUser().id_usuario
  const [adminInfo, setAdminInfo] = useState([])
  // console.log(id_u)

  useEffect(() => {
    fetch(`${API_URL}/infouser`, {
      method: 'POST',
      body: JSON.stringify({ id_u: id_u }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then((res) => res.json())
      .then((adminInfo) => setAdminInfo(adminInfo))
      .catch((error) => console.error('Error fetching data:', error))
  }, [])

  // UseEffect para Información de Filtrado
  const [data, setData] = useState([])
  const [select_Filters, set_Select_Filters] = useState([])
  const [select_View, set_Select_View] = useState(10)
  const [dateRange, setDateRange] = useState([])
  const [debtRange, setDebtRange] = useState([])
  const [filterText, setFilterText] = useState("")

  const [showPopUp, setShowPopUp] = useState({ trigger: false, type: -1, id: null, fun: null })

  useEffect(() => {
    if (select_Filters.length != 0 || select_View != 10 || dateRange.length != 0 || debtRange.length != 0) {
      // console.log('ENTRA')
      fetch(`${API_URL}/someclients`, {
        method: 'POST',
        body: JSON.stringify({ filters: select_Filters, views: select_View, dates: dateRange, debts: debtRange }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      })
        .then((res) => res.json())
        .then((clientes) => setData(clientes))
        .catch((error) => console.error('Error fetching data:', error))
    }
    else {
      fetch(`${API_URL}/allclients`)
        .then((res) => res.json())
        .then((clientes) => setData(clientes))
    }
  }, [select_Filters, select_View, dateRange, debtRange, showPopUp])

  // Para Control de Filtros
  const filters = [
    { id: 1, label: 'Hombres' },
    { id: 2, label: 'Mujeres' },
    { id: 3, label: 'Vetados' },
    { id: 4, label: 'No Vetados' },
    { id: 5, label: 'Deudores' },
    { id: 6, label: 'A Confirmar' }
  ];

  const filterChange = (event) => {
    const filterId = parseInt(event.target.value);
    const choosen = event.target.checked

    if (choosen) {
      set_Select_Filters([...select_Filters, filterId])
    }
    else {
      set_Select_Filters(select_Filters.filter((id) => id !== filterId))
    }
  }

  // Para Control de Views
  const views = [
    // {id: 10, label: 'General'},
    { id: 7, label: 'Huéspedes' },
    { id: 8, label: 'Visitas Previas' },
    { id: 9, label: 'Uso de Servicios' }
  ];

  const viewChange = (event) => {
    if (event.target.value == 10) {
      setFecha1(null)
      setFecha2(null)
      setDateRange([])
    }
    set_Select_View(event.target.value)
    // console.log(select_View)
  }

  // Para Control de Fecha
  const [fecha1, setFecha1] = useState(null)
  const [fecha2, setFecha2] = useState(null)
  const before = new Date('2020-01-01T00:00:00Z')
  const today = new Date()

  const handleDateChange = (startDate, endDate) => {
    setFecha1(startDate)
    setFecha2(endDate)

    if (!startDate && !endDate) {
      // Verifica si no hay ni una fecha seleccionada
      setDateErrorMessage('')
      setDateRange([])
    } else if ((startDate && !endDate) || (!startDate && endDate)) {
      // Verificar si solo se ha seleccionado una fecha
      setDateErrorMessage('ALERTA: Se necesitan 2 fechas')
      setDateRange([])
    } else if (startDate > endDate) {
      // Verificar si la fecha de inicio es posterior a la fecha de fin
      setDateErrorMessage('ALERTA: Fecha de inicio posterior a fecha de fin')
      setDateRange([])
    } else if (startDate < before || endDate < before) {
      // Verificar que ni una fecha sea anterior al año 2020
      setDateErrorMessage('ALERTA: Fecha anterior al año 2020')
      setDateRange([])
    } else {
      // Limpiar el mensaje de error si las fechas son válidas
      setDateErrorMessage('')
      const adjustedDate1 = new Date(startDate)
      adjustedDate1.setHours(0, 0, 1)
      const adjustedDate2 = new Date(endDate)
      adjustedDate2.setHours(23, 59, 59)
      setDateRange([adjustedDate1, adjustedDate2])
    }
  };

  // Para Control de Deuda
  const [deuda1, setDeuda1] = useState(null)
  const [deuda2, setDeuda2] = useState(null)

  const validDebt = (startDebt, endDebt) => {
    setDeuda1(startDebt)
    setDeuda2(endDebt)

    if (!startDebt && !endDebt) {
      // Verifica si no hay ni una deuda seleccionada
      setDebtErrorMessage('')
      return (false)
    } else if ((startDebt && !endDebt) || (!startDebt && endDebt)) {
      // Verificar si solo se ha seleccionado una deuda
      setDebtErrorMessage('ALERTA: Se necesitan 2 deudas')
      return (false)
    } else if (startDebt < 0 || endDebt < 0) {
      // Verificar que ni una deuda sea menor a 0
      setDebtErrorMessage('ALERTA: Deuda menor a 0')
      return (false)
    } else if (startDebt > 10000 || endDebt > 10000) {
      // Verificar que ni una deuda sea mayor a 10,000
      setDebtErrorMessage('ALERTA: Deuda mayor a 10,000')
      return (false)
    } else if (startDebt > endDebt) {
      // Verificar si la fecha de inicio es posterior a la fecha de fin
      setDebtErrorMessage('ALERTA: Deuda mínima mayor a deuda máxima')
      return (false)
    } else {
      // Limpiar el mensaje de error si las fechas son válidas
      setDebtErrorMessage('')
      return (true)
    }
  };

  const handleDebt1Change = (event) => {
    const tmpDebt1 = parseInt(event.target.value)
    const accepted = validDebt(tmpDebt1, deuda2)
    if (accepted) {
      setDebtRange([tmpDebt1, deuda2]);
    } else {
      setDebtRange([])
    }
  }

  const handleDebt2Change = (event) => {
    const tmpDebt2 = parseInt(event.target.value)
    const accepted = validDebt(deuda1, tmpDebt2)
    if (accepted) {
      setDebtRange([deuda1, tmpDebt2]);
    } else {
      setDebtRange([])
    }
  }

  // Para Control de Carnet
  const handleChange = (event) => {
    setFilterText(event.target.value.toUpperCase())
    // const tmpData = data.filter((item) => (
    //   item.carnet.toUpperCase().includes(event.target.value)
    // ))
    // console.log(tmpData)
    // setData(tmpData)
  }

  // Para Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  //console.log(paginatedData)

  // Para Mensajes de Error
  const [dateErrorMessage, setDateErrorMessage] = useState('')
  const [debtErrorMessage, setDebtErrorMessage] = useState('')

  // Para Menú Contextual
  const menu = (id, name, last_m, veto) => {
    return (
      <Menu onClick={(event) => handleMenuClick(event, id)}
        items={adminInfo.admin ? [
          { key: 'nombre', label: <strong>{name + ' ' + last_m}</strong> },
          veto ? { key: 'noVetar', label: <span style={{ color: 'green' }}>Desvetar</span>, icon: <span style={{ color: 'green' }}><FaCheck /></span> } : { key: 'vetar', label: 'Vetar', icon: <FaBan />, danger: true },
          veto ? '' : { key: 'eliminar', label: 'Eliminar permanentemente', icon: <FaTrashAlt />, danger: true },
        ] : (
          veto ? [
            { key: 'nombre', label: <strong>No Tienes Permisos de Administrador</strong> }
          ] : [
            { key: 'nombre', label: <strong>{name + ' ' + last_m}</strong> },
            { key: 'vetar', label: 'Vetar', icon: <FaBan />, danger: true }
          ]
        )}>
      </Menu>
    )
  }

  const handleMenuClick = (event, id) => {
    if (event.key == 'vetar') {
      //console.log('Vetar')
      setShowPopUp({ trigger: true, type: 1, id: id, fun: vetarCliente })
      // setType(0)
    }
    else if (event.key == 'noVetar') {
      //console.log('Des-Vetar?')
      setShowPopUp({ trigger: true, type: 0, id: id, fun: desvetarCliente })
      // setType(1)
    }
    else if (event.key == 'eliminar') {
      //console.log('Eliminar')
      setShowPopUp({ trigger: true, type: 0, id: id, fun: eliminarCliente })
      // setType(2)
    }
  }

  /*###########################################################################################
  #
  #   FUNCIÓN constTable
  #   Esta fución crea la tabla de los datos filtrados.
  #   Parámetros: Datos y la vista elegida
  #   Return: Table con contenido correspondiente a los filtros.
  #
  ############################################################################################*/

  const constTable = () => {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            {select_View == 10 ?
              <th><p>Registrado por</p></th> :
              (select_View == 9 ?
                '' :
                <th><p>No. Cama</p></th>
              )
            }
            <th><p>Nombre</p></th>
            {(select_View == 10 || select_View == 9) ?
              <th><p>Tipo de Cliente</p></th> :
              <th><p>Fecha de Ingreso</p></th>
            }
            {select_View == 9 ?
              <th><p>Ultima Fecha de Uso</p></th> :
              (select_View == 8 ?
                <th><p>Fecha de Salida</p></th> :
                ''
              )
            }
            {select_View != 9 && (<th><p>Lugar de Origen</p></th>)}
            {select_View == 9 && (<th><p>Desayuno</p></th>)}
            {select_View == 9 && (<th><p>Comida</p></th>)}
            {select_View == 9 && (<th><p>Cena</p></th>)}
            <th><p>No. Carnet</p></th>
            <th><p>N. Socio-económico</p></th>
            <th><p>Deuda</p></th>
          </tr>
        </thead>
        <tbody data-testid='table-body'>
          {(filterText.length == 0 ?
            paginatedData : data
          ).map((item, i) => (item.carnet.toUpperCase().includes(filterText) && //SE PUEDE MEJORAR, PERO ES FUNCIONAL
            <DP overlay={menu(item.id_cliente, item.nombre_c, item.apellidos_c, item.vetado)} trigger={['contextMenu']}>
              <tr key={i} style={{ background: '#fff' }}>
                {select_View == 10 ?
                  <td><p>{item.nombre_u ? item.nombre_u : '-'}</p></td> :
                  (select_View == 9 ?
                    '' :
                    <td><p>{item.id_cama ? item.id_cama : '-'}</p></td>
                  )
                }
                <td>
                  {item.nombre_c ?
                    <Link className='userlist_color_personlink' to={'/infouser/' + item.id_cliente}>{item.nombre_c} {item.apellidos_c}</Link> :
                    '-'
                  }
                </td>
                {(select_View == 10 || select_View == 9) ?
                  <td><p>{item.vetado ? 'Vetado' : (item.tipo_cliente ? 'Huésped' : 'Vistante')}</p></td> :
                  <td><p>{item.fecha_i ? handleDateFormat(item.fecha_i) : '-'}</p></td>
                }
                {select_View == 9 ?
                  <td><p>{item.l_fecha_u ? handleDateFormat(item.l_fecha_u) : '-'}</p></td> :
                  (select_View == 8 ?
                    <td><p>{item.fecha_s ? handleDateFormat(item.fecha_s) : '-'}</p></td> :
                    ''
                  )
                }
                {select_View != 9 && (<td><p>{item.lugar_o ? item.lugar_o : '-'}</p></td>)}
                {select_View == 9 && (<td><p>{item.desayuno ? item.desayuno : '-'}</p></td>)}
                {select_View == 9 && (<td><p>{item.comida ? item.comida : '-'}</p></td>)}
                {select_View == 9 && (<td><p>{item.cena ? item.cena : '-'}</p></td>)}
                <td><p>{item.carnet ? item.carnet : '-'}</p></td>
                <td><p>{item.nivel_se ? item.nivel_se : '-'}</p></td>
                <td><p>${item.total ? item.total : '-'}</p></td>
              </tr>
            </DP>
          ))}
        </tbody>
      </Table>
    )
  }

  return (
    <div className='App_minheight App_minpadding'>
      <div className='userlist_container_flex'>
        <div className='userlist_container_upper'>
          <div className='universal_container_dropdown universal_container_pickerdate'>
            {/* Div para dropdown */}
            <Dropdown className='universal_container_dropdown'>
              <Dropdown.Toggle className='userlist_toggle_dropdown universal_toggle_dropdown' variant='success' id='dropdown-basic'>
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
            {/* Div para datepicker */}
            <div className='userlist_container_inputs'>
              <div data-testid='hola'>
                <DatePicker
                  disabled={select_View == 10 ? true : false}
                  className='universal_input_date'
                  selected={fecha1}
                  onChange={(date) => handleDateChange(date, fecha2)}
                  placeholderText='Inicio (DD/MM/YY)'
                  dateFormat='dd/MM/yy'
                  onKeyDown={handleKeyDown} // Intercepta el evento de tecla presionada
                />
              </div>
              <div className='container_dash'>
                <p> - </p>
              </div>
              <div className='universal_container_pickerdate'>
                <DatePicker
                  disabled={select_View == 10 ? true : false}
                  className='universal_input_date'
                  selected={fecha2}
                  onChange={(date) => handleDateChange(fecha1, date)}
                  placeholderText='Fin (DD/MM/YY)'
                  dateFormat='dd/MM/yy'
                  onKeyDown={handleKeyDown} // Intercepta el evento de tecla presionada
                />
              </div>
            </div>
            <div className='universal_text_error' data-testid='date-error-message'>
              <p>{dateErrorMessage}</p>
            </div>
          </div>

          <div>
            {/* Div para debtpciker */}
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
            <div className='universal_text_error' data-testid='debt-error-message'>
              <p>{debtErrorMessage}</p>
            </div>
          </div>
        </div>

        <div className='userlist_container_lower'>
          <div>
            {/* Div para viewpicker */}
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
            <input className='userlist_filter_carnet universal_limit_input' type='text' value={filterText} onChange={handleChange} placeholder='Carnet'></input>
          </div>

          {/* Tabla de Contenido */}
          {data.length !== 0 ? (
            constTable()
          ) : (
            <div className='userlist_text_noresults' data-testid='no-result-message'>
              <h1>No existen resultados que coincidan.</h1>
            </div>
          )}
          <div className="userlist_pagination">
            {/* Llamada a Paginación */}
            {(data.length > 0 && filterText.length == 0) &&
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
            {/* Llamada a PopUp */}
            <Popup trigger={showPopUp.trigger} type={showPopUp.type} id={showPopUp.id} fun={showPopUp.fun} setTrigger={setShowPopUp}>
              ¿Estas Seguro?
            </Popup>
            {/* Llamada a Toasts */}
            <MyToastContainer />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserListAdmin