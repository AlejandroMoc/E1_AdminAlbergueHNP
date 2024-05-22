import React from 'react';
import {Bounce, ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './MyToast.scss';

export const successToast = () => {
  toast.success('Proceso Exitoso', {
    position: "bottom-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce
  });
};
  
export const errorCarnet = () => {
  toast.error('El carnet que intenta ingresar ya esta utilizado', {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce
  });
};

export const errorConstantes = () => {
  toast.error('Favor de llenar los campos faltantes', {
    position: "bottom-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce
  });
};
  
export const errorToast = () => {
  toast.error('Proceso Fallido', {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce
  });
};
  
export default function MyToastContainer() {
  return <ToastContainer className="toastify_color"/>;
}