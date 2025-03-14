import axios from "axios";
import { useEffect, useState } from "react";
import '../css/actors.css';
import Navbar from "../components/navbar";
import { Link } from "react-router-dom";

function Actors() {
    const [people, setPeople] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    async function fetchPeople() {
        try {
            const response = await axios({
                method: 'get',
                url: 'https://api.themoviedb.org/3/person/popular?language=en-US&api_key=3cc05ada7e70628b8d1bf36e4d1f6fd7'
            });
            console.log(response.data);
            setPeople(response.data.results);
        } catch (error) {
            console.error('Ошибка при запросе:', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchPeople();
    }, []);

    if (isLoading) {
        return <div className="loading">Загрузка...</div>;
    }

    return (
        <div>
            <Navbar />
            <div className="people-container">
                <div className="people-list">
                    {people.map((person) => (
                        <Link className="actorLink" key={person.id} to={`/details-actors/${person.id}`} state={{ from: "/actors" }}>
                            <div className="person-card">
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                                    alt={person.name}
                                    className="person-image"
                                />
                                <div className="person-info">
                                    <h2 className="person-name">{person.name}</h2>
                                    <p className="person-known-for">{person.known_for_department}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Actors;