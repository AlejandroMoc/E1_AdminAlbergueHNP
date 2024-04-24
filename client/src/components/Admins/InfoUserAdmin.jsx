import React from 'react';
import './UserNewAdmin.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

import { LuUser } from "react-icons/lu";
import { LuCalendarDays } from "react-icons/lu";
/* import { MdOutlineAttachMoney } from "react-icons/md"; */
import { FiHome } from "react-icons/fi";
import { TbMoodKid } from "react-icons/tb";
import { FaRegAddressCard } from "react-icons/fa";
import { RiHospitalLine } from "react-icons/ri";
/* import { IoMdAddCircleOutline } from "react-icons/io";
import { IoMdRemoveCircleOutline } from "react-icons/io";
 */
const UserNewAdmin = () => {

  return (
    <div class='App_minheight'>
      <div class="user_container_general">
        <div class="container user_container_reg">   
          <div class="input-group mb-3 user_checkerito">
            <div class="form-check form-switch">
              <input class="form-check-input universal_checkbox_HM" type="checkbox" role="switch" id="flexSwitchCheckDefault"></input>
              <label class="form-check-label universal_label_radio" for="flexSwitchCheckDefault">Visitante Previo</label>
            </div>
            <div class="form-check form-switch">
              <input class="form-check-input universal_checkbox_HM" type="checkbox" role="switch" id="flexSwitchCheckDefault"></input>
              <label class="form-check-label universal_label_radio" for="flexSwitchCheckDefault">Paciente</label>
            </div>
          </div>     
          <div class="input-group mb-3 ">
            <span class="input-group-text user_span_space_icon" id="basic-addon1"><LuUser /></span>
            <span class="input-group-text user_span_info" id="basic-addon1">Greko Jonás García</span>
          </div>
          <div class="input-group mb-3 user_checkerito">
            <div class="user_div_radio">
              <div class="form-check">
                <input class="form-check-input universal_checkbox_HM" type="radio" name="flexRadioDefault" id="flexCheckChecked" checked></input>
                <label class="form-check-label universal_label_radio" for="flexRadioDefault1">
                <span class="universal_text_HM">Hombre</span>
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input universal_checkbox_HM" type="radio" name="flexRadioDefault" id="flexRadioDefault1"></input>
                <label class="form-check-label universal_label_radio" for="flexRadioDefault1">
                  <span class="universal_text_HM">Mujer</span>
                </label>
              </div>
            </div>
          </div>
          <div class="input-group mb-3 ">
            <span class="input-group-text user_span_space_icon" id="basic-addon1"><LuCalendarDays /></span>
            <span class="input-group-text user_span_info" id="basic-addon1">29 / 08 / 2003</span>
          </div>
          <span class="input-group-text user_span_sociolevel" id="basic-addon1">Nivel Socioeconómico</span>
          <div class="input-group mb-3 user_checkerito">
            <div class="user_div_radio">
              <div class="form-check">
                <input class="form-check-input universal_checkbox_HM"  type="radio" name="flexRadioDefault" id="flexRadioDefault1"></input>
                <label class="form-check-label universal_label_radio" for="flexRadioDefault1">
                <span class="universal_text_HM">1</span>
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input universal_checkbox_HM" type="radio" name="flexRadioDefault" id="flexRadioDefault1"></input>
                <label class="form-check-label universal_label_radio" for="flexRadioDefault1">
                  <span class="universal_text_HM">2</span>
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input universal_checkbox_HM" type="radio" name="flexRadioDefault" id="flexRadioDefault1"></input>
                <label class="form-check-label universal_label_radio" for="flexRadioDefault1">
                <span class="universal_text_HM">3</span>
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input universal_checkbox_HM" type="radio" name="flexRadioDefault" id="flexRadioDefault1"></input>
                <label class="form-check-label universal_label_radio" for="flexRadioDefault1">
                  <span class="universal_text_HM">4</span>
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input universal_checkbox_HM" type="radio" name="flexRadioDefault" id="flexRadioDefault1"></input>
                <label class="form-check-label universal_label_radio" for="flexRadioDefault1">
                <span class="universal_text_HM">5</span>
                </label>
              </div>
            </div>
          </div>
          <div class="input-group mb-3 ">
            <span class="input-group-text user_span_space_icon" id="basic-addon1"><FiHome /></span>
            <span class="input-group-text user_span_info" id="basic-addon1">Puebla</span>
          </div>
          <div class="input-group mb-3 ">
            <span class="input-group-text user_span_space_icon" id="basic-addon1"><TbMoodKid /></span>
            <span class="input-group-text user_span_info" id="basic-addon1">Jonás Jr.</span>
          </div>
          <div class="input-group mb-3 ">
            <span class="input-group-text user_span_space_icon" id="basic-addon1"><FaRegAddressCard /></span>
            <span class="input-group-text user_span_info" id="basic-addon1">1HE3-12FT-1823</span>
          </div>
          <div class="input-group mb-3 ">
            <span class="input-group-text user_span_space_icon" id="basic-addon1"><RiHospitalLine /></span>
            <span class="input-group-text user_span_info" id="basic-addon1">Urgencias</span>
          </div>
        </div>
        <div class="user_space_not">
          <div class="mb-3">
            <textarea class="form-control  user_input_notas" id="exampleFormControlTextarea1" rows="3" placeholder="Notas: "></textarea>
          </div>
          <div class="input-group mb-3 user_checkerito">
            <div class="user_div_radio">
              <div class="form-check">
                <input class="form-check-input universal_checkbox_HM" type="radio" name="flexRadioDefault" id="flexRadioDefault1"></input>
                <label class="form-check-label universal_label_radio" for="flexRadioDefault1">
                <span class="universal_text_HM">Huésped</span>
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input universal_checkbox_HM" type="radio" name="flexRadioDefault" id="flexRadioDefault1"></input>
                <label class="form-check-label universal_label_radio" for="flexRadioDefault1">
                  <span class="universal_text_HM">Entrada Única</span>
                </label>
              </div>
            </div>
          </div>
          <div class="user_label_x">
            <span>Número de Cama: 44</span>
          </div>
          <div class="user_services_register">
            <div class="input-group mb-3">
              <span class="input-group-text user_span_notestext user_span_textsize" id="basic-addon1">Regadera</span>
              <span class="input-group-text user_span_notestext" id="basic-addon1">0</span>
            </div>
            <div class="input-group mb-3">
              
              <span class="input-group-text user_span_notestext user_span_textsize" id="basic-addon1">Baño</span>
              <span class="input-group-text user_span_notestext" id="basic-addon1">0</span>
            </div>
          </div>
          <div>
            <div class="input-group mb-3">
              
              <span class="input-group-text user_span_notestext user_span_textsize" id="basic-addon1">Desayuno</span>
              <span class="input-group-text user_span_notestext" id="basic-addon1">0</span>
            </div>
            <div class="input-group mb-3">
              
              <span class="input-group-text user_span_notestext user_span_textsize" id="basic-addon1">Comida</span>
              <span class="input-group-text user_span_notestext" id="basic-addon1">0</span>
            </div>
            <div class="input-group mb-3">
              
              <span class="input-group-text user_span_notestext user_span_textsize" id="basic-addon1">Cena</span>
              <span class="input-group-text user_span_notestext" id="basic-addon1">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserNewAdmin