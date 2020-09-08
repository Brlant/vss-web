<style scoped>
.advanced-query-form {
  padding-left: 100px;
}
</style>
<template>
  <div class="order-page">
    <div class="container">
      <div class="opera-btn-group">
        <el-form :model="form" class="advanced-query-form clearfix" style="padding-top: 10px">
          <el-form-item label="入库扫码开关" prop="type">
            <el-switch v-model="form.orgScanCode"
                       active-color="#13ce66"
                       inactive-color="#ff4949"
                       @change="setSwitch">
            </el-switch>
          </el-form-item>
          <el-form-item label="出库扫码开关" prop="type">
            <el-switch
              v-model="form.orgOutScanCode"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="setSwitch">
            </el-switch>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {BaseInfo} from '@/resources';

export default {
  name: 'codeSwitch.vue',
  data() {
    return {
      form: {
        orgScanCode: '',
        orgOutScanCode: '',
      }
    };
  },
  mounted() {
    this.queryBaseInfo();
  },
  methods: {
    setSwitch() {
      let orgId = this.$store.state.user.userCompanyAddress;
      this.$http.put(`/erp-org/${orgId}/code-switch`, this.form).then(res => {

      });
    },
    queryBaseInfo() {
      let orgId = this.$store.state.user.userCompanyAddress;
      if (!orgId) return;
      BaseInfo.queryBaseInfo(orgId).then(res => {
        this.form.orgScanCode = res.data.orgDto.orgScanCode;
        this.form.orgOutScanCode = res.data.orgDto.orgOutScanCode;
      });
    },
  }
};
</script>

<style scoped>

</style>
