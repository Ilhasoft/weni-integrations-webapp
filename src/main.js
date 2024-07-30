import { createApp, markRaw } from 'vue';
import { createPinia } from 'pinia';
import Unnnic from '@weni/unnnic-system';
import '@weni/unnnic-system/dist/style.css';
import i18n from './utils/plugins/i18n';
import * as vueUse from '@vueuse/components';
import * as Sentry from '@sentry/vue';
import getEnv from '@/utils/env';
import { makeServer } from '@/miragejs/server';

import App from './App.vue';
import router from './router';

const app = createApp(App);
const pinia = createPinia();

app.config.productionTip = false;

if (getEnv('NODE_ENV') === 'development') {
  makeServer();
}

if (getEnv('VITE_APP_USE_SENTRY') && getEnv('VITE_APP_SENTRY_DSN')) {
  Sentry.init({
    dsn: getEnv('VITE_APP_SENTRY_DSN'),
    integrations: [Sentry.browserTracingIntegration({ router }), Sentry.replayIntegration()],
    logErrors: true,
  });
}
pinia.use(({ store }) => {
  store.router = markRaw(router);
});

app.use(Unnnic);
app.use(pinia);
app.use(router);
app.use(i18n);
app.use(vueUse);

app.mount('#app');
