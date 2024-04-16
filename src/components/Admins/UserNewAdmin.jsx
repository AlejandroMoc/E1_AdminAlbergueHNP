import './UserNewAdmin.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useRef, useState } from 'react';
import { LuUser } from "react-icons/lu";
import { LuCalendarDays } from "react-icons/lu";
import { MdOutlineAttachMoney } from "react-icons/md";
import { FiHome } from "react-icons/fi";
import { TbMoodKid } from "react-icons/tb";
import { FaRegAddressCard } from "react-icons/fa";
import { RiHospitalLine } from "react-icons/ri";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoMdRemoveCircleOutline } from "react-icons/io";

const UserNewAdmin = () => {
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

  return (
    <div class='App-minheight'>
      <div class="contenedorGral">
        <div class="container contenedorEspaciosReg">   
          <div class="input-group mb-3 checkerito">
            <div class="form-check form-switch">
              <input class="form-check-input checkboxHM" type="checkbox" role="switch" id="flexSwitchCheckDefault"></input>
              <label class="form-check-label labelRadio" for="flexSwitchCheckDefault">Visitante Previo</label>
            </div>
            <div class="form-check form-switch">
              <input class="form-check-input checkboxHM" type="checkbox" role="switch" id="flexSwitchCheckDefault"></input>
              <label class="form-check-label labelRadio" for="flexSwitchCheckDefault">Paciente</label>
            </div>
          </div>     
          <div class="input-group mb-3 ">
            <span class="input-group-text spanEspIcon" id="basic-addon1"><LuUser /></span>
            <input type="text" class="form-control espReg" placeholder="Nombre Completo" aria-label="Username" aria-describedby="basic-addon1"></input>
          </div>
          <div class="input-group mb-3 checkerito">
            <div class="divRadio">
              <div class="form-check">
                <input class="form-check-input checkboxHM" type="radio" name="sexo" id="flexRadioDefaultSexo"></input>
                <label class="form-check-label labelRadio" for="flexRadioDefault1">
                <span class="textoHM">Hombre</span>
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input checkboxHM" type="radio" name="sexo" id="flexRadioDefaultSexo"></input>
                <label class="form-check-label labelRadio" for="flexRadioDefault1">
                  <span class="textoHM">Mujer</span>
                </label>
              </div>
            </div>
          </div>
          <div class="input-group mb-3 ">
            <span class="input-group-text spanEspIcon" id="basic-addon1"><LuCalendarDays /></span>
            <input type="text" class="form-control espReg" placeholder="Fecha de Nacimiento (dd/mm/aaaa)" aria-label="Username" aria-describedby="basic-addon1"></input>
          </div>
          <span class="input-group-text spanEspL" id="basic-addon1">Nivel Socioeconómico</span>
          <div class="input-group mb-3 checkerito">
            <div class="divRadio">
              <div class="form-check">
                <input class="form-check-input checkboxHM"  type="radio" name="nivelSoc" id="flexRadioDefaultNivelSoc"></input>
                <label class="form-check-label labelRadio" for="flexRadioDefault1">
                <span class="textoHM">1</span>
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input checkboxHM" type="radio" name="nivelSoc" id="flexRadioDefaultNivelSoc"></input>
                <label class="form-check-label labelRadio" for="flexRadioDefault1">
                  <span class="textoHM">2</span>
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input checkboxHM" type="radio" name="nivelSoc" id="flexRadioDefaultNivelSoc"></input>
                <label class="form-check-label labelRadio" for="flexRadioDefault1">
                <span class="textoHM">3</span>
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input checkboxHM" type="radio" name="nivelSoc" id="flexRadioDefaultNivelSoc"></input>
                <label class="form-check-label labelRadio" for="flexRadioDefault1">
                  <span class="textoHM">4</span>
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input checkboxHM" type="radio" name="nivelSoc" id="flexRadioDefaultNivelSoc"></input>
                <label class="form-check-label labelRadio" for="flexRadioDefault1">
                <span class="textoHM">5</span>
                </label>
              </div>
            </div>
          </div>
          <div class="input-group mb-3 ">
            <span class="input-group-text spanEspIcon" id="basic-addon1"><FiHome /></span>
            <input type="text" class="form-control espReg" placeholder="Lugar de Origen" aria-label="Username" aria-describedby="basic-addon1"></input>
          </div>
          <div class="input-group mb-3 ">
            <span class="input-group-text spanEspIcon" id="basic-addon1"><TbMoodKid /></span>
            <input type="text" class="form-control espReg" placeholder="Nombre del Paciente" aria-label="Username" aria-describedby="basic-addon1"></input>
          </div>
          <div class="input-group mb-3 ">
            <span class="input-group-text spanEspIcon" id="basic-addon1"><FaRegAddressCard /></span>
            <input type="text" class="form-control espReg" placeholder="Número de Carnet" aria-label="Username" aria-describedby="basic-addon1"></input>
          </div>
          <div class="input-group mb-3 ">
            <span class="input-group-text spanEspIcon" id="basic-addon1"><RiHospitalLine /></span>
            <input type="text" class="form-control espReg" placeholder="Área del Paciente" aria-label="Username" aria-describedby="basic-addon1"></input>
          </div>
        </div>
        <div class="espNot">
          <div class="mb-3">
            <textarea class="form-control  inputNotas" id="exampleFormControlTextarea1" rows="3" placeholder="Notas: "></textarea>
          </div>
          <div class="input-group mb-3 checkerito">
            <div class="divRadio">
              <div class="form-check">
                <input class="form-check-input checkboxHM" type="radio" value="op1" name="huesEU" id="flexRadioDefaultHuesEU" onChange={handleRadioChange} ></input>
                <label class="form-check-label labelRadio" for="flexRadioDefault1">
                <span class="textoHM">Huésped</span>
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input checkboxHM" type="radio" value="op2" name="huesEU" id="flexRadioDefaultHuesEU" onChange={handleRadioChange}></input>
                <label class="form-check-label labelRadio" for="flexRadioDefault1">
                  <span class="textoHM">Entrada Única</span>
                </label>
              </div>
            </div>
          </div>
          {showBedNumber && (
          <div class="labelX">
            <span>Número de Cama</span>
            <select class="form-select selecti sm" aria-label="Default select example">
              <option selected>X</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">6</option>
              <option value="2">21</option>
              <option value="3">37</option>
            </select>
          </div>
          )}
          {showServices && (
          <div class="servoSocs">
            <div class="input-group mb-3">
              <span className='button-serv' class="input-group-text spanNotIcon" id="basic-addon1" onClick={() => handleSetShower(1)}><IoMdAddCircleOutline /></span>
              <span className='button-serv' class="input-group-text spanNotIcon" id="basic-addon1" onClick={() => handleSetShower(0)}><IoMdRemoveCircleOutline /></span>
              <span class="input-group-text spanNotText" id="basic-addon1">Regadera</span>
              <span class="input-group-text spanNotText" id="basic-addon1">{shower}</span>
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text spanNotIcon" id="basic-addon1" onClick={() => handleSetBathroom(1)}><IoMdAddCircleOutline /></span>
              <span class="input-group-text spanNotIcon" id="basic-addon1" onClick={() => handleSetBathroom(0)}><IoMdRemoveCircleOutline /></span>
              <span class="input-group-text spanNotText" id="basic-addon1">Baño</span>
              <span class="input-group-text spanNotText" id="basic-addon1">{bathroom}</span>
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text spanNotIcon" id="basic-addon1" onClick={() => handleSetBreakfast(1)}><IoMdAddCircleOutline /></span>
              <span class="input-group-text spanNotIcon" id="basic-addon1" onClick={() => handleSetBreakfast(0)}><IoMdRemoveCircleOutline /></span>
              <span class="input-group-text spanNotText" id="basic-addon1">Desayuno</span>
              <span class="input-group-text spanNotText" id="basic-addon1">{breakfast}</span>
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text spanNotIcon" id="basic-addon1" onClick={() => handleSetMeal(1)}><IoMdAddCircleOutline /></span>
              <span class="input-group-text spanNotIcon" id="basic-addon1" onClick={() => handleSetMeal(0)}><IoMdRemoveCircleOutline /></span>
              <span class="input-group-text spanNotText" id="basic-addon1">Comida</span>
              <span class="input-group-text spanNotText" id="basic-addon1">{meal}</span>
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text spanNotIcon" id="basic-addon1" onClick={() => handleSetDinner(1)}><IoMdAddCircleOutline /></span>
              <span class="input-group-text spanNotIcon" id="basic-addon1" onClick={() => handleSetDinner(0)}><IoMdRemoveCircleOutline /></span>
              <span class="input-group-text spanNotText" id="basic-addon1">Cena</span>
              <span class="input-group-text spanNotText" id="basic-addon1">{dinner}</span>
            </div>
          </div>
           )}
          <button type="button" className="botonReg Appglobal-buttonaccept">Registrar</button>
        </div>
      </div>
    </div>
  );
}

export default UserNewAdmin;