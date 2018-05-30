import Vue from 'vue';
import router from './routers';
import tinyVue from './lib/tinyVue';
import moment from 'moment';
import 'moment/locale/zh-cn';
import './assets/element-variables.scss';
import './assets/dtop-variables.scss';
import '../static/css/oms.css';
import '../static/fonts/iconfont.css';

import '@/assets/erp.scss';

import Vuex from 'vuex';
import store from './store';

import omsCostTime from './components/common/timeCost.vue';
import App from './components/App.vue';

Vue.use(require('vue-moment'), {moment});
Vue.use(tinyVue);
Vue.use(Vuex);

Vue.component(omsCostTime.name, omsCostTime);
Vue.filter('thousandth', function (val) {
  if (!val) return '';
  // return val.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');

});
Vue.filter('date', function (dateTime) {
  if (!dateTime) return '';
  return moment(dateTime).format('YYYY-MM-DD');
});
Vue.filter('time', function (dateTime) {
  if (!dateTime) return '';
  return moment(dateTime).format('YYYY-MM-DD HH:mm:ss');
});
Vue.filter('minute', function (dateTime) {
  if (!dateTime) return '';
  return moment(dateTime).format('YYYY-MM-DD HH:mm');
});
Vue.filter('formatStatus', function (key) {
  let reStr;
  let arr = {
    0: '否',
    1: '是'
  };

  if (key === true) {
    reStr = '是';
  } else if (key === false) {
    reStr = '否';
  } else if (!key) {
    reStr = '否';
  } else {
    reStr = arr[key];
  }
  return reStr;
});
Vue.filter('nl2br', function (textAreaContent) {
  return textAreaContent.replace(/\n/g, '<br>');
});
Vue.filter('formatMoney', function (val) {
  let num = '';
  if (typeof val === 'string') {
    num = val;
  } else if (typeof val === 'number') {
    num = val.toFixed(2).toString();
  }
  if (num) {
    // 判断数字是否有负号
    let count = num.indexOf('-');
    let isMinusSign = false;
    if (count !== -1) {
      // 如果包含负号
      isMinusSign = true;
      // 先去除负号
      num = num.replace('-', '');
    }
    // 整数部分进行千分位分割
    let arr = num.split('.');
    num = arr[0];
    let result = '';
    while (num.length > 3) {
      result = ',' + num.slice(-3) + result;
      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result;
    }
    // 拼接小数位
    result = result + '.' + arr[1];
    if (isMinusSign) {
      // 如果原来包含负号则重新拼接
      result = '-' + result;
    }
    return result;
  }
});
Vue.prototype.$scrollLoadingData = function (event) {
  let e = event ? event : window.event;
  let target = e.target || e.srcElement;
  let difference = 20;
  let height = target.scrollHeight - target.clientHeight;
  let scrollTop = target.scrollTop;
  if (height > 0 && height - scrollTop < difference) {
    if (this.getOrgMore && this.typePager.currentPage < this.typePager.totalPage && !this.$store.state.bottomLoading) {
      this.$store.commit('initBottomLoading', true);
      this.getOrgMore();
    }
  }
};

Vue.prototype.$getDict = function (groupName) {
  if (!groupName) return [];
  const state = this.$store.state;
  if (state.dict[groupName]) {
    return state.dict[groupName];
  } else {
    const ary = state.requestingDictAry;
    if (ary.includes(groupName)) return [];
    ary.push(groupName);
    this.$store.commit('initRequestingDictAry', ary);
    this.$http.get(`/dictGroup/${groupName}/items`).then(res => {
      state.dict[groupName] = res.data;
      this.$store.commit('initDict', state.dict);
      const ary_new = state.requestingDictAry;
      let index = ary_new.indexOf(groupName);
      if (index !== -1) {
        ary_new.splice(index, 1);
      }
      this.$store.commit('initRequestingDictAry', ary_new);
    });
    return [];
  }
};

// 确认框方法
Vue.prototype.$confirmOpera = function (tip, callback) {
  this.$confirm(tip, '', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    callback();
  });
};

// 通用请求方法
Vue.prototype.$httpRequestOpera = function (httpPromise, option = {
  successTitle: '操作成功',
  errorTitle: '操作失败',
  success: res => {
  },
  error: res => {
  }
}) {
  const {successTitle, errorTitle, success, error} = option;
  httpPromise.then(res => {
    this.$notify.success({
      duration: 2000,
      message: successTitle
    });
    success(res);
  }).catch(e => {
    this.$notify.error({
      duration: 2000,
      message: e.response && e.response.data && e.response.data.msg || errorTitle
    });
    error(e);
  });
};

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
