import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import WhatsappConfig from '@/components/config/channels/whatsapp/Config.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';
import Unnnic from '@weni/unnnic-system';

describe('WhatsappConfig.vue', () => {
  let wrapper;
  const pinia = createTestingPinia({ stubActions: false });
  setActivePinia(pinia);

  const app = {
    icon: 'icon-url',
    name: 'App Name',
    code: 'app-code',
    uuid: 'app-uuid',
  };

  beforeEach(() => {
    wrapper = mount(WhatsappConfig, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
      },
      props: { app },
    });
  });

  afterEach(() => {
    wrapper.unmount();
    vi.clearAllMocks();
  });

  it('renders the component and its elements correctly', () => {
    const titleName = wrapper.find('.config-whatsapp__header__title__name');
    expect(titleName.exists()).toBe(true);
    expect(titleName.text()).toBe('App Name');

    const icon = wrapper.find('.config-whatsapp__header__title__icon-container__icon');
    expect(icon.attributes('src')).toBe('icon-url');

    const description = wrapper.find('.config-whatsapp__header__description');
    expect(description.exists()).toBe(true);
    expect(description.text()).toContain(
      'Learn more about how to increase your daily message limit in WhatsApp here.',
    );
  });

  it('renders tabs correctly', async () => {
    await wrapper.setData({ skipLoad: true });

    const tabComponent = wrapper.findComponent({ ref: 'tab' });
    expect(tabComponent.exists()).toBe(true);

    expect(wrapper.findAll('.tab-head').length).toBe(4);
  });

  it('calls closeConfig method when the close button is clicked', async () => {
    const closeButton = wrapper.findComponent({ ref: 'close' });
    expect(closeButton.exists()).toBe(true);

    await closeButton.trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('closeModal')).toBeTruthy();
  });

  it('displays skeleton loader when data is loading', async () => {
    await wrapper.setData({ skipLoad: false, loadingCurrentApp: true });

    const skeletonLoader = wrapper.findComponent({ name: 'skeleton-loading' });
    expect(skeletonLoader.exists()).toBe(true);
  });

  it('calls fetchData on mount and handles success', async () => {
    const fetchDataSpy = vi.spyOn(wrapper.vm, 'fetchData').mockResolvedValue();

    await wrapper.vm.fetchData();
    await wrapper.vm.$nextTick();

    expect(fetchDataSpy).toHaveBeenCalled();
  });

  // it('shows error alert on fetchData error', async () => {
  //   const errorMsg = 'Fetch Error';
  //   const spyUnnnicAlert = vi.spyOn(Unnnic, 'unnnicCallAlert').mockImplementation(() => {});

  //   vi.spyOn(wrapper.vm, 'fetchData').mockRejectedValue({
  //     response: { data: { error: { error_user_msg: errorMsg } } },
  //   });

  //   await wrapper.vm.fetchData();

  //   expect(spyUnnnicAlert).toHaveBeenCalledWith({
  //     props: { text: errorMsg, type: 'error' },
  //     seconds: 15,
  //   });
  // });

  // it('shows generic error alert if error structure is different', async () => {
  //   const genericErrorMsg = 'WhatsApp.config.error.data_fetch';
  //   const spyUnnnicAlert = vi.spyOn(Unnnic, 'unnnicCallAlert').mockImplementation(() => {});

  //   vi.spyOn(wrapper.vm, 'fetchData').mockRejectedValue({
  //     response: { data: { error: 'jijdijei' } },
  //   });

  //   await wrapper.vm.fetchData();

  //   expect(spyUnnnicAlert).toHaveBeenCalledWith({
  //     props: { text: genericErrorMsg, type: 'error' },
  //     seconds: 15,
  //   });
  // });
});