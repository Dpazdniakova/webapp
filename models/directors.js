'use strict';


import BlobStore from './blob-store.js';;


const directorStore = {
   
  store: new BlobStore('directors', { directors: [] }),
  collection: 'directors',
  array: 'movies',
  
  async getAllDirectors() {
    return await this.store.findAll(this.collection);
  },
 
  async getDirector(id) {
    return await this.store.findOneBy(this.collection, (director => director.id === id));
},
  
  async addMovie(idOrDirector, movie) {
    const id = typeof idOrDirector === 'object' ? idOrDirector.id : idOrDirector;
    await this.store.addItem(this.collection, id, this.array, movie);
},
  async addDirector(director) {
    await this.store.addCollection(this.collection, director);
},
 async removeMovie(id, movieId) {
  console.log(`Removed movie ${movieId} from director ${id}`);
   await this.store.removeItem(this.collection, id, this.array, movieId);
},
  async removeDirector (id) {
    await this.store.removeCollection(this.collection, id);
  },
  
  // Get directors with movies of a specific genre (helper method, private)
  async getDirectorsWithGenre(genre) {
    return await this.store.findBy(this.collection, director =>
      director.movies && director.movies.some(movie =>
        movie.genres.some(g =>
          g.toLowerCase() === genre.toLowerCase()
        )
      )
    );
  },
  
  // The main method for getting movies by genre
  async getMoviesByGenre(genre) {
    const matchingMovies = [];
    const directorsWithMatchingMovies = await this.getDirectorsWithGenre(genre);
    
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
  async editMovie(directorId, movieId, updatedMovie) {
    await this.store.editItem(this.collection, directorId, movieId, this.array, updatedMovie);
  },
  async moveMovie(fromDirectorId, toDirectorId, movieId, updatedMovie) {
    await this.store.removeItem(this.collection, fromDirectorId, this.array, movieId);
    await this.store.addItem(this.collection, toDirectorId, this.array, updatedMovie);
  }
};
export default directorStore;
