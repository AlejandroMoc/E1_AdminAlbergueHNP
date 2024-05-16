                


                /* / \ '          ,|
                    `\`\      //|                             ,|
                      \ `\  //,/'                           -~ |
   )             _-~~~\  |/ / |'|                       _-~  / ,
  ((            /' )   | \ / /'/                    _-~   _/_-~|
 (((            ;  /`  ' )/ /''                 _ -~     _-~ ,/'
 ) ))           `~~\   `\\/'/|'           __--~~__--\ _-~  _/, 
((( ))            / ~~    \ /~      __--~~  --~~  __/~  _-~ /
 ((\~\           |    )   | '      /        __--~~  \-~~ _-~
    `\(\    __--(   _/    |'\     /     --~~   __--~' _-~ ~|
     (  ((~~   __-~        \~\   /     ___---~~  ~~\~~__--~ 
      ~~\~~~~~~   `\-~      \~\ /           __--~~~'~~/
                   ;\ __.-~  ~-/      ~~~~~__\__---~~ _..--._
                   ;;;;;;;;'  /      ---~~~/_.-----.-~  _.._ ~\     
                  ;;;;;;;'   /      ----~~/         `\,~    `\ \        
                  ;;;;'     (      ---~~/         `:::|       `\\.      
                  |'  _      `----~~~~'      /      `:|        ()))),      
            ______/\/~    |                 /        /         (((((())  
          /~;;.____/;;'  /          ___.---(   `;;;/             )))'`))
         / //  _;______;'------~~~~~    |;;/\    /                ((   ( 
        //  \ \                        /  |  \;;,\                 `   
       (<_    \ \                    /',/-----'  _> 
        \_|     \\_                 //~;~~~~~~~~~ 
                 \_|               (,~~   
                                    \~\*/



/*############################################################################################
#
#   Imports
#
############################################################################################*/

// React
import React from 'react';
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';

// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './RoomAdmin.scss';
import '../universal/MyToast.scss';

// Elementos Externos
import { Dropdown, Menu } from 'antd';
import MyToastContainer, { successToast, errorToast } from '../universal/MyToast';
import Popup from '../universal/Popup';

// Iconografía
import iconocama from '../../assets/vectors/icon_bed.svg';
import { IoAddCircleOutline  } from "react-icons/io5"; // Añadir Cama
import { FaCircle } from "react-icons/fa6"; // Círculos indicadores (gris, azúl y rojo)
import { RiMoneyDollarCircleLine } from "react-icons/ri"; // Balance
import { MdOutlineFastfood } from "react-icons/md"; // Servicios
import { LuUserMinus, LuUserPlus, LuUser} from "react-icons/lu"; // Nombre, Añadir Usuario, Registrar Salida
import { FaRegTrashAlt, FaRegAddressCard } from "react-icons/fa"; // Eliminar Cama, Carnet



/*###########################################################################################
#
#   FUNCIÓN Update
#   Esta fución actualiza la página. (No refresh)
#   Parámetros: setInfo(s) para las listas con info de las zonas. (Ver en Función RoomAdmin)
#
############################################################################################*/

function update(setInfoM, setInfoH, setInfoA){
  fetch('http://localhost:8000/beds')
  .then((res) => res.json())
  .then((info) => {setInfoM(info[0]); setInfoH(info[1]); setInfoA(info[2]);})
  .catch((error) => console.error('Error UseEffect Actualizar InfoCamas', error));
}



/*###########################################################################################
#
#   FUNCIÓN Cama
#   Esta fución imprime el elemento Cama.
#   Parámetros: Info del huésped y cama (View camasgralinfo), y setInfo(s) para update()
#   Return: Elemento Cama como Div, y su respectivo menú.
#
############################################################################################*/

