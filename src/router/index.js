import { createRouter, createWebHistory } from 'vue-router';
import { auth_store } from '@/stores/modules/auth.store';

const router = createRouter({
  mode: 'history',
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: { name: 'Discovery' } },
    {
      path: '/apps',
      component: () => import('@/views/Apps/index.vue'),
      children: [
        {
          name: 'Discovery',
          path: 'discovery',
          component: () => import('@/views/Discovery/index.vue'),
        },
        {
          name: 'Apps',
          path: 'my',
          component: () => import('@/views/MyApps/index.vue'),
        },
        {
          name: 'Other Apps',
          path: 'other-apps',
          component: () => import('@/views/OtherApps/index.vue'),
        },
        {
          name: 'App Details',
          path: '/:appCode/details',
          component: () => import('@/views/AppDetails/index.vue'),
        },
      ],
    },
    {
      name: 'Insights',
      path: '/insights',
      component: () => import('@/views/Insights/index.vue'),
    },
    {
      path: '/apps/my/:appCode/:appUuid/templates',
      component: () => import('@/views/whatsAppTemplates/Base.vue'),
      children: [
        {
          name: 'WhatsApp Templates Table',
          path: '',
          component: () => import('@/views/whatsAppTemplates/Table.vue'),
          meta: {
            crumb_title: 'WhatsApp.templates.table.crumb_title',
          },
          children: [
            {
              name: 'Create Template',
              path: 'create',
              component: () => import('@/views/whatsAppTemplates/Form.vue'),
              meta: {
                crumb_title: 'WhatsApp.templates.create_form.crumb_title',
              },
            },
            {
              name: 'Edit Template',
              path: 'edit/:templateUuid',
              component: () => import('@/views/whatsAppTemplates/Form.vue'),
              meta: {
                crumb_title: 'WhatsApp.templates.edit_form.crumb_title',
              },
            },
            {
              name: 'Template Details',
              path: 'template-details',
              component: () => import('@/views/TemplateDetails/index.vue'),
              meta: {
                crumb_title: 'WhatsApp.template_details.crumbs.template_details',
              },
            },
          ],
        },
      ],
    },
    {
      path: '/apps/my/:appCode/:appUuid/catalogs',
      component: () => import('@/views/whatsAppCatalogs/Base.vue'),
      children: [
        {
          name: 'WhatsApp Catalogs List',
          path: '',
          component: () => import('@/views/whatsAppCatalogs/List.vue'),
          meta: {
            crumb_title: 'WhatsApp.catalog.list.title',
          },
          children: [
            {
              name: 'WhatsApp Catalog Products',
              path: ':catalogUuid/products',
              component: () => import('@/views/whatsAppCatalogs/CatalogProducts.vue'),
              meta: {
                crumb_title: 'WhatsApp.catalog.products.title',
              },
              props: (route) => {
                return {
                  catalogName: route.query.catalogName,
                };
              },
            },
          ],
        },
      ],
    },
    {
      path: '/loginexternal/:token/:project/:flowOrg',
      name: 'externalLogin',
      component: null,
      beforeEnter: (to, from, next) => {
        const { token, project, flowOrg } = to.params;
        auth_store().externalLogin({ token: token.replace('+', ' ') });
        auth_store().selectedProject({ project });
        auth_store().selectedFlowOrg({ flowOrg });
        if (to.query.next) {
          next(to.query.next);
        } else {
          next();
        }
      },
    },
  ],
});

// function authGuard(to) {
//   const { token, project, flowOrg } = to.params;
//   auth_store().externalLogin({ token: token.replace('+', ' ') });
//   auth_store().selectedProject({ project });
//   auth_store().selectedFlowOrg({ flowOrg });
//   if (to.query.next) {
//     return { path: to.query.next };
//   } else {
//     // next({name: 'Discovery'});
//     return { path: '/apps/discovery' };
//   }
// }

router.afterEach(() => {
  window.parent.postMessage(
    {
      event: 'changePathname',
      pathname: window.location.pathname,
    },
    '*',
  );
});

export default router;
