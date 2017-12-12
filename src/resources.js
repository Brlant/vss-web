import { Notification } from 'element-ui/lib/notification';
import axios from 'axios';
import Vue from 'vue';
import qs from 'qs';

export const http = axios.create({
  baseURL: process.env.NODE_API,
  timeout: 30000,
  withCredentials: true
});

http.interceptors.response.use(response => {
  return response;
}, error => {
  let noticeTipKey = 'noticeError';
  let notice = window.localStorage.getItem(noticeTipKey);
  let response = error.response;

  if (notice === '1' && response.status !== 401) {
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
      message: '非法请求',
      onClose: function () {
        window.localStorage.removeItem(noticeTipKey);
      }
    });
  }

  if (response.status === 502) {
    Notification.error({
      message: '网络异常',
      onClose: function () {
        window.localStorage.removeItem(noticeTipKey);
      }
    });
  }
  return Promise.reject(error);
});

Vue.prototype.$http = http;

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
    return http.get(`/erp-access/org/${orgId}/admin/menus`);
  },
  getOrgRoleMenus: (orgId) => {
    return http.get('/oms/access/org/' + orgId + '/admin/menus');
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
  }
});

export const System = resource('/oms/access', http, {
  getRoleMenus: (orgId) => {
    return http.get(`/erp-access/org/${orgId}/admin/menus`);
  },
  getOrgRoleMenus: (orgId) => {
    return http.get('/oms/access/org/' + orgId + '/admin/menus');
  },
  getOrgRole: (orgId, params) => {
    params.objectId = 'cerp-system';
    return http.get('/oms/access/orgs/' + orgId, {params});
  },
  getRoleDetail: (roleId) => {
    return http.get('/oms/access/' + roleId);
  },

  querySystemAccess: (params) => {
    return http.get('/oms/access/', {params});
  },
  save: (obj) => {
    return http.post('/erp-access/system', obj);
  }
});

// 平台用户权限对象
export const User = resource('/oms/user', http, {
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

// erp订单
export const erpOrder = resource('/erp-order', http, {
  queryStateNum(params) {
    return http.get('/erp-order/count', {params});
  },
  updateOrder(orderId, obj) {
    return http.put(`/erp-order/${orderId}/detail`, obj);
  },
  cancel(orderId) {
    return http.put(`/erp-order/${orderId}/cancel`);
  }
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

// 订单
export const Order = resource('/order', http, {
  check: (orderId, obj) => {
    return http.put('/order/' + orderId + '/check', obj);
  },

  confirmOrder: (orderId) => {// 确认订单
    return http.put('/order-status/' + orderId + '/confirm');
  },
  cancelOrder: (orderId, obj) => {// 取消订单
    return http.put('/order-status/' + orderId + '/cancel', obj);
  },

  // 订单
  examineOrder: (orderId, obj) => {// 审单
    return http.put('/order-status/' + orderId + '/examine', obj);
  },
  receiptOrder: (orderId) => {// 确认收货
    return http.put('/order-status/' + orderId + '/receipt');
  },
  acceptanceOrder: (orderId) => {// 验收通过
    return http.put('/order-status/' + orderId + '/acceptance');
  },
  rejectionOrder: (orderId, obj) => {// 拒收
    return http.put('/order-status/' + orderId + '/rejection', obj);
  },

  rejectionReviewOrder: (orderId, obj) => {// 确认复核
    return http.put('/order-status/' + orderId + '/rejection-review/reject', obj);
  },
  terminationRejection: (orderId, obj) => {// 中止拒收
    return http.put('/order-status/' + orderId + '/rejection-review/stop', obj);
  },
  agreementReceiptOrder: (orderId, obj) => {// 取消拒收
    return http.put('/order-status/' + orderId + '/check-receipt', obj);
  },
  affirmRejectionOrder: (orderId, obj) => {// 确认拒收
    return http.put('/order-status/' + orderId + '/check-rejection', obj);
  },
  stockOrder: (orderId) => {// 货品上架
    return http.put('/order-status/' + orderId + '/stock');
  },
  // 出库单
  pickingOutOrder: (orderId) => {// 货品下架
    return http.put('/order-status/' + orderId + '/picking-out');
  },
  generationOrder: (orderId) => {// 生成出库单
    return http.put('/order-status/' + orderId + '/generation');
  },
  packageOrder: (orderId) => {// 出库单打包
    return http.put('/order-status/' + orderId + '/package');
  },
  outgoingCompletedOrder: (orderId) => {// 确认出库
    return http.put('/order-status/' + orderId + '/outgoing-completed');
  },
  distributionOrder: (orderId) => {// 确认配送
    return http.put('/order-status/' + orderId + '/distribution');
  },
  signOrder: (orderId) => {// 客户签收
    return http.put('/order-status/' + orderId + '/sign');
  },
  // 查询异常
  queryOrderExcepiton: (params) => {
    return http.get('/erp-order/quality-exception', {params});
  },
  queryStateNum: function (params) {
    return http.get('/order/count/', {params});
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
 *
 * @type {the}
 */
export const BriceGroupPov = resource('/pov-sale-group/', http, {});

/**
 *
 * @type {the}
 */
export const BriceGroup = resource('/sale-price-group/', http, {
  querySum(params) {
    return http.get('sale-price-group/count', {params});
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

// 疫苗采购协议对象
export const PurchaseAgreement = resource('/purchase-agreement', http, {
  queryValidVaccin(params) {
    return http.get('/purchase-agreement/valid/pager', {params});
  },
  queryStateNum: (params) => {
    return http.get('/purchase-agreement/count', {params});
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
export const erpStock = resource('/erp-stock', http, {});

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
  createOrder (key) {
    return http.put(`/procurement-demand/${key}/sales-ticket`);
  },
  queryDetailList (key) {
    return http.get(`/procurement-demand/${key}/goods`);
  },
  queryStateNum (params) {
    return http.get('/procurement-demand/count', {params});
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
  cancel(key) {
    return http.put(`/pull-signal/cancel/${key}`);
  },
  queryCount(params) {
    return http.get('/pull-signal/count', {params});
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

// 货主货品
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

// 货品管理
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
  // 根据组织机构关系类型列表分页查询组织信息
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
  // 一键审核组织基础信息(同时审核单位基本信息、经营范围、执照信息,并审核基础信息模块)
  auditBaseInfo: (orgId, obj) => {
    return http.put('/orgs/' + orgId + '/check', obj);
  },
  // 根据业务关系查询相关的单位
  queryOrgByReation: (orgId, obj) => {
    return http.get('/orgs/' + orgId + '/relation/', {params: obj});
  },
  // 根据业务关系查询相关的单位
  queryOrgByValidReation: (orgId, obj) => {
    return http.get('/orgs/' + orgId + '/valid-relation/', {params: obj});
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

