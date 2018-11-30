<style>
  .qp-box {
    margin-bottom: 20px;
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 5px;
  }
</style>
<template>
  <div v-loading="loading">
    <div class="empty-info" v-if="!list.length">暂无反馈信息</div>
    <div v-else>
      <div class="qp-box" v-for="item in list">
        <h3>
          {{ item.calltime }}
          <el-tag v-if="item.result === 0" type="success">正常</el-tag>
          <el-tag v-else type="danger">异常</el-tag>
        </h3>
        <div>
          {{item.msg}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      orderId: String,
      index: Number
    },
    data() {
      return {
        list: [],
        loading: false
      };
    },
    watch: {
      index(val) {
        this.list = [];
        if (val !== 12) return;
        this.query();
      }
    },
    methods: {
      query() {
        if (!this.orderId) return;
        this.loading = true;
        this.$http.get(`upload-data/order/${this.orderId}`).then(res => {
          let list = [];
          res.data.forEach(i => {
            if (i.json) {
              list.push(JSON.parse(i.json));
            }
          });
          this.list = list;
          this.loading = false;
        });
      }
    }
  };
</script>
