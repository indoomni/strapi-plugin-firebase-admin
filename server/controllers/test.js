'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('firebase-admin')
      .service('test')
      .doSomething('Welcome to Strapi 🚀');
  },
});
