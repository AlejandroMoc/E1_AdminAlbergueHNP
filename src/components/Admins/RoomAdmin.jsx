import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RoomAdmin.scss';
import { Dropdown, Menu } from 'antd';

import iconocama from '../../assets/logos/iconocama.svg';
import { IoAddCircleOutline, IoBookOutline, IoCopyOutline, IoPersonOutline } from "react-icons/io5";
import { FaCircle } from "react-icons/fa6";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { MdOutlineFastfood } from "react-icons/md";
import { LuUserMinus } from "react-icons/lu";
import { FaRegTrashAlt } from "react-icons/fa";

const RoomAdmin = () => {
  const cantidadHombres = 31;
  const cantidadMujeres = 32;
  const cantidadAislados = 2;

  const camasHombres = Array(cantidadHombres).fill(null);
  const camasMujeres = Array(cantidadMujeres).fill(null);
  const camasAislados = Array(cantidadAislados).fill(null);

  const aisladoLetras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H','I',
                        'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 
                        'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  const menu = (
    <Menu>
      <Menu.Item key="numeroCama">
        <span class="numCamaText">Cama #X</span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="nombreCompleto" icon={<IoPersonOutline />}>
        Lorem Ipsum
      </Menu.Item>
      
      <Menu.Item key="carnet" icon={<IoBookOutline />}>
        #A01736278
      </Menu.Item>
      
      <Menu.SubMenu key="pago" icon={<RiMoneyDollarCircleLine />} title="Pagar $20.00">
        <Menu.Item key="subItemPago" onClick={(event) => event.stopPropagation()}>
          <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1">Pagar</span>
            <input type="text" class="form-control" placeholder="$20.00" aria-label="Username" aria-describedby="basic-addon1" />
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
            <label class="form-check-label" for="flexCheckDefault">
              Condonar Pago
            </label>
          </div>
        </Menu.Item>
      </Menu.SubMenu>
      
      <Menu.SubMenu key="regServicio" icon={<MdOutlineFastfood />} title="Registrar Servicio">
        <Menu.Item key="subItemPago" onClick={(event) => event.stopPropagation()}>
          <div class="input-group mb-3">
            <span class="input-group-text">+</span>
            <input type="text" class="form-control" placeholder="Desayuno: 0" aria-label="Amount (to the nearest dollar)" />
            <span class="input-group-text">-</span>
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text">+</span>
            <input type="text" class="form-control" placeholder="Comida: 0" aria-label="Amount (to the nearest dollar)" />
            <span class="input-group-text">-</span>
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text">+</span>
            <input type="text" class="form-control" placeholder="Cena: 0" aria-label="Amount (to the nearest dollar)" />
            <span class="input-group-text">-</span>
          </div>
          <button type="button" class="btn btn-light botonReg">Registrar</button>
        </Menu.Item>
      </Menu.SubMenu>
      
      <Menu.Item key="eliminarUsuario" icon={<LuUserMinus />}>
        Eliminar Usuario
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="eliminarCama" icon={<FaRegTrashAlt />} danger="true">
        Eliminar Cama
      </Menu.Item>
    </Menu>
  )
  
  return (
    <div className='App-minheight'>

      <Dropdown overlay={menu} trigger={["contextMenu"]}>
        <div class="redacted">Redacted</div>
      </Dropdown>

        <div class="titulosZonas container">
          <span class="tituloZona">ZONA DE MUJERES</span>
          <div class="indicadoresDiv">
            <span class="indicadorText"><FaCircle id="circuloGris"/> Dispoible</span>
            <span class="indicadorText"><FaCircle id="circuloAzul"/> Ocupado</span>
            <span class="indicadorText"><FaCircle id="circuloRojo"/> Deudor</span>
          </div>
        </div>
        
        <div class="container">
          {camasHombres.map((_, index) => (
            <div key={index} class="card cama camaGris">
              <img src={iconocama} class="card-img-top" alt="..."></img>
              <p class="numerazo">{index+1}</p>
            </div>
          ))}
          <div class="card addCama">
            <button id="addCamaButton"><IoAddCircleOutline /></button>
          </div>
        </div>

        <hr></hr>
        

        <div class="titulosZonas container">
          <span class="tituloZona">ZONA DE HOMBRES</span>
          <div class="indicadoresDiv">
            <span class="indicadorText"><FaCircle id="circuloGris"/> Dispoible</span>
            <span class="indicadorText"><FaCircle id="circuloAzul"/> Ocupado</span>
            <span class="indicadorText"><FaCircle id="circuloRojo"/> Deudor</span>
          </div>
        </div>
        <div class="container">
          {camasMujeres.map((_, index) => (
            <div key={index} class="card cama camaAzul">
              <img src={iconocama} class="card-img-top" alt="..."></img>
              <p class="numerazo">{index+32}</p>
            </div>
          ))}
          <div class="card addCama">
            <button id="addCamaButton"><IoAddCircleOutline /></button>
          </div>
        </div>

        <hr></hr>

        <div class="titulosZonas container">
          <span class="tituloZona">ZONA DE AISLADOS</span>
          <div class="indicadoresDiv">
            <span class="indicadorText"><FaCircle id="circuloGris"/> Dispoible</span>
            <span class="indicadorText"><FaCircle id="circuloAzul"/> Ocupado</span>
            <span class="indicadorText"><FaCircle id="circuloRojo"/> Deudor</span>
          </div>
        </div>
        <div class="container">
          {camasAislados.map((_, index) => (
            <div key={index} class="card cama camaRoja">
              <img src={iconocama} class="card-img-top" alt="..."></img>
              <p class="numerazo">{aisladoLetras[index]}</p>
            </div>
          ))}
          <div class="card addCama">
            <button id="addCamaButton"><IoAddCircleOutline /></button>
          </div>
        </div>
      
    </div>
  )
}

export default RoomAdmin;