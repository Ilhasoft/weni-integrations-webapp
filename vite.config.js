import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Discovery from '@/components/Discovery.vue';

describe('Discovery.vue', () => {
  it('matches the snapshot', () => {
    const wrapper = mount(Discovery, {
      global: {
        mocks: {
          $t: (msg) => msg,
          $route: {
            query: {}
          }
        }
      },
      data() {
        return {
          searchTerm: '',
          channels: {
            loading: true,
            data: null,
          },
          biApps: [
            {
              code: 'power-bi',
              name: 'Power BI',
              category: 'bi-tools',
              config_design: 'sidebar',
              description: 'PowerBi.data.description',
              summary: 'PowerBi.data.summary',
              icon: '',
            },
          ],
        };
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
