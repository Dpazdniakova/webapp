

'use strict';

import logger from "../utils/logger.js";
import directorStore from "../models/directors.js"; 


const getAllGenres = () => {
  const genreSet = new Set();
  const directors = directorStore.getAllDirectors(); 

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
  createView(request, response) {
    logger.info("Genre Search page loading!");

    const viewData = {
      title: "Movie Genre Search",
      genres: getAllGenres()
    };

    logger.debug(viewData.genres);

    response.render('search', viewData);
  },
  
  findResult(request, response) {
    const genre = request.body.genre;
    logger.debug('Movie category = ' + genre);

    const viewData = {
      title: 'Playlist',
      foundGenres: directorStore.getMoviesByGenre(genre),
      genres: getAllGenres(),
      genreTitle: genre
    };
    
    logger.debug(viewData.foundGenres);
    
    response.render('search', viewData);
}

};


export default genreSearch;
