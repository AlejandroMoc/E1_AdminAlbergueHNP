//Importar CSS y elementos correspondientes
import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

//Dibujar elementos
function App() {
  return (
    <div className="App-global">
      <Header/>
      {/*TODO meter resto de la página*/}
      {/*<Body/>*/}
      <Footer/>
    </div>
  );
}

export default App;