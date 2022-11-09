'use strict';

// console.log('Firebase bootstrap..');

module.exports = async ({ strapi }) => {
  try {
    const { config, admin } = strapi.firebase;

    if (
      strapi
        .plugin('firebase-admin')
        .controller('admin')
        .init(config)
    ) {
      // Do anything..?
    }

    strapi.log.info(
      `Bootstrapped Firebase admin: ${strapi.inspect(
        config.clientId,
      )}`,
    );
  } catch (err) {
    strapi.log.info('Firebase admin not bootstrapped!');
  }
};
