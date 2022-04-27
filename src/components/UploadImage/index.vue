<script setup>
import { ref, computed } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { deepClone } from '@/utils'
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
  // if (!file.url && !file.preview) {
  //   file.preview = await getBase64(file.originFileObj)
  // }

  previewImage.value = file.url || file.preview || file.thumbUrl
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
  // return new Promise((resolve, reject) => {
  //   const max = maxCount.value
  //   if (max <= fileList.length) {
  //     message.error(`最多上传${max}张图片`)
  //     return reject()
  //   }
  //   return resolve()
  // })

  return new Promise(resolve => {
    const max = maxCount.value
    if (max <= fileList.length) {
      message.error(`最多上传${max}张图片`)
      return reject()
    }
    // 图片压缩
    let reader = new FileReader(),
      img = new Image()
    reader.readAsDataURL(file)
    reader.onload = function (e) {
      img.src = e.target.result
    }

    img.onload = function () {
      let canvas = document.createElement('canvas')
      let context = canvas.getContext('2d')

      let originWidth = this.width
      let originHeight = this.height

      canvas.width = originWidth
      canvas.height = originHeight

      context.clearRect(0, 0, originWidth, originHeight)
      context.drawImage(img, 0, 0, originWidth, originHeight)

      canvas.toBlob(
        blob => {
          let imgFile = new File([blob], file.name, { type: file.type }) // 将blob对象转化为图片文件
          resolve(imgFile)
        },
        file.type,
        0.2
      ) // file压缩的图片类型
    }
  })
}

// 自定义的上传请求
const customImageRequest = info => {
  const { file } = info
  // 组装数据
  const params = new FormData()
  params.append('image', file)
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
  const oldList = deepClone(fileList.value)
  // 发送请求
  common.uploadImage2(params, config).then(res => {
    const item = deepClone(fileList.value[fileList.value.length - 1])
    if (item) {
      item.status = 'done'
      item.response = { data: res.data }
      item.url = `http://81.70.234.149:9002/${res.data}`
      item.uid = res.data
    }
    fileList.value = [...oldList, item]
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
    :customRequest="customImageRequest"
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
