<template>
  <card-box title="公告" v-if="isShow">
    <div v-if="!noticeList.length" class="no-info">
      暂无公告
    </div>
    <el-row v-else="" v-for="(item, index) in noticeList" :key="item.noticeId" type="flex" :gutter="15"
            class="list-item"
            :class="formatRowClass(item)"
            @click.native="openDetail(item.noticeId)">
      <el-col :span="8">
        {{ item.noticeTitle}}
      </el-col>
    </el-row>
    <page-right :show="showDetailPart" @right-close="resetRightBox" :css="{'width':'1000px','padding':0}">
      <detail :currentItem="noticeItem" @close="resetRightBox"></detail>
    </page-right>
  </card-box>

</template>
<script>
  import detail from './detail/notice-detail';

  export default {
    components: {detail},
    data: function () {
      return {
        noticeList: [],
        noticeItem: {},
        showDetailPart: false
      };
    },
    computed: {
      isShow () {
        return this.$store.state.permissions.indexOf('notice-watch') !== -1;
      }
    },
    watch: {
      isShow (val) {
        if (val) this.getNoticeList();
      }
    },
    mounted () {
      this.getNoticeList();
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
      getNoticeList () {
        if (!this.isShow) return;
        this.$http.get('/notice/list').then(res => {
          this.noticeList = res.data;
        });
      },
      openDetail (key) {
        this.$http.get('/notice/' + key).then(res => {
          this.noticeItem = res.data;
          this.showDetailPart = true;
        });
      },
      resetRightBox () {
        this.showDetailPart = false;
      }
    }
  };
</script>
