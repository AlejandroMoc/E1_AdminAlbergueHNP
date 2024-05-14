import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RoomAdmin.scss';
import '../universal/MyToast.scss';
import { Dropdown, Menu } from 'antd';

import { Link } from "react-router-dom";

import MyToastContainer, { successToast, errorToast } from '../universal/MyToast';
import Popup from '../universal/Popup';

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

  const [text, SetText] = useState("");

  const [showPopUp, setShowPopUp] = useState({trigger: false, type: -1, id: null, fun: null})

  function kaliL(){
    setKa(kaa);
    console.log(ka)
  }

  function kaliL2(){
    setKli2(klii);
    console.log(kli2)
  }

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
      .then((response) => {
        if (response.ok) {
          successToast()
        }
      })
      .catch((error) => {
        errorToast()
        console.error('Error fetching data:', error)
      })
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
      .then((response) => {
        if (response.ok) {
          successToast()
        }
      })
      .catch((error) => {
        errorToast()
        console.error('Error fetching data:', error)
      })
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
      .then((response) => {
        if (response.ok) {
          successToast()
        }
      })
      .catch((error) => {
        errorToast()
        console.error('Error fetching data:', error)
      })
      if(ka != 0){setKa(0)}

      refreshBedsData("eliminarCama")
    }
  },[ka, showPopUp])

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
        .then((response) => {
          if (response.ok) {
            successToast()
          }
        })
        .catch((error) => {
          errorToast()
          console.error('Error fetching data:', error)
        })
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
        .then((response) => {
          if (response.ok) {
            successToast()
          }
        })
        .catch((error) => {
          errorToast()
          console.error('Error fetching data:', error)
        })
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
        .then((response) => {
          if (response.ok) {
            successToast()
          }
        })
        .catch((error) => {
          errorToast()
          console.error('Error fetching data:', error)
        })
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
        <span class="rooms_text_infotitle">Cama {numCama}</span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="nombreCompleto" icon={<LuUser size="20px" />}>
        <span class="rooms_text_infosubtitles">{nombre + " " + apellidos}</span>
      </Menu.Item>
      
      <Menu.Item key="carnet" icon={<FaRegAddressCard size="20px" />}>
        <span class="rooms_text_infosubtitles">{carnet}</span>
      </Menu.Item>
      
      <Menu.SubMenu key="pago" icon={<RiMoneyDollarCircleLine size="20px" />} title={<span class="rooms_text_infosubtitles">{textoD+"$"+deber}</span>}>
        <Menu.Item key="subItemPago" onClick={(event) => event.stopPropagation()}>
          <div class="input-group mb-3 rooms_width_infoinputs">
            <span class="input-group-text" id="basic-addon1" onClick={() => { setKli(klii); if(document.getElementById("inputPagar").value==''){setMontazo(textoD == "A favor: " ? 0 : deber);} else{setMontazo(parseInt(document.getElementById("inputPagar").value))}; if(notas == ""){setNotas("Pago")}; document.getElementById("inputPagar").value = "";}}>Pagar</span>
            <input type="number" class="form-control" placeholder={textoD == "A favor: " ? "$0.00" : "$"+deber} aria-label="Username" aria-describedby="basic-addon1" id="inputPagar" />
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" onClick={() => {setNotas("Pago (Condonado)")}}/>
            <label class="form-check-label rooms_text_condpay" for="flexCheckDefault">
              Condonar Pago
            </label>
          </div>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu key="regServicio" icon={<MdOutlineFastfood size="20px" />} title={<span class="rooms_text_infosubtitles">Servicios</span>}>
        <Menu.Item key="subItemReg" onClick={(event) => event.stopPropagation()}>
        <div className="input-group mb-3 rooms_width_infoinputs">
          <span className="input-group-text" onClick={restarservo}>-</span>
          <span className="input-group-text" onClick={sumarservo}>+</span>
          <input type="text" className="form-control" value={clicked ? servoCount : ''} onChange={handleChange} placeholder={clicked ? '' : 'Desayuno: 0'} aria-label="Amount (to the nearest dollar)" id='des'/>
        </div>
        <div className="input-group mb-3 rooms_width_infoinputs">
          <span className="input-group-text" onClick={restarservo2}>-</span>
          <span className="input-group-text" onClick={sumarservo2}>+</span>
          <input type="text" className="form-control" value={clicked2 ? servoCount2 : ''} onChange={handleChange} placeholder={clicked2 ? '' : 'Comida: 0'} aria-label="Amount (to the nearest dollar)" id='com'/>
        </div>
        <div className="input-group mb-3 rooms_width_infoinputs">
          <span className="input-group-text" onClick={restarservo3}>-</span>
          <span className="input-group-text" onClick={sumarservo3}>+</span>
          <input type="text" className="form-control" value={clicked3 ? servoCount3 : ''} onChange={handleChange} placeholder={clicked3 ? '' : 'Cena: 0'} aria-label="Amount (to the nearest dollar)" id='cen'/>
        </div>
          <button type="button" class="btn btn-light App_buttonaccept" onClick={() => {setKli3(klii); if(document.getElementById('des').value != ""){setCan1(document.getElementById('des').value)}; if(document.getElementById('com').value != ""){setCan2(document.getElementById('com').value)}; if(document.getElementById('cen').value != ""){setCan3(document.getElementById('cen').value)}; setClicked(false); setClicked2(false); setClicked3(false); setservoCount(0); setservoCount2(0); setservoCount3(0);}}>Registrar</button>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.Divider />
      <Menu.Item key="eliminarUsuario" icon={<LuUserMinus size="20px" />} danger="true">
        <span class="rooms_text_infosubtitles" onClick={() => { SetText("Registrar salida de "+nombre+" "+apellidos); setShowPopUp({trigger: true, type: 2, id: numCama, fun: kaliL2});}}>Registrar Salida</span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="eliminarCama" icon={<FaRegTrashAlt size="20px" />} danger="true" disabled="true">
        <span class="rooms_text_infosubtitles">Eliminar Cama</span>
      </Menu.Item>
    </Menu>
  )

  const menuDisponibles = (
    <Menu>
      <Menu.Item key="numeroCama">
        <span class="rooms_text_infotitle">Cama {numCama}</span>
      </Menu.Item>
      <Menu.Divider />
      <Link to="/usernew" className="rooms_text_bedsnot">
        <Menu.Item key="eliminarUsuario" icon={<LuUserPlus size="20px" />}>
          <span class="rooms_text_infosubtitles">Añadir Huésped</span>
        </Menu.Item>
      </Link>
      <Menu.Divider />
      <Menu.Item key="eliminarCama" icon={<FaRegTrashAlt size="20px" />} danger="true">
        <span class="rooms_text_infosubtitles" onClick={() => { SetText("¿Eliminar la Cama "+numCama+"?"); setShowPopUp({trigger: true, type: 0, id: numCama, fun: kaliL}); }}>Eliminar Cama</span>
      </Menu.Item>
    </Menu>
  )

  if(color == '#e6e6e6'){ menu = menuDisponibles;}
  else if(color == '#8cbcfc' || color == '#EE7171'){ menu = menuOcupadas;}

  return (
    <>
      <Dropdown overlay={menu} trigger={['contextMenu']}>
        <Link to={color == '#e6e6e6' ? '/usernew' : '/infouser/'+klii} className="rooms_text_bedsnot">
          <div className="card rooms_spacing_beds" style={{ backgroundColor: color }} onClick={() => {console.log("AA , "+klii)}}>
            <img src={iconocama} className="card-img-top" alt="..." />
            <p className="rooms_text_beds">{numCama}</p>
          </div>
        </Link>
      </Dropdown>
      <Popup trigger={showPopUp.trigger} type={showPopUp.type} id={showPopUp.id} fun={showPopUp.fun} setTrigger={setShowPopUp}>
        {text}
      </Popup>
    </>
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
    fetch('http://localhost:8000/rooms_spacing_addbed' , {
      method: 'POST',
      body: JSON.stringify({id_zona: zona}),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
  })
    .then((response) => {
      if (response.ok) {
        successToast()
      }
    })
    .catch((error) => {
      errorToast()
      console.error('Error fetching data:', error)
    })
    
    if(zona != 0){setZona(0)}
    }
  },[zona])

  let contador = -1;

  const aisladoLetras = [];

  for (let i = 1; i <= 26; i++) {
    for (let j = 1; j <= 2; j++) {
      const letra = String.fromCharCode(64 + i);
      const combinacion = letra + j;
      aisladoLetras.push(combinacion);
    }
  }
  
  //console.log(aisladoLetras);

  return (
    <div className='App_minheight'>
        <div class="rooms_text_subtitles container">
          <span class="rooms_text_titles">ZONA DE MUJERES</span>
          <div class="rooms_spacing_disponibility">
            <span class="rooms_text_disponibility"><FaCircle className="rooms_circle_gray"/> Disponible</span>
            <span class="rooms_text_disponibility"><FaCircle className="rooms_circle_blue"/> Ocupado</span>
            <span class="rooms_text_disponibility"><FaCircle className="rooms_circle_red"/> Deudor</span>
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

          <div class="card rooms_spacing_addbed">
            <button id="rooms_logo_addbed" onClick={() => { setZona(1); }}><IoAddCircleOutline /></button>
          </div>
        </div>

        <hr />
        
        <div class="rooms_text_subtitles container">
          <span class="rooms_text_titles">ZONA DE HOMBRES</span>
          <div class="rooms_spacing_disponibility">
            <span class="rooms_text_disponibility"><FaCircle className="rooms_circle_gray"/> Disponible</span>
            <span class="rooms_text_disponibility"><FaCircle className="rooms_circle_blue"/> Ocupado</span>
            <span class="rooms_text_disponibility"><FaCircle className="rooms_circle_red"/> Deudor</span>
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
          <div class="card rooms_spacing_addbed">
            <button id="rooms_logo_addbed" onClick={() => {setZona(2)}}><IoAddCircleOutline /></button>
          </div>
        </div>

        <hr />

        <div class="rooms_text_subtitles container">
          <span class="rooms_text_titles">ZONA DE AISLADOS</span>
          <div class="rooms_spacing_disponibility">
            <span class="rooms_text_disponibility"><FaCircle className="rooms_circle_gray"/> Disponible</span>
            <span class="rooms_text_disponibility"><FaCircle className="rooms_circle_blue"/> Ocupado</span>
            <span class="rooms_text_disponibility"><FaCircle className="rooms_circle_red"/> Deudor</span>
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
          <div class="card rooms_spacing_addbed">
            <button id="rooms_logo_addbed" onClick={() => { setZona(3)}}><IoAddCircleOutline /></button>
          </div>
        </div>
        <br/>
        
        <MyToastContainer />
    </div>
  )
}

export default RoomAdmin;
