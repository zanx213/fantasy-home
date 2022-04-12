<script setup>
import { computed, ref, useAttrs } from 'vue'

const emits = defineEmits(['update:value', 'ok'])
const props = defineProps({
  value: {
    type: Boolean,
    default: true
  }
})

const attrs = useAttrs()

// modal显示
const visible = computed({
  get: () => props.value,
  set: val => emits('update:value', val)
})

const formRef = ref()
const labelCol = { style: { width: '80px' } }
const wrapperCol = { span: 12 }
</script>

<template>
  <a-modal
    v-bind="attrs"
    class="form-modal"
    v-model:visible="visible"
    @ok="emits('ok', formRef)"
  >
    <a-form
      ref="formRef"
      :model="attrs.model"
      :rules="attrs.rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <slot />
    </a-form>
  </a-modal>
</template>

<style lang="scss" scoped>
.form-modal {
}
:deep(.ant-modal-body) {
  height: 500px;
}
</style>
