import Notification from 'element-ui/lib/notification';
import axios from 'axios';
import Vue from 'vue';
import qs from 'qs';
import * as Sentry from '@sentry/browser';

export const http = axios.create({
  baseURL: process.env.VUE_APP_API,
  // 请求超时改成1分钟
  timeout: 60 * 1000,
  withCredentials: true
});

// axios.defaults.retry = 1; // 重试次数
// axios.defaults.retryDelay = 0;// 重试延时
// axios.defaults.shouldRetry = () => true;// 重试条件，默认只要是错误都需要重试

function twoRequest(response) {
  const config = response.config;
  config.url = config.url.slice(4);
  // 判断是否配置了重试
  if (!config || !config.retry) return response;

  if (!config.shouldRetry || typeof config.shouldRetry !== 'function') {
    return response;
  }
  // // 判断是否满足重试条件
  if (!config.shouldRetry(response)) {
    return response;
  }
  // 设置重置次数，默认为0
  config.__retryCount = config.__retryCount || 0;

  // 判断是否超过了重试次数
  if (config.__retryCount >= config.retry) {
    return response;
  }

  // 重试次数自增
  config.__retryCount += 1;

  // 延时处理
  const backoff = new Promise(function (resolve) {
    setTimeout(function () {
      resolve();
    }, config.retryDelay || 1);
  });

  // 重新发起axios请求
  backoff.then(function () {
    return axios(config);
  });
}


function isNewReturnType(data) {
  let keys = Object.keys(data);
  if (keys.length !== 3) return false;
  return ['code', 'data', 'msg'].every(e => keys.includes(e));
}

// 添加请求拦截器
http.interceptors.request.use(function (config) {
  try {
    let data = JSON.parse(window.localStorage.getItem('user'));
    let u = {
      'username': data.userName,
      'id': data.userId
    };
    Sentry.setUser(u);
  } catch (e) {
  }
  if (config.method === 'get') {
    config.paramsSerializer = params => {
      return qs.stringify(params, {indices: false});
    };
  }
  return config;
});

http.interceptors.response.use(response => {
  // debugger
  if (isNewReturnType(response.data)) {
    switch (response.data.code) {
      case 200 :
        return response.data;
      case 401:
        window.location.href = '#/login';
        return Promise.reject({response});
      case 403:
        Notification.error({
          message: '您没有权限请求信息，请联系管理员。',
          onClose: function () {
            window.localStorage.removeItem('noticeError');
          }
        });
        return Promise.reject({response});
      case 400:
        return Promise.reject({response});
      default:
        return Promise.reject({response});
    }
  } else {
    return response;
  }
}, error => {
  let noticeTipKey = 'noticeError';
  let notice = window.localStorage.getItem(noticeTipKey);
  let response = error.response;

  // debugger
  if (notice === '1' && response && response.status !== 401) {
    return Promise.reject(error);
  } else {
    window.localStorage.setItem(noticeTipKey, '1');
  }

  if (!response || response.status === 500) {
    Notification.warning({
      message: '服务器太久没有响应, 请重试',
      onClose: function () {
        window.localStorage.removeItem(noticeTipKey);
      }
    });
    return Promise.reject(error);
  }
  if (response.status === 401) { //  Unauthorized, redirect to login
    let lastUrl = window.localStorage.getItem('lastUrl');
    if (!lastUrl || lastUrl.indexOf('/base/dict') === -1) {
    }
    window.location.href = '#/login';
    return Promise.reject(error);
  }
  if (response.status === 403) {
    Notification.error({
      message: '您没有权限请求信息，请联系管理员。',
      onClose: function () {
        window.localStorage.removeItem(noticeTipKey);
      }
    });
  }

  if (response.status === 502) {
    Notification.error({
      message: '系统请求失败',
      onClose: function () {
        window.localStorage.removeItem(noticeTipKey);
      }
    });
  }
  return Promise.reject(error);
});

Vue.prototype.$http = http;

export const returnRequest = resource('/return-application', http, {
  povQuery(params) {
    return http.get('/return-application/pov', {params});
  },
  povQueryCount(params) {
    return http.get('/return-application/count', {params});
  },
  povAudit(obj) {
    return http.put('/return-application/pov-audit', obj);
  },
  cancel(id) {
    return http.put(`/return-application/cancel/${id}`);
  },
  cdcQuery(params) {
    return http.get('/return-application/cdc', {params});
  },
  cdcQueryCount(params) {
    return http.get('/return-application/cdc/count', {params});
  },
  cdcAudit(obj) {
    return http.put('/return-application/cdc-audit', obj);
  }
});

