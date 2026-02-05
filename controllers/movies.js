'use strict';

import logger from '../utils/logger.js';
import directorStore from '../models/directors.js';
import { v4 as uuidv4 } from 'uuid';

const director_movies = {
  async createView(request, response) {
    const directorId = request.params.id;
    const searchTerm = request.query.search || '';

    logger.debug('Director id = ' + directorId);
    logger.debug('Search Term = ' + searchTerm);

    const director = await directorStore.getDirector(directorId);

    const filteredMovies = searchTerm ? director.movies.filter(movie => {
      const titleMatch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
      const descriptionMatch = movie.description.toLowerCase().includes(searchTerm.toLowerCase());
      return titleMatch || descriptionMatch;
    }) : director.movies;

    const viewData = {
      title: 'Director Page',
      singleDirector: { ...director, movies: filteredMovies },
      query: {
        search: searchTerm
      }
    };

    response.render('director', viewData);
  },

  async showStreamingPlatforms(req, res) {
    const movieId = req.params.id;

    const director = (await directorStore.getAllDirectors()).find(d =>
      d.movies && d.movies.some(m => String(m.movieId) === movieId)
    );

    if (!director) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }

    const movie = director.movies.find(m => String(m.movieId) === movieId);

    res.render("streaming", { title: movie.title, platforms: movie.streamingServices });
  },

   async addMovie(request, response) {
    const directorId = request.params.id;
    console.log('Request body:', request.body);

    const director = await directorStore.getDirector(directorId);
    const genresInput = request.body.genres;
    const genresArray = genresInput.split(',').map(g => g.trim());

    const newMovie = {
      movieId: uuidv4(),
      title: request.body.title,
      genres: genresArray,
      year: new Date().getFullYear(),
      watchLater: false,
      poster: "",
      description: "",
      duration: 0,
      streamingServices: []
    };
    await directorStore.addMovie(director,newMovie)
    response.redirect('/director/' + directorId);
  },

   async deleteMovie(request, response) {
    const directorId = request.params.id;
    const movieId = request.params.movieId;
    logger.debug(`Deleting movie ${movieId} from director ${directorId}`);
     await directorStore.removeMovie(directorId,movieId)
    response.redirect('/director/' + directorId);
  },

  async updateMovie(request, response) {
    const directorId = request.params.id;
    const movieId = request.params.movieId;
 
    const director = await directorStore.getDirector(directorId);
    const existingMovie = director?.movies?.find((m) => String(m.movieId) === String(movieId));
    if (!existingMovie) {
      response.redirect('/director/' + directorId);
      return;
    }

    const updatedMovie = {
      ...existingMovie,
      title: request.body.title,
    };

    const requestedDirectorName = (request.body.director || "").trim();
    const currentDirectorName = (director?.name || "").trim();

    if (!requestedDirectorName || requestedDirectorName.toLowerCase() === currentDirectorName.toLowerCase()) {
      await directorStore.editMovie(directorId, movieId, updatedMovie);
      response.redirect('/director/' + directorId);
      return;
    }

    const allDirectors = await directorStore.getAllDirectors();
    const targetDirector = allDirectors.find((d) =>
      (d.name || "").trim().toLowerCase() === requestedDirectorName.toLowerCase()
    );

    if (!targetDirector || targetDirector.id === directorId) {
      await directorStore.editMovie(directorId, movieId, updatedMovie);
      response.redirect('/director/' + directorId);
      return;
    }

    await directorStore.moveMovie(directorId, targetDirector.id, movieId, updatedMovie);
    response.redirect('/director/' + directorId);
  }
};

export default director_movies;
