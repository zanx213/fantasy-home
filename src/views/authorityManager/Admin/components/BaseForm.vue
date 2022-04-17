<script setup>
import { ref, reactive, toRaw, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { RollbackOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { Select } from '@/components'
import api from '@/request/api'
import { deepClone } from '@/utils'

const props = defineProps({
  id: [Number, String]
})

const router = useRouter()
const formRef = ref()
const labelCol = { style: { width: '150px' } }
const wrapperCol = { span: 10 }
const roleList = ref([]) // 角色列表

// 自定义校验
let checkPassword = async (rule, value) => {
  let msg = rule.field === 'password' ? '密码' : '确认密码'

  if (!value) return Promise.reject(`请输入${msg}`)

  if (rule.field === 'password2' && value !== formState.password) {
    return Promise.reject(`两次输入的密码不一致`)
  }

  if (value.length < 6) return Promise.reject(`${msg}不能少于6位`)

  return Promise.resolve()
}

let checkUsername = async (rule, value) => {
  if (!value) return Promise.reject(`请输入用户名`)

  if (value.length < 5) return Promise.reject(`用户名不能少于5位`)

  return Promise.resolve()
}

const formState = reactive({
  username: '',
  password: '',
  password2: '',
  role_id: undefined,
  status: 0
})
const rules = {
  username: [
    {
      required: true,
      validator: checkUsername,
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      validator: checkPassword,
      trigger: 'blur'
    }
  ],
  password2: [
    {
      required: true,
      validator: checkPassword,
      trigger: 'blur'
    }
  ],
  role_id: [
    {
      required: true,
      type: 'number',
      message: '请选择角色',
      trigger: 'change'
    }
  ],
  status: [
    {
      required: true,
      type: 'number',
      message: '请选择是否启用',
      trigger: 'change'
    }
  ]
}

onMounted(() => {
  getRoleList()
  if (props.id) {
    getUserInfo()
  }
})

const getRoleList = () => {
  api.authority.getRoleList().then(res => {
    if (res.code !== 0) return message.error(res.msg)
    roleList.value = res.data
  })
}

const getUserInfo = () => {
  api.authority.getUserInfo({ id: props.id }).then(res => {
    if (res.code !== 0) return message.error(res.msg)
    const data = res.data
    formState.username = data.username
    formState.password = data.password
    formState.password2 = data.password
    formState.role_id = data.role_id
    formState.status = data.status
  })
}

const updateUser = () => {
  const params = deepClone(toRaw(formState))
  if (props.id) params.id = props.id
  const { password2, ...args } = params
  const _api = props.id ? 'updateUser' : 'addUser'

  api.authority[_api](args).then(res => {
    if (res.code === 0) {
      if (props.id) {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user.id === props.id) {
          message.warning('已修改当前管理员，请重新登录')
        }
      } else {
        message.success('操作成功')
        goBack()
      }
    } else {
      message.error(res.msg)
    }
  })
}

const onSubmit = () => {
  formRef.value.validate().then(() => {
    updateUser()
  })
}

const resetForm = () => {
  formRef.value.resetFields()
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="form-title">{{ `${props.id ? '修改' : '新增'}管理员` }}</div>
  <a-form
    ref="formRef"
    :model="formState"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-item label="用户名" name="username">
      <a-input
        v-model:value.trim="formState.username"
        placeholder="请输入用户名"
      />
    </a-form-item>
    <a-form-item label="密码" name="password">
      <a-input
        v-model:value.trim="formState.password"
        type="password"
        placeholder="请输入密码"
      />
    </a-form-item>
    <a-form-item label="确认密码" name="password2">
      <a-input
        v-model:value.trim="formState.password2"
        type="password"
        placeholder="请输入确认密码"
      />
    </a-form-item>
    <a-form-item label="角色" name="role_id">
      <Select
        v-model:value="formState.role_id"
        :options="roleList"
        label="name"
        val="id"
        placeholder="请选择角色"
      />
    </a-form-item>
    <a-form-item label="是否启用" name="status">
      <a-radio-group v-model:value="formState.status">
        <a-radio :value="0">启用</a-radio>
        <a-radio :value="1">不启用</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item :wrapper-col="{ style: { marginLeft: '150px' } }">
      <a-button @click="resetForm">重置</a-button>
      <a-button style="margin-left: 10px" type="primary" @click="onSubmit">
        提交
      </a-button>
    </a-form-item>
  </a-form>

  <!-- back -->
  <a-button type="link" class="form-back-btn" @click="goBack">
    <template #icon>
      <RollbackOutlined />
    </template>
    返回
  </a-button>
</template>
