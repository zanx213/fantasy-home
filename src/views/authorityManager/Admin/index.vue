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
    title: '用户名',
    dataIndex: 'username'
  },
  {
    title: '角色名称',
    dataIndex: 'role_name'
  },
  {
    title: '最近登录时间',
    dataIndex: 'login_time_last'
  },
  {
    title: '更新时间',
    dataIndex: 'updated_at'
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

onMounted(() => {
  getList()
})

const getList = () => {
  api.authority.getUserList().then(res => {
    if (res.code !== 0) return message.error(res.msg)
    list.value = res.data
  })
}

function handleAdd() {
  router.push({ name: 'AdminAdd' })
}

function handleEdit({ id }) {
  router.push({
    name: 'AdminAdd',
    query: {
      id
    }
  })
}

const delUser = id => {
  api.authority.delUser({ id }).then(res => {
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
      delUser(id)
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
    <template #image="{ record }">
      <a-image class="columns-img" :src="record.image" />
    </template>
    <!-- <template #switch="{ record }">
      <a-switch
        checked-children="开"
        un-checked-children="关"
        :checked="record.status === 0"
        @change="onSwitchChange"
      />
    </template> -->
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
