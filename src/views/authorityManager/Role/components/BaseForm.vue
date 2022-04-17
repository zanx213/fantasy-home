<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { RollbackOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import api from '@/request/api'

const props = defineProps({
  id: [Number, String]
})

const router = useRouter()
const formRef = ref()
const labelCol = { style: { width: '150px' } }
const wrapperCol = { span: 10 }
const ruleList = ref([]) // 规则列表

const replaceFields = {
  children: 'all_children',
  title: 'name',
  key: 'id'
}

const formState = reactive({
  name: '',
  permission_ids: []
})
const rules = {
  name: [
    {
      required: true,
      message: '请输入角色名称',
      trigger: 'blur'
    }
  ],
  permission_ids: [
    {
      required: true,
      type: 'object',
      message: '请选择权限',
      trigger: 'change'
    }
  ]
}

onMounted(() => {
  getRuleList()
  if (props.id) {
    getRoleInfo()
  }
})

const getRuleList = () => {
  api.authority.getRuleList().then(res => {
    if (res.code !== 0) return message.error(res.msg)
    ruleList.value = res.data
  })
}

const getRoleInfo = () => {
  api.authority.getRoleInfo({ id: props.id }).then(res => {
    if (res.code !== 0) return message.error(res.msg)
    const { name, ...args } = res.data
    formState.name = name
    formState.permission_ids = args
  })
}

const updateRole = () => {
  const params = {
    name: formState.name,
    checked: formState.permission_ids.checked,
    halfChecked: formState.permission_ids.halfChecked
  }
  if (props.id) params.id = props.id
  const _api = props.id ? 'updateRole' : 'addRole'
  api.authority[_api](params).then(res => {
    if (res.code === 0) {
      message.success('操作成功')
      goBack()
    } else {
      message.error(res.msg)
    }
  })
}

const onTreeCheck = (keys, e) => {
  formState.permission_ids = { checked: keys, halfChecked: e.halfCheckedKeys }
}

const onSubmit = () => {
  formRef.value.validate().then(() => {
    updateRole()
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
    <a-form-item label="角色名称" name="name">
      <a-input v-model:value="formState.name" placeholder="请输入角色名称" />
    </a-form-item>

    <a-form-item label="权限配置" name="permission_ids">
      <a-tree
        v-if="ruleList.length"
        :checkedKeys="formState.permission_ids"
        checkable
        showLine
        defaultExpandAll
        :tree-data="ruleList"
        :replace-fields="replaceFields"
        @check="onTreeCheck"
      />
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
