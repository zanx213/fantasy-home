export const getImageUrl = name => {
  return new URL(`/src/assets/svg/${name}.svg`, import.meta.url).href
}
const menuList = [
  {
    key: 'Data',
    name: '数据管理',
    icon: 'TableOutlined',
    children: [
      {
        key: 'ClientList',
        name: '质保客户列表'
      },
      {
        key: 'PaintProtectiveFilmList',
        name: '保护膜列表'
      },
      {
        key: 'CarBrandList',
        name: '车辆品牌列表'
      },
      {
        key: 'CarSeriesList',
        name: '车系列表'
      },
      {
        key: 'CarSeriesPriceList',
        name: '车系价格列表'
      }
    ]
  },
  {
    key: 'Page',
    name: '页面管理',
    icon: 'ProfileOutlined',
    children: [
      {
        key: 'Service',
        name: '服务'
      },
      {
        key: 'About',
        name: '关于品牌'
      },
      {
        key: 'Join',
        name: '加盟咨询'
      },
      {
        key: 'Website',
        name: '官网配置'
      }
    ]
  },
  {
    key: 'Authority',
    name: '权限管理',
    icon: 'SettingOutlined',
    children: [
      {
        key: 'AdminList',
        name: '管理员列表'
      },
      {
        key: 'RoleManager',
        name: '角色管理'
      },
      {
        key: 'AuthorityManager',
        name: '权限管理'
      }
    ]
  }
]

export default menuList
