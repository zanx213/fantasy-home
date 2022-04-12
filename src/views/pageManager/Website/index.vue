<script setup>
import { ref, reactive, toRaw, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UploadImage } from '@/components'
import { deepClone } from '@/utils'
import api from '@/request/api'

const router = useRouter()
const formRef = ref()
const labelCol = { style: { width: '100px' } }
const wrapperCol = { span: 10 }

let checkPhone = async (rule, value) => {
  if (!value) {
    return Promise.reject('请输入手机号')
  }
  if (!/^1[23456789]\d{9}$/.test(value)) {
    return Promise.reject('请输入正确的手机号')
  }
  return Promise.resolve()
}

let checkEmail = async (rule, value) => {
  if (!value) {
    return Promise.reject('请输入邮箱')
  }
  const regexp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (!regexp.test(value)) {
    return Promise.reject('请输入正确的邮箱')
  }
  return Promise.resolve()
}

const formState = reactive({
  logo: [],
  phone: '',
  email: '',
  address: '',
  case_number: ''
})
const rules = {
  phone: [
    {
      required: true,
      validator: checkPhone,
      trigger: 'blur'
    }
  ],
  email: [
    {
      required: true,
      validator: checkEmail,
      trigger: 'blur'
    }
  ],
  address: [
    {
      required: true,
      message: '请输入详细地址',
      trigger: 'blur'
    }
  ],
  case_number: [
    {
      required: true,
      message: '请输入备案号',
      trigger: 'blur'
    }
  ]
}

onMounted(() => {
  getInfo()
})

function getInfo() {
  api.page.getConfig().then(res => {
    if (res.code !== 0) return message.error(res.msg)
    const data = res.data
    if (!data) return
    formState.logo = [
      {
        uid: data.id,
        status: 'done',
        thumbUrl: data.logo,
        preview: data.logo,
        response: {
          data: data.logo
        }
      }
    ]
    formState.phone = data.phone
    formState.email = data.email
    formState.address = data.address
    formState.case_number = data.case_number
  })
}

function update() {
  const params = deepClone(toRaw(formState))
  params.logo = params.logo[0].response.data
  api.page.setConfig(params).then(res => {
    if (res.code === 0) {
      message.success('操作成功')
    }
  })
}

const onSubmit = () => {
  if (formState.logo.length === 0) return message.error('请上传logo')
  formRef.value.validate().then(() => {
    update()
  })
}

const resetForm = () => {
  formState.logo = []
  formRef.value.resetFields()
}
</script>

<template>
  <div class="form-title">官网配置</div>
  <a-form
    ref="formRef"
    :model="formState"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-item label="logo" required>
      <UploadImage v-model:list="formState.logo" />
    </a-form-item>
    <a-form-item label="联系电话" name="phone">
      <a-input v-model:value="formState.phone" placeholder="请输入联系电话" />
    </a-form-item>
    <a-form-item label="邮箱" name="email">
      <a-input v-model:value="formState.email" placeholder="请输入邮箱" />
    </a-form-item>
    <a-form-item label="详细地址" name="address">
      <a-input v-model:value="formState.address" placeholder="请输入详细地址" />
    </a-form-item>
    <a-form-item label="ICP备案号" name="case_number">
      <a-input
        v-model:value="formState.case_number"
        placeholder="请输入ICP备案号"
      />
    </a-form-item>
    <a-form-item :wrapper-col="{ style: { marginLeft: '100px' } }">
      <a-button @click="resetForm">重置</a-button>
      <a-button style="margin-left: 10px" type="primary" @click="onSubmit">
        提交
      </a-button>
    </a-form-item>
  </a-form>
</template>
