'use strict';

import logger from "../utils/logger.js";
import directorStore from "../models/directors.js"; 


const getAllGenres = async () => {
  const genreSet = new Set();
  const directors = await directorStore.getAllDirectors(); 

  directors.forEach(director => {
    director.movies.forEach(movie => {
      movie.genres.forEach(genre => {
         if (!genreSet.has(genre)) {
            genreSet.add(genre);
    }
      });
    });
  });

  return Array.from(genreSet).sort(); 
};

const genreSearch = {
  async createView(request, response) {
    logger.info("Genre Search page loading!");

    const genres = await getAllGenres();

    const viewData = {
      title: "Movie Genre Search",
      genres
    };

    logger.debug(viewData.genres);

    response.render('search', viewData);
  },
  
  async findResult(request, response) {
    const genre = request.body.genre;
    logger.debug('Movie category = ' + genre);

    const viewData = {
      title: 'Playlist',
      foundGenres: await directorStore.getMoviesByGenre(genre),
      genres: await getAllGenres(),
      genreTitle: genre
    };
    
    logger.debug(viewData.foundGenres);
    
    response.render('search', viewData);
}

};


export default genreSearch;
