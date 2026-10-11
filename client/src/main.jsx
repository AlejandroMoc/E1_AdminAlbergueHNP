import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import '../color_palette.scss';

import App from './App';
import AuthProvider from './auth/AuthProvider';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter } from 'react-router-dom';
import {ThemeProvider} from './theme/ThemeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Se manda a llamar a usuario por default */}
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
