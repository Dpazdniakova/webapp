'use strict';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import JsonStore from './json-store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const appStore = {

  store: new JsonStore(join(__dirname, 'app-store.json'), { info: {} }),
  collection: 'info',
  array: 'creators',

  getAppInfo() {
    return this.store.findAll(this.collection);
  },

};

export default appStore;
