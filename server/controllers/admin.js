'use strict';

const firebaseAdmin = require('firebase-admin');

// const { initializeApp } = require('firebase/app');
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
    //
    // Setup Firebase client (for testing purpose only)..
    //
    // try {
    //   strapi.log.info('Loading Firebase client..');
    //   const firebaseConfig = {
    //     apiKey: 'AIzaSyAumho1hBXOQoG0DwA6fJh2JDTD1JnG7Z8',
    //     authDomain: 'ngirim.firebaseapp.com',
    //     projectId: 'ngirim',
    //     storageBucket: 'ngirim.appspot.com',
    //     messagingSenderId: '682293669215',
    //     appId: '1:682293669215:web:01c4ce01f37087876a1aea',
    //     measurementId: 'G-FY7TM0HBHY',
    //   };
    //   const firebaseApp = initializeApp(firebaseConfig);
    //   // Option 1. If used for foreground messaging..
    //   // const messaging = getMessaging(firebaseApp);
    //   // onMessage(messaging, payload => {
    //   //   console.log(
    //   //     'Message received on foreground.',
    //   //     payload,
    //   //   );
    //   //   // ...
    //   // });
    //   // Option 2. If used for service-worker messaging..
    //   // const messaging = getMessaging();
    //   // onBackgroundMessage(messaging, payload => {
    //   //   console.log(
    //   //     '[firebase-messaging-sw.js] Received background message ',
    //   //     payload,
    //   //   );
    //   //   // Customize notification here
    //   //   // const notificationTitle = 'Background Message Title';
    //   //   // const notificationOptions = {
    //   //   //   body: 'Background Message body.',
    //   //   //   icon: '/firebase-logo.png',
    //   //   // };
    //   //   // self.registration.showNotification(
    //   //   //   notificationTitle,
    //   //   //   notificationOptions,
    //   //   // );
    //   //   // ...
    //   // });
    //   strapi.log.info('Firebase client loaded!');
    // } catch (err) {
    //   strapi.log.error(err);
    // }

    let { clientId, configFile, test } = config;
    const dirname = strapi.dirs.dist.src;
    const configFilename = `${dirname}/${configFile}`;
    config.serviceAccount = require(configFilename);
    console.log('Service account:', config.serviceAccount);

    strapi.firebase.admin = firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(
        config.serviceAccount,
      ),
    });
    if (test) {
      // Send test message in background..
      setTimeout(async () => {
        console.log('Sending test message..');
        let { token, title, body } = test;
        title = `Hello!`;
        body = `Hello, ${clientId} just got alive!`;
        strapi
          .plugin('firebase-admin')
          .controller('admin')
          .send(token, title, body, {});
      }, 2000);
    }

    return strapi.firebase.admin;
  },
  deinit: async () => {},
  send: async (token, title, body, data = undefined) => {
    console.log('--send', token);

    const message = {
      token,
      notification: {
        title,
        body,
      },
      data,
    };
    await strapi.firebase.admin
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
        throw err;
      });

    return 'ok';
  },
});
