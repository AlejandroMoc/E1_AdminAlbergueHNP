import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RoomAdmin.scss';

import iconocama from '../../assets/logos/iconocama.svg';
import { IoAddCircleOutline } from "react-icons/io5";
import { FaCircle } from "react-icons/fa6";

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
          <span class="indicadorText"><FaCircle id="circuloAzul"/> Dispoible</span>
          <span class="indicadorText"><FaCircle id="circuloGris"/> Ocupado</span>
          <span class="indicadorText"><FaCircle id="circuloRojo"/> Deudor</span>
        </div>
      </div>
      
      <div class="container">
        {camasHombres.map((_, index) => (
          <div key={index} class="card cama">
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
          <span class="indicadorText"><FaCircle id="circuloAzul"/> Dispoible</span>
          <span class="indicadorText"><FaCircle id="circuloGris"/> Ocupado</span>
          <span class="indicadorText"><FaCircle id="circuloRojo"/> Deudor</span>
        </div>
      </div>
      <div class="container">
        {camasMujeres.map((_, index) => (
          <div key={index} class="card cama">
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
          <span class="indicadorText"><FaCircle id="circuloAzul"/> Dispoible</span>
          <span class="indicadorText"><FaCircle id="circuloGris"/> Ocupado</span>
          <span class="indicadorText"><FaCircle id="circuloRojo"/> Deudor</span>
        </div>
      </div>
      <div class="container">
        {camasAislados.map((_, index) => (
          <div key={index} class="card cama">
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