import { unnnicCallAlert as mockUnnnicCallAlert } from '@weni/unnnic-system';

jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import Setup from '@/components/config/ecommerce/vtex/Setup.vue';
import i18n from '@/utils/plugins/i18n';
import { singleApp } from '../../../../../__mocks__/appMock';
import '@weni/unnnic-system';

const localVue = createLocalVue();
localVue.use(Vuex);

const mountComponent = async ({
  errorConfiguredApps = false,
  errorCreateApp = false,
  multipleConfigured = false,
} = {}) => {
  let configuredApps = [
    {
      ...singleApp,
      code: 'wpp-cloud',
      config: { wa_certified_name: 'wpp name', title: 'wpp title' },
    },
  ];

  if (multipleConfigured) {
    configuredApps.push({
      ...singleApp,
      code: 'wpp-cloud',
      config: { wa_certified_name: 'wpp name', title: 'wpp title' },
    });
  }

  const state = {
    auth: {
      project: '123',
    },
    myApps: {
      configuredApps,
      loadingConfiguredApps: false,
      errorConfiguredApps,
    },
    appType: {
      loadingCreateApp: false,
      errorCreateApp,
    },
  };

  const actions = {
    createApp: jest.fn(),
    getConfiguredApps: jest.fn(),
  };

  const store = new Vuex.Store({
    state,
    actions,
  });

  const wrapper = mount(Setup, {
    localVue,
    i18n,
    store,
    propsData: {
      app: {
        ...singleApp,
        code: 'vtex',
      },
    },
  });

  await wrapper.vm.$nextTick();

  return { wrapper, state, actions };
};

describe('components/config/ecommerce/vtex/Setup.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', async () => {
    const { wrapper } = await mountComponent();
    expect(wrapper).toMatchSnapshot();
  });

  it('should call error modal if failing to get configured apps', async () => {
    const { wrapper } = await mountComponent({ errorConfiguredApps: true });

    await wrapper.vm.$nextTick();

    expect(mockUnnnicCallAlert).toHaveBeenCalledWith({
      props: {
        text: 'We were not able to fetch your configured apps, please try again later.',
        title: 'Error',
        icon: 'alert-circle-1',
        scheme: 'feedback-red',
        closeText: 'Close',
        position: 'bottom-right',
      },
      seconds: 6,
    });

    expect(wrapper.emitted('closePopUp')).toBeTruthy();
  });

  it('should close popup', async () => {
    const { wrapper } = await mountComponent({ multipleConfigured: true });

    const closeButton = wrapper.findComponent({ ref: 'unnnic-vtex-modal-close-button' });
    await closeButton.trigger('click');

    expect(wrapper.emitted('closePopUp')).toBeTruthy();
  });

  it('should setup vtex with correct information', async () => {
    const { wrapper, actions } = await mountComponent();

    wrapper.vm.subdomain = 'https://weni.ai';
    wrapper.vm.appKey = 'key';
    wrapper.vm.appToken = 'token';
    wrapper.vm.selectedChannel = [{ value: '456' }];

    const setupButton = wrapper.findComponent({ ref: 'unnnic-vtex-modal-setup-button' });
    await setupButton.trigger('click');

    expect(actions.createApp).toHaveBeenCalledWith(expect.anything(), {
      code: 'vtex',
      payload: {
        project_uuid: '123',
        domain: 'https://weni.ai',
        app_key: 'key',
        app_token: 'token',
        whatsapp_channel_uuid: '456',
      },
    });
  });

  it('should call error modal with invalid credentials information on create error', async () => {
    const { wrapper } = await mountComponent({
      errorCreateApp: {
        response: { status: 400, data: { detail: 'The credentials provided are invalid.' } },
      },
    });

    wrapper.vm.selectedChannel = [{ value: '456' }];

    const setupButton = wrapper.findComponent({ ref: 'unnnic-vtex-modal-setup-button' });
    await setupButton.trigger('click');

    await wrapper.vm.$nextTick();

    expect(mockUnnnicCallAlert).toHaveBeenCalledWith({
      props: {
        text: 'Invalid credentials for the given subdomain',
        title: 'Error',
        icon: 'alert-circle-1',
        scheme: 'feedback-red',
        closeText: 'Close',
        position: 'bottom-right',
      },
      seconds: 6,
    });
  });

  it('should call default error on unknown create error', async () => {
    const { wrapper } = await mountComponent({
      errorCreateApp: {
        response: { status: 400, data: { detail: 'Unknown error' } },
      },
    });

    wrapper.vm.selectedChannel = [{ value: '456' }];

    const setupButton = wrapper.findComponent({ ref: 'unnnic-vtex-modal-setup-button' });
    await setupButton.trigger('click');

    await wrapper.vm.$nextTick();

    expect(mockUnnnicCallAlert).toHaveBeenCalledWith({
      props: {
        text: 'An error occurred while trying to integrate with VTEX, please try again later',
        title: 'Error',
        icon: 'alert-circle-1',
        scheme: 'feedback-red',
        closeText: 'Close',
        position: 'bottom-right',
      },
      seconds: 6,
    });
  });

  describe('callModal', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call unnnicCallAlert with Success state', async () => {
      const { wrapper } = await mountComponent();

      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();

      wrapper.vm.callModal({ text: 'success', type: 'Success' });

      expect(mockUnnnicCallAlert).toHaveBeenCalledWith({
        props: {
          text: 'success',
          title: 'Success',
          icon: 'check-circle-1-1',
          scheme: 'feedback-green',
          closeText: 'Close',
          position: 'bottom-right',
        },
        seconds: 6,
      });
    });

    it('should call unnnicCallAlert with Error state', async () => {
      const { wrapper } = await mountComponent();

      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();

      wrapper.vm.callModal({ text: 'error', type: 'Error' });

      expect(mockUnnnicCallAlert).toHaveBeenCalledWith({
        props: {
          text: 'error',
          title: 'Error',
          icon: 'alert-circle-1',
          scheme: 'feedback-red',
          closeText: 'Close',
          position: 'bottom-right',
        },
        seconds: 6,
      });
    });
  });
});
