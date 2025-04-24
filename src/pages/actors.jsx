import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Link } from "react-router-dom";
import '../css/actors.css';

function Actors() {
    const [people, setPeople] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchPeople() {
            try {
                setIsLoading(true);
                const response = await axios({
                    method: 'get',
                    url: 'https://api.themoviedb.org/3/person/popular',
                    params: {
                        language: 'ru-RU',
                        page: 1,
                        api_key: '3cc05ada7e70628b8d1bf36e4d1f6fd7'
                    }
                });
                setPeople(response.data.results);
                setError(null);
            } catch (error) {
                console.error('Ошибка при запросе:', error);
                setError('Не удалось загрузить данные об актерах. Пожалуйста, попробуйте позже.');
            } finally {
                setIsLoading(false);
            }
        }

        fetchPeople();
    }, []);

    // Оптимизация фильтрации с использованием useMemo
    const filteredPeople = useMemo(() => {
        if (!searchQuery) return people;
        return people.filter(person =>
            person.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [people, searchQuery]);

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
            
            <div className="actors-header">
                <h1>Популярные актеры</h1>
                <p>Самые известные актеры и актрисы киноиндустрии</p>
            </div>
            
            <div className="people-container">
                {filteredPeople.length > 0 ? (
                    <div className="people-list">
                        {filteredPeople.map((person) => (
                            <Link 
                                className="actorLink" 
                                key={person.id} 
                                to={`/details-actors/${person.id}`}
                                state={{ from: "/actors" }}
                            >
                                <div className="person-card">
                                    <div className="image-container">
                                        <img
                                            src={person.profile_path 
                                                ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                                                : '/placeholder-actor.jpg'}
                                            alt={person.name}
                                            className="person-image"
                                            onError={(e) => {
                                                e.target.src = '/placeholder-actor.jpg';
                                            }}
                                        />
                                    </div>
                                    <div className="person-info">
                                        <h2 className="person-name">{person.name}</h2>
                                        <p className="person-known-for">{person.known_for_department}</p>
                                        {person.known_for && person.known_for.length > 0 && (
                                            <p className="known-for-movies">
                                                Известен по: {person.known_for.map(movie => movie.title).slice(0, 2).join(', ')}
                                            </p>
                                        )}
                                    </div>
                                </div>
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

export default Actors;