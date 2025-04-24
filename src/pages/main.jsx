import { useEffect, useState, useMemo } from "react";
import Card from "../components/card";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import axios from "axios";
import '../css/main.css';
import { Link } from "react-router-dom";
import img1 from '../img/plakat.jpg';

function Main() {
    const [films, setFilms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchFilms() {
            try {
                setIsLoading(true);
                const response = await axios({
                    method: 'get',
                    url: 'https://api.themoviedb.org/3/movie/now_playing',
                    params: {
                        language: 'ru-RU',
                        page: 1,
                        api_key: '3cc05ada7e70628b8d1bf36e4d1f6fd7'
                    }
                });
                setFilms(response.data.results);
                setError(null);
            } catch (error) {
                console.error('Ошибка при запросе:', error);
                setError('Не удалось загрузить фильмы. Пожалуйста, попробуйте позже.');
            } finally {
                setIsLoading(false);
            }
        }

        fetchFilms();
    }, []);

    const filteredFilms = useMemo(() => {
        if (!searchQuery) return films;
        return films.filter((film) =>
            film.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            film.original_title?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [films, searchQuery]);

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
                <p>Загрузка...</p>
            </div>
        );
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="body">
            <Navbar onSearch={setSearchQuery} />
            
            <div className="poster">
                <img
                    className="img1"
                    src={img1}
                    alt="Баннер фильмов"
                />
                <div className="overlay">
                    <div className="overlay-content">
                        <p className="p1">Добро пожаловать.</p>
                        <p className="p2">Миллионы фильмов, сериалов и людей. Исследуйте сейчас.</p>
                    </div>
                </div>
            </div>

            <div className="main">
                {filteredFilms.length > 0 ? (
                    filteredFilms.map((film) => (
                        <Link
                            key={film.id}
                            to={`/details-film/${film.id}`}
                            state={{ from: '/' }}
                            className="cardLink"
                        >
                            <Card
                                title={film.title || "Нет названия"}
                                description={film.overview || "Нет описания"}
                                release_date={film.release_date || "Нет даты"}
                                imageUrl={film.poster_path ?
                                    `https://image.tmdb.org/t/p/w500${film.poster_path}` :
                                    "/placeholder-poster.jpg"}
                            />
                        </Link>
                    ))
                ) : (
                    <div className="no-results">
                        <p>По запросу "{searchQuery}" ничего не найдено</p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default Main;