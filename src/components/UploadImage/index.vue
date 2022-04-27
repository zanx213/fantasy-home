<script setup>
import { ref, computed } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import common from '@/request/api/common'
const props = defineProps({
  list: Array,
  multiple: Boolean,
  count: [Number, String],
  multiple: Boolean
})
const emits = defineEmits(['update:list'])

const previewVisible = ref(false)
const previewImage = ref('')
const action = import.meta.env.VITE_APP_BASE_URL + common.uploadImage()

// 设置上传头部
const uploadHeaders = computed(() => {
  const token = localStorage.getItem('token')
  return {
    Authorization: `Bearer ${token}`
  }
})

// 上传最大数量
const maxCount = computed(() => {
  if (!props.multiple) return 1
  const max = props.count
  return max ? Number(max) : Infinity
})

// 文件列表
const fileList = computed({
  get: () => props.list,
  set: val => emits('update:list', val)
})

// 点击预览
const handlePreview = async file => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj)
  }

  previewImage.value = file.url || file.preview
  previewVisible.value = true
}

const getBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = () => resolve(reader.result)

    reader.onerror = error => reject(error)
  })
}

// 上传之前
const beforeUpload = (file, list) => {
  return new Promise((resolve, reject) => {
    const afterMax = list.length + fileList.value.length
    const max = maxCount.value
    if (max < afterMax) {
      message.error(`最多上传${max}张图片`)
      return reject()
    }
    return resolve()
  })
}
</script>

<template>
  <a-upload
    class="upload-image"
    v-model:file-list="fileList"
    accept="image/*"
    list-type="picture-card"
    :multiple="props.multiple"
    name="image"
    :action="action"
    :headers="uploadHeaders"
    :before-upload="beforeUpload"
    @preview="handlePreview"
  >
    <div v-if="fileList.length < maxCount">
      <plus-outlined />
      <div class="ant-upload-text">上传</div>
    </div>
  </a-upload>

  <a-modal v-model:visible="previewVisible" :footer="null">
    <img alt="example" style="width: 100%" :src="previewImage" />
  </a-modal>
</template>
