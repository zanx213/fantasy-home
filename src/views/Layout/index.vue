<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import menus from './lib/menu'

import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  RedoOutlined,
  DownOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import api from '@/request/api'

const router = useRouter()

const userMenus = ref([])
const users = ref(null)
const collapsed = ref(false) // 折叠菜单
const selectedKeys = ref(['ClientList']) // 选中的菜单
const openKeys = ref(['Data']) // 打开的菜单

// SubMenu 展开/关闭
const onOpenChange = keys => {
  const key = keys[keys.length - 1]
  openKeys.value = key ? [key] : []
}

// 点击子菜单
const handleMenuItem = ({ item, key, keyPath }) => {
  router.push({ name: key })
}

const handleRefresh = () => {
  router.go(0)
  message.success('刷新成功')
}

const setCache = () => {
  const menu = {
    selectedKeys: selectedKeys.value,
    openKeys: openKeys.value
  }
  localStorage.setItem('selected_menu', JSON.stringify(menu))
}

// 获取菜单缓存
const getCache = () => {
  const menu = localStorage.getItem('selected_menu')
  const user = localStorage.getItem('user')
  if (menu) {
    const _menu = JSON.parse(menu)
    selectedKeys.value = _menu.selectedKeys
    openKeys.value = _menu.openKeys
  }
  if (user) {
    users.value = JSON.parse(user)
  }
}

const onMenuClick = ({ key }) => {
  if (key === 'logout') {
    localStorage.clear()
    router.push('/login')
  }
}

const getAuthMenu = () => {
  api.common.getAuthMenu().then(res => {
    const data = res.data.reverse() // 后端返回的菜单数据
    const _menus = [] // 前端菜单
    menus.forEach(({ children, ...args }) => {
      _menus.push(args)
      if (Array.isArray(children) && children.length > 0) {
        children.forEach(child => _menus.push(child))
      }
    })

    const newArr = []
    data.forEach(({ name, all_children }) => {
      let obj = null
      const _children = []
      const idx = _menus.findIndex(v => v.name === name)
      if (idx > -1) {
        obj = _menus[idx]
        if (Array.isArray(all_children) && all_children.length > 0) {
          all_children.forEach(item => {
            const idx2 = _menus.findIndex(v => v.name === item.name)
            if (idx2 > -1) {
              _children.push(_menus[idx2])
            }
          })
          obj.children = _children
        }
        newArr.push(obj)
      }
    })

    userMenus.value = newArr
  })
}

onMounted(() => {
  getCache()
  getAuthMenu()
})

window.addEventListener('beforeunload', () => setCache())
</script>

<template>
  <a-layout class="layout">
    <a-layout-sider
      class="layout-slide"
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
    >
      <div class="logo">
        <img class="img" src="../../assets/logo.png" />
      </div>

      <!-- 菜单导航 -->
      <a-menu
        v-model:selectedKeys="selectedKeys"
        v-model:openKeys="openKeys"
        theme="dark"
        mode="inline"
        @click="handleMenuItem"
        @openChange="onOpenChange"
      >
        <a-sub-menu v-for="menu in userMenus" :key="menu.key">
          <template #title>
            <span class="sub-menu-title">
              <Component :is="menu.icon" />
              <span>{{ menu.name }}</span>
            </span>
          </template>
          <a-menu-item v-for="menuItem in menu.children" :key="menuItem.key">
            {{ menuItem.name }}
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>

    <a-layout class="layout-right">
      <a-layout-header class="header">
        <div class="header-left">
          <!-- 展开/收起 -->
          <MenuUnfoldOutlined
            v-if="collapsed"
            @click="() => (collapsed = !collapsed)"
          />
          <MenuFoldOutlined v-else @click="() => (collapsed = !collapsed)" />

          <a-tooltip placement="bottom">
            <template #title>
              <span>刷新页面</span>
            </template>
            <RedoOutlined class="refresh" @click="handleRefresh" />
          </a-tooltip>
        </div>

        <div class="header-title">膜幻之家管理系统</div>
        <div class="header-user">
          <a-dropdown placement="bottomRight">
            <span>
              {{ users ? users.name : 'admin' }}
              <DownOutlined />
            </span>
            <template #overlay>
              <a-menu @click="onMenuClick">
                <a-menu-item key="logout">退出登录</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style lang="scss" scoped>
.layout {
  height: 100%;
  &-slide {
    .logo {
      margin: 8px;
      color: #fff;
      text-align: center;
      .img {
        height: 40px;
      }
    }

    .sub-menu-title {
      @include flexbox($jc: flex-start);
      .menu-icon {
        height: 20px;
        margin-right: 8px;
      }
    }
  }
  &-right {
    .header {
      @include flexbox($jc: space-between);
      padding: 0 24px;
      background-color: #fff;
      &-left {
        > span {
          font-size: 18px;
        }
        .refresh {
          margin-left: 20px;
          transform: rotate(-90edg);
        }
      }
      &-title {
        flex: 1;
        padding-left: 50px;
        font-size: 30px;
        font-weight: 500;
        background-image: linear-gradient(35deg, #8dbeff, #6cacff);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .content {
      display: flex;
      flex-direction: column;
      margin: 16px 0 0 16px;
      padding: 24px;
      background-color: #fff;
      overflow: auto;
      :deep(.ant-table-wrapper) {
        flex: 1;
        overflow: hidden;
      }
    }
  }
}
</style>
