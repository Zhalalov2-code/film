import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import '../css/details.film.css';

function DetailsFilm() {
    const { id } = useParams();
    const [filmDetails, setFilmDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/';

    async function detailsFilm() {
        try {
            const response = await axios({
                method: 'get',
                url: `https://api.themoviedb.org/3/movie/${id}?language=en-US&api_key=3cc05ada7e70628b8d1bf36e4d1f6fd7`
            });
            console.log("Ответ от API:", response.data);
            setFilmDetails(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке фильма:', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        detailsFilm();
    }, [id]);

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (!filmDetails) {
        return <div>Фильм не найден</div>;
    }

    return (
        <div className="details-container">
            <button onClick={() => navigate(from)} className="back-button">
                Назад
            </button>
            <h1 className="details-title">{filmDetails.title}</h1>
            <div className="details-content">
                <img
                    className="details-poster"
                    src={`https://image.tmdb.org/t/p/w500${filmDetails.poster_path}`}
                    alt={filmDetails.title}
                />
                <div className="details-info">
                    <p className="details-overview">{filmDetails.overview}</p>
                    <div className="details-meta">
                        <p><strong>Дата выхода:</strong> {filmDetails.release_date}</p>
                        <p><strong>Рейтинг:</strong> <span className="details-rating">{filmDetails.vote_average}/10</span></p>
                        <p><strong>Продолжительность:</strong> {filmDetails.runtime} мин.</p>
                        <p><strong>Жанры:</strong> {filmDetails.genres.map((genre) => genre.name).join(", ")}</p>
                        <p><strong>Бюджет:</strong> ${filmDetails.budget.toLocaleString()}</p>
                        <p><strong>Сборы:</strong> ${filmDetails.revenue.toLocaleString()}</p>
                        <p><strong>Статус:</strong> {filmDetails.status}</p>
                        <p><strong>Компании:</strong> {filmDetails.production_companies.map((company) => company.name).join(", ")}</p>
                        <p><strong>Страны:</strong> {filmDetails.production_countries.map((country) => country.name).join(", ")}</p>
                        <p><strong>Языки:</strong> {filmDetails.spoken_languages.map((language) => language.english_name).join(", ")}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailsFilm;