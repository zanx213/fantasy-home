<script setup>
import { reactive, ref, createVNode } from 'vue'
import { useRouter } from 'vue-router'
import { getColumnsNum } from '@/utils'
import { message, Modal } from 'ant-design-vue'
import { BaseTable, TableMenu } from '@/components'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'

import api from '@/request/api'

const router = useRouter()
const pagination = reactive({
  current: 0,
  pageSize: 0
})

const total = ref(0)
const list = ref([])

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
    title: '图片',
    key: 'image',
    class: 'columns-image',
    slots: { customRender: 'image' }
  },
  {
    title: '操作',
    key: 'action',
    slots: { customRender: 'action' }
  }
]

const getList = () => {
  api.paint
    .getProtectiveFilmList({
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

function handleAdd() {
  router.push({ name: 'PaintProtectiveFilmAdd' })
}

function handleEdit({ id }) {
  router.push({
    name: 'PaintProtectiveFilmAdd',
    query: {
      id
    }
  })
}

const delProtectiveFilm = id => {
  api.paint.protectiveFilmDel({ id }).then(res => {
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
      delProtectiveFilm(id)
    }
  })
}
</script>

<template>
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
    <template #image="{ record }">
      <a-image class="columns-img" :src="record.image" />
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
