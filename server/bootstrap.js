'use strict';

// console.log('Firebase admin bootstrap..');

module.exports = async ({ strapi }) => {
  const { admin } = strapi.firebase;
  try {
    // strapi.log.info('Loading Firebase admin..');
    if (
      await strapi
        .plugin('firebase-admin')
        .controller('admin')
        .init(admin)
    ) {
      strapi.log.debug(
        `Firebase admin handler initialized: ${strapi.inspect(
          admin.serviceId,
        )}`,
      );

      if (admin.test) {
        // Send test message in background..
        setTimeout(async () => {
          console.log('Sending test message..');
          let { fcmToken, title, body } = admin.test;
          title = `Hello!`;
          body = `Hello, ${admin.configId} just got alive!`;
          strapi
            .plugin('firebase-admin')
            .controller('admin')
            .send(fcmToken, title, body, {});
        }, 2000);
      }
    }
    // strapi.log.info('Firebase admin loaded!');
  } catch (err) {
    strapi.log.error(err);
  }
  strapi.log.info(
    `Bootstrapped Firebase admin: ${strapi.inspect(
      admin.serviceId,
    )}`,
  );
};
