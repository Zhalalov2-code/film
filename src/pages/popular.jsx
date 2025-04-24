import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Card from "../components/card";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Link } from "react-router-dom";
import '../css/popular.css';

function Popular() {
    const [popularFilm, setPopularFilm] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchPopular() {
            try {
                setIsLoading(true);
                const response = await axios({
                    method: 'get',
                    url: 'https://api.themoviedb.org/3/movie/popular',
                    params: {
                        language: 'ru-RU',
                        page: 1,
                        api_key: '3cc05ada7e70628b8d1bf36e4d1f6fd7'
                    }
                });
                setPopularFilm(response.data.results);
                setError(null);
            } catch (error) {
                console.error('Ошибка при запросе:', error);
                setError('Не удалось загрузить фильмы. Пожалуйста, попробуйте позже.');
            } finally {
                setIsLoading(false);
            }
        }

        fetchPopular();
    }, []);

    // Оптимизация фильтрации с использованием useMemo
    const filteredFilms = useMemo(() => {
        if (!searchQuery) return popularFilm;
        return popularFilm.filter((film) =>
            film.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            film.original_title?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [popularFilm, searchQuery]);

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
        <div className="page-container">
            <Navbar onSearch={setSearchQuery} />
            
            <div className="popular-header">
                <h1>Популярные фильмы</h1>
                <p>Самые обсуждаемые фильмы, которые стоит посмотреть</p>
            </div>
            
            <div className="popular-container">
                {filteredFilms.length > 0 ? (
                    <div className="movie-grid">
                        {filteredFilms.map((film) => (
                            <Link 
                                key={film.id} 
                                to={`/details-film/${film.id}`} 
                                state={{ from: '/popular' }} 
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
                        ))}
                    </div>
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

export default Popular;