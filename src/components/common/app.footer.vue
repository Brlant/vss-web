<style lang="scss" scoped>
$activeColor: #00bff3;
.main-footer {
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  color: #b6b6b6;

  a {
    color: #b6b6b6;
  }

  padding: 6.5px;

  .container {
    display: flex;
    align-items: center;
    justify-content: center;
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

.img-police {
  vertical-align: middle;
  margin-left: 10px;
}

</style>

<template>
  <footer class="main-footer">
    <div class="container">
      <div class="col-xs-12 col-md-7 pl-0 pr-0 police-part">
        <span class="mr-10">国药控股上海生物医药有限公司</span>
        <a href="https://beian.miit.gov.cn/" target="_blank">
          沪ICP备10213462号-7
        </a>
      </div>
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
