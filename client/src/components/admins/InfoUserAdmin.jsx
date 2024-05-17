import React, { useEffect,useState } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import './UserNewAdmin.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Popup from '../universal/Popup';
import MyToastContainer, {successToast, errorToast } from '../universal/MyToast';
import {LuUser } from "react-icons/lu";
import {LuCalendarDays } from "react-icons/lu";
// import {MdOutlineAttachMoney } from "react-icons/md";
import {FiHome } from "react-icons/fi";
import {TbMoodKid } from "react-icons/tb";
import {FaRegAddressCard } from "react-icons/fa";
import {RiHospitalLine } from "react-icons/ri";
// import {IoMdAddCircleOutline } from "react-icons/io";
// import {IoMdRemoveCircleOutline } from "react-icons/io";
import {MdOutlineNotInterested } from "react-icons/md"; //Usuario vetado
import {MdOutlineEdit } from "react-icons/md"; //Boton Editar
import {LiaCoinsSolid } from "react-icons/lia";
import {PiGenderIntersexLight } from "react-icons/pi"; //GENERO 
import {LuBedDouble } from "react-icons/lu"; //Cama
import {Navigate, useNavigate} from "react-router-dom";

const infoUserAdmin = (props) => {
  //Para manejo de sesiones
  const id_u = useAuth().getUser().id_usuario
  // console.log(id_u)

  const [infoCliente, setinfoCliente] = useState({nombre_c:"", apellidos_c:"", fecha_i:0, lugar_o:"", nombre_p:"", apellidos_p:"", carnet:"", nombre_a:"", nivel_se:0, notas_c:0, sexo:""})
  const [refresh, setRefresh] = useState(false)

  useEffect(() =>{
    fetch('http://localhost:8000/clienteInfo/'+props.id_cliente)
    .then((res) => res.json())
    .then((data) => {setinfoCliente(data); console.log(data)});
}, [props.id_cliente, refresh])
console.log("FECHA Inicio: "+infoCliente.fecha_i)

//FETCH PARA TIPO DE USUARIO "HUESPED"-----------------------------------------
    console.log("VERDADERO HUESPED");
    const [huespedCliente, setHuespedCliente] = useState({id_cama:0, fecha_i:0})

    useEffect(() =>{
      fetch('http://localhost:8000/huespedInfo/'+props.id_cliente)
      .then((res) => res.json())
      .then((data) => {setHuespedCliente(data); console.log(data)});
  }, [props.id_cliente, refresh])
  console.log("ID CAMA"+huespedCliente.id_cama)

//FETCH PARA CALCULAR DEUDA DEL CLIENTE. 
const [deudaCliente, setDeudaCliente] = useState({deudacliente:0})

useEffect(() =>{
  fetch('http://localhost:8000/deudaCliente/'+props.id_cliente)
  .then((res) => res.json())
  .then((data) => {setDeudaCliente(data); console.log(data)});
}, [props.id_cliente, refresh])
console.log("DEUDA DEL CLIENTE"+deudaCliente.deudacliente)
console.log("SEXO: "+infoCliente.sexo)
//FETCH PARA CALCULAR CANTIDAD DE CADA SERVICIO 
const [servicioCliente, setservicioCliente] = useState({servicio1:0, servicio2:0, servicio3:0, servicio4:0, servicio5:0})

useEffect(() =>{
  fetch('http://localhost:8000/servicioEU/'+props.id_cliente)
  .then((res) => res.json())
  .then((data) => {setservicioCliente(data); console.log(data)});
}, [props.id_cliente, refresh])
console.log("DEUDA DEL CLIENTE"+deudaCliente.deudacliente)
console.log("SErvicio: "+servicioCliente.servicio1)

const placeholderText = deudaCliente.deudacliente < 0
? `${Math.abs(deudaCliente.deudacliente)}`
: `${Math.abs(deudaCliente.deudacliente)}`;



//FETCH PARA TIPO CLIENTE:
const [tipoCliente, settipoCliente] = useState({tipo_cliente:0})
//FORMATO QUE DEMUESTRE O NO ELEMENTOS DEPENDIENDO DEL VALOR DEL CLIENTE 

useEffect(() =>{
  fetch('http://localhost:8000/tipoCliente/'+props.id_cliente)
  .then((res) => res.json())
  .then((data) => {settipoCliente(data); console.log(data)});
}, [props.id_cliente, refresh])
console.log("TipoCLIENTE"+tipoCliente.tipo_cliente)

const showNumbersSelect = tipoCliente.tipo_cliente;

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
        })
        .then((response) => {
          if (response.ok) {
            successToast()
            setRefresh(!refresh)
            setPago('')
          }
        })
        // window.location.href = '/infouser/'+props.id_cliente;
        //alert('Registro exitoso');
       } catch (error) {
        console.error('Error al registrar entrada unica:', error);
        alert('Error al registrar el paciente');
      }

};
//fecha
const fechaNueva = () => {
  const fecha = new Date(huespedCliente.fecha_i);
  return fecha.toLocaleString(); 
};

