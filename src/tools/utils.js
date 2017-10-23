import address from './address';

export default {
  address: address.value,
  requestType: {
    0: {'title': '所有', status: null, num: ''},
    1: {'title': '待审批', status: 0, num: ''},
    2: {'title': '待生成波次', status: 1, num: ''},
    3: {'title': '待分配', status: 2, num: ''},
    4: {'title': '已分配', status: 4, num: ''},
    5: {'title': '已取消', status: 3, num: ''}
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
  assignType: {
    0: {'title': '待分配', status: 1, num: ''},
    1: {'title': '已完成分配', status: 2, num: ''}
  },
  waveType: {
    0: {'title': '未完成', status: 0, num: ''},
    1: {'title': '已完成', status: 1, num: ''}
  },
  inOrderType: {
    0: {'title': '待审单', state: '6', num: ''},
    1: {'title': '执行中', state: '7', num: ''},
    2: {'title': '已完成', state: '8', num: ''},
    3: {'title': '已取消', state: '9', num: ''},
    4: {'title': '已拒收', state: '5', num: ''},
    5: {'title': '异常', state: '10', num: ''}
  },
  outOrderType: {
    0: {'title': '待确认', state: '0', num: ''},
    1: {'title': '待审单', state: '1', num: ''},
    2: {'title': '执行中', state: '2', num: ''},
    3: {'title': '待收货', state: '3', num: ''},
    4: {'title': '已完成', state: '4', num: ''},
    5: {'title': '取消订单', state: '5', num: ''}
  },
  paymentOperation: {
    0: {'title': '待审核', status: '0', num: 0},
    1: {'title': '执行中', status: '1', num: 0},
    2: {'title': '已完成', status: '2', num: 0},
    3: {'title': '审核未通过', status: '3', num: 0}
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
    0: {'title': '待收货', state: '3', num: ''},
    1: {'title': '已完成', state: '4', num: ''}
  },
  firmType: {
    0: {'title': '正常', status: '0', num: ''},
    1: {'title': '停用', status: '1', num: ''}
  },
  /**
   * 格式化地址，已省/市/区显示
   * @param province
   * @param city
   * @param region
   * @returns {string}
   */
  formatAddress: function (province, city, region) {
    let _address = '';
    this.address.forEach(p => {
      if (province === p.value) {
        if (!p.children) return;
        p.children.forEach(c => {
          if (!c.children) return;
          if (city === c.value) {
            if (!c.children) return;
            c.children.forEach(r => {
              if (region === r.value) {
                _address += p.label + '/' + c.label + '/' + r.label;
              }
              return false;
            });
          }
          return false;
        });
      }
    });
    return _address;
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
    let len = labelList.length;
    let label = '';
    for (let i = 0; i < len; i++) {
      if (labelList[i].key === key) {
        label = labelList.label;
        break;
      }
    }
    return label;
  }
};
