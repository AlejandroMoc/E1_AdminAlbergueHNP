import './UserNewAdmin.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState} from 'react';
import {LuUser} from "react-icons/lu";
import {useNavigate} from "react-router-dom";
import {useAuth} from '../../auth/AuthProvider';
import {FiHome} from "react-icons/fi";
import {MdFaceUnlock} from "react-icons/md";
import {FaRegAddressCard} from "react-icons/fa";
import {IoMdAddCircleOutline} from "react-icons/io";
import {IoMdRemoveCircleOutline} from "react-icons/io";
import MyToastContainer, {successToast, errorToast} from '../universal/MyToast';
import { API_URL } from '../../App';

const UserNewAdmin = (props) => {

  //Para pasar a dashboard
  const goTo = useNavigate();

  //Para manejo de sesiones
  const id_u = useAuth().getUser().id_usuario
  const [adminInfo, setAdminInfo] = useState([])
  // console.log(id_u)

  //Llamada a la función para información de usuario
  useEffect(() => {
    fetch(`${API_URL}/infouser`, {
      method: 'POST',
      body: JSON.stringify({id_u: id_u}),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
     }
   })
      .then((res) => res.json())
      .then((adminInfo) => setAdminInfo(adminInfo))
      .catch((error) => console.error('Error fetching data:', error))
 }, [])
  const [sexo, setSexo] = useState(null)
  //console.log("id_cama")
  const [bed, setBed] = useState([{id_cama: 0}])
  useEffect(() => {
    fetch(`${API_URL}/alldispbeds`)
      .then((res) => res.json())
      .then((beds) => setBed(beds));
    setId_CamaC(props.id_cama)
    if (sexo === true) {
      setIdZona(id_zona_hombres);
   } else {
      setIdZona(id_zona_mujeres);
   }
 }, [sexo])


  const [area, setArea] = useState([{id_area: 0, nombre_a: ''}]) //PARA DROPDOWN DE AREA PACIENTE
  useEffect(() => {
    fetch(`${API_URL}/allareas`)
      .then((res) => res.json())
      .then((areas) => setArea(areas));
 }, [])


  const [client, setClient] = useState([{sexo: null, nivel_se: 0, lugar_o: '', nombre_p: '', apellidos_p: '', carnet: '', id_area: 0, notas_c: '', id_cliente: 0, paciente: null}])
  useEffect(() => {
    if (isVisitantePrevio === true) {
      fetch(`${API_URL}/allclientinfo`, {
        method: 'POST',
        body: JSON.stringify({nombre: nombre_c, apellidos: apellidos_c}),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
       }
     })
        .then((res) => res.json())
        .then((client) => setClient(client))
        .catch((error) => console.error('Error fetching data:', error));
      setIsVisitantePrevio(false);
   }
 })

  const [nombre_cError, setNombre_CError] = useState(false);
  const [apellidos_cError, setApellidos_CError] = useState(false);
  const [sexoError, setSexoError] = useState(false);
  const [nivel_seError, setNivel_SEError] = useState(false);
  const [lugar_oError, setLugar_OError] = useState(false);
  const [nombre_pError, setNombre_PError] = useState(false);
  const [apellidos_pError, setApellidos_PError] = useState(false);
  const [carnetError, setCarnetError] = useState(false);
  const [id_areaError, setId_areaCError] = useState(false);
  const [generalError, setGeneralError] = useState('')


  const validateFields = () => {
    setNombre_CError(nombre_c === '');
    setApellidos_CError(apellidos_c === '');
    setSexoError(sexo === null);
    setNivel_SEError(nivel_se === 0);
    setLugar_OError(lugar_o === '');
    setNombre_PError(nombre_p === '');
    setApellidos_PError(apellidos_p === '');
    setCarnetError(carnet === '');
    setId_areaCError(id_area === '');
    return !(
      nombre_c === '' ||
      apellidos_c === '' ||
      sexo === null ||
      nivel_se === 0 ||
      lugar_o === '' ||
      nombre_p === '' ||
      apellidos_p === '' ||
      carnet === '' ||
      id_area === ''
    );
 };
  const handleSelectChange = (event) => {
    const selectedId = event.target.value;
    setNumeroA(selectedId);
    //console.log('ID del área seleccionada:', selectedId);
 };

  const [isVisitantePrevio, setIsVisitantePrevio] = useState(false);
  const handleIsVisitantePrevioChange = (event) => {
    // console.log(event.target.checked)
    setIsVisitantePrevio(event.target.checked)
 }

  const [btRegistro, setBtRegistro] = useState(false);
  const handleBtRegistroClick = async () => {
    if (validateFields()) {
      // if (!carnetExist) {// Verificamos si el carnet no existe
      if (showServices) {
        try {
          await fetch(`${API_URL}/registerEntradaUnica`, {
            method: 'POST',
            body: JSON.stringify({id_u: id_u, carnet: carnet, id_area: id_area, nombre_p: nombre_p, apellidos_p: apellidos_p, nombre_c: nombre_c, apellidos_c: apellidos_c, lugar_o: lugar_o, notas_c: notas_c, sexo: sexo, nivel_se: nivel_se, shower: shower, bathroom: bathroom, breakfast: breakfast, meal: meal, dinner: dinner, paciente: paciente, checked: adminInfo.admin, cantidad: cantidad, costo: costo}),
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
           }
         })
            .then((res) => res.json())
            .then((response) => {
              //console.log(response)
              if (response.registervisitante_func) {
                successToast()
                setTimeout(() => {
                  goTo("/dashboard");
               }, 1000);
             }
              else {
                errorToast()
                setGeneralError(response.error)
             }
           })
            .catch(() => {
              errorToast()
           });
       } catch (error) {
          console.error('Error al registrar entrada unica:', error);
          errorToast()
       }
     }
      else if (showBedNumber) {
        try {
          await fetch(`${API_URL}/registerNewPatient`, {
            method: 'POST',
            body: JSON.stringify({id_u: id_u, carnet: carnet, id_area: id_area, nombre_p: nombre_p, apellidos_p: apellidos_p, nombre_c: nombre_c, apellidos_c: apellidos_c, lugar_o: lugar_o, notas_c: notas_c, sexo: sexo, nivel_se: nivel_se, id_cama: id_cama, paciente: paciente, checked: adminInfo.admin}),
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
           }
         })
            .then((res) => res.json())
            .then((response) => {
              //console.log(response)
              if (response.registerhuesped_func) {
                successToast()
                setTimeout(() => {
                  goTo("/dashboard");
               }, 1000);
             }
              else {
                errorToast()
                setGeneralError(response.error)
             }
           })
            .catch(() => {
              errorToast()
           });
       } catch (error) {
          errorToast()
       }
     }
      //} else {
      //   // Si el carnet existe, mostramos un toast indicando que el carnet está en uso
      //   errorCarnet()
      //}
   } else {
      errorToast()
      setGeneralError('Favor de llenar los campos faltantes')
   }
 };



  const [nombre_c, setNombre_C] = useState([]);
  const handleNombre_CChange = (event) => {
    const inputValue = event.target.value;
    const nombrecArray = inputValue.split(' ');
    //console.log(nombrecArray);
    const nombrecString = nombrecArray.join(' ');
    const isError = inputValue.trim() === '';
    setNombre_CError(isError);
    //console.log(nombrecString);
    setNombre_C(nombrecString);
 }

  const [apellidos_c, setApellidos_C] = useState([]);
  const handleApellidos_CChange = (event) => {
    const inputValue = event.target.value;
    const apellidoscArray = inputValue.split(' ');
    //console.log(apellidoscArray);
    const apellidoscString = apellidoscArray.join(' ');
    const isError = inputValue.trim() === '';
    setApellidos_CError(isError);
    //console.log(apellidoscString);
    setApellidos_C(apellidoscString);
 }

  const [apellidos_p, setApellidos_P] = useState([]);
  const handleApellidos_PChange = (event) => {
    const inputValue = event.target.value;
    const apellidosArray = inputValue.split(' ');
    //console.log(apellidosArray);
    const apellidosString = apellidosArray.join(' ');
    const isError = inputValue.trim() === '';
    setApellidos_PError(isError);
    //console.log(apellidosString);
    setApellidos_P(apellidosString);
 }

  const [nombre_p, setNombre_P] = useState([]);
  const handleNombre_PChange = (event) => {
    const inputValue = event.target.value;
    const nombrepArray = inputValue.split(' ');
    const nombrepString = nombrepArray.join(' ');
    const isError = inputValue.trim() === '';
    setNombre_PError(isError);
    //console.log(nombrepString);
    setNombre_P(nombrepString);
 }

  //console.log(client)


  const [sexoUsuario, setSexoUsuario] = useState(null); // Inicializamos el sexo del usuario como null


  const handleSexoChange = (event) => {
    const sexoSeleccionado = event.target.value === 'true'; // Convertimos el valor del radio button a un booleano
    setSexoUsuario(sexoSeleccionado); // Actualizamos el estado con el sexo seleccionado
    setSexo(event.target.value)
    //console.log("PIZZA" + sexoSeleccionado);
 }


  const [nivel_se, setNivel_SE] = useState(0)
  const handleNivel_SEChange = (event) => {
    // console.log(event.target.value)
    setNivel_SE(event.target.value)
 }
  const [isPaciente, setIsPaciente] = useState(false);

  const [paciente, setPaciente] = useState(0);
  const handlePaciente_Change = (event) => {
    setIsPaciente(event.target.value === 'true');
    setPaciente(event.target.value)
 }
  useEffect(() => {
    if (isPaciente) {
      setNombre_C(nombre_p);
      setApellidos_C(apellidos_p);
   } else {
      setNombre_C('');
      setApellidos_C('');
   }
 }, [nombre_p, apellidos_p, isPaciente]);

  const [id_cliente, setId_cliente] = useState(0)
  const handleId_clienteChange = (event) => {
    // console.log(event.target.value)
    setNivel_SE(event.target.value)
 }

  const [lugar_o, setLugar_O] = useState('')
  const handleLugar_OChange = (event) => {
    // console.log(event.target.value)
    setLugar_O(event.target.value)
 }


  const [carnet, setCarnet] = useState('');
  const [carnetExist, setCarnetExist] = useState(null);

  const handleCarnetChange = (event) => {
    setCarnet(event.target.value);
 };

  useEffect(() => {
    const obtenerEstadoCarnet = async () => {
      try {
        const response = await fetch(`${API_URL}/carnetExist/${carnet}`);
        const data = await response.json();

        if (data && data.length > 0) {
          const carnetExist2 = data[0].carnetexist === 'true';
          setCarnetExist(carnetExist2);
          //console.log("ESTADO DEL CARNET: ", carnetExist2);
       } else {
          setCarnetExist(false);
          //console.log("ESTADO DEL CARNET: FALSE");
       }
     } catch (error) {
        console.error('Error al obtener el estado del carnet:', error);
        setCarnetExist(false);
     }
   };

    obtenerEstadoCarnet();
 }, [carnet]);

  const handleRegister = () => {
    // Aquí pondrías la lógica para registrar el carnet
    // Por ahora, solo mostraremos un mensaje de éxito simulado
    toast.success('Carnet registrado correctamente', {
      position: toast.POSITION.TOP_RIGHT
   });
 };

  const [notas_c, setNotas_C] = useState('')
  const handleNotas_CChange = (event) => {
    // console.log(event.target.value)
    setNotas_C(event.target.value)
 }

  const [showServices, setShowServices] = useState(false);
  const [showBedNumber, setShowBedNumber] = useState(true);
  const [tipo_cliente, setTipoCliente] = useState('');

  const handleRadioChange = (event) => {
    const isGuest = event.target.value === 'true';
    setShowServices(!isGuest);
    setShowBedNumber(isGuest);
    setTipoCliente(event.target.value);
 };



  const [id_cama, setId_CamaC] = useState('')
  const handleId_CamaCChange = (event) => {
    // console.log(event.target.value)
    setId_CamaC(event.target.value)
 }
  /*
  //console.log("Dont cry"+id_cama)
  { const [huespedCliente, setHuespedCliente] = useState({id_zona:0})
    if (id_cama === undefined){
      //console.log('Sin cama asignada')
   } else{
      //console.log("cama asignada")

      useEffect(() =>{
      fetch(`${API_URL}/zonabed/'+props.id_cama)
      .then((res) => res.json())
      .then((data) => {setHuespedCliente(data); 
        setHuespedCliente(data);
        //console.log(data)});
      
   }, [props.id_cama])
   }
    //console.log("ID CAMAfff"+huespedCliente.id_zona)}*/

  const [id_area, setId_areaC] = useState('')
  const handleId_areaCChange = (event) => {
    // console.log(event.target.value)
    setId_areaC(event.target.value)
 }

  const [shower, setShower] = useState(0);
  const [bathroom, setBathroom] = useState(0);
  const [breakfast, setBreakfast] = useState(0);
  const [meal, setMeal] = useState(0);
  const [dinner, setDinner] = useState(0);
  const [cantidad, setCantidad] = useState(0);
  const [costo, setCosto] = useState(0);
  useEffect(() => {
    const totalServicios = shower + bathroom + breakfast + meal + dinner;
    const cshower = shower * -30;
    const cbathroom = bathroom * 0;
    const cbreakfast = breakfast * -20;
    const cmeal = meal * -20;
    const cdinner = dinner * -20;
    setCantidad(totalServicios);
    const costos = cshower + cbathroom + cbreakfast + cmeal + cdinner;
    setCosto(costos)
 }, [shower, bathroom, breakfast, meal, dinner]);

  //console.log(cantidad)
  //console.log(costo)

  const handleSetShower = (sh) => {
    if (sh === 1) {
      setShower(pShower => pShower + 1);
   }
    else if (sh === 0 && shower != 0) {
      setShower(pShower => pShower - 1);
   }
 }

  const handleSetBathroom = (ba) => {
    if (ba === 1) {
      setBathroom(pBathroom => pBathroom + 1);
   }
    else if (ba === 0 && bathroom != 0) {
      setBathroom(pBathroom => pBathroom - 1);
   }
 }

  const handleSetBreakfast = (br) => {
    if (br === 1) {
      setBreakfast(pBreakfast => pBreakfast + 1);
   }
    else if (br === 0 && breakfast != 0) {
      setBreakfast(pBreakfast => pBreakfast - 1);
   }
 }

  const handleSetMeal = (me) => {
    if (me === 1) {
      setMeal(pMeal => pMeal + 1);
   }
    else if (me === 0 && meal != 0) {
      setMeal(pMeal => pMeal - 1);
   }
 }

  const handleSetDinner = (di) => {
    if (di === 1) {
      setDinner(pDinner => pDinner + 1);
   }
    else if (di === 0 && dinner != 0) {
      setDinner(pDinner => pDinner - 1);
   }
 }

  const [id_zona_vetados, setIdZonaVetados] = useState(3);
  const [id_zona_hombres, setIdZonaHombres] = useState(2);
  const [id_zona_mujeres, setIdZonaMujeres] = useState(1);
  const [id_zona, setIdZona] = useState(null);

  // Arreglo para la numeración de camas aisladas. A1, A2, B1, B2, ...
  const aisladoLetras = [];
  for (let i = 1; i <= 26; i++) {
    for (let j = 1; j <= 2; j++) {
      const letra = String.fromCharCode(64 + i);
      const combinacion = letra + j;
      aisladoLetras.push(combinacion);
   }
 }

  let contador = -1; // Para acceder al arreglo aisladoLetras en la posición deseada.


  return (
    <div className='App-minheight user_justified'>
      {/*Espaciador*/}
      <div className='user_spaciator'></div>

      <div className="user_container_general">
        <div className="container user_container_column">

          <h4>Información del Paciente</h4>
          <div className="input-group mb-3 ">
            <span className="input-group-text user_span_space_icon" id="basic-addon1"><FiHome /></span>
            <input type="text" className={`userinfo_span_info form-control user_space_reg ${lugar_oError ? 'is-invalid' : ''}`} placeholder="Lugar de Origen" aria-label="Username" aria-describedby="basic-addon1" onChange={handleLugar_OChange} minLength="8" maxLength="24" value={lugar_o}></input>
            {lugar_oError && <div className="invalid-feedback text-start">Este campo es obligatorio</div>}
          </div>
          <div className="input-group mb-3 ">
            <span className="input-group-text user_span_space_icon" id="basic-addon1"><MdFaceUnlock /></span>
            <input type="text" className={`userinfo_span_info form-control user_space_reg ${nombre_pError ? 'is-invalid' : ''}`} placeholder="Nombre del Paciente" aria-label="Username" aria-describedby="basic-addon1" onChange={handleNombre_PChange} minLength="8" maxLength="24" value={nombre_p}></input>
            {nombre_pError && <div className="invalid-feedback text-start">Este campo es obligatorio</div>}
          </div>
          <div className="input-group mb-3 ">
            <span className="input-group-text user_span_space_icon" id="basic-addon1"><MdFaceUnlock /></span>
            <input type="text" className={`userinfo_span_info form-control user_space_reg ${apellidos_pError ? 'is-invalid' : ''}`} placeholder="Apellidos del paciente" aria-label="Username" aria-describedby="basic-addon1" onChange={handleApellidos_PChange} minLength="8" maxLength="24" value={apellidos_p}></input>
            {apellidos_pError && <div className="invalid-feedback text-start">Este campo es obligatorio</div>}
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text user_span_space_icon" id="basic-addon1"><FaRegAddressCard /></span>
            
            <input type="number" min="0" className={`userinfo_span_info form-control user_space_reg ${carnetError ? 'is-invalid' : ''}`} placeholder="Carnet (8 a 16 caracteres)" aria-label="Username" aria-describedby="basic-addon1" onChange={handleCarnetChange} minLength="8" maxLength="16" value={carnet}></input>
            {carnetError && <div className="invalid-feedback text-start">Este campo es obligatorio</div>}
          </div>
          <div className="user_label_x" onChange={handleId_areaCChange}>
            <span><p>Área de Paciente: </p></span>
            <select className="form-select user_select_beds sm" aria-label="Default select example">
              <option selected><p>Seleccione un área</p></option>
              {(
                area.map((item) => (
                  <option key={item.id_area} value={item.id_area}>{item.nombre_a}</option>
                ))
              )}
            </select>
          </div>

          <div className="input-group mb-3 "></div>
          <div className="input-group mb-3 "></div>

          <h4>Información del Familiar</h4>
          <span className="user_span_sociolevel" id="basic-addon1">¿El familiar es un paciente?</span>
          <p>Es decir, si el familiar registrado es el paciente de arriba.</p>
          <div className="input-group mb-3 checkerito" onChange={handlePaciente_Change}>
            <div className="form-check">
              <input className="form-check-input universal_checkbox_HM" type="radio" name="pacient" id="flexRadioDefaultNivelSoc" value={true} />
              <label className="form-check-label universal_label_radio" htmlFor="flexRadioDefault1">
                <span className="universal_text_HM">Si</span>
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input universal_checkbox_HM" type="radio" name="pacient" id="flexRadioDefaultNivelSoc" value={false} />
              <label className="form-check-label universal_label_radio" htmlFor="flexRadioDefault1">
                <span className="universal_text_HM">No</span>
              </label>
            </div>
          </div>
          <div className="input-group mb-3 ">
            <span className="input-group-text user_span_space_icon" id="basic-addon1"><LuUser /></span>
            <input type="text" className={`userinfo_span_info form-control user_space_reg ${nombre_cError ? 'is-invalid' : ''}`} placeholder="Nombre Completo" aria-label="Username" aria-describedby="basic-addon1" onChange={handleNombre_CChange} minLength="8" maxLength="24" value={nombre_c} disabled={isPaciente}></input>
            {nombre_cError && <div className="invalid-feedback text-start">Este campo es obligatorio</div>}
          </div>
          <div className="input-group mb-3 ">
            <span className="input-group-text user_span_space_icon" id="basic-addon1"><LuUser /></span>
            <input type="text" className={`userinfo_span_info form-control user_space_reg ${apellidos_cError ? 'is-invalid' : ''}`} placeholder="Apellidos" aria-label="Username" aria-describedby="basic-addon1" onChange={handleApellidos_CChange} minLength="8" maxLength="24" value={apellidos_c} disabled={isPaciente}></input>
            {apellidos_cError && <div className="invalid-feedback text-start">Este campo es obligatorio</div>}
          </div>
          <div className="input-group mb-3" onChange={handleSexoChange}>
            <div className="user_div_radio">
              <div className="form-check">
                <input className="form-check-input universal_checkbox_HM" type="radio" name="sexo" id="flexRadioDefaultSexo" value={true}></input>
                <label className="form-check-label universal_label_radio" for="flexRadioDefault1">
                  <span className="universal_text_HM">Hombre</span>
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input universal_checkbox_HM" type="radio" name="sexo" id="flexRadioDefaultSexo" value={false}></input>
                <label className="form-check-label universal_label_radio" for="flexRadioDefault1">
                  <span className="universal_text_HM">Mujer</span>
                </label>
              </div>
            </div>
          </div>
          <span className="user_span_sociolevel" id="basic-addon1">Nivel Socioeconómico</span>
          <div className="input-group mb-3" onChange={handleNivel_SEChange}>
            <div className="user_div_radio">
              <div className="form-check">
                <input className="form-check-input universal_checkbox_HM" type="radio" name="nivelSoc" id="flexRadioDefaultNivelSoc" value={1}></input>
                <label className="form-check-label universal_label_radio" for="flexRadioDefault1">
                  <span className="universal_text_HM">1</span>
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input universal_checkbox_HM" type="radio" name="nivelSoc" id="flexRadioDefaultNivelSoc" value={2}></input>
                <label className="form-check-label universal_label_radio" for="flexRadioDefault1">
                  <span className="universal_text_HM">2</span>
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input universal_checkbox_HM" type="radio" name="nivelSoc" id="flexRadioDefaultNivelSoc" value={3}></input>
                <label className="form-check-label universal_label_radio" for="flexRadioDefault1">
                  <span className="universal_text_HM">3</span>
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input universal_checkbox_HM" type="radio" name="nivelSoc" id="flexRadioDefaultNivelSoc" value={4}></input>
                <label className="form-check-label universal_label_radio" for="flexRadioDefault1">
                  <span className="universal_text_HM">4</span>
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input universal_checkbox_HM" type="radio" name="nivelSoc" id="flexRadioDefaultNivelSoc" value={5}></input>
                <label className="form-check-label universal_label_radio" for="flexRadioDefault1">
                  <span className="universal_text_HM">5</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="user_space_not user_container_column">
          <div className="input-group mb-3 "></div>
          <div className="mb-3" onChange={handleNotas_CChange}>
            <textarea className="form-control  user_input_notas" id="exampleFormControlTextarea1" rows="3" placeholder="Notas: " maxLength="560" value={notas_c}></textarea>
          </div>
          <div className="input-group mb-3">
            <div className="user_div_radio">
              <div className="form-check" onChange={handleRadioChange}>
                <input className="form-check-input universal_checkbox_HM" type="radio" name="huesEU" id="flexRadioDefaultHuesEU" value={true}></input>
                <label className="form-check-label universal_label_radio" for="flexRadioDefault1">
                  <span className="universal_text_HM">Huésped</span>
                </label>
                
              </div>
              <div className="form-check" onChange={handleRadioChange}>
                <input className="form-check-input universal_checkbox_HM" type="radio" name="huesEU" id="flexRadioDefaultHuesEU" value={false}></input>
                <label className="form-check-label universal_label_radio" for="flexRadioDefault1">
                  <span className="universal_text_HM">Entrada Única</span>
                </label>
              </div>
            </div>
          </div>
          {showBedNumber && (
            <div className="user_label_x" onChange={handleId_CamaCChange}>
              <span>Número de Cama: </span>
              <select className="form-select user_select_beds sm" aria-label="Default select example">
                <option selected>{id_cama}</option> {/*AQUÍ TENDRÍA QUE IR LA ID DE CAMA SELECCIONADA EN LA PANTALLA DE GESTION*/}
                {bed.map((item, index) => {
                  if ((sexoUsuario === true && item.id_zona === id_zona_hombres) ||
                    (sexoUsuario === false && item.id_zona === id_zona_mujeres) ||
                    item.id_zona === id_zona_vetados) {
                    if (item.id_zona === id_zona_vetados) {
                      contador++;
                      return <option key={item.id_cama} value={item.id_cama}>{aisladoLetras[contador]}</option>;
                    } else {
                      return <option key={item.id_cama} value={item.id_cama}>{item.id_cama}</option>;
                    }
                  }
                  return null;
                })}
              </select>

            </div>
          )}
          {showServices && (
            <div>
              <div className="input-group mb-3">
                <span className="button-serv input-group-text user_span_notesicon" id="basic-addon1" onClick={() => handleSetShower(1)}><IoMdAddCircleOutline /></span>
                <span className="button-serv input-group-text user_span_notesicon" id="basic-addon1" onClick={() => handleSetShower(0)}><IoMdRemoveCircleOutline /></span>
                <span className="input-group-text user_span_notestext user_span_notesleft" id="basic-addon1">Regadera</span>
                <span className="input-group-text user_span_notestext" id="basic-addon1">{shower}</span>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text user_span_notesicon" id="basic-addon1" onClick={() => handleSetBathroom(1)}><IoMdAddCircleOutline /></span>
                <span className="input-group-text user_span_notesicon" id="basic-addon1" onClick={() => handleSetBathroom(0)}><IoMdRemoveCircleOutline /></span>
                <span className="input-group-text user_span_notestext user_span_notesleft" id="basic-addon1">Baño</span>
                <span className="input-group-text user_span_notestext" id="basic-addon1">{bathroom}</span>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text user_span_notesicon" id="basic-addon1" onClick={() => handleSetBreakfast(1)}><IoMdAddCircleOutline /></span>
                <span className="input-group-text user_span_notesicon" id="basic-addon1" onClick={() => handleSetBreakfast(0)}><IoMdRemoveCircleOutline /></span>
                <span className="input-group-text user_span_notestext user_span_notesleft" id="basic-addon1">Desayuno</span>
                <span className="input-group-text user_span_notestext" id="basic-addon1">{breakfast}</span>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text user_span_notesicon" id="basic-addon1" onClick={() => handleSetMeal(1)}><IoMdAddCircleOutline /></span>
                <span className="input-group-text user_span_notesicon" id="basic-addon1" onClick={() => handleSetMeal(0)}><IoMdRemoveCircleOutline /></span>
                <span className="input-group-text user_span_notestext user_span_notesleft" id="basic-addon1">Comida</span>
                <span className="input-group-text user_span_notestext" id="basic-addon1">{meal}</span>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text user_span_notesicon" id="basic-addon1" onClick={() => handleSetDinner(1)}><IoMdAddCircleOutline /></span>
                <span className="input-group-text user_span_notesicon" id="basic-addon1" onClick={() => handleSetDinner(0)}><IoMdRemoveCircleOutline /></span>
                <span className="input-group-text user_span_notestext user_span_notesleft" id="basic-addon1">Cena</span>
                <span className="input-group-text user_span_notestext" id="basic-addon1">{dinner}</span>
              </div>
            </div>
          )}
          <div className='universal_text_error'>
            {generalError}
          </div>
          <button type="button" className={`user_button_register App_buttonaccept ${btRegistro ? 'activo' : ''}`} onClick={handleBtRegistroClick}>
            {btRegistro ? 'Desactivar' : 'Registrar'}
          </button>

        </div>
      </div>
      <MyToastContainer />
    </div>
  );
}

export default UserNewAdmin;