//FETCH PARA SABER SI EL CLIENTE ESTA VETADO O NO:
const [vetadoCliente, setvetadoCliente] = useState({vetadobool:0})
//FORMATO QUE DEMUESTRE O NO ELEMENTOS DEPENDIENDO DEL VALOR DEL CLIENTE 

useEffect(() => {
  fetch('http://localhost:8000/vetado/' + props.id_cliente)
    .then((res) => res.json())
    .then((data) => {
      // Convertir el valor a minúsculas antes de almacenarlo en el estado
      const vetadobool = data.vetadobool.toLowerCase() === 'true';
      setvetadoCliente({vetadobool: vetadobool });
      console.log(data);
    });
}, [props.id_cliente, refresh]);
console.log("VETADO "+vetadoCliente.vetadobool)
const showVetadoSelect = vetadoCliente.vetadobool;
console.log(showVetadoSelect)

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
          setRefresh(!refresh)
        }
      })
      
      .catch((error) => {
        errorToast()
        console.error('Error fetching data:', error)
      })
      // window.location.href = '/infouser/'+props.id_cliente;
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
          setRefresh(!refresh)
        }
      })
      .catch((error) => {
        errorToast()
        console.error('Error fetching data:', error)
      })
      // window.location.href = '/infouser/'+props.id_cliente;
  }
    //Para popup
    const [showPopUp, setShowPopUp] = useState({trigger: false, type: -1, id: null, fun: null}) 

   const handleVetar = async () =>{
    setShowPopUp({trigger: true, type: 1, id: props.id_cliente, fun: vetarCliente})
   }
   const handleDesVetar = async () =>{ 
    setShowPopUp({trigger: true, type: 0, id: props.id_cliente, fun: desvetarCliente})
   }


//FETCH PARA CALCULAR DEUDA DEL CLIENTE. 
const [vetadoNota, setvetadoNota] = useState({notas_v:""})
const goTo = useNavigate();
useEffect(() =>{
  fetch('http://localhost:8000/notasVeto/'+props.id_cliente)
  .then((res) => res.json())
  .then((data) => {setvetadoNota(data); console.log(data)});
}, [props.id_cliente, refresh])
console.log("Notas del vetado"+vetadoNota.notas_v)

//Función para ir a la pagina de editar
const handleEditar = async () => {
      goTo("/edituser/"+props.id_cliente);
  //window.location.href = '/edituser/'+props.id_cliente;
};


