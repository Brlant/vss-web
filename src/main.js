import Vue from 'vue';
import router from './routers';
import ElementUI from 'element-ui';
import moment from 'moment';
import 'moment/locale/zh-cn';
import '../static/theme/index.css';
import '../static/css/oms.css';
import '../static/fonts/iconfont.css';
import Vuex from 'vuex';
import store from './store';
import remove from './components/common/remove.vue';
import forbid from './components/common/forbid.vue';
import dict from './components/common/dict.vue';
import nl2br from './components/common/nl2br.vue';
import upload from './components/common/upload.vue';
import uploadRelation from './components/common/upload.relation.vue';
import perm from './components/common/perm.vue';
import omsRow from './components/common/row.vue';
import formRow from './components/common/formRow.vue';
import pageRight from './components/common/page.right.vue';
import omsInput from './components/common/input.oms.vue';
import singleInput from './components/common/input.single.oms.vue';
import omsLoading from './components/common/oms.loading.vue';

Vue.use(require('vue-moment'), {moment});
Vue.use(ElementUI);
Vue.use(Vuex);
Vue.component(omsInput.name, omsInput);
Vue.component(singleInput.name, singleInput);
Vue.component(dict.name, dict);
Vue.component(remove.name, remove);
Vue.component(forbid.name, forbid);
Vue.component(nl2br.name, nl2br);
Vue.component(uploadRelation.name, uploadRelation);
Vue.component(upload.name, upload);
Vue.component(perm.name, perm);
Vue.component(omsRow.name, omsRow);
Vue.component(formRow.name, formRow);
Vue.component(pageRight.name, pageRight);
Vue.component(omsLoading.name, omsLoading);

Vue.filter('date', function (dateTime) {
  if (!dateTime) return '';
  return moment(dateTime).format('YYYY-MM-DD');
});
Vue.filter('time', function (dateTime) {
  if (!dateTime) return '';
  return moment(dateTime).format('YYYY-MM-DD HH:mm:ss');
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
new Vue({
  template: '<router-view id="app"></router-view>',
  router,
  store
}).$mount('#app');
