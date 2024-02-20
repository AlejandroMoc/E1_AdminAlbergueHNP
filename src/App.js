//Importar assets
import logohnp from './assets/logos/logo_hnp.svg';

//Importar CSS
import './App.css';

//Dibujar elementos
function App() {
  return (
    <div className="App-global">

      {/*Barra de navegación*/}

      <nav className="App-navbar">
        <ul>
          <a href="#">Inicio</a>
          <a href="#">Salas</a>
          <a href="#">Usuarios</a>
        </ul>
      </nav>


      <title className="App-title">
        <h1>Administrador del albergue - HNP</h1>
      </title>

      <header className="App-header">
        {/* <code>src/App.js</code> */}

        <a className = "App-link" href="#">Administrar salas</a>
        <a className = "App-link" href="#">Administrar usuarios</a>

        <img src={logohnp} className ="App-logo" alt="logo" />

        {/*Footer*/}
        <p className = "App-footer">Con tecnología de{' '}
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            ReactJS
          </a>
        </p>

      </header>    

    </div>
  );
}

export default App;
