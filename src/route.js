// import axios from 'axios';
//  专门用来展示静态HTML文件的组件
// const Html = {
//   template: '<div v-html="html"></div>',
//   data: () => ({
//     html: ''
//   }),
//   beforeRouteEnter(to, from, next) {
//     axios.get('/static/html/' + to.params.file).then(response => {
//       next(vm => {
//         vm.html = response.data;
//         vm.$nextTick(() => vm.$emit('loaded'));
//       });
//     });
//   },
//   beforeRouteUpdate(to, from, next) {
//     this.$emit('loaded', 1);
//     axios.get('/static/html/' + to.params.file).then(response => {
//       this.html = response.data;
//       this.$nextTick(() => {
//         this.$emit('loaded', 0);
//         next();
//       });
//     });
//   }
// };
const route = [
  {
    path: '/',
    component: require('./components/index.vue'),
    children: [
      {
        path: '',
        component: resolve => require(['./components/dashboard.vue'], resolve),
        meta: {}
      },
      {
        path: '/resetpsw',
        component: () => import('./components/resetpsw.vue'),
        meta: {}
      },
      {
        path: '/warehouse',
        component: resolve => require(['./components/warehouse/index.vue'], resolve),
        meta: {moduleId: 'warehouse', title: '仓库管理', icon: 'warehouse', perm: 'show'},
        children: [
          {
            path: '/warehouse/in',
            component: resolve => require(['./components/warehouse/in/list.vue'], resolve),
            meta: {moduleId: 'warehouse', title: '入库作业', perm: 'show'}
          },
          {
            path: '/warehouse/out',
            component: resolve => require(['./components/dashboard.vue'], resolve),
            meta: {moduleId: 'warehouse', title: '出库作业', perm: 'show'}
          },
          {
            path: '/warehouse/wave',
            component: resolve => require(['./components/dashboard.vue'], resolve),
            meta: {moduleId: 'warehouse', title: '波次作业', perm: 'show'}
          },
          {
            path: '/warehouse/maintain',
            component: resolve => require(['./components/dashboard.vue'], resolve),
            meta: {moduleId: 'warehouse', title: '仓库养护作业', perm: 'show'}
          },

          {
            path: '/warehouse/scatter',
            component: resolve => require(['./components/dashboard.vue'], resolve),
            meta: {moduleId: 'warehouse', title: '仓库拆零作业', perm: 'show'}
          },
          {
            path: '/warehouse/plan',
            component: resolve => require(['./components/dashboard.vue'], resolve),
            meta: {moduleId: 'warehouse', title: '计划管理', perm: 'show'}
          }
        ]
      },
      {
        path: '/repertory',
        component: resolve => require(['./components/dashboard.vue'], resolve),
        meta: {moduleId: 'repertory', title: '库存管理', icon: 'repertory', perm: 'show'},
        children: [
          {
            path: '/repertory/batch',
            component: resolve => require(['./components/dashboard.vue'], resolve),
            meta: {moduleId: 'repertory', title: '库存批次', perm: 'show'}
          }, {
            path: '/repertory/rejectedGoods',
            component: resolve => require(['./components/dashboard.vue'], resolve),
            meta: {moduleId: 'repertory', title: '报废货品库存管理', perm: 'show'}
          }
        ]
      },
      {
        path: '/basic',
        component: resolve => require(['./components/dashboard.vue'], resolve),
        meta: {moduleId: 'basic', title: '基础资料管理', icon: 'basic', perm: 'show'},
        children: [
          {
            path: '/basic/packingScheme',
            component: resolve => require(['./components/dashboard.vue'], resolve),
            meta: {moduleId: 'basic', title: '包装方案', perm: 'show'}
          },
          {
            path: '/basic/logisticsCenter',
            component: resolve => require(['./components/dashboard.vue'], resolve),
            meta: {moduleId: 'basic', title: '物流中心档案', perm: 'show'},
            children: [
              {
                path: '/basic/logisticsCenter',
                component: resolve => require(['./components/dashboard.vue'], resolve),
                meta: {moduleId: 'basic', title: '物流中心档案', activePath: ''}
              },
              {
                path: '/basic/logisticsCenter/warehouse/:id',
                component: resolve => require(['./components/dashboard.vue'], resolve),
                meta: {moduleId: 'basic', title: '物流中心档案', activePath: '/basic/logisticsCenter'}
              }
            ]
          }
        ]
      },
      {
        path: '/equipmentfiles',
        component: resolve => require(['./components/dashboard.vue'], resolve),
        meta: {moduleId: 'equipmentfiles', title: '设备耗材', icon: 'equipment', perm: 'show'},
        children: []
      }
    ]
  },
  {path: '/404', component: () => import('./components/error_404.vue')},
  {path: '/500', component: () => import('./components/error_500.vue')},
  {path: '/login', component: () => import('./components/login.vue')},
  {path: '/forget', component: () => import('./components/forget.vue')},
  {path: '/code/:id', component: () => import('./components/resetpwd.vue')}
];
export default route;