///////////////////////////////////////////////////////////////////////////////
//EMPIEZA DESARROLLO DEL HTML
  return (
    <div className='App_minheight  userinfo_justified'>
      {/*Espaciador*/}
      <div className='user_spaciator'></div>

      {/* CAMBIA ID A ADMINISTRADOR */}
      {id_u == 5 && (
        <div className='button-container'>
          <button className='edit-button App_buttonaccept ' onClick={handleEditar}><span className="user_span_spacing_icon" id="basic-addon1"><MdOutlineEdit /></span> Editar</button>
        </div>
      )}
      <div className="user_container_general">
        <div className="container user_container_reg">
        {/* {!showNumbersSelect && (
          <div className="input-group mb-3 ">
            <span className="input-group-text userinfo_span_info" id="basic-addon1">Es Paciente</span>
          </div>)} */}

          <h4>Información del Paciente</h4>
          <div className="input-group mb-3 ">
            <span className="input-group-text user_span_spacing_icon" id="basic-addon1"><FiHome /></span>
            <span className="input-group-text userinfo_span_info" id="basic-addon1">{infoCliente.lugar_o}</span>
          </div>
          <div className="input-group mb-3 ">
            <span className="input-group-text user_span_spacing_icon" id="basic-addon1"><TbMoodKid /></span>
            <span className="input-group-text userinfo_span_info" id="basic-addon1">{infoCliente.nombre_p} {infoCliente.apellidos_p}</span>
          </div>
          <div className="input-group mb-3 ">
            <span className="input-group-text user_span_spacing_icon" id="basic-addon1"><FaRegAddressCard /></span>
            <span className="input-group-text userinfo_span_info" id="basic-addon1">{infoCliente.carnet}</span>
          </div>
          <div className="input-group mb-3 ">
            <span className="input-group-text user_span_spacing_icon" id="basic-addon1"><RiHospitalLine /></span>
            <span className="input-group-text userinfo_span_info" id="basic-addon1">{infoCliente.nombre_a}</span>
          </div>

          <div className="input-group mb-3 "></div>
          <div className="input-group mb-3 "></div>

          <h4>Información de Familiar</h4>


          <div className="input-group mb-3 ">
            <span className="input-group-text user_span_spacing_icon" id="basic-addon1"><LuUser /></span>
            <span className="input-group-text userinfo_span_info" id="basic-addon1">{infoCliente.nombre_c} {infoCliente.apellidos_c}</span>
          </div>
          {showNumbersSelect === true && (
          <div className="input-group mb-3 ">
            <span className="input-group-text user_span_spacing_icon" id="basic-addon1"><LuCalendarDays /></span>
            <span className="input-group-text userinfo_span_info" id="basic-addon1">{fechaNueva()}</span>
          </div>)}
          <div className="input-group mb-3 ">
            <span className="input-group-text user_span_spacing_icon" id="basic-addon1"><PiGenderIntersexLight /></span>
            <span className="input-group-text userinfo_span_info" id="basic-addon1">{infoCliente.sexo ? "Hombre" : "Mujer"}</span>
          </div>
          <div className="input-group mb-3 ">
            <span className="input-group-text user_span_spacing_icon" id="basic-addon1">{infoCliente.nivel_se}</span>
            <span className="input-group-text userinfo_span_info" id="basic-addon1">Nivel socioeconómico</span>
          </div>



          <div className="input-group mb-3 "></div>
        </div>



        <div className="user_spacing_not">
          <div className="input-group mb-3 "></div>
          <div className="mb-3">
            <span className="form-control  user_input_notas" id="exampleFormControlTextarea1" rows="3"> Notas:  {infoCliente.notas_c}</span>
          </div>
          {showNumbersSelect === true && (
            <div>
              <div>
                <label className="form-check-label user_span_notesicon" for="flexRadioDefault1">
                <span>Huésped</span>
                </label>
              </div>
            </div>
            )}
              {showNumbersSelect === false&& (
              <div>
                <label className="form-check-label user_span_notesicon" for="flexRadioDefault1">
                  <span>Entrada Única</span>
                </label>
              </div>)}
              {showNumbersSelect === true && ( 
          <div className="input-group mb-3 ">
          <span className="input-group-text user_span_spacing_icon" id="basic-addon1"><LuBedDouble /></span>
          <span className="input-group-text userinfo_span_info" id="basic-addon1">Cama: {huespedCliente.id_cama}</span>
        </div>
        )}
          {showNumbersSelect === false && (
          <div className="user_services_register">
            <div className="input-group mb-3">
              <span className="input-group-text user_span_notestext" id="basic-addon1">Regadera</span>
              <span className="input-group-text user_span_notestext" id="basic-addon1">{servicioCliente.servicio1}</span>
            </div>
            <div className="input-group mb-3">
              
              <span className="input-group-text user_span_notestext" id="basic-addon1">Baño</span>
              <span className="input-group-text user_span_notestext" id="basic-addon1">{servicioCliente.servicio2}</span>
            </div>
          </div>
          )}
        {showNumbersSelect === false && (
          <div>
            <div className="input-group mb-3">
              
              <span className="input-group-text user_span_notestext" id="basic-addon1">Desayuno</span>
              <span className="input-group-text user_span_notestext" id="basic-addon1">{servicioCliente.servicio3}</span>
            </div>
            <div className="input-group mb-3">
              
              <span className="input-group-text user_span_notestext" id="basic-addon1">Comida</span>
              <span className="input-group-text user_span_notestext" id="basic-addon1">{servicioCliente.servicio4}</span>
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text user_span_notestext" id="basic-addon1">Cena</span>
              <span className="input-group-text user_span_notestext" id="basic-addon1">{servicioCliente.servicio5}</span>
            </div>
        </div>)}
          <div className="input-group mb-3" onChange={handlepagoChange}>
            <span className="input-group-text user_span_spacing_icon" id="basic-addon1"><LiaCoinsSolid /></span>
            <span className="input-group-text userinfo_span_info userinfo_adjust_debt" id="basic-addon1">
              {deudaCliente.deudacliente < 0 ? "A pagar:" : "A favor:"}
            </span>
            <input type="number" className="userinfo_adjust_debt_input" aria-label="Username" aria-describedby="basic-addon1" placeholder={'$'+placeholderText} value={pago}/>
            {inputModified && pago !== '' && ( // Condición para mostrar el botón
              <button className="App_buttonaccept userinfo_size_deposit" onClick={handleBtRegistroClick}>Abonar</button>
            )}
          </div>
          {showVetadoSelect  && (
          <div>
              <div className="input-group mb-3">
              <span className="input-group-text user_span_spacing_icon" id="basic-addon1"><MdOutlineNotInterested /></span>
            <span className="input-group-text userinfo_span_baninfo" id="basic-addon1">Usuario Vetado</span>
            </div>
            <div className="mb-3">
            <span className="form-control  user_input_notas" id="exampleFormControlTextarea1" rows="3"> Razón del Veto:  {vetadoNota.notas_v}</span>
          </div>
          <div className="input-group mb-3 ">
            <button className="App_buttonaccept userinfo_button_ban" onClick={handleDesVetar}>Desvetar</button>
          </div>
          </div>)}
          {!showVetadoSelect && (
          <div className="input-group mb-3 ">
            <button className="App_buttonaccept userinfo_button_ban" onClick={handleVetar}>Vetar</button>
          </div>)}
          <Popup trigger={showPopUp.trigger} type={showPopUp.type} id={showPopUp.id} fun={showPopUp.fun} setTrigger={setShowPopUp}>
            ¿Estas Seguro?
          </Popup>
          <MyToastContainer />
        </div>
      </div>
    </div>
  )
}

export default infoUserAdmin

//login_inputs App_buttonaccept