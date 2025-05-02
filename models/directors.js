'use strict';

import logger from '../utils/logger.js';
import JsonStore from './json-store.js';

const directorStore = {
   
  store: new JsonStore('./models/directors.json', { directors: [] }),
  collection: 'directors',
  array: 'movies',
  
  getAllDirectors() {
    return this.store.findAll(this.collection);
  },
 
  getDirector(id) {
    return this.store.findOneBy(this.collection, (director => director.id === id));
},
  
  addMovie(id, movie) {
    this.store.addItem(this.collection, id, this.array, movie);
},
  addDirector(director) {
    this.store.addCollection(this.collection, director);
},
 removeMovie(id, movieId) {
  console.log(`Removed movie ${movieId} from director ${id}`);
   this.store.removeItem(this.collection, id, this.array, movieId);
},
  removeDirector (id) {
    const director = this.getDirector(id);
    this.store.removeCollection(this.collection, director);
  },
  
  // Get directors with movies of a specific genre (helper method, private)
  getDirectorsWithGenre(genre) {
    return this.store.findBy(this.collection, director =>
      director.movies && director.movies.some(movie =>
        movie.genres.some(g =>
          g.toLowerCase() === genre.toLowerCase()
        )
      )
    );
  },
  
  // The main method for getting movies by genre
  getMoviesByGenre(genre) {
    const matchingMovies = [];
    const directorsWithMatchingMovies = this.getDirectorsWithGenre(genre);
    
    directorsWithMatchingMovies.forEach(director => {
      // Filter to only include movies that match the genre
      const filteredMovies = director.movies.filter(movie => 
        movie.genres.some(g => g.toLowerCase() === genre.toLowerCase())
      );
      
      // Add director information to each movie
      filteredMovies.forEach(movie => {
        matchingMovies.push({
          ...movie,
          directorId: director.id,
          directorName: director.name
        });
      });
    });
    
    return matchingMovies;
  },
  editMovie(directorId, movieId, updatedMovie) {
    this.store.editItem(this.collection, directorId, movieId, this.array, updatedMovie);
}
};
export default directorStore;