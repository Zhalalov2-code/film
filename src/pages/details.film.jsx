import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import '../css/details.film.css';

function DetailsFilm() {
    const { id } = useParams();
    const [filmDetails, setFilmDetails] = useState(null);
    const [similarFilms, setSimilarFilms] = useState([]);
    const [treiler, setTrailer] = useState(null); 
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/';

    const apiKey = '3cc05ada7e70628b8d1bf36e4d1f6fd7';

    const fetchFilmDetails = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const [detailsResponse, similarResponse, videosResponse, recommendationsResponse] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
                    params: { language: 'en-US', api_key: apiKey }
                }),
                axios.get(`https://api.themoviedb.org/3/movie/${id}/similar`, {
                    params: { language: 'en-US', api_key: apiKey }
                }),
                axios.get(`https://api.themoviedb.org/3/movie/${id}/videos`, {
                    params: { language: 'en-US', api_key: apiKey }
                }),
                axios.get(`https://api.themoviedb.org/3/movie/${id}/recommendations`, {
                    params: { language: 'en-US', api_key: apiKey }
                })
            ]);

            setFilmDetails(detailsResponse.data);
            setSimilarFilms(similarResponse.data.results);

            const foundTrailer = videosResponse.data.results.find(
                video => video.type === "Trailer" && video.site === "YouTube"
            );
            setTrailer(foundTrailer);

            setRecommendations(recommendationsResponse.data.results);

        } catch (err) {
            console.error('Ошибка при загрузке данных:', err);
            setError(err.response?.data?.status_message || err.message);
        } finally {
            setIsLoading(false);
        }
    }, [id, apiKey]);

    useEffect(() => {
        fetchFilmDetails();
    }, [fetchFilmDetails]);

    if (isLoading) {
        return <div className="loading">Загрузка...</div>;
    }

    if (error) {
        return <div className="error">Ошибка: {error}</div>;
    }

    if (!filmDetails) {
        return <div className="not-found">Фильм не найден</div>;
    }

    const releaseDate = new Date(filmDetails.release_date).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="details-container">
            <button onClick={() => navigate(from)} className="back-button">
                Назад
            </button>

            <div className="film-main">
                <h1 className="details-title">{filmDetails.title}</h1>
                <div className="details-content">
                    <img
                        className="details-poster"
                        src={filmDetails.poster_path
                            ? `https://image.tmdb.org/t/p/w500${filmDetails.poster_path}`
                            : '/no-poster.jpg'}
                        alt={filmDetails.title}
                        onError={(e) => {
                            e.target.src = '/no-poster.jpg';
                        }}
                    />
                    <div className="details-info">
                        <p className="details-overview">{filmDetails.overview || 'Описание отсутствует'}</p>

                        <div className="details-meta">
                            <p><strong>Дата выхода:</strong> {releaseDate || 'Неизвестно'}</p>
                            <p><strong>Рейтинг:</strong> <span className="details-rating">
                                {filmDetails.vote_average ? `${filmDetails.vote_average}/10` : 'Нет оценок'}
                            </span></p>
                            <p><strong>Продолжительность:</strong> {filmDetails.runtime ? `${filmDetails.runtime} мин.` : 'Неизвестно'}</p>
                            {filmDetails.genres?.length > 0 && (
                                <p><strong>Жанры:</strong> {filmDetails.genres.map(genre => genre.name).join(", ")}</p>
                            )}
                            <p><strong>Бюджет:</strong> {filmDetails.budget ? `$${filmDetails.budget.toLocaleString('ru-RU')}` : 'Неизвестно'}</p>
                            <p><strong>Сборы:</strong> {filmDetails.revenue ? `$${filmDetails.revenue.toLocaleString('ru-RU')}` : 'Неизвестно'}</p>
                            <p><strong>Статус:</strong> {filmDetails.status || 'Неизвестно'}</p>
                            {filmDetails.production_companies?.length > 0 && (
                                <p><strong>Компании:</strong> {filmDetails.production_companies.map(company => company.name).join(", ")}</p>
                            )}
                            {filmDetails.production_countries?.length > 0 && (
                                <p><strong>Страны:</strong> {filmDetails.production_countries.map(country => country.name).join(", ")}</p>
                            )}
                            {filmDetails.spoken_languages?.length > 0 && (
                                <p><strong>Языки:</strong> {filmDetails.spoken_languages.map(lang => lang.english_name).join(", ")}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {treiler ? (
                <div className="trailer-container">
                    <h2>Трейлер</h2>
                    <iframe
                        width="560"
                        height="315"
                        src={`https://www.youtube.com/embed/${treiler.key}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            ) : (
                <div className="no-trailer"><h3>Трейлер не доступен.</h3></div>
            )}

            {similarFilms.length > 0 && (
                <div className="similar-films">
                    <h2 className="similar-title">Похожие фильмы</h2>
                    <div className="similar-films-container">
                        {similarFilms.slice(0, 4).map(film => (
                            <Link key={film.id} to={`/details-film/${film.id}`}>
                                <div className="similar-item">
                                    <img
                                        src={film.poster_path
                                            ? `https://image.tmdb.org/t/p/w500${film.poster_path}`
                                            : '/no-poster.jpg'}
                                        alt={film.title}
                                        className="similar-item-img"
                                        onError={(e) => {
                                            e.target.src = '/no-poster.jpg';
                                        }}
                                    />
                                    <p>{film.title}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {recommendations.length > 0 && (
                <div className="rec-films">
                    <h2 className="rec-title">Рекомендованные фильмы</h2>
                    <div className="rec-films-container">
                        {recommendations.slice(0, 4).map(film => (
                            <Link key={film.id} to={`/details-film/${film.id}`}>
                                <div className="rec-item">
                                    <img
                                        src={film.poster_path
                                            ? `https://image.tmdb.org/t/p/w500${film.poster_path}`
                                            : '/no-poster.jpg'}
                                        alt={film.title}
                                        className="rec-item-img"
                                        onError={(e) => {
                                            e.target.src = '/no-poster.jpg';
                                        }}
                                    />
                                    <p>{film.title}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default DetailsFilm;
