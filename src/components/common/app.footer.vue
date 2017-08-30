<style lang="less" scoped="">
  @activeColor: #00bff3;
  .main-footer {
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    background: #454647;
    color: #bcbcbc;
    a {
      color: #bcbcbc;
    }

    padding: 5px;
    .container {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    p {
      padding: 0;
      margin: 0;
    }
    .footer-left {
      display: flex;
      align-items: center;
      img {
        margin-right: 20px
      }
    }
    .footer-right {
      display: flex;
      align-items: center;
      .footer-right-item {
        margin-right: 20px;
        &:last-child {
          margin-right: 0
        }
      }
    }
  }
</style>


<template>
  <footer class="main-footer">
    <div class="container">
      <p>国药控股上海生物医药有限公司版权所有</p>
    </div>
  </footer>
</template>

<script>
  export default {
    data() {
      return {};
    },
    methods: {}
  };
</script>
