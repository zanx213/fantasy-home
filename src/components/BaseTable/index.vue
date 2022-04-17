<script>
import {
  defineComponent,
  createVNode,
  useSlots,
  reactive,
  watchEffect
} from 'vue'
import { Table } from 'ant-design-vue'
import 'ant-design-vue/lib/table/style/index.css'
import 'ant-design-vue/lib/pagination/style/index.css'
import 'ant-design-vue/lib/select/style/index.css'

export default defineComponent({
  props: {
    dataSource: Array,
    columns: Array,
    total: Number,
    rowKey: {
      type: String,
      default: 'id'
    },
    pagination: {
      type: Boolean,
      default: true
    }
  },
  emits: ['change'],
  setup(props, { emit }) {
    const slots = useSlots()

    // 页码变化
    const onPageChange = page => {
      pagination.current = page
    }

    // pageSize 变化
    const onShowSizeChange = (_, pageSize) => {
      pagination.current = 1
      pagination.pageSize = pageSize
    }

    // 分页
    const pagination = reactive({
      current: 1,
      pageSize: 20,
      showSizeChanger: true,
      total: props.total,
      pageSizeOptions: ['10', '20', '30', '50', '100'],
      showTotal: total => `共 ${total} 条数据`,
      onChange: onPageChange,
      onShowSizeChange: onShowSizeChange
    })

    watchEffect(() => {
      emit('change', {
        current: pagination.current,
        pageSize: pagination.pageSize
      })
    })

    return () =>
      createVNode(
        Table,
        {
          dataSource: props.dataSource,
          columns: props.columns,
          pagination: props.pagination ? pagination : false,
          rowKey: props.rowKey
        },
        slots
      )
  }
})
</script>