// 多人份剂次时效管理
export const multiAging = resource('/multi-person-aging', http, {
  queryStateNum(params) {
    return http.get('/multi-person-aging/count', {params});
  }
});

// 受种者档案
export const inoculateInfo = resource('/inoculator-info', http);

// 接种任务
export const inoculateTask = resource('/injection-task', http, {
  save(obj) {
    return http.post('/injection-task/add-vaccination-task', obj);
  },
  queryStateNum(params) {
    return http.get('/injection-task/count', {params});
  },
  cancelTask(id) {
    return http.get(`/injection-task/cancel-task/${id}`);
  },
  update(obj) {
    return http.post('/injection-task/edit-vaccination-task', obj);
  },
  queryDetail(id) {
    return http.get(`/injection-task/queryInfo/${id}`);
  },
  reviewCode(params) {
    return http.get('/injection-task/code/review', {params});
  },
  confirmTask(obj) {
    return http.post('/injection-task/confirm-task', obj);
  }
});

// 接种平台
export const inoculatePlatform = resource('', http);

// pov盘点对象
export const Inventory = resource('/erp-inventory', http, {
  queryDetail(id, params) {
    return http.get(`/erp-inventory/${id}/detail`, {params});
  },
  queryStatusNum(id) {
    return http.get(`/erp-inventory/${id}/detail/count`);
  },
  editDetailCount(id, obj) {
    return http.put(`/erp-inventory/detail/${id}`, obj);
  }
});

// CDC收款
export const CDCReceipt = resource('/cdc-bill', http, {
  audit: (id, obj) => {
    return http.put(`/cdc-bill/audit/${id}`, obj);
  },
  review: (id) => {
    return http.put(`/cdc-bill/review/${id}`);
  }
});

// POV付款
export const POVPayment = resource('/pov-bill', http, {
  audit: (id, obj) => {
    return http.put(`/pov-bill/audit/${id}`, obj);
  },
  queryStateNum(params) {
    return http.get('/pov-bill/count', {params});
  }
});

// 预付款作业对象
export const PaymentPending = resource('/advance-payment', http, {
  query(type, params) {
    return http.get(type === 1 ? '/advance-payment/log/pov/pager' : '/advance-payment/log/cdc/pager', {params});
  },
  save(type, obj) {
    return http.post(type === 1 ? '/advance-payment' : '/advance-payment/cdc', obj);
  },
  queryStateNum(type, params) {
    return http.get(`/advance-payment/count/${type === 1 ? 'pov' : 'cdc'}`, {params});
  },
  queryPaymentTotal(params) {
    return http.get('/advance-payment/detail', {params});
  },
  queryPaymentTotalList(params) {
    return http.get('/advance-payment/pager', {params});
  }
});

// logisticsCenter物流中心对象
export const LogisticsCenter = resource('/logisticsCenter', http, {});

// store存储位对象
export const Store = resource('/store', http, {});

// packingScheme包装方案对象
export const PackingScheme = resource('/packing-scheme', http, {
  start: (id) => {
    return http.put('/packing-scheme/' + id + '/enable', {});
  },
  forbid: (id) => {
    return http.delete('/packing-scheme/' + id, {});
  },
  queryStateNum: (params) => {
    return http.get('/packing-scheme/count', {params});
  }
});

// dev设备对象
export const Dev = resource('/dev', http, {});

// devDetail设备详情对象
export const DevDetail = resource('/dev-detail', http, {
  checkDevNo: (devNo, id, devId) => {
    return http.get('/dev-detail/devNo', {
      params: {devNo: devNo, id: id, devId: devId}
    });
  }
});

// devStore设备存储对象
export const DevStore = resource('/dev-store', http, {
  queryDevPager: (id, params) => {
    return http.get('/dev-store/dev/' + id, {params});
  }
});

// oms附件对象
export const OmsAttachment = resource('/omsAttachment', http, {
  queryOneAttachmentList: (objectId, objectType) => {
    return http.get('/omsAttachment/' + objectType + '/' + objectId, {});
  }
});

// 货主用户权限对象
export const OrgUser = resource('/oms/user/org', http, {
  queryOrgInfo: (id, params) => {
    return http.get('/oms/user/org/' + id, {params});
  },
  queryUsers: (id, params) => {
    return http.get(`/erp-org/${id}/users`, {params});
  }
});

