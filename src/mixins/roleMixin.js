import {Access} from '@/resources';
import menuTree from '@/components/account/system/menu';

const getOrgTree = (list, permissions) => {
  list.forEach((i, index) => {
    if (!permissions.some(s => s.id === i.id)) {
      list.splice(index, 1);
      return;
    }
    if (i.children) {
      getOrgTree(i.children, permissions);
    }
  });
};


export default {
  mounted() {

  },
  methods: {
    getRoleMenus(noCache = false) {
      return new Promise((resolve, reject) => {
        let menu = this.$store.state.allMenuList;
        if (noCache === false && menu && menu.length) {
          resolve({data: menu});
        } else {
          let userId = this.$store.state.user.userCompanyAddress;
          if (!userId) {
            reject('no user');
          } else {
            Access.getRoleMenus(userId).then(res => {
              let newMenu = JSON.parse(JSON.stringify(menuTree));
              getOrgTree(newMenu, res.data);
              this.$store.commit('initPermList', newMenu);
              resolve({data: newMenu});
              let getParentIds = (menus, parentsIds) => {
                menus.forEach(i => {
                  if (i.children) {
                    parentsIds.push(i.id);
                    getParentIds(i.children, parentsIds);
                  }
                });
              };
              let setParentIds = (menus) => {
                let parentIds = [];
                getParentIds(menus, parentIds);
                this.$store.commit('initMenuParentIds', parentIds);
              };
              setParentIds(newMenu);
            });
          }
        }
      });
    },
    getOmsRoleMenus(noCache = false) {
      return new Promise((resolve, reject) => {
        let menu = this.$store.state.allMenuList;
        if (noCache === false && menu && menu.data.length) {
          resolve(menu);
        } else {
          let userId = this.$store.state.user.userCompanyAddress;
          if (!userId) {
            reject('no user');
          } else {
            let res = {
              data: menuTree
            };
            this.$store.commit('initPermList', JSON.parse(JSON.stringify(res)));
            resolve(res);
            let getParentIds = (menus, parentsIds) => {
              menus.forEach(i => {
                if (i.children) {
                  parentsIds.push(i.id);
                  getParentIds(i.children, parentsIds);
                }
              });
            };
            let setParentIds = (menus) => {
              let parentIds = [];
              getParentIds(menus, parentIds);
              this.$store.commit('initMenuParentIds', parentIds);
            };
            setParentIds(res.data);
          }
        }
      });
    }
  }
};
