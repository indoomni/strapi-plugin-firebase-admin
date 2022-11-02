'use strict';

const util = require('util');

// console.log('Firebase config..');
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
    try {
      const { clientId, configFile } = config;
      const dirname = strapi.dirs.dist.src;
      const configFilename = `${dirname}/${configFile}`;
      require(configFilename);

      console.log(
        `Firebase admin ${util.inspect(
          clientId,
        )} configuration is valid!`,
      );

      // Everything's okay!
      strapi.firebase = {
        config,
        admin: undefined,
      };
    } catch (err) {
      strapi.log.warn(
        `Firebase admin got disabled or configuration is invalid!`,
      );
    }
  },
};