// 角色管理对象
export const Access = resource('/oms/access', http, {
  getRoleMenus: (orgId) => {
    return http.get(`/erp-access/org/${orgId}/admin/menus/tree`);
  },
  getOmsRoleMenus: () => {
    return http.get('oms/access/menus/tree');
  },
  getOrgRoleMenus: (orgId) => {
    return http.get('/oms/access/org/' + orgId + '/admin/menus/tree');
  },
  getOrgRole: (orgId, params) => {
    params.objectId = 'cerp-system';
    return http.get('/oms/access/orgs/' + orgId, {params});
  },
  getRoleDetail: (roleId) => {
    return http.get('/oms/access/' + roleId);
  },
  queryERPAccess: (params) => {
    return http.get('/erp-access/orgs/self/', {params});
  },
  save: (obj) => {
    return http.post('/erp-access', obj);
  },
  queryStateNum: (params) => {
    return http.get('/oms/access/platform/count', {params});
  },
  queryErpStateNum: (params) => {
    return http.get('/erp-access/platform/count', {params});
  },
  querySystemAccess: (params) => {
    return http.get('/oms/access/', {params});
  },
  saveSystem: (obj) => {
    return http.post('/erp-access/system', obj);
  }
});

// 平台用户权限对象
export const User = resource('/oms/user', http, {
  queryAllUser: (params) => {
    return http.get('/oms/user/all', {params}
    );
  },
  checkEmail: (email, userId, orgId) => {
    return http.get('/oms/user/email', {
      params: {email: email, userId: userId, orgId: orgId}
    });
  },
  checkPhone: (phone, userId, orgId) => {
    return http.get('/oms/user/phone', {
      params: {phone: phone, userId: userId, orgId: orgId}
    });
  },
  resetPsw: (Obj) => {
    return http.put('/oms/user/password', Obj);
  },
  forget: (obj) => {
    return http.post('/oms/user/password/verifyMail', obj);
  },
  stopUser: (userId) => {
    return http.put(`/oms/user/${userId}/stop`);
  },
  enableUser: (userId) => {
    return http.put(`/oms/user/${userId}/enablement`);
  }
});

export const Auth = {
  checkLogin: () => {
    return http.get('/userinfo');
  },
  login: (data) => {
    return http.post('/login', data);
  },
  wxLogin: (data) => {
    return http.post('/wechat/login', data);
  },
  logout: () => {
    return http.get('/logout');
  },
  isLogin() {
    try {
      return User.current();
    } catch (e) {
      Notification.error('用户信息出错，请重新登录!');
    }
  },
  permission: () => {
    return http.get('/oms/access/permissions', {params: {objectId: 'cerp-system'}});
  }
};

// 业务关系
export const bizRelation = resource('/bizRelation', http, {
  queryRelationorg: (id) => {
    return http.get('/bizRelation/' + id, {});
  },
  check: (id, obj) => {
    return http.put('/bizRelation/' + id + '/check', obj);
  },
  queryStateNum: (params) => {
    return http.get('/bizRelation/count', {params});
  }
});

// 厂商资料
export const Vendor = resource('/vendor-info', http, {
  queryVendorDetail: (orgId) => {
    return http.get(`/vendor-info/${orgId}`);
  },
  save: obj => http.post('/vendor-info', obj),
  update: (id, obj) => {
    return http.put('/vendor-info', obj);
  },
  queryStateNum: (params) => {
    return http.get('/vendor-info/count', {params});
  }
});

// 数据字典组对象
export const DictGroup = resource('/dictGroup', http, {
  checkGroupName: (groupName, groupId) => {
    return http.get('/dictGroup/name', {
      params: {groupName: groupName, groupId: groupId}
    });
  },
  checkItemKey: (key, itemId, groupId) => {
    return http.get('/dictItem/key', {
      params: {key: key, itemId: itemId, groupId: groupId}
    });
  },
  getAll: () => {
    return new Promise((resolve) => {
      http.get('/dictGroups').then(res => {
        let data = {};
        let groupItem;
        let item;
        for (let i = 0, len = res.data.length; i < len; i++) {
          groupItem = res.data[i];
          data[groupItem.group.name] = [];
          for (let j = 0, len1 = groupItem.items.length; j < len1; j++) {
            item = groupItem.items[j];
            data[groupItem.group.name].push({key: item.key, label: item.label});
          }
        }
        resolve(data);
      });
    });
  }
});

// 物料管理
export const material = resource('/material', http, {});

// erp订单
export const vaccineBills = resource('/factory-reconciliation', http, {});

