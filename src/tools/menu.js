import {Access} from '@/resources.js';

/**
 * 得到登录用户权限，放到vuex，并给当前vue实例添加一个属性,存储用户权限
 * @param vm
 * @param property
 */
export function getRoleMenus(vm, property) {
  let menu = vm.$store.state.permList;
  if (menu && menu.menuList) {
    vm[property] = menu;
    return;
  }
  let userId = vm.$store.state.user.userCompanyAddress;
  if (!userId) {
    return;
  }
  Access.getRoleMenus(userId).then(res => {
    vm.$store.commit('initPermList', res.data);
    vm[property] = res.data;
  });
}
