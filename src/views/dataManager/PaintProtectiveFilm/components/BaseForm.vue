<script setup>
import { ref, reactive, toRaw, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { RollbackOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { UploadImage, Select } from '@/components'
import { thicknessList } from '../lib'
import api from '@/request/api'
import { deepClone } from '@/utils'

const props = defineProps({
  id: [Number, String]
})

const router = useRouter()
const formRef = ref()
const labelCol = { style: { width: '150px' } }
const wrapperCol = { span: 10 }

// 自定义校验图片上传
let checkImage = async (rule, value) => {
  if (Array.isArray(value) && value.length === 0) {
    return Promise.reject('请上传图标')
  } else {
    return Promise.resolve()
  }
}

const formState = reactive({
  name: '',
  image: [],
  thickness: undefined,
  material: '',
  coating: '',
  glue_layer: '',
  features: '',
  warranty: '',
  sort: 0,
  status: 0
})
const rules = {
  image: [
    {
      required: true,
      trigger: 'change',
      validator: checkImage
    }
  ],
  name: [
    {
      required: true,
      message: '请输入产品名称',
      trigger: 'blur'
    }
  ],
  thickness: [
    {
      required: true,
      message: '请选择产品厚度',
      trigger: 'change'
    }
  ],
  material: [
    {
      required: true,
      message: '请输入材料',
      trigger: 'blur'
    }
  ],
  coating: [
    {
      required: true,
      message: '请输入涂层',
      trigger: 'blur'
    }
  ],
  glue_layer: [
    {
      required: true,
      message: '请输入胶水层',
      trigger: 'blur'
    }
  ],
  features: [
    {
      required: true,
      message: '请输入产品特点',
      trigger: 'blur'
    }
  ],
  warranty: [
    {
      required: true,
      message: '请输入质保',
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
  ],
  glue_layer: [
    {
      required: true,
      message: '请输入胶水层',
      trigger: 'blur'
    }
  ]
}

onMounted(() => {
  if (props.id) {
    getProtectiveFilmInfo()
  }
})

const getProtectiveFilmInfo = () => {
  api.paint.getProtectiveFilmInfo({ id: props.id }).then(res => {
    if (res.code !== 0) return message.error(res.msg)
    const data = res.data
    formState.name = data.name
    formState.image = [
      {
        uid: data.id,
        status: 'done',
        thumbUrl: data.image,
        preview: data.image,
        response: {
          data: data.image
        }
      }
    ]
    formState.thickness = data.thickness
    formState.material = data.material
    formState.coating = data.coating
    formState.glue_layer = data.glue_layer
    formState.features = data.features
    formState.warranty = data.warranty
    formState.sort = data.sort
    formState.status = data.status
  })
}

const protectiveFilmUpdate = () => {
  const params = deepClone(toRaw(formState))
  params.image = params.image[0].response.data
  if (props.id) params.id = props.id
  api.paint.protectiveFilmUpdate(params).then(res => {
    if (res.code === 0) {
      message.success('操作成功')
      goBack()
    } else {
      message.error(res.msg)
    }
  })
}

const onSubmit = () => {
  if (formState.image.length === 0) return message.error('请上传图片')
  formRef.value.validate().then(() => {
    protectiveFilmUpdate()
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
  <div class="form-title">{{ `${props.id ? '修改' : '新增'}保护膜` }}</div>
  <a-form
    ref="formRef"
    :model="formState"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-item label="图片" required>
      <UploadImage v-model:list="formState.image" />
    </a-form-item>
    <a-form-item label="产品名称(系列-型号)" name="name">
      <a-input v-model:value="formState.name" placeholder="请输入产品名称" />
    </a-form-item>
    <a-form-item label="产品厚度" name="thickness">
      <Select
        v-model:value="formState.thickness"
        :options="thicknessList"
        placeholder="请选择产品厚度"
      />
    </a-form-item>
    <a-form-item label="材料" name="material">
      <a-input v-model:value="formState.material" placeholder="请输入材料" />
    </a-form-item>
    <a-form-item label="涂层" name="coating">
      <a-input v-model:value="formState.coating" placeholder="请输入涂层" />
    </a-form-item>
    <a-form-item label="胶水层" name="glue_layer">
      <a-input
        v-model:value="formState.glue_layer"
        placeholder="请输入胶水层"
      />
    </a-form-item>
    <a-form-item label="产品特点" name="features">
      <a-input
        v-model:value="formState.features"
        placeholder="请输入产品特点"
      />
    </a-form-item>
    <a-form-item label="质保" name="warranty">
      <a-input v-model:value="formState.warranty" placeholder="请输入质保" />
    </a-form-item>
    <a-form-item label="顺序" name="sort">
      <a-input v-model:value.number="formState.sort" placeholder="请输入顺序" />
    </a-form-item>
    <a-form-item label="是否启用" name="status">
      <a-radio-group v-model:value="formState.status">
        <a-radio :value="0">启用</a-radio>
        <a-radio :value="1">不启用</a-radio>
      </a-radio-group>
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
