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
  bodySize: {left: '180px'},
  orgName: '',
  weChatInfo: ''
};
let bodyLeft = window.localStorage.getItem('bodyLeft');
if (bodyLeft) {
  state.bodySize.left = bodyLeft;
}
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
  initWeChatInfo (state, data) {
    try {
      if (data && data.nickname) {
        window.localStorage.setItem('weChatInfo', JSON.stringify(data));
        state.weChatInfo = data;
      }
    } catch (e) {

    }

  },
  initCode(state, orgCode) {
    try {
      if (orgCode) {
        window.localStorage.setItem('orgCode', JSON.stringify(orgCode));
        state.orgCode = orgCode;
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
  },
  changeBodyLeft(state, isSmall) {
    state.bodySize.left = isSmall ? '64px' : '180px';
    window.localStorage.setItem('bodyLeft', state.bodySize.left);
  },
  initOrgName (state, data) {
    state.orgName = data;
  }
};

export default new Vuex.Store({
  state,
  mutations
});
