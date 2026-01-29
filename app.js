import express from 'express';
import { create } from 'express-handlebars';
import routes from './routes.js';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const handlebars = create({ extname: '.hbs' });
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');

app.use('/', routes);

export default app;