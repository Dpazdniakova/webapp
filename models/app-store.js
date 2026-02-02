'use strict';
import BlobStore from './blob-store.js';

const appStore = {

  store: new BlobStore('app-store', { info: {} }),
  collection: 'info',
  array: 'creators',

  getAppInfo() {
    return this.store.findAll(this.collection);
  },

};

export default appStore;
