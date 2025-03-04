import {Address, formatAddress} from '@dtop/dtop-web-common';

function funDownload(content, filename) {
  // 创建隐藏的可下载链接
  let eleLink = document.createElement('a');
  eleLink.download = filename;
  eleLink.style.display = 'none';
  // 字符内容转变成blob地址
  let blob = new Blob([content]);
  eleLink.href = URL.createObjectURL(blob);
  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click();
  // 然后移除
  document.body.removeChild(eleLink);
}

export default {
  address: Address.value,
  scanCodeRecordStatus: ['取消签核', '已签核'],
  requestType: {
    1: {'title': '待审批', status: 0, num: ''},
    2: {'title': '被疾控退回', status: 5, num: ''},
    3: {'title': '待疾控处理', status: 1, num: ''},
    4: {'title': '待生成订单', status: 2, num: ''},
    5: {'title': '已分配', status: 4, num: ''},
    6: {'title': '已部分分配', status: 6, num: ''},
    7: {'title': '已取消', status: 3, num: ''}
  },
  inOrderLink: {
    1: {'title': '订单确认', state: '0', num: ''},
    2: {'title': '审单', state: '1', num: ''},
    3: {'title': '收货', state: '2', num: ''},
    4: {'title': '验收', state: '3', num: ''},
    5: {'title': '订单挂起', state: '14', num: ''},
    6: {'title': '已完成', state: '4', num: ''},
    7: {'title': '已取消', state: '7', num: ''},
    8: {'title': '拒收待复核', state: '11', num: ''},
    9: {'title': '拒收已复核', state: '12', num: ''},
    10: {'title': '已拒收', state: '8', num: ''},
    11: {'title': '异常', state: '6', num: ''}
  },
  assignType: [
    {title: '待生成销售汇总', status: 1, num: ''},
    {title: '待分配销售', status: 2, num: ''},
    {title: '已部分分配', status: 6, num: ''},
    {title: '已分配销售', status: 4, num: ''},
    {title: '已取消销售', status: 3, num: ''},
    {title: '已退回销售', status: 5, num: ''},
    {title: '待生成采购汇总', status: 11, num: ''},
    {title: '已生成采购汇总', status: 12, num: ''},
    {title: '已取消采购', status: 13, num: ''}
  ],
  transitTab: {
    0: {'title': '未配送', status: 'NO', num: ''},
    1: {'title': '配送中', status: 'RUNING', num: ''},
    2: {'title': '已完成配送', status: 'OK', num: ''},
  },
  waveType: {
    0: {'title': '未分配', status: 0, num: ''},
    1: {'title': '已分配', status: 1, num: ''}
  },
  inOrderType: {
    0: {'title': '待审单', state: '6', num: ''},
    1: {'title': '待到货', state: '10', num: ''},
    2: {'title': '执行中', state: '7', num: ''},
    3: {'title': '已完成', state: '8', num: ''},
    4: {'title': '已取消', state: '9', num: ''},
    5: {'title': '已拒收', state: '5', num: ''},
    6: {'title': '异常', state: '20', num: ''}
  },
  outOrderType: {
    0: {'title': '待确认', state: '0', num: ''},
    1: {'title': '待审单', state: '1', num: ''},
    2: {'title': '执行中', state: '2', num: ''},
    3: {'title': '待交付', state: '3', num: ''},
    4: {'title': '已完成', state: '4', num: ''},
    5: {'title': '已取消', state: '5', num: ''}
  },
  outBreakageOrderType: {
    0: {'title': '待确认', state: '0', num: ''},
    1: {'title': '待复核', state: '1', num: ''},
    2: {'title': '执行中', state: '2', num: ''},
    // 3: {'title': '待收货', state: '3', num: ''},
    4: {'title': '已完成', state: '4', num: ''},
    5: {'title': '已取消', state: '5', num: ''}
  },
  //损耗填报的类型
  lossFillType: {
    0: {'title': '待确认', state: '0', num: ''},
    4: {'title': '已完成', state: '4', num: ''},
    5: {'title': '已取消', state: '5', num: ''}
  },
  outReturnOrderType: {
    0: {'title': '待确认', state: '0', num: ''},
    1: {'title': '待审单', state: '1', num: ''},
    2: {'title': '执行中', state: '2', num: ''},
    3: {'title': '待交付', state: '3', num: ''},
    4: {'title': '已完成', state: '4', num: ''},
    5: {'title': '已取消', state: '5', num: ''}
  },
  outReturnRequestType: {
    0: {'title': '待审核', state: '0', num: ''},
    1: {'title': '上级单位待审核', state: '1', num: ''},
    2: {'title': '已完成', state: '4', num: ''},
    3: {'title': '审核不通过', state: '2', num: ''},
    4: {'title': '上级单位审核不通过', state: '5', num: ''},
    5: {'title': '已取消', state: '3', num: ''}
  },
  outCdcReturnRequestType: {
    1: {'title': '待审核', state: '1', num: ''},
    2: {'title': '已完成', state: '4', num: ''},
    4: {'title': '审核不通过', state: '5', num: ''}
  },
  paymentOperation: {
    0: {'title': '待审核', status: '0', num: ''},
    1: {'title': '待付款', status: '1', num: ''},
    2: {'title': '已完成', status: '2', num: ''},
    3: {'title': '审核未通过', status: '3', num: ''}
  },
  receiptOperation: {
    0: {'title': '待审核', status: '0', num: ''},
    1: {'title': '已审核', status: '1', num: ''},
    2: {'title': '审核未通过', status: '3', num: ''}
  },
  priceGroupType: {
    0: {'title': '可用', availabilityStatus: true, num: ''},
    1: {'title': '不可用', availabilityStatus: false, num: ''}
  },
  successBidderType: {
    0: {'title': '生效', availabilityStatus: true, num: ''},
    1: {'title': '未生效', availabilityStatus: false, num: ''}
  },
  receiptType: {
    0: {'title': '待收货', state: '6', num: ''},
    1: {'title': '已完成', state: '8', num: ''}
  },
  firmType: {
    0: {'title': '正常', status: '0', num: ''},
    1: {'title': '停用', status: '1', num: ''}
  },
  vaccineType: {
    0: {'title': '正常', status: '1', num: ''},
    1: {'title': '停用', status: '0', num: ''}
  },
  invoiceType: {
    0: {'title': '未付清', status: 0, num: ''},
    1: {'title': '已付清', status: 1, num: ''}
  },
  purchaseAllotmentType: {
    0: {'title': '待生成', status: 0, num: ''},
    1: {'title': '已生成', status: 1, num: ''}
  },
  inventoryType: {
    // 0: {'title': '所有', status: null, num: ''},
    // 1: {'title': '待操作', status: 0, num: ''},
    // 2: {'title': '正常', status: 1, num: ''},
    // 3: {'title': '异常', status: 2, num: ''}
    0: {'title': '所有', status: null, num: ''},
    1: {'title': '待操作', status: 0, num: ''},
    2: {'title': '正常', status: 1, num: ''},
    3: {'title': '异常', status: 2, num: ''},
    4: {'title': '已盘盈', status: 3, num: ''},
    5: {'title': '已盘亏', status: 4, num: ''}
  },
  assginOutAndPovType: {
    0: {'title': '待确认', state: '0', num: ''},
    1: {'title': '待审单', state: '1', num: ''},
    2: {'title': '执行中', state: '2', num: ''},
    3: {'title': '待收货', state: '3', num: ''},
    4: {'title': '已完成', state: '4', num: ''},
    5: {'title': '已取消', state: '5', num: ''}
  },
  injectionType: {
    0: {'title': '未接种', status: '0', num: ''},
    1: {'title': '已接种', status: '1', num: ''},
    2: {'title': '已取消', status: '2', num: ''}
  },
  vaccineEachList: {
    0: {'title': '待使用', status: '0', num: ''},
    1: {'title': '使用完毕', status: '1', num: ''},
    2: {'title': '已报废', status: '2', num: ''}
  },
  packageType: ['第一级包装', '第二级包装', '第三级包装', '第四级包装',
    '第五级包装', '第六级包装', '第七级包装', '第八级包装', '第九级包装', '第十级包装'],
  /**
   * 格式化地址，已省/市/区显示
   * @param province
   * @param city
   * @param region
   * @returns {string}
   */
  formatAddress: formatAddress,
  guid() {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
  },
  /**
   * 实时动态强制更改用户录入
   * @param th
   */
  format2DecimalPoint(val) {
    let th = val.toString();
    const regStrs = [
      ['^0(\\d+)$', '$1'], // 禁止录入整数部分两位以上，但首位为0
      ['[^\\d\\.]+$', ''], // 禁止录入任何非数字和点
      ['\\.(\\d?)\\.+', '.$1'], // 禁止录入两个以上的点
      ['^(\\d+\\.\\d{2}).+', '$1'] // 禁止录入小数点后两位以上
    ];
    for (let i = 0; i < regStrs.length; i++) {
      let reg = new RegExp(regStrs[i][0]);
      th = th.replace(reg, regStrs[i][1]);
    }
    th = parseFloat(th);
    if (isNaN(th)) {
      th = '';
    }
    return th;
  },
  /**
   * 录入完成后，输入模式失去焦点后对录入进行判断并强制更改，并对小数点进行0补全
   * @param th
   */
  autoCompleteDecimalPoint: function (val) {
    if (!val) {
      return 0;
    }
    let v = val.toString();
    v = v.replace(/[^0-9\.]*/g, '');
    if (v === '') {
      v = '0.00';
    } else if (v === '0') {
      v = '0.00';
    } else if (v === '0.') {
      v = '0.00';
    } else if (/^0+\d+\.?\d*.*$/.test(v)) {
      v = v.replace(/^0+(\d+\.?\d*).*$/, '$1');
    } else if (/^0\.\d$/.test(v)) {
      v = v + '0';
    } else if (!/^\d+\.\d{2}$/.test(v)) {
      if (/^\d+\.\d{2}.+/.test(v)) {
        v = v.replace(/^(\d+\.\d{2}).*$/, '$1');
      } else if (/^\d+$/.test(v)) {
        v = v + '.00';
      } else if (/^\d+\.$/.test(v)) {
        v = v + '00';
      } else if (/^\d+\.\d$/.test(v)) {
        v = v + '0';
      } else if (/^[^\d]+\d+\.?\d*$/.test(v)) {
        v = v.replace(/^[^\d]+(\d+\.?\d*)$/, '$1');
      } else if (/\d+/.test(v)) {
        v = v.replace(/^[^\d]*(\d+\.?\d*).*$/, '$1');
      } else if (/^0+\d+\.?\d*$/.test(v)) {
        v = v.replace(/^0+(\d+\.?\d*)$/, '$1');
      } else {
        v = '0.00';
      }
    }
    return parseFloat(v);
  },
  /**
   * 保留指定位数小数
   * @param val
   * @returns {string}
   */
  formatNumber(val, several) {
    let num = '';
    if (typeof val === 'string') {
      num = val;
    } else if (typeof val === 'number') {
      num = val.toFixed(several).toString();
    }
    return num;
  },
  /**
   * 录入完成后，输入模式失去焦点后对录入进行判断并强制更改，并对小数点进行0补全
   * @param th
   */
  autoformatDecimalPoint: function (v) {
    v = v.replace(/[^0-9\.]*/g, '');
    if (v === '') {
      v = '0.00';
    } else if (v === '0') {
      v = '0.00';
    } else if (v === '0.') {
      v = '0.00';
    } else if (/^0+\d+\.?\d*.*$/.test(v)) {
      v = v.replace(/^0+(\d+\.?\d*).*$/, '$1');
    } else if (/^0\.\d$/.test(v)) {
      v = v + '0';
    } else if (!/^\d+\.\d{2}$/.test(v)) {
      if (/^\d+\.\d{2}.+/.test(v)) {
        v = v.replace(/^(\d+\.\d{2}).*$/, '$1');
      } else if (/^\d+$/.test(v)) {
        v = v + '.00';
      } else if (/^\d+\.$/.test(v)) {
        v = v + '00';
      } else if (/^\d+\.\d$/.test(v)) {
        v = v + '0';
      } else if (/^[^\d]+\d+\.?\d*$/.test(v)) {
        v = v.replace(/^[^\d]+(\d+\.?\d*)$/, '$1');
      } else if (/\d+/.test(v)) {
        v = v.replace(/^[^\d]*(\d+\.?\d*).*$/, '$1');
      } else if (/^0+\d+\.?\d*$/.test(v)) {
        v = v.replace(/^0+(\d+\.?\d*)$/, '$1');
      } else {
        v = '0.00';
      }
    }
    return v;
  },
  toDecimal2: function (x) {
    return Math.floor(x * 1000 + 1) / 1000;
  },
  hasClass: function (elem, cls) {
    cls = cls || '';
    if (cls.replace(/\s/g, '').length === 0) return false;
    return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
  },
  getPos(e) { // 这是一个 获取鼠标位置的函数
    let oEvent = e || event;
    return {
      x: oEvent.clientX + document.documentElement.scrollLeft || document.body.scrollLeft,
      y: oEvent.clientY + document.documentElement.scrollTop || document.body.scrollTop
    };
  },
  addClass: function (elem, cls) {
    if (!this.hasClass(elem, cls)) {
      elem.className = elem.className === '' ? cls : elem.className + ' ' + cls;
    }
  },
  removeClass: function (elem, cls) {
    if (this.hasClass(elem, cls)) {
      let newClass = ' ' + elem.className.replace(/[\t\r\n]/g, '') + ' ';
      while (newClass.indexOf(' ' + cls + ' ') >= 0) {
        newClass = newClass.replace(' ' + cls + ' ', ' ');
      }
      elem.className = newClass.replace(/^\s+|\s+$/g, '');
    }
  },
  getSelectLabel: function (key, labelList) {
    let label = '';
    if (!Array.isArray(labelList)) {
      return label;
    }
    let len = labelList.length;
    for (let i = 0; i < len; i++) {
      if (labelList[i].key === key) {
        label = labelList.label;
        break;
      }
    }
    return label;
  },
  changeTotalNumber(amount, smallPacking) {
    if (!smallPacking) return;
    if (amount < 0) {
      // this.$notify.info({
      //   message: '疫苗数量不能小于0, 已帮您调整为0'
      // });
      return 0;
    }
    let number = Number(amount);
    let remainder = number % smallPacking;
    let isMultiple = remainder === 0;
    if (isMultiple) return number;
    let integer = parseInt(number, 10) + 1;
    let ri = integer % smallPacking;
    isMultiple = ri === 0;
    if (isMultiple) {
      // this.$notify.info({
      //   message: `数量${amount}不是最小包装的倍数，无法添加疫苗，已帮您调整为${integer}`
      // });
      return integer;
    }
    let re = integer + smallPacking - ri;
    // this.$notify.info({
    //   message: `数量${amount}不是最小包装的倍数，无法添加疫苗，已帮您调整为${re}`
    // });
    return re;
  },

  changeTipTotalNumber(amount, smallPacking) {
    if (!smallPacking) return;
    if (amount < 0) {
      this.$notify.info({
        message: '疫苗数量不能小于0, 已帮您调整为0'
      });
      return 0;
    }
    let number = Number(amount);
    let remainder = number % smallPacking;
    let isMultiple = remainder === 0;
    if (isMultiple) return number;
    let integer = parseInt(number, 10) + 1;
    let ri = integer % smallPacking;
    isMultiple = ri === 0;
    if (isMultiple) {
      this.$notify.info({
        message: `数量${amount}不是最小包装的倍数，无法添加疫苗，已帮您调整为${integer}`
      });
      return integer;
    }
    let re = integer + smallPacking - ri;
    this.$notify.info({
      message: `数量${amount}不是最小包装的倍数，无法添加疫苗，已帮您调整为${re}`
    });
    return re;
  },
  isCheckPackage(count) {
    if (!count || count < 0) {
      this.$notify({
        duration: 2000,
        title: '疫苗资料不足',
        message: '疫苗无最小包装单位，请补充资料，或者选择其他疫苗',
        type: 'error'
      });
    }
    return count > 0;
  },
  download(src, fileName) {
    let $a = document.createElement('a');
    $a.setAttribute('href', src);
    $a.setAttribute('download', fileName);
    let fileLink = document.createElement('span');
    fileLink.setAttribute('style', 'cursor: pointer; -webkit-tap-highlight-color: transparent');
    $a.appendChild(fileLink);
    let body = document.getElementsByTagName('body')[0];
    body.appendChild($a);
    fileLink.click();
    body.removeChild($a);
  },
  downloadXml(src, fileName) {
    this.$http({
      url: src,
      timeout: 1000000,
      withCredentials: false
    }).then(res => {
      funDownload(res.data, fileName);
    });
  },
  getCurrentHeight(vm, defaultHeight = 400) {
    if (vm) {
      let obj = vm.$el.getBoundingClientRect();
      let height = document.documentElement.clientHeight - obj.y;
      if (typeof height === 'number') {
        return height;
      }
    }
    return defaultHeight;
  },
  /**
   * 得到附件类型 1 图片 0 非图片
   * @returns {string}
   */
  getType(attachmentStoragePath) {
    let type = '';
    let url = attachmentStoragePath;
    let images = ['jpg', 'png', 'gif', 'jpeg'];
    let docs = ['txt', 'doc', 'docx', 'pdf', 'xls', 'xlsx', 'ppt', 'pptx'];
    if (url) {
      type = url.substring(url.lastIndexOf('.'));
    }
    if (type) {
      type = type.substring(1).toLowerCase();
    }
    if (docs.indexOf(type) !== -1) {
      type = 0;
    } else if (images.indexOf(type) !== -1) {
      type = 1;
    }
    return type;
  }
};

