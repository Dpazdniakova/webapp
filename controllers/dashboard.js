'use strict';

import logger from "../utils/logger.js";
import directorStore from '../models/directors.js';
import { v4 as uuidv4 } from 'uuid';


const dashboard = {
  createView(request, response) {
    logger.info("Dashboard page loading!");
    
    
    const viewData = {
      title: "Movie Tracker Dashboard",
      directors: directorStore.getAllDirectors()
    };
    
    logger.debug(viewData.directors);
    response.render('dashboard', viewData);
  },
  
  addDirector(request, response) {
    const newDirector = {
      id: uuidv4(),
      name: request.body.name,
      movies: []
    };
    directorStore.addDirector(newDirector);
    response.redirect('/dashboard');
},
 deleteDirector(request, response) {
    const directorId = request.params.id;
    logger.debug(`Deleting Director ${directorId}`);
    directorStore.removeDirector(directorId);
    response.redirect("/dashboard");
}
  
};

export default dashboard;


