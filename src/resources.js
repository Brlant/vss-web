import { Notification } from 'element-ui';
import axios from 'axios';
import Vue from 'vue';
import qs from 'qs';

export const http = axios.create({
  baseURL: process.env.NODE_API,
  timeout: 10000,
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
export const LogisticsCenter = resource('logisticsCenter', http, {});

// store存储位对象
export const Store = resource('store', http, {});

// packingScheme包装方案对象
export const PackingScheme = resource('packing-scheme', http, {
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
export const Dev = resource('dev', http, {});

// devDetail设备详情对象
export const DevDetail = resource('dev-detail', http, {
  checkDevNo: (devNo, id, devId) => {
    return http.get('/dev-detail/devNo', {
      params: {devNo: devNo, id: id, devId: devId}
    });
  }
});

// devStore设备存储对象
export const DevStore = resource('dev-store', http, {
  queryDevPager: (id, params) => {
    return http.get('/dev-store/dev/' + id, {params});
  }
});

// oms附件对象
export const OmsAttachment = resource('omsAttachment', http, {
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
  },
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
    return http.put('oms/user/password', Obj);
  },
  forget: (obj) => {
    return http.post('oms/user/password/verifyMail', obj);
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
    return http.put('bizRelation/' + id + '/check', obj);
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
});

// 数据字典组对象
export const DictGroup = resource('dictGroup', http, {
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
// 订单
export const Order = resource('/order', http, {});


/**
 * 库存波次
 * @type {the}
 */
export const Batch = resource('/stock-batch', http, {});

/**
 * 批号对象
 * @type {the}
 */
export const BatchNumber = resource('/batch-number', http, {});

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
    return http.get(`/order/${orderId}`);
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
 * 应收款项
 * @type {the}
 */
export const pay = resource('/accounts-payable', http, {
  modifyDetail (id, obj) {
    return http.put(`/accounts-payable/${id}`, obj);
  },
  queryDetail (id, params) {
    return http.get(`/accounts-payable/${id}/detail`, {params});
  },
  addDetail (id, obj) {
    return http.post(`/accounts-payable/${id}/detail`, obj);
  }
});


/**
 * 应收款项
 * @type {the}
 */
export const receipt = resource('accounts-receivable', http, {
  modifyDetail (id, obj) {
    return http.put(`/accounts-receivable/detail/${id}`, obj);
  },
  queryDetail (id, params) {
    return http.get(`/accounts-receivable/${id}/detail`, {params});
  },
  addDetail (id, obj) {
    return http.post(`/accounts-receivable/${id}/detail`, obj);
  }
});



// 要货需求分配
export const demandAssignment = resource('/demand-assignment', http, {
  queryDetailList (key) {
    return http.get(`/demand-assignment/${key}/goods`);
  },
  assignmentGoods (params) {
    // return http.get('/demand-assignment/goods', {params});
    return http({
      url: '/demand-assignment/goods',
      params,
      paramsSerializer (params) {
        return qs.stringify(params, {indices: false});
      }
    });
  },
  allotVaccine (ary) {
    return http.put('/demand-assignment/assign/vaccine', ary);
  },
  createOrder (key) {
    return http.put(`/demand-assignment/${key}/sales-ticket`);
  }
});

// 要货申请
export const pullSignal = resource('/pull-signal', http, {
  audit (key) {
    return http.put(`/pull-signal/audit/${key}`);
  },
  cancel (key) {
    return http.put(`/pull-signal/cancel/${key}`);
  },
  queryCount (params) {
    return http.get('/pull-signal/count', {params});
  }
});

// 疫苗
export const Vaccine = resource('/vaccine-info', http, {
  queryVaccineDetail: (id) => {
    return http.get('/vaccine-info/' + id, {});
  },
  queryAvaliableVaccine: (params) => {
    return http.get('/vaccine-info/page', {params});
  },
  queryAllVaccine: (params) => {
    return http.get('/vaccine-info/valid', {params});
  },
  queryLevelVaccine () {
    return http.get('/vaccine-info/filter');
  }
});

// 疫苗授权
export const VaccineRights = resource('/vaccine-authorization', http, {
  queryVaccineByPov (povId, params) {
    return http.get(`/vaccine-authorization/${povId}`, {params});
  },
  deleteVaccine (id) {
    return http.put(`/vaccine-authorization/detail/${id}`);
  }
});

/**
 * 绑定操作
 *
 */
export const cerpAccess = resource('', http, {
  bindMunicipal () { // 绑定cdc角色
    return http.put('/erp-access/bind/municipal');
  },
  bindDistrict (id) { // 市级绑定区县CDC
    return http.put(`/erp-access/bind/district/${id}`);
  },
  bindPov (cdcId, id) { // 绑定pov
    // return http.put(`/erp-access/bind/pov/${id}`, {params: {cdcId}});
    return http({
      url: `/erp-access/bind/pov/${id}`,
      method: 'put',
      params: {
        cdcId
      },
      paramsSerializer: function (params) {
        return qs.stringify(params);
      },
    });
  }
});

export const cerpAction = resource('/outbound/count', http, {
  queryCount (params) { // 查询县级cdc
    return http.get('/erp-org/county', {params});
  },
  queryLevel () { // 查询货主权限
    return http.get('/erp-org/org-level');
  },
  queryPov (id, params) { // 查询pov
    return http.get(`/erp-org/${id}/pov`, {params});
  },
  queryAllPov (params) {
    return http.get('/erp-org/pov', {params});
  },
  queryPovList (params) { // 查询还没绑定的pov
    return http.get('/erp-org/pov-list', {params});
  },
  queryCdcList (params) { // 查询还没绑定的cdc
    return http.get('/erp-org/cdc-list', {params});
  },
  querySubordinate (params) {
    return http.get('/erp-org/subordinate', {params});
  },
  deletePov (id) {
    return http.delete(`/erp-access/pov/${id}`);
  },
  deleteCdc (id) {
    return http.delete(`/erp-access/cdc/${id}`);
  },
  queryOnCDCs () {
    return http.get(`/erp-org/superior`);
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
    return http.get(`/order/${id}`);
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
    return http.get('/orgs/goods/' + id, {});
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
    return http.get('goods/count', {params});
  }
});

// 货主-基本信息
export const BaseInfo = resource('/orgs', http, {
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
    return http.get('orgs/manufacturerCode', {
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

