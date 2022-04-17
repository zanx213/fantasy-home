<script setup>
import { ref, reactive, toRaw, onMounted, watch } from 'vue'
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

const brandList = ref([])
const protectiveFilmList = ref([])
const carSeryList = ref([])

const formState = reactive({
  brand_id: undefined,
  protective_film_id: undefined,
  car_sery_id: undefined,
  total_amount: undefined,
  cover_amount: undefined,
  right_forward_fender_amount: undefined,
  right_skirt_amount: undefined,
  right_combination_amount: undefined,
  right_back_combination_amount: undefined,
  roof_amount: undefined,
  back_cover_amount: undefined,
  rear_bumper_amount: undefined,
  left_back_combination_amount: undefined,
  left_combination_amount: undefined,
  left_skirt_amount: undefined,
  rearview_mirror_amount: undefined,
  left_forward_fender_amount: undefined,
  front_bumper_amount: undefined
})
const rules = {
  brand_id: [
    {
      required: true,
      type: 'number',
      message: '车辆品牌',
      trigger: 'blur'
    }
  ],
  protective_film_id: [
    {
      required: true,
      type: 'number',
      message: '车膜系列',
      trigger: 'change'
    }
  ],
  car_sery_id: [
    {
      required: true,
      type: 'number',
      message: '车系(车辆)名称',
      trigger: 'blur'
    }
  ],
  total_amount: [
    {
      required: true,
      message: '整车价格',
      trigger: 'blur'
    }
  ],
  cover_amount: [
    {
      required: true,
      message: '机盖',
      trigger: 'blur'
    }
  ],
  right_forward_fender_amount: [
    {
      required: true,
      message: '右前叶子板',
      trigger: 'blur'
    }
  ],
  right_skirt_amount: [
    {
      required: true,
      message: '右侧裙',
      trigger: 'blur'
    }
  ],
  right_combination_amount: [
    {
      required: true,
      message: '右门组合',
      trigger: 'blur'
    }
  ],
  right_back_combination_amount: [
    {
      required: true,
      message: '右后叶子板',
      trigger: 'change'
    }
  ],
  roof_amount: [
    {
      required: true,
      message: '车顶',
      trigger: 'blur'
    }
  ],
  back_cover_amount: [
    {
      required: true,
      message: '后盖套装',
      trigger: 'blur'
    }
  ],
  rear_bumper_amount: [
    {
      required: true,
      message: '后杠',
      trigger: 'blur'
    }
  ],
  left_back_combination_amount: [
    {
      required: true,
      message: '左后叶子板',
      trigger: 'blur'
    }
  ],
  left_combination_amount: [
    {
      required: true,
      message: '左门组合',
      trigger: 'blur'
    }
  ],
  left_skirt_amount: [
    {
      required: true,
      message: '左侧裙',
      trigger: 'blur'
    }
  ],
  rearview_mirror_amount: [
    {
      required: true,
      message: '后视镜',
      trigger: 'blur'
    }
  ],
  left_forward_fender_amount: [
    {
      required: true,
      message: '左前叶子板',
      trigger: 'blur'
    }
  ],
  front_bumper_amount: [
    {
      required: true,
      message: '前杠',
      trigger: 'blur'
    }
  ]
}

onMounted(() => {
  getBrandList()
  getProtectiveFilmList()
  if (props.id) {
    getCarSeriesPriceInfo()
  }
})

watch(
  () => formState.brand_id,
  val => {
    if (val) {
      getCarSeryListList()
    } else {
      carSeryList.value = []
    }
  }
)

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
const getCarSeryListList = () => {
  api.common
    .getCarSeryListList({
      brand_id: formState.brand_id
    })
    .then(res => {
      if (res.code !== 0) return message.error(res.msg)
      carSeryList.value = res.data
    })
}

const getCarSeriesPriceInfo = () => {
  api.carSeriesPrice.getCarSeriesPriceInfo({ id: props.id }).then(res => {
    if (res.code !== 0) return message.error(res.msg)
    const data = res.data
    formState.brand_id = data.brand_id
    formState.protective_film_id = data.protective_film_id
    formState.car_sery_id = data.car_sery_id
    formState.total_amount = data.total_amount
    formState.cover_amount = data.cover_amount
    formState.right_forward_fender_amount = data.right_forward_fender_amount
    formState.right_skirt_amount = data.right_skirt_amount
    formState.right_combination_amount = data.right_combination_amount
    formState.right_back_combination_amount = data.right_back_combination_amount
    formState.roof_amount = data.roof_amount
    formState.back_cover_amount = data.back_cover_amount
    formState.rear_bumper_amount = data.rear_bumper_amount
    formState.left_back_combination_amount = data.left_back_combination_amount
    formState.left_combination_amount = data.left_combination_amount
    formState.left_skirt_amount = data.left_skirt_amount
    formState.rearview_mirror_amount = data.rearview_mirror_amount
    formState.left_forward_fender_amount = data.left_forward_fender_amount
    formState.front_bumper_amount = data.front_bumper_amount
  })
}