function Cama({idCama, idCliente, color, iconocama, numCama, nombre, carnet, apellidos, balance, txtBalance, setInfoM, setInfoH, setInfoA}){
  //idCama y numCama son lo mismo, excepto cuando se trata de los Aislados, por las letras, por eso son 2 variables.

  // UseEffect para Pagar
  const [monto_UE_Pagar, setMonto_UE_Pagar] = useState(0); // UE = Use Effect
  const [cliente_UE_Pagar, setCliente_UE_Pagar] = useState(0);
  const [notas_UE_Pagar, setNotas_UE_Pagar] = useState("");

  useEffect(() => { 
    if(monto_UE_Pagar != 0 && cliente_UE_Pagar != 0 && notas_UE_Pagar != ""){
    fetch('http://localhost:8000/beds/pagar' , {
      method: 'POST',
      body: JSON.stringify({id_cliente: cliente_UE_Pagar, notas_p: notas_UE_Pagar, monto_t: monto_UE_Pagar}),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
      })
      .then((response) => {
        if (response.ok) {
          update(setInfoM, setInfoH, setInfoA);
          setMonto_UE_Pagar(0);
          setCliente_UE_Pagar(0);
          setNotas_UE_Pagar("");
          successToast()
        }
      })
      .catch((error) => {
        errorToast()
        console.error('Error fetching data:', error)
      })

      
    }
  },[cliente_UE_Pagar, notas_UE_Pagar, monto_UE_Pagar])

  // UseEffect para Registrar Servicios
  const [cliente_UE_RegServicio, setCliente_UE_RegServicio] = useState(0);
  const [cantidadS1_UE_RegServicio, setCantidadS1_UE_RegServicio] = useState(0);
  const [cantidadS2_UE_RegServicio, setCantidadS2_UE_RegServicio] = useState(0);
  const [cantidadS3_UE_RegServicio, setCantidadS3_UE_RegServicio] = useState(0);

  useEffect(() => { 
    if(cliente_UE_RegServicio != 0){
      if(cantidadS1_UE_RegServicio != 0){
        fetch('http://localhost:8000/beds/regServacio' , {
        method: 'POST',
        body: JSON.stringify({id_cliente: cliente_UE_RegServicio, id_servicio: 1, cant: cantidadS1_UE_RegServicio}),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
        })
        .then((response) => {
          if (response.ok) {
            update(setInfoM, setInfoH, setInfoA);
            successToast()
          }
        })
        .catch((error) => {
          errorToast()
          console.error('Error fetching data:', error)
        })
        setCantidadS1_UE_RegServicio(0);
        
      }
    
      if(cantidadS2_UE_RegServicio != 0){
        fetch('http://localhost:8000/beds/regServacio' , {
        method: 'POST',
        body: JSON.stringify({id_cliente: cliente_UE_RegServicio, id_servicio: 2, cant: cantidadS2_UE_RegServicio}),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
        })
        .then((response) => {
          if (response.ok) {
            update(setInfoM, setInfoH, setInfoA);
            successToast()
          }
        })
        .catch((error) => {
          errorToast()
          console.error('Error fetching data:', error)
        })
        setCantidadS2_UE_RegServicio(0);
        
      }
  
      if(cantidadS3_UE_RegServicio != 0){
        fetch('http://localhost:8000/beds/regServacio' , {
        method: 'POST',
        body: JSON.stringify({id_cliente: cliente_UE_RegServicio, id_servicio: 3, cant: cantidadS3_UE_RegServicio}),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
        })
        .then((response) => {
          if (response.ok) {
            update(setInfoM, setInfoH, setInfoA);
            successToast()
          }
        })
        .catch((error) => {
          errorToast()
          console.error('Error fetching data:', error)
        })
        setCantidadS3_UE_RegServicio(0);
        
      }

      setCliente_UE_RegServicio(0);

    }
    
  },[cliente_UE_RegServicio, cantidadS1_UE_RegServicio, cantidadS2_UE_RegServicio, cantidadS3_UE_RegServicio])

  // Variables y Funciones para conteo de servicios al dar click.
  const [countServicio1, setCountServicio1] = useState(0);
  const [servicio1Clicked, setServicio1Clicked] = useState(false);
  const [countServicio2, setCountServicio2] = useState(0);
  const [servicio2Clicked, setServicio2Clicked] = useState(false);
  const [countServicio3, setCountServicio3] = useState(0);
  const [servicio3Clicked, setServicio3Clicked] = useState(false);

  const sumaServicio1 = () => {
    setCountServicio1(countServicio1 + 1);
    setServicio1Clicked(true);
  };

  const restaServicio1 = () => {
    if (countServicio1 > 0) {
      setCountServicio1(countServicio1 - 1);
      setServicio1Clicked(true);
    }
  };

  const sumaServicio2 = () => {
    setCountServicio2(countServicio2 + 1);
    setServicio2Clicked(true);
  };

  const restaServicio2 = () => {
    if (countServicio2 > 0) {
      setCountServicio2(countServicio2 - 1);
      setServicio2Clicked(true);
    }
  };

  const sumaServicio3 = () => {
    setCountServicio3(countServicio3 + 1);
    setServicio3Clicked(true);
  };

  const restaServicio3 = () => {
    if (countServicio3 > 0) {
      setCountServicio3(countServicio3 - 1);
      setServicio3Clicked(true);
    }
  };

  // UseEffect para Registrar Salida de un Huésped
  const [cliente_UE_RegSalida, setCliente_UE_RegSalida] = useState(0);

  useEffect(() => { 
    if(cliente_UE_RegSalida != 0){
    fetch('http://localhost:8000/beds/regSalida' , {
      method: 'POST',
      body: JSON.stringify({id_cliente: cliente_UE_RegSalida}),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
      })
      .then((response) => {
        if (response.ok) {
          update(setInfoM, setInfoH, setInfoA);
          successToast()
        }
      })
      .catch((error) => {
        errorToast()
        console.error('Error fetching data:', error)
      })
      setCliente_UE_RegSalida(0)

    }
  },[cliente_UE_RegSalida])

  // Asigna el idCliente para el PopUp
  function popUpRegSalida(){
    setCliente_UE_RegSalida(idCliente);
  }

  // UseEffect para Eliminar una Cama
  const [cama_UE_EliminarCama, setCama_UE_EliminarCama] = useState(0);
  const [showPopUp, setShowPopUp] = useState({trigger: false, type: -1, id: null, fun: null})

  useEffect(() => { 
    if(cama_UE_EliminarCama != 0){
    fetch('http://localhost:8000/beds/eliminarCama' , {
      method: 'POST',
      body: JSON.stringify({id_cama: cama_UE_EliminarCama}),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
      })
      .then((response) => {
        if (response.ok) {
          update(setInfoM, setInfoH, setInfoA);
          successToast()
        }
      })
      .catch((error) => {
        errorToast()
        console.error('Error fetching data:', error)
      })
      if(cama_UE_EliminarCama != 0){setCama_UE_EliminarCama(0)}

    }
  },[cama_UE_EliminarCama, showPopUp])

  // Asigna el idCama para el PopUp
  function popUpEliminarCama(){
    setCama_UE_EliminarCama(idCama);
  }
  
  const [txtPopUp, setTxtPopUp] = useState(""); // Texto para PopUp. Cambia dependiendo la función a confirmar.

  // Menú para las Camas Ocupadas 
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
      
      <Menu.SubMenu key="pago" icon={<RiMoneyDollarCircleLine size="20px" />} title={<span class="rooms_text_infosubtitles">{txtBalance+"$"+balance}</span>}>
        <Menu.Item key="subItemPago" onClick={(event) => event.stopPropagation()}>
          <div class="input-group mb-3 rooms_width_infoinputs">
            <span class="input-group-text" id="basic-addon1" onClick={() => { setCliente_UE_Pagar(idCliente); if(document.getElementById("inputPagar").value==''){setMonto_UE_Pagar(txtBalance == "A favor: " ? 0 : balance);} else{setMonto_UE_Pagar(parseInt(document.getElementById("inputPagar").value))}; if(notas_UE_Pagar == ""){setNotas_UE_Pagar("Pago")}; document.getElementById("inputPagar").value = "";}}>Pagar</span>
            <input type="number" class="form-control" placeholder={txtBalance == "A favor: " ? "$0.00" : "$"+balance} aria-label="Username" aria-describedby="basic-addon1" id="inputPagar" />
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" onClick={() => {setNotas_UE_Pagar("Pago (Condonado)")}}/>
            <label class="form-check-label rooms_text_condpay" for="flexCheckDefault">
              Condonar Pago
            </label>
          </div>
        </Menu.Item>
      </Menu.SubMenu>
      
      <Menu.SubMenu key="regServicio" icon={<MdOutlineFastfood size="20px" />} title={<span class="rooms_text_infosubtitles">Servicios</span>}>
        <Menu.Item key="subItemReg" onClick={(event) => event.stopPropagation()}>
        <div className="input-group mb-3 rooms_width_infoinputs">
          <span className="input-group-text" onClick={sumaServicio1}>+</span>
          <span className="input-group-text" onClick={restaServicio1}>-</span>
          <input type="text" className="form-control" value={servicio1Clicked ? countServicio1 : ''}  placeholder={servicio1Clicked ? '' : 'Desayuno: 0'} aria-label="Amount (to the nearest dollar)" id='des' readonly/>
        </div>
        <div className="input-group mb-3 rooms_width_infoinputs">
          <span className="input-group-text" onClick={sumaServicio2}>+</span>
          <span className="input-group-text" onClick={restaServicio2}>-</span>
          <input type="text" className="form-control" value={servicio2Clicked ? countServicio2 : ''}  placeholder={servicio2Clicked ? '' : 'Comida: 0'} aria-label="Amount (to the nearest dollar)" id='com' readonly/>
        </div>
        <div className="input-group mb-3 rooms_width_infoinputs">
          <span className="input-group-text" onClick={sumaServicio3}>+</span>
          <span className="input-group-text" onClick={restaServicio3}>-</span>
          <input type="text" className="form-control" value={servicio3Clicked ? countServicio3 : ''}  placeholder={servicio3Clicked ? '' : 'Cena: 0'} aria-label="Amount (to the nearest dollar)" id='cen' readonly/>
        </div>
          <button type="button" class="btn btn-light App_buttonaccept" onClick={() => {setCliente_UE_RegServicio(idCliente); if(document.getElementById('des').value != ""){setCantidadS1_UE_RegServicio(document.getElementById('des').value)}; if(document.getElementById('com').value != ""){setCantidadS2_UE_RegServicio(document.getElementById('com').value)}; if(document.getElementById('cen').value != ""){setCantidadS3_UE_RegServicio(document.getElementById('cen').value)}; setServicio1Clicked(false); setServicio2Clicked(false); setServicio3Clicked(false); setCountServicio1(0); setCountServicio2(0); setCountServicio3(0);}}>Registrar</button>
        </Menu.Item>
      </Menu.SubMenu>

      <Menu.Divider />

      <Menu.Item key="eliminarUsuario" icon={<LuUserMinus size="20px" />} danger="true">
        <span class="rooms_text_infosubtitles" onClick={() => { setTxtPopUp("Registrar salida de "+nombre+" "+apellidos); setShowPopUp({trigger: true, type: 2, id: numCama, fun: popUpRegSalida});}}>Registrar Salida</span>
      </Menu.Item>

      <Menu.Divider />

      <Menu.Item key="eliminarCama" icon={<FaRegTrashAlt size="20px" />} danger="true" disabled="true">
        <span class="rooms_text_infosubtitles">Eliminar Cama</span>
      </Menu.Item>

    </Menu>
  )

  // Menú para las Camas Disponibles 
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
        <span class="rooms_text_infosubtitles" onClick={() => { setTxtPopUp("¿Eliminar la Cama "+numCama+"?"); setShowPopUp({trigger: true, type: 0, id: numCama, fun: popUpEliminarCama}); }}>Eliminar Cama</span>
      </Menu.Item>
      
    </Menu>
  )

  return (
    <>
      <Dropdown overlay={color == '#e6e6e6' ? menuDisponibles : menuOcupadas } trigger={['contextMenu']}>
        <Link to={color == '#e6e6e6' ? '/usernew' : '/infouser/'+idCliente} className="rooms_text_bedsnot">
          <div className="card rooms_spacing_beds" style={{ backgroundColor: color }}>
            <img src={iconocama} className="card-img-top" alt="..." />
            <p className="rooms_text_beds">{numCama}</p>
          </div>
        </Link>
      </Dropdown>
      <Popup trigger={showPopUp.trigger} type={showPopUp.type} id={showPopUp.id} fun={showPopUp.fun} setTrigger={setShowPopUp}>
        {txtPopUp}
      </Popup>
    </>
  );

}



