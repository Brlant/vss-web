<template>
  <a @click.stop.prevent="remove" href="#">
    <slot></slot>
  </a>
</template>

<script>

  export default {
    name: 'omsRemove',

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
        default: '确认删除该信息?'
      }
    },

    data() {
      return {};
    },
    methods: {
      remove: function () {
        this.$confirm(this.tips, '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit('removed', this.item);
        });
      }
    }
  };
</script>
