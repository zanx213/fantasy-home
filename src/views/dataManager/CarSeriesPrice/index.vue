<script setup>
import { reactive, ref, createVNode, toRaw, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getColumnsNum } from '@/utils'
import { message, Modal } from 'ant-design-vue'
import { BaseTable, TableMenu } from '@/components'
import {
  ExclamationCircleOutlined,
  DownloadOutlined
} from '@ant-design/icons-vue'

import api from '@/request/api'

const router = useRouter()
const pagination = reactive({
  current: 0,
  pageSize: 0
})
const search = reactive({
  brand_id: undefined,
  car_sery_name: ''
})
const brandList = ref([])
const total = ref(0)
const list = ref([])

const columns = [
  {
    title: '序号',
    key: 'index',
    slots: { customRender: 'index' },
    width: 70,
    fixed: 'left'
  },
  {
    title: '车系（车辆）名称',
    dataIndex: 'car_sery_name',
    width: 150,
    fixed: 'left'
  },
  {
    title: '车辆品牌',
    dataIndex: 'brand_name',
    width: 150
  },
  {
    title: '车膜系列',
    dataIndex: 'protective_film_name',
    width: 150
  },
  {
    title: '整车价格',
    dataIndex: 'total_amount',
    width: 150
  },
  {
    title: '机盖',
    dataIndex: 'cover_amount',
    width: 150
  },
  {
    title: '右前叶子板',
    dataIndex: 'right_forward_fender_amount',
    width: 150
  },
  {
    title: '右侧裙',
    dataIndex: 'right_skirt_amount',
    width: 150
  },
  {
    title: '右门组合',
    dataIndex: 'right_combination_amount',
    width: 150
  },
  {
    title: '右后叶子板',
    dataIndex: 'right_back_combination_amount',
    width: 150
  },
  {
    title: '车顶',
    dataIndex: 'roof_amount',
    width: 150
  },
  {
    title: '后盖套装',
    dataIndex: 'back_cover_amount',
    width: 150
  },
  {
    title: '后杠',
    dataIndex: 'rear_bumper_amount',
    width: 150
  },
  {
    title: '左后叶子板',
    dataIndex: 'left_back_combination_amount',
    width: 150
  },
  {
    title: '左门组合',
    dataIndex: 'left_combination_amount',
    width: 150
  },
  {
    title: '左侧裙',
    dataIndex: 'left_skirt_amount',
    width: 150
  },
  {
    title: '后视镜',
    dataIndex: 'rearview_mirror_amount',
    width: 150
  },
  {
    title: '左前叶子板',
    dataIndex: 'left_forward_fender_amount',
    width: 150
  },
  {
    title: '前杠',
    dataIndex: 'front_bumper_amount',
    width: 150
  },
  {
    title: '操作',
    key: 'action',
    slots: { customRender: 'action' },
    width: 150,
    fixed: 'right'
  }
]

onMounted(() => {
  getBrandList() // 筛选的品牌列表
})

const getBrandList = () => {
  api.common.getBrandList().then(res => {
    if (res.code !== 0) return message.error(res.msg)
    brandList.value = res.data
  })
}

const getList = () => {
  api.carSeriesPrice
    .getCarSeriesPriceList({
      page: pagination.current,
      limit: pagination.pageSize,
      ...toRaw(search)
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
  router.push({ name: 'CarSeriesPriceAdd' })
}

function handleEdit({ id }) {
  router.push({
    name: 'CarSeriesPriceAdd',
    query: {
      id
    }
  })
}

const carSeriesPriceDel = id => {
  api.carSeriesPrice.carSeriesPriceDel({ id }).then(res => {
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
      carSeriesPriceDel(id)
    }
  })
}

const exportData = () => {
  api.carSeriesPrice
    .carSeriesPriceExport(toRaw(search), {
      responseType: 'blob'
    })
    .then(res => {
      let data = res
      let url = window.URL.createObjectURL(new Blob([data]))
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', '车系价格.xlsx')
      document.body.appendChild(link)
      link.click()
    })
}
</script>

<template>
  <TableMenu @add="handleAdd">
    <div>
      <Select
        style="width: 200px"
        v-model:value="search.brand_id"
        :options="brandList"
        allowClear
        label="name"
        val="id"
        placeholder="请选择车辆品牌"
      />
      <a-input
        style="width: 200px; margin-left: 8px"
        v-model:value="search.car_sery_name"
        placeholder="请输入车系"
      />
      <a-button style="margin-left: 8px" type="primary" @click="getList">
        查询
      </a-button>

      <a-tooltip>
        <template #title>
          导出符合筛选项的所有数据，没有筛选项默认导出所有
        </template>
        <a-button
          style="margin-left: 8px"
          type="primary"
          shape="round"
          @click="exportData"
        >
          <template #icon>
            <DownloadOutlined />
          </template>
          导出
        </a-button>
      </a-tooltip>
    </div>
  </TableMenu>

  <BaseTable
    :scroll="{ x: 1300 }"
    :dataSource="list"
    :columns="columns"
    :total="total"
    @change="onTableChange"
  >
    <template #index="{ index }">
      {{ getColumnsNum(pagination, index) }}
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
