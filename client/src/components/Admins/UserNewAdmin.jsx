import './UserNewAdmin.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { LuUser } from "react-icons/lu";
/* import { LuCalendarDays } from "react-icons/lu";
import { MdOutlineAttachMoney } from "react-icons/md"; */
import { FiHome } from "react-icons/fi";
import { TbMoodKid } from "react-icons/tb";
import { FaRegAddressCard } from "react-icons/fa";
import { RiHospitalLine } from "react-icons/ri";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoMdRemoveCircleOutline } from "react-icons/io";

const UserNewAdmin = () => {

  const [bed, setBed] = useState([{id_cama: 0}])
  useEffect(() => {
    fetch('http://localhost:8000/alldispbeds')
    .then((res) => res.json())
    .then((beds) => setBed(beds));
  }, [])

  const [area, setArea] = useState([{id_area: 0, nombre_a: ''}]) //PARA DROPDOWN DE AREA PACIENTE
  useEffect(() => {
    fetch('http://localhost:8000/allareas')
    .then((res) => res.json())
    .then((areas) => setArea(areas));
  }, [])

  const [isVisitantePrevio, setIsVisitantePrevio] = useState(false);
  const handleIsVisitantePrevioChange = (event) => {
    // console.log(event.target.checked)
    setIsVisitantePrevio(event.target.checked)
  }

  //Para nombres y apellidos del usuario
  const [nombre_c, setNombre_C] = useState([])
  const [apellidos_c, setApellidos_C] = useState([])
  const handleNombre_CChange = (event) => {
    const inputValue = event.target.value;
    const [nombre_c, ...apellidos_c] = inputValue.split(' ');
    // console.log(nombre_c)
    // console.log(apellidos_c)
    setNombre_C(nombre_c);
    setApellidos_C(apellidos_c.join(' '))
  }

  const [client, setClient] = useState([{sexo: null, nivel_se: 0, lugar_o: '', nombre_p: '', apellidos_p: '', carnet: '', id_area: 0, notas_c: ''}])
  useEffect(() => {
    if (isVisitantePrevio === true) {
      fetch('http://localhost:8000/allclientinfo', {
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
  console.log(client)

  const [isPaciente, setIsPaciente] = useState(false)
  
  const [sexo, setSexo] = useState(null)
  const handleSexoChange = (event) => {
    console.log(event.target.value)
    setSexo(event.target.value)
  }

  const [nivel_se, setNivel_SE] = useState(0)
  const handleNivel_SEChange = (event) => {
    // console.log(event.target.value)
    setNivel_SE(event.target.value)
  }

  const [lugar_o, setLugar_O] = useState('')
  const handleLugar_OChange = (event) => {
    // console.log(event.target.value)
    setLugar_O(event.target.value)
  }

  const [nombre_p, setNombre_P] = useState('')
  const [apellidos_p, setApellidos_P] = useState('')
  const handleNombre_PChange = (event) => {
    const inputValue = event.target.value;
    const [nombre_p, ...apellidos_p] = inputValue.split(' ');
    // console.log(nombre_p)
    // console.log(apellidos_p)
    setNombre_P(nombre_p);
    setApellidos_P(apellidos_p.join(' '))
  }

  const [carnet, setCarnet] = useState('')
  const handleCarnetChange = (event) => {
    // console.log(event.target.value)
    setCarnet(event.target.value)
  }

  const [notas_p, setNotas_P] = useState('')
  const handleNotas_PChange = (event) => {
    // console.log(event.target.value)
    setNotas_P(event.target.value)
  }

  const [showServices, setShowServices] = useState(false);
  const [showBedNumber, setShowBedNumber] = useState(true);

  const handleRadioChange = (event) => {
    if (event.target.value === "op2") {
      setShowServices(true);
      setShowBedNumber(false); 
    } else {
      setShowServices(false);
      setShowBedNumber(true); 
    }
  };

  const [id_cama, setId_Cama] = useState(0)
  
  const [shower, setShower] = useState(0);
  const [bathroom, setBathroom] = useState(0);
  const [breakfast, setBreakfast] = useState(0);
  const [meal, setMeal] = useState(0);
  const [dinner, setDinner] = useState(0);


  //Funciones para modificar cantidad de servicios (entrada única)
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

  //Dibujado de elementos
  return (
    <div class='App_minheight'>
      <div class="user_container_general">
        <div class="container user_container_reg">   
          <div class="input-group mb-3 user_checkerito">
            <div class="form-check form-switch" onChange={handleIsVisitantePrevioChange}>
              <input class="form-check-input universal_checkbox_HM" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={isVisitantePrevio}></input>
              <label class="universal_label_radio" for="flexSwitchCheckDefault">Visitante Previo</label>
            </div>
            <div class="form-check form-switch">
              <input class="form-check-input universal_checkbox_HM" type="checkbox" role="switch" id="flexSwitchCheckDefault"></input>
              <label class="universal_label_radio" for="flexSwitchCheckDefault">Paciente</label>
            </div>
          </div>     
          <div class="input-group mb-3 " onChange={handleNombre_CChange}>
            <span class="input-group-text user_span_space_icon" id="basic-addon1"><LuUser /></span>
            <input type="text" class="form-control user_space_reg" placeholder="Nombre Completo" aria-label="Username" aria-describedby="basic-addon1"></input>
          </div>
          <div class="input-group mb-3 user_checkerito" onChange={handleSexoChange}>
            <div class="user_div_radio">
              <div class="universal_margin_formcheck">
                <input class="form-check-input universal_checkbox_HM" type="radio" name="sexo" id="flexRadioDefaultSexo" value={true}></input>
                <label class="universal_label_radio" for="flexRadioDefault1">
                <span class="universal_text_HM">Hombre</span>
                </label>
              </div>
              <div class="universal_margin_formcheck">
                <input class="form-check-input universal_checkbox_HM" type="radio" name="sexo" id="flexRadioDefaultSexo" value={false}></input>
                <label class="universal_label_radio" for="flexRadioDefault1">
                  <span class="universal_text_HM">Mujer</span>
                </label>
              </div>
            </div>
          </div>
          <span class="input-group-text user_span_sociolevel" id="basic-addon1">Nivel Socioeconómico</span>
          <div class="input-group mb-3 user_checkerito" onChange={handleNivel_SEChange}>
            <div class="user_div_radio">
              <div class="universal_margin_formcheck">
                <input class="form-check-input universal_checkbox_HM"  type="radio" name="nivelSoc" id="flexRadioDefaultNivelSoc" value={1}></input>
                <label class="universal_label_radio" for="flexRadioDefault1">
                <span class="universal_text_HM">1</span>
                </label>
              </div>
              <div class="universal_margin_formcheck">
                <input class="form-check-input universal_checkbox_HM" type="radio" name="nivelSoc" id="flexRadioDefaultNivelSoc" value={2}></input>
                <label class="universal_label_radio" for="flexRadioDefault1">
                  <span class="universal_text_HM">2</span>
                </label>
              </div>
              <div class="universal_margin_formcheck">
                <input class="form-check-input universal_checkbox_HM" type="radio" name="nivelSoc" id="flexRadioDefaultNivelSoc" value={3}></input>
                <label class="universal_label_radio" for="flexRadioDefault1">
                <span class="universal_text_HM">3</span>
                </label>
              </div>
              <div class="universal_margin_formcheck">
                <input class="form-check-input universal_checkbox_HM" type="radio" name="nivelSoc" id="flexRadioDefaultNivelSoc" value={4}></input>
                <label class="universal_label_radio" for="flexRadioDefault1">
                  <span class="universal_text_HM">4</span>
                </label>
              </div>
              <div class="universal_margin_formcheck">
                <input class="form-check-input universal_checkbox_HM" type="radio" name="nivelSoc" id="flexRadioDefaultNivelSoc" value={5}></input>
                <label class="universal_label_radio" for="flexRadioDefault1">
                <span class="universal_text_HM">5</span>
                </label>
              </div>
            </div>
          </div>
          <div class="input-group mb-3 " onChange={handleLugar_OChange}>
            <span class="input-group-text user_span_space_icon" id="basic-addon1"><FiHome /></span>
            <input type="text" class="form-control user_space_reg" placeholder="Lugar de Origen" aria-label="Username" aria-describedby="basic-addon1" value={client[0].lugar_o}></input>
          </div>
          <div class="input-group mb-3 " onChange={handleNombre_PChange}>
            <span class="input-group-text user_span_space_icon" id="basic-addon1"><TbMoodKid /></span>
            <input type="text" class="form-control user_space_reg" placeholder="Nombre del Paciente" aria-label="Username" aria-describedby="basic-addon1" value={`${client[0].nombre_p} ${client[0].apellidos_p}`}></input>
          </div>
          <div class="input-group mb-3 " onChange={handleCarnetChange}>
            <span class="input-group-text user_span_space_icon" id="basic-addon1"><FaRegAddressCard /></span>
            <input type="text" class="form-control user_space_reg" placeholder="Número de Carnet" aria-label="Username" aria-describedby="basic-addon1" value={client[0].carnet}></input>
          </div>
          <div class="input-group mb-3 ">
            <span class="input-group-text user_span_space_icon" id="basic-addon1"><RiHospitalLine /></span>
            <input type="text" class="form-control user_space_reg" placeholder="Área del Paciente" aria-label="Username" aria-describedby="basic-addon1"></input>
          </div>
        </div>
        <div class="user_space_not">
          <div class="mb-3" onChange={handleNotas_PChange}>
            <textarea class="form-control  user_input_notas" id="exampleFormControlTextarea1" rows="3" placeholder="Notas: " value={client[0].notas_c}></textarea>
          </div>
          <div class="input-group mb-3 user_checkerito">
            <div class="user_div_radio">
              <div class="universal_margin_formcheck">
                <input class="form-check-input universal_checkbox_HM" type="radio" value="op1" name="huesEU" id="flexRadioDefaultHuesEU" onChange={handleRadioChange}></input>
                <label class="universal_label_radio" for="flexRadioDefault1">
                <span class="universal_text_HM">Huésped</span>
                </label>
              </div>
              <div class="universal_margin_formcheck">
                <input class="form-check-input universal_checkbox_HM" type="radio" value="op2" name="huesEU" id="flexRadioDefaultHuesEU" onChange={handleRadioChange}></input>
                <label class="universal_label_radio" for="flexRadioDefault1">
                  <span class="universal_text_HM">Entrada Única</span>
                </label>
              </div>
            </div>
          </div>
          {showBedNumber && (
          <div class="user_label_x">
            <span>Número de Cama</span>
            <select class="form-select user_select_beds sm" aria-label="Default select example">
              <option selected>X</option> {/*AQUÍ TENDRÍA QUE IR LA ID DE CAMA SELECCIONADA EN LA PANTALLA DE GESTION*/}
              {(
                bed.map((item) => (
                  <option value={item.id_cama}>{item.id_cama}</option>
                ))
              )}
            </select>
          </div>
          )}
          {showServices && (
          <div class="user_services_register">
            <div class="input-group mb-3">
              <span className='button-serv' class="input-group-text user_span_notesicon" id="basic-addon1" onClick={() => handleSetShower(1)}><IoMdAddCircleOutline /></span>
              <span className='button-serv' class="input-group-text user_span_notesicon" id="basic-addon1" onClick={() => handleSetShower(0)}><IoMdRemoveCircleOutline /></span>
              <span class="input-group-text user_span_notestext user_span_textsize" id="basic-addon1">Regadera</span>
              <span class="input-group-text user_span_notestext" id="basic-addon1">{shower}</span>
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text user_span_notesicon" id="basic-addon1" onClick={() => handleSetBathroom(1)}><IoMdAddCircleOutline /></span>
              <span class="input-group-text user_span_notesicon" id="basic-addon1" onClick={() => handleSetBathroom(0)}><IoMdRemoveCircleOutline /></span>
              <span class="input-group-text user_span_notestext user_span_textsize" id="basic-addon1">Baño</span>
              <span class="input-group-text user_span_notestext" id="basic-addon1">{bathroom}</span>
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text user_span_notesicon" id="basic-addon1" onClick={() => handleSetBreakfast(1)}><IoMdAddCircleOutline /></span>
              <span class="input-group-text user_span_notesicon" id="basic-addon1" onClick={() => handleSetBreakfast(0)}><IoMdRemoveCircleOutline /></span>
              <span class="input-group-text user_span_notestext user_span_textsize" id="basic-addon1">Desayuno</span>
              <span class="input-group-text user_span_notestext" id="basic-addon1">{breakfast}</span>
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text user_span_notesicon" id="basic-addon1" onClick={() => handleSetMeal(1)}><IoMdAddCircleOutline /></span>
              <span class="input-group-text user_span_notesicon" id="basic-addon1" onClick={() => handleSetMeal(0)}><IoMdRemoveCircleOutline /></span>
              <span class="input-group-text user_span_notestext user_span_textsize" id="basic-addon1">Comida</span>
              <span class="input-group-text user_span_notestext" id="basic-addon1">{meal}</span>
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text user_span_notesicon" id="basic-addon1" onClick={() => handleSetDinner(1)}><IoMdAddCircleOutline /></span>
              <span class="input-group-text user_span_notesicon" id="basic-addon1" onClick={() => handleSetDinner(0)}><IoMdRemoveCircleOutline /></span>
              <span class="input-group-text user_span_notestext user_span_textsize" id="basic-addon1">Cena</span>
              <span class="input-group-text user_span_notestext" id="basic-addon1">{dinner}</span>
            </div>
          </div>
           )}
          <button type="button" className="user_button_register App_buttonaccept">Registrar</button>
        </div>
      </div>
    </div>
  );
}

export default UserNewAdmin;