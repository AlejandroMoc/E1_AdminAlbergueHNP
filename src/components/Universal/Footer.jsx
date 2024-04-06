import React from 'react';
import "./Footer.scss";

const Footer = () => {
  return (
    <div class='footer'>
      <div>
        <p class='footer-text'>
            Con tecnología de{' '}
            <a class='footer-link'
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
            >
            ReactJS
            </a>
        </p>
      </div>
    </div>
  )
}

export default Footer