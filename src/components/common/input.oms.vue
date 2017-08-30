<template>
  <div :class="[
    type === 'textarea' ? 'el-textarea' : 'el-input',
    size ? 'el-input--' + size : '',
    {
      'is-disabled': disabled,
      'el-input-group': $slots.prepend || $slots.append,
      'el-input-group--append': $slots.append,
      'el-input-group--prepend': $slots.prepend
    }
  ]">
    <template v-if="type !== 'textarea'">
      <!-- 前置元素 -->
      <div class="el-input-group__prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </div>
      <!-- input 图标 -->
      <slot name="icon">
        <i class="el-input__icon"
           :class="[
            'el-icon-' + icon,
            onIconClick ? 'is-clickable' : ''
          ]"
           v-if="icon"
           @click="handleIconClick">
        </i>
      </slot>
      <input
        v-if="type !== 'textarea'"
        class="el-input__inner"
        v-bind="$props"
        :autocomplete="autoComplete"
        :value="currentValue"
        ref="input"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      >
      <i class="el-input__icon el-icon-loading" v-if="validating"></i>
      <!-- 后置元素 -->
      <div class="el-input-group__append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>
    <textarea
      v-else
      class="el-textarea__inner"
      :value="currentValue"
      @input="handleInput"
      ref="textarea"
      v-bind="$props"
      :style="textareaStyle"
      @focus="handleFocus"
      @blur="handleBlur">
    </textarea>
  </div>
</template>
<script>
  import emitter from '../../lib/emitter.js';
  import calcTextareaHeight from '../../lib/calcTextareaHeight.js';
  import merge from '../../lib/merge.js';

  export default {
    name: 'omsInput',

    componentName: 'omsInput',

    mixins: [emitter],

    data() {
      return {
        currentValue: this.value,
        textareaCalcStyle: {}
      };
    },

    props: {
      value: [String, Number],
      placeholder: String,
      size: String,
      resize: String,
      readonly: Boolean,
      autofocus: Boolean,
      icon: String,
      disabled: Boolean,
      type: {
        type: String,
        default: 'text'
      },
      name: String,
      autosize: {
        type: [Boolean, Object],
        default: false
      },
      rows: {
        type: Number,
        default: 2
      },
      autoComplete: {
        type: String,
        default: 'off'
      },
      form: String,
      maxlength: Number,
      minlength: Number,
      max: {},
      min: {},
      step: {},
      validateEvent: {
        type: Boolean,
        default: true
      },
      onIconClick: Function,
      showFocus: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      validating() {
        return this.$parent.validateState === 'validating';
      },
      textareaStyle() {
        return merge({}, this.textareaCalcStyle, {resize: this.resize});
      }
    },

    watch: {
      'value'(val) {
        this.setCurrentValue(val);
      },
      'showFocus': function (val) {
        if (val) {
          if (this.type === 'textarea') {
            this.$refs.textarea.focus();
          } else {
            this.$refs.input.focus();
          }
        }
      }
    },

    methods: {
      handleBlur(event) {
        this.$emit('blur', event);
        if (this.validateEvent) {
          this.dispatch('ElFormItem', 'el.form.blur', [this.currentValue]);
        }
      },
      inputSelect() {
        this.$refs.input.select();
      },
      focus: function () {
        this.$refs.input.focus();
      },
      resizeTextarea() {
        if (this.$isServer) return;
        let {autosize, type} = this;
        if (!autosize || type !== 'textarea') return;
        const minRows = autosize.minRows;
        const maxRows = autosize.maxRows;

        this.textareaCalcStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows);
      },
      handleFocus(event) {
        this.$emit('focus', event);
      },
      handleInput(event) {
        const value = event.target.value;
        this.$emit('input', value);
        this.setCurrentValue(value);
        this.$emit('change', value);
      },
      handleIconClick(event) {
        if (this.onIconClick) {
          this.onIconClick(event);
        }
        this.$emit('click', event);
      },
      setCurrentValue(value) {
        if (value === this.currentValue) return;
        this.$nextTick(() => {
          this.resizeTextarea();
        });
        this.currentValue = value;
        if (this.validateEvent) {
          this.dispatch('ElFormItem', 'el.form.change', [value]);
        }
      }
    },

    created() {
      this.$on('inputSelect', this.inputSelect);
    },

    mounted() {
      this.resizeTextarea();
    }
  };
</script>
