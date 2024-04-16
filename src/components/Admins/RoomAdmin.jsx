import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RoomAdmin.scss';
import { Dropdown, Menu } from 'antd';

import iconocama from '../../assets/logos/iconocama.svg';
import { IoAddCircleOutline  } from "react-icons/io5";
import { FaCircle } from "react-icons/fa6";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { MdOutlineFastfood } from "react-icons/md";
import { LuUserMinus } from "react-icons/lu";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaRegAddressCard } from "react-icons/fa";
import { LuUser } from "react-icons/lu";

import { useState } from 'react';


function TuComponente({texto}) {
  const [servoCount, setservoCount] = useState(0);
  const [clicked, setClicked] = useState(false);

  const handleChange = (event) => {
    setservoCount(parseInt(event.target.value) || 0);
  };

  const sumarservo = () => {
    setservoCount(servoCount + 1);
    setClicked(true);
  };

  const restarservo = () => {
    if (servoCount > 0) {
      setservoCount(servoCount - 1);
      setClicked(true);
    }
  };

  return (
    <div className="input-group mb-3 regServo">
      <span className="input-group-text" onClick={sumarservo}>+</span>
      <span className="input-group-text" onClick={restarservo}>-</span>
      <input
        type="text"
        className="form-control"
        value={clicked ? servoCount : ''}
        onChange={handleChange}
        placeholder={clicked ? '' : texto + ': 0'}
        aria-label="Amount (to the nearest dollar)"
      />
    </div>
  );
}

function Cama({color, iconocama, numCama, numCamaMenu}){

  let menu;

  const menuOcupadas = (
    <Menu>
      <Menu.Item key="numeroCama">
        <span class="numCamaText">Cama {numCamaMenu}</span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="nombreCompleto" icon={<LuUser size="20px" class="iconStyle"/>}>
        <span class="letraMenu">Jonás Aguilera Ortega</span>
      </Menu.Item>
      
      <Menu.Item key="carnet" icon={<FaRegAddressCard size="20px" class="iconStyle"/>}>
        <span class="letraMenu">1HE3-12FT-1823</span>
      </Menu.Item>
      
      <Menu.SubMenu key="pago" icon={<RiMoneyDollarCircleLine size="20px" class="iconStyle"/>} title={<span class="letraMenu">Pagar $20.00</span>}>
        <Menu.Item key="subItemPago" onClick={(event) => event.stopPropagation()}>
          <div class="input-group mb-3 divPago">
            <span class="input-group-text" id="basic-addon1">Pagar</span>
            <input type="text" class="form-control" placeholder="$20.00" aria-label="Username" aria-describedby="basic-addon1" />
          </div>
          <div class="form-check">
            <input class="form-check-input checkCondo" type="checkbox" value="" id="flexCheckDefault" />
            <label class="form-check-label checkCondoTxt" for="flexCheckDefault">
              Condonar Pago
            </label>
          </div>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu key="regServicio" icon={<MdOutlineFastfood size="20px" class="iconStyle"/>} title={<span class="letraMenu">Servicios</span>}>
        <Menu.Item key="subItemPago" onClick={(event) => event.stopPropagation()}>
          <TuComponente texto="Desayuno"></TuComponente>
          <TuComponente texto="Comida"></TuComponente>
          <TuComponente texto="Cena"></TuComponente>
          <button type="button" class="btn btn-light botonReg">Registrar</button>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.Divider />
      <Menu.Item key="eliminarUsuario" icon={<LuUserMinus size="20px" class="iconStyle"/>}>
        <span class="letraMenu">Registrar Salida</span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="eliminarCama" icon={<FaRegTrashAlt size="20px" class="iconStyle"/>} danger="true">
        <span class="letraMenu">Eliminar Cama</span>
      </Menu.Item>
    </Menu>
  )

  const menuDisponibles = (
    <Menu>
      <Menu.Item key="numeroCama">
        <span class="numCamaText">Cama {numCamaMenu}</span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="eliminarUsuario" icon={<LuUserMinus size="20px" class="iconStyle"/>}>
        <span class="letraMenu">Añadir Huésped</span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="eliminarCama" icon={<FaRegTrashAlt size="20px" class="iconStyle"/>} danger="true">
        <span class="letraMenu">Eliminar Cama</span>
      </Menu.Item>
    </Menu>
  )

  if(color == '#e6e6e6'){ menu = menuDisponibles;}
  else if(color == '#8cbcfc' || color == '#EE7171'){ menu = menuOcupadas;}

  return(
    <Dropdown overlay={menu} trigger={["contextMenu"]}>
      <div className="card cama" style={{backgroundColor: color}}>
        <img src={iconocama} class="card-img-top" alt="..."></img>
        <p class="numerazo">{numCama}</p>
      </div>
    </Dropdown>
  );

}

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

  
  
  return (
    <div className='App-minheight'>
        <div class="titulosZonas container">
          <span class="tituloZona">ZONA DE MUJERES</span>
          <div class="indicadoresDiv">
            <span class="indicadorText"><FaCircle id="circuloGris"/> Disponible</span>
            <span class="indicadorText"><FaCircle id="circuloAzul"/> Ocupado</span>
            <span class="indicadorText"><FaCircle id="circuloRojo"/> Deudor</span>
          </div>
        </div>
        
        <div class="container">
          {camasHombres.map((_, index) => (
            <Cama color="#e6e6e6" iconocama={iconocama} numCama={index+1} numCamaMenu={index+1}></Cama>
          ))}
          <div class="card addCama">
            <button id="addCamaButton"><IoAddCircleOutline /></button>
          </div>
        </div>

        <hr></hr>
        
        <div class="titulosZonas container">
          <span class="tituloZona">ZONA DE HOMBRES</span>
          <div class="indicadoresDiv">
            <span class="indicadorText"><FaCircle id="circuloGris"/> Disponible</span>
            <span class="indicadorText"><FaCircle id="circuloAzul"/> Ocupado</span>
            <span class="indicadorText"><FaCircle id="circuloRojo"/> Deudor</span>
          </div>
        </div>
        <div class="container">
          {camasMujeres.map((_, index) => (
            <Cama color="#8cbcfc" iconocama={iconocama} numCama={index+32} numCamaMenu={index+32}></Cama>
          ))}
          <div class="card addCama">
            <button id="addCamaButton"><IoAddCircleOutline /></button>
          </div>
        </div>

        <hr></hr>

        <div class="titulosZonas container">
          <span class="tituloZona">ZONA DE AISLADOS</span>
          <div class="indicadoresDiv">
            <span class="indicadorText"><FaCircle id="circuloGris"/> Disponible</span>
            <span class="indicadorText"><FaCircle id="circuloAzul"/> Ocupado</span>
            <span class="indicadorText"><FaCircle id="circuloRojo"/> Deudor</span>
          </div>
        </div>
        <div class="container">
          {camasAislados.map((_, index) => (
            <Cama color="#EE7171" iconocama={iconocama} numCama={aisladoLetras[index]}numCamaMenu={aisladoLetras[index]}></Cama>
          ))}
          <div class="card addCama">
            <button id="addCamaButton"><IoAddCircleOutline /></button>
          </div>
        </div>
      
    </div>
  )
}

export default RoomAdmin;