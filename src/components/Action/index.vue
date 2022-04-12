<script setup>
import { defActions } from '@/utils/config'
const emits = defineEmits(['click'])
const props = defineProps({
  actions: {
    type: Array,
    default: defActions
  }
})
const onClick = action => {
  emits('click', action)
}
</script>

<template>
  <a-dropdown placement="bottomRight">
    <a class="ant-dropdown-link" @click.prevent>...</a>
    <template #overlay>
      <a-menu @click="onClick">
        <a-menu-item v-for="action in props.actions" :key="action.value">
          <component v-if="action.icon" :is="action.icon" />
          {{ action.label }}
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
