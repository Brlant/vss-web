<style lang="scss">
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
        <i slot="dot" class="el-icon-t-home1"></i>
        <div class="date-line">
          <h3>2017-06-17 <span>12:12:12</span></h3>
          <p><span>发布里程碑版本</span></p>
        </div>

      </TimelineItem>

      <TimelineItem color="red">
        <i slot="dot" class="el-icon-t-edit"></i>
        <div class="date-line">
          <h3>2017-06-17 <span>12:12:12</span></h3>
          <p><span>发布里程碑版本</span></p>
        </div>

      </TimelineItem>
      <TimelineItem color="green">
        <i slot="dot" class="el-icon-t-edit"></i>
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
  },
  method: {}
};

</script>
