'use strict';
import BlobStore from './blob-store.js';

const appStore = {

  store: new BlobStore('app-store', { info: {} }),
  collection: 'info',
  array: 'creators',

  async getAppInfo() {
    return await this.store.findAll(this.collection);
  },

};

export default appStore;
