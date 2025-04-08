import { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/navbar.css';
import { NavLink, Link } from 'react-router-dom';

function Navbar({ onSearch }) {
    const [isFixed, setIsFixed] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    function handleScroll() {
        setIsFixed(window.scrollY > 50);
    }

    useEffect(() => {
        const timerId = setTimeout(() => {
            if (inputValue) {
                if (window.location.pathname === '/actors') {
                    fetchActorSuggestions(inputValue);
                } else {
                    fetchMovieSuggestions(inputValue);
                }
            } else {
                setSuggestions([]);
                onSearch('');
            }
        }, 300);

        return () => clearTimeout(timerId);
    });

    const fetchMovieSuggestions = async (query) => {
        try {
            const response = await axios({
                method: "get",
                url: "https://api.themoviedb.org/3/search/movie",
                params: {
                    api_key: '3cc05ada7e70628b8d1bf36e4d1f6fd7',
                    query: query,
                    language: 'en-US',
                },
            });
            setSuggestions(response.data.results.map(movie => movie.original_title));
        } catch (error) {
            console.error('Ошибка при поиске фильмов:', error);
            setSuggestions([]);
        }
    };

    const fetchActorSuggestions = async (query) => {
        try {
            const response = await axios({
                method: "get",
                url: "https://api.themoviedb.org/3/search/person",
                params: {
                    api_key: '3cc05ada7e70628b8d1bf36e4d1f6fd7',
                    query: query,
                    language: 'ru-RU, en-US',
                },
            });
            setSuggestions(response.data.results.map(person => person.name));
        } catch (error) {
            console.error('Ошибка при поиске актеров:', error);
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setInputValue(suggestion);
        setSuggestions([]);
        onSearch(suggestion);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${isFixed ? "fixed" : ""}`}>
            <div className='part1'>
                <Link className='link' to="/">KINOGO</Link>
                <NavLink className='link' to='/'>Главное</NavLink>
                <NavLink className='link' to='/popular'>Популярное</NavLink>
                <NavLink className='link' to='/topFilm'>Лучшие</NavLink>
                <NavLink className='link' to='/actors'>Актеры</NavLink>
            </div>
            <div className='part2'>
                <div className="search-container">
                    <input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className='searchIn'
                        type="text"
                        placeholder={
                            window.location.pathname === '/actors' 
                            ? 'Поиск актеров (на английском)' 
                            : 'Поиск фильмов (на английском)'
                        }
                    />
                    {suggestions.length > 0 && (
                        <ul className="suggestions-list">
                            {suggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;