/*###########################################################################################
#
#   FUNCIÓN IndicadorZona
#   Esta fución genera el Título de las Zonas y los circulos indicadores (gris, azul y rojo)
#   Parámetros: El título de la zona.
#   Return: Div con el título y los círculos indicadores.
#
############################################################################################*/

function IndicadorZona({tituloZona}){
  return(
    <div class="rooms_text_subtitles container rooms_container">
      <span class="rooms_text_titles">{tituloZona}</span>
      <div class="rooms_spacing_disponibility">
        <span class="rooms_text_disponibility"><FaCircle className="rooms_circle_gray"/> Disponible</span>
        <span class="rooms_text_disponibility"><FaCircle className="rooms_circle_blue"/> Ocupado</span>
        <span class="rooms_text_disponibility"><FaCircle className="rooms_circle_red"/> Deudor</span>
      </div>
    </div>
  );
}



/*###########################################################################################
#
#   FUNCIÓN RoomAdmin
#   Esta fución es la principal de la Página de Camas.
#   Return: Página /beds
#
############################################################################################*/

const RoomAdmin = () => {
  
  /* 
  
  infoM, infoH e infoA.
  Variables para guardar info de cada zona. Lista de listas.
  
    Estructura: 

    [{
      nombre_c: null
      apellidos_c: null
      balance: null
      carnet: null
      color: null
      id_cama: null
      id_cliente: null
      id_zona: null
    },
    {
      ...
    },
    {
      ...
    }]

  */

  const [infoM, setInfoM] = useState({infoM:[]});
  const [infoH, setInfoH] = useState({infoH:[]});
  const [infoA, setInfoA] = useState({infoA:[]});

  // Primer UseEffect para cargar las camas al entrar a /beds.
  useEffect(() => {
    update(setInfoM, setInfoH, setInfoA)
  },[])

  //UseEffect para Añadir una nueva Cama
  const [zona, setZona] = useState(0);
  useEffect(() => {
    if(zona != 0){
      fetch('http://localhost:8000/beds/addCama' , {
        method: 'POST',
        body: JSON.stringify({id_zona: zona}),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      })
      .then((response) => {
        if (response.ok) {
          update(setInfoM, setInfoH, setInfoA);
          successToast()
        }
      })
      .catch((error) => {
        errorToast()
        console.error('Error fetching data:', error)
      })

      setZona(0)
    }
  },[zona])

  

  /*###########################################################################################
  #
  #   FUNCIÓN MapeoCamas (dentro de RoomAdmin)
  #   Esta fución mapea las Camas de la zona específicada, incluyendo el botón de Añadir Cama
  #   Parámetros: Lista con la info de la Zona a mapear.
  #   Return: Impresión de las camas de esa Zona.
  #
  ############################################################################################*/

  function MapeoCamas({infoZona}) {

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
  
    return(
      <div class="container rooms_container">
        {infoZona.length && (
          infoZona.map((item) => {   
            if(item.id_cliente != null){
              contador = contador +1;
              return(
                <Cama idCama={item.id_cama} idCliente={item.id_cliente} color={item.color} iconocama={iconocama} numCama={infoZona == infoA ? aisladoLetras[contador] : item.id_cama} nombre={item.nombre_c} apellidos={item.apellidos_c} carnet={item.carnet} balance={Math.abs(item.balance)} txtBalance={item.balance > 0 ? "A favor: " : "Debe: "} setInfoM={setInfoM} setInfoH={setInfoH} setInfoA={setInfoA} />
              );
            }
            else{
              contador = contador +1;
              return(
                <Cama idCama={item.id_cama} color="#e6e6e6" iconocama={iconocama} numCama={infoZona == infoA ? aisladoLetras[contador] : item.id_cama} setInfoM={setInfoM} setInfoH={setInfoH} setInfoA={setInfoA} />
              );
            }
          })
        )}
        <div class="card rooms_spacing_addbed">
          <button id="rooms_logo_addbed" onClick={() => { infoZona == infoM ? setZona(1) : infoZona == infoH ? setZona(2) : setZona(3);}}><IoAddCircleOutline /></button>
        </div>
      </div>
    );
  }
  
  return (
    <div className='App_minheight'>
      <IndicadorZona tituloZona="ZONA DE MUJERES" />
      <MapeoCamas infoZona={infoM} />  
      <hr />
      <IndicadorZona tituloZona="ZONA DE HOMBRES" />
      <MapeoCamas infoZona={infoH} /> 
      <hr />
      <IndicadorZona tituloZona="ZONA DE AISLADOS" />
      <MapeoCamas infoZona={infoA} /> 
      <br/>
      <MyToastContainer />
    </div>
  )
}

export default RoomAdmin;

//THE END