import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home/Home')
    },
    {
      path: '/introduction',
      name: 'Introduction',
      component: () => import('@/views/Home/Introduction')
    },
    {
      path: '/renderCycle',
      name: 'RenderCycle',
      component: () => import('@/views/Home/RenderCycle')
    },
    {
      path: '/orbitControls',
      name: 'OrbitControls',
      component: () => import('@/views/Home/OrbitControls')
    },
    {
      path: '/mesh',
      name: 'Mesh',
      component: () => import('@/views/Home/Mesh')
    },
    {
      path: '/material',
      name: 'Material',
      component: () => import('@/views/Home/Material')
    },
    {
      path: '/light',
      name: 'Light',
      component: () => import('@/views/Home/Light')
    },
    {
      path: '/peak',
      name: 'Peak',
      component: () => import('@/views/Peak/Peak')
    },
    {
      path: '/pointLineMesh',
      name: 'PointLineMesh',
      component: () => import('@/views/PointLineMesh/PointLineMesh')
    },
    {
      path: '/group',
      name: 'Group',
      component: () => import('@/views/Group/Group')
    },
    {
      path: '/map',
      name: 'Map',
      component: () => import('@/views/Map/Map')
    }
  ]
})
