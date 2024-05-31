import './UserNewAdmin.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState} from 'react';
import {LuUser} from "react-icons/lu";
import {FiHome} from "react-icons/fi";
import {useAuth} from '../../auth/AuthProvider';
import {MdFaceUnlock} from "react-icons/md";
import {useNavigate} from "react-router-dom";
import {FaRegAddressCard} from "react-icons/fa";
// import {IoMdAddCircleOutline} from "react-icons/io";
// import {IoMdRemoveCircleOutline} from "react-icons/io";
import MyToastContainer, {successToast, errorToast, errorCarnet} from '../universal/MyToast';
//import {registerNewPatient} from '../../../../server/queries/UsernewQueries';

import { API_URL } from '../../App';

const UserNewAdmin = (props) => {
  //Para pasar a dashboard
  const goTo = useNavigate();

  const id_u = useAuth().getUser().id_usuario
  //Fetch para jalar información desde info cliente
  const [infoCliente, setinfoCliente] = useState({nombre_c: "", apellidos_c: "", fecha_i: 0, lugar_o: "", nombre_p: "", apellidos_p: "", carnet: "", nombre_a: "", nivel_se: 0, notas_c: 0, sexo: ""})

  useEffect(() => {
    fetch('http://localhost:8008/clienteInfo/' + props.id_cliente)
    // fetch(`${API_URL}/clienteInfo/` + props.id_cliente)
      .then((res) => res.json())
      .then((data) => {
        setinfoCliente(data);
        setNombre_P(data.nombre_p);
        setApellidos_P(data.apellidos_p);
        setLugar_O(data.lugar_o);
        setCarnet(data.carnet);
        setApellidos_C(data.apellidos_c);
        setNombre_C(data.nombre_c)
        setId_areaC(data.id_area);
        setNotas_C(data.notas_c)
        setPaciente(data.paciente);
        setIsPaciente(data.paciente);
        setSexo(data.sexo);
        setSexoUsuario(data.sexo);
        setNivel_SE(data.nivel_se);
        setId_cliente(props.id_cliente);
        //setArea(data.id_area)
        //console.log(data)
     });
 }, [props.id_cliente])
  //console.log("FECHA Inicio: " + infoCliente.nombre_c)
  const [id_cliente, setId_cliente] = useState(0)
  //console.log("TRISTEMENTE" + id_cliente)

  //FETCH PARA TIPO DE USUARIO "HUESPED"-----------------------------------------
  //console.log("VERDADERO HUESPED");
  const [huespedCliente, setHuespedCliente] = useState({id_cama: 0, fecha_i: 0})
  useEffect(() => {
    fetch(`${API_URL}/huespedInfo/` + props.id_cliente)
      .then((res) => res.json())
      .then((data) => {
        setHuespedCliente(data);
        setHuespedCliente(data);
        setId_CamaC(data.id_cama);
        //console.log(data)
     });

 }, [props.id_cliente])
  //console.log("ID CAMA" + huespedCliente.id_cama)

  //FETCH PARA CALCULAR CANTIDAD DE CADA SERVICIO 
  const [servicioCliente, setservicioCliente] = useState({servicio1: 0, servicio2: 0, servicio3: 0, servicio4: 0, servicio5: 0})

  useEffect(() => {
    fetch(`${API_URL}/servicioEU/` + props.id_cliente)
      .then((res) => res.json())
      .then((data) => {
        setservicioCliente(data);
        setShower(data.servicio1);
        //console.log(data)
     });
 }, [props.id_cliente])
  //console.log("SErvicio: " + servicioCliente.servicio5)


  //console.log("id_cama")
  const [bed, setBed] = useState([{id_cama: 0}])
  useEffect(() => {
    fetch(`${API_URL}/alldispbeds`)
      .then((res) => res.json())
      .then((beds) => setBed(beds));
    if (sexo === true) {
      setIdZona(id_zona_hombres);
   } else {
      setIdZona(id_zona_mujeres);
   }
 }, [])


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
      if (!carnetExist) {// Verificamos si el carnet no existe
      if (showNumbersSelect === false) {
        try {
          await fetch(`${API_URL}/updateinfoEntrada`, {
            method: 'POST',
            body: JSON.stringify({carnet: carnet, id_area: id_area, nombre_p: nombre_p, apellidos_p: apellidos_p, nombre_c: nombre_c, apellidos_c: apellidos_c, lugar_o: lugar_o, notas_c: notas_c, sexo: sexo, nivel_se: nivel_se, paciente: paciente, id_u: id_u, id_cliente: id_cliente}),
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
           }
         });
          successToast()
          // window.location.href = '/dashboard';
          setTimeout(() => {
            goTo('/infouser/' + props.id_cliente);
         }, 1000);
       } catch (error) {
          console.error('Error al registrar entrada unica:', error);
          errorToast()
       }
     }
      else if (showNumbersSelect === true) {
        try {
          await fetch(`${API_URL}/updateinfocliente`, {
            method: 'POST',
            body: JSON.stringify({carnet: carnet, id_area: id_area, nombre_p: nombre_p, apellidos_p: apellidos_p, nombre_c: nombre_c, apellidos_c: apellidos_c, lugar_o: lugar_o, notas_c: notas_c, sexo: sexo, nivel_se: nivel_se, id_cama: id_cama, paciente: paciente, id_u: id_u, id_cliente: id_cliente}),
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
           }
         });
          successToast()
          //window.location.href = '/';
          setTimeout(() => {
            goTo('/infouser/' + props.id_cliente);
         }, 1000);
       } catch (error) {
          console.error('Error al registrar el paciente:', error);
          errorToast()
       }
     }
      } else {
        // Si el carnet existe, mostramos un toast indicando que el carnet está en uso
         errorCarnet()
      }
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
    setNombre_C(event.target.value);
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
    setApellidos_C(event.target.value);
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
    setApellidos_P(event.target.value);
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
    setNombre_P(event.target.value);
    setNombre_P(nombrepString);
    // if paciente = true hacer setnombre_c =
 }

  //console.log(client)


  const [sexoUsuario, setSexoUsuario] = useState(null); // Inicializamos el sexo del usuario como null

  const [sexo, setSexo] = useState(null)
  const handleSexoChange = (event) => {
    const sexoSeleccionado = event.target.value === 'true'; // Convertimos el valor del radio button a un booleano
    setSexoUsuario(sexoSeleccionado); // Actualizamos el estado con el sexo seleccionado
    setSexo(event.target.value)
    const selectedSexo = event.target.value === 'true';
    setSexo(selectedSexo);
 }

  const [nivel_se, setNivel_SE] = useState(0)
  const handleNivel_SEChange = (event) => {
    // console.log(event.target.value)
    setNivel_SE(parseInt(event.target.value, 10));
 }
  const [isPaciente, setIsPaciente] = useState(false);

  const [paciente, setPaciente] = useState(0);
  const handlePaciente_Change = (event) => {
    setIsPaciente(event.target.value === 'true');
    setPaciente(event.target.value === 'true');
 }
  useEffect(() => {
    if (isPaciente) {
      setNombre_C(nombre_p);
      setApellidos_C(apellidos_p);
   } else {
      setNombre_C(nombre_c);
      setApellidos_C(apellidos_c);
   }
 }, [nombre_p, apellidos_p, isPaciente]);

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
        const response = await fetch(`${API_URL}/carnetExistEdit/${carnet}/${id_cliente}`);
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

