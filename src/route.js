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
            meta: {moduleId: 'purchase', title: '免疫规划苗采购订单', perm: 'purchasing-order', type: '1'}
          },
          {
            path: '/purchase/order/two/class/:id',
            component: () => import('./components/purchase/order/list.vue'),
            meta: {moduleId: 'purchase', title: '非免疫规划苗采购订单', perm: 'second-vaccine-purchasing-order', type: '2'}
          },
          {
            path: '/purchase/rejected/:id',
            component: () => import('./components/purchase/rejected/list.vue'),
            meta: {moduleId: 'purchase', title: '采购退货', perm: 'return-manager'}
          },
          {
            path: '/pov/request',
            component: () => import('./components/pov/request/list.vue'),
            meta: {moduleId: 'pov', title: '要货申请', perm: 'pull-signal'}
          },
          {
            path: '/pov/return/request/list',
            component: () => import('./components/purchase/returnRequest/list.vue'),
            meta: {moduleId: 'pov', title: '退货申请', perm: 'return-request-query', type: 'pov'}
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
            meta: {moduleId: 'sale', title: '免疫规划苗销售订单', perm: 'sales-order', type: '1'}
          },
          {
            path: '/sale/order/two/class/:id',
            component: () => import('./components/sale/order/list.vue'),
            meta: {moduleId: 'sale', title: '非免疫规划苗销售订单', perm: 'second-vaccine-sales-order', type: '2'}
          },
          {
            path: '/sale/no/feedback/:id',
            component: () => import('./components/sale/feedback/list.vue'),
            meta: {moduleId: 'sale', title: '未反馈订单', perm: 'no-feedback-order-manager'}
          },
          {
            path: '/sale/pov/:id',
            component: () => import('./components/common/parent-route.vue'),
            meta: {moduleId: 'sale', title: '要货需求', perm: 'demand-assignment'},
            children: [
              {
                path: '',
                component: () => import('./components/purchase/pov/list.vue'),
                meta: {moduleId: 'sale', title: '要货需求', perm: 'demand-assignment-query'}
              },
              {
                path: '/sale/allocation/pov',
                component: () => import('./components/purchase/pov/allocation.vue'),
                meta: {moduleId: 'sale', title: '要货需求', perm: 'demand-assignment-update'}
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
          },
          {
            path: '/cdc/return/request/list',
            component: () => import('./components/purchase/returnRequest/list.vue'),
            meta: {moduleId: 'sale', title: '退货申请', perm: 'sub-unit-return-request-query', type: 'cdc'}
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
      // {
      //   path: '/sale/no/feedback',
      //   component: () => import('./components/sale/feedback/list.vue'),
      //   meta: {moduleId: 'sale', title: '未反馈订单', perm: 'second-vaccine-sales-order'}
      // },
      {
        path: '/store',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'store', title: '库存管理', icon: 'store', perm: 'cerp-stock-manager'},
        children: [
          {
            path: '/store/request',
            component: () => import('./components/store/list.vue'),
            meta: {moduleId: 'store', title: '即时库存', perm: 'cerp-stock-query-bizServing'}
          },
          {
            path: '/store/request/bizServing',
            component: () => import('./components/store/list.vue'),
            meta: {moduleId: 'store', title: '即时库存(含人份)', perm: 'cerp-stock-query', isBizServing: true}
          },
          {
            path: '/store/count/adjust',
            component: () => import('./components/common/parent-route.vue'),
            meta: {moduleId: 'store', title: '库存数量调整', perm: 'cerp-stock-adjust-query', subMenuId: 'count'},
            children: [
              {
                path: '',
                component: () => import('./components/store/adjust-count-stock-log.vue'),
                meta: {moduleId: 'store', title: '库存数量调整'}
              },
              {
                path: '/store/count/adjust/detail',
                component: () => import('./components/store/adjust-count-stock.vue'),
                meta: {moduleId: 'store', title: '库存数量调整'}
              }
            ]
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
            path: '/store/history/bizServing',
            component: () => import('./components/store/history-store.vue'),
            meta: {moduleId: 'store', title: '历史库存查询(含人份)', perm: 'cerp-stock-query-history', isBizServing: true}
          },
          {
            path: '/store/history',
            component: () => import('./components/store/history-store.vue'),
            meta: {moduleId: 'store', title: '历史库存查询', perm: 'cerp-stock-query-history-bizServing'}
          },
          {
            path: '/store/allotment/:id',
            component: () => import('./components/purchase/allotment/list.vue'),
            meta: {moduleId: 'purchase', title: '调拨入库', perm: 'allocating-order-manager'}
          },
          {
            path: '/store/allotment/out/:id',
            component: () => import('./components/store/allotment-out/list.vue'),
            meta: {moduleId: 'purchase', title: '调拨出库', perm: 'allocating-out-order-manager'}
          },
          {
            path: '/store/bad/:id',
            component: () => import('./components/store/breakage-order/list.vue'),
            meta: {moduleId: 'store', title: '报损出库', perm: 'breakage-order'}
          }
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
            path: '/collection/pov',
            component: resolve => require(['./components/finance/operation/collection/list.vue'], resolve),
            meta: {
              moduleId: 'finance', title: 'POV付款作业', perm: 'pov-payment-payable', type: 1,
              perms: ['pov-payment-payable-add', 'pov-payment-payable-audit', 'pov-payment-payable-cancel']
            }
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
              moduleId: 'finance', title: '收款作业', perm: 'cdc-payment-receivable', type: 2,
              perms: ['cdc-payment-receivable-add', 'cdc-payment-receivable-audit',
                'cdc-payment-receivable-review', 'cdc-payment-receivable-cancel']
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
            path: '/finance/supplier',
            component: () => import('./components/finance/vaccine/list.vue'),
            meta: {moduleId: 'finance', title: '疫苗入库明细', perm: 'vaccine-vendor-reconciliation'}
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
            meta: {moduleId: 'report', title: '免疫规划疫苗各区出货统计表', perm: 'first-vaccine-out-form-manager'}
          },
          {
            path: '/report/month/repertory',
            component: () => import('./components/report/month-end-repertory.vue'),
            meta: {moduleId: 'report', title: '非免疫规划疫苗月终库存盘点表', perm: 'month-stock-inventory-form-manager'}
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
            meta: {moduleId: 'report', title: '免疫规划苗领用记录', perm: 'cdc-free-vaccine-sale-manager'}
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
          },
          {
            path: '/report/vaccine/use',
            component: () => import('./components/report/use-records.vue'),
            meta: {
              moduleId: 'report',
              title: '疫苗使用情况统计',
              perm: 'pov-injection-task-used-query',
              icon: 'el-icon-t-baobiao'
            }
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
            path: '/resource/second-vaccin/list',
            component: () => import('./components/resource/vaccin/secondVaccin/list.vue'),
            meta: {moduleId: 'resource', title: '疫苗产品资料', perm: 'second-vaccine-info'}
          },
          {
            path: '/resource/store',
            component: () => import('./components/resource/store/list.vue'),
            meta: {moduleId: 'resource', title: '仓库管理', perm: 'binding-warehouse'}
          },
          {
            path: '/resource/material',
            component: () => import('./components/resource/material/list.vue'),
            meta: {moduleId: 'resource', title: '物料管理', perm: 'supplies-manager'}
          }
        ]
      },
      {
        path: '/sys/setting',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'sys', title: '系统设置', icon: 'sys-setting', perm: 'vss-sys-setting'},
        children: [
          {
            path: '/sys/setting/switch',
            component: () => import('./components/resource/codeSwitch/codeSwitch.vue'),
            meta: {moduleId: 'sys', title: '扫码开关', perm: 'scan-code-switch'}
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
