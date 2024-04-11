import React, { useState } from 'react';
import './HomeAdmin.scss'; // Importa tu archivo CSS aquí
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
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
        <div className='App-minheight'>
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

        {/* Checkbox para marcar si es General */}
        <input
          type="checkbox"
          id="esGeneral"
          checked={esGeneral}
          onChange={handleEsGeneralChange}
          style={{ display: 'none' }} // Oculta el checkbox nativo
        />
        <label htmlFor="esGeneral" className="checkbox-label">
          <span className={`checkbox-circle ${esGeneral ? 'checked' : ''}`}></span>
          General
        </label>

        {/* Checkbox para marcar si es huésped */}
        <input
          type="checkbox"
          id="esHuesped"
          checked={esHuesped}
          onChange={handleEsHuespedChange}
          style={{ display: 'none' }} // Oculta el checkbox nativo
        />
        <label htmlFor="esHuesped" className="checkbox-label"> 
          <span className={`checkbox-circle ${esHuesped ? 'checked' : ''}`}></span>
          Huésped
        </label>

        <label htmlFor="esServicio" className="checkbox-label">

        {/* Checkbox para marcar si es Servicio */}
        <input
          type="checkbox"
          id="esServicio"
          checked={esServicio}
          onChange={handleEsServicioChange}
          //style={{ display: 'none' }} // Oculta el checkbox nativo
        />
          Servicios
        </label>
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
          <div className="servicios-checkboxes">
            <div>
              <input
                type="checkbox"
                checked={serviciosSeleccionados.desayuno}
                onChange={() => handleServicioChange('desayuno')}
              />
              <label htmlFor="desayuno">Desayuno</label>
            </div>
            <div>
              <input
                type="checkbox"
                checked={serviciosSeleccionados.comida}
                onChange={() => handleServicioChange('comida')}
              />
              <label htmlFor="comida">Comida</label>
            </div>
            <div>
              <input
                type="checkbox"
                checked={serviciosSeleccionados.cena}
                onChange={() => handleServicioChange('cena')}
              />
              <label htmlFor="cena">Cena</label>
            </div>
            <div>
              <input
                type="checkbox"
                checked={serviciosSeleccionados.baño}
                onChange={() => handleServicioChange('baño')}
              />
              <label htmlFor="baño">Baño</label>
            </div>
            <div>
              <input
                type="checkbox"
                checked={serviciosSeleccionados.hospedaje}
                onChange={() => handleServicioChange('hospedaje')}
              />
              <label htmlFor="hospedaje">Hospedaje</label>
            </div>
            <div>
              <input
                type="checkbox"
                checked={serviciosSeleccionados.deuda}
                onChange={() => handleServicioChange('deuda')}
              />
              <label htmlFor="deuda">Deuda</label>
            </div>
            <div>
              <input
                type="checkbox"
                checked={serviciosSeleccionados.vetados}
                onChange={() => handleServicioChange('vetados')}
              />
              <label htmlFor="vetados">Vetados</label>
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
        <button
          type="button"
          className="color-button"
        >
          Exportar
        </button>
      </div>
    </div>
  );
};

export default ReportsAdmin;
