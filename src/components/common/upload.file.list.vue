<template>
  <transition-group
    :class="[
      'el-upload-list',
      'el-upload-list--' + listType,
      { 'is-disabled': disabled }
    ]"
    name="el-list"
    tag="ul"
  >
    <li
      v-for="(file, index) in files"
      v-if="file.status === 'uploading'"
      :key="file.uid"
      :class="['el-upload-list__item', 'is-' + file.status]">
      <img
        v-if="file.status !== 'uploading' && ['picture-card', 'picture'].indexOf(listType) > -1"
        :src="file.url"
        alt="" class="el-upload-list__item-thumbnail"
      >
      <a class="el-upload-list__item-name" @click="handleClick(file)">
        <i class="el-icon-document"></i>{{file.name}}
      </a>
      <label class="el-upload-list__item-status-label">
        <i :class="{
          'el-icon-upload-success': true,
          'el-icon-circle-check': listType === 'text',
          'el-icon-check': ['picture-card', 'picture'].indexOf(listType) > -1
        }"></i>
      </label>
      <i v-if="!disabled" class="el-icon-close" @click="$emit('remove', file)"></i>
      <el-progress
        v-if="file.status === 'uploading'"
        :percentage="parsePercentage(file.percentage)"
        :stroke-width="listType === 'picture-card' ? 6 : 2"
        :type="listType === 'picture-card' ? 'circle' : 'line'">
      </el-progress>
      <span v-if="listType === 'picture-card'" class="el-upload-list__item-actions">
        <span
          v-if="handlePreview && listType === 'picture-card'"
          class="el-upload-list__item-preview"
          @click="handlePreview(file)"
        >
          <i class="el-icon-view"></i>
        </span>
        <span
          v-if="!disabled"
          class="el-upload-list__item-delete"
          @click="$emit('remove', file)"
        >
          <i class="el-icon-delete2"></i>
        </span>
      </span>
    </li>
  </transition-group>
</template>
<script>
import Locale from 'element-ui/lib/mixins/locale';

export default {
  mixins: [Locale],

  props: {
    files: {
      type: Array,
      default() {
        return [];
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    handlePreview: Function,
    listType: String
  },
  methods: {
    parsePercentage(val) {
      return parseInt(val, 10);
    },
    handleClick(file) {
      this.handlePreview && this.handlePreview(file);
    }
  }
};
</script>
