import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RoomAdmin.scss';
import { Dropdown, Menu } from 'antd';

import { Link } from "react-router-dom";

import iconocama from '../../assets/vectors/icon_bed.svg';
import { IoAddCircleOutline  } from "react-icons/io5";
import { FaCircle } from "react-icons/fa6";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { MdOutlineFastfood } from "react-icons/md";
import { LuUserMinus, LuUserPlus} from "react-icons/lu";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaRegAddressCard } from "react-icons/fa";
import { LuUser } from "react-icons/lu";

import { useState } from 'react';

import { useEffect } from "react";
// import { useParams } from "react-router-dom";

function Cama({kaa, klii, color, iconocama, numCama, nombre, carnet, apellidos, deber, textoD, refreshBedsData}){

  let menu;

  const [montazo, setMontazo] = useState(0);
  const [kli, setKli] = useState(0);
  const [notas, setNotas] = useState("");

  const [kli2, setKli2] = useState(0);

  const [ka, setKa] = useState(0);


  const [kli3, setKli3] = useState(0);
  const [can1, setCan1] = useState(0);
  const [can2, setCan2] = useState(0);
  const [can3, setCan3] = useState(0);

  useEffect(() => { 
    if(montazo != 0 && kli != 0 && notas != ""){
    fetch('http://localhost:8000/pagar' , {
      method: 'POST',
      body: JSON.stringify({id_cliente: kli, notas_p: notas, monto_t: montazo}),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
      })
      .catch((error) => console.error('Error UseEffect Pagar', error));
      if(montazo != 0){setMontazo(0)}
      if(kli != 0){setKli(0)}
      if(notas != ""){setNotas("")}

      refreshBedsData("pago")
    }
    //refreshBedsData()
  },[kli, notas, montazo])


  useEffect(() => { 
    if(kli2 != 0){
    fetch('http://localhost:8000/regSalida' , {
      method: 'POST',
      body: JSON.stringify({id_cliente: kli2}),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
      })
      .catch((error) => console.error('Error UseEffect Registrar Salida', error));
      if(kli2 != 0){setKli2(0)}

      refreshBedsData("salida")
    }
  },[kli2])

  useEffect(() => { 
    if(ka != 0){
    fetch('http://localhost:8000/eliminarCama' , {
      method: 'POST',
      body: JSON.stringify({id_cama: ka}),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
      })
      .catch((error) => console.error('Error UseEffect Eliminar Cama', error));
      if(ka != 0){setKa(0)}

      refreshBedsData("eliminarCama")
    }
  },[ka])

  useEffect(() => { 
    if(kli3 != 0){
      if(can1 != 0){
        fetch('http://localhost:8000/regServacio' , {
        method: 'POST',
        body: JSON.stringify({id_cliente: kli3, id_servicio: 1, cant: can1}),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
        })
        .catch((error) => console.error('Error UseEffect Registrar Servicio Desayuno', error));
        if(kli3 != 0){setKli3(0)}
        if(can1 != 0){setCan1(0)}
        
      }
    
      if(can2 != 0){
        fetch('http://localhost:8000/regServacio' , {
        method: 'POST',
        body: JSON.stringify({id_cliente: kli3, id_servicio: 2, cant: can2}),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
        })
        .catch((error) => console.error('Error UseEffect Registrar Servicio Comida', error));
        if(kli3 != 0){setKli3(0)}
        if(can2 != 0){setCan2(0)}
        
      }
  
      if(can3 != 0){
        fetch('http://localhost:8000/regServacio' , {
        method: 'POST',
        body: JSON.stringify({id_cliente: kli3, id_servicio: 3, cant: can3}),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
        })
        .catch((error) => console.error('Error UseEffect Registrar Servicio Cena', error));
        if(kli3 != 0){setKli3(0)}
        if(can3 != 0){setCan3(0)}
        
      }

      refreshBedsData("servo")
    }
    
  },[kli3, can1, can2, can3])


  const [servoCount, setservoCount] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [servoCount2, setservoCount2] = useState(0);
  const [clicked2, setClicked2] = useState(false);
  const [servoCount3, setservoCount3] = useState(0);
  const [clicked3, setClicked3] = useState(false);

  const handleChange = (event) => {
    setservoCount(parseInt(event.target.value) || 0);
    setservoCount2(parseInt(event.target.value) || 0);
    setservoCount3(parseInt(event.target.value) || 0);
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

  const sumarservo2 = () => {
    setservoCount2(servoCount2 + 1);
    setClicked2(true);
  };

  const restarservo2 = () => {
    if (servoCount2 > 0) {
      setservoCount2(servoCount2 - 1);
      setClicked2(true);
    }
  };

  const sumarservo3 = () => {
    setservoCount3(servoCount3 + 1);
    setClicked3(true);
  };

  const restarservo3 = () => {
    if (servoCount3 > 0) {
      setservoCount3(servoCount3 - 1);
      setClicked3(true);
    }
  };


  const menuOcupadas = (
    <Menu>
      <Menu.Item key="numeroCama">
        <span class="numCamaText">Cama {numCama}</span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="nombreCompleto" icon={<LuUser size="20px" class="iconStyle"/>}>
        <span class="letraMenu">{nombre + " " + apellidos}</span>
      </Menu.Item>
      
      <Menu.Item key="carnet" icon={<FaRegAddressCard size="20px" class="iconStyle"/>}>
        <span class="letraMenu">{carnet}</span>
      </Menu.Item>
      
      <Menu.SubMenu key="pago" icon={<RiMoneyDollarCircleLine size="20px" class="iconStyle"/>} title={<span class="letraMenu">{textoD+"$"+deber}</span>}>
        <Menu.Item key="subItemPago" onClick={(event) => event.stopPropagation()}>
          <div class="input-group mb-3 divPago">
            <span class="input-group-text" id="basic-addon1" onClick={() => { setKli(klii); if(document.getElementById("inputPagar").value==''){setMontazo(textoD == "A favor: " ? 0 : deber);} else{setMontazo(parseInt(document.getElementById("inputPagar").value))}; if(notas == ""){setNotas("Pago")}; document.getElementById("inputPagar").value = "";}}>Pagar</span>
            <input type="number" class="form-control" placeholder={textoD == "A favor: " ? "$0.00" : "$"+deber} aria-label="Username" aria-describedby="basic-addon1" id="inputPagar" />
          </div>
          <div class="form-check">
            <input class="form-check-input checkCondo" type="checkbox" value="" id="flexCheckDefault" onClick={() => {setNotas("Pago (Condonado)")}}/>
            <label class="form-check-label checkCondoTxt" for="flexCheckDefault">
              Condonar Pago
            </label>
          </div>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu key="regServicio" icon={<MdOutlineFastfood size="20px" class="iconStyle"/>} title={<span class="letraMenu">Servicios</span>}>
        <Menu.Item key="subItemReg" onClick={(event) => event.stopPropagation()}>
        <div className="input-group mb-3 regServo">
          <span className="input-group-text" onClick={restarservo}>-</span>
          <span className="input-group-text" onClick={sumarservo}>+</span>
          <input type="text" className="form-control" value={clicked ? servoCount : ''} onChange={handleChange} placeholder={clicked ? '' : 'Desayuno: 0'} aria-label="Amount (to the nearest dollar)" id='des'/>
        </div>
        <div className="input-group mb-3 regServo">
          <span className="input-group-text" onClick={restarservo2}>-</span>
          <span className="input-group-text" onClick={sumarservo2}>+</span>
          <input type="text" className="form-control" value={clicked2 ? servoCount2 : ''} onChange={handleChange} placeholder={clicked2 ? '' : 'Comida: 0'} aria-label="Amount (to the nearest dollar)" id='com'/>
        </div>
        <div className="input-group mb-3 regServo">
          <span className="input-group-text" onClick={restarservo3}>-</span>
          <span className="input-group-text" onClick={sumarservo3}>+</span>
          <input type="text" className="form-control" value={clicked3 ? servoCount3 : ''} onChange={handleChange} placeholder={clicked3 ? '' : 'Cena: 0'} aria-label="Amount (to the nearest dollar)" id='cen'/>
        </div>
          <button type="button" class="btn btn-light App_buttonaccept" onClick={() => {setKli3(klii); if(document.getElementById('des').value != ""){setCan1(document.getElementById('des').value)}; if(document.getElementById('com').value != ""){setCan2(document.getElementById('com').value)}; if(document.getElementById('cen').value != ""){setCan3(document.getElementById('cen').value)}; setClicked(false); setClicked2(false); setClicked3(false); setservoCount(0); setservoCount2(0); setservoCount3(0);}}>Registrar</button>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.Divider />
      <Menu.Item key="eliminarUsuario" icon={<LuUserMinus size="20px" class="iconStyle"/>} danger="true">
        <span class="letraMenu" onClick={() => { setKli2(klii);}}>Registrar Salida</span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="eliminarCama" icon={<FaRegTrashAlt size="20px" class="iconStyle"/>} danger="true" disabled="true">
        <span class="letraMenu">Eliminar Cama</span>
      </Menu.Item>
    </Menu>
  )

  const menuDisponibles = (
    <Menu>
      <Menu.Item key="numeroCama">
        <span class="numCamaText">Cama {numCama}</span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="eliminarUsuario" icon={<LuUserPlus size="20px" class="iconStyle"/>}>
        <span class="letraMenu">Añadir Huésped</span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="eliminarCama" icon={<FaRegTrashAlt size="20px" class="iconStyle"/>} danger="true">
        <span class="letraMenu" onClick={() => { setKa(kaa);}}>Eliminar Cama</span>
      </Menu.Item>
    </Menu>
  )

  if(color == '#e6e6e6'){ menu = menuDisponibles;}
  else if(color == '#8cbcfc' || color == '#EE7171'){ menu = menuOcupadas;}

  return (
    <Dropdown overlay={menu} trigger={['contextMenu']}>
      <Link to={color == '#e6e6e6' ? '/usernew' : '/infouser/'+klii} className="lmao">
        <div className="card cama" style={{ backgroundColor: color }} onClick={() => {console.log("AA , "+klii)}}>
          <img src={iconocama} className="card-img-top" alt="..." />
          <p className="numerazo">{numCama}</p>
        </div>
      </Link>
    </Dropdown>
  );

}

const RoomAdmin = () => {
  
  const [zona, setZona] = useState(0);
  const [z, setZ] = useState("");
  const [infoM, setInfoM] = useState({infoM:[]});
  const [infoH, setInfoH] = useState({infoH:[]});
  const [infoA, setInfoA] = useState({infoA:[]});

  useEffect(() => {
    if(zona != 0){
      fetch('http://localhost:8000/beds')
      .then((res) => res.json())
      .then((info) => {setInfoM(info[0]); setInfoH(info[1]); setInfoA(info[2]);})
      .catch((error) => console.error('Error UseEffect InfoCamas por Zona', error));
    }
    else if(z == "eliminarCama"){
        fetch('http://localhost:8000/beds')
        .then((res) => res.json())
        .then((info) => {setInfoM(info[0]); setInfoH(info[1]); setInfoA(info[2]);})
        .catch((error) => console.error('Error UseEffect Actualizar InfoCamas cuando Eliminar Cama', error));
        setZ("");
      }

    else if(z == "pago"){
      fetch('http://localhost:8000/beds')
      .then((res) => res.json())
      .then((info) => {setInfoM(info[0]); setInfoH(info[1]); setInfoA(info[2]);})
      .catch((error) => console.error('Error UseEffect Actualizar InfoCamas cuando Pago', error));
      setZ("");
    }

    else if(z == "servo"){
      fetch('http://localhost:8000/beds')
      .then((res) => res.json())
      .then((info) => {setInfoM(info[0]); setInfoH(info[1]); setInfoA(info[2]);})
      .catch((error) => console.error('Error UseEffect Actualizar InfoCamas cuando Registrar Servicio', error));
      setZ("");
    }

    else if(z == "salida"){
      fetch('http://localhost:8000/beds')
      .then((res) => res.json())
      .then((info) => {setInfoM(info[0]); setInfoH(info[1]); setInfoA(info[2]);})
      .catch((error) => console.error('Error UseEffect Actualizar InfoCamas cuando Registrar Salida', error));
      setZ("");
    }

    else {
      fetch('http://localhost:8000/beds')
      .then((res) => res.json())
      .then((info) => {setInfoM(info[0]); setInfoH(info[1]); setInfoA(info[2]);})
      .catch((error) => console.error('Error UseEffect Actualizar InfoCamas', error));
    }
  },[zona, z])

  const refreshBedsData = (x) => {
    setZ(x)
  };

  
  useEffect(() => {
    if(zona != 0){
    fetch('http://localhost:8000/addCama' , {
      method: 'POST',
      body: JSON.stringify({id_zona: zona}),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
  })
    .catch((error) => console.error('Error UseEffect Agregar Cama', error));
    
    if(zona != 0){setZona(0)}
    }
  },[zona])

  let contador = -1;

  const aisladoLetras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H','I',
                        'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 
                        'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  return (
    <div className='App_minheight'>
        <div class="titulosZonas container">
          <span class="tituloZona">ZONA DE MUJERES</span>
          <div class="indicadoresDiv">
            <span class="indicadorText"><FaCircle id="circuloGris"/> Disponible</span>
            <span class="indicadorText"><FaCircle id="circuloAzul"/> Ocupado</span>
            <span class="indicadorText"><FaCircle id="circuloRojo"/> Deudor</span>
          </div>
        </div>
        
        <div class="container">
          
            {infoM.length && (
              infoM.map((item) => {   
                if(item.id_cliente != null){
                  if(item.balance > 0){
                    return(
                      <Cama kaa={item.id_cama} klii={item.id_cliente} color={item.color} iconocama={iconocama} numCama={item.id_cama} nombre={item.nombre_c} apellidos={item.apellidos_c} carnet={item.carnet} deber={Math.abs(item.balance)} textoD="A favor: " refreshBedsData={refreshBedsData}></Cama>
                    );
                  } 
                  else {
                    return(
                      <Cama kaa={item.id_cama} klii={item.id_cliente} color={item.color} iconocama={iconocama} numCama={item.id_cama} nombre={item.nombre_c} apellidos={item.apellidos_c} carnet={item.carnet} deber={Math.abs(item.balance)} textoD="Debe: " refreshBedsData={refreshBedsData}></Cama>
                    );
                  }
                  
                }
                else{
                  return(
                    <Cama kaa={item.id_cama} color="#e6e6e6" iconocama={iconocama} numCama={item.id_cama} refreshBedsData={refreshBedsData}></Cama>
                  );
                }
              })
            )}

          <div class="card addCama">
            <button id="addCamaButton" onClick={() => { setZona(1); }}><IoAddCircleOutline /></button>
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
            {infoH.length && (
              infoH.map((item) => {    
                if(item.id_cliente != null){
                  if(item.balance > 0){
                    return(
                      <Cama kaa={item.id_cama} klii={item.id_cliente} color={item.color} iconocama={iconocama} numCama={item.id_cama} nombre={item.nombre_c} apellidos={item.apellidos_c} carnet={item.carnet} deber={Math.abs(item.balance)} textoD="A favor: " refreshBedsData={refreshBedsData}></Cama>
                    );
                  } 
                  else {
                    return(
                      <Cama kaa={item.id_cama} klii={item.id_cliente} color={item.color} iconocama={iconocama} numCama={item.id_cama} nombre={item.nombre_c} apellidos={item.apellidos_c} carnet={item.carnet} deber={Math.abs(item.balance)} textoD="Debe: " refreshBedsData={refreshBedsData}></Cama>
                    );
                  }
                  
                }
                else{
                  return(
                    <Cama kaa={item.id_cama} color="#e6e6e6" iconocama={iconocama} numCama={item.id_cama} refreshBedsData={refreshBedsData}></Cama>
                  );
                }
              })
            )}
          <div class="card addCama">
            <button id="addCamaButton" onClick={() => {setZona(2)}}><IoAddCircleOutline /></button>
          </div>
        </div>

        <hr/>

        <div class="titulosZonas container">
          <span class="tituloZona">ZONA DE AISLADOS</span>
          <div class="indicadoresDiv">
            <span class="indicadorText"><FaCircle id="circuloGris"/> Disponible</span>
            <span class="indicadorText"><FaCircle id="circuloAzul"/> Ocupado</span>
            <span class="indicadorText"><FaCircle id="circuloRojo"/> Deudor</span>
          </div>
        </div>
        <div class="container">
            {infoA.length && (
              infoA.map((item) => {    
                if(item.id_cliente != null){
                  contador = contador +1;
                  if(item.balance > 0){
                    return(
                      <Cama kaa={item.id_cama} klii={item.id_cliente} color={item.color} iconocama={iconocama} numCama={aisladoLetras[contador]} nombre={item.nombre_c} apellidos={item.apellidos_c} carnet={item.carnet} deber={Math.abs(item.balance)} textoD="A favor: " refreshBedsData={refreshBedsData}></Cama>
                    );
                  } 
                  else {
                    return(
                      <Cama kaa={item.id_cama} klii={item.id_cliente} color={item.color} iconocama={iconocama} numCama={aisladoLetras[contador]} nombre={item.nombre_c} apellidos={item.apellidos_c} carnet={item.carnet} deber={Math.abs(item.balance)} textoD="Debe: " refreshBedsData={refreshBedsData}></Cama>
                    );
                  }
                  
                }
                else{
                  contador = contador +1;
                  return(
                    <Cama kaa={item.id_cama} color="#e6e6e6" iconocama={iconocama} numCama={aisladoLetras[contador]} refreshBedsData={refreshBedsData}></Cama>
                  );
                }
              })
            )}
          <div class="card addCama">
            <button id="addCamaButton" onClick={() => { setZona(3)}}><IoAddCircleOutline /></button>
          </div>
        </div>
        <br/>
    </div>
  )
}

export default RoomAdmin;