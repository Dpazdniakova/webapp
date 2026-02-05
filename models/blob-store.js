'use strict';

// import { Low } from "lowdb";
// import { JSONFile } from "lowdb/node";

import { getStore } from '@netlify/blobs'

class BlobStore {
  constructor(storeName, defaults) {
    
    this.storeName = storeName;
    this.defaults = defaults;
    this.dataKey = 'data';
    
    const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
    const token = process.env.NETLIFY_ACCESS_TOKEN || process.env.NETLIFY_TOKEN;
    
   
      this.store = getStore({
      name: storeName,
      siteID: siteID,
      token: token,
    });
    
  }

  _cloneDefaults() {
    return JSON.parse(JSON.stringify(this.defaults || {}));
  }

  async _readData() {
    let data = await this.store.get(this.dataKey, { type: 'json' });
    if (!data) {
      data = this._cloneDefaults();
      await this._writeData(data);
      return data;
    }

    let changed = false;
    for (const [key, value] of Object.entries(this.defaults || {})) {
      if (!(key in data)) {
        data[key] = value;
        changed = true;
      }
    }
    if (changed) {
      await this._writeData(data);
    }
    return data;
  }

  async _writeData(data) {
    if (typeof this.store.setJSON === 'function') {
      await this.store.setJSON(this.dataKey, data);
      return;
    }
    await this.store.set(this.dataKey, JSON.stringify(data));
  }

  async findAll(collection) {
    const data = await this._readData();
    return data[collection];
  }

  async findBy(collection, filter) {
    const data = await this._readData();
    const results = (data[collection] || []).filter(filter);
    return results;
  }

  async findOneBy(collection, filter) {
    const data = await this._readData();
    const results = (data[collection] || []).filter(filter);
    return results[0];
  }

  async addCollection(collection, obj) {
    const data = await this._readData();
    if (!Array.isArray(data[collection])) {
      data[collection] = [];
    }
    data[collection].push(obj);
    await this._writeData(data);
  }

  async addItem(collection, id, arr, obj) {
    const data = await this._readData();
    const items = (data[collection] || []).filter((c) => c.id === id);
    if (!items[0]) {
      return;
    }
    if (!Array.isArray(items[0][arr])) {
      items[0][arr] = [];
    }
    items[0][arr].push(obj);
    await this._writeData(data);
  }

  async removeCollection(collection, id) {
    const data = await this._readData();
    const index = (data[collection] || []).findIndex((c) => c.id === id);
    if (index > -1) {
      data[collection].splice(index, 1);
    }
    await this._writeData(data);
  }

  async removeItem(collection, id, arr, itemId) {
    const data = await this._readData();
    const items = (data[collection] || []).filter((c) => c.id === id);
    if (!items[0] || !Array.isArray(items[0][arr])) {
      return;
    }
    const item = items[0][arr].filter((i) => i.movieId === itemId);
    const index = items[0][arr].indexOf(item[0]);
    if (index > -1) {
      items[0][arr].splice(index, 1);
    }
    await this._writeData(data);
  }

  async editCollection(collection, id, obj) {
    const data = await this._readData();
    let index = (data[collection] || []).findIndex((c) => c.id === id);
    if (index > -1) {
      data[collection].splice(index, 1, obj);
    }
    await this._writeData(data);
  }

  async editItem(collection, id, itemId, arr, obj) {
    const data = await this._readData();
    const items = (data[collection] || []).filter((c) => c.id === id);
    if (!items[0] || !Array.isArray(items[0][arr])) {
      return;
    }
    let index = items[0][arr].findIndex((i) => i.id === itemId);
    if (index > -1) {
      items[0][arr].splice(index, 1, obj);
    }
    await this._writeData(data);
  }
}

export default BlobStore;

