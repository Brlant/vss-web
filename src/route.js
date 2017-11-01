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
        meta: {moduleId: 'home', title: '首页', icon: 'home', perm: 'show'},
        children: []
      },

      {
        path: '/purchase',
        component: resolve => require(['./components/common/parent-route.vue'], resolve),
        meta: {moduleId: 'purchase', title: 'CDC采购', icon: 'purchase', perm: 'purchasing-business'},
        children: [
          // {
          //   path: '/purchase/pov',
          //   component: resolve => require(['./components/common/parent-route.vue'], resolve),
          //   meta: {moduleId: 'purchase', title: 'POV要货需求分配', perm: 'demand-assignment'},
          //   children: [
          //     {
          //       path: '',
          //       component: resolve => require(['./components/purchase/pov/list.vue'], resolve),
          //       meta: {moduleId: 'purchase', title: 'POV要货需求分配', perm: 'demand-assignment-query'}
          //     },
          //     {
          //       path: '/purchase/pov/allocation',
          //       component: resolve => require(['./components/purchase/pov/allocation.vue'], resolve),
          //       meta: {moduleId: 'purchase', title: 'POV要货需求分配', perm: 'demand-assignment-update'}
          //     }
          //   ]
          // },
          // {
          //   path: '/purchase/wave',
          //   component: resolve => require(['./components/purchase/wave/list.vue'], resolve),
          //   meta: {moduleId: 'purchase', title: '分配中订单', perm: 'cerp-create-wave'}
          // },
          {
            path: '/purchase/order/:id',
            component: resolve => require(['./components/purchase/order/list.vue'], resolve),
            meta: {moduleId: 'purchase', title: '采购订单', perm: 'purchasing-order'}
          },
          {
            path: '/purchase/rejected/:id',
            component: resolve => require(['./components/purchase/rejected/list.vue'], resolve),
            meta: {moduleId: 'purchase', title: '采购退货', perm: 'return-manager'}
          },
          {
            path: '/purchase/agreement',
            component: resolve => require(['./components/resource/vaccin/purchaseAgreement/list.vue'], resolve),
            meta: {moduleId: 'resource', title: '采购协议', perm: 'vaccine-info'}
          }
        ]
      },
      {
        path: '/sale',
        component: resolve => require(['./components/common/parent-route.vue'], resolve),
        meta: {moduleId: 'sale', title: 'CDC销售', icon: 'sale', perm: 'sales-business'},
        children: [
          {
            path: '/sale/order/:id',
            component: resolve => require(['./components/sale/order/list.vue'], resolve),
            meta: {moduleId: 'sale', title: '销售订单', perm: 'sales-order'}
          },
          {
            path: '/sale/rejected/:id',
            component: resolve => require(['./components/sale/rejected/list.vue'], resolve),
            meta: {moduleId: 'sale', title: '销售退货', perm: 'sales-return'}
          },
          {
            path: '/sale/pov',
            component: resolve => require(['./components/common/parent-route.vue'], resolve),
            meta: {moduleId: 'sale', title: 'POV要货单', perm: 'demand-assignment'},
            children: [
              {
                path: '',
                component: resolve => require(['./components/purchase/pov/list.vue'], resolve),
                meta: {moduleId: 'sale', title: 'POV要货单', perm: 'demand-assignment-query'}
              },
              {
                path: '/sale/pov/allocation',
                component: resolve => require(['./components/purchase/pov/allocation.vue'], resolve),
                meta: {moduleId: 'sale', title: 'POV要货单', perm: 'demand-assignment-update'}
              }
            ]
          },
          {
            path: '/sale/allocation',
            component: resolve => require(['./components/common/parent-route.vue'], resolve),
            meta: {moduleId: 'sale', title: '分货作业', perm: 'cerp-create-wave'},
            children: [
              {
                path: '',
                component: resolve => require(['./components/purchase/wave/list.vue'], resolve),
                meta: {moduleId: 'sale', title: '分货作业', perm: 'demand-assignment-query'}
              },
              {
                path: '/sale/allocation/task',
                component: resolve => require(['./components/purchase/pov/allocation.vue'], resolve),
                meta: {moduleId: 'sale', title: '分货作业', perm: 'demand-assignment-update'}
              }
            ]
          }
        ]
      },
      {
        path: '/pov',
        component: resolve => require(['./components/common/parent-route.vue'], resolve),
        meta: {moduleId: 'pov', title: 'POV业务', icon: 'vaccine', perm: 'pov-business'},
        children: [
          {
            path: '/pov/request',
            component: resolve => require(['./components/pov/request/list.vue'], resolve),
            meta: {moduleId: 'pov', title: '要货申请', perm: 'pull-signal'}
          },
          {
            path: '/pov/receipt',
            component: resolve => require(['./components/pov/receipt/list.vue'], resolve),
            meta: {moduleId: 'pov', title: '收货订单', perm: 'pov-receipt-manager'}
          }
          // {
          //   path: '/pov/store',
          //   component: resolve => require(['./components/pov/store/list.vue'], resolve),
          //   meta: {moduleId: 'pov', title: 'POV库存管理', perm: 'pov-stock-manage'}
          // },
          // {
          //   path: '/pov/scan',
          //   component: resolve => require(['./components/pov/scan/list.vue'], resolve),
          //   meta: {moduleId: 'pov', title: 'POV注射扫码', perm: 'pov-injection-scan'}
          // }
        ]
      },
      {
        path: '/store',
        component: resolve => require(['./components/common/parent-route.vue'], resolve),
        meta: {moduleId: 'store', title: '库存管理', icon: 'store', perm: 'cerp-stock-manager'},
        children: [
          {
            path: '/store/request',
            component: resolve => require(['./components/store/list.vue'], resolve),
            meta: {moduleId: 'store', title: '库存查询', perm: 'cerp-stock-query'}
          }
          // {
          //   path: '/store/bad',
          //   component: resolve => require(['./components/store/bad/list.vue'], resolve),
          //   meta: {moduleId: 'store', title: '库存报损', perm: 'cerp-stock-reported-loss'}
          // }
        ]
      },
      {
        path: '/finance',
        component: resolve => require(['./components/common/parent-route.vue'], resolve),
        meta: {moduleId: 'finance', title: '财务管理', icon: 'finance', perm: 'financial-manager'},
        children: [
          {
            path: '/payment/operation',
            component: resolve => require(['./components/finance/operation/payment/list.vue'], resolve),
            meta: {moduleId: 'finance', title: '付款作业', perm: 'payment-payable'}
          },
          {
            path: '/collection/operation',
            component: resolve => require(['./components/finance/operation/collection/list.vue'], resolve),
            meta: {moduleId: 'finance', title: '收款作业', perm: 'payment-receivable'}
          },
          {
            path: '/finance/get',
            component: resolve => require(['./components/finance/receipt/list.vue'], resolve),
            meta: {moduleId: 'finance', title: '应收账款管理', perm: 'accounts-receivable'}
          },
          {
            path: '/finance/pay',
            component: resolve => require(['./components/finance/pay/list.vue'], resolve),
            meta: {moduleId: 'finance', title: '应付账款管理', perm: 'accounts-payable'}
          },
          {
            path: '/finance/supplier',
            component: resolve => require(['./components/finance/vaccine/list.vue'], resolve),
            meta: {moduleId: 'finance', title: '疫苗厂商对账', perm: 'vaccine-vendor-reconciliation'}
          },
          {
            path: '/finance/org',
            component: resolve => require(['./components/finance/logistics/list.vue'], resolve),
            meta: {moduleId: 'finance', title: '物流厂商对账', perm: 'logistics-vendor-reconciliation'}
          }
          // {
          //   path: '/finance/paying',
          //   component: resolve => require(['./components/finance/bad/list.vue'], resolve),
          //   meta: {moduleId: 'finance', title: '付款作业', perm: 'show'}
          // },
          // {
          //   path: '/finance/sale',
          //   component: resolve => require(['./components/finance/bad/list.vue'], resolve),
          //   meta: {moduleId: 'finance', title: '库存货品调价', perm: 'show'}
          // }
        ]
      },
      {
        path: '/file',
        component: resolve => require(['./components/common/parent-route.vue'], resolve),
        meta: {moduleId: 'file', title: '批号文件管理', icon: 'fold', perm: 'vaccine-batch-process'},
        children: [
          {
            path: '/file/vaccine',
            component: resolve => require(['./components/files/vaccineBatch/index.vue'], resolve),
            meta: {moduleId: 'file', title: '疫苗批号文件管理', perm: 'vaccine-batch-process'}
          }
        ]
      },
      {
        path: '/account',
        component: resolve => require(['./components/common/parent-route.vue'], resolve),
        meta: {moduleId: 'account', title: '组织账户管理', icon: 'user', perm: 'erp-bind-account-manager'},
        children: [
          {
            path: '/account/cdc',
            component: resolve => require(['./components/account/cdc/county-cdc.vue'], resolve),
            meta: {moduleId: 'account', title: '管理区CDC', perm: 'erp-bind-cdc'}
          },
          {
            path: '/account/citypov',
            component: resolve => require(['./components/account/pov/city-pov.vue'], resolve),
            meta: {moduleId: 'account', title: '市CDC绑定POV', perm: 'erp-bind-city-pov'}
          },
          {
            path: '/account/pov',
            component: resolve => require(['./components/account/pov/list.vue'], resolve),
            meta: {moduleId: 'account', title: '区CDC绑定POV', perm: 'erp-bind-pov-manager'}
          },
          {
            path: '/account/management',
            component: resolve => require(['./components/account/management/list.vue'], resolve),
            meta: {moduleId: 'account', title: '账号分配', perm: 'erp-account-manager'}
          },
          {
            path: '/account/role',
            component: resolve => require(['./components/account/role/role.vue'], resolve),
            meta: {moduleId: 'account', title: '角色管理', perm: 'access-role-manager'}
          },
          {
            path: '/account/user',
            component: resolve => require(['./components/account/user/list.vue'], resolve),
            meta: {moduleId: 'account', title: '用户管理', perm: 'erp-user-manager'}
          }
        ]
      },
      {
        path: '/resource',
        component: resolve => require(['./components/common/parent-route.vue'], resolve),
        meta: {moduleId: 'resource', title: '资料管理', icon: 'firm', perm: 'material-manager'},
        children: [
          {
            path: '/resource/firm',
            component: resolve => require(['./components/resource/firm/list.vue'], resolve),
            meta: {moduleId: 'resource', title: '厂商资料', perm: 'manufacturer-manager'}
          },
          {
            path: '/resource/bidder',
            component: resolve => require(['./components/resource/bidder/list.vue'], resolve),
            meta: {moduleId: 'resource', title: '中标疫苗', perm: 'successful-bidder-vaccine'}
          },
          {
            path: '/resource/vaccin/list',
            component: resolve => require(['./components/resource/vaccin/data/list.vue'], resolve),
            meta: {moduleId: 'resource', title: '货主疫苗资料', perm: 'vaccine-info'}
          },
          {
            path: '/resource/vaccin/price',
            component: resolve => require(['./components/resource/price/list.vue'], resolve),
            meta: {moduleId: 'resource', title: '疫苗价格组', perm: 'sale-price-group'}
          },
          {
            path: '/resource/vaccin/pov',
            component: resolve => require(['./components/resource/vaccin/rights/pov.vue'], resolve),
            meta: {moduleId: 'resource', title: '疫苗授权', perm: 'vaccine-authorization'}
          },
          {
            path: '/resource/store',
            component: resolve => require(['./components/resource/store/list.vue'], resolve),
            meta: {moduleId: 'resource', title: '仓库管理', perm: 'binding-warehouse'}
          },
          {
            path: '/logistics/cost',
            component: resolve => require(['./components/resource/logistics/cost.vue'], resolve),
            meta: {moduleId: 'resource', title: '物流费管理', perm: 'cerp-logistics-cost'}
          }
        ]
      }
      // {
      //   path: '/trace',
      //   component: () => import('./components/trace/list.vue'),
      //   meta: {moduleId: 'report', title: '追溯管理', icon: 'trace', perm: 'show'},
      //   children: []
      // },
      // {
      //   path: '/report',
      //   component: () => import('./components/report/list.vue'),
      //   meta: {moduleId: 'report', title: '报表管理', icon: 'report', perm: 'show'},
      //   children: []
      // }
    ]
  },
  {
    path: '/resetpsw',
    component: () => import('./components/resetpsw.vue'),
    meta: {}
  },
  {path: '/404', component: () => import('./components/error_404.vue')},
  {path: '/500', component: () => import('./components/error_500.vue')},
  {path: '/login', component: () => import('./components/login.vue')},
  {path: '/forget', component: () => import('./components/forget.vue')},
  {path: '/code/:id', component: () => import('./components/resetpwd.vue')}
];
export default route;
