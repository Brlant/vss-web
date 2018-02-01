<style lang="less">
  .date-line {
    h3 {
      margin: 0;
      padding: 0;
    }
    p {
      margin: 10px 0 0;
      padding: 0;
    }
  }
</style>
<template>
  <div class="container">

    <Timeline>
      <TimelineItem color="blue">
        <i class="el-icon-t-home1" slot="dot"></i>
        <div class="date-line">
          <h3>2017-06-17 <span>12:12:12</span></h3>
          <p><span>发布里程碑版本</span></p>
        </div>

      </TimelineItem>

      <TimelineItem color="red">
        <i class="el-icon-t-edit" slot="dot"></i>
        <div class="date-line">
          <h3>2017-06-17 <span>12:12:12</span></h3>
          <p><span>发布里程碑版本</span></p>
        </div>

      </TimelineItem>
      <TimelineItem color="green">
        <i class="el-icon-t-edit" slot="dot"></i>
        <div class="date-line">
          <h3>2017-06-17 <span>12:12:12</span></h3>
          <p><span>发布里程碑版本</span></p>
        </div>

      </TimelineItem>
    </Timeline>
  </div>

</template>
<script>
  export default {
    data: function () {
      return {};
    },
    mounted() {
      console.log('ssss');
    },
    method: {}
  };

</script>