// 收货信息
export const receiptApi = resource('/receipt', http, {
  batchReceipt(obj) {
    return http.post('erp-order/receipt/batch', obj);
  },
  changeReceipt(obj) {
    return http.post('/receipt/order-detail/change', obj);
  },
  queryHistoryInfo(detailId) {
    return http.get(`/receipt/order-detail/${detailId}/history`);
  },
  checkPass(checkId) {
    return http.post(`/receipt/audit/${checkId}/success`);
  },
  checkNoPass(checkId) {
    return http.post(`/receipt/audit/${checkId}/fail`);
  }
});

// erp订单
export const erpOrder = resource('/erp-order', http, {
  queryStateNum(params) {
    return http.get('/erp-order/count', {params});
  },
  updateOrder(orderId, obj) {
    return http.put(`/erp-order/${orderId}/detail`, obj);
  },
  cancel(orderId, obj) {
    return http.put(`/erp-order/${orderId}/cancel`, obj);
  },
  // 查询异常
  queryOrderExcepiton: (params) => {
    return http.get('/erp-order/quality-exception', {params});
  },
  receiptOrder: (orderId, params) => {// 确认收货
    return http.post('/erp-order/' + orderId + '/receipt/in/complete', {});
  },
  batchReceipt(obj) {
    return http.post('/receipt/batch', obj);
  },
});

/**
 * 采购合同
 * @type {the}
 */
export const PurchaseContract = resource('/purchase-contract', http, {
  queryStateNum(params) {
    return http.get('/purchase-contract/count', {params});
  },
  updateOrder(orderId, obj) {
    return http.put(`/purchase-contract/${orderId}/detail`, obj);
  },
  updatePurchaseContractName(orderId, obj) {
    return http.put(`/purchase-contract/${orderId}/detail/name`, obj);
  },
  cancel(orderId) {
    return http.put(`/purchase-contract/${orderId}/cancel`);
  },
  queryContractDetail(id) { // 查询订单详细
    return http.get(`/purchase-contract/${id}`);
  },
  batchCreateOrder(id) {// 批量生成采购订单
    return http.put(`/purchase-contract/${id}/batch/order`);
  },
  synchroContract(id) {// 同步采购合同
    return http.put(`/purchase-contract/${id}/synchro`);
  },
  start(id) {
    return http.put(`/purchase-contract/${id}/start`);
  },
  stop(id) {
    return http.put(`/purchase-contract/${id}/enable`);
  }
});

/**
 *发票信息
 * @type {the}
 */
export const invoiceManage = resource('/invoice/', http, {
  queryCount(params) {
    return http.get('/invoice/count', {params});
  },
  save(obj) {
    return http.post('/invoice/request', obj);
  }
});


/**
 * 库存波次
 * @type {the}
 */
export const Batch = resource('/stock-batch', http, {});

/**
 * 批号对象
 * @type {the}
 */
export const BatchNumber = resource('/erp-batch', http, {});

/**
 * 波次作业
 */
export const Wave = resource('/wave-task', http, {
  queryOmsOrder(obj) {
    return http.get('/order', {params: obj});
  },
  queryWaveCount(obj) {
    return http.get('/wave-task/count', {params: obj});
  },
  queryOrderDetail(orderId) {
    return http.get(`/order/${orderId}`, {params: {lockFlag: false}});
  },
  queryOperator(params) {
    return http.get('/wave-task/operator', {params});
  },
  assignOperator(obj) {
    return http.put(`/wave-task/${obj.id}/assign`, obj);
  },
  queryGoodsPlace(id) {
    return http.get(`/wave-task/${id}/store`);
  },
  queryAddress: (id, params) => {
    return http.get('/orgAddressInfo/' + id, {params});
  },
  queryCodes(id) {
    return http.get(`/review-code/${id}/code`);
  },
  submit(waveId, list) {
    return http.put(`/review-code/${waveId}/review`, list);
  },
  deleteCode(logId) {
    return http.delete(`/review-code/${logId}`);
  },
  reviewPass(waveId) {
    return http.put(`/review-code/${waveId}/review/operate`);
  },
  packComplete(waveId) {
    return http.put(`/wave-task/${waveId}/packing`);
  }
});

// 仓库地址
export const Address = resource('/binding-warehouse', http, {
  queryAddress: (id, params) => {
    return http.get('/binding-warehouse/list', {params});
  },
  check: (id, obj) => {
    return http.put('/binding-warehouse/' + id + '/check', obj);
  },
  forbid: function (id) {
    return http.put('/binding-warehouse/' + id + '/forbid', {});
  },
  start: function (id) {
    return http.put('/binding-warehouse/' + id + '/start', {});
  },
  queryStateNum: (params) => {
    return http.get('/binding-warehouse/count', {params});
  }
});

