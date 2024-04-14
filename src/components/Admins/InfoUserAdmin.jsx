import React from 'react';
import './InfoUserAdmin.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

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
            <span class="input-group-text spanInfo" id="basic-addon1">Greko Jonás García</span>
          </div>
          <div class="input-group mb-3 checkerito">
            <div class="divRadio">
              <div class="form-check">
                <input class="form-check-input checkboxHM" type="radio" name="flexRadioDefault" id="flexCheckChecked" checked></input>
                <label class="form-check-label labelRadio" for="flexRadioDefault1">
                <span class="textoHM">Hombre</span>
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input checkboxHM" type="radio" name="flexRadioDefault" id="flexRadioDefault1"></input>
                <label class="form-check-label labelRadio" for="flexRadioDefault1">
                  <span class="textoHM">Mujer</span>
                </label>
              </div>
            </div>
          </div>
          <div class="input-group mb-3 ">
            <span class="input-group-text spanEspIcon" id="basic-addon1"><LuCalendarDays /></span>
            <span class="input-group-text spanInfo" id="basic-addon1">29 / 08 / 2003</span>
          </div>
          <span class="input-group-text spanEspL" id="basic-addon1">Nivel Socioeconómico</span>
          <div class="input-group mb-3 checkerito">
            <div class="divRadio">
              <div class="form-check">
                <input class="form-check-input checkboxHM"  type="radio" name="flexRadioDefault" id="flexRadioDefault1"></input>
                <label class="form-check-label labelRadio" for="flexRadioDefault1">
                <span class="textoHM">1</span>
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input checkboxHM" type="radio" name="flexRadioDefault" id="flexRadioDefault1"></input>
                <label class="form-check-label labelRadio" for="flexRadioDefault1">
                  <span class="textoHM">2</span>
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input checkboxHM" type="radio" name="flexRadioDefault" id="flexRadioDefault1"></input>
                <label class="form-check-label labelRadio" for="flexRadioDefault1">
                <span class="textoHM">3</span>
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input checkboxHM" type="radio" name="flexRadioDefault" id="flexRadioDefault1"></input>
                <label class="form-check-label labelRadio" for="flexRadioDefault1">
                  <span class="textoHM">4</span>
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input checkboxHM" type="radio" name="flexRadioDefault" id="flexRadioDefault1"></input>
                <label class="form-check-label labelRadio" for="flexRadioDefault1">
                <span class="textoHM">5</span>
                </label>
              </div>
            </div>
          </div>
          <div class="input-group mb-3 ">
            <span class="input-group-text spanEspIcon" id="basic-addon1"><FiHome /></span>
            <span class="input-group-text spanInfo" id="basic-addon1">Puebla</span>
          </div>
          <div class="input-group mb-3 ">
            <span class="input-group-text spanEspIcon" id="basic-addon1"><TbMoodKid /></span>
            <span class="input-group-text spanInfo" id="basic-addon1">Jonás Jr.</span>
          </div>
          <div class="input-group mb-3 ">
            <span class="input-group-text spanEspIcon" id="basic-addon1"><FaRegAddressCard /></span>
            <span class="input-group-text spanInfo" id="basic-addon1">1HE3-12FT-1823</span>
          </div>
          <div class="input-group mb-3 ">
            <span class="input-group-text spanEspIcon" id="basic-addon1"><RiHospitalLine /></span>
            <span class="input-group-text spanInfo" id="basic-addon1">Urgencias</span>
          </div>
        </div>
        <div class="espNot">
          <div class="mb-3">
            <textarea class="form-control  inputNotas" id="exampleFormControlTextarea1" rows="3" placeholder="Notas: "></textarea>
          </div>
          <div class="input-group mb-3 checkerito">
            <div class="divRadio">
              <div class="form-check">
                <input class="form-check-input checkboxHM" type="radio" name="flexRadioDefault" id="flexRadioDefault1"></input>
                <label class="form-check-label labelRadio" for="flexRadioDefault1">
                <span class="textoHM">Huésped</span>
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input checkboxHM" type="radio" name="flexRadioDefault" id="flexRadioDefault1"></input>
                <label class="form-check-label labelRadio" for="flexRadioDefault1">
                  <span class="textoHM">Entrada Única</span>
                </label>
              </div>
            </div>
          </div>
          <div class="labelX">
            <span>Número de Cama: 44</span>
          </div>
          <div class="servoSocs">
            <div class="input-group mb-3">
              
              <span class="input-group-text spanNotText" id="basic-addon1">Regadera</span>
              <span class="input-group-text spanNotText" id="basic-addon1">0</span>
            </div>
            <div class="input-group mb-3">
              
              <span class="input-group-text spanNotText" id="basic-addon1">Baño</span>
              <span class="input-group-text spanNotText" id="basic-addon1">0</span>
            </div>
          </div>
          <div>
            <div class="input-group mb-3">
              
              <span class="input-group-text spanNotText" id="basic-addon1">Desayuno</span>
              <span class="input-group-text spanNotText" id="basic-addon1">0</span>
            </div>
            <div class="input-group mb-3">
              
              <span class="input-group-text spanNotText" id="basic-addon1">Comida</span>
              <span class="input-group-text spanNotText" id="basic-addon1">0</span>
            </div>
            <div class="input-group mb-3">
              
              <span class="input-group-text spanNotText" id="basic-addon1">Cena</span>
              <span class="input-group-text spanNotText" id="basic-addon1">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserNewAdmin