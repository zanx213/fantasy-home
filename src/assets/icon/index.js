import {
  ProfileOutlined,
  SettingOutlined,
  TableOutlined,
  FormOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'

const icons = {
  ProfileOutlined,
  SettingOutlined,
  TableOutlined,
  FormOutlined,
  DeleteOutlined
}

export function setupAntdIcon(app) {
  Object.keys(icons).forEach(key => {
    app.component(key, icons[key])
  })
}
