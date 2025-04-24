import React from 'react';
import { Link } from 'react-router-dom';
import '../css/footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>О проекте</h3>
          <p>Информационный ресурс о кинофильмах и сериалах. Все данные предоставлены The Movie Database API.</p>
        </div>

        <div className="footer-section">
          <h3>Навигация</h3>
          <ul>
            <li><Link to="/">Главная</Link></li>
            <li><Link to="/movies">Фильмы</Link></li>
            <li><Link to="/tv-shows">Сериалы</Link></li>
            <li><Link to="/search">Поиск</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Связаться с нами</h3>
          <ul>
            <li><a href="mailto:info@movieapp.com">info@movieapp.com</a></li>
            <li><a href="tel:+71234567890">+7 (123) 456-78-90</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Социальные сети</h3>
          <div className="social-links">
            <a href="https://facebook.com" className="social-link">Facebook</a>
            <a href="https://twitter.com" className="social-link">Twitter</a>
            <a href="https://instagram.com" className="social-link">Instagram</a>
            <a href="https://telegram.org" className="social-link">Telegram</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Movie App. Все права защищены.</p>
      </div>
    </footer>
  );
}

export default Footer;