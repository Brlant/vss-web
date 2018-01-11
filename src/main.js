import Vue from 'vue';
import router from './routers';
import tinyVue from './lib/tinyVue';
import moment from 'moment';
import 'moment/locale/zh-cn';
import './assets/element-variables.scss';
import '../static/css/oms.css';
import '../static/fonts/iconfont.css';
import Vuex from 'vuex';
import store from './store';

import omsCostTime from './components/common/timeCost.vue';

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
new Vue({
  template: '<router-view id="app"></router-view>',
  router,
  store
}).$mount('#app');
