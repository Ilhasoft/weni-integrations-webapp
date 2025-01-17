import { defineStore } from 'pinia';
import whatsApp from '@/api/appType/whatsapp';
import { captureSentryException } from '@/utils/sentry';

export const whatsapp_store = defineStore('whatsapp', {
  state() {
    return {
      contactInfo: {},
      fetchedContactInfo: false,
      loadingContactInfo: false,

      whatsAppConversations: {
        business_initiated: 0,
        user_initiated: 0,
        total: 0,
      },
      loadingConversations: false,
      errorConversations: false,

      whatsAppProfile: null,
      loadingWhatsAppProfile: false,
      errorWhatsAppProfile: false,

      updateWhatsAppProfileResult: null,
      loadingUpdateWhatsAppProfile: false,
      errorUpdateWhatsAppProfile: false,

      deleteWhatsAppProfilePhotoResult: null,
      loadingDeleteWhatsAppProfilePhoto: false,
      errorDeleteWhatsAppProfilePhoto: false,

      whatsAppTemplates: null,
      loadingWhatsAppTemplates: false,
      errorWhatsAppTemplates: false,

      templateForm: {
        name: null,
        category: null,
      },
      templateTranslationForms: {},
      templateTranslationSelectedForm: null,

      whatsAppTemplate: null,
      loadingFetchWhatsAppTemplate: false,
      errorFetchWhatsAppTemplate: false,

      whatsAppTemplateSelectLanguages: null,
      loadingFetchWhatsAppTemplateSelectLanguages: false,
      errorFetchWhatsAppTemplateSelectLanguages: false,

      createdTemplateData: null,
      loadingCreateTemplate: false,
      errorCreateTemplate: false,

      createdTemplateTranslationData: null,
      loadingCreateTemplateTranslation: false,
      errorCreateTemplateTranslation: false,

      updatedTemplateTranslationData: null,
      loadingUpdateTemplateTranslation: false,
      errorUpdateTemplateTranslation: false,

      loadingUpdateWebhookInfo: false,
      errorUpdateWebhookInfo: null,
      updateWebhookInfoData: null,
    };
  },
  getters: {
    getContactInfo(state) {
      return state.contactInfo;
    },
    getFetchedContactInfo(state) {
      return state.fetchedContactInfo;
    },
    getLoadingContactInfo(state) {
      return state.loadingContactInfo;
    },
    templateTranslationCurrentForm(state) {
      return state.templateTranslationForms[state.templateTranslationSelectedForm] || {};
    },
  },
  actions: {
    setTemplateTranslationCurrentFormFooter(value) {
      this.templateTranslationCurrentForm.footer = value;
    },
    resetWppFetchResults() {
      this.fetchedContactInfo = false;
    },
    resetTemplates() {
      this.templateTranslationForms = {};
      this.templateForm = {
        name: null,
        category: null,
      };
    },
    async fetchWppContactInfo({ code, appUuid }) {
      this.loadingContactInfo = true;
      this.fetchedContactInfo = false;
      try {
        const data = await whatsApp.fetchWppContactInfo(code, appUuid);
        this.contactInfo = data;
        this.fetchedContactInfo = true;
      } catch (err) {
        captureSentryException(err);
        this.fetchedContactInfo = false;
      } finally {
        this.loadingContactInfo = false;
      }
    },
    async updateWppContactInfo({ code, appUuid, payload }) {
      const { data } = await whatsApp.updateWppContactInfo(code, appUuid, payload);
      this.contactInfo = data;
    },
    async getConversations({ code, appUuid, params }) {
      this.loadingConversations = true;
      this.whatsAppConversations = null;
      this.errorConversations = null;
      try {
        const { data } = await whatsApp.getConversations(code, appUuid, params);
        this.whatsAppConversations = data;
        this.loadingConversations = false;
      } catch (err) {
        captureSentryException(err);
        this.errorConversations = err.response?.data.error || err;
        this.loadingConversations = false;
      }
    },
    async requestConversationsReport({ code, appUuid, params }) {
      this.loadingConversationsReport = true;
      this.reportResult = null;
      this.errorConversationsReport = null;
      try {
        const { data } = await whatsApp.requestConversationsReport(code, appUuid, params);
        this.reportResult = data;
        this.loadingConversationsReport = false;
      } catch (err) {
        captureSentryException(err);
        this.errorConversationsReport = err.response?.data.error || err;
        this.loadingConversationsReport = false;
      }
    },
    async fetchWppProfile({ code, appUuid }) {
      this.loadingWhatsAppProfile = true;
      this.whatsAppProfile = null;
      this.errorWhatsAppProfile = null;
      try {
        const { data } = await whatsApp.fetchWppProfile(code, appUuid);
        this.whatsAppProfile = data;
        this.loadingWhatsAppProfile = false;
      } catch (err) {
        captureSentryException(err);
        this.errorWhatsAppProfile = err.response?.data.error || err;
        this.loadingWhatsAppProfile = false;
      }
    },
    async updateWppProfile({ code, appUuid, payload }) {
      this.loadingUpdateWhatsAppProfile = true;
      this.updateWhatsAppProfileResult = null;
      this.errorUpdateWhatsAppProfile = null;
      try {
        const { data } = await whatsApp.updateWppProfile(code, appUuid, payload);
        this.updateWhatsAppProfileResult = data;
        this.loadingUpdateWhatsAppProfile = false;
      } catch (err) {
        captureSentryException(err);
        this.errorUpdateWhatsAppProfile = err.response?.data.error || err;
        this.loadingUpdateWhatsAppProfile = false;
      }
    },
    async deleteWppProfilePhoto({ code, appUuid }) {
      this.loadingDeleteWhatsAppProfilePhoto = true;
      this.deleteWhatsAppProfilePhotoResult = null;
      this.errorDeleteWhatsAppProfilePhoto = null;
      try {
        const { data } = await whatsApp.deleteWppProfilePhoto(code, appUuid);
        this.deleteWhatsAppProfilePhotoResult = data;
        this.loadingDeleteWhatsAppProfilePhoto = false;
      } catch (err) {
        captureSentryException(err);
        this.errorDeleteWhatsAppProfilePhoto = err.response?.data.error || err;
        this.loadingDeleteWhatsAppProfilePhoto = false;
      }
    },
    async getWhatsAppTemplates({ appUuid, params }) {
      this.loadingWhatsAppTemplates = true;
      this.errorWhatsAppTemplates = null;
      try {
        const data = await whatsApp.getWhatsAppTemplates(appUuid, params);
        this.whatsAppTemplates = data;
        this.loadingWhatsAppTemplates = false;
      } catch (err) {
        captureSentryException(err);
        this.errorWhatsAppTemplates = err.response?.data.error || err;
        this.loadingWhatsAppTemplates = false;
      }
    },
    updateTemplateForm({ fieldName, fieldValue }) {
      const updatedForm = this.templateForm;
      updatedForm[fieldName] = fieldValue;
      this.templateForm = { ...updatedForm };
    },
    addNewTranslationForm({ formName, formData }) {
      this.templateTranslationForms[formName] = formData;
    },
    renameTemplateTranslationForm({ currentName, newName }) {
      this.templateTranslationForms[newName] = this.templateTranslationForms[currentName];
      delete this.templateTranslationForms[currentName];
      this.templateTranslationSelectedForm = newName;
    },
    updateTemplateTranslationForm({ formName, fieldName, fieldValue }) {
      const updatedForms = this.templateTranslationForms;
      if (!updatedForms[formName]) {
        updatedForms[formName] = {};
      }
      if (Array.isArray(fieldValue)) {
        updatedForms[formName][fieldName] = [...fieldValue];
      } else if (typeof fieldValue === 'object' && fieldValue !== null) {
        updatedForms[formName][fieldName] = { ...fieldValue };
      } else {
        updatedForms[formName][fieldName] = fieldValue;
      }

      this.templateTranslationForms = { ...updatedForms };
    },
    setTemplateTranslationSelectedForm({ formName }) {
      this.templateTranslationSelectedForm = formName;
    },
    clearAllTemplateFormData() {
      this.templateForm = {};
      this.templateTranslationForms = {};
      this.templateTranslationSelectedForm = null;
    },
    clearTemplateData() {
      this.whatsAppTemplate = null;
      this.errorFetchWhatsAppTemplate = null;
    },
    async fetchTemplateData({ appUuid, templateUuid }) {
      this.loadingFetchWhatsAppTemplate = true;
      this.errorFetchWhatsAppTemplate = null;
      try {
        const data = await whatsApp.fetchTemplateData(appUuid, templateUuid);
        this.whatsAppTemplate = data;
        this.loadingFetchWhatsAppTemplate = false;
      } catch (err) {
        captureSentryException(err);
        this.errorFetchWhatsAppTemplate = err.response?.data.error || err;
        this.loadingFetchWhatsAppTemplate = false;
      }
    },
    async fetchSelectLanguages({ appUuid }) {
      this.loadingFetchWhatsAppTemplateSelectLanguages = true;
      this.errorFetchWhatsAppTemplateSelectLanguages = null;
      try {
        const data = await whatsApp.fetchSelectLanguages(appUuid);
        const formattedData = [];
        for (const language in data) {
          formattedData.push({ value: language, text: data[language] });
        }
        this.whatsAppTemplateSelectLanguages = formattedData;
        this.loadingFetchWhatsAppTemplateSelectLanguages = false;
      } catch (err) {
        captureSentryException(err);
        this.errorFetchWhatsAppTemplateSelectLanguages = err.response?.data.error || err;
        this.loadingFetchWhatsAppTemplateSelectLanguages = false;
      }
    },
    async createTemplate({ appUuid, payload }) {
      this.loadingCreateTemplate = true;
      this.createdTemplateData = null;
      this.errorCreateTemplate = null;
      try {
        const data = await whatsApp.createTemplate(appUuid, payload);
        this.createdTemplateData = data;
        this.loadingCreateTemplate = false;
      } catch (err) {
        captureSentryException(err);
        this.errorCreateTemplate = err.response?.data.error || err;
        this.loadingCreateTemplate = false;
      }
    },
    async createTemplateTranslation({ appUuid, templateUuid, payload }) {
      this.loadingCreateTemplateTranslation = true;
      this.createdTemplateTranslationData = null;
      this.errorCreateTemplateTranslation = null;
      try {
        const data = await whatsApp.createTemplateTranslation(appUuid, templateUuid, payload);
        this.createdTemplateTranslationData = data;
        this.loadingCreateTemplateTranslation = false;
      } catch (err) {
        captureSentryException(err);
        this.errorCreateTemplateTranslation = err.response?.data.error || err;
        this.loadingCreateTemplateTranslation = false;
      }
    },
    async updateTemplateTranslation({ appUuid, templateUuid, payload }) {
      this.loadingUpdateTemplateTranslation = true;
      this.updatedTemplateTranslationData = null;
      this.errorUpdateTemplateTranslation = null;
      try {
        const { data } = await whatsApp.updateTemplateTranslation(appUuid, templateUuid, payload);
        this.updatedTemplateTranslationData = data;
        this.loadingUpdateTemplateTranslation = false;
      } catch (err) {
        captureSentryException(err);
        this.errorUpdateTemplateTranslation = err.response?.data.error || err;
        this.loadingUpdateTemplateTranslation = false;
      }
    },
    async deleteTemplateMessage({ appUuid, templateUuid }) {
      this.loadingDeleteTemplateMessage = true;
      this.deletedTemplateMessageData = null;
      this.errorDeleteTemplateMessage = null;
      try {
        const { data } = await whatsApp.deleteTemplateMessage(appUuid, templateUuid);
        this.deletedTemplateMessageData = data;
        this.loadingDeleteTemplateMessage = false;
      } catch (err) {
        captureSentryException(err);
        this.errorDeleteTemplateMessage = err.response?.data.error || err;
        this.loadingDeleteTemplateMessage = false;
      }
    },
    async updateWppWebhookInfo({ code, appUuid, payload }) {
      this.loadingUpdateWebhookInfo = true;
      this.errorUpdateWebhookInfo = null;
      this.updateWebhookInfoData = null;
      try {
        const { data } = await whatsApp.updateWppWebhookInfo(code, appUuid, payload);
        this.updateWebhookInfoData = data;
        this.loadingUpdateWebhookInfo = false;
      } catch (err) {
        captureSentryException(err);
        this.errorUpdateWebhookInfo = err.response?.data.error || err;
        this.loadingUpdateWebhookInfo = false;
      }
    },
  },
});
