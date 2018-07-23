<template>
  <card-box>
    <el-row class="list-item" type="flex"
            :gutter="15">
      <el-col :span="8">
        供货厂商
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
    <el-row v-else="" v-for="(item, index) in licenceList" :key="item.id" type="flex" :gutter="15"
            class="list-item"
            :class="formatRowClass(item)">
      <el-col :span="8">
        {{ item.orgName}}
      </el-col>
      <el-col :span="4">
        {{ item.name}}
      </el-col>
      <el-col :span="4">
        {{ item.validEndTime | date}}
      </el-col>
      <el-col :span="4" v-if="item.expireStatus=='2'">
        已过期
      </el-col>
      <el-col :span="4" v-else>
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
    mounted () {
      this.getLicenceList();
    },
    methods: {
      formatRowClass (item) {
        if (item.expireStatus === '1') {
          return 'effective-row';
        }
        if (item.expireStatus === '2') {
          return 'danger-row';
        }
      },
      getLicenceList () {
        this.$http.get('order-licence/overdue/licence').then(res => {
          this.licenceList = res.data;
        });
      }
    }
  };
</script>
