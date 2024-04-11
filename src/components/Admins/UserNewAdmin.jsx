import React, { useRef, useState } from 'react';
import './UserNewAdmin.scss';
import { FaUser } from "react-icons/fa";
import { BiSolidSchool } from "react-icons/bi";
import { FaShower } from "react-icons/fa6";
import { MdOutlineFastfood } from "react-icons/md";
import { PiCoins } from "react-icons/pi";

const UserNewAdmin = () => {
  const textareaRef = useRef(null);
  const [showNumbersSelect, setShowNumbersSelect] = useState(true);
  const [imageCounts, setImageCounts] = useState([0, 0, 0, 0, 0, 0, 0]);

  const handleRadioChange = (event) => {
    if (event.target.value === "opcion3") {
      setShowNumbersSelect(true);
    } else {
      setShowNumbersSelect(false);
    }
  };

  const handleIncrement = (index) => {
    const newCounts = [...imageCounts];
    newCounts[index]++;
    setImageCounts(newCounts);
    updatePiCoinsCounter(newCounts);
  };
  
  const handleDecrement = (index) => {
    const newCounts = [...imageCounts];
    if (newCounts[index] > 0) {
      newCounts[index]--;
      setImageCounts(newCounts);
      updatePiCoinsCounter(newCounts);
    }
  };
  
  const updatePiCoinsCounter = (counts) => {
    const totalPiCoins = counts.slice(0, 6).reduce((acc, count) => acc + count, 0) * 20;
    const newCounts = [...counts];
    newCounts[6] = totalPiCoins;
    setImageCounts(newCounts);
  };
  
  const handleIncrementPiCoins = (step) => {
    const newCounts = [...imageCounts];
    newCounts[6] += step;
    setImageCounts(newCounts);
  };
  
  const handleDecrementPiCoins = (step) => {
    const newCounts = [...imageCounts];
    if (newCounts[6] >= step) {
      newCounts[6] -= step;
      setImageCounts(newCounts);
    }
  };
  

  const handleTextareaChange = () => {
    textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
  };

  return (
    <div className='App-minheight App-minpadding'>
      {/* <meta charset="UTF-8"></meta> */}
      {/* <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta> */}

      {/* TODO aqui intentar reacomodar todo en una tabla */}


      {/* <table className='usernew-table'>
        <tr>
          <td>Visitante previo</td>
          <td>
            

            <div>
              <textarea
                ref={textareaRef}
                id="nota"
                name="nota"
                placeholder="Notas"
                onChange={handleTextareaChange}
                className="auto-scroll-textarea"
              ></textarea>
            </div>

          </td>
        </tr>

        <tr>
          <td>Visitante previo</td>
          <td>
            

            <div>
              <textarea
                ref={textareaRef}
                id="nota"
                name="nota"
                placeholder="Notas"
                onChange={handleTextareaChange}
                className="auto-scroll-textarea"
              ></textarea>
            </div>

          </td>
        </tr>

      </table>
 */}





      <div className='columnIcon'>
        <div className='row'>
          <FaUser size={50} />
        </div>
        <div>
          <BiSolidSchool size={50} />
        </div>
      </div>

      <div className='column1'>
        <div className='rowSwitch'>
          <label className="switch">
            <input type="checkbox"></input>
            <span className="slider"></span>
          </label>
          <p className='switch-label'>Visitante Previo</p>
        </div>
        <div className='row'>
          <input type="text" id="nombre" name="nombre" placeholder="Nombre"></input>
        </div>
        <div className='row'>
          <input type="radio" id="opcion1" name="opcion" value="opcion1"></input>
          <label htmlFor="opcion1" className="label-grande"><i>Hombre</i></label>
          <input type="radio" id="opcion2" name="opcion" value="opcion2"></input>
          <label htmlFor="opcion2" className="label-grande"><i>Mujer</i></label>
        </div>
        <div className='row'>
          <input type="text" id="fecha" name="fecha" placeholder="dd/mm/aaaa"></input>
        </div>
        <div className='row'>
          <input type="text" id="nivel" name="nivel" placeholder="Nivel"></input>
        </div>
        <div className='row'>
          <input type="text" id="origen" name="origen" placeholder="Origen"></input>
        </div>
        <div className='row'>
          <input type="text" id="nombre_p" name="nombre_p" placeholder="Nombre del paciente"></input>
        </div>
        <div className='row'>
          <input type="text" id="carnet" name="carnet" placeholder="#Carnet"></input>
        </div>
        <div className='row'>
          <input type="text" id="fecha" name="fecha" placeholder="Área de Paciente"></input>
        </div>
        <div className='rowSwitch'>
          <label className="switch">
            <input type="checkbox"></input>
            <span className="slider"></span>
          </label>
          <p className='switch-label'>Paciente</p>
        </div>
      </div>
      {showNumbersSelect && (
        <div className="columnIcon3"></div>
         )}
      {!showNumbersSelect && (
<div className="columnIcon2">  
  <div className='rowshower'>
    < FaShower size={50} />
      </div>
    <div>
      <MdOutlineFastfood size={50} />
    </div>
    <div className="rowcoin">
      <PiCoins size={50} />
    </div>
  </div> )}
  
      <div className='column4'>
        <div className='row'>
          <textarea
            ref={textareaRef}
            id="nota"
            name="nota"
            placeholder="Notas"
            onChange={handleTextareaChange}
            className="auto-scroll-textarea"
          ></textarea>
        </div>
        <div>
          <input type="radio" id="opcion3" name="opcion1" value="opcion3" onChange={handleRadioChange}></input>
          <label htmlFor="opcion3" className="label-grande"><i>Huésped</i></label>
          <input type="radio" id="opcion4" name="opcion1" value="opcion4" onChange={handleRadioChange}></input>
          <label htmlFor="opcion4" className="label-grande"><i>Entrada Única</i></label>
          {showNumbersSelect && (
            <div className="numero-seleccion">
              <label htmlFor="numeros">Número de cama:</label>
              <select id="numeros" name="numeros">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>
          )}
          {!showNumbersSelect && (
            <div align = 'left'>
              <div className="servicio">
                <div className="contador">
                  <label htmlFor="numeros">Regadera({imageCounts[0]})</label>
                  <button onClick={() => handleDecrement(0)}>-</button>
                  <span>{imageCounts[0]}</span>
                  <button onClick={() => handleIncrement(0)}>+</button>
                </div>
                <div className="contador">
                  <label htmlFor="numeros">Sanitario({imageCounts[1]})</label>
                  <button onClick={() => handleDecrement(1)}>-</button>
                  <span>{imageCounts[1]}</span>
                  <button onClick={() => handleIncrement(1)}>+</button>
                </div>
              </div>

              <div></div>
              <div className="servicio1">
                <div className="contador">
                  <label htmlFor="numeros">Desayuno ({imageCounts[3]})</label>
                  <button onClick={() => handleDecrement(3)}>-</button>
                  <span>{imageCounts[3]}</span>
                  <button onClick={() => handleIncrement(3)}>+</button>
                </div>
                <div className="contador">
                  <label htmlFor="numeros">Comida({imageCounts[4]})</label>
                  <button onClick={() => handleDecrement(4)}>-</button>
                  <span>{imageCounts[4]}</span>
                  <button onClick={() => handleIncrement(4)}>+</button>
                </div>
                <div className="contador">
                  <label htmlFor="numeros">Cena({imageCounts[5]})</label>
                  <button onClick={() => handleDecrement(5)}>-</button>
                  <span>{imageCounts[5]}</span>
                  <button onClick={() => handleIncrement(5)}>+</button>
                </div>
              </div>
              <div>
              <div className="contador">
                <label htmlFor="numeros">Total a pagar ($)</label>
                <button onClick={() => handleDecrementPiCoins(10)}>-</button>
                <input
                  type="number"
                  value={imageCounts[6]}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value);
                    if (!isNaN(newValue)) {
                      const newCounts = [...imageCounts];
                      newCounts[6] = newValue;
                      setImageCounts(newCounts);
                    }
                  }}
                  className="input-amount" // Agregamos una clase CSS para aplicar estilos específicos
                />
                <button onClick={() => handleIncrementPiCoins(10)}>+</button>
              </div>
              </div>
            </div>
          )}
          <div className="registrar-button">
            <button className="btn-registrar">Registrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserNewAdmin;