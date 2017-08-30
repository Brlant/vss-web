<template>
  <span>{{value}}</span>
</template>

<script>
  export default {
    name: 'dict',

    props: {
      dictGroup: {
        type: String,
        default: ''

      },

      dictKey: {
        type: String,
        default: ''
      }
    },

    computed: {
      value: function () {
        let data = this.$store.state.dict[this.dictGroup];
        if (!data) return false;
        let label = '';
        data.forEach((item) => {
          if (item.key === this.dictKey) {
            label = item.label;
            return false;
          }
        });
        return label;
      }
    }
  };
</script>
