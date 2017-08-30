<template>
  <div v-html="value"></div>
</template>

<script>

  export default {
    name: 'nl2br',
    props: {
      content: {
        type: String,
        default: ''
      }
    },
    computed: {
      value: function () {
        return this.content && this.content.replace(/\n/g, '<br>');
      }
    }
  };
</script>