const update = () => {
  const params = deepClone(toRaw(formState))
  if (props.id) params.id = props.id
  api.carSeriesPrice.carSeriesPriceUpdate(params).then(res => {
    if (res.code === 0) {
      message.success('操作成功')
      goBack()
    } else {
      message.error(res.msg)
    }
  })
}

const onSubmit = () => {
  formRef.value.validate().then(() => {
    update()
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
  <div class="form-title">{{ `${props.id ? '修改' : '新增'}车系价格` }}</div>
  <a-form
    ref="formRef"
    :model="formState"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-item label="车辆品牌" name="brand_id">
      <Select
        v-model:value="formState.brand_id"
        :options="brandList"
        placeholder="请选择车辆品牌"
        label="name"
        val="id"
      />
    </a-form-item>
    <a-form-item label="车膜系列" name="protective_film_id">
      <Select
        v-model:value="formState.protective_film_id"
        :options="protectiveFilmList"
        placeholder="请选择车膜系列"
        label="name"
        val="id"
      />
    </a-form-item>
    <a-form-item label="车系(车辆)名称" name="car_sery_id">
      <Select
        v-model:value="formState.car_sery_id"
        :options="carSeryList"
        placeholder="请选择车系(车辆)名称"
        label="name"
        val="id"
      />
    </a-form-item>

    <a-form-item label="整车价格" name="total_amount">
      <a-input
        v-model:value="formState.total_amount"
        placeholder="请输入整车价格"
      />
    </a-form-item>
    <a-form-item label="机盖" name="cover_amount">
      <a-input
        v-model:value="formState.cover_amount"
        placeholder="请输入机盖"
      />
    </a-form-item>
    <a-form-item label="右前叶子板" name="right_forward_fender_amount">
      <a-input
        v-model:value="formState.right_forward_fender_amount"
        placeholder="请输入右前叶子板"
      />
    </a-form-item>
    <a-form-item label="右侧裙" name="right_skirt_amount">
      <a-input
        v-model:value="formState.right_skirt_amount"
        placeholder="请输入右侧裙"
      />
    </a-form-item>
    <a-form-item label="右门组合" name="right_combination_amount">
      <a-input
        v-model:value="formState.right_combination_amount"
        placeholder="请输入右门组合"
      />
    </a-form-item>
    <a-form-item label="右后叶子板" name="right_back_combination_amount">
      <a-input
        v-model:value="formState.right_back_combination_amount"
        placeholder="请输入右后叶子板"
      />
    </a-form-item>
    <a-form-item label="车顶" name="roof_amount">
      <a-input v-model:value="formState.roof_amount" placeholder="请输入车顶" />
    </a-form-item>
    <a-form-item label="后盖套装" name="back_cover_amount">
      <a-input
        v-model:value="formState.back_cover_amount"
        placeholder="请输入后盖套装"
      />
    </a-form-item>
    <a-form-item label="后杠" name="rear_bumper_amount">
      <a-input
        v-model:value="formState.rear_bumper_amount"
        placeholder="请输入后杠"
      />
    </a-form-item>
    <a-form-item label="左后叶子板" name="left_back_combination_amount">
      <a-input
        v-model:value="formState.left_back_combination_amount"
        placeholder="请输入左后叶子板"
      />
    </a-form-item>
    <a-form-item label="左门组合" name="left_combination_amount">
      <a-input
        v-model:value="formState.left_combination_amount"
        placeholder="请输入左门组合"
      />
    </a-form-item>
    <a-form-item label="左侧裙" name="left_skirt_amount">
      <a-input
        v-model:value="formState.left_skirt_amount"
        placeholder="请输入左侧裙"
      />
    </a-form-item>
    <a-form-item label="后视镜" name="rearview_mirror_amount">
      <a-input
        v-model:value="formState.rearview_mirror_amount"
        placeholder="请输入后视镜"
      />
    </a-form-item>
    <a-form-item label="左前叶子板" name="left_forward_fender_amount">
      <a-input
        v-model:value="formState.left_forward_fender_amount"
        placeholder="请输入左前叶子板"
      />
    </a-form-item>
    <a-form-item label="前杠" name="front_bumper_amount">
      <a-input
        v-model:value="formState.front_bumper_amount"
        placeholder="请输入前杠"
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
