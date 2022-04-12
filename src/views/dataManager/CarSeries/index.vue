<script setup>
import { reactive, ref, toRaw, onMounted, watch, createVNode } from 'vue'
import { getColumnsNum, deepClone } from '@/utils'

import { BaseTable, TableMenu, FormModal, Select } from '@/components'
import { message, Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'

import api from '@/request/api'

const pagination = reactive({
  current: 1,
  pageSize: 20
})

const brand_id = ref(undefined)
const brandList = ref([])
const list = ref([])
const total = ref(0)

const columns = [
  {
    title: '序号',
    key: 'index',
    slots: { customRender: 'index' }
  },
  {
    title: '品牌',
    dataIndex: 'brand_name'
  },
  {
    title: '车系',
    dataIndex: 'name'
  },
  {
    title: '创建时间',
    dataIndex: 'created_at'
  },
  {
    title: '操作',
    key: 'action',
    slots: { customRender: 'action' }
  }
]

const visible = ref(false) // modal显示
const editId = ref('') // 编辑id
const formState = reactive({
  brand_id: null,
  name: ''
})

const rules = {
  brand_id: [
    {
      required: true,
      message: '请选择品牌',
      trigger: 'change'
    }
  ],
  name: [
    {
      required: true,
      message: '请输入车系',
      trigger: 'blur'
    }
  ]
}

onMounted(() => {
  getBrandList() // 筛选的品牌列表
})

watch(visible, val => {
  if (!val) {
    editId.value = null
    resetFormState()
  }
})

// 重置表单
const resetFormState = () => {
  formState.brand_id = null
  formState.name = ''
}

const carSeryUpdate = () => {
  const params = deepClone(toRaw(formState))
  if (editId.value) params.id = editId.value // 修改的id
  api.carSery.carSeryUpdate(params).then(res => {
    if (res.code === 0) {
      message.success('操作成功')
      visible.value = false
      resetFormState()
      getList()
    }
  })
}

const handleModalOk = formRef => {
  formRef.validate().then(() => {
    carSeryUpdate()
  })
}

const getBrandList = () => {
  api.common.getBrandList().then(res => {
    if (res.code !== 0) return message.error(res.msg)
    brandList.value = res.data
  })
}

const getList = () => {
  api.carSery
    .getCarSeryList({
      page: pagination.current,
      limit: pagination.pageSize,
      brand_id: brand_id.value
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

const carSeryDel = id => {
  api.carSery.carSeryDel({ id }).then(res => {
    if (res.code === 0) {
      message.success('删除成功')
      const idx = list.value.findIndex(item => item.id === id)
      list.value.splice(idx, 1)
    } else {
      message.error(res.msg)
    }
  })
}

const handleDel = ({ id }) => {
  Modal.confirm({
    title: () => '删除',
    icon: () => createVNode(ExclamationCircleOutlined),
    content: () => '是否确认删除该条数据？',
    onOk() {
      carSeryDel(id)
    }
  })
}

const handleEdit = record => {
  editId.value = record.id

  formState.name = record.name
  formState.brand_id = record.brand_id

  visible.value = true
}

function handleAdd() {
  visible.value = true
}
</script>

<template>
  <FormModal
    v-model:value="visible"
    :model="formState"
    :rules="rules"
    :title="`${editId ? '修改' : '新增'}车系`"
    @ok="handleModalOk"
  >
    <a-form-item label="品牌" required>
      <Select
        v-model:value="formState.brand_id"
        :options="brandList"
        label="name"
        val="id"
        placeholder="请选择车辆品牌"
      />
    </a-form-item>
    <a-form-item label="车系" name="name">
      <a-input v-model:value="formState.name" placeholder="请输入车系" />
    </a-form-item>
  </FormModal>

  <TableMenu @add="handleAdd">
    <Select
      style="width: 200px"
      v-model:value="brand_id"
      :options="brandList"
      allowClear
      label="name"
      val="id"
      placeholder="请选择车辆品牌"
    />
  </TableMenu>

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
      <a-image :width="50" :src="record.logo" />
    </template>
    <template #switch="{ record }">
      <a-switch
        checked-children="开"
        un-checked-children="关"
        v-model:checked="record.open"
      />
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
