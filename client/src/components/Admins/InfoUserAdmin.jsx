import React, { useEffect,useState } from 'react';
import './UserNewAdmin.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

import { LuUser } from "react-icons/lu";
import { LuCalendarDays } from "react-icons/lu";
// import { MdOutlineAttachMoney } from "react-icons/md";
import { FiHome } from "react-icons/fi";
import { TbMoodKid } from "react-icons/tb";
import { FaRegAddressCard } from "react-icons/fa";
import { RiHospitalLine } from "react-icons/ri";
// import { IoMdAddCircleOutline } from "react-icons/io";
// import { IoMdRemoveCircleOutline } from "react-icons/io";
import { LiaCoinsSolid } from "react-icons/lia";
import { PiGenderIntersexLight } from "react-icons/pi"; //GENERO 
import { LuBedDouble } from "react-icons/lu"; //Cama

const infoUserAdmin = (props) => {
  const [infoCliente, setinfoCliente] = useState({nombre_c:"", apellidos_c:"", fecha_i:0, lugar_o:"", nombre_p:"", apellidos_p:"", carnet:"", nombre_a:"", nivel_se:0, notas_c:0, tipo_cliente:"", sexo:""})

  useEffect(() =>{
    fetch('http://localhost:8000/clienteInfo/'+props.id_cliente)
    .then((res) => res.json())
    .then((data) => {setinfoCliente(data); console.log(data)});
}, [props.id_cliente])
console.log("TIPO CLIENTE: "+infoCliente.tipo_cliente)
console.log("FECHA Inicio: "+infoCliente.fecha_i)
//FORMATO QUE DEMUESTRE O NO ELEMENTOS DEPENDIENDO DEL VALOR DEL CLIENTE 
  const showNumbersSelect = infoCliente.tipo_cliente;
//FETCH PARA TIPO DE USUARIO "HUESPED"-----------------------------------------
    console.log("VERDADERO HUESPED");
    const [huespedCliente, setHuespedCliente] = useState({id_cama:0, fecha_i:0})

    useEffect(() =>{
      fetch('http://localhost:8000/huespedInfo/'+props.id_cliente)
      .then((res) => res.json())
      .then((data) => {setHuespedCliente(data); console.log(data)});
  }, [props.id_cliente])
  console.log("ID CAMA"+huespedCliente.id_cama)

//FETCH PARA CALCULAR DEUDA DEL CLIENTE. 
const [deudaCliente, setDeudaCliente] = useState({deudacliente:0})

useEffect(() =>{
  fetch('http://localhost:8000/deudaCliente/'+props.id_cliente)
  .then((res) => res.json())
  .then((data) => {setDeudaCliente(data); console.log(data)});
}, [props.id_cliente])
console.log("DEUDA DEL CLIENTE"+deudaCliente.deudacliente)
console.log("SEXO: "+infoCliente.sexo)
//FETCH PARA CALCULAR CANTIDAD DE CADA SERVICIO 
const [servicioCliente, setservicioCliente] = useState({servicio1:0, servicio2:0, servicio3:0, servicio4:0, servicio5:0})

useEffect(() =>{
  fetch('http://localhost:8000/servicioEU/'+props.id_cliente)
  .then((res) => res.json())
  .then((data) => {setservicioCliente(data); console.log(data)});
}, [props.id_cliente])
console.log("DEUDA DEL CLIENTE"+deudaCliente.deudacliente)
console.log("SErvicio: "+servicioCliente.servicio1)

const placeholderText = deudaCliente.deudacliente < 0
? `${Math.abs(deudaCliente.deudacliente)}`
: `${Math.abs(deudaCliente.deudacliente)}`;
// AGREGAR PAGO O DEUDA CUANDO SE MODIFICA EL HANDLE

const [pago, setPago] = useState('');
const [inputModified, setInputModified] = useState(false);

const handlepagoChange = (event) => {
  const inputValue = event.target.value;
  const pagoArray = inputValue.split(' ');
  const pagoString = pagoArray.join(' ');
  setPago(pagoString);
  setInputModified(true); // Actualiza el estado cuando se modifica el input
}
const handleBtRegistroClick = async () => {
      try {
        await fetch('http://localhost:8000/registrarPago', {
          method: 'POST',
          body: JSON.stringify({id_cliente:props.id_cliente, pago:pago}),
          headers: {
            'Content-type': 'application/json; charset=UTF-8'
          }
        });
        window.location.href = '/infouser/'+props.id_cliente;
        //alert('Registro exitoso');
       } catch (error) {
        console.error('Error al registrar entrada unica:', error);
        alert('Error al registrar el paciente');
      }

};


//EMPIEZA DESARROLLO DEL HTML
  return (
    <div class='App_minheight'>
      <div class="user_container_general">
        <div class="container user_container_reg">
        {/* {!showNumbersSelect && (
          <div class="input-group mb-3 ">
            <span class="input-group-text user_span_info" id="basic-addon1">Es Paciente</span>
          </div>)} */}

          <h4>Información de usuario</h4>
          <div class="input-group mb-3 ">
            <span class="input-group-text user_span_space_icon" id="basic-addon1"><LuUser /></span>
            <span class="input-group-text user_span_info" id="basic-addon1">{infoCliente.nombre_c} {infoCliente.apellidos_c}</span>
          </div>
          {showNumbersSelect && (
          <div class="input-group mb-3 ">
            <span class="input-group-text user_span_space_icon" id="basic-addon1"><LuCalendarDays /></span>
            <span class="input-group-text user_span_info" id="basic-addon1">{huespedCliente.fecha_i}</span>
          </div>)}
          <div class="input-group mb-3 ">
            <span class="input-group-text user_span_space_icon" id="basic-addon1"><PiGenderIntersexLight /></span>
            <span class="input-group-text user_span_info" id="basic-addon1">{infoCliente.sexo ? "Hombre" : "Mujer"}</span>
          </div>
          <div class="input-group mb-3 ">
            <span class="input-group-text user_span_space_icon" id="basic-addon1">{infoCliente.nivel_se}</span>
            <span class="input-group-text user_span_info" id="basic-addon1">Nivel socioeconómico</span>
          </div>
          <div class="input-group mb-3 ">
            <span class="input-group-text user_span_space_icon" id="basic-addon1"><FiHome /></span>
            <span class="input-group-text user_span_info" id="basic-addon1">{infoCliente.lugar_o}</span>
          </div>

          <div class="input-group mb-3 "></div>
          <div class="input-group mb-3 "></div>

          <h4>Información del paciente</h4>
          <div class="input-group mb-3 ">
            <span class="input-group-text user_span_space_icon" id="basic-addon1"><TbMoodKid /></span>
            <span class="input-group-text user_span_info" id="basic-addon1">{infoCliente.nombre_p} {infoCliente.apellidos_p}</span>
          </div>
          <div class="input-group mb-3 ">
            <span class="input-group-text user_span_space_icon" id="basic-addon1"><FaRegAddressCard /></span>
            <span class="input-group-text user_span_info" id="basic-addon1">{infoCliente.carnet}</span>
          </div>
          <div class="input-group mb-3 ">
            <span class="input-group-text user_span_space_icon" id="basic-addon1"><RiHospitalLine /></span>
            <span class="input-group-text user_span_info" id="basic-addon1">{infoCliente.nombre_a}</span>
          </div>
          <div class="input-group mb-3 "></div>
        </div>
        <div class="user_space_not">
          <div class="input-group mb-3 "></div>
          <div class="mb-3">
            <span class="form-control  user_input_notas" id="exampleFormControlTextarea1" rows="3"> Notas:  {infoCliente.notas_c}</span>
          </div>
          {showNumbersSelect && (
            <div>
              <div>
                <label class="form-check-label user_span_notesicon" for="flexRadioDefault1">
                <span>Huésped</span>
                </label>
              </div>
            </div>
            )}
              {!showNumbersSelect && (
              <div>
                <label class="form-check-label user_span_notesicon" for="flexRadioDefault1">
                  <span>Entrada Única</span>
                </label>
              </div>)}
              {showNumbersSelect && ( 
          <div class="input-group mb-3 ">
          <span class="input-group-text user_span_space_icon" id="basic-addon1"><LuBedDouble /></span>
          <span class="input-group-text user_span_info" id="basic-addon1">Cama: {huespedCliente.id_cama}</span>
        </div>
        )}
          {!showNumbersSelect && (
          <div class="user_services_register">
            <div class="input-group mb-3">
              <span class="input-group-text user_span_notestext" id="basic-addon1">Regadera</span>
              <span class="input-group-text user_span_notestext" id="basic-addon1">{servicioCliente.servicio1}</span>
            </div>
            <div class="input-group mb-3">
              
              <span class="input-group-text user_span_notestext" id="basic-addon1">Baño</span>
              <span class="input-group-text user_span_notestext" id="basic-addon1">{servicioCliente.servicio2}</span>
            </div>
          </div>
          )}
          {!showNumbersSelect && (
          <div>
            <div class="input-group mb-3">
              
              <span class="input-group-text user_span_notestext" id="basic-addon1">Desayuno</span>
              <span class="input-group-text user_span_notestext" id="basic-addon1">{servicioCliente.servicio3}</span>
            </div>
            <div class="input-group mb-3">
              
              <span class="input-group-text user_span_notestext" id="basic-addon1">Comida</span>
              <span class="input-group-text user_span_notestext" id="basic-addon1">{servicioCliente.servicio4}</span>
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text user_span_notestext" id="basic-addon1">Cena</span>
              <span class="input-group-text user_span_notestext" id="basic-addon1">{servicioCliente.servicio5}</span>
            </div>
          </div>)}
          <div class="input-group mb-3 " onChange={handlepagoChange}>
            <span class="input-group-text user_span_space_icon" id="basic-addon1"><LiaCoinsSolid /></span>
            <span class="input-group-text user_span_info" id="basic-addon1">
              {deudaCliente.deudacliente < 0 ? "A pagar: $" : "A favor: $"}
            </span>
            <input type="text" className="form-control user_space_reg" aria-label="Username" aria-describedby="basic-addon1" placeholder={placeholderText} value={pago}/>
            {inputModified && pago !== '' && ( // Condición para mostrar el botón
              <button className="btn btn-primary" onClick={handleBtRegistroClick}>Abonar</button>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default infoUserAdmin