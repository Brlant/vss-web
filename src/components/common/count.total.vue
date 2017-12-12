<template>
  <span v-show="list.length" style="font-weight:600;">
     {{title}}<span v-show="showIcon">:￥</span>
    <span v-if="!showIcon">{{ count }}</span>
    <span v-if="showIcon">{{ count | formatMoney }}</span>
  </span>
</template>
<script>
  export default {
    name: 'TotalCount',
    props: {
      list: {
        type: Array,
        default () {
          return [];
        }
      },
      title: {
        type: String,
        default: '合计数量'
      },
      showIcon: {
        type: Boolean,
        default: false
      },
      property: {
        type: String,
        required: true
      }
    },
    computed: {
      count () {
        let c = 0;
        this.list.forEach(i => {
          c += i[this.property];
        });
        return c;
      }
    }
  };
</script>
