import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Layout/index.vue'),
    redirect: '/clientList',
    children: [
      {
        path: '/clientList',
        name: 'ClientList',
        component: () => import('@/views/dataManager/Client/index.vue')
      },
      {
        path: '/clientAdd',
        name: 'ClientAdd',
        component: () => import('@/views/dataManager/Client/add.vue')
      },
      {
        path: '/paintProtectiveFilmList',
        name: 'PaintProtectiveFilmList',
        component: () =>
          import('@/views/dataManager/PaintProtectiveFilm/index.vue')
      },
      {
        path: '/paintProtectiveFilmAdd',
        name: 'PaintProtectiveFilmAdd',
        component: () =>
          import('@/views/dataManager/PaintProtectiveFilm/add.vue')
      },
      {
        path: '/carBrandList',
        name: 'CarBrandList',
        component: () => import('@/views/dataManager/CarBrandList/index.vue')
      },
      {
        path: '/carSeriesList',
        name: 'CarSeriesList',
        component: () => import('@/views/dataManager/CarSeries/index.vue')
      },
      {
        path: '/carSeriesPriceList',
        name: 'CarSeriesPriceList',
        component: () => import('@/views/dataManager/CarSeriesPrice/index.vue')
      },
      {
        path: '/carSeriesPriceAdd',
        name: 'CarSeriesPriceAdd',
        component: () => import('@/views/dataManager/CarSeriesPrice/add.vue')
      },
      {
        path: '/service',
        name: 'Service',
        component: () => import('@/views/pageManager/Service/index.vue')
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('@/views/pageManager/About/index.vue')
      },
      {
        path: '/join',
        name: 'Join',
        component: () => import('@/views/pageManager/Join/index.vue')
      },
      {
        path: '/website',
        name: 'Website',
        component: () => import('@/views/pageManager/Website/index.vue')
      },
      {
        path: '/adminList',
        name: 'AdminList',
        component: () => import('@/views/authorityManager/Admin/index.vue')
      },
      {
        path: '/adminAdd',
        name: 'AdminAdd',
        component: () => import('@/views/authorityManager/Admin/add.vue')
      },
      {
        path: '/roleList',
        name: 'RoleList',
        component: () => import('@/views/authorityManager/Role/index.vue')
      },
      {
        path: '/roleAdd',
        name: 'RoleAdd',
        component: () => import('@/views/authorityManager/Role/add.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/index.vue')
  },
  {
    path: '/:pathMatch(.*)',
    name: 'Error',
    component: () => import('@/views/Error.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login') {
    if (token) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
