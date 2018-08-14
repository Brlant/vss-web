<template>
  <div class="card-box">
    <div class="card-box-header">{{title}}</div>
    <div class="card-box-body">
      <slot></slot>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'card-box',
    props: {
      title: String
    }
  };
</script>
