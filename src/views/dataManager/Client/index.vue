<script setup>
import { reactive, ref, toRaw, onMounted, createVNode } from 'vue'
import { useRouter } from 'vue-router'
import { getColumnsNum } from '@/utils'

import { BaseTable, TableMenu, Action } from '@/components'
import {
  FileSearchOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'

import city from '@/utils/city.json' // 省市区数据

import api from '@/request/api'
import moment from 'moment'

const dateFormat = 'YYYY-MM-DD'
const router = useRouter()

const pagination = reactive({
  current: 0,
  pageSize: 0
})

const search = reactive({
  name: '',
  phone: '',
  region: [],
  // province: '',
  // city: '',
  // area: '',
  address: '',
  brand_id: undefined,
  car_model: '',
  membrane_type: '',
  number: '',
  mounting_date_range: [],
  expiration_date_range: [],
  authorized_Shop: ''
})

const brandList = ref([])
const showSearch = ref(false)
const visible = ref(false)
const detail = ref(null)
const total = ref(0)
const list = ref([])
const columns = [
  {
    title: '序号',
    key: 'index',
    width: 80,
    fixed: 'left',
    slots: { customRender: 'index' }
  },
  {
    title: '客户姓名',
    dataIndex: 'name',
    fixed: 'left',
    width: 120
  },
  {
    title: '客户电话',
    dataIndex: 'phone',
    width: 120
  },
  {
    title: '质保ID',
    dataIndex: 'order_no',
    width: 120
  },
  {
    title: '车牌号',
    dataIndex: 'number_plate',
    width: 120
  },
  {
    title: '膜的种类',
    dataIndex: 'membrane_type',
    width: 120
  },
  {
    title: '安装时间',
    dataIndex: 'mounting_date',
    width: 120
  },
  {
    title: '到期时间',
    dataIndex: 'expiration_date',
    width: 120
  },
  {
    title: '质保状态',
    dataIndex: 'warranty_status',
    width: 120
  },
  {
    title: '质保年限',
    key: 'warranty_period',
    slots: { customRender: 'warranty_period' },
    width: 120
  },
  {
    title: '装贴价格',
    dataIndex: 'mounting_price',
    width: 120
  },
  {
    title: '大写',
    dataIndex: 'capital',
    width: 120
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    align: 'center',
    class: 'columns-font-bold',
    width: 60,
    slots: {
      customRender: 'action'
    }
  }
]

onMounted(() => {
  getBrandList()
})

const getParams = () => {
  const params = {
    page: pagination.current,
    limit: pagination.pageSize,
    ...toRaw(search)
  }
  const { region, mounting_date_range, expiration_date_range, ...args } = params
  return {
    ...args,
    province: region[0] ? region[0] : '',
    city: region[2] ? region[1] : region[1] ? region[0] : '',
    area: region[2] ? region[2] : region[1] ? region[1] : '',
    mounting_date_start: mounting_date_range[0]
      ? moment(mounting_date_range[0]).format(dateFormat)
      : '',
    mounting_date_end: mounting_date_range[1]
      ? moment(mounting_date_range[1]).format(dateFormat)
      : '',
    expiration_date_start: expiration_date_range[0]
      ? moment(expiration_date_range[1]).format(dateFormat)
      : '',
    expiration_date_end: expiration_date_range[1]
      ? moment(expiration_date_range[1]).format(dateFormat)
      : ''
  }
}

const getList = () => {
  const params = getParams()
  api.client.getClientList(params).then(res => {
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

const handleAdd = () => {
  router.push({ name: 'ClientAdd' })
}

const clientDel = id => {
  api.client.clientDel({ id }).then(res => {
    if (res.code !== 0) return message.error(res.msg)
    message.success('删除成功')
    const idx = list.value.findIndex(item => item.id === id)
    list.value.splice(idx, 1)
  })
}

const getInfo = id => {
  return new Promise(resolve => {
    api.client.getClientInfo({ id }).then(res => {
      if (res.code !== 0) return message.error(res.msg)
      detail.value = res.data
      resolve()
    })
  })
}

const showDetail = async id => {
  await getInfo(id)
  visible.value = true
}

const handleAction = ({ id }, { key }) => {
  switch (key) {
    case 'detail':
      showDetail(id)
      break
    case 'edit':
      router.push({ name: 'ClientAdd', query: { id } })
      break
    case 'delete':
      Modal.confirm({
        title: () => '删除',
        icon: () => createVNode(ExclamationCircleOutlined),
        content: () => '是否确认删除该条数据？',
        onOk() {
          clientDel(id)
        }
      })
      break
  }
}

const getBrandList = () => {
  api.common.getBrandList().then(res => {
    if (res.code !== 0) return message.error(res.msg)
    brandList.value = res.data
  })
}

const exportData = () => {
  api.client
    .exportClient(toRaw(search), {
      responseType: 'blob'
    })
    .then(res => {
      let data = res
      let url = window.URL.createObjectURL(new Blob([data]))
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', '质保客户.xlsx')
      document.body.appendChild(link)
      link.click()
    })
}

const onSearch = () => {
  getList()
  showSearch.value = false
}
</script>

<template>
  <!-- 更多筛选 -->
  <a-modal
    v-model:visible="showSearch"
    title="查询"
    okText="查询"
    @ok="onSearch"
  >
    <a-form-item label="地区" :labelCol="{ span: 5 }">
      <a-cascader
        v-model:value="search.region"
        :options="city"
        placeholder="请选择"
      />
    </a-form-item>
    <a-form-item label="详细地址" :labelCol="{ span: 5 }">
      <a-input v-model:value="search.address" placeholder="请输入" />
    </a-form-item>
    <a-form-item label="品牌" :labelCol="{ span: 5 }">
      <Select
        v-model:value="search.brand_id"
        :options="brandList"
        label="name"
        val="id"
        placeholder="请选择车辆品牌"
      />
    </a-form-item>
    <a-form-item label="车型" :labelCol="{ span: 5 }">
      <a-input v-model:value="search.car_model" placeholder="请输入" />
    </a-form-item>
    <a-form-item label="装贴时间范围" :labelCol="{ span: 5 }">
      <a-range-picker
        style="width: 100%"
        v-model:value="search.mounting_date_range"
      />
    </a-form-item>
    <a-form-item label="到期时间范围" :labelCol="{ span: 5 }">
      <a-range-picker
        style="width: 100%"
        v-model:value="search.expiration_date_range"
      />
    </a-form-item>
    <a-form-item label="授权装贴店" :labelCol="{ span: 5 }">
      <a-input v-model:value="search.authorized_Shop" placeholder="请输入" />
    </a-form-item>
  </a-modal>

  <a-modal
    v-model:visible="visible"
    title="客户详情"
    :footer="null"
    width="700px"
  >
    <div class="detail">
      <a-row class="row">
        <a-col :span="4">客户姓名</a-col>
        <a-col :span="20">{{ detail.name }}</a-col>
      </a-row>
      <a-row class="row">
        <a-col :span="4">客户电话</a-col>
        <a-col :span="20">{{ detail.phone }}</a-col>
      </a-row>
      <a-row class="row">
        <a-col :span="4">质保ID</a-col>
        <a-col :span="20">{{ detail.order_no || '-' }}</a-col>
      </a-row>
      <a-row class="row">
        <a-col :span="4">车牌号</a-col>
        <a-col :span="20">{{ detail.number_plate || '-' }}</a-col>
      </a-row>
      <a-row class="row">
        <a-col :span="4">品牌</a-col>
        <a-col :span="20">{{ detail.brand_name || '-' }}</a-col>
      </a-row>
      <a-row class="row">
        <a-col :span="4">装贴车型</a-col>
        <a-col :span="20">{{ detail.car_model || '-' }}</a-col>
      </a-row>
      <a-row class="row">
        <a-col :span="4">安装时间</a-col>
        <a-col :span="20">{{ detail.mounting_date || '-' }}</a-col>
      </a-row>
      <a-row class="row">
        <a-col :span="4">到期时间</a-col>
        <a-col :span="20">{{ detail.expiration_date }}</a-col>
      </a-row>
      <a-row class="row">
        <a-col :span="4">质保状态</a-col>
        <a-col :span="20">{{ detail.name || '-' }}</a-col>
      </a-row>
      <a-row class="row">
        <a-col :span="4">质保年限</a-col>
        <a-col :span="20">{{ detail.warranty_period + '年' }}</a-col>
      </a-row>
      <a-row class="row">
        <a-col :span="4">装贴价格</a-col>
        <a-col :span="20">{{ detail.mounting_price || '-' }}</a-col>
      </a-row>
      <a-row class="row">
        <a-col :span="4">大写</a-col>
        <a-col :span="20">{{ detail.capital || '-' }}</a-col>
      </a-row>
      <a-row class="row">
        <a-col :span="4">车辆年款</a-col>
        <a-col :span="20">{{ detail.year || '-' }}</a-col>
      </a-row>
      <a-row class="row">
        <a-col :span="4">车架号</a-col>
        <a-col :span="20">{{ detail.frame_number || '-' }}</a-col>
      </a-row>
      <a-row class="row">
        <a-col :span="4">装贴部位</a-col>
        <a-col :span="20">{{ detail.mounting_part || '-' }}</a-col>
      </a-row>
      <a-row class="row">
        <a-col :span="4">局部</a-col>
        <a-col :span="20">{{ detail.local || '-' }}</a-col>
      </a-row>
      <a-row class="row">
        <a-col :span="4">膜的种类</a-col>
        <a-col :span="20">{{ detail.membrane_type || '-' }}</a-col>
      </a-row>
      <a-row class="row">
        <a-col :span="4">膜卷号</a-col>
        <a-col :span="20">{{ detail.number || '-' }}</a-col>
      </a-row>
      <a-row class="row">
        <a-col :span="4">用料长度</a-col>
        <a-col :span="20">{{ detail.material_length || '-' }}</a-col>
      </a-row>
      <a-row class="row">
        <a-col :span="4">施工类型</a-col>
        <a-col :span="20">{{ detail.construction_type || '-' }}</a-col>
      </a-row>
      <a-row class="row">
        <a-col :span="4">所在省</a-col>
        <a-col :span="20">{{ detail.province || '-' }}</a-col>
      </a-row>
      <a-row class="row">
        <a-col :span="4">所在市</a-col>
        <a-col :span="20">{{ detail.city || '-' }}</a-col>
      </a-row>
      <a-row class="row">
        <a-col :span="4">所在区/县</a-col>
        <a-col :span="20">{{ detail.area || '-' }}</a-col>
      </a-row>
      <a-row class="row">
        <a-col :span="4">详细地址</a-col>
        <a-col :span="20">{{ detail.address || '-' }}</a-col>
      </a-row>
      <a-row class="row">
        <a-col :span="4">授权装贴店</a-col>
        <a-col :span="20">{{ detail.authorized_Shop || '-' }}</a-col>
      </a-row>
      <a-row class="row">
        <a-col :span="4">装贴技师</a-col>
        <a-col :span="20">{{ detail.mounting_Technician || '-' }}</a-col>
      </a-row>
      <a-row class="row">
        <a-col :span="4">车辆图片</a-col>
        <a-col :span="20">
          <a-image-preview-group v-if="detail.image">
            <template v-for="img in detail.image" :key="img">
              <a-image class="row-image" :src="img" />
            </template>
          </a-image-preview-group>
          <span v-else>-</span>
        </a-col>
      </a-row>
    </div>
  </a-modal>

  <!-- 表格菜单 -->
  <TableMenu @add="handleAdd">
    <div>
      <a-input
        style="width: 200px"
        v-model:value="search.name"
        placeholder="客户姓名"
      />
      <a-input
        style="width: 200px; margin-left: 8px"
        v-model:value="search.phone"
        placeholder="客户电话"
      />
      <a-button
        style="margin-left: 8px"
        shape="round"
        @click="showSearch = true"
      >
        <template #icon>
          <FileSearchOutlined />
        </template>
        更多筛选
      </a-button>

      <a-button style="margin-left: 8px" type="primary">查询</a-button>

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

  <!-- 表格 -->
  <BaseTable
    :dataSource="list"
    :columns="columns"
    :total="total"
    :scroll="{ x: 1300 }"
    @change="onTableChange"
  >
    <template #index="{ index }">
      {{ getColumnsNum(pagination, index) }}
    </template>
    <template #warranty_period="{ record }">
      {{ record.warranty_period + '年' }}
    </template>

    <template #action="{ record }">
      <Action @click="handleAction(record, $event)" />
    </template>
  </BaseTable>
</template>

<style lang="scss" scoped>
.detail {
  height: 600px;
  overflow: auto;
  .row {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #efefef;

    :deep(.row-image) {
      width: 50px;
      height: 50px;
      margin-right: 8px;
    }
  }
}
</style>
