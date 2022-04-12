<script setup>
import { useAttrs } from 'vue'
const attrs = useAttrs()
const props = defineProps({
  options: Array,
  label: {
    type: String,
    default: 'label'
  },
  val: {
    type: String,
    default: 'value'
  }
})

const filterOption = (input, option) => {
  return option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
}
</script>

<template>
  <a-select v-bind="attrs" showSearch :filterOption="filterOption">
    <a-select-option
      :value="item[props.val]"
      :title="item[props.label]"
      v-for="item in options"
      :key="item[props.val]"
    >
      {{ item[props.label] }}
    </a-select-option>
  </a-select>
</template>
