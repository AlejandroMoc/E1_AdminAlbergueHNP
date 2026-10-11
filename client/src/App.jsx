// Components
import { AppRouter } from "./components/universal/AppRouter";

// CSS
import "./App.scss";
import "bootstrap/dist/css/bootstrap.min.css";

//Constante de URL
// export const API_URL = "http://192.168.1.68:8008";
export const API_URL = 'http://localhost:8008';

//Dibujar elementos
function App() {
	return <AppRouter />;
}

export default App;
