<template>
  <i :class="'el-icon-t-'+name"></i>
</template>

<script>
  export default {
    name: 'FA',

    props: {
      name: {
        type: String,
        default: ''
      }
    },

    data() {
      return {};
    }
  };
</script>
