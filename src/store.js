import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

//  需要维护的状态
const state = {
  uploadUrl: 'https:// jsonplaceholder.typicode.com/posts/',
  user: {},
  dict: {},
  permissions: [],
  permList: {},
  roleList: {},
  attachmentDialog: {attachmentId: 0, open: false},
  form: {},
  bodySize: {left: '261px'}
};

const mutations = {
  initUser(state, data) {
    try {
      if (data && data.userId) {
        window.localStorage.setItem('user', JSON.stringify(data));
        state.user = data;
      }
    } catch (e) {

    }
  },
  initDict(state, data) {
    state.dict = data;
  },
  initPermissions(state, data) {
    state.permissions = data;
  },
  initPermList(state, data) {
    state.permList = data;
  },
  changeAttachment(state, data) {
    if (state.attachmentDialog.attachmentId === data) {
      state.attachmentDialog.open = true;
    } else {
      state.attachmentDialog.attachmentId = data;
    }
  },
  openAttachmentDialog(state) {
    state.attachmentDialog.open = true;
  },
  closeAttachmentDialog(state) {
    state.attachmentDialog.open = false;
  },
  setBodySize(state, data) {
    Object.assign(state.bodySize, data);
  }
};

export default new Vuex.Store({
  state,
  mutations
});
