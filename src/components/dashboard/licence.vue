<template>
  <card-box title="证照效期提醒">
    <el-row :gutter="15" class="list-item"
            type="flex">
      <el-col :span="8">
        供货单位
      </el-col>
      <el-col :span="4">
        证照类型
      </el-col>
      <el-col :span="4">
        有效期
      </el-col>
      <el-col :span="4">
        状态
      </el-col>
    </el-row>
    <div v-if="!licenceList.length" class="no-info">
      暂无证照过期厂商
    </div>
    <el-row v-for="(item, index) in licenceList" v-else="" :key="item.id" :class="formatRowClass(item)" :gutter="15"
            class="list-item"
            type="flex">
      <el-col :span="8">
        {{ item.orgName}}
      </el-col>
      <el-col :span="4">
        {{ item.name}}
      </el-col>
      <el-col :span="4">
        {{ item.validEndTime | date}}
      </el-col>
      <el-col v-if="item.expireStatus=='2'" :span="4">
        已过期
      </el-col>
      <el-col v-else :span="4">
        近效期
      </el-col>
    </el-row>
  </card-box>
</template>
<script>
export default {
  data: function () {
    return {
      licenceList: []
    };
  },
  mounted() {
    this.getLicenceList();
  },
  methods: {
    formatRowClass(item) {
      if (item.expireStatus === '1') {
        return 'effective-row';
      }
      if (item.expireStatus === '2') {
        return 'danger-row';
      }
    },
    getLicenceList() {
      this.$http.get('order-licence/overdue/licence').then(res => {
        this.licenceList = res.data;
      });
    }
  }
};
</script>