export const Plan = resource('/plan/', http, {
  queryOrderCount: (params) => {
    return http.get('/plan', {
      params: {
        date: params
      }
    });
  }
});

export const outWork = resource('/outbound/count', http, {
  queryOrderCount(obj) {
    return http.get('/outbound/count', {params: obj});
  }
});

/**
 * erp库存批次
 * @type {the}
 */
export const erpStock = resource('/erp-stock', http, {
  queryHistory(params) {
    return http.get('/erp-stock/history', {params});
  },
  queryHistoryDetail(infoId, stockId) {
    return http.get(`/erp-stock/history/${infoId}/stock/${stockId}/detail`);
  }
});

/**
 * 物流费用
 * @type {the}
 */
export const logisticsCost = resource('/logistics-cost', http, {});

/**
 * pov收货
 * @type {the}
 */
export const povReceipt = resource('/erp-receipt', http, {
  queryWasks(params) {
    return http.get('/erp-receipt/order', {params});
  },
  queryWaskGoods(orderId) {
    return http.get(`/erp-receipt/order/${orderId}/goods`);
  },
  save(id, obj) {
    return http.post(`/erp-receipt/${id}`, obj);
  }
});

/**
 * 付款作业
 * @type {the}
 */
export const BillPayable = resource('/bill-payable', http, {
  auditInfo(id, obj) {
    return http.put(`/bill-payable/audit/${id}`, obj);
  },
  refusedInfo(id, obj) {
    return http.put(`/bill-payable/refused/${id}`, obj);
  },
  banding(id, obj) {
    return http.put(`/bill-payable/banding/${id}`, obj);
  },
  queryStateNum: (params) => {
    return http.get('/bill-payable/count', {params});
  },
  save(obj) {
    return http.post('/bill-payable/request', obj);
  }
});

/**
 * 收款作业
 * @type {the}
 */
export const BillReceivable = resource('/bill-receivable', http, {
  auditInfo(id, obj) {
    return http.put(`/bill-receivable/audit/${id}`, obj);
  },
  refusedInfo(id, obj) {
    return http.put(`/bill-receivable/refused/${id}`, obj);
  },
  banding(id, obj) {
    return http.put(`/bill-receivable/banding/${id}`, obj);
  },
  queryStateNum: (params) => {
    return http.get('/bill-receivable/count', {params});
  },
  save(obj) {
    return http.post('/bill-receivable/request', obj);
  }
});

/**
 * 应付款项
 * @type {the}
 */
export const pay = resource('/accounts-payable', http, {
  modifyDetail(id, obj) {
    return http.post(`/accounts-payable/detail/${id}/log`, obj);
  },
  queryDetail(id, params) {
    return http.get(`/accounts-payable/${id}/detail`, {params});
  },
  queryDetailByfy(id, params) {
    return http.get(`/accounts-payable/remittee/${id}/detail`, {params});
  },
  addDetail(id, obj) {
    return http.post(`/accounts-payable/${id}/detail`, obj);
  },
  getAmountInfo(id) {
    return http.get('/accounts-payable/' + id + '/amount');
  }
});

/**
 * 应收款项
 * @type {the}
 */
export const receivable = resource('/accounts-receivable', http, {
  modifyDetail(id, obj) {
    return http.post(`/accounts-receivable/detail/${id}/log`, obj);
  },
  queryDetail(id, params) {
    return http.get(`/accounts-receivable/${id}/detail`, {params});
  },
  addDetail(id, obj) {
    return http.post(`/accounts-receivable/${id}/detail`, obj);
  },
  getAmountInfo(id) {
    return http.get('/accounts-receivable/' + id + '/amount');
  }
});

/**
 * 中标疫苗
 * @type {the}
 */
export const SuccessfulBidder = resource('/successful-bidder', http, {
  queryInfo(params) {
    return http.get('/successful-bidder/info', {params});
  }
});

/**
 * 应收款项
 * @type {the}
 */
export const receipt = resource('accounts-receivable', http, {
  modifyDetail(id, obj) {
    return http.post(`/accounts-receivable/detail/${id}/log`, obj);
  },
  queryDetail(id, params) {
    return http.get(`/accounts-receivable/${id}/detail`, {params});
  },
  addDetail(id, obj) {
    return http.post(`/accounts-receivable/${id}/detail`, obj);
  }
});

/**
 * 采购汇总
 * @type {the}
 */
