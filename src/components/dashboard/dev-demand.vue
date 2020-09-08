<template>
  <card-box v-if="requirementList.length" title="要货需求">
    <el-row v-for="(item, index) in requirementList" :key="item.id" :gutter="15"
            class="list-item list-item--pointer"
            type="flex"
            @click.native="goUrl(item)">
      <el-col :span="4">
        {{ item.applyTime | date}}
      </el-col>
      <el-col :span="4" class="R">
        {{ item.id}}
      </el-col>
      <el-col :span="8">
        {{ item.povName}}
      </el-col>
    </el-row>
  </card-box>
</template>
<script>
import {pullSignal} from '@/resources';

export default {
  data: function () {
    return {
      requirementList: []
    };
  },
  mounted() {
    this.getRequirementList();
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  watch: {
    level() {
      this.getRequirementList();
    }
  },
  methods: {
    getRequirementList: function () {
      if (typeof this.level !== 'number') return;
      let params = {
        pageNo: 1,
        pageSize: 5
      };
      let orgId = this.user.userCompanyAddress;
      if (!orgId) return;
      Object.assign(params, {cdcId: orgId, status: 1});
      pullSignal.query(params).then(res => {
        this.requirementList = res.data.list;
      });
    },
    goUrl: function (item) {
      this.$router.push({path: `/sale/pov/${item.id}`});
    }
  }
};
</script>
