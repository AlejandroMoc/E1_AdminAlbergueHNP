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
  const [esIngreso, setEsIngreso] = useState(false); // Nuevo estado para el checkbox "Servicios"
  const [data, setData] = useState([{id_cliente: 0, tipo_usuario: '', nombre_c: '', apellidos_c: '', sexo: '', lugar_o: '', fecha_i: '', fecha_s: '', cantidad_regadera: '', cantidad_bano: '', cantidad_desayuno: '', cantidad_comida: '', cantidad_cena: '', notas_cliente: '', notas_v:'', total_deuda: '' }]); // Estado para almacenar los datos de la consulta
  const [datahuesped, setDataHuesped] = useState([{id_cliente: 0, tipo_usuario: '', nombre_c: '', apellidos_c: '', sexo: '', lugar_o: '', fecha_i: '', fecha_s: '', cantidad_regadera: '', cantidad_bano: '', cantidad_desayuno: '', cantidad_comida: '', cantidad_cena: '', notas_cliente: '', notas_v:'', total_deuda: '' }]); // Estado para almacenar los datos de la consulta
  const [datavisitante, setDataVisitante] = useState([{id_cliente: 0, tipo_usuario: '', nombre_c: '', apellidos_c: '', sexo: '', lugar_o: '', fecha_i: '', fecha_s: '', cantidad_regadera: '', cantidad_bano: '', cantidad_desayuno: '', cantidad_comida: '', cantidad_cena: '', notas_cliente: '', notas_v:'', total_deuda: '' }]); // Estado para almacenar los datos de la consulta
  const [datavetado, setDataVetado] = useState([{id_cliente: 0, tipo_usuario: '', nombre_c: '', apellidos_c: '', sexo: '', lugar_o: '', fecha_i: '', fecha_s: '', cantidad_regadera: '', cantidad_bano: '', cantidad_desayuno: '', cantidad_comida: '', cantidad_cena: '', notas_cliente:'', notas_v:'',total_deuda: '' }]); // Estado para almacenar los datos de la consulta
  const [datauser, setDataUser] = useState([{id_cliente: 0, tipo_usuario: '', nombre_c: '', apellidos_c: '', sexo: '', lugar_o: '', fecha_i: '', fecha_s: '', cantidad_regadera: '', cantidad_bano: '', cantidad_desayuno: '', cantidad_comida: '', cantidad_cena: '', notas_cliente:'',notas_v:'', total_deuda: '' }]); // Estado para almacenar los datos de la consulta
  const [dataingreso, setDataIngreso] = useState({fecha_inicio: '', fecha_fin:'', total_pagado: '', total_condonado:'', ingresos_reales:''}); // Estado para almacenar los datos de la consulta

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
      
      // Fetch para obtener todos los pagos
      fetch('http://localhost:8000/allingresos')
        .then((res) => res.json())
        .then((allingresos) => setDataIngreso(allingresos));
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
      
      fetch(`http://localhost:8000/allingresos?startDate=${formattedStartDate}&endDate=${formattedEndDate}`)
        .then((res) => res.json())
        .then((allingresos) => setDataIngreso(allingresos))
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

  const [showTitlesInPDF, setShowTitlesInPDF] = useState(false);

const getTitle = () => {
  if (showTitlesInPDF) {
    return "Título del reporte";
  }
  return "";
};

