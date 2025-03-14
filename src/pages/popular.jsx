import { useEffect, useState } from "react";
import Card from "../components/card";
import Navbar from "../components/navbar";
import { Link } from "react-router-dom";
import axios from "axios";
import '../css/popular.css'

function Popular() {
    const [popularFilm, setPopularFilm] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    async function fetchPopular() {
        try {
            const response = await axios({
                method: 'get',
                url: 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1&api_key=3cc05ada7e70628b8d1bf36e4d1f6fd7'
            });
            console.log(response.data);
            setPopularFilm(response.data.results);
        } catch (error) {
            console.error('Ошибка при запросе:', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchPopular();
    }, []);

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div>
            <div>
                <Navbar />
            </div>
            <div className="main">
                {Array.isArray(popularFilm) && popularFilm.map((film) => (
                    <Link key={film.id} to={`/details-film/${film.id}`} state={{from: '/popular'}} className="cardLink">
                        <Card
                            title={film.title || "Нет названия"}
                            description={film.overview || "Нет описания"}
                            release_date={film.release_date || "Нет даты"}
                            imageUrl={`https://image.tmdb.org/t/p/w500${film.poster_path}`}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Popular;