export const procurementCollect = resource('/procurement-demand', http, {
  createOrder(key) {
    return http.put(`/procurement-demand/${key}/sales-ticket`);
  },
  createPullSignal(key) {
    return http.put(`/procurement-demand/${key}/pull-signal`);
  },
  queryDetailList(key) {
    return http.get(`/procurement-demand/${key}/goods`);
  },
  queryStateNum(params) {
    return http.get('/procurement-demand/count', {params});
  },
  allotVaccine(ary) {
    return http.put('/procurement-demand/assign/vaccine', ary);
  }
});

// 要货需求分配
export const demandAssignment = resource('/demand-assignment', http, {
  queryDetailList(key) {
    return http.get(`/demand-assignment/${key}/goods`);
  },
  assignmentGoods(params) {
    // return http.get('/demand-assignment/goods', {params});
    return http({
      url: '/demand-assignment/goods',
      params,
      paramsSerializer(params) {
        return qs.stringify(params, {indices: false});
      }
    });
  },
  allotVaccine(ary) {
    return http.put('/demand-assignment/assign/vaccine', ary);
  },
  createOrder(key) {
    return http.put(`/demand-assignment/${key}/sales-ticket`);
  },
  queryStateNum(params) {
    return http.get('/demand-assignment/count', {params});
  }
});

// 要货申请
export const pullSignal = resource('/pull-signal', http, {
  audit(key) {
    return http.put(`/pull-signal/audit/${key}`);
  },
  cancel(key, data) {
    return http.put(`/pull-signal/cancel/${key}`, data);
  },
  queryCount(params) {
    return http.get('/pull-signal/count', {params});
  },
  queryCDC(params) {
    return http.get('/pull-signal/cdc', {params});
  }
});

// 疫苗
export const Vaccine = resource('/vaccine-info', http, {
  queryVaccineDetail: (id) => {
    return http.get('/vaccine-info/' + id, {});
  },
  queryFirstVaccine: (params) => {
    return http.get('/vaccine-info/first', {params});
  },
  querySecondVaccine: (params) => {
    return http.get('/vaccine-info/second', {params});
  },
  queryAvaliableVaccine: (params) => {
    return http.get('/vaccine-info/page', {params});
  },
  queryAllVaccine: (params) => {
    return http.get('/vaccine-info/valid', {params});
  },
  queryLevelVaccine() {
    return http.get('/vaccine-info/filter');
  },
  queryStateNum(params) {
    return http.get('/vaccine-info/count', {params});
  },
  checkGoodsCode: (params) => {
    return http.get('/vaccine-info/check/code', {params});
  },
  start: (id) => {
    return http.put('/vaccine-info/start/' + id, {});
  },
  startVaccineInfo: (id) => {
    return http.put('/vaccine-info/' + id + '/start', {});
  },
  stopVaccineInfo: (id) => {
    return http.put('/vaccine-info/' + id + '/stop', {});
  },
  queryVaccineByOrg(params) {
    return http.get('accounts-payable/org-goods', {params});
  }
});

// 疫苗授权
export const VaccineRights = resource('/vaccine-authorization', http, {
  queryPovByVaccine(orgGoodsId, params) {
    return http.get(`/vaccine-authorization/org-goods/${orgGoodsId}/pov`, {params});
  },
  queryVaccineByPov(povId, params) {
    return http.get(`/vaccine-authorization/${povId}`, {params});
  },
  deleteVaccine(id) {
    return http.put(`/vaccine-authorization/detail/${id}`);
  },
  batchSave(obj) {
    return http.post('/vaccine-authorization/batch', obj);
  },
  // 查询pov某一类型的疫苗信息
  queryPovVaccineByType(params) {
    return http.get('/vaccine-authorization/pov/vaccine', {params});
  }
});

/**
 * 绑定操作
 *
 */
export const cerpAccess = resource('', http, {
  bindMunicipal() { // 绑定cdc角色
    return http.put('/erp-access/bind/municipal');
  },
  bindDistrict(id) { // 市级绑定区县CDC
    return http.put(`/erp-access/bind/district/${id}`);
  },
  bindPov(cdcId, id) { // 绑定pov
    // return http.put(`/erp-access/bind/pov/${id}`, {params: {cdcId}});
    return http({
      url: `/erp-access/bind/pov/${id}`,
      method: 'put',
      params: {
        cdcId
      },
      paramsSerializer: function (params) {
        return qs.stringify(params);
      }
    });
  },
  bindChildPov(cdcId, id) { // 绑定pov
    // return http.put(`/erp-access/bind/pov/${id}`, {params: {cdcId}});
    return http({
      url: `erp-access/cdc/bind/pov/${id}`,
      method: 'put',
      params: {
        cdcId
      },
      paramsSerializer: function (params) {
        return qs.stringify(params);
      }
    });
  },
  bindAllCdcAndPov() { // 一键绑定cdc和pov
    return http.put('/erp-access/bind');
  }
});

