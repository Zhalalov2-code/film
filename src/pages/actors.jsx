import axios from "axios";
import { useEffect, useState } from "react";
import '../css/actors.css';
import Navbar from "../components/navbar";
import { Link } from "react-router-dom";

function Actors() {
    const [people, setPeople] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    async function fetchPeople() {
        setIsLoading(true);
        try {
            const response = await axios({
                method: 'get',
                url: 'https://api.themoviedb.org/3/person/popular',
                params: {
                    language: 'en-US',
                    api_key: '3cc05ada7e70628b8d1bf36e4d1f6fd7'
                }
            });
            setPeople(response.data.results);
        } catch (error) {
            console.error('Ошибка при запросе:', error);
        } finally {
            setIsLoading(false);
        }
    }

    function handleSearch(query) {
        setSearchQuery(query);
    }

    useEffect(() => {
        fetchPeople();
    }, []);

    const filteredPeople = people.filter(person =>
        person.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return <div className="loading">Загрузка...</div>;
    }

    return (
        <div>
            <Navbar onSearch={handleSearch} />
            <div className="people-container">
                {filteredPeople.length === 0 ? (
                    <div className="no-results">Ничего не найдено</div>
                ) : (
                    <div className="people-list">
                        {filteredPeople.map((person) => (
                            <Link 
                                className="actorLink" 
                                key={person.id} 
                                to={{
                                    pathname: `/details-actors/${person.id}`,
                                    state: { from: "/actors" }
                                }}
                            >
                                <div className="person-card">
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
                                    <div className="person-info">
                                        <h2 className="person-name">{person.name}</h2>
                                        <p className="person-known-for">{person.known_for_department}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Actors;