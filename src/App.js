import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
//components
import MovieList from './components/MovieList';
import MovieListHeading from './components/MovieListHeading';
import SearchBox from './components/SearchBox';
import AddFavourite from './components/AddToFavourites';
import RemoveFavourites from './components/RemoveFavourites';

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [favourites, setFavourites] = useState([]);

  const getMovieRequest = async (searchValue) => {
    const url = `http://www.omdbapi.com/?s=${searchValue}&apikey=3ce05370`;

    try {
      const response = await fetch(url);
      const responseJson = await response.json();
      console.log(responseJson.Search);
      if (responseJson && responseJson.Search && Array.isArray(responseJson.Search)) {
        const filteredMovies = responseJson.Search.filter(movie => movie.Poster !== "N/A");
        setMovies(filteredMovies);
      }
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  const saveToLocalStorage = (items) => {
    localStorage.setItem("react-movie-app-favourites", JSON.stringify(items));
  }

  const addFavouriteMovie = (movies) => {
    const newFavouriteList = [...favourites, movies];
    setFavourites(newFavouriteList);
    saveToLocalStorage(newFavouriteList);
  }

  const removeFavouriteMovie = (movie) => {
		const newFavouriteList = favourites.filter(
			(favourite) => favourite.imdbID !== movie.imdbID
		);

		setFavourites(newFavouriteList);
    saveToLocalStorage(newFavouriteList);
	};

  useEffect(() => {
    getMovieRequest(searchValue);
  }, [searchValue]);

  useEffect(() => {
		const movieFavourites = JSON.parse(
			localStorage.getItem('react-movie-app-favourites')
		);

		setFavourites(movieFavourites);
	}, []);


  return (
    <div className='container-fluid movie-app'>
      <div className='row d-flex align-items-center'>
        <MovieListHeading heading='Movies' />
        <SearchBox searchValue={searchValue} setSearchValue={setSearchValue} />
      </div>
      <div className='row'>
        <MovieList movies={movies} 
        favouriteComponent={AddFavourite}
        handleFavouritesClick={addFavouriteMovie} />
      </div>

      <div className='row d-flex align-items-center mt-4 mb-4'>
				<MovieListHeading heading='Favourites' />
			</div>
			<div className='row'>
				<MovieList movies={favourites} 
        handleFavouritesClick={removeFavouriteMovie}
        favouriteComponent={RemoveFavourites} />
			</div>


    </div>
  );
};

export default App;