# 🚀 Getting started with Strapi

Wrapper for google-wombot's [Firebase Admin Node.js SDK](https://www.npmjs.com/package/firebase-admin) library to be used with Strapi apps. You are going to need a Google Firebase service account credential file (for more information, head on to https://firebase.google.com/). The Strapi app will be able to send push notification to clients reporting their FCM token, do analytics and stuff.
<br/>
Note: As of the time of writing this document, only the push notification has been implemented.
<br/>
Save the FCM token of each client on login, register, or some other onboarding scheme you may have setup.
<br/><br/>

### `Installation`

Add the library to your Strapi project. [Learn more](https://www.npmjs.com/package/@indoomni/strapi-plugin-firebase-admin)

```

yarn add @indoomni/strapi-plugin-firebase-admin
yarn install
yarn build

```

<br/>

### `Configuration`

Add the following configuration attributes to your **server.js**.

```

# config/server.js or config/env/**/server.js
# -------------------------------------------

module.exports = ({ env }) => ({
  host: env('HOST'),
  port: env.int('PORT'),
  app: {
    env: env('ENV'),
    name: env('APP_NAME'),
    keys: env.array('APP_KEYS'),
  },
  // ...
  'firebase-admin': {
    enabled: true,
    config: {
      configFile: '../service-account.json',
      serviceId: `${env('APP_NAME')}_${env('ENV')}_fcm`,
      services: ['notification'],
      tags: [],
      test: {
        fcmToken: 'xyz123',
        title: 'Hello!',
        body: 'Hello world!',
      },
    },
  },
  // ...
});

```

Notice **config** sub-attribute in the the **'firebase-admin'** attribute. Don't forget to use the single-quotation marks.

Now, notice the **configFile** attribute. Your service account JSON file should reside on the root of your project (add "../" since we use "src" for the base directory). The other attributes are currently ignored and supplied for future development. If you supply a **test** attribute, the library will try to send a message to the said token after initialized.

<br/>

### `How to send messages`

Anywhere in your code, write as in the following snippet. Refer to the **admin** controller inside the library, and call **send** function. Supply a client's FCM token, title, body and data if necessary.
<br/>
Note: _If_ you specify [data], it will be encrypted as Base64 string. At your client app's side, when you receive the notification, **decode** the data using some Base64 encryption, then use the data as needed.

```

# src/**/any.js
# ------------------------------

// ...
try {
  await strapi
    .plugin('firebase-admin')
    .controller('admin')
    .send(token, title, body, data);
} catch (err) {
  strapi.log.debug('📺: ', err);
}
// ...

```

<br/>

## 📚 Learn more

- [Firebase Admin Node.js SDK](https://www.npmjs.com/package/firebase-admin) - google-wombot's excellent Firebase Admin Node.ks SDK library page on npmjs.com.
- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Google Firebase product page](https://firebase.google.com/)

<br/>

---

<sub>Feel free to check out my [GitHub repository](https://github.com/indoomni/strapi-plugin-firebase-admin). Your feedback and contributions are welcome!</sub>
