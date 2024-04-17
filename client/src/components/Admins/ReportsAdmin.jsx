import React, { useState } from 'react';
import './HomeAdmin.scss'; // Importa tu archivo CSS aquí
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import DatePicker from 'react-datepicker'; // Importar react-datepicker
import 'react-datepicker/dist/react-datepicker.css'; // Estilos de react-datepicker

const ReportsAdmin = () => {
  // Estado para almacenar las fechas
  const [fecha1, setFecha1] = useState(null);
  const [fecha2, setFecha2] = useState(null);
  const [esHuesped, setEsHuesped] = useState(false);
  const [huéspedSeleccionado, setHuéspedSeleccionado] = useState('Huésped'); // Estado para almacenar el nombre del huésped seleccionado
  const [esGeneral, setEsGeneral] = useState(true); // Nuevo estado para el checkbox "General"
  const [esServicio, setEsServicio] = useState(false); // Nuevo estado para el checkbox "Servicios"

  // Estado para los servicios individuales
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState({
    desayuno: false,
    comida: false,
    cena: false,
    baño: false,
    hospedaje: false,
    deuda: false,
    vetados: false
  });

  // Función para manejar el cambio del checkbox de General
  const handleEsGeneralChange = () => {
    if (!esGeneral) {
      // Si se está marcando General, desmarca Huésped
      setEsHuesped(false);
    }
    setEsGeneral(!esGeneral);
  };

   // Función para manejar el cambio del checkbox de Huésped
  const handleEsHuespedChange = () => {
    if (!esHuesped) {
      // Si se está marcando Huésped, desmarca General
      setEsGeneral(false);
    } else {
      // Si se está desmarcando Huésped, restablece el huésped seleccionado a un valor predeterminado
      setHuéspedSeleccionado('Huésped');
    }
    setEsHuesped(!esHuesped);
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
        vetados: false
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

  // Función para manejar la selección de un huésped en el dropdown
  const handleHuéspedSelect = (nombre) => {
    setHuéspedSeleccionado(nombre);
  };

  return (
    <div className='App-minheight App-minpadding'>
      {/* Div para agrupar los campos de entrada */}
      <div className="fecha-input-container">
        {/* Campo de entrada para la fecha 1 */}
        <div className="fecha-picker-container">
          <DatePicker
            selected={fecha1}
            onChange={date => setFecha1(date)}
            placeholderText="DD/MM/YY"
            className="fecha-input"
            dateFormat="dd/MM/yy" // Cambia el formato de la fecha
          />
        </div>

        {/* Campo de entrada para la fecha 2 */}
        <div className="fecha-picker-container">
          <DatePicker
            selected={fecha2}
            onChange={date => setFecha2(date)}
            placeholderText="DD/MM/YY"
            className="fecha-input"
            dateFormat="dd/MM/yy" // Cambia el formato de la fecha
          />
        </div>

        <div className="checkbox-container">
        {/* Checkbox para marcar si es General */}
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            id="esGeneral"
            checked={esGeneral}
            onChange={handleEsGeneralChange}
          />
          <label className="form-check-label labelRadio" htmlFor="esGeneral">
          <span class="textoHM">General</span>
          </label>
        </div>

        {/* Checkbox para marcar si es huésped */}
        <div className="form-check">
          <input
            className="form-check-input checkboxHM"
            type="radio"
            id="esHuesped"
            checked={esHuesped}
            onChange={handleEsHuespedChange}
          />
          <label className="form-check-label labelRadio" htmlFor="esHuesped">
            <span class="textoHM">Huésped</span>
          </label>
        </div>

        <div className="form-check">
          <input
            className="form-check-input checkboxHM"
            type="checkbox"
            id="esServicio"
            checked={esServicio}
            onChange={handleEsServicioChange}
          />
          <label className="form-check-label labelRadio" htmlFor="esServicio">
            <span class="textoHM">Servicios</span>
          </label>
          </div>
        </div>
      </div>

      {/* Div para el dropdown de huésped */}
      <div className="dropdown-container">
        {/* Dropdown que se muestra si es huésped */}
        {esHuesped && (
          <Dropdown onSelect={(eventKey) => handleHuéspedSelect(eventKey)}>
            <Dropdown.Toggle variant="success" id="dropdown-basic" className="dropdown-toggle-custom">
              {huéspedSeleccionado}
            </Dropdown.Toggle>
            <Dropdown.Menu  className="dropdown-menu-custom">
              <Dropdown.Item eventKey="34 - Gianpiero Chiellini">34 - Gianpiero Chiellini</Dropdown.Item>
              <Dropdown.Item eventKey="25 - Juan Rosas">25 - Juan Rosas</Dropdown.Item>
              <Dropdown.Item eventKey="53 - Rodri Mere">59 - Rodri Mere</Dropdown.Item>
              <Dropdown.Item eventKey="31 - Carlito Pere">31 - Carlito Pere</Dropdown.Item>
              <Dropdown.Item eventKey="15 - Juan Rosas">15 - Juan Rosas</Dropdown.Item>
              <Dropdown.Item eventKey="9 - Rodri Mere">9 - Rodri Mere</Dropdown.Item>
              <Dropdown.Item eventKey="14 - Gianpiero Chiellini">14 - Gianpiero Chiellini</Dropdown.Item>
              <Dropdown.Item eventKey="5 - Juan Rosas">25 - Juan Rosas</Dropdown.Item>
              <Dropdown.Item eventKey="51 - Rodri Mere">59 - Rodri Mere</Dropdown.Item>
              <Dropdown.Item eventKey="33 - Gianpiero Chiellini">34 - Gianpiero Chiellini</Dropdown.Item>
              <Dropdown.Item eventKey="22 - Juan Rosas">25 - Juan Rosas</Dropdown.Item>
              <Dropdown.Item eventKey="50 - Rodri Mere">59 - Rodri Mere</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>

      {/* Div para los checkboxes de servicios */}
      <div className="servicios-container">
        {/* Mostrar los checkboxes de servicios si esServicio está marcado */}
        {esServicio && (
          <div className="checkbox-container2">
            {/* Checkbox para cada servicio */}
            <div className="form-check">
              <input
                className="form-check-input checkboxHM"
                type="checkbox"
                id="desayuno"
                checked={serviciosSeleccionados.desayuno}
                onChange={() => handleServicioChange('desayuno')}
              />
              <label className="form-check-label labelRadio" htmlFor="desayuno">
                <span class="textoHM">Desayuno</span>
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input checkboxHM"
                type="checkbox"
                id="comida"
                checked={serviciosSeleccionados.comida}
                onChange={() => handleServicioChange('comida')}
              />
              <label className="form-check-label labelRadio" htmlFor="comida">
                <span class="textoHM">Comida</span>
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input checkboxHM"
                type="checkbox"
                id="cena"
                checked={serviciosSeleccionados.cena}
                onChange={() => handleServicioChange('cena')}
              />
              <label className="form-check-label labelRadio" htmlFor="cena">
                <span class="textoHM">Cena</span>
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input checkboxHM"
                type="checkbox"
                id="baño"
                checked={serviciosSeleccionados.baño}
                onChange={() => handleServicioChange('baño')}
              />
              <label className="form-check-label labelRadio" htmlFor="baño">
                <span class="textoHM">Baño</span>
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input checkboxHM"
                type="checkbox"
                id="hospedaje"
                checked={serviciosSeleccionados.hospedaje}
                onChange={() => handleServicioChange('hospedaje')}
              />
              <label className="form-check-label labelRadio" htmlFor="hospedaje">
                <span class="textoHM">Hospedaje</span>
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input checkboxHM"
                type="checkbox"
                id="deuda"
                checked={serviciosSeleccionados.deuda}
                onChange={() => handleServicioChange('deuda')}
              />
              <label className="form-check-label labelRadio" htmlFor="deuda">
                <span class="textoHM">Deuda</span>
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input checkboxHM"
                type="checkbox"
                id="vetados"
                checked={serviciosSeleccionados.vetados}
                onChange={() => handleServicioChange('vetados')}
              />
              <label className="form-check-label labelRadio" htmlFor="vetados">
                <span class="textoHM">Vetados</span>
              </label>
            </div>
          </div>

        )}
      </div>

      <div className="report-container">
        {/* Input rectángulo gris */}
        <input
          type="text"
          className="gray-rectangle-input"
        />
      </div>
      <div className="export-button">
        {/* Botón de exportar reporte a PDF */}
        <button type="button" className="Appglobal-buttonaccept">
          Exportar
        </button>
      </div>
    </div>
  );
};

export default ReportsAdmin;
