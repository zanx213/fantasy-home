<script setup>
import { onMounted, ref } from 'vue'
import { message } from 'ant-design-vue'
import E from 'wangeditor'
import common from '@/request/api/common'
import pageAPi from '@/request/api/page'

const action = import.meta.env.VITE_APP_BASE_URL + common.uploadImage()
const editor = ref(null)
onMounted(() => {
  editor.value = new E('#editor-service')
  createEditor()
  getService()
})

function createEditor() {
  editor.value.config.height = 600 // 高度
  editor.value.config.excludeMenus = ['code', 'video', 'table']
  editor.value.config.pasteFilterStyle = false // 禁止删除粘贴样式
  editor.value.config.showLinkImg = false //隐藏插入网络图片

  // editor.value.config.uploadImgShowBase64 = true

  editor.value.config.uploadImgHooks = {
    // 图片上传并返回了结果，想要自己把图片插入到编辑器中
    customInsert: function (insertImgFn, result) {
      // result 即服务端返回的接口
      insertImgFn(import.meta.env.VITE_APP_BASE_URL + '/' + result.data)
    }
  }
  // 配置 server 接口地址
  editor.value.config.uploadImgServer = action
  editor.value.config.uploadFileName = 'image'
  const token = localStorage.getItem('token')
  editor.value.config.uploadImgHeaders = {
    Authorization: `Bearer ${token}`
  }

  editor.value.create()
}

function getService() {
  pageAPi.getService().then(res => {
    if (res.code !== 0) return message.error(res.msg)
    if (res.data) {
      editor.value.txt.html(res.data.text)
    }
  })
}

function onSave() {
  const data = editor.value.txt.html()
  pageAPi
    .setService({
      text: data
    })
    .then(res => {
      if (res.code !== 0) return message.error(res.msg)
      message.success('保存成功')
    })
}
</script>

<template>
  <div class="service">
    <div class="title">
      <span>设置服务页面</span>
      <a-button type="primary" @click="onSave">保存</a-button>
    </div>
    <div id="editor"></div>
  </div>
</template>

<style lang="scss" scoped>
.service {
  .title {
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  #editor {
    margin-top: 30px;
  }
}
</style>
