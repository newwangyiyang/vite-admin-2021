import Layout from '@/layout/index.vue';
/**
 * 定义静态路由
 * @description 前端控制直接改 dynamicRoutes 中的路由，后端控制不需要修改，请求接口路由数据时，会覆盖 dynamicRoutes 第一个顶级 children 的内容（全屏，不包含 layout 中的路由出口）
 * @returns 返回路由菜单数据
 */
export default [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/index.vue'),
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404.vue'),
  },
  {
    path: '/500',
    name: '500',
    component: Layout,
    hidden: true,
    redirect: '/500/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/500.vue'),
      },
    ],
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/Redirect/index.vue'),
      },
    ],
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard/index.vue'),
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true },
      },
    ],
  },
  {
    path: '/form',
    component: Layout,
    redirect: '/form/index',
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/Form/index.vue'),
        meta: { title: 'Form', icon: 'form', affix: false },
      },
    ],
  },
  {
    path: '/table',
    component: Layout,
    redirect: '/table/index',
    children: [
      {
        path: 'index',
        name: 'Table',
        component: () => import('@/views/Table/index.vue'),
        meta: { title: 'Table', icon: 'table', affix: false },
      },
    ],
  },
  {
    path: '/directive',
    component: Layout,
    redirect: '/directive/index',
    children: [
      {
        path: 'index',
        name: 'Directive',
        component: () => import('@/views/Directive/index.vue'),
        meta: { title: 'Directive', icon: 'tree', affix: false, noCache: true },
      },
    ],
  },
  {
    path: '/request',
    component: Layout,
    redirect: '/request/index',
    children: [
      {
        path: 'index',
        name: 'Request',
        component: () => import('@/views/Request/index.vue'),
        meta: { title: 'Request', icon: 'example', affix: false, noCache: true },
      },
    ],
  },
  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested',
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/Nested/Menu1/index.vue'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/Nested/Menu1/menu1-1.vue'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' },
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/Nested/Menu1/Menu1-2/index.vue'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/Nested/Menu1/Menu1-2/menu1-2-1.vue'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' },
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/Nested/Menu1/Menu1-2/menu1-2-2.vue'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' },
              },
            ],
          },
        ],
      },
      {
        path: 'menu2',
        component: () => import('@/views/Nested/Menu2/index.vue'),
        name: 'Menu2',
        meta: { title: 'menu2' },
      },
    ],
  },
];
