import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

//  需要维护的状态
const state = {
  uploadUrl: 'https:// jsonplaceholder.typicode.com/posts/',
  user: {},
  dict: {},
  permissions: [],
  allMenuList: {}, // 所有菜单
  roleList: {},
  menuParentIds: [], // 所有非叶子节点菜单
  attachmentDialog: {attachmentId: 0, open: false, attachmentList: []},
  bodySize: {left: '200px'},
  orgName: '',
  weChatInfo: {},
  bodyHeight: 0,
  orgLevel: '',
  prints: [],
  logisticsCentreId: '',
  bottomLoading: false,
  isShowGoodsList: false,
  windowSize: {width: 1000, height: 500},
  requestingDictAry: [],
  breakageOrgType: [1, 2, 3],
  vaccineType: [
    {key: 0, label: '一类疫苗'},
    {key: 1, label: '二类疫苗'}
  ]
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
  initWeChatInfo(state, data) {
    try {
      if (typeof data === 'object') {
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
    state.allMenuList = data;
  },
  changeAttachment(state, data) {
    let currentId;
    console.log(data);
    if (typeof data === 'object') {
      currentId = data.currentId;
      state.attachmentDialog.attachmentList = data.attachmentList;
    } else {
      currentId = data;
      state.attachmentDialog.attachmentList = [];
    }
    if (state.attachmentDialog.attachmentId === currentId) {
      state.attachmentDialog.open = true;
    } else {
      state.attachmentDialog.attachmentId = currentId;
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
    state.bodySize.left = isSmall ? '64px' : '200px';
    window.localStorage.setItem('bodyLeft', state.bodySize.left);
  },
  initOrgName(state, data) {
    state.orgName = data;
  },
  setBodyHeight(state, data) {
    state.bodyHeight = data.height;
    state.windowSize = data.window;
  },
  initOrgLevel(state, data) {
    state.orgLevel = data;
  },
  initPrint(state, data) {
    data.text = data.text ? data.text : '拼命导出中';
    let isHas = false;
    let index = -1;
    state.prints.forEach((item, dd) => {
      if (item.moduleId === data.moduleId) {
        isHas = true;
        index = dd;
      }
    });
    if (isHas) {
      state.prints.splice(index, 1, data);
    } else {
      state.prints.push(data);
    }
  },
  initBottomLoading(state, data) {
    state.bottomLoading = data;
  },
  initIsShowGoodsList(state, data) {
    state.isShowGoodsList = data;
  },
  initMenuParentIds(state, data) {
    state.menuParentIds = data;
  },
  initRequestingDictAry(state, data) {
    state.requestingDictAry = data;
  }
};

export default new Vuex.Store({
  state,
  mutations
});
