//Importar CSS y elementos correspondientes
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import {AppRouter} from './components/universal/AppRouter';

//Constante de URL
export const API_URL = 'http://10.50.91.88:8008';
// export const API_URL = 'http://localhost:8008';

//Dibujar elementos
function App() {
	return <AppRouter/>;
}

export default App;