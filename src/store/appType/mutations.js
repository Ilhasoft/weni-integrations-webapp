export default {
  GET_ALL_APP_TYPES_REQUEST(state) {
    state.loadingAllAppTypes = true;
    state.errorAllAppTypes = null;
    state.allAppTypes = null;
  },
  GET_ALL_APP_TYPES_SUCCESS(state, data) {
    state.allAppTypes = data;
    state.loadingAllAppTypes = false;
  },
  GET_ALL_APP_TYPES_ERROR(state, err) {
    state.errorAllAppTypes = err;
  },

  GET_APP_TYPE_REQUEST(state, shouldLoad) {
    if (shouldLoad) {
      state.loadingCurrentAppType = true;
      state.currentAppType = null;
    }
    state.errorCurrentAppType = null;
  },
  GET_APP_TYPE_SUCCESS(state, data) {
    state.currentAppType = data;
    state.loadingCurrentAppType = false;
  },
  GET_APP_TYPE_ERROR(state, err) {
    state.errorCurrentAppType = err;
    state.loadingCurrentAppType = false;
  },

  POST_RATING_REQUEST(state) {
    state.loadingPostRating = true;
    state.errorPostRating = null;
    state.postRatingResult = null;
  },
  POST_RATING_SUCCESS(state, data) {
    state.postRatingResult = data;
    state.loadingPostRating = false;
  },
  POST_RATING_ERROR(state, err) {
    state.errorPostRating = err;
    state.loadingPostRating = false;
  },

  DELETE_APP_REQUEST(state) {
    state.loadingDeleteApp = true;
    state.errorDeleteApp = null;
  },
  DELETE_APP_SUCCESS(state) {
    state.loadingDeleteApp = false;
  },
  DELETE_APP_ERROR(state, err) {
    state.errorDeleteApp = err;
    state.loadingDeleteApp = false;
  },

  CREATE_APP_REQUEST(state) {
    state.loadingCreateApp = true;
    state.errorCreateApp = null;
    state.createAppResponse = null;
  },
  CREATE_APP_SUCCESS(state, data) {
    state.createAppResponse = data;
    state.loadingCreateApp = false;
  },
  CREATE_APP_ERROR(state, err) {
    state.errorCreateApp = err;
    state.loadingCreateApp = false;
  },
};
