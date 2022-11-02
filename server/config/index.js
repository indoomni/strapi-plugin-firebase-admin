'use strict';

const util = require('util');

// console.log('Firebase admin config..');
// console.log(
//   'Config ->',
//   strapi.config.server['firebase-admin'],
// );

module.exports = {
  default: ({ env }) => {
    if (
      !strapi.config.server['firebase-admin'] ||
      !strapi.config.server['firebase-admin'].enabled
    ) {
      return undefined;
    }
    return strapi.config.server['firebase-admin'].config;
  },
  validator: config => {
    strapi.firebase = {
      admin: undefined,
    };

    try {
      const { serviceId, configFile } = config;
      // console.log('Current directory:', __dirname);
      const dirname = strapi.dirs.dist.src;
      const configFilename = `${dirname}/${configFile}`;
      config.serviceAccount = require(configFilename);
      // console.log(
      //   'Service account:',
      //   config.serviceAccount,
      // );
      strapi.firebase.admin = config;
      console.log(
        `Firebase admin ${util.inspect(
          serviceId,
        )} configuration is valid!`,
      );
    } catch (err) {
      strapi.log.error(
        `Firebase admin got disabled or configuration is invalid!`,
      );
    }
  },
};
