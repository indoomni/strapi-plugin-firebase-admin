'use strict';

const firebaseAdmin = require('firebase-admin');
// Firebase client - Option 1. If used for foreground messaging..
// const {
//   getMessaging,
//   onMessage,
// } = require('firebase/messaging');
// Firebase client - Option 2. If used for service-worker messaging..
// const {
//   getMessaging,
//   onBackgroundMessage,
// } = require('firebase/messaging/sw');

module.exports = ({ strapi }) => ({
  init: async config => {
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(
        config.serviceAccount,
      ),
    });
    return (strapi.firebase.handler = firebaseAdmin);
  },
  deinit: async () => {},
  send: async (token, title, body, data) => {
    console.log('--send', token);
    if (!token) return;

    try {
      const message = {
        token,
        notification: {
          title,
          body,
        },
        data,
      };
      await strapi.firebase.handler
        .messaging()
        .send(message)
        .then(res => {
          console.log(
            `Sent push notification:`,
            strapi.inspect(res),
          );
        })
        .catch(err => {
          console.log(
            `Error sending push notification: ${err.codePrefix}`,
            strapi.inspect(err.errorInfo),
          );
        });
    } catch (err) {
      strapi.log.debug('📺: ', err);
    }

    return 'ok';
  },
});
