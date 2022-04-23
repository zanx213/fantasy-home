<script setup>
import { ref, reactive, onMounted, toRaw } from 'vue'
import { useRouter } from 'vue-router'
import { RollbackOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import { UploadImage, Select } from '@/components'
import { warrantyPeriodList } from '../lib'
import city from '@/utils/city.json' // 省市区数据
import moment from 'moment'
import api from '@/request/api'

const props = defineProps({
  id: [Number, String]
})

const dateFormat = 'YYYY-MM-DD'

const router = useRouter()
const formRef = ref()
const labelCol = { style: { width: '150px' } }
const wrapperCol = { span: 10 }
const brandList = ref([])
const protectiveFilmList = ref([])

const imageList = ref([])

let checkPhone = async (rule, value) => {
  if (!value) {
    return Promise.reject('请输入手机号')
  }
  if (!/^1[23456789]\d{9}$/.test(value)) {
    return Promise.reject('请输入正确的手机号')
  }
  return Promise.resolve()
}

let checkNumberPlate = async (rule, value) => {
  if (!value) {
    return Promise.reject('请输入车牌号')
  }

  if (
    !/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/.test(
      value
    )
  ) {
    return Promise.reject('请输入正确的车牌号')
  }
  return Promise.resolve()
}

const formState = reactive({
  name: '',
  phone: '',
  region: [],
  address: '',
  // brand_id: undefined,
  brand_name: '',
  car_model: '',
  year: '',
  frame_number: '',
  number_plate: '',
  mounting_part: '',
  local: '',
  membrane_type: undefined,
  number: '',
  material_length: '',
  construction_type: '',
  mounting_price: '',
  capital: '',
  mounting_date: null,
  warranty_period: undefined,
  authorized_Shop: '',
  mounting_Technician: ''
})

const rules = {
  name: [
    {
      required: true,
      message: '请输入客户姓名',
      trigger: 'blur'
    }
  ],
  phone: [
    {
      required: true,
      validator: checkPhone,
      trigger: 'blur'
    }
  ],
  region: [
    {
      required: true,
      type: 'array',
      message: '请选择地区',
      trigger: 'change'
    }
  ],
  brand_name: [
    {
      required: true,
      message: '请输入车辆品牌',
      trigger: 'blur'
    }
  ],
  membrane_type: [
    {
      required: true,
      message: '请选择膜的种类',
      trigger: 'change'
    }
  ],
  brand_id: [
    {
      required: true,
      type: 'number',
      message: '请选择车辆品牌',
      trigger: 'change'
    }
  ],
  number_plate: [
    {
      required: true,
      validator: checkNumberPlate,
      trigger: 'blur'
    }
  ],
  warranty_period: [
    {
      required: true,
      message: '请选择质保年限',
      trigger: 'change'
    }
  ],
  mounting_date: [
    {
      required: true,
      type: 'object',
      message: '请选择装贴日期',
      trigger: 'change'
    }
  ]
}

onMounted(() => {
  getBrandList()
  getProtectiveFilmList()
  if (props.id) {
    getInfo()
  }
})

const getInfo = () => {
  api.client.getClientInfo({ id: props.id }).then(res => {
    if (res.code !== 0) return message.error(res.msg)
    const data = res.data
    formState.name = data.name
    formState.phone = data.phone
    formState.region =
      data.province === data.city
        ? [data.city, data.area]
        : [data.province, data.city, data.area]
    formState.address = data.address
    formState.brand_name = data.brand_name
    formState.car_model = data.car_model
    formState.year = data.year
    formState.frame_number = data.frame_number
    formState.number_plate = data.number_plate
    formState.mounting_part = data.mounting_part
    formState.local = data.local
    formState.membrane_type = data.membrane_type
    formState.number = data.number
    formState.material_length = data.material_length
    formState.construction_type = data.construction_type
    formState.mounting_price = data.mounting_price
    formState.capital = data.capital
    formState.mounting_date = moment(data.mounting_date)
    formState.warranty_period = data.warranty_period
    formState.authorized_Shop = data.authorized_Shop
    formState.mounting_Technician = data.mounting_Technician
    imageList.value = data.image
      ? data.image.map(v => {
          return {
            status: 'done',
            thumbUrl: v,
            preview: v,
            response: {
              data: v
            }
          }
        })
      : []
  })
}

function goBack() {
  router.back()
}

const clientUpdate = () => {
  const params = { ...toRaw(formState) }
  const { region, mounting_date, ...args } = params

  const _params = { ...args }
  // 省市区
  if (region.length > 0) {
    _params.province = region[0] ? region[0] : ''
    _params.city = region[2] ? region[1] : region[1] ? region[0] : ''
    _params.area = region[2] ? region[2] : region[1] ? region[1] : ''
  }
  // 质保图片
  if (imageList.value.length > 0) {
    const arr = []
    imageList.value.forEach(item => {
      arr.push(item.response.data)
    })
    _params.image = arr
  }

  // 装贴日期
  _params.mounting_date = moment(mounting_date).format(dateFormat)
  if (props.id) _params.id = props.id
  api.client.clientUpdate(_params).then(res => {
    if (res.code === 0) {
      message.success(`${props.id ? '修改' : '添加'}成功`)
      goBack()
    }
  })
}
const onSubmit = () => {
  formRef.value.validate().then(res => {
    clientUpdate()
  })
}

const resetForm = () => {
  formRef.value.resetFields()
}

const getBrandList = () => {
  api.common.getBrandList().then(res => {
    if (res.code !== 0) return message.error(res.msg)
    brandList.value = res.data
  })
}
const getProtectiveFilmList = () => {
  api.common.getProtectiveFilmList().then(res => {
    if (res.code !== 0) return message.error(res.msg)
    protectiveFilmList.value = res.data
  })
}
</script>

<template>
  <div class="form-title">新增质保客户</div>
  <a-form
    ref="formRef"
    :model="formState"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-item label="客户姓名" name="name">
      <a-input v-model:value="formState.name" placeholder="请输入客户姓名" />
    </a-form-item>
    <a-form-item label="客户电话" name="phone">
      <a-input v-model:value="formState.phone" placeholder="请输入客户电话" />
    </a-form-item>
    <a-form-item label="客户地区" name="region">
      <a-cascader
        v-model:value="formState.region"
        :options="city"
        placeholder="请选择客户地区"
      />
    </a-form-item>
    <a-form-item label="详细地址" name="address">
      <a-input v-model:value="formState.address" placeholder="请输入详细地址" />
    </a-form-item>
    <!-- <a-form-item label="车辆品牌" name="brand_id">
      <Select
        v-model:value="formState.brand_id"
        :options="brandList"
        label="name"
        val="id"
        placeholder="请选择车辆品牌"
      />
    </a-form-item> -->
    <a-form-item label="车辆品牌" name="brand_name">
      <a-input
        v-model:value="formState.brand_name"
        placeholder="请输入车辆品牌"
      />
    </a-form-item>
    <a-form-item label="装贴车型" name="car_model">
      <a-input
        v-model:value="formState.car_model"
        placeholder="请输入装贴车型"
      />
    </a-form-item>
    <a-form-item label="车辆年款" name="year">
      <a-input v-model:value="formState.year" placeholder="请输入车辆年款" />
    </a-form-item>
    <a-form-item label="车架号" name="frame_number">
      <a-input
        v-model:value="formState.frame_number"
        placeholder="请输入车架号"
      />
    </a-form-item>
    <a-form-item label="车牌号" name="number_plate">
      <a-input
        v-model:value="formState.number_plate"
        placeholder="车牌号 示例格式：川AZR666"
      />
    </a-form-item>
    <a-form-item label="装贴部位" name="mounting_part">
      <a-input
        v-model:value="formState.mounting_part"
        placeholder="请输入装贴部位"
      />
    </a-form-item>
    <a-form-item label="局部(注明部位和型号)" name="local">
      <a-input v-model:value="formState.local" placeholder="请输入局部" />
    </a-form-item>
    <a-form-item label="膜的种类" name="membrane_type">
      <a-input
        v-model:value="formState.membrane_type"
        placeholder="请输入膜的种类"
      />
      <!-- <Select
        v-model:value="formState.membrane_type"
        :options="protectiveFilmList"
        label="name"
        val="name"
        placeholder="请选择膜的种类"
      /> -->
    </a-form-item>
    <a-form-item label="膜卷号" name="number">
      <a-input v-model:value="formState.number" placeholder="请输入膜卷号" />
    </a-form-item>
    <a-form-item label="用料长度" name="material_length">
      <a-input
        v-model:value="formState.material_length"
        placeholder="请输入用料长度"
      />
    </a-form-item>
    <a-form-item label="施工类型" name="construction_type">
      <a-input
        v-model:value="formState.construction_type"
        placeholder="请输入施工类型"
      />
    </a-form-item>
    <a-form-item label="装贴价格" name="mounting_price">
      <a-input
        v-model:value="formState.mounting_price"
        placeholder="请输入装贴价格"
      />
    </a-form-item>
    <a-form-item label="大写" name="capital">
      <a-input v-model:value="formState.capital" placeholder="请输入大写" />
    </a-form-item>

    <a-form-item label="装贴日期" name="mounting_date">
      <a-date-picker
        v-model:value="formState.mounting_date"
        placeholder="请选择装贴日期"
        style="width: 100%"
      />
    </a-form-item>
    <a-form-item label="质保年限" name="warranty_period">
      <Select
        v-model:value="formState.warranty_period"
        :options="warrantyPeriodList"
        placeholder="请选择质保年限"
      />
    </a-form-item>

    <a-form-item label="授权装贴店" name="authorized_Shop">
      <a-input
        v-model:value="formState.authorized_Shop"
        placeholder="请输入授权装贴店"
      />
    </a-form-item>
    <a-form-item label="装贴技师" name="mounting_Technician">
      <a-input
        v-model:value="formState.mounting_Technician"
        placeholder="请输入装贴技师"
      />
    </a-form-item>

    <a-form-item label="电子质保图片">
      <UploadImage v-model:list="imageList" multiple />
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