export function getMousePos(event) {
  let e = event || window.event;
  let scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
  let scrollY = document.documentElement.scrollTop || document.body.scrollTop;
  let x = e.pageX || e.clientX + scrollX;
  let y = e.pageY || e.clientY + scrollY;
  return {'x': x, 'y': y};
}

// 深拷贝
export const deepCopy = function (source) {
  if (!source) {
    return source;
  }
  let sourceCopy = source instanceof Array ? [] : {};
  for (let item in source) {
    if (source.hasOwnProperty(item)) {
      sourceCopy[item] = typeof source[item] === 'object' ? deepCopy(source[item]) : source[item];
    }
  }
  return sourceCopy;
};

export const getUrlParams = (url) => {
  if (!url) {
    return {}
  }

  const urlParams = {};
  const beginIndex = url.indexOf("?")
  if (beginIndex != -1) {
    const params = url.substring(beginIndex + 1).split("&");
    for (const str of params) {
      urlParams[str.split("=")[0]] = str.split("=")[1];
    }
  }

  return urlParams;
}

export const getUrlPathId = (url) => {
  if (!url) {
    return ''
  }

  const urlParams = {};
  const beginIndex = url.lastIndexOf("/")
  if (beginIndex == -1) {
    return ''
  }

  return url.substring(beginIndex + 1);
}
