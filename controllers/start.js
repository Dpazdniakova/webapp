'use strict';

import logger from "../utils/logger.js";
import appStore from "../models/app-store.js";

const start = {
  async createView(request, response) {
    logger.info("Start page loading!");
    
    const viewData = {
      title: "Movie Tracker",
      info:  await appStore.getAppInfo()
    };
    
    response.render('start', viewData);   
  },
};

export default start;
