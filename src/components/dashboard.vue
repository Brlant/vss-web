<template>
  <div class="container">
    欢迎进入
  </div>

</template>
<script>
  export default {
    data: function () {
      return {};
    },
    mounted() {
      let user = JSON.parse(localStorage.getItem('user'));
      let orgId = '';
      if (user) {
        orgId = user.userCompanyAddress;
      }
      if (orgId) {
        this.$router.push('/supplier/' + orgId + '/base');
      } else {
        this.$router.push('/platform');
      }
    },
    method: {}
  };

</script>
