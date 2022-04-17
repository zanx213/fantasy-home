<script setup>
import { reactive, ref, createVNode, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { BaseTable, TableMenu } from '@/components'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'

import api from '@/request/api'

const router = useRouter()

const list = ref([])

const columns = [
  {
    title: '序号',
    key: 'index',
    slots: { customRender: 'index' }
  },
  {
    title: '角色姓名',
    dataIndex: 'name'
  },
  {
    title: '是否超级管理员',
    key: 'is_admin',
    slots: { customRender: 'is_admin' }
  },
  {
    title: '更新时间',
    dataIndex: 'updated_at'
  },
  {
    title: '操作',
    key: 'action',
    slots: { customRender: 'action' }
  }
]

onMounted(() => {
  getList()
})

const getList = () => {
  api.authority.getRoleList().then(res => {
    if (res.code !== 0) return message.error(res.msg)
    list.value = res.data
  })
}

function handleAdd() {
  router.push({ name: 'RoleAdd' })
}

function handleEdit({ id }) {
  router.push({
    name: 'RoleAdd',
    query: {
      id
    }
  })
}

const delRole = id => {
  api.authority.delRole({ id }).then(res => {
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
      delRole(id)
    }
  })
}
</script>

<template>
  <TableMenu @add="handleAdd" />

  <BaseTable :dataSource="list" :columns="columns" :pagination="false">
    <template #index="{ index }">
      {{ index + 1 }}
    </template>

    <template #is_admin="{ record }">
      {{ record.is_admin === 1 ? '是' : '否' }}
    </template>

    <template #action="{ record }">
      <template v-if="record.is_admin !== 1">
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
      <div v-else style="color: #d1d1d1">超级管理员不能修改和删除</div>
    </template>
  </BaseTable>
</template>

<style lang="scss" scoped></style>
