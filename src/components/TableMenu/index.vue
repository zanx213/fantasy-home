<script setup>
import { useSlots, computed } from 'vue'
const emits = defineEmits(['add'])
const slots = useSlots()

function handleAdd() {
  emits('add')
}

const tableMenuStyle = computed(() => {
  const len = Object.keys(slots).length
  return {
    'justify-content': len === 0 ? 'flex-end' : 'space-between'
  }
})
</script>

<template>
  <div class="table-menu" :style="tableMenuStyle">
    <slot class="filter"></slot>
    <div class="action">
      <a-button type="primary" @click="handleAdd">新增</a-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table-menu {
  @include flexbox($jc: space-between);
  margin-bottom: 24px;
}
</style>
