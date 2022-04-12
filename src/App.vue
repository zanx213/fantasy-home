<template>
  <a-config-provider :locale="zhCN">
    <a-spin tip="加载中..." :spinning="spinning" style="height: 100%">
      <router-view />
    </a-spin>
  </a-config-provider>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from '@/store'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import 'moment/dist/locale/zh-cn'

const store = useStore()
const spinning = computed(() => store.loading)
</script>

<style>
#app {
  height: 100%;
}
</style>
