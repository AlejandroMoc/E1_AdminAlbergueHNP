import React from 'react';
import "./Footer.scss";

const Footer = () => {
  return (
    <div className='footer'>
      <div>
        <p className='footer_text'>
            {' '}Para el{' '}
            <a className='footer_link'
              href="https://voluntariadohnp.org/apoyos/albergue"
              target="_blank"
              rel="noopener noreferrer"
              >
              Albergue del Hospital del Niño Poblano
            </a>
            {/* {' '}Con tecnología de{' '}
            <a className='footer_link'
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
              >
              ReactJS
            </a> */}
            .
        </p>
      </div>
    </div>
  )
}

export default Footer