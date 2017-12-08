import Vue from 'vue';
import router from './routers';
import tinyVue from './lib/tinyVue';
import moment from 'moment';
import 'moment/locale/zh-cn';
import '../static/theme/index.css';
import '../static/css/oms.css';
import '../static/fonts/iconfont.css';
import Vuex from 'vuex';
import store from './store';

import omsCostTime from './components/common/timeCost.vue';

Vue.use(require('vue-moment'), {moment});
Vue.use(tinyVue);
Vue.use(Vuex);

Vue.component(omsCostTime.name, omsCostTime);
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
  if (typeof val === 'string') {
    return val;
  } else if (typeof val === 'number') {
    return val.toFixed(2);
  }
});
Vue.prototype.$scrollLoadingData = function (event) {
  let e = event ? event : window.event;
  let target = e.target || e.srcElement;
  let difference = 20;
  let height = target.scrollHeight - target.clientHeight;
  let scrollTop = target.scrollTop;
  if (height > 0 && height - scrollTop < difference) {
    if (this.getOrgMore && this.typePager.currentPage < this.typePager.totalPage) {
      this.getOrgMore();
    }
  }
};
new Vue({
  template: '<router-view id="app"></router-view>',
  router,
  store
}).$mount('#app');
