
'use strict';
import logger from "../utils/logger.js";
import appStore from "../models/app-store.js";

const about = {

  createView(request, response) {
    
    logger.info("Start page loading!")
    const viewData = {
      title: "Welcome to the Playlist app!",
      info: appStore.getAppInfo()
    } ;
    
    response.render('about',viewData)
  },
};

export default about;