const generatePDF = useReactToPrint({
  content: () => {
    const pdfContent = componentPDF.current.cloneNode(true); // Clonamos el contenido para evitar cambios en la página
    const titleContainer = document.createElement('div'); // Creamos un contenedor para el título y la imagen
    const subtitleContainer = document.createElement('div'); // Creamos un contenedor para el título y la imagen

    titleContainer.classList.add('reports_title_container'); // Agregamos la clase al contenedor
    subtitleContainer.classList.add('reports_title_container');

    const titleElement = document.createElement('h1'); // Creamos un elemento h1 para el título
    titleElement.classList.add('reports_title_element'); // Agregamos la clase al título

    let reportType = "Reporte General Albergue HNP";
    if (esUsuario && mostrarHuespedes && huespedSeleccionado == 'Huesped') {
      reportType = "Reporte de Huéspedes del Albergue HNP";
    } else if (esUsuario && mostrarVisitantes && visitanteSeleccionado == 'Visitante') {
      reportType = "Reporte de Visitantes del Albergue HNP";
    } else if (esUsuario && mostrarVetados && vetadoSeleccionado == 'Vetado') {
      reportType = "Reporte de Vetados del Albergue HNP";
    }  else if (esUsuario && mostrarHuespedes && huespedSeleccionado !== 'Huesped') {
      reportType = "Reporte de Huésped del Albergue HNP";
    }  else if (esUsuario && mostrarVisitantes && visitanteSeleccionado !== 'Visitante') {
      reportType = "Reporte de Visitante del Albergue HNP";
    }  else if (esUsuario && mostrarVetados && vetadoSeleccionado !== 'Vetado') {
      reportType = "Reporte de Vetado del Albergue HNP";
    } else if (esIngreso) {
      reportType = "Reporte de Ingresos del Albergue HNP";
    }

    titleElement.innerText = reportType; // Establecemos el texto del título

        // Agregar el texto de rango de fechas si se cumplen las condiciones
      if ((esGeneral || (esUsuario && mostrarHuespedes && huespedSeleccionado === 'Huesped') || 
      (esUsuario && mostrarVisitantes && visitanteSeleccionado === 'Visitante') || 
      (esUsuario && mostrarVetados && vetadoSeleccionado === 'Vetado') || esIngreso) && startDate && endDate) {
        const dateRangeElement = document.createElement('p');
        dateRangeElement.classList.add('title-element2')
        const formattedDateRange = `Rango de fechas del reporte: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
        dateRangeElement.innerText = formattedDateRange;
        subtitleContainer.appendChild(dateRangeElement);
      }


    // Crear la imagen
    const imageElement = document.createElement('img');
    imageElement.src = '/logo192.png'; // Reemplaza 'ruta/a/tu/imagen.png' con la ruta real de tu imagen
    imageElement.alt = 'Descripción de la imagen'; // Proporciona una descripción opcional para la imagen
    imageElement.classList.add('reports_image_element'); // Agregamos la clase a la imagen

    // Crear un elemento p para el texto adicional
    const generatedElement = document.createElement('p');
    generatedElement.innerText = `Generado el ${getCurrentDateTime()}`; // Aquí obtendrás la fecha y hora actual
    generatedElement.classList.add('reports_generated_element'); // Agregamos la clase al texto generado

    // Añadir el contenedor del título y la imagen al contenido del PDF
    titleContainer.appendChild(titleElement);
    titleContainer.appendChild(imageElement);

    pdfContent.insertBefore(subtitleContainer, pdfContent.firstChild); // Insertamos el texto adicional antes del contenedor
    pdfContent.insertBefore(titleContainer, pdfContent.firstChild); // Insertamos el contenedor al principio del contenido
    pdfContent.insertBefore(generatedElement, pdfContent.firstChild); // Insertamos el texto adicional antes del contenedor

    return pdfContent; // Devolvemos el contenido modificado
  },
  documentTitle: "",
  //Top Right Bottom Left
  pageStyle: '@page { size: auto; margin: 0mm 5mm 0mm 5mm; } @media print { body { -webkit-print-color-adjust: exact; } }',
  onAfterPrint: () => alert("Reporte guardado en PDF.")
});

// Función para obtener la fecha y hora actual en el formato deseado
const getCurrentDateTime = () => {
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`; // Formato: DD/MM/YYYY
  //Convertir segundos a dos digitos si se necesita:
  if (currentDate.getSeconds < 10){
    const formattedTime = `${currentDate.getHours()}:${currentDate.getMinutes()}:0${currentDate.getSeconds()}`;
    return `${formattedDate} a la hora ${formattedTime}`;
  }else{
    const formattedTime = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`; // Formato: HH:MM:SS
    return `${formattedDate} a la hora ${formattedTime}`;
  }
};

  // Estado para los servicios individuales
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState({
    desayuno: false,
    comida: false,
    cena: false,
    baño: false,
    hospedaje: false,
    deuda: false,
    notas_cliente: false,
  });

  // Función para manejar el cambio del checkbox de General
  const handleEsGeneralChange = () => {
    if (!esGeneral) {
      // Si se está marcando General, desmarca Usuario
      setEsUsuario(false);
      setEsIngreso(false);
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
      setEsIngreso(false);
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
    // Si el checkbox de ingreso está marcado, no permitir seleccionar el checkbox de servicios
    if (esIngreso) {
      return;
    }
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
        notas_cliente: false,
      });
    }
  };

  const handleEsIngresoChange = () => {
    if (!esIngreso) {
      // Si se está marcando Ingreso, desmarca General, Usuario y Servicio
      setEsGeneral(false);
      setEsUsuario(false);
      setMostrarHuespedes(false);
      setMostrarVisitantes(false);
      setMostrarVetados(false);
      setEsServicio(false);
      // Limpiar los servicios seleccionados si se marca el checkbox de ingreso
      setServiciosSeleccionados({
        desayuno: false,
        comida: false,
        cena: false,
        baño: false,
        hospedaje: false,
        deuda: false,
        notas_cliente: false,
      });
    } else {
      // Si se está desmarcando Ingreso, no es necesario realizar ninguna acción adicional
    }
    setEsIngreso(!esIngreso);
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
      <div className='App_minheight App_minpadding reports_container_services'>
        {/* Div para agrupar los campos de entrada */}
        <div className="universal_container_inputdate">
          {/* Campo de entrada para la fecha 1 */}
          <div className="universal_container_pickerdate">
          <DatePicker
              selected={startDate}
              onChange={date => setStartDate(date)}
              placeholderText='Inicio (DD/MM/YY)'
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
              placeholderText='Fin (DD/MM/YY)'
              className="universal_input_date"
              dateFormat="dd/MM/yy"
              onKeyDown={handleKeyDown} // Intercepta el evento de tecla presionada

            />
          </div>

          <div className="universal_container_checkbox">
            {/* Checkbox para marcar si es General */}
            <div className="reports_margin_formcheck">
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
            <div className="reports_margin_formcheck">
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

            <div className="reports_margin_formcheck">
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

             {/* Checkbox para marcar si es Ingreso */}
             <div className="reports_margin_formcheck">
              <input
                className="form-check-input universal_checkbox_HM"
                type="radio"
                id="esIngreso"
                checked={esIngreso}
                onChange={handleEsIngresoChange}
              />
              <label className="form-check-label universal_label_radio" htmlFor="esIngreso">
                <span className="universal_text_HM">Ingresos</span>
              </label>
            </div>
          </div>
        </div>


        {esUsuario && (
          <div className="reports_flex_checkboxes">
            <div className="reports_margin_formcheck">
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
            <div className="reports_margin_formcheck">
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
            <div className="reports_margin_formcheck">
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
            <Dropdown.Menu className="reports_dropdown_custommenu">
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
            <Dropdown.Menu className="reports_dropdown_custommenu">
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
            <Dropdown.Menu className="reports_dropdown_custommenu">
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
      <div className="reports_container_services">
        {/* Mostrar los checkboxes de servicios si esServicio está marcado */}
        {esServicio && (
          <div className="universal_container_checkbox">
            {/* Checkbox para cada servicio */}
            <div className="reports_margin_formcheck">
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
            <div className="reports_margin_formcheck">
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
            <div className="reports_margin_formcheck">
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
            <div className="reports_margin_formcheck">
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
            <div className="reports_margin_formcheck">
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
            <div className="reports_margin_formcheck">
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
            <div className="reports_margin_formcheck">
              <input
                className="form-check-input universal_checkbox_HM"
                type="checkbox"
                id="notas_cliente"
                checked={serviciosSeleccionados.notas_cliente}
                onChange={() => handleServicioChange('notas_cliente')}
              />
              <label className="form-check-label universal_label_radio" htmlFor="notas_cliente">
                <span class="universal_text_HM">Notas</span>
              </label>
            </div>
           
          </div>

        )}
      </div>

      <div ref={componentPDF} style={{width:'100%' , position: 'horizontal'}}>
      <div>
      <h1>{getTitle()}</h1>
         {/* Mostrar los datos en una tabla si esIngreso está marcado */}
         {esIngreso && (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Rango de Fechas</th>
                <th>Fecha Primer Pago</th>
                <th>Fecha Último Pago</th>
                <th>Total Pagado</th>
                <th>Total Condonado</th>
                <th>Ingresos Reales</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{startDate && endDate ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}` : '-'}</td>
                <td>{dataingreso.fecha_inicio ? handleDateFormat(dataingreso.fecha_inicio) : ''}</td>
                <td>{dataingreso.fecha_fin ? handleDateFormat(dataingreso.fecha_fin) : ''}</td>
                <td>{dataingreso.total_pagado}</td>
                <td>{dataingreso.total_condonado}</td>
                <td>{dataingreso.ingresos_reales}</td>
              </tr>
            </tbody>
          </Table>
        )}

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
                {esServicio && serviciosSeleccionados.notas_cliente && <th>Notas</th>}

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
                  {esServicio && serviciosSeleccionados.notas_cliente && <td>{item.notas_cliente}</td>}

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
                {esServicio && serviciosSeleccionados.notas_cliente && <th>Notas</th>}
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
                  {esServicio && serviciosSeleccionados.notas_cliente && <td>{item.notas_cliente}</td>}
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
                {esServicio && serviciosSeleccionados.notas_cliente && <th>Notas</th>}
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
                  {esServicio && serviciosSeleccionados.notas_cliente && <td>{item.notas_cliente}</td>}
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
              <th>Motivo Vetado</th>
              {/* Agregar las columnas adicionales según el servicio seleccionado */}
              {esServicio && serviciosSeleccionados.desayuno && <th>Cantidad Desayuno</th>}
              {esServicio && serviciosSeleccionados.comida && <th>Cantidad Comida</th>}
              {esServicio && serviciosSeleccionados.cena && <th>Cantidad Cena</th>}
              {esServicio && serviciosSeleccionados.baño && <th>Cantidad Baño</th>}
              {esServicio && serviciosSeleccionados.regadera && <th>Cantidad Regadera</th>}
              {esServicio && serviciosSeleccionados.deuda && <th>Total Deuda</th>}
              {esServicio && serviciosSeleccionados.notas_cliente && <th>Notas</th>}

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
                <td>{item.fecha_i ? handleDateFormat(item.fecha_i): ''}</td>
                <td>{item.fecha_s ? handleDateFormat(item.fecha_s):'' }</td>
                <td>{item.notas_v}</td>
                {/* Agregar las celdas adicionales según el servicio seleccionado */}
                {esServicio && serviciosSeleccionados.desayuno && <td>{item.cantidad_desayuno}</td>}
                {esServicio && serviciosSeleccionados.comida && <td>{item.cantidad_comida}</td>}
                {esServicio && serviciosSeleccionados.cena && <td>{item.cantidad_cena}</td>}
                {esServicio && serviciosSeleccionados.baño && <td>{item.cantidad_bano}</td>}
                {esServicio && serviciosSeleccionados.regadera && <td>{item.cantidad_regadera}</td>}
                {esServicio && serviciosSeleccionados.deuda && <td>{item.total_deuda}</td>}
                {esServicio && serviciosSeleccionados.notas_cliente && <td>{item.notas_cliente}</td>}

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
                {esServicio && serviciosSeleccionados.notas_cliente && <th>Notas</th>}

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
                  {esServicio && serviciosSeleccionados.notas_cliente && <td>{item.notas_cliente}</td>}

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
                {esServicio && serviciosSeleccionados.notas_cliente && <th>Notas</th>}

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
                  {esServicio && serviciosSeleccionados.notas_cliente && <td>{item.notas_cliente}</td>}

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
                <th>Fecha de Vetado</th>
                <th>Motivo Vetado</th>
                {/* Agregar las columnas adicionales según el servicio seleccionado */}
                {esServicio && serviciosSeleccionados.desayuno && <th>Cantidad Desayuno</th>}
                {esServicio && serviciosSeleccionados.comida && <th>Cantidad Comida</th>}
                {esServicio && serviciosSeleccionados.cena && <th>Cantidad Cena</th>}
                {esServicio && serviciosSeleccionados.baño && <th>Cantidad Baño</th>}
                {esServicio && serviciosSeleccionados.regadera && <th>Cantidad Regadera</th>}
                {esServicio && serviciosSeleccionados.deuda && <th>Total Deuda</th>}
                {esServicio && serviciosSeleccionados.notas_cliente && <th>Notas</th>}

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
                  <td>{item.notas_v}</td>
                  {/* Agregar las celdas adicionales según el servicio seleccionado */}
                  {esServicio && serviciosSeleccionados.desayuno && <td>{item.cantidad_desayuno}</td>}
                  {esServicio && serviciosSeleccionados.comida && <td>{item.cantidad_comida}</td>}
                  {esServicio && serviciosSeleccionados.cena && <td>{item.cantidad_cena}</td>}
                  {esServicio && serviciosSeleccionados.baño && <td>{item.cantidad_bano}</td>}
                  {esServicio && serviciosSeleccionados.regadera && <td>{item.cantidad_regadera}</td>}
                  {esServicio && serviciosSeleccionados.deuda && <td>{item.total_deuda}</td>}
                  {esServicio && serviciosSeleccionados.notas_cliente && <td>{item.notas_cliente}</td>}

                </tr>
              )))}
            </tbody>
          </Table>
        )}


      </div>
      </div>
      <div className="reports_button_export">
        {/* Botón de exportar reporte a PDF */}
        <button type="button" className="App_buttonaccept" onClick={ generatePDF}>
          Exportar a PDF
        </button>
      </div>
    </div>
  );
};

export default ReportsAdmin;
