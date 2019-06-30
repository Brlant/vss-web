export const route = [
  {
    path: '/',
    component: () => import('./components/index.vue'),
    children: [
      {
        path: '',
        component: () => import('./components/dashboard/dashboard.vue'),
        meta: {moduleId: 'home', title: '首页', icon: 'home', perm: 'show'},
        children: []
      },
      {
        path: '/purchase',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'purchase', title: '疫苗采购', icon: 'purchase', perm: 'purchasing-business'},
        children: [
          {
            path: '/purchase/contract',
            component: () => import('./components/purchase/contract/list.vue'),
            meta: {moduleId: 'purchase', title: '采购合同', perm: 'purchasing-contract'}
          },
          {
            path: '/purchase/order/one/class/:id',
            component: () => import('./components/purchase/order/list.vue'),
            meta: {moduleId: 'purchase', title: '一类苗采购订单', perm: 'purchasing-order', type: '1'}
          },
          {
            path: '/purchase/order/two/class/:id',
            component: () => import('./components/purchase/order/list.vue'),
            meta: {moduleId: 'purchase', title: '二类苗采购订单', perm: 'second-vaccine-purchasing-order', type: '2'}
          },
          {
            path: '/purchase/rejected/:id',
            component: () => import('./components/purchase/rejected/list.vue'),
            meta: {moduleId: 'purchase', title: '采购退货', perm: 'return-manager'}
          }
        ]
      },
      {
        path: '/sale',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'sale', title: '疫苗销售', icon: 'sale', perm: 'sales-business'},
        children: [
          {
            path: '/sale/order/one/class/:id',
            component: () => import('./components/sale/order/list.vue'),
            meta: {moduleId: 'sale', title: '一类苗销售订单', perm: 'sales-order', type: '1'}
          },
          {
            path: '/sale/order/two/class/:id',
            component: () => import('./components/sale/order/list.vue'),
            meta: {moduleId: 'sale', title: '二类苗销售订单', perm: 'second-vaccine-sales-order', type: '2'}
          },
          {
            path: '/sale/no/feedback/:id',
            component: () => import('./components/sale/feedback/list.vue'),
            meta: {moduleId: 'sale', title: '未反馈订单', perm: 'no-feedback-order-manager'}
          },
          {
            path: '/sale/pov/:id',
            component: () => import('./components/common/parent-route.vue'),
            meta: {moduleId: 'sale', title: '接种点要货需求', perm: 'demand-assignment'},
            children: [
              {
                path: '',
                component: () => import('./components/purchase/pov/list.vue'),
                meta: {moduleId: 'sale', title: '接种点要货需求', perm: 'demand-assignment-query'}
              },
              {
                path: '/sale/allocation/pov',
                component: () => import('./components/purchase/pov/allocation.vue'),
                meta: {moduleId: 'sale', title: '接种点要货需求', perm: 'demand-assignment-update'}
              }
            ]
          },
          {
            path: '/purchase/allocation',
            component: () => import('./components/common/parent-route.vue'),
            meta: {moduleId: 'purchase', title: '采购汇总', perm: 'purchansing-assignment'},
            children: [
              {
                path: '',
                component: () => import('./components/purchase/collect/list.vue'),
                meta: {moduleId: 'purchase', title: '采购汇总', perm: 'purchansing-assignment'}
              },
              {
                path: '/purchase/allocation/task',
                component: () => import('./components/purchase/collect/allocation.vue'),
                meta: {moduleId: 'purchase', title: '采购汇总', perm: 'purchansing-assignment'}
              }
            ]
          },
          {
            path: '/sale/allocation',
            component: () => import('./components/common/parent-route.vue'),
            meta: {moduleId: 'sale', title: '销售分配', perm: 'cerp-create-wave'},
            children: [
              {
                path: '',
                component: () => import('./components/purchase/wave/list.vue'),
                meta: {moduleId: 'sale', title: '销售分配', perm: 'cerp-create-wave'}
              },
              {
                path: '/sale/allocation/task',
                component: () => import('./components/purchase/pov/allocation.vue'),
                meta: {moduleId: 'sale', title: '销售分配', perm: 'cerp-create-wave'}
              }
            ]
          },
          {
            path: '/sale/rejected/:id',
            component: () => import('./components/sale/rejected/list.vue'),
            meta: {moduleId: 'sale', title: '销售退货', perm: 'sales-return'}
          }
        ]
      },
      // {
      //   path: '/sale/no/feedback',
      //   component: () => import('./components/sale/feedback/list.vue'),
      //   meta: {moduleId: 'sale', title: '未反馈订单', perm: 'second-vaccine-sales-order'}
      // },
      {
        path: '/pov',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'pov', title: '接种点业务', icon: 'vaccine', perm: 'pov-business'},
        children: [
          {
            path: '/pov/request',
            component: () => import('./components/pov/request/list.vue'),
            meta: {moduleId: 'pov', title: '要货申请', perm: 'pull-signal'}
          },
          {
            path: '/pov/receipt',
            component: () => import('./components/pov/receipt/list.vue'),
            meta: {moduleId: 'pov', title: '采购订单', perm: 'pov-receipt-manager'}
          },
          {
            path: '/pov/record',
            component: () => import('./components/pov/record/list.vue'),
            meta: {moduleId: 'pov', title: '注射记录', perm: 'injection-task-manager'}
          },
          {
            path: '/pov/subordinate/record',
            component: () => import('./components/pov/record/subordinate/list.vue'),
            meta: {moduleId: 'pov', title: '下属单位注射记录', perm: 'subordinate-injection-task-manager'}
          }
        ]
      },
      {
        path: '/store',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'store', title: '库存管理', icon: 'store', perm: 'cerp-stock-manager'},
        children: [
          {
            path: '/store/request',
            component: () => import('./components/store/list.vue'),
            meta: {moduleId: 'store', title: '即时库存', perm: 'cerp-stock-query'}
          },
          {
            path: '/store/regulation',
            component: () => import('./components/store/repertory-regulation.vue'),
            meta: {moduleId: 'store', title: '即时库存监管', perm: 'cerp-stock-regulatory'}
          },
          {
            path: '/store/regulation/pov',
            component: () => import('./components/store/repertory-pov.vue'),
            meta: {moduleId: 'store', title: '接种点库存监管', perm: 'cerp-stock-pov-regulatory'}
          },
          {
            path: '/store/adjust/count',
            component: () => import('./components/store/adjust-count-stock.vue'),
            meta: {moduleId: 'store', title: '库存数量调整', perm: 'cerp-stock-adjust'}
          },
          {
            path: '/store/adjust/status',
            component: () => import('./components/store/record/list'),
            meta: {moduleId: 'store', title: '库存状态调整', perm: 'cerp-stock-status-adjust'}
          },
          {
            path: '/store/inventory',
            component: () => import('./components/common/parent-route.vue'),
            meta: {moduleId: 'store', title: '库存盘点', perm: 'erp-stock-inventory-query', subMenuId: 'inventory'},
            children: [
              {
                path: '',
                component: () => import('./components/store/inventory/list.vue'),
                meta: {moduleId: 'store', title: '库存盘点', perm: 'erp-stock-inventory-query'}
              },
              {
                path: '/store/inventory/detail',
                component: () => import('./components/store/inventory/details.vue'),
                meta: {moduleId: 'store', title: '库存盘点', perm: 'erp-stock-inventory-query'}
              }
            ]
          },
          {
            path: '/store/allotment/:id',
            component: () => import('./components/purchase/allotment/list.vue'),
            meta: {moduleId: 'purchase', title: '调拨入库', perm: 'allocating-order-manager'}
          },
          {
            path: '/store/bad/:id',
            component: () => import('./components/store/breakage-order/list.vue'),
            meta: {moduleId: 'store', title: '报损', perm: 'breakage-order'}
          }
        ]
      },
      {
        path: '/finance',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'finance', title: '财务管理', icon: 'finance', perm: 'financial-manager'},
        children: [
          {
            path: '/finance/pay',
            component: () => import('./components/finance/pay/list.vue'),
            meta: {moduleId: 'finance', title: '应付账款查询', perm: 'accounts-payable'}
          },
          {
            path: '/finance/get',
            component: () => import('./components/finance/receipt/list.vue'),
            meta: {moduleId: 'finance', title: '应收账款查询', perm: 'accounts-receivable'}
          },
          {
            path: '/payment/invoice',
            component: () => import('./components/finance/invoice/list.vue'),
            meta: {moduleId: 'finance', title: '厂商发票管理', perm: 'invoice-data-manager'}
          },
          {
            path: '/payment/operation',
            component: () => import('./components/finance/operation/payment/list.vue'),
            meta: {moduleId: 'finance', title: '付款作业', perm: 'payment-payable'}
          },
          {
            path: '/pending/payment',
            component: () => import('./components/finance/pending/list.vue'),
            meta: {moduleId: 'finance', title: '预付款管理', perm: 'cdc-advance-payable', type: 1}
          },
          {
            path: '/pending/receive',
            component: () => import('./components/finance/pending/list.vue'),
            meta: {moduleId: 'finance', title: '预收款管理', perm: 'pov-advance-receivable', type: 2}
          },
          {
            path: '/collection/operation',
            component: () => import('./components/finance/operation/collection/list.vue'),
            meta: {
              moduleId: 'finance', title: 'CDC收款作业', perm: 'cdc-payment-receivable', type: 2,
              perms: ['cdc-payment-receivable-add', 'cdc-payment-receivable-audit',
                'cdc-payment-receivable-review', 'cdc-payment-receivable-cancel']
            }
          },
          {
            path: '/collection/pov',
            component: () => import('./components/finance/operation/collection/list.vue'),
            meta: {
              moduleId: 'finance', title: 'POV付款作业', perm: 'pov-payment-payable', type: 1,
              perms: ['pov-payment-payable-add', 'pov-payment-payable-audit', 'pov-payment-payable-cancel']
            }
          },
          {
            path: '/payment/pending',
            component: () => import('./components/finance/operation/advance/list.vue'),
            meta: {
              moduleId: 'finance', title: '预付款作业', perm: 'advance-payable', type: 1,
              perms: ['advance-payable-add', 'advance-payable-audit', 'advance-payable-cancel']
            }
          },
          {
            path: '/collection/pending',
            component: () => import('./components/finance/operation/advance/list.vue'),
            meta: {
              moduleId: 'finance', title: '预收款作业', perm: 'advance-receivable', type: 2,
              perms: ['advance-receivable-add', 'advance-receivable-audit', 'advance-receivable-review', 'advance-receivable-cancel']
            }
          },
          {
            path: '/finance/org',
            component: () => import('./components/finance/logistics/list.vue'),
            meta: {moduleId: 'finance', title: '物流商对账', perm: 'logistics-vendor-reconciliation'}
          },
          {
            path: '/finance/supplier',
            component: () => import('./components/finance/vaccine/list.vue'),
            meta: {moduleId: 'finance', title: '疫苗厂商入库明细', perm: 'vaccine-vendor-reconciliation'}
          }
          // {
          //   path: '/finance/paying',
          //   component: () => import('./components/finance/bad/list.vue'),
          //   meta: {moduleId: 'finance', title: '付款作业', perm: 'show'}
          // },
          // {
          //   path: '/finance/sale',
          //   component: () => import('./components/finance/bad/list.vue'),
          //   meta: {moduleId: 'finance', title: '库存疫苗调价', perm: 'show'}
          // }
        ]
      },
      {
        path: '/file',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'file', title: '批号文件管理', icon: 'validity', perm: 'vaccine-batch-process'},
        children: [
          {
            path: '/file/vaccine',
            component: () => import('./components/files/vaccineBatch/index.vue'),
            meta: {moduleId: 'file', title: '疫苗批号文件', perm: 'vaccine-batch-process'}
          }
        ]
      },
      {
        path: '/account',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'account', title: '单位账户管理', icon: 'user', perm: 'erp-bind-account-manager'},
        children: [
          {
            path: '/account/cdc',
            component: () => import('./components/account/cdc/county-cdc.vue'),
            meta: {moduleId: 'account', title: '管理区疾控', perm: 'erp-bind-cdc'}
          },
          {
            path: '/account/citypov',
            component: () => import('./components/account/pov/city-pov.vue'),
            meta: {moduleId: 'account', title: '市疾控绑定接种点', perm: 'erp-bind-city-pov'}
          },
          {
            path: '/account/pov',
            component: () => import('./components/account/pov/list.vue'),
            meta: {moduleId: 'account', title: '绑定下属接种点', perm: 'erp-bind-pov-manager'}
          },
          {
            path: '/account/management',
            component: () => import('./components/account/management/list.vue'),
            meta: {moduleId: 'account', title: '账号分配', perm: 'erp-account-manager', type: 0}
          },
          {
            path: '/account/role',
            component: () => import('./components/account/role/role.vue'),
            meta: {moduleId: 'account', title: '角色管理', perm: 'access-role-manager'}
          },
          {
            path: '/account/system',
            component: () => import('./components/account/system/list.vue'),
            meta: {moduleId: 'account', title: '系统角色管理', perm: 'erp-system-manager'}
          },
          {
            path: '/account/user',
            component: () => import('./components/account/user/list.vue'),
            meta: {moduleId: 'account', title: '用户管理', perm: 'erp-user-manager'}
          },
          {
            path: '/account/log',
            component: () => import('./components/common/log/list.vue'),
            meta: {topMould: 'permission', title: '系统日志', perm: 'erp-system-log'}
          },
          {
            path: '/account/system/management',
            component: () => import('./components/account/management/list.vue'),
            meta: {moduleId: 'account', title: '系统账号管理', perm: 'erp-system-account-manager', type: 1}
          }
        ]
      },
      {
        path: '/resource',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'resource', title: '资料管理', icon: 'firm', perm: 'material-manager'},
        children: [
          {
            path: '/resource/firm',
            component: () => import('./components/resource/firm/list.vue'),
            meta: {moduleId: 'resource', title: '疫苗供货单位资料', perm: 'manufacturer-manager'}
          },
          {
            path: '/resource/bidder',
            component: () => import('./components/resource/bidder/list.vue'),
            meta: {moduleId: 'resource', title: '中标疫苗', perm: 'successful-bidder-vaccine'}
          },
          {
            path: '/resource/first-vaccin/list',
            component: () => import('./components/resource/vaccin/firstVaccin/list.vue'),
            meta: {moduleId: 'resource', title: '一类疫苗产品资料', perm: 'first-vaccine-info'}
          },
          {
            path: '/resource/second-vaccin/list',
            component: () => import('./components/resource/vaccin/secondVaccin/list.vue'),
            meta: {moduleId: 'resource', title: '疫苗产品资料', perm: 'second-vaccine-info'}
          },
          // {
          //   path: '/resource/pov/first-vaccin/list',
          //   component: () => import('./components/resource/vaccin/pov/first/list.vue'),
          //   meta: {moduleId: 'resource', title: '被授权一类疫苗', perm: 'pov-first-authorization-vaccine'}
          // },
          {
            path: '/resource/pov/second-vaccin/list',
            component: () => import('./components/resource/vaccin/pov/second/list.vue'),
            meta: {moduleId: 'resource', title: '被授权疫苗', perm: 'pov-second-authorization-vaccine'}
          },
          {
            path: '/resource/store',
            component: () => import('./components/resource/store/list.vue'),
            meta: {moduleId: 'resource', title: '仓库管理', perm: 'binding-warehouse'}
          },
          {
            path: '/logistics/cost',
            component: () => import('./components/resource/logistics/cost.vue'),
            meta: {moduleId: 'resource', title: '物流费管理', perm: 'cerp-logistics-cost'}
          },
          {
            path: '/resource/material',
            component: () => import('./components/resource/material/list.vue'),
            meta: {moduleId: 'resource', title: '物料管理', perm: 'supplies-manager'}
          }
        ]
      },
      // {
      //   path: '/trace',
      //   component: () => import('./components/trace/list.vue'),
      //   meta: {moduleId: 'report', title: '追溯管理', icon: 'trace', perm: 'show'},
      //   children: []
      // },
      {
        path: '/vaccine/select',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'store', title: '疫苗遴选', icon: 'store', perm: 'vaccine-selection'},
        children: [
          {
            path: '/purchase/agreement',
            component: () => import('./components/resource/vaccin/purchaseAgreement/list.vue'),
            meta: {moduleId: 'resource', title: '区二类疫苗采购目录', perm: 'purchase-agreement'}
          },
          {
            path: '/sale/vaccin/price',
            component: () => import('./components/resource/price/list.vue'),
            meta: {moduleId: 'resource', title: '二类疫苗销售价格', perm: 'sale-price-group'}
          },
          {
            path: '/sale/one/vaccin/pov',
            component: () => import('./components/resource/vaccin/rights/one/pov.vue'),
            meta: {moduleId: 'resource', title: '一类疫苗接种点授权', perm: 'first-vaccine-authorization'}
          },
          {
            path: '/sale/two/vaccin/pov',
            component: () => import('./components/resource/vaccin/rights/two/pov.vue'),
            meta: {moduleId: 'resource', title: '二类疫苗接种点授权', perm: 'second-vaccine-authorization'}
          }
        ]
      },
      {
        path: '/report',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'report', title: '报表管理', icon: 'report', perm: 'report-form-manager'},
        children: [
          {
            path: '/report/purchase',
            component: () => import('./components/report/purchase.vue'),
            meta: {moduleId: 'report', title: '采购明细表', perm: 'purchasing-detail-form-manager'}
          },
          {
            path: '/report/sale',
            component: () => import('./components/report/sale.vue'),
            meta: {moduleId: 'report', title: '销售明细表', perm: 'sale-detail-form-manager'}
          },
          {
            path: '/report/out',
            component: () => import('./components/report/out.vue'),
            meta: {moduleId: 'report', title: '出货一览表', perm: 'shipment-form-manager'}
          },
          {
            path: '/drug-administration/report/in',
            component: () => import('./components/report/drug-administration-out.vue'),
            meta: {moduleId: 'report', title: '市药监购进数据导出', perm: 'drug-administration-in-data-export', type: '0'}
          },
          {
            path: '/drug-administration/report/out',
            component: () => import('./components/report/drug-administration-out.vue'),
            meta: {moduleId: 'report', title: '市药监销售数据导出', perm: 'drug-administration-out-data-export', type: '1'}
          },
          {
            path: '/report/repertory',
            component: () => import('./components/report/repertory.vue'),
            meta: {moduleId: 'report', title: '进销存盘点表', perm: 'inventory-form-manager'}
          },
          {
            path: '/report/first/out/manager',
            component: () => import('./components/report/one-out.vue'),
            meta: {moduleId: 'report', title: '一类疫苗各区出货统计表', perm: 'first-vaccine-out-form-manager'}
          },
          {
            path: '/report/month/repertory',
            component: () => import('./components/report/month-end-repertory.vue'),
            meta: {moduleId: 'report', title: '二类疫苗月终库存盘点表', perm: 'month-stock-inventory-form-manager'}
          },
          {
            path: '/report/logistics',
            component: () => import('./components/report/logistics.vue'),
            meta: {moduleId: 'report', title: '免费疫苗出入库明细表', perm: 'first-vaccine-logistics-manager'}
          },
          {
            path: '/report/allotation',
            component: () => import('./components/report/allotation.vue'),
            meta: {moduleId: 'report', title: '出货疫苗统计表', perm: 'first-vaccine-distribution-manager'}
          },
          {
            path: '/report/pov/two/repertory',
            component: () => import('./components/report/pov-repertory.vue'),
            meta: {moduleId: 'report', title: '接种单位疫苗盘点表', perm: 'pov-stock-form-manager', type: 2}
          },
          {
            path: '/report/pov/detail',
            component: () => import('./components/report/factoryOrder.vue'),
            meta: {moduleId: 'report', title: '全市出入库明细', perm: 'stock-in-out-form-manager'}
          },
          {
            path: '/report/goods-settlement',
            component: () => import('./components/report/goods-settlement.vue'),
            meta: {moduleId: 'report', title: '疫苗当月结算表', perm: 'vaccine-month-settlement-manager'}
          },
          {
            path: '/report/cdc/first-vaccine',
            component: () => import('./components/report/cdc-first-vaccine.vue'),
            meta: {moduleId: 'report', title: '一类苗领用记录', perm: 'cdc-free-vaccine-sale-manager'}
          },
          {
            path: '/report/receive',
            component: () => import('./components/report/receive.vue'),
            meta: {moduleId: 'report', title: '各单位领苗汇总表', perm: 'each-year-vaccine-manager'}
          },
          {
            path: '/report/quality-acceptance',
            component: () => import('./components/report/quality-acceptance-record.vue'),
            meta: {moduleId: 'report', title: '疫苗质量验收记录表', perm: 'vaccine-quality-check-record-manager'}
          },
          {
            path: '/report/vaccine-biz-record',
            component: () => import('./components/report/vaccine-biz-record.vue'),
            meta: {moduleId: 'report', title: '疫苗出入库记录表', perm: 'vaccine-biz-record-manager'}
          },
          {
            path: '/report/material-stock',
            component: () => import('./components/report/material-stock.vue'),
            meta: {moduleId: 'report', title: '物料进销存汇总表', perm: 'materia-stock-manager'}
          },
          {
            path: '/report/trend',
            component: () => import('./components/report/use-trend.vue'),
            meta: {moduleId: 'report', title: '疫苗使用趋势表', perm: 'vaccine-trend-manager'}
          }
        ]
      },
      {
        path: '/information',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'information', title: '信息发布', icon: 'publish-info', perm: 'erp-information-manager'},
        children: [
          {
            path: '/notice',
            component: () => import('./components/information/notice/list.vue'),
            meta: {moduleId: 'information', title: '信息发布', perm: 'notice-watch'}
          }
        ]
      }
    ]
  }
];

export const basicRoutes = [
  {
    path: '/resetpsw',
    component: () => import('./components/resetpsw.vue'),
    meta: {}
  },
  {path: '/404', component: () => import('./components/error_404.vue')},
  {path: '/500', component: () => import('./components/error_500.vue')},
  {path: '/login', component: () => import('./components/login.vue')},
  {path: '/wx/login', component: () => import('./components/wx-login.vue')},
  {path: '/forget', component: () => import('./components/forget.vue')},
  {path: '/code/:id', component: () => import('./components/resetpwd.vue')}
];

export const ErrorPage = [
  {path: '*', component: () => import('./components/error_404.vue')}
];
