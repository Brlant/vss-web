<template>
  <a @click.stop.prevent="forbid" href="#">
    <slot></slot>
  </a>
</template>

<script>
  export default {
    name: 'OmsForbid',

    props: {
      url: {
        type: String,
        default: ''
      },
      item: {
        type: Object,
        required: true
      },
      tips: {
        type: String,
        default: '确认停用该信息?'
      }
    },

    data() {
      return {};
    },
    methods: {
      forbid: function () {
        this.$confirm(this.tips, '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit('forbided', this.item);
        });
      }
    }
  };
</script>
