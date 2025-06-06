import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importing Axios to fetch data
import { Link } from 'react-router-dom'; // If you want to link to individual movie pages

const Home = () => {
  const [movies, setMovies] = useState([]); // State to store the movies
  const [error, setError] = useState(''); // State for error handling

  // UseEffect to fetch movies from the backend when component mounts
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Make GET request to the backend API
        const response = await axios.get('http://localhost:5000/api/movies'); // Adjust URL if necessary
        setMovies(response.data); // Store the movies data in state
      } catch (err) {
        setError('Failed to fetch movies. Please try again later.');
        console.error(err);
      }
    };

    fetchMovies(); // Call fetchMovies when component mounts
  }, []); // Empty dependency array to ensure it runs only once

  return (
    <div>
      <h1>Movies List</h1>
      {error && <p>{error}</p>} {/* Show error message if there is one */}
      <div>
        {movies.length > 0 ? (
          <ul>
            {movies.map((movie) => (
              <li key={movie.id}>
                <Link to={`/movie/${movie.id}`}>{movie.title}</Link> {/* Link to individual movie page */}
              </li>
            ))}
          </ul>
        ) : (
          <p>No movies found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
