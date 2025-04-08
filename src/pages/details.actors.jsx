import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import '../css/details.actor.css';

function ActorDetails() {
    const { id } = useParams();
    const [actor, setActor] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || "/"; 

    useEffect(() => {
        let isMounted = true;

        async function fetchActor() {
            try {
                const response = await axios({
                    method: 'get',
                    url: `https://api.themoviedb.org/3/person/${id}?language=en-US&api_key=3cc05ada7e70628b8d1bf36e4d1f6fd7`
                });
                if (isMounted) {
                    console.log(response.data);
                    setActor(response.data);
                }
            } catch (error) {
                if (isMounted) {
                    console.error('Ошибка при запросе:', error);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchActor();

        return () => {
            isMounted = false;
        };
    }, [id]);

    if (isLoading) {
        return <div className="loading">Загрузка...</div>;
    }

    if (!actor) {
        return <div>Актёр не найден</div>;
    }

    return (
        <div className="actor-details-container">
            <button onClick={() => navigate(from)} className="back-button">
                Назад
            </button>
            <div className="actor-info">
                <img
                    src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                    alt={actor.name}
                    className="actor-image"
                />
                <div className="actor-text">
                    <h1 className="actor-name">{actor.name}</h1>
                    <p className="actor-popularity">Популярность: {actor.popularity}</p>
                    <p className="actor-department">Известен за: {actor.known_for_department}</p>
                    <p className="actor-birthday">Дата рождения: {actor.birthday || "Неизвестно"}</p>
                    <p className="actor-place-of-birth">Место рождения: {actor.place_of_birth || "Неизвестно"}</p>
                    <p className="actor-also-known-as">
                        Также известен как: {actor.also_known_as?.join(", ") || "Нет информации"}
                    </p>
                    <p className="actor-biography">{actor.biography || "Биография отсутствует."}</p>
                    <p className="actor-imdb-id">IMDb ID: {actor.imdb_id}</p>
                    <p className="actor-gender">Пол: {actor.gender === 1 ? "Женский" : "Мужской"}</p>
                    <p className="actor-adult">{actor.adult ? "18+" : "Для всех возрастов"}</p>
                </div>
            </div>
        </div>
    );
}

export default ActorDetails;