<script setup>
import { reactive, ref, toRaw, createVNode, computed, watch } from 'vue'
import { getColumnsNum, deepClone } from '@/utils'

import { BaseTable, TableMenu, FormModal, UploadImage } from '@/components'
import { message, Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'

import api from '@/request/api'

const pagination = reactive({
  current: 1,
  pageSize: 20
})
const list = ref([])
const total = ref(0)

const columns = [
  {
    title: '序号',
    key: 'index',
    slots: { customRender: 'index' }
  },
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '图标',
    key: 'logo',
    class: 'columns-image',
    slots: { customRender: 'logo' }
  },
  {
    title: '顺序',
    dataIndex: 'sort'
  },
  // {
  //   title: '是否启用',
  //   key: 'switch',
  //   slots: { customRender: 'switch' }
  // },
  {
    title: '操作',
    key: 'action',
    slots: { customRender: 'action' }
  }
]

const visible = ref(false) // modal显示
const editId = ref('') // 编辑id
const formState = reactive({
  logo: [],
  name: '',
  sort: '',
  status: 0
})

// 自定义校验图标上传
let checkLogo = async (rule, value) => {
  if (Array.isArray(value) && value.length === 0) {
    return Promise.reject('请上传图标')
  } else {
    return Promise.resolve()
  }
}

const rules = {
  logo: [
    {
      required: true,
      trigger: 'change',
      validator: checkLogo
    }
  ],
  name: [
    {
      required: true,
      message: '请输入名称',
      trigger: 'blur'
    }
  ],
  sort: [
    {
      required: true,
      type: 'number',
      message: '请输入顺序',
      trigger: 'blur'
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

watch(visible, val => {
  if (!val) {
    editId.value = null
    resetFormState()
  }
})

// 重置表单
const resetFormState = () => {
  formState.logo = []
  formState.name = ''
  formState.sort = ''
  formState.status = 0
}

const brandUpdate = () => {
  const params = deepClone(toRaw(formState))
  params.logo = params.logo[0].response.data
  if (editId.value) params.id = editId.value // 修改的id
  api.brand.brandUpdate(params).then(res => {
    if (res.code === 0) {
      message.success('操作成功')
      visible.value = false
      resetFormState()
      getList()
    }
  })
}

const handleModalOk = formRef => {
  if (formState.logo.length === 0) return message.error('请上传图标')
  formRef.validate().then(() => {
    brandUpdate()
  })
}

const getList = () => {
  api.brand
    .getBrandList({
      page: pagination.current,
      limit: pagination.pageSize
    })
    .then(res => {
      if (res.code !== 0) return message.error(res.msg)
      list.value = res.data.list
      total.value = res.data.total_num
    })
}

// 翻页
const onTableChange = ({ current, pageSize }) => {
  pagination.current = current
  pagination.pageSize = pageSize
  getList()
}

const getBrandInfo = () => {
  return new Promise(resolve => {
    api.brand.getBrandInfo({ id: editId.value }).then(res => {
      if (res.code === 0) {
        formState.logo = [
          {
            uid: editId.value,
            status: 'done',
            thumbUrl: res.data.logo,
            preview: res.data.logo,
            response: {
              data: res.data.logo
            }
          }
        ]
        formState.name = res.data.name
        formState.sort = res.data.sort
        formState.status = res.data.status
        resolve()
      }
    })
  })
}

const delBrand = id => {
  api.brand.delBrand({ id }).then(res => {
    if (res.code === 0) {
      message.success('删除成功')
      const idx = list.value.findIndex(item => item.id === id)
      list.value.splice(idx, 1)
    } else {
      message.error(res.msg)
    }
  })
}

const handleEdit = async record => {
  editId.value = record.id
  await getBrandInfo()

  visible.value = true
}

const handleDel = ({ id }) => {
  Modal.confirm({
    title: () => '删除',
    icon: () => createVNode(ExclamationCircleOutlined),
    content: () => '是否确认删除该条数据？',
    onOk() {
      delBrand(id)
    }
  })
}

function handleAdd() {
  visible.value = true
}

const modalTitle = computed(() => {
  return editId.value ? '编辑' : '新增'
})
</script>

<template>
  <FormModal
    v-model:value="visible"
    :title="modalTitle"
    :model="formState"
    :rules="rules"
    @ok="handleModalOk"
  >
    <a-form-item label="图标" required>
      <upload-image v-model:list="formState.logo" count="1" />
    </a-form-item>
    <a-form-item label="名称" name="name">
      <a-input v-model:value="formState.name" />
    </a-form-item>
    <a-form-item label="顺序" name="sort">
      <a-input v-model:value.number="formState.sort" />
    </a-form-item>
    <a-form-item label="是否启用" name="status">
      <a-radio-group v-model:value="formState.status">
        <a-radio :value="0">启用</a-radio>
        <a-radio :value="1">不启用</a-radio>
      </a-radio-group>
    </a-form-item>
  </FormModal>

  <TableMenu @add="handleAdd" />

  <BaseTable
    :dataSource="list"
    :columns="columns"
    :total="total"
    @change="onTableChange"
  >
    <template #index="{ index }">
      {{ getColumnsNum(pagination, index) }}
    </template>
    <template #logo="{ record }">
      <a-image class="columns-img" :src="record.logo" />
    </template>
    <template #action="{ record }">
      <a-button type="primary" ghost size="small" @click="handleEdit(record)">
        修改
      </a-button>
      <a-button
        style="margin-left: 8px"
        danger
        ghost
        size="small"
        @click="handleDel(record)"
      >
        删除
      </a-button>
    </template>
  </BaseTable>
</template>

<style lang="scss" scoped></style>
