'use strict';

import express from 'express';
import routes from "./routes.js";
import logger from "./utils/logger.js";
import { create } from 'express-handlebars';
import directorStore from './models/directors.js';


const app = express();

const port = 3000;
// Add this middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const handlebars = create({extname: '.hbs'});
app.engine(".hbs", handlebars.engine);
app.set("view engine", ".hbs");

app.use("/", routes);

app.listen(port, () => logger.info(`Your app is listening on port ${port}`));
