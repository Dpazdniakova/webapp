'use strict';

// import { Low } from "lowdb";
// import { JSONFile } from "lowdb/node";

import { getStore } from '@netlify/blobs'

class BlobStore {
  constructor(storeName, defaults) {
    
    this.storeName = storeName;
    this.defaults = defaults;
    
    const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
    const token = process.env.NETLIFY_ACCESS_TOKEN || process.env.NETLIFY_TOKEN;
    
   
      this.store = this.store = getStore({
      name: storeName,
      siteID: siteID,
      token: token,
    });
    
  }

  findAll(collection) {
    return this.store.data[collection];
  }

  findBy(collection, filter) {
    const results = this.store.data[collection].filter(filter);
    return results;
  }

  findOneBy(collection, filter) {
    const results = this.store.data[collection].filter(filter);
    return results[0];
  }

  async addCollection(collection, obj) {
    this.store.data[collection].push(obj);
    await this.store.write();
  }

  async addItem(collection, id, arr, obj) {
    const data = this.store.data[collection].filter((c) => c.id === id);
    data[0][arr].push(obj);
    await this.store.write();
  }

  async removeCollection(collection, obj) {
    const index = this.store.data[collection].indexOf(obj);
    if (index > -1) {
      this.store.data[collection].splice(index, 1);
    }
    await this.store.write();
  }

  async removeItem(collection, id, arr, itemId) {
    const data = this.store.data[collection].filter((c) => c.id === id);
    const item = data[0][arr].filter((i) => i.id === itemId);
    const index = data[0][arr].indexOf(item[0]);
    if (index > -1) {
      data[0][arr].splice(index, 1);
    }
    await this.store.write();
  }

  async editCollection(collection, id, obj) {
    let index = this.store.data[collection].findIndex((c) => c.id === id);
    if (index > -1) {
      this.store.data[collection].splice(index, 1, obj);
    }
    await this.store.write();
  }

  async editItem(collection, id, itemId, arr, obj) {
    const data = this.store.data[collection].filter((c) => c.id === id);
    let index = data[0][arr].findIndex((i) => i.id === itemId);
    data[0][arr].splice(index, 1, obj);
    await this.store.write();
  }
}

export default BlobStore;


