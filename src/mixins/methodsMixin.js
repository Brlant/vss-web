import { BaseInfo, cerpAction } from '@/resources';

export default {
  methods: {
    filterOrg: function (query) {// 过滤来源单位
      let orgId = this.$store.state.user.userCompanyAddress;
      if (!orgId) {
        return;
      }
      let params = {keyWord: query};
      if (this.type === 2) {
        params.relation = '0';
        BaseInfo.queryOrgByValidReation(orgId, params).then(res => {
          this.orgList = res.data;
        });
      } else {
        cerpAction.queryOnCDCs().then(res => {
          this.orgList = res.data;
        });
      }
    }
  }
};
