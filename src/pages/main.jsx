import { useEffect, useState } from "react";
import Card from "../components/card";
import Navbar from "../components/navbar";
import axios from "axios";
import '../css/main.css'
import { Link } from "react-router-dom";

function Main() {
    const [films, setFilms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    async function fetchFilm() {
        try {
            const response = await axios({
                method: 'get',
                url: 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1&api_key=3cc05ada7e70628b8d1bf36e4d1f6fd7'
            });
            console.log(response.data);
            if (response.status === 200) {
                setFilms(response.data.results);
            }
        } catch (error) {
            console.error('Ошибка при запросе:', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchFilm();
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
                {Array.isArray(films) && films.map((film) => (
                    <Link key={film.id} to={`/details-film/${film.id}`} state={{from: '/'}} className="cardLink">
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

export default Main;