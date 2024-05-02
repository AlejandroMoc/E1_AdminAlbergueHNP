import React, { useEffect, useState, useRef } from 'react';
import './HomeAdmin.scss'; // Importa tu archivo CSS aquí
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';
import DatePicker from 'react-datepicker'; // Importar react-datepicker
import 'react-datepicker/dist/react-datepicker.css'; // Estilos de react-datepicker
import { useReactToPrint } from "react-to-print";

const ReportsAdmin = () => {
  // Estado para almacenar las fechas
  const componentPDF = useRef();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [esUsuario, setEsUsuario] = useState(false);
  const [UsuarioSeleccionado, setUsuarioSeleccionado] = useState('Usuario'); // Estado para almacenar el nombre del Usuario seleccionado
  const [esGeneral, setEsGeneral] = useState(true); // Nuevo estado para el checkbox "General"
  const [esServicio, setEsServicio] = useState(false); // Nuevo estado para el checkbox "Servicios"
  const [data, setData] = useState([{id_cliente: 0, tipo_usuario: '', nombre_c: '', apellidos_c: '', sexo: '', lugar_o: '', fecha_i: '', fecha_s: '', cantidad_regadera: '', cantidad_bano: '', cantidad_desayuno: '', cantidad_comida: '', cantidad_cena: '', vetado: '', notas_v:'', total_deuda: '' }]); // Estado para almacenar los datos de la consulta
  const [datahuesped, setDataHuesped] = useState([{id_cliente: 0, tipo_usuario: '', nombre_c: '', apellidos_c: '', sexo: '', lugar_o: '', fecha_i: '', fecha_s: '', cantidad_regadera: '', cantidad_bano: '', cantidad_desayuno: '', cantidad_comida: '', cantidad_cena: '', vetado: '', notas_v:'', total_deuda: '' }]); // Estado para almacenar los datos de la consulta
  const [datavisitante, setDataVisitante] = useState([{id_cliente: 0, tipo_usuario: '', nombre_c: '', apellidos_c: '', sexo: '', lugar_o: '', fecha_i: '', fecha_s: '', cantidad_regadera: '', cantidad_bano: '', cantidad_desayuno: '', cantidad_comida: '', cantidad_cena: '', vetado: '', notas_v:'', total_deuda: '' }]); // Estado para almacenar los datos de la consulta
  const [datavetado, setDataVetado] = useState([{id_cliente: 0, tipo_usuario: '', nombre_c: '', apellidos_c: '', sexo: '', lugar_o: '', fecha_i: '', fecha_s: '', cantidad_regadera: '', cantidad_bano: '', cantidad_desayuno: '', cantidad_comida: '', cantidad_cena: '', vetado: '', notas_v:'', total_deuda: '' }]); // Estado para almacenar los datos de la consulta
  const [datauser, setDataUser] = useState([{id_cliente: 0, tipo_usuario: '', nombre_c: '', apellidos_c: '', sexo: '', lugar_o: '', fecha_i: '', fecha_s: '', cantidad_regadera: '', cantidad_bano: '', cantidad_desayuno: '', cantidad_comida: '', cantidad_cena: '', vetado: '', notas_v:'', total_deuda: '' }]); // Estado para almacenar los datos de la consulta

  // Estado para almacenar el nombre del Huesped seleccionado
  const [huespedSeleccionado, setHuespedSeleccionado] = useState('Huesped');

  // Estado para almacenar el nombre del Visitante seleccionado
  const [visitanteSeleccionado, setVisitanteSeleccionado] = useState('Visitante');

   // Estado para almacenar el nombre del Visitante seleccionado
  const [vetadoSeleccionado, setVetadoSeleccionado] = useState('Vetado');

  const [huespedes, setHuespedes] = useState([{id_huesped:0, nombre:'', apellidos:''}]); // Estado para almacenar los huéspedes
  const [visitantes, setVisitantes] = useState([{id_visitante:0, nombre:'', apellidos:''}]); // Estado para almacenar los huéspedes
  const [vetados, setVetados] = useState([{id_visitante:0, nombre:'', apellidos:''}]); // Estado para almacenar los huéspedes

  const [mostrarHuespedes, setMostrarHuespedes] = useState(false); // Nuevo estado para mostrar el dropdown de Huespedes
  const [mostrarVisitantes, setMostrarVisitantes] = useState(false); // Nuevo estado para mostrar el dropdown de Visitantes
  const [mostrarVetados, setMostrarVetados] = useState(false); // Nuevo estado para mostrar el dropdown de Visitantes


  const handleDateFormat = (date) => {
    const dbDate = new Date(date)
    const localDate = dbDate.toLocaleString()
    // console.log(localDate)
    return(localDate)
  }


  const handleKeyDown = (e) => {
    // Verificar si la tecla presionada es una letra
    if ((e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 97 && e.keyCode <= 122)) {
      // Si es una letra, prevenir la acción predeterminada
      e.preventDefault();
    }
  };


  useEffect(() => {
    if (startDate === null  || endDate === null) {
      // Cuando startDate y endDate son null, realizar estas operaciones
      fetch('http://localhost:8000/allusers')
        .then((res) => res.json())
        .then((allusers) => setData(allusers));

      fetch('http://localhost:8000/allgeneralhuespedes')
        .then((res) => res.json())
        .then((allgeneralhuespedes) => setDataHuesped(allgeneralhuespedes));

      fetch('http://localhost:8000/allgeneralvisitantes')
        .then((res) => res.json())
        .then((allgeneralvisitantes) => setDataVisitante(allgeneralvisitantes));

      fetch('http://localhost:8000/allgeneralvetados')
        .then((res) => res.json())
        .then((allgeneralvetados) => setDataVetado(allgeneralvetados));

      // Fetch para obtener todos los huéspedes
      fetch('http://localhost:8000/allhuespedes')
        .then((res) => res.json())
        .then((huespedesData) => setHuespedes(huespedesData));

      // Fetch para obtener todos los huéspedes
      fetch('http://localhost:8000/allvisitantes')
        .then((res) => res.json())
        .then((visitantesData) => setVisitantes(visitantesData));

      // Fetch para obtener todos los vetados
      fetch('http://localhost:8000/allvetados')
        .then((res) => res.json())
        .then((vetadosData) => setVetados(vetadosData));
    } else {
      // Cuando startDate y endDate no son null, realizar estas operaciones
      // Ajustar la fecha de endDate a las 23:59:59
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setHours(23, 59, 59);

      // Convertir las fechas a formato ISO para enviarlas al servidor
      const formattedStartDate = startDate.toISOString();
      const formattedEndDate = adjustedEndDate.toISOString();

      fetch(`http://localhost:8000/allusers?startDate=${formattedStartDate}&endDate=${formattedEndDate}`)
        .then((res) => res.json())
        .then((allusers) => setData(allusers))
        .catch((error) => console.error('Error fetching user data:', error));

      fetch(`http://localhost:8000/allgeneralhuespedes?startDate=${formattedStartDate}&endDate=${formattedEndDate}`)
        .then((res) => res.json())
        .then((allgeneralhuespedes) => setDataHuesped(allgeneralhuespedes))
        .catch((error) => console.error('Error fetching user data:', error));

      fetch(`http://localhost:8000/allgeneralvisitantes?startDate=${formattedStartDate}&endDate=${formattedEndDate}`)
        .then((res) => res.json())
        .then((allgeneralvisitantes) => setDataVisitante(allgeneralvisitantes))
        .catch((error) => console.error('Error fetching user data:', error));

      fetch(`http://localhost:8000/allgeneralvetados?startDate=${formattedStartDate}&endDate=${formattedEndDate}`)
        .then((res) => res.json())
        .then((allgeneralvetados) => setDataVetado(allgeneralvetados))
        .catch((error) => console.error('Error fetching user data:', error));
    }
  }, [startDate, endDate]);


  useEffect(() => {
    if (!mostrarHuespedes) {
      // Si el checkbox de Huesped no está marcado, restablecer la selección a 'Huesped'
      setHuespedSeleccionado('Huesped');
    }
  }, [mostrarHuespedes]);

  useEffect(() => {
    if (!mostrarVisitantes) {
      // Si el checkbox de Visitante no está marcado, restablecer la selección a 'Visitante'
      setVisitanteSeleccionado('Visitante');
    }
  }, [mostrarVisitantes]);

  useEffect(() => {
    if (!mostrarVetados) {
      // Si el checkbox de Visitante no está marcado, restablecer la selección a 'Visitante'
      setVetadoSeleccionado('Vetado');
    }
  }, [mostrarVetados]);

  // Nuevo useEffect para obtener la información del usuario seleccionado
  useEffect(() => {
    if (huespedSeleccionado !== 'Huesped') {
      const [id_huesped] = huespedSeleccionado.split(" - "); // Extraer el ID del huésped seleccionado
      fetch(`http://localhost:8000/userinfo/${id_huesped}`)
        .then((res) => res.json())
        .then((userInfo) => setDataUser(userInfo))
        .catch((error) => console.error('Error fetching user info:', error));
    }
  }, [huespedSeleccionado]);

  useEffect(() => {
    if (visitanteSeleccionado !== 'Visitante') {
      const [id_visitante] = visitanteSeleccionado.split(" - "); // Extraer el ID del visitante seleccionado
      fetch(`http://localhost:8000/userinfo/${id_visitante}`)
        .then((res) => res.json())
        .then((userInfo) => setDataUser(userInfo))
        .catch((error) => console.error('Error fetching user info:', error));
    }
  }, [visitanteSeleccionado]);

  useEffect(() => {
    if (vetadoSeleccionado !== 'Vetado') {
      const [id_vetado] = vetadoSeleccionado.split(" - "); // Extraer el ID del visitante seleccionado
      fetch(`http://localhost:8000/userinfo/${id_vetado}`)
        .then((res) => res.json())
        .then((userInfo) => setDataUser(userInfo))
        .catch((error) => console.error('Error fetching user info:', error));
    }
  }, [vetadoSeleccionado]);


  const generatePDF= useReactToPrint ({
    content: ()=>componentPDF.current,
    documentTitle:"UserReport",
    onAfterPrint: ()=>alert("Data saved in PDF")
  });

  // Estado para los servicios individuales
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState({
    desayuno: false,
    comida: false,
    cena: false,
    baño: false,
    hospedaje: false,
    deuda: false,
    vetados: false,
    notas_vetado: false
  });

  // Función para manejar el cambio del checkbox de General
  const handleEsGeneralChange = () => {
    if (!esGeneral) {
      // Si se está marcando General, desmarca Usuario
      setEsUsuario(false);
      setMostrarHuespedes(false); // Ocultar el dropdown de Huespedes al desmarcar Usuarios
      setMostrarVisitantes(false);
      setMostrarVetados(false);
    }
    setEsGeneral(!esGeneral);
  };

    // Función para manejar el cambio del checkbox de Usuario
  const handleEsUsuarioChange = () => {
    if (!esUsuario) {
      // Si se está marcando Usuario, desmarca General y marca Huesped
      setEsGeneral(false);
      setMostrarHuespedes(true);
      setMostrarVisitantes(false);
      setMostrarVetados(false);
    } else {
      // Si se está desmarcando Usuario, restablece el Usuario seleccionado a un valor predeterminado
      setUsuarioSeleccionado('Usuario');
    }
    setEsUsuario(!esUsuario);
  };
  // Función para manejar el cambio del checkbox de Servicios
  const handleEsServicioChange = () => {
    setEsServicio(!esServicio);
    if (!esServicio) {
      // Limpiar los servicios seleccionados si se desmarca el checkbox
      setServiciosSeleccionados({
        desayuno: false,
        comida: false,
        cena: false,
        baño: false,
        hospedaje: false,
        deuda: false,
        vetados: false,
        notas_vetado: false
      });
    }
  };

  // Función para manejar el cambio de los checkboxes de servicios individuales
  const handleServicioChange = (servicio) => {
    setServiciosSeleccionados({
      ...serviciosSeleccionados,
      [servicio]: !serviciosSeleccionados[servicio]
    });
  };

    // Función para manejar la selección de un Usuario en el dropdown
    const handleUsuarioSelect = (nombre) => {
      setUsuarioSeleccionado(nombre);
    };
        // Función para manejar la selección de un Huesped en el dropdown
    const handleHuespedSelect = (huesped) => {
      if (!mostrarHuespedes) {
        // Si el checkbox de Huesped no está marcado, restablecer la selección a 'Huesped'
        setHuespedSeleccionado('Huesped');
      } else {
        // Si se selecciona un Huesped, pero el checkbox está marcado, actualizar la selección
        setHuespedSeleccionado(huesped);
        // Deseleccionar el visitante seleccionado
        if (!mostrarVisitantes) {
          setVisitanteSeleccionado('Visitante');
        }
         // Deseleccionar el vetado seleccionado
        if (!mostrarVetados) {
          setVetadoSeleccionado('Vetado');
        }
      }
    };

    // Función para manejar la selección de un Visitante en el dropdown de Visitante
    const handleVisitanteSelect = (visitante) => {
      if (!mostrarVisitantes) {
        // Si el checkbox de Visitante no está marcado, restablecer la selección a 'Visitante'
        setVisitanteSeleccionado('Visitante');
      } else {
        // Si se selecciona un Visitante, pero el checkbox está marcado, actualizar la selección
        setVisitanteSeleccionado(visitante);
        // Deseleccionar el huésped seleccionado
        if (!mostrarHuespedes) {
          setHuespedSeleccionado('Huesped');
        }
            // Deseleccionar el vetado seleccionado
        if (!mostrarVetados) {
          setVetadoSeleccionado('Vetado');
        }
      }
    };


    // Función para manejar la selección de un Vetado en el dropdown de Vetado
    const handleVetadoSelect = (vetado) => {
      if (!mostrarVetados) {
        // Si el checkbox de Vetado no está marcado, restablecer la selección a 'Vetado'
        setVetadoSeleccionado('Vetado');
      } else {
        // Si se selecciona un Vetado, pero el checkbox está marcado, actualizar la selección
        setVetadoSeleccionado(vetado);
        // Deseleccionar el huesped seleccionado
        if (!mostrarHuespedes) {
          setHuespedSeleccionado('Huesped');
        }
        // Deseleccionar el visitante seleccionado
        if (!mostrarVisitantes) {
          setVisitanteSeleccionado('Visitante');
        }
      }
    };

    return (
      <div className='App_minheight App_minpadding'>
        {/* Div para agrupar los campos de entrada */}
        <div className="universal_container_inputdate">
          {/* Campo de entrada para la fecha 1 */}
          <div className="universal_container_pickerdate">
          <DatePicker
              selected={startDate}
              onChange={date => setStartDate(date)}
              placeholderText="DD/MM/YY"
              className="universal_input_date"
              dateFormat="dd/MM/yy"
              onKeyDown={handleKeyDown} // Intercepta el evento de tecla presionada

            />
          </div>

          {/* Campo de entrada para la fecha 2 */}
          <div className="universal_container_pickerdate">
            <DatePicker
              selected={endDate}
              onChange={date => setEndDate(date)}
              placeholderText="DD/MM/YY"
              className="universal_input_date"
              dateFormat="dd/MM/yy"
              onKeyDown={handleKeyDown} // Intercepta el evento de tecla presionada

            />
          </div>

          <div className="universal_container_checkbox">
            {/* Checkbox para marcar si es General */}
            <div className="universal_margin_formcheck">
              <input
                className="form-check-input"
                type="radio"
                id="esGeneral"
                checked={esGeneral}
                onChange={handleEsGeneralChange}
              />
              <label className="form-check-label universal_label_radio" htmlFor="esGeneral">
                <span className="universal_text_HM">General</span>
              </label>
            </div>

            {/* Checkbox para marcar si es Usuario */}
            <div className="universal_margin_formcheck">
              <input
                className="form-check-input universal_checkbox_HM"
                type="radio"
                id="esUsuario"
                checked={esUsuario}
                onChange={handleEsUsuarioChange}
              />
              <label className="form-check-label universal_label_radio" htmlFor="esUsuario">
                <span className="universal_text_HM">Usuario</span>
              </label>
            </div>

            <div className="universal_margin_formcheck">
              <input
                className="form-check-input universal_checkbox_HM"
                type="checkbox"
                id="esServicio"
                checked={esServicio}
                onChange={handleEsServicioChange}
              />
              <label className="form-check-label universal_label_radio" htmlFor="esServicio">
                <span className="universal_text_HM">Servicios</span>
              </label>
            </div>
          </div>
        </div>


        {esUsuario && (
          <div className="circle-checkboxes-container">
            <div className="universal_margin_formcheck">
              <input
                className="form-check-input universal_checkbox_HM"
                type="radio"
                name="tipoUsuario"
                id="huespedes"
                checked={mostrarHuespedes}
                onChange={() => {
                  setMostrarHuespedes(true);
                  setMostrarVisitantes(false);
                  setMostrarVetados(false);
                }}
              />
              <label className="form-check-label universal_label_radio" htmlFor="huespedes">
                <span className="universal_text_HM">Huespedes</span>
              </label>
            </div>
            <div className="universal_margin_formcheck">
              <input
                className="form-check-input universal_checkbox_HM"
                type="radio"
                name="tipoUsuario"
                id="visitantes"
                checked={mostrarVisitantes}
                onChange={() => {
                  setMostrarHuespedes(false);
                  setMostrarVisitantes(true);
                  setMostrarVetados(false);
                }}
              />
              <label className="form-check-label universal_label_radio" htmlFor="visitantes">
                <span className="universal_text_HM">Visitantes</span>
              </label>
            </div>
            <div className="universal_margin_formcheck">
              <input
                className="form-check-input universal_checkbox_HM"
                type="radio"
                name="tipoUsuario"
                id="vetados"
                checked={mostrarVetados}
                onChange={() => {
                  setMostrarHuespedes(false);
                  setMostrarVisitantes(false);
                  setMostrarVetados(true);
                }}
              />
              <label className="form-check-label universal_label_radio" htmlFor="vetados">
                <span className="universal_text_HM">Vetados</span>
              </label>
            </div>
          </div>
        )}

      {/* Dropdown para Huespedes */}
      {mostrarHuespedes && (
        <div className="universal_container_dropdown">
          <Dropdown onSelect={(eventKey) => handleHuespedSelect(eventKey)}>
            <Dropdown.Toggle variant="success" id="dropdown-basic" className="universal_toggle_dropdown">
              {huespedSeleccionado}
            </Dropdown.Toggle>
            <Dropdown.Menu className="universal_dropdown_custommenu">
              {huespedes.map((huesped) => (
                <Dropdown.Item key={huesped.id_huesped} eventKey={`${huesped.id_huesped} - ${huesped.nombre}  ${huesped.apellidos}`}>
                  {`${huesped.id_huesped} - ${huesped.nombre} ${huesped.apellidos}`}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      )}

      {/* Dropdown para Visitantes */}
      {mostrarVisitantes && (
        <div className="universal_container_dropdown">
          <Dropdown onSelect={(eventKey) => handleVisitanteSelect(eventKey)}>
            <Dropdown.Toggle variant="success" id="dropdown-basic" className="universal_toggle_dropdown">
              {visitanteSeleccionado}
            </Dropdown.Toggle>
            <Dropdown.Menu className="universal_dropdown_custommenu">
              {visitantes.map((visitante) => (
                <Dropdown.Item key={visitante.id_visitante} eventKey={`${visitante.id_visitante} - ${visitante.nombre}  ${visitante.apellidos}`}>
                  {`${visitante.id_visitante} - ${visitante.nombre} ${visitante.apellidos}`}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      )}

      {/* Dropdown para Visitantes */}
      {mostrarVetados && (
        <div className="universal_container_dropdown">
          <Dropdown onSelect={(eventKey) => handleVetadoSelect(eventKey)}>
            <Dropdown.Toggle variant="success" id="dropdown-basic" className="universal_toggle_dropdown">
              {vetadoSeleccionado}
            </Dropdown.Toggle>
            <Dropdown.Menu className="universal_dropdown_custommenu">
              {vetados.map((vetado) => (
                <Dropdown.Item key={vetado.id_vetado} eventKey={`${vetado.id_vetado} - ${vetado.nombre}  ${vetado.apellidos}`}>
                  {`${vetado.id_vetado} - ${vetado.nombre} ${vetado.apellidos}`}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      )}

      {/* Div para los checkboxes de servicios */}
      <div className="universal_container_services">
        {/* Mostrar los checkboxes de servicios si esServicio está marcado */}
        {esServicio && (
          <div className="universal_container2_checkbox">
            {/* Checkbox para cada servicio */}
            <div className="universal_margin_formcheck">
              <input
                className="form-check-input universal_checkbox_HM"
                type="checkbox"
                id="desayuno"
                checked={serviciosSeleccionados.desayuno}
                onChange={() => handleServicioChange('desayuno')}
              />
              <label className="form-check-label universal_label_radio" htmlFor="desayuno">
                <span class="universal_text_HM">Desayuno</span>
              </label>
            </div>
            <div className="universal_margin_formcheck">
              <input
                className="form-check-input universal_checkbox_HM"
                type="checkbox"
                id="comida"
                checked={serviciosSeleccionados.comida}
                onChange={() => handleServicioChange('comida')}
              />
              <label className="form-check-label universal_label_radio" htmlFor="comida">
                <span class="universal_text_HM">Comida</span>
              </label>
            </div>
            <div className="universal_margin_formcheck">
              <input
                className="form-check-input universal_checkbox_HM"
                type="checkbox"
                id="cena"
                checked={serviciosSeleccionados.cena}
                onChange={() => handleServicioChange('cena')}
              />
              <label className="form-check-label universal_label_radio" htmlFor="cena">
                <span class="universal_text_HM">Cena</span>
              </label>
            </div>
            <div className="universal_margin_formcheck">
              <input
                className="form-check-input universal_checkbox_HM"
                type="checkbox"
                id="baño"
                checked={serviciosSeleccionados.baño}
                onChange={() => handleServicioChange('baño')}
              />
              <label className="form-check-label universal_label_radio" htmlFor="baño">
                <span class="universal_text_HM">Baño</span>
              </label>
            </div>
            <div className="universal_margin_formcheck">
              <input
                className="form-check-input universal_checkbox_HM"
                type="checkbox"
                id="hospedaje"
                checked={serviciosSeleccionados.regadera}
                onChange={() => handleServicioChange('regadera')}
              />
              <label className="form-check-label universal_label_radio" htmlFor="regadera">
                <span class="universal_text_HM">Regadera</span>
              </label>
            </div>
            <div className="universal_margin_formcheck">
              <input
                className="form-check-input universal_checkbox_HM"
                type="checkbox"
                id="deuda"
                checked={serviciosSeleccionados.deuda}
                onChange={() => handleServicioChange('deuda')}
              />
              <label className="form-check-label universal_label_radio" htmlFor="deuda">
                <span class="universal_text_HM">Deuda</span>
              </label>
            </div>
            <div className="universal_margin_formcheck">
              <input
                className="form-check-input universal_checkbox_HM"
                type="checkbox"
                id="vetados"
                checked={serviciosSeleccionados.vetados}
                onChange={() => handleServicioChange('vetados')}
              />
              <label className="form-check-label universal_label_radio" htmlFor="vetados">
                <span class="universal_text_HM">Vetados</span>
              </label>
            </div>
            <div className="universal_margin_formcheck">
              <input
                className="form-check-input universal_checkbox_HM"
                type="checkbox"
                id="notas_vetado"
                checked={serviciosSeleccionados.notas_vetado}
                onChange={() => handleServicioChange('notas_vetado')}
              />
              <label className="form-check-label universal_label_radio" htmlFor="notas_vetado">
                <span class="universal_text_HM">Motivo Vetado</span>
              </label>
            </div>
          </div>

        )}
      </div>

      <div ref={componentPDF} style={{width:'100%' , position: 'horizontal'}}>
      <div className="report-container">
        {/* Mostrar los datos en una tabla si esGeneral está marcado */}
        {esGeneral && (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID Cliente</th>
                <th>Tipo Usuario</th>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Sexo</th>
                <th>Lugar de Origen</th>
                <th>Fecha de Ingreso</th>
                <th>Fecha de Salida</th>
                {/* Agregar las columnas adicionales según el servicio seleccionado */}
                {esServicio && serviciosSeleccionados.desayuno && <th>Cantidad Desayuno</th>}
                {esServicio && serviciosSeleccionados.comida && <th>Cantidad Comida</th>}
                {esServicio && serviciosSeleccionados.cena && <th>Cantidad Cena</th>}
                {esServicio && serviciosSeleccionados.baño && <th>Cantidad Baño</th>}
                {esServicio && serviciosSeleccionados.regadera && <th>Cantidad Regadera</th>}
                {esServicio && serviciosSeleccionados.deuda && <th>Total Deuda</th>}
                {esServicio && serviciosSeleccionados.vetados && <th>Vetado</th>}
                {esServicio && serviciosSeleccionados.notas_vetado && <th>Motivo Vetado</th>}

              </tr>
            </thead>
            <tbody>
              {(data.map((item) => (
                <tr key={item.id_cliente}>
                  <td>{item.id_cliente}</td>
                  <td>{item.tipo_usuario}</td>
                  <td>{item.nombre_c}</td>
                  <td>{item.apellidos_c}</td>
                  <td>{item.sexo}</td>
                  <td>{item.lugar_o}</td>
                  <td>{item.fecha_i ? handleDateFormat(item.fecha_i) : ''}</td>
                  <td>{item.fecha_s ? handleDateFormat(item.fecha_s) : ''}</td>
                  {/* Agregar las celdas adicionales según el servicio seleccionado */}
                  {esServicio && serviciosSeleccionados.desayuno && <td>{item.cantidad_desayuno}</td>}
                  {esServicio && serviciosSeleccionados.comida && <td>{item.cantidad_comida}</td>}
                  {esServicio && serviciosSeleccionados.cena && <td>{item.cantidad_cena}</td>}
                  {esServicio && serviciosSeleccionados.baño && <td>{item.cantidad_bano}</td>}
                  {esServicio && serviciosSeleccionados.regadera && <td>{item.cantidad_regadera}</td>}
                  {esServicio && serviciosSeleccionados.deuda && <td>{item.total_deuda}</td>}
                  {esServicio && serviciosSeleccionados.vetados && <td>{item.vetado}</td>}
                  {esServicio && serviciosSeleccionados.notas_vetado && <td>{item.notas_v}</td>}

                </tr>
              )))}
            </tbody>
          </Table>
        )}

        {esUsuario && mostrarHuespedes && huespedSeleccionado == 'Huesped' &&(
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID Cliente</th>
                <th>Tipo Usuario</th>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Sexo</th>
                <th>Lugar de Origen</th>
                <th>Fecha de Ingreso</th>
                <th>Fecha de Salida</th>
                {/* Agregar las columnas adicionales según el servicio seleccionado */}
                {esServicio && serviciosSeleccionados.desayuno && <th>Cantidad Desayuno</th>}
                {esServicio && serviciosSeleccionados.comida && <th>Cantidad Comida</th>}
                {esServicio && serviciosSeleccionados.cena && <th>Cantidad Cena</th>}
                {esServicio && serviciosSeleccionados.baño && <th>Cantidad Baño</th>}
                {esServicio && serviciosSeleccionados.regadera && <th>Cantidad Regadera</th>}
                {esServicio && serviciosSeleccionados.deuda && <th>Total Deuda</th>}
                {esServicio && serviciosSeleccionados.vetados && <th>Vetado</th>}
                {esServicio && serviciosSeleccionados.notas_vetado && <th>Motivo Vetado</th>}
              </tr>
            </thead>
            <tbody>
              {(datahuesped.map((item) => (
                <tr key={item.id_cliente}>
                  <td>{item.id_cliente}</td>
                  <td>{item.tipo_usuario}</td>
                  <td>{item.nombre_c}</td>
                  <td>{item.apellidos_c}</td>
                  <td>{item.sexo}</td>
                  <td>{item.lugar_o}</td>
                  <td>{item.fecha_i ? handleDateFormat(item.fecha_i) : ''}</td>
                  <td>{item.fecha_s ? handleDateFormat(item.fecha_s) : ''}</td>
                  {/* Agregar las celdas adicionales según el servicio seleccionado */}
                  {esServicio && serviciosSeleccionados.desayuno && <td>{item.cantidad_desayuno}</td>}
                  {esServicio && serviciosSeleccionados.comida && <td>{item.cantidad_comida}</td>}
                  {esServicio && serviciosSeleccionados.cena && <td>{item.cantidad_cena}</td>}
                  {esServicio && serviciosSeleccionados.baño && <td>{item.cantidad_bano}</td>}
                  {esServicio && serviciosSeleccionados.regadera && <td>{item.cantidad_regadera}</td>}
                  {esServicio && serviciosSeleccionados.deuda && <td>{item.total_deuda}</td>}
                  {esServicio && serviciosSeleccionados.vetados && <td>{item.vetado}</td>}
                  {esServicio && serviciosSeleccionados.notas_vetado && <td>{item.notas_v}</td>}
                </tr>
              )))}
            </tbody>
          </Table>
        )}




        {esUsuario && mostrarVisitantes && visitanteSeleccionado=='Visitante' && (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID Cliente</th>
                <th>Tipo Usuario</th>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Sexo</th>
                <th>Lugar de Origen</th>
                <th>Fecha de Ingreso</th>
                <th>Fecha de Salida</th>
                {/* Agregar las columnas adicionales según el servicio seleccionado */}
                {esServicio && serviciosSeleccionados.desayuno && <th>Cantidad Desayuno</th>}
                {esServicio && serviciosSeleccionados.comida && <th>Cantidad Comida</th>}
                {esServicio && serviciosSeleccionados.cena && <th>Cantidad Cena</th>}
                {esServicio && serviciosSeleccionados.baño && <th>Cantidad Baño</th>}
                {esServicio && serviciosSeleccionados.regadera && <th>Cantidad Regadera</th>}
                {esServicio && serviciosSeleccionados.deuda && <th>Total Deuda</th>}
                {esServicio && serviciosSeleccionados.vetados && <th>Vetado</th>}
                {esServicio && serviciosSeleccionados.notas_vetado && <th>Motivo Vetado</th>}
              </tr>
            </thead>
            <tbody>
              {(datavisitante.map((item) => (
                <tr key={item.id_cliente}>
                  <td>{item.id_cliente}</td>
                  <td>{item.tipo_usuario}</td>
                  <td>{item.nombre_c}</td>
                  <td>{item.apellidos_c}</td>
                  <td>{item.sexo}</td>
                  <td>{item.lugar_o}</td>
                  <td>{item.fecha_i ? handleDateFormat(item.fecha_i) : ''}</td>
                  <td>{item.fecha_s ? handleDateFormat(item.fecha_s) : ''}</td>
                  {/* Agregar las celdas adicionales según el servicio seleccionado */}
                  {esServicio && serviciosSeleccionados.desayuno && <td>{item.cantidad_desayuno}</td>}
                  {esServicio && serviciosSeleccionados.comida && <td>{item.cantidad_comida}</td>}
                  {esServicio && serviciosSeleccionados.cena && <td>{item.cantidad_cena}</td>}
                  {esServicio && serviciosSeleccionados.baño && <td>{item.cantidad_bano}</td>}
                  {esServicio && serviciosSeleccionados.regadera && <td>{item.cantidad_regadera}</td>}
                  {esServicio && serviciosSeleccionados.deuda && <td>{item.total_deuda}</td>}
                  {esServicio && serviciosSeleccionados.vetados && <td>{item.vetado}</td>}
                  {esServicio && serviciosSeleccionados.notas_vetado && <td>{item.notas_v}</td>}
                </tr>
              )))}
            </tbody>
          </Table>
        )}

      {esUsuario && mostrarVetados && vetadoSeleccionado=='Vetado' && (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID Cliente</th>
                <th>Tipo Usuario</th>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Sexo</th>
                <th>Lugar de Origen</th>
                <th>Fecha de Ingreso</th>
                <th>Fecha de Vetado</th>
                {/* Agregar las columnas adicionales según el servicio seleccionado */}
                {esServicio && serviciosSeleccionados.desayuno && <th>Cantidad Desayuno</th>}
                {esServicio && serviciosSeleccionados.comida && <th>Cantidad Comida</th>}
                {esServicio && serviciosSeleccionados.cena && <th>Cantidad Cena</th>}
                {esServicio && serviciosSeleccionados.baño && <th>Cantidad Baño</th>}
                {esServicio && serviciosSeleccionados.regadera && <th>Cantidad Regadera</th>}
                {esServicio && serviciosSeleccionados.deuda && <th>Total Deuda</th>}
                {esServicio && serviciosSeleccionados.vetados && <th>Vetado</th>}
                {esServicio && serviciosSeleccionados.notas_vetado && <th>Motivo Vetado</th>}
              </tr>
            </thead>
            <tbody>
              {(datavetado.map((item) => (
                <tr key={item.id_cliente}>
                  <td>{item.id_cliente}</td>
                  <td>{item.tipo_usuario}</td>
                  <td>{item.nombre_c}</td>
                  <td>{item.apellidos_c}</td>
                  <td>{item.sexo}</td>
                  <td>{item.lugar_o}</td>
                  <td>{item.fecha_i ? handleDateFormat(item.fecha_i) : ''}</td>
                  <td>{item.fecha_s ? handleDateFormat(item.fecha_s) : ''}</td>
                  {/* Agregar las celdas adicionales según el servicio seleccionado */}
                  {esServicio && serviciosSeleccionados.desayuno && <td>{item.cantidad_desayuno}</td>}
                  {esServicio && serviciosSeleccionados.comida && <td>{item.cantidad_comida}</td>}
                  {esServicio && serviciosSeleccionados.cena && <td>{item.cantidad_cena}</td>}
                  {esServicio && serviciosSeleccionados.baño && <td>{item.cantidad_bano}</td>}
                  {esServicio && serviciosSeleccionados.regadera && <td>{item.cantidad_regadera}</td>}
                  {esServicio && serviciosSeleccionados.deuda && <td>{item.total_deuda}</td>}
                  {esServicio && serviciosSeleccionados.vetados && <td>{item.vetado}</td>}
                  {esServicio && serviciosSeleccionados.notas_vetado && <td>{item.notas_v}</td>}
                </tr>
              )))}
            </tbody>
          </Table>
        )}
      {esUsuario && mostrarHuespedes && huespedSeleccionado !== 'Huesped' &&(
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID Cliente</th>
                <th>Tipo Usuario</th>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Sexo</th>
                <th>Lugar de Origen</th>
                <th>Fecha de Ingreso</th>
                <th>Fecha de Salida</th>
                {/* Agregar las columnas adicionales según el servicio seleccionado */}
                {esServicio && serviciosSeleccionados.desayuno && <th>Cantidad Desayuno</th>}
                {esServicio && serviciosSeleccionados.comida && <th>Cantidad Comida</th>}
                {esServicio && serviciosSeleccionados.cena && <th>Cantidad Cena</th>}
                {esServicio && serviciosSeleccionados.baño && <th>Cantidad Baño</th>}
                {esServicio && serviciosSeleccionados.regadera && <th>Cantidad Regadera</th>}
                {esServicio && serviciosSeleccionados.deuda && <th>Total Deuda</th>}
                {esServicio && serviciosSeleccionados.vetados && <th>Vetado</th>}
                {esServicio && serviciosSeleccionados.notas_vetado && <th>Motivo Vetado</th>}

              </tr>
            </thead>
            <tbody>
              {(datauser.map((item) => (
                <tr key={item.id_cliente}>
                  <td>{item.id_cliente}</td>
                  <td>{item.tipo_usuario}</td>
                  <td>{item.nombre_c}</td>
                  <td>{item.apellidos_c}</td>
                  <td>{item.sexo}</td>
                  <td>{item.lugar_o}</td>
                  <td>{item.fecha_i ? handleDateFormat(item.fecha_i): ''}</td>
                  <td>{item.fecha_s ? handleDateFormat(item.fecha_s):'' }</td>
                  {/* Agregar las celdas adicionales según el servicio seleccionado */}
                  {esServicio && serviciosSeleccionados.desayuno && <td>{item.cantidad_desayuno}</td>}
                  {esServicio && serviciosSeleccionados.comida && <td>{item.cantidad_comida}</td>}
                  {esServicio && serviciosSeleccionados.cena && <td>{item.cantidad_cena}</td>}
                  {esServicio && serviciosSeleccionados.baño && <td>{item.cantidad_bano}</td>}
                  {esServicio && serviciosSeleccionados.regadera && <td>{item.cantidad_regadera}</td>}
                  {esServicio && serviciosSeleccionados.deuda && <td>{item.total_deuda}</td>}
                  {esServicio && serviciosSeleccionados.vetados && <td>{item.vetado}</td>}
                  {esServicio && serviciosSeleccionados.notas_vetado && <td>{item.notas_v}</td>}

                </tr>
              )))}
            </tbody>
          </Table>
        )}



        {esUsuario && mostrarVisitantes && visitanteSeleccionado !== 'Visitante' &&(
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID Cliente</th>
                <th>Tipo Usuario</th>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Sexo</th>
                <th>Lugar de Origen</th>
                <th>Fecha de Ingreso</th>
                <th>Fecha de Salida</th>
                {/* Agregar las columnas adicionales según el servicio seleccionado */}
                {esServicio && serviciosSeleccionados.desayuno && <th>Cantidad Desayuno</th>}
                {esServicio && serviciosSeleccionados.comida && <th>Cantidad Comida</th>}
                {esServicio && serviciosSeleccionados.cena && <th>Cantidad Cena</th>}
                {esServicio && serviciosSeleccionados.baño && <th>Cantidad Baño</th>}
                {esServicio && serviciosSeleccionados.regadera && <th>Cantidad Regadera</th>}
                {esServicio && serviciosSeleccionados.deuda && <th>Total Deuda</th>}
                {esServicio && serviciosSeleccionados.vetados && <th>Vetado</th>}
                {esServicio && serviciosSeleccionados.notas_vetado && <th>Motivo Vetado</th>}

              </tr>
            </thead>
            <tbody>
              {(datauser.map((item) => (
                <tr key={item.id_cliente}>
                  <td>{item.id_cliente}</td>
                  <td>{item.tipo_usuario}</td>
                  <td>{item.nombre_c}</td>
                  <td>{item.apellidos_c}</td>
                  <td>{item.sexo}</td>
                  <td>{item.lugar_o}</td>
                  <td>{item.fecha_i ? handleDateFormat(item.fecha_i): ''}</td>
                  <td>{item.fecha_s ? handleDateFormat(item.fecha_s):'' }</td>
                  {/* Agregar las celdas adicionales según el servicio seleccionado */}
                  {esServicio && serviciosSeleccionados.desayuno && <td>{item.cantidad_desayuno}</td>}
                  {esServicio && serviciosSeleccionados.comida && <td>{item.cantidad_comida}</td>}
                  {esServicio && serviciosSeleccionados.cena && <td>{item.cantidad_cena}</td>}
                  {esServicio && serviciosSeleccionados.baño && <td>{item.cantidad_bano}</td>}
                  {esServicio && serviciosSeleccionados.regadera && <td>{item.cantidad_regadera}</td>}
                  {esServicio && serviciosSeleccionados.deuda && <td>{item.total_deuda}</td>}
                  {esServicio && serviciosSeleccionados.vetados && <td>{item.vetado}</td>}
                  {esServicio && serviciosSeleccionados.notas_vetado && <td>{item.notas_v}</td>}

                </tr>
              )))}
            </tbody>
          </Table>
        )}

      {esUsuario && mostrarVetados && vetadoSeleccionado !== 'Vetado' &&(
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID Cliente</th>
                <th>Tipo Usuario</th>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Sexo</th>
                <th>Lugar de Origen</th>
                <th>Fecha de Ingreso</th>
                <th>Fecha de Salida</th>
                {/* Agregar las columnas adicionales según el servicio seleccionado */}
                {esServicio && serviciosSeleccionados.desayuno && <th>Cantidad Desayuno</th>}
                {esServicio && serviciosSeleccionados.comida && <th>Cantidad Comida</th>}
                {esServicio && serviciosSeleccionados.cena && <th>Cantidad Cena</th>}
                {esServicio && serviciosSeleccionados.baño && <th>Cantidad Baño</th>}
                {esServicio && serviciosSeleccionados.regadera && <th>Cantidad Regadera</th>}
                {esServicio && serviciosSeleccionados.deuda && <th>Total Deuda</th>}
                {esServicio && serviciosSeleccionados.vetados && <th>Vetado</th>}
                {esServicio && serviciosSeleccionados.notas_vetado && <th>Motivo Vetado</th>}

              </tr>
            </thead>
            <tbody>
              {(datauser.map((item) => (
                <tr key={item.id_cliente}>
                  <td>{item.id_cliente}</td>
                  <td>{item.tipo_usuario}</td>
                  <td>{item.nombre_c}</td>
                  <td>{item.apellidos_c}</td>
                  <td>{item.sexo}</td>
                  <td>{item.lugar_o}</td>
                  <td>{item.fecha_i ? handleDateFormat(item.fecha_i): ''}</td>
                  <td>{item.fecha_s ? handleDateFormat(item.fecha_s):'' }</td>
                  {/* Agregar las celdas adicionales según el servicio seleccionado */}
                  {esServicio && serviciosSeleccionados.desayuno && <td>{item.cantidad_desayuno}</td>}
                  {esServicio && serviciosSeleccionados.comida && <td>{item.cantidad_comida}</td>}
                  {esServicio && serviciosSeleccionados.cena && <td>{item.cantidad_cena}</td>}
                  {esServicio && serviciosSeleccionados.baño && <td>{item.cantidad_bano}</td>}
                  {esServicio && serviciosSeleccionados.regadera && <td>{item.cantidad_regadera}</td>}
                  {esServicio && serviciosSeleccionados.deuda && <td>{item.total_deuda}</td>}
                  {esServicio && serviciosSeleccionados.vetados && <td>{item.vetado}</td>}
                  {esServicio && serviciosSeleccionados.notas_vetado && <td>{item.notas_v}</td>}

                </tr>
              )))}
            </tbody>
          </Table>
        )}

      </div>
      </div>
      <div className="universal_button_export">
        {/* Botón de exportar reporte a PDF */}
        <button type="button" className="App_buttonaccept" onClick={ generatePDF}>
          Exportar a PDF
        </button>
      </div>
    </div>
  );
};

export default ReportsAdmin;