export const cerpAction = resource('/outbound/count', http, {
  queryCount(params) { // 查询县级cdc
    return http.get('/erp-org/county', {params});
  },
  queryLevel() { // 查询货主权限
    return http.get('/erp-org/org-level');
  },
  queryPov(id, params) { // 查询pov
    return http.get(`/erp-org/${id}/pov`, {params});
  },
  queryAllPov(params) {
    return http.get('/erp-org/pov', {params});
  },
  queryPovList(params) { // 查询还没绑定的pov
    return http.get('/erp-org/pov-list', {params});
  },
  queryCdcList(params) { // 查询还没绑定的cdc
    return http.get('/erp-org/cdc-list', {params});
  },
  querySubordinate(params) {
    return http.get('/erp-org/subordinate', {params});
  },
  deletePov(id) {
    return http.delete('/erp-access/pov/' + id);
  },
  deleteCdc(id) {
    return http.delete('/erp-access/cdc/' + id);
  },
  queryOnCDCs() {
    return http.get('/erp-org/superior');
  },
  queryWeChatInfo() {
    return http.get('/erp-org/user/wechat');
  },
  unBindWeChat() {
    return http.put('/erp-org/unbind/wechat');
  }
});

/**
 * 入库作业
 * @type {the}
 */
export const InWork = resource('/stock-in', http, {
  queryOmsOrder(obj) { // 查询订单列表
    return http.get('/order', {params: obj});
  },
  queryOrderCount(obj) { // 查询订单数量
    return http.get('/stock-in/count', {params: obj});
  },
  queryOrderDetail(id) { // 查询订单详细
    return http.get(`/erp-order/${id}`);
  },
  allotPlace(obj) { // 分配货位
    return http.post('/stock-in/batch/allot', obj);
  },
  queryOperator(obj) { // 查询操作员
    return http.get('/stock-in/operator/', {params: obj});
  },
  queryOperatorOrders(obj) { // 查询操作员的任务
    return http.get('/stock-in/operator/orders', {params: obj});
  },
  allotShelfMan(orderId, obj) { // 分配上架人
    return http.put(`/stock-in/${orderId}/assign/putaway`, obj);
  },
  allotReviewer(orderId, obj) { // 分配复核人
    return http.put(`/stock-in/${orderId}/assign/reviewer`, obj);
  },
  queryAvailableStore(obj) { // 查询可用的库位
    return http.get('/stock-in/valid/store', {params: obj});
  },
  queryCodes(orderId) { // 查询编码
    return http.get(`/stock-in/${orderId}/code`);
  },
  reviewScan(orderId, obj) { // 提交编码
    return http.put(`/stock-in/${orderId}/review`, obj);
  },
  assignPlace(orderId) { // 通过复核，进入到分配货位
    return http.put(`/stock-in/${orderId}/review/operate`);
  },
  onShelf(orderId) {
    return http.put(`/stock-in/${orderId}/shelves`);
  }
});

// 货主疫苗
export const OrgGoods = resource('/org/goods', http, {
  queryOneGoods: (id) => {
    return http.get('/org/goods/' + id, {});
  },
  check: (id, obj) => {
    return http.put('/org/goods/' + id + '/check', obj);
  },
  queryStateNum: (params) => {
    return http.get('/org/goods/count', {params});
  }
});

// 疫苗管理
export const Goods = resource('/goods', http, {
  filterOrg: (orgId, params) => {
    return http.get('/goods/orgs/' + orgId, {params});
  },
  check: (id, obj) => {
    return http.put('/goods/' + id + '/check', obj);
  },
  getGoodsDetail: (id) => {
    return http.get('/goods/' + id);
  },
  queryStateNum: (params) => {
    return http.get('/goods/count', {params});
  }
});

