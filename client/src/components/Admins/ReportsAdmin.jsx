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
    <div className='App_minheight App-minpadding'>
      {/* Div para agrupar los campos de entrada */}
      <div className="universal_container_inputdate">
        {/* Campo de entrada para la fecha 1 */}
        <div className="universal_container_pickerdate">
          <DatePicker
            selected={fecha1}
            onChange={date => setFecha1(date)}
            placeholderText="DD/MM/YY"
            className="universal_input_date"
            dateFormat="dd/MM/yy" // Cambia el formato de la fecha
          />
        </div>

        {/* Campo de entrada para la fecha 2 */}
        <div className="universal_container_pickerdate">
          <DatePicker
            selected={fecha2}
            onChange={date => setFecha2(date)}
            placeholderText="DD/MM/YY"
            className="universal_input_date"
            dateFormat="dd/MM/yy" // Cambia el formato de la fecha
          />
        </div>

        <div className="universal_container_checkbox">
        {/* Checkbox para marcar si es General */}
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            id="esGeneral"
            checked={esGeneral}
            onChange={handleEsGeneralChange}
          />
          <label className="form-check-label universal_label_radio" htmlFor="esGeneral">
          <span class="universal_text_HM">General</span>
          </label>
        </div>

        {/* Checkbox para marcar si es huésped */}
        <div className="form-check">
          <input
            className="form-check-input universal_checkbox_HM"
            type="radio"
            id="esHuesped"
            checked={esHuesped}
            onChange={handleEsHuespedChange}
          />
          <label className="form-check-label universal_label_radio" htmlFor="esHuesped">
            <span class="universal_text_HM">Huésped</span>
          </label>
        </div>

        <div className="form-check">
          <input
            className="form-check-input universal_checkbox_HM"
            type="checkbox"
            id="esServicio"
            checked={esServicio}
            onChange={handleEsServicioChange}
          />
          <label className="form-check-label universal_label_radio" htmlFor="esServicio">
            <span class="universal_text_HM">Servicios</span>
          </label>
          </div>
        </div>
      </div>

      {/* Div para el dropdown de huésped */}
      <div className="universal_container_dropdown">
        {/* Dropdown que se muestra si es huésped */}
        {esHuesped && (
          <Dropdown onSelect={(eventKey) => handleHuéspedSelect(eventKey)}>
            <Dropdown.Toggle variant="success" id="dropdown-basic" className="universal_toggle_dropdown">
              {huéspedSeleccionado}
            </Dropdown.Toggle>
            <Dropdown.Menu  className="universal_dropdown_custommenu">
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
      <div className="universal_container_services">
        {/* Mostrar los checkboxes de servicios si esServicio está marcado */}
        {esServicio && (
          <div className="universal_container2_checkbox">
            {/* Checkbox para cada servicio */}
            <div className="form-check">
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
            <div className="form-check">
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
            <div className="form-check">
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
            <div className="form-check">
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
            <div className="form-check">
              <input
                className="form-check-input universal_checkbox_HM"
                type="checkbox"
                id="hospedaje"
                checked={serviciosSeleccionados.hospedaje}
                onChange={() => handleServicioChange('hospedaje')}
              />
              <label className="form-check-label universal_label_radio" htmlFor="hospedaje">
                <span class="universal_text_HM">Hospedaje</span>
              </label>
            </div>
            <div className="form-check">
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
            <div className="form-check">
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
          </div>

        )}
      </div>

      <div className="report-container">
        {/* Input rectángulo gris */}
        <input
          type="text"
          className="universal_rectangle_gray"
        />
      </div>
      <div className="universal_button_export">
        {/* Botón de exportar reporte a PDF */}
        <button type="button" className="App_buttonaccept">
          Exportar
        </button>
      </div>
    </div>
  );
};

export default ReportsAdmin;
