import {Access} from '@/resources.js';

export default {
  getRoleMenus(vm) {
    let menuList = vm.$store.state.permList;
    if (menuList) {
      return menuList;
    }
    let userId = vm.$store.state.user.userCompanyAddress;
    if (!userId) {
      return;
    }
    Access.getRoleMenus(userId).then(res => {
      let menuData = res.data;
      vm.$store.commit('initPermList', menuData);
      menuList = menuData;
    });
  }
};
