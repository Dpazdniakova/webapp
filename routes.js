'use strict';

import express from 'express';
import logger from "./utils/logger.js";

const router = express.Router();

import start from './controllers/start.js';
import dashboard from './controllers/dashboard.js';
import movies from './controllers/movies.js';
import about from './controllers/about.js';
import search from './controllers/search.js';

router.get('/', start.createView);
router.get('/about', about.createView)
router.get('/dashboard', dashboard.createView);
router.get('/director/:id', movies.createView);
router.get('/streaming/:id', movies.showStreamingPlatforms);

router.post('/director/:id/addmovie', movies.addMovie);
router.post('/dashboard/adddirector', dashboard.addDirector);
router.get('/director/:id/deletemovie/:movieId', movies.deleteMovie);
router.get('/dashboard/deletedirector/:id', dashboard.deleteDirector);
router.get('/search', search.createView);
router.post('/searchCategory', search.findResult);
router.post('/director/:id/updatemovie/:movieId', movies.updateMovie);


export default router;
