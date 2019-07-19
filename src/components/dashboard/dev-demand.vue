<template>
  <card-box title="要货需求" v-if="requirementList.length">
    <el-row class="list-item list-item--pointer" v-for="(item, index) in requirementList" :key="item.id"
            type="flex"
            :gutter="15"
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
