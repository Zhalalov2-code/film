import axios from "axios";
import { useEffect, useState } from "react";
import Card from "../components/card";
import '../css/topFilm.css';
import Navbar from "../components/navbar";
import { Link } from "react-router-dom";

function TopFilm() {
    const [topFilm, setTopFilm] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    async function fetchTop() {
        try {
            const response = await axios({
                method: 'get',
                url: 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1&api_key=3cc05ada7e70628b8d1bf36e4d1f6fd7'
            });
            console.log(response.data);
            setTopFilm(response.data.results);
        } catch (error) {
            console.error('Ошибка при запросе:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const filteredFilms = searchQuery
    ? topFilm.filter((film) =>
        film.original_title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : topFilm;

    useEffect(() => {
        fetchTop();
    }, []);

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div>
            <div>
                <Navbar onSearch={setSearchQuery} />
            </div>
            <div className="topFilm-container">
                <div className="film-list">
                    {Array.isArray(filteredFilms) && filteredFilms.map((film) => (
                        <Link key={film.id} to={`/details-film/${film.id}`} state={{ from: '/topFilm' }} className="cardLink">
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
        </div>
    );
}

export default TopFilm;