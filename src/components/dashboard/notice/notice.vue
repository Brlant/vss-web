<template>
  <card-box title="公告">
    <div v-if="!noticeList.length" class="no-info">
      暂无公告
    </div>
    <el-row v-for="(item, index) in noticeList" v-else :key="item.noticeId" :class="formatRowClass(item)" :gutter="15"
            class="list-item list-item--pointer"
            type="flex"
            @click.native="openDetail(item.noticeId)">
      <el-col :span="20">
        {{ item.noticeTitle}}
      </el-col>
      <el-col :span="4">
        发布时间：{{ item.issuedTime | date }}
      </el-col>
    </el-row>
    <page-right :css="{'width':'1000px','padding':0}" :show="showDetailPart" @right-close="resetRightBox">
      <detail :formItem="noticeItem" @close="resetRightBox"></detail>
    </page-right>
  </card-box>
</template>
<script>
import detail from './detail/notice-detail';
import Perm from '@/components/common/perm';

export default {
  components: {Perm, detail},
  data: function () {
    return {
      noticeList: [],
      noticeItem: {},
      showDetailPart: false
    };
  },
  mounted() {
    this.getNoticeList();
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
    getNoticeList() {
      this.$http.get('/notice/list').then(res => {
        this.noticeList = res.data;
      });
    },
    openDetail(key) {
      this.$http.get('/notice/' + key).then(res => {
        this.noticeItem = res.data;
        this.showDetailPart = true;
      });
    },
    resetRightBox() {
      this.showDetailPart = false;
    }
  }
};
</script>
