# ypei-library

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## A3 cloud configuration

Copy `.env.example` to `.env.local` and set `VITE_ALIYUN_FUNCTION_URL` to an Alibaba Cloud Function Compute/API Gateway endpoint. The endpoint accepts `{ action, payload }` and is used for appointment confirmation email and the resource assistant. Keep Alibaba credentials in the server-side function; never place access keys in this Vue application.

The app includes local demo fallbacks so the appointment, export, map and assistant workflows remain demonstrable before cloud credentials are configured. Upload the generated `dist` folder to Alibaba Cloud OSS static website hosting, enable HTTPS, and configure SPA fallback so unknown routes serve `index.html`.

### A3 feature map

- D2/E1: `src/services/cloud.js` calls the serverless endpoint for email and assistant actions.
- D3: Admin has interactive user and appointment tables with sorting, pagination and CSV export.
- E2: `ServicesView.vue` provides service search, geolocation and map directions.
- E3/F3: keyboard focus styles, labelled forms, responsive layout and production Service Worker caching.
- E4: appointment and user records can be exported as CSV without passwords.
- F1/F2/F4: appointment booking, live admin activity metrics and the resource assistant.
