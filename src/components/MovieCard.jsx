const MovieCard = ({ movie, isFavorite, onAdd, onRemove, onClick }) => {
  const handleFavClick = (e) => {
    e.stopPropagation(); 
    if (isFavorite) {
      onRemove(movie.imdbID);
    } else {
      onAdd(movie);
    }
  };

  return (
    <div className="card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <img
        src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x445?text=No+Image'}
        alt={movie.Title}
        className="card-img"
      />
      <div className="card-content">
        <h3>{movie.Title}</h3>
        <p>{movie.Year}</p>
        <button onClick={handleFavClick} className={isFavorite ? 'remove-btn' : 'add-btn'}>
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
