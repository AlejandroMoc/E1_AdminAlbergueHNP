import React from 'react';
import "./Footer.scss";

const Footer = () => {
  return (
    <div className='footer'>
      <div>
        <p className='footer-text'>
            Con tecnología de{' '}
            <a className='footer-link'
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
            >
            ReactJS
            </a>
            .
        </p>
      </div>
    </div>
  )
}

export default Footer