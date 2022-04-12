<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BaseForm from './components/BaseForm.vue'
const route = useRoute()
const id = computed(() => route.query.id)
</script>

<template>
  <BaseForm :id="id" />
</template>