// 货主-基本信息
export const BaseInfo = resource('/orgs', http, {
  // 根据单位机构关系类型列表分页查询单位信息
  queryByOrgRelationTypeList: (params) => {
    return http({
      url: '/orgs/relationType',
      params,
      paramsSerializer(params) {
        return qs.stringify(params, {indices: false});
      }
    });
  },
  // 查询数量
  queryStateNum: (params) => {
    return http.get('/orgs/count', {params});
  },
  // 转成货主
  turnToOwner: (orgId) => {
    return http.put('/orgs/transform/consignor/' + orgId, {});
  },
  // 一键审核单位基础信息(同时审核单位基本信息、经营范围、执照信息,并审核基础信息模块)
  auditBaseInfo: (orgId, obj) => {
    return http.put('/orgs/' + orgId + '/check', obj);
  },
  // 根据业务关系查询相关的单位
  queryOrgByReation: (orgId, obj) => {
    return http.get('/orgs/' + orgId + '/relation/', {params: obj});
  },
  // 根据业务关系查询相关的单位
  queryOrgByValidReation: (orgId, obj) => {
    obj.size = -1;
    return http.get('/orgs/' + orgId + '/valid-relation/', {params: obj});
  },
  // 根据业务关系查询相关的单位
  queryOrgByAllRelation: (orgId, obj) => {
    obj.size = -1;
    return http.get('/orgs/' + orgId + '/all-relation/', {params: obj});
  },

  //根据voss销售授权查询单位
  queryOrgByVossAuth: (orgId, obj) => {
    let params = {
      keyWord: obj.keyWord
    };
    delete obj.keyWord;
    return http({
      method: 'post',
      url: '/authorization-goods/object-org',
      params,
      data: obj
    });
  },

  // 校验邮箱
  checkEmail: (email, userId) => {
    return http.get('/oms/user/email', {
      params: {email: email, userId: userId}
    });
  },
  // 校验名字
  checkName: (name, orgId) => {
    return http.get('/orgs/name', {
      params: {name, orgId}
    });
  },
  // 校验身份证
  checkCreditCode: (creditCode, orgId) => {
    return http.get('/orgs/creditCode', {
      params: {creditCode, orgId}
    });
  },
  // 校验oms代码唯一性
  checkManufacturerCode: (code, orgId) => {
    return http.get('/orgs/manufacturerCode', {
      params: {code, orgId}
    });
  },
  // 校验管理员账户唯一性
  checkAdminAccount: (account, orgId) => {
    return http.get('/orgs/account', {
      params: {account, orgId}
    });
  },

  // 货主基本信息
  queryBaseInfo: (orgid) => {
    return http.get('/orgs/' + orgid);
  },
  // 删除客服人员
  deleteCus: (id) => {
    return http.delete('/cusService/' + id, {});
  },
  // 添加客服人员
  addCus: (obj) => {
    return http.post('/cusService', obj);
  },
  // 添加货主经营范围
  addOrgScope: (obj) => {
    return http.post('/orgScope', obj);
  },
  // 删除货主经营范围
  deleteOrgScope: (id) => {
    return http.delete('/orgScope/' + id);
  },
  // 查询其他客服人员
  queryOtherCus: (obj) => {
    return http.get('/cusService/orgs/' + obj.orgId + '/users', {obj});
  },
  // 新增受控法规
  addFg: (obj) => {
    return http.post('/bizLegislation', obj);
  },
  // 删除受控法规
  deleteFg: (id) => {
    return http.delete('/bizLegislation/' + id);
  }
});
export const Notice = resource('notice', http, {
  queryPager(params) {
    return http.get('/notice', {params});
  },
  edit(id, obj) {
    return http.put('/notice/' + id, obj);
  },
  start(id) {
    return http.put('/notice/issue/' + id);
  },
  queryStateNum(params) {
    return http.get('/notice/count', {params});
  },
  forbid(id) {
    return http.put('notice/disable/' + id);
  },
  top(id, flag) {
    return http.put('notice/top/' + id + '?flag=' + flag);
  },
  remove(id) {
    return http.delete('notice/' + id);
  }
});
export const demand = resource('', http, {
  reportedUndo(data) {
    return http.post(`/cancel-inoculated-task/breakage-order`, data);
  }
});

/**
 * create vue-resource's resource like object
 *
 * Default Actions
 *   get: {method: 'GET'}
 *   save: {method: 'POST'}
 *   query: {method: 'GET'}
 *   update: {method: 'PUT'}
 *   delete: {method: 'DELETE'}
 *
 * @param path the resource path
 * @param http axios instance
 * @param actions custom actions
 * @returns the resource object
 */
function resource(path, http, actions) {
  let obj = {
    get: id => http.get(path + '/' + id),
    save: obj => http.post(path, obj),
    query: params => http.get(path, {params}),
    update: (id, obj) => {
      let url = path + '/' + id;
      if (typeof (id) === 'object') {
        url = path;
        obj = id;
      }
      return http.put(url, obj);
    },
    delete: id => http.delete(path + '/' + id)
  };
  return Object.assign(obj, actions);
}
