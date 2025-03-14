import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './pages/main';
import DetailsFilm from './pages/details.film';
import Popular from './pages/popular';
import TopFilm from './pages/topFilm';
import Actors from './pages/actors';
import ActorDetails from './pages/details.actors';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/popular" element={<Popular />} />
          <Route path="/topFilm" element={<TopFilm />} />
          <Route path="/actors" element={<Actors />} />
          <Route path="/details-film/:id" element={<DetailsFilm />} />
          <Route path="/details-actors/:id" element={<ActorDetails />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;