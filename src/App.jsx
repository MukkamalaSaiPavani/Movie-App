import { useState } from 'react';
import MovieCard from './components/MovieCard';
import './App.css';
const API_KEY = 'fd23445c';

function App() {
  const [view, setView] = useState('home');
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [selectedMovieDetails, setSelectedMovieDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const searchMovies = async () => {
    if (!query.trim()) return;
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);
    const data = await res.json();
    setMovies(data.Search || []);
    setView('search');
  };

  const addFavorite = (movie) => {
    if (favorites.some((f) => f.imdbID === movie.imdbID)) return;
    const updated = [...favorites, movie];
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const removeFavorite = (id) => {
    const updated = favorites.filter((m) => m.imdbID !== id);
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const openDetails = async (imdbID) => {
    setSelectedMovieId(imdbID);
    setLoadingDetails(true);
    try {
      const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`);
      const data = await res.json();
      setSelectedMovieDetails(data);
    } catch {
      setSelectedMovieDetails(null);
    }
    setLoadingDetails(false);
  };

  const closeDetails = () => {
    setSelectedMovieId(null);
    setSelectedMovieDetails(null);
  };

  return (
    <div className="home">
      <div className="navbar">
        <div className="logo" onClick={() => setView('home')}>🎬 Movie App</div>
        <ul className="nav-links">
          <li>
            <button 
              onClick={() => setView('home')}
              className={view === 'home' ? 'active' : ''}
            >
              Home
            </button>
          </li>
          <li>
            <button 
              onClick={() => setView('search')}
              className={view === 'search' ? 'active' : ''}
            >
              Search
            </button>
          </li>
          <li>
            <button 
              onClick={() => setView('favorites')}
              className={view === 'favorites' ? 'active' : ''}
            >
              Favorites
            </button>
          </li>
        </ul>
      </div>

      <div className="container">
        {view === 'home' && (
          <>
            <h1>🎬 Movie Search App</h1>
            <p>Welcome! Choose an option below:</p>
            <div className="button-row">
              <button onClick={() => setView('search')}>Go to Search</button>
              <button onClick={() => setView('favorites')}>View Favorites</button>
            </div>
          </>
        )}
        {view === 'search' && (
          <>
            <h1>🎬 Movie Search App</h1>
            <div className="search-bar">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies..."
                onKeyDown={(e) => e.key === 'Enter' && searchMovies()}
              />
              <button onClick={searchMovies} disabled={!query.trim()}>
                Search
              </button>
              <button
                onClick={() => {
                  setView('home');
                  setQuery('');
                  setMovies([]);
                }}
              >
                Go Back Home
              </button>
              <button onClick={() => setView('favorites')}>View Favorites</button>
            </div>

            <div className="movie-grid">
              {movies.length > 0 ? (
                movies.map((movie) => (
                  <MovieCard
                    key={movie.imdbID}
                    movie={movie}
                    isFavorite={favorites.some((f) => f.imdbID === movie.imdbID)}
                    onAdd={addFavorite}
                    onRemove={removeFavorite}
                    onClick={() => openDetails(movie.imdbID)}
                  />
                ))
              ) : (
                <p>No results found. Try searching for a movie.</p>
              )}
            </div>
          </>
        )}
        {view === 'favorites' && (
          <>
            <h2>❤️ Favorites</h2>
            <div className="button-row">
              <button onClick={() => setView('home')}>Go Back Home</button>
              <button onClick={() => setView('search')}>Go to Search</button>
            </div>

            <div className="movie-grid">
              {favorites.length > 0 ? (
                favorites.map((movie) => (
                  <MovieCard
                    key={movie.imdbID}
                    movie={movie}
                    isFavorite={true}
                    onAdd={addFavorite}
                    onRemove={removeFavorite}
                    onClick={() => openDetails(movie.imdbID)} 
                  />
                ))
              ) : (
                <p>No favorite movies yet.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
function MovieDetailsPopup({ movie, onClose, loading }) {
  if (loading) {
    return (
      <div style={overlayStyle}>
        <div style={popupStyle}>Loading details...</div>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={popupStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeBtnStyle} onClick={onClose}>X</button>
        <h2>{movie.Title} ({movie.Year})</h2>
        <img
          src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/200x300'}
          alt={movie.Title}
          style={{ width: '200px' }}
        />
        <p><strong>Genre:</strong> {movie.Genre}</p>
        <p><strong>Director:</strong> {movie.Director}</p>
        <p><strong>Actors:</strong> {movie.Actors}</p>
        <p><strong>Plot:</strong> {movie.Plot}</p>
        <p><strong>IMDB Rating:</strong> {movie.imdbRating}</p>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 2000,
};

const popupStyle = {
  backgroundColor: '#111',
  padding: '20px',
  borderRadius: '10px',
  maxWidth: '400px',
  color: 'white',
  position: 'relative',
  textAlign: 'left',
  maxHeight: '80vh',
  overflowY: 'auto',
};

const closeBtnStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  cursor: 'pointer',
  background: 'transparent',
  border: 'none',
  color: 'white',
  fontSize: '18px',
  fontWeight: 'bold',
};
