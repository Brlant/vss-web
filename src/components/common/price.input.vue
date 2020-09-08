<template>
  <span>
  <input ref="input" class="el-input__inner" placeholder="请输入" v-bind:value="value"
         @blur="autoCompleteDecimalPoint(value)" v-on:input="updateValue($event.target.value)"/>
</span>
</template>
<script>
export default {
  props: ['value'],
  methods: {
    updateValue(value) {
      let formatValue = this.format2DecimalPoint(value);
      if (formatValue !== value) {
        this.$refs.input.value = formatValue;
      }
      //  通过 input 事件发出数值
      this.$emit('input', formatValue);
    },
    format2DecimalPoint(th) {// 实时动态强制更改用户录入
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
      if (isNaN(th)) {
        th = '';
      }
      return th;
    },
    /**
     * 录入完成后，输入模式失去焦点后对录入进行判断并强制更改，并对小数点进行0补全
     * @param th
     */
    autoCompleteDecimalPoint: function (v) {
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
      //  通过 input 事件发出数值
      this.$emit('input', v);
    }
  }
};
</script>
