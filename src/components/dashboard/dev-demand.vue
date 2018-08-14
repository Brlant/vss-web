<template>
  <card-box title="接种点要货需求">
    <div v-if="!requirementList.length" class="no-info">
      暂无接种点要货需求单
    </div>
    <el-row v-else="" class="list-item list-item--pointer" v-for="(item, index) in requirementList" :key="item.id"
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
  import { erpOrder, pullSignal } from '@/resources';

  export default {
    data: function () {
      return {
        requirementList: []
      };
    },
    mounted () {
      this.getRequirementList();
    },
    computed: {
      user () {
        return this.$store.state.user;
      },
      level () {
        return this.$store.state.orgLevel;
      }
    },
    watch: {
      level () {
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
        if (this.level === 3) {
          Object.assign(params, {povId: orgId, status: 0});
        } else {
          Object.assign(params, {cdcId: orgId, status: 1});
        }
        pullSignal.query(params).then(res => {
          this.requirementList = res.data.list;
        });
      },
      goUrl: function (item) {
        if (!item.id) return;
        if (this.level === 3) {
          this.$router.push({path: '/pov/request', query: {id: item.id}});
        } else {
          this.$router.push({path: `/sale/pov/${item.id}`});
        }
      }
    }
  };
</script>