//console.log("carnet"+carnet)
//console.log("carnet Existe"+carnetExist)
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

  //FETCH PARA TIPO CLIENTE:
  const [tipoCliente, settipoCliente] = useState({tipo_cliente: 0})
  //FORMATO QUE DEMUESTRE O NO ELEMENTOS DEPENDIENDO DEL VALOR DEL CLIENTE 
  useEffect(() => {
    fetch(`${API_URL}/tipoCliente/` + props.id_cliente)
      .then((res) => res.json())
      .then((data) => {settipoCliente(data); console.log(data)});
 }, [props.id_cliente])
  //console.log("TipoCLIENTE" + tipoCliente.tipo_cliente)
  const showNumbersSelect = tipoCliente.tipo_cliente;

  return (
    <div className='App-minheight user_justified'>
      {/*Espaciador*/}
      <div className='user_spaciator'></div>

      <div className="user_container_general">
        {/* <div className="user_container_row"> */}
        <div className="container user_container_column">
          {/* <div className="user_container_column"> */}

          <h4>Información del Paciente</h4>
          <div className="input-group mb-3 " onChange={handleLugar_OChange}>
            <span className="input-group-text user_span_space_icon" id="basic-addon1"><FiHome /></span>
            <input type="text" className={`userinfo_span_info form-control user_space_reg ${lugar_oError ? 'is-invalid' : ''}`} placeholder="Lugar de Origen" aria-label="Username" aria-describedby="basic-addon1" onChange={handleLugar_OChange} value={lugar_o}></input>
            {lugar_oError && <div className="invalid-feedback text-start">Este campo es obligatorio</div>}
          </div>
          <div className="input-group mb-3 ">
            <span className="input-group-text user_span_space_icon" id="basic-addon1"><MdFaceUnlock /></span>
            <input type="text" className={`userinfo_span_info form-control user_space_reg ${nombre_pError ? 'is-invalid' : ''}`} placeholder="Nombre del Paciente" aria-label="Username" aria-describedby="basic-addon1" onChange={handleNombre_PChange} value={nombre_p}></input>
            {nombre_pError && <div className="invalid-feedback text-start">Este campo es obligatorio</div>}
          </div>
          <div className="input-group mb-3 ">
            <span className="input-group-text user_span_space_icon" id="basic-addon1"><MdFaceUnlock /></span>
            <input type="text" className={`userinfo_span_info form-control user_space_reg ${apellidos_pError ? 'is-invalid' : ''}`} placeholder="Apellidos del paciente" aria-label="Username" aria-describedby="basic-addon1" onChange={handleApellidos_PChange} value={apellidos_p}></input>
            {apellidos_pError && <div className="invalid-feedback text-start">Este campo es obligatorio</div>}
          </div>
          <div className="input-group mb-3 " onChange={handleCarnetChange}>
            <span className="input-group-text user_span_space_icon" id="basic-addon1"><FaRegAddressCard /></span>
            {/*TODO verificar longitud del carnet*/}
            <input type="number" min="0" minLength="8" maxLength="16" className={`userinfo_span_info form-control user_space_reg ${carnetError ? 'is-invalid' : ''}`} placeholder="Carnet" aria-label="Username" aria-describedby="basic-addon1" onChange={handleCarnetChange} value={carnet}></input>
            {carnetError && <div className="invalid-feedback text-start">Este campo es obligatorio</div>}
          </div>
          <div className="user_label_x" onChange={handleId_areaCChange}>
            <span><p>Área de Paciente: </p></span>
            <select className="form-select user_select_beds sm" aria-label="Default select example" onChange={handleId_areaCChange} value={id_area}>
              <option value={0}><p>Seleccione un área</p></option>
              {area.map((item) => (
                <option key={item.id_area} value={item.id_area}>{item.nombre_a}</option>
              ))}
            </select>
          </div>

          <div className="input-group mb-3 "></div>
          <div className="input-group mb-3 "></div>

          <h4>Información del Familiar</h4>
          <span className="user_span_sociolevel" id="basic-addon1">¿El familiar es un paciente?</span>
          <div className="input-group mb-3 checkerito" onChange={handlePaciente_Change}>
            <div className="form-check">
              <input
                className="form-check-input universal_checkbox_HM"
                type="radio"
                name="paciente"
                id="pacienteSi"
                value={true}
                checked={paciente === true}
              />
              <label className="form-check-label universal_label_radio" htmlFor="pacienteSi">
                <span className="universal_text_HM">Sí</span>
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input universal_checkbox_HM"
                type="radio"
                name="paciente"
                id="pacienteNo"
                value={false}
                checked={paciente === false}
              />
              <label className="form-check-label universal_label_radio" htmlFor="pacienteNo">
                <span className="universal_text_HM">No</span>
              </label>
            </div>
          </div>
          <div className="input-group mb-3 ">
            <span className="input-group-text user_span_space_icon" id="basic-addon1"><LuUser /></span>
            <input type="text" className={`userinfo_span_info form-control user_space_reg ${nombre_cError ? 'is-invalid' : ''}`} placeholder="Nombre Completo" aria-label="Username" aria-describedby="basic-addon1" onChange={handleNombre_CChange} value={nombre_c} disabled={isPaciente}></input>
            {nombre_cError && <div className="invalid-feedback text-start">Este campo es obligatorio</div>}
          </div>
          <div className="input-group mb-3 ">
            <span className="input-group-text user_span_space_icon" id="basic-addon1"><LuUser /></span>
            <input type="text" className={`userinfo_span_info form-control user_space_reg ${apellidos_cError ? 'is-invalid' : ''}`} placeholder="Apellidos" aria-label="Username" aria-describedby="basic-addon1" onChange={handleApellidos_CChange} value={apellidos_c} disabled={isPaciente}></input>
            {apellidos_cError && <div className="invalid-feedback text-start">Este campo es obligatorio</div>}
          </div>
          <div className="input-group mb-3" onChange={handleSexoChange}>
            <div className="user_div_radio">
              <div className="form-check">
                <input
                  className="form-check-input universal_checkbox_HM"
                  type="radio"
                  name="sexo"
                  id="flexRadioDefaultSexo"
                  value="true"
                  checked={sexo === true}
                  onChange={handleSexoChange}
                />
                <label
                  className="form-check-label universal_label_radio"
                  htmlFor="flexRadioDefaultSexo"
                >
                  <span className="universal_text_HM">Hombre</span>
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input universal_checkbox_HM"
                  type="radio"
                  name="sexo"
                  id="flexRadioDefaultSexo"
                  value="false"
                  checked={sexo === false}
                  onChange={handleSexoChange}
                />
                <label
                  className="form-check-label universal_label_radio"
                  htmlFor="flexRadioDefaultSexo"
                >
                  <span className="universal_text_HM">Mujer</span>
                </label>
              </div>
            </div>
            {sexoError && <span className="error-message">Este campo es requerido</span>}
          </div>
          <div className="form-group">
            <span className="user_span_sociolevel" id="basic-addon1">Nivel Socioeconómico</span>
            <div className="input-group mb-3" onChange={handleNivel_SEChange}>
              <div className="user_div_radio">
                <div className="form-check">
                  <input
                    className="form-check-input universal_checkbox_HM"
                    type="radio"
                    name="nivelSoc"
                    id="flexRadioDefaultNivelSoc1"
                    value="1"
                    checked={nivel_se === 1}
                    onChange={handleNivel_SEChange}
                  />
                  <label className="form-check-label universal_label_radio" htmlFor="flexRadioDefaultNivelSoc1">
                    <span className="universal_text_HM">1</span>
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input universal_checkbox_HM"
                    type="radio"
                    name="nivelSoc"
                    id="flexRadioDefaultNivelSoc2"
                    value="2"
                    checked={nivel_se === 2}
                    onChange={handleNivel_SEChange}
                  />
                  <label className="form-check-label universal_label_radio" htmlFor="flexRadioDefaultNivelSoc2">
                    <span className="universal_text_HM">2</span>
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input universal_checkbox_HM"
                    type="radio"
                    name="nivelSoc"
                    id="flexRadioDefaultNivelSoc3"
                    value="3"
                    checked={nivel_se === 3}
                    onChange={handleNivel_SEChange}
                  />
                  <label className="form-check-label universal_label_radio" htmlFor="flexRadioDefaultNivelSoc3">
                    <span className="universal_text_HM">3</span>
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input universal_checkbox_HM"
                    type="radio"
                    name="nivelSoc"
                    id="flexRadioDefaultNivelSoc4"
                    value="4"
                    checked={nivel_se === 4}
                    onChange={handleNivel_SEChange}
                  />
                  <label className="form-check-label universal_label_radio" htmlFor="flexRadioDefaultNivelSoc4">
                    <span className="universal_text_HM">4</span>
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input universal_checkbox_HM"
                    type="radio"
                    name="nivelSoc"
                    id="flexRadioDefaultNivelSoc5"
                    value="5"
                    checked={nivel_se === 5}
                    onChange={handleNivel_SEChange}
                  />
                  <label className="form-check-label universal_label_radio" htmlFor="flexRadioDefaultNivelSoc5">
                    <span className="universal_text_HM">5</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="user_space_not user_container_column">
          <div className="input-group mb-3 "></div>
          <div className="mb-3" onChange={handleNotas_CChange}>
            <textarea className="form-control  user_input_notas" id="exampleFormControlTextarea1" rows="3" placeholder="Notas: " value={notas_c}></textarea>
          </div>
          <div className="input-group mb-3">
            <div className="user_div_radio">
              {showNumbersSelect === true && (
                <div>
                  <div>
                    <label className="form-check-label user_span_notesicon" for="flexRadioDefault1">
                      <span>Huésped</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
          {showNumbersSelect === true && (
            <div className="user_label_x" onChange={handleId_CamaCChange}>
              <span>Número de Cama: </span>
              <select className="form-select user_select_beds sm" aria-label="Default select example">
                <option selected>{huespedCliente.id_cama}</option> {/*AQUÍ TENDRÍA QUE IR LA ID DE CAMA SELECCIONADA EN LA PANTALLA DE GESTION*/}
                {bed.map((item) => {
                  if ((sexoUsuario === true && item.id_zona === id_zona_hombres) ||
                    (sexoUsuario === false && item.id_zona === id_zona_mujeres) ||
                    item.id_zona === id_zona_vetados) {
                    return <option key={item.id_cama} value={item.id_cama}>{item.id_cama}</option>;
                 }
                  return null;
               })}

              </select>

            </div>
          )}
          {showNumbersSelect === false && (

            <div>
              <div>
                <label className="form-check-label user_span_notesicon" for="flexRadioDefault1">
                  <span>Entrada Única</span>
                </label>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text user_span_notestext user_span_notesleft" id="basic-addon1">Regadera</span>
                <span className="input-group-text user_span_notestext" id="basic-addon1">{servicioCliente.servicio1}</span>
              </div>
              <div className="input-group mb-3">

                <span className="input-group-text user_span_notestext user_span_notesleft" id="basic-addon1">Baño</span>
                <span className="input-group-text user_span_notestext" id="basic-addon1">{servicioCliente.servicio2}</span>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text user_span_notestext user_span_notesleft" id="basic-addon1">Desayuno</span>
                <span className="input-group-text user_span_notestext" id="basic-addon1">{servicioCliente.servicio3}</span>
              </div>
              <div className="input-group mb-3">

                <span className="input-group-text user_span_notestext user_span_notesleft" id="basic-addon1">Comida</span>
                <span className="input-group-text user_span_notestext" id="basic-addon1">{servicioCliente.servicio4}</span>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text user_span_notestext user_span_notesleft" id="basic-addon1">Cena</span>
                <span className="input-group-text user_span_notestext" id="basic-addon1">{servicioCliente.servicio5}</span>
              </div>
            </div>)}
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
//Intento para confirmar que estoy en